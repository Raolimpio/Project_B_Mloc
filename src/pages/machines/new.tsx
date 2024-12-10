import { Header } from '../../components/layout/header';
import { MachineForm } from '../../components/forms/MachineForm';
import { Breadcrumb } from '../../components/ui/breadcrumb';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { IMaquina } from '../../types/machine.types';

export default function NewMachinePage() {
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Nova Máquina' }
  ];

  const handleSubmit = async (data: IMaquina) => {
    try {
      // Remover o id antes de salvar no Firestore
      const { id, ...machineData } = data;
      const docRef = await addDoc(collection(db, 'machines'), machineData);
      console.log('Máquina cadastrada com sucesso:', docRef.id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar máquina:', error);
    }
  };

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

          <MachineForm onSubmit={handleSubmit} />
        </div>
      </main>
    </>
  );
}
