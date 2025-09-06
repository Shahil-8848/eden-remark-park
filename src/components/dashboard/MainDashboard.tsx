import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import Sidebar from './Sidebar';
import StudentList from './StudentList';
import RemarksModal from './RemarksModal';
import DashboardOverview from './DashboardOverview';

const MainDashboard = () => {
  const { profile, signOut } = useAuth();
  const { students, classes, loading, addRemark, getStudentsByClass } = useStudents();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClassSelect = (classNumber: number) => {
    setSelectedClass(classNumber);
  };

  const handleDashboardSelect = () => {
    setSelectedClass(null);
  };

  const handleAddRemark = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSubmitRemark = async (studentId: string, rating: number, tags: string[], notes: string) => {
    await addRemark(studentId, rating, tags, notes);
    setIsModalOpen(false);
  };

  const getCurrentStudents = () => {
    if (!selectedClass) return [];
    return getStudentsByClass(selectedClass);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        selectedClass={selectedClass}
        onClassSelect={handleClassSelect}
        onDashboardSelect={handleDashboardSelect}
        profile={profile}
        onSignOut={signOut}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {selectedClass ? (
            <StudentList
              classNumber={selectedClass}
              students={getCurrentStudents()}
              onAddRemark={handleAddRemark}
              userRole={profile?.role || 'teacher'}
            />
          ) : (
            <DashboardOverview 
              students={students}
              classes={classes}
              userRole={profile?.role || 'teacher'}
            />
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