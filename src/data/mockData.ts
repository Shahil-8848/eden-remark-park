import { Student, Teacher, Class } from '@/types';

export const mockTeacher: Teacher = {
  id: '1',
  name: 'Mrs. Sarah Johnson',
  role: 'teacher',
  classes: [5, 6, 7]
};

export const generateMockStudents = (classNumber: number): Student[] => {
  const sections = ['A', 'B'];
  const students: Student[] = [];
  
  sections.forEach(section => {
    for (let i = 1; i <= 15; i++) {
      const studentId = `${classNumber}-${section}-${i}`;
      const rollNumber = `${classNumber}${section}${String(i).padStart(2, '0')}`;
      
      students.push({
        id: studentId,
        name: `Student ${rollNumber}`,
        rollNumber,
        class: classNumber,
        section,
        remarks: [],
        averageRating: 0
      });
    }
  });
  
  return students;
};

export const mockClasses: Class[] = Array.from({ length: 10 }, (_, i) => ({
  number: i + 1,
  sections: ['A', 'B'],
  students: generateMockStudents(i + 1)
}));