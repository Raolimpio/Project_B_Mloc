import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresCompany?: boolean;
}

export function ProtectedRoute({ children, requiresCompany = false }: ProtectedRouteProps) {
  const { userProfile, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-4 text-blue-600 hover:underline"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresCompany && userProfile.type !== 'company') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}