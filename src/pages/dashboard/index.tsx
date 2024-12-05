import { Header } from '@/components/layout/header';
import { DashboardFooter } from '@/components/layout/dashboard-footer';
import { useAuth } from '@/contexts/auth-context';
import { RenterDashboard } from '@/components/dashboard/renter-dashboard';
import { OwnerDashboard } from '@/components/dashboard/owner-dashboard';

export default function DashboardPage() {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          </div>
        </main>
        <DashboardFooter />
      </>
    );
  }

  if (!userProfile) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Perfil não encontrado. Por favor, faça login novamente.</p>
          </div>
        </main>
        <DashboardFooter />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {userProfile.type === 'individual' ? (
            <RenterDashboard user={userProfile} />
          ) : (
            <OwnerDashboard user={userProfile} />
          )}
        </div>
      </main>
      <DashboardFooter />
    </div>
  );
}