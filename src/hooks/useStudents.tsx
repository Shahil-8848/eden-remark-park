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
      fetchClasses();
      fetchStudents();
      if (profile.role === 'teacher') {
        fetchAssignedClasses();
      }
    }
  }, [user, profile]);

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
    
    const { data, error } = await supabase
      .from('teacher_classes')
      .select(`
        classes (*)
      `)
      .eq('teacher_id', user.id);

    if (error) {
      console.error('Error fetching assigned classes:', error);
    } else {
      const assignedClassesData = data?.map((item: any) => item.classes).filter(Boolean) || [];
      setAssignedClasses(assignedClassesData);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
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
    if (profile?.role === 'teacher' && assignedClasses.length > 0) {
      const assignedClassIds = assignedClasses.map(cls => cls.id);
      query = query.in('class_id', assignedClassIds);
    }

    query = query.order('name');

    const { data, error } = await query;

    if (error) {
      toast.error('Failed to fetch students');
      console.error('Error fetching students:', error);
    } else {
      const studentsWithAverage = (data || []).map(student => ({
        ...student,
        averageRating: student.remarks.length > 0 
          ? student.remarks.reduce((acc: number, remark: any) => acc + remark.rating, 0) / student.remarks.length
          : 0
      }));
      setStudents(studentsWithAverage);
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