import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'super_admin' | 'admin_plataforma' | 'admin_empresa' | 'usuario_empresa';
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRole && profile?.papel !== requiredRole) {
    // Check if user has sufficient permissions
    const roleHierarchy = {
      'super_admin': 4,
      'admin_plataforma': 3,
      'admin_empresa': 2,
      'usuario_empresa': 1
    };

    const userLevel = roleHierarchy[profile?.papel || 'usuario_empresa'];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}