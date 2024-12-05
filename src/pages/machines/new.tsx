import { Header } from '@/components/layout/header';
import { MachineForm } from '@/components/machines/machine-form';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function NewMachinePage() {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Nova Máquina' }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Nova Máquina</h1>
            </div>
          </div>

          <MachineForm />
        </div>
      </main>
    </>
  );
}