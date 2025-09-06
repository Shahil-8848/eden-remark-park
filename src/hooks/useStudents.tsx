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
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchClasses();
      fetchStudents();
    }
  }, [user]);

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

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        classes (number, section),
        remarks (
          *,
          profiles (full_name)
        )
      `)
      .order('name');

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

  return {
    students,
    classes,
    loading,
    addRemark,
    getStudentsByClass,
    refreshStudents: fetchStudents
  };
};