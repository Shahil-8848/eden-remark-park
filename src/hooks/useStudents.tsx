import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  roll_number: string;
  class_id: string;
  created_at: string;
  classes: {
    number: number;
    section: string;
  };
  remarks: Remark[];
  averageRating: number;
}

interface Remark {
  id: string;
  student_id: string;
  teacher_id: string;
  rating: number;
  tags: string[];
  notes: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface Class {
  id: string;
  number: number;
  section: string;
  created_at: string;
}

export const useStudents = () => {
  const { user, profile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignedClasses, setAssignedClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      console.log('User and profile loaded:', { userId: user.id, role: profile.role });
      fetchClasses();
      if (profile.role === 'teacher') {
        console.log('Fetching assigned classes for teacher');
        fetchAssignedClasses();
      } else {
        fetchStudents();
      }
    }
  }, [user, profile]);

  // Separate effect for teachers to fetch students after assigned classes are loaded
  useEffect(() => {
    if (user && profile?.role === 'teacher') {
      console.log('Teacher assigned classes updated:', assignedClasses);
      // Only fetch students after we have tried to load assigned classes
      // (assignedClasses will be empty array if no assignments)
      fetchStudents();
    }
  }, [assignedClasses, user, profile]);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('number');

    if (error) {
      toast.error('Failed to fetch classes');
      console.error('Error fetching classes:', error);
    } else {
      setClasses(data || []);
    }
  };

  const fetchAssignedClasses = async () => {
    if (!user) return;
    
    console.log('Fetching assigned classes for user:', user.id);
    
    try {
      // First get the teacher_classes assignments
      const { data: teacherClassData, error: teacherClassError } = await supabase
        .from('teacher_classes')
        .select('class_id')
        .eq('teacher_id', user.id);

      if (teacherClassError) {
        console.error('Error fetching teacher classes:', teacherClassError);
        setAssignedClasses([]);
        return;
      }

      console.log('Teacher class assignments:', teacherClassData);

      if (!teacherClassData || teacherClassData.length === 0) {
        console.log('No class assignments found for teacher');
        setAssignedClasses([]);
        return;
      }

      // Get the class IDs
      const classIds = teacherClassData.map(tc => tc.class_id);
      console.log('Assigned class IDs:', classIds);

      // Then fetch the actual class data
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .in('id', classIds);

      if (classesError) {
        console.error('Error fetching classes:', classesError);
        setAssignedClasses([]);
      } else {
        console.log('Assigned classes data:', classesData);
        setAssignedClasses(classesData || []);
      }
    } catch (error) {
      console.error('Error in fetchAssignedClasses:', error);
      setAssignedClasses([]);
    }
  };

  // For teachers, only fetch students from their assigned classes after assignedClasses are loaded
  const fetchStudents = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('students')
        .select(`
          *,
          classes (number, section),
          remarks (
            *,
            profiles (full_name)
          )
        `);

      // For teachers, only fetch students from their assigned classes
      if (profile?.role === 'teacher') {
        // If no assigned classes yet, don't fetch any students
        if (assignedClasses.length === 0) {
          setStudents([]);
          setLoading(false);
          return;
        }
        const assignedClassIds = assignedClasses.map(cls => cls.id);
        query = query.in('class_id', assignedClassIds);
      }

      query = query.order('name');

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to fetch students');
        setStudents([]);
      } else {
        const studentsWithAverage = (data || []).map(student => ({
          ...student,
          averageRating: student.remarks && student.remarks.length > 0 
            ? student.remarks.reduce((acc: number, remark: any) => acc + remark.rating, 0) / student.remarks.length
            : 0
        }));
        setStudents(studentsWithAverage);
      }
    } catch (error) {
      console.error('Unexpected error fetching students:', error);
      toast.error('Failed to fetch students');
      setStudents([]);
    }
    
    setLoading(false);
  };

  const addRemark = async (studentId: string, rating: number, tags: string[], notes: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('remarks')
      .insert({
        student_id: studentId,
        teacher_id: user.id,
        rating,
        tags,
        notes
      });

    if (error) {
      toast.error('Failed to add remark');
      console.error('Error adding remark:', error);
    } else {
      toast.success('Remark added successfully');
      // Refresh students data
      fetchStudents();
    }
  };

  const getStudentsByClass = (classNumber: number) => {
    return students.filter(student => student.classes?.number === classNumber);
  };

  const getAccessibleClasses = () => {
    if (profile?.role === 'teacher') {
      return assignedClasses;
    }
    return classes;
  };

  return {
    students,
    classes,
    assignedClasses,
    loading,
    addRemark,
    getStudentsByClass,
    getAccessibleClasses,
    refreshStudents: fetchStudents
  };
};