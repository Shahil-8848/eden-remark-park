import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import AppSidebar from './Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { GraduationCap } from 'lucide-react';
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
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        {/* Global trigger in header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center bg-background border-b border-border lg:hidden">
          <SidebarTrigger className="ml-2" />
          <div className="flex items-center gap-2 ml-4">
            <div className="p-1 bg-primary/10 rounded">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">School Portal</span>
          </div>
        </header>

        {/* Sidebar */}
        <AppSidebar
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
        <main className="flex-1 overflow-auto">
          {/* Desktop trigger */}
          <div className="hidden lg:flex items-center h-12 border-b border-border px-4">
            <SidebarTrigger />
          </div>
          
          <div className="p-4 pt-16 lg:pt-4">
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
        </main>

        {/* Remarks Modal */}
        <RemarksModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitRemark}
        />
      </div>
    </SidebarProvider>
  );
};

export default MainDashboard;