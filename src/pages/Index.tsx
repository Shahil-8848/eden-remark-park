import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MainDashboard from '@/components/dashboard/MainDashboard';

const Index = () => {
  const { user, loading } = useAuth();

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

  return <MainDashboard />;
};

export default Index;
