import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MainDashboard from '@/components/dashboard/MainDashboard';
import ApprovalPending from './ApprovalPending';

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check approval status
  if (profile && profile.approval_status !== 'approved') {
    return <ApprovalPending />;
  }

  return <MainDashboard />;
};

export default Index;
