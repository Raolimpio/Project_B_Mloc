import { Header } from '@/components/layout/header';
import { ProfileEditor } from '@/components/profile/profile-editor';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useAuth } from '@/contexts/auth-context';

export default function ProfilePage() {
  const { userProfile, loading } = useAuth();

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Meu Perfil' }
  ];

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
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Meu Perfil</h1>
            </div>
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <ProfileEditor 
                userProfile={userProfile} 
                onUpdate={() => window.location.reload()}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}