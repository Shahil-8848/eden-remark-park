import { useState } from 'react';
import { Student, Remark } from '@/types';
import { mockClasses, mockTeacher } from '@/data/mockData';
import Sidebar from './Sidebar';
import StudentList from './StudentList';
import RemarksModal from './RemarksModal';
import DashboardOverview from './DashboardOverview';

const MainDashboard = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classData, setClassData] = useState(mockClasses);

  const handleClassSelect = (classNumber: number) => {
    setSelectedClass(classNumber);
  };

  const handleDashboardSelect = () => {
    setSelectedClass(null);
  };

  const handleAddRemark = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSubmitRemark = (studentId: string, rating: number, tags: string[], notes: string) => {
    const newRemark: Remark = {
      id: Date.now().toString(),
      teacherId: mockTeacher.id,
      teacherName: mockTeacher.name,
      rating,
      tags,
      notes,
      date: new Date(),
      isFromHigherAdmin: false
    };

    setClassData(prevClasses =>
      prevClasses.map(cls => ({
        ...cls,
        students: cls.students.map(student =>
          student.id === studentId
            ? {
                ...student,
                remarks: [...student.remarks, newRemark],
                averageRating: [...student.remarks, newRemark].reduce((acc, remark) => acc + remark.rating, 0) / [...student.remarks, newRemark].length
              }
            : student
        )
      }))
    );
  };

  const getCurrentStudents = () => {
    if (!selectedClass) return [];
    const currentClass = classData.find(cls => cls.number === selectedClass);
    return currentClass ? currentClass.students : [];
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        selectedClass={selectedClass}
        onClassSelect={handleClassSelect}
        onDashboardSelect={handleDashboardSelect}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {selectedClass ? (
            <StudentList
              classNumber={selectedClass}
              students={getCurrentStudents()}
              onAddRemark={handleAddRemark}
            />
          ) : (
            <DashboardOverview />
          )}
        </div>
      </div>

      {/* Remarks Modal */}
      <RemarksModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitRemark}
      />
    </div>
  );
};

export default MainDashboard;