import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import Sidebar from './Sidebar';
import StudentList from './StudentList';
import RemarksModal from './RemarksModal';
import DashboardOverview from './DashboardOverview';
import TeacherDashboard from './TeacherDashboard';
import UserManagement from './UserManagement';
import TeacherAssignment from './TeacherAssignment';

const MainDashboard = () => {
  const { profile, signOut } = useAuth();
  const { students, classes, loading, addRemark, getStudentsByClass, getAccessibleClasses } = useStudents();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClassSelect = (classNumber: number) => {
    setSelectedClass(classNumber);
  };

  const handleDashboardSelect = () => {
    setSelectedClass(null);
    setSelectedView(null);
  };

  const handleViewSelect = (view: string) => {
    setSelectedClass(null);
    setSelectedView(view);
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
        selectedView={selectedView}
        onClassSelect={handleClassSelect}
        onDashboardSelect={handleDashboardSelect}
        onViewSelect={handleViewSelect}
        profile={profile}
        onSignOut={signOut}
        accessibleClasses={getAccessibleClasses()}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {selectedView === 'user-management' ? (
            <UserManagement />
          ) : selectedView === 'teacher-assignment' ? (
            <TeacherAssignment />
          ) : selectedClass ? (
            <StudentList
              classNumber={selectedClass}
              students={getCurrentStudents()}
              onAddRemark={handleAddRemark}
              userRole={profile?.role || 'teacher'}
            />
          ) : (
            // Only show dashboard overview for admin/principal
            (profile?.role === 'admin' || profile?.role === 'principal') ? (
              <DashboardOverview 
                students={students}
                classes={classes}
                userRole={profile?.role || 'teacher'}
              />
            ) : (
              // For teachers, show a simplified view or redirect to first class
              <TeacherDashboard 
                students={students}
                classes={getAccessibleClasses()}
                userRole={profile?.role || 'teacher'}
                onClassSelect={handleClassSelect}
              />
            )
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