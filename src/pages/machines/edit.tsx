import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/header';
import { MachineForm } from '../../components/forms/MachineForm';
import { Breadcrumb } from '../../components/ui/breadcrumb';
import { Button } from '../../components/ui/button';
import { Feedback } from '../../components/ui/feedback';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth-context';
import type { IMaquina } from '../../types/machine.types';

export default function EditMachinePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [machine, setMachine] = useState<IMaquina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMachine() {
      if (!id || !userProfile) return;

      try {
        const docRef = doc(db, 'machines', id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          setError('Máquina não encontrada');
          return;
        }

        const machineData = { id: docSnap.id, ...docSnap.data() } as IMaquina;
        
        // Verificar se o usuário é o proprietário da máquina
        if (machineData.proprietarioId !== userProfile.uid) {
          console.log('Permissão negada:', {
            machineOwner: machineData.proprietarioId,
            currentUser: userProfile.uid
          });
          setError('Você não tem permissão para editar esta máquina');
          return;
        }
        
        setMachine(machineData);
      } catch (error) {
        console.error('Erro ao carregar máquina:', error);
        setError('Erro ao carregar dados da máquina');
      } finally {
        setLoading(false);
      }
    }

    loadMachine();
  }, [id, userProfile]);

  const handleSubmit = async (data: IMaquina) => {
    try {
      if (!id) return;

      // Remover o id antes de atualizar
      const { id: machineId, ...updateData } = data;
      
      await updateDoc(doc(db, 'machines', id), updateData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao atualizar máquina:', error);
      setError('Erro ao salvar alterações');
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Máquinas', href: '/dashboard?view=machines' },
    { label: machine?.nome || 'Editar Máquina' }
  ];

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Carregando...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <Feedback type="error" message={error} />
            <Button
              onClick={() => navigate('/dashboard')}
              className="mt-4"
            >
              Voltar para Dashboard
            </Button>
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
              <h1 className="text-2xl font-bold">
                Editar {machine?.nome || 'Máquina'}
              </h1>
            </div>
          </div>

          {machine && (
            <MachineForm 
              onSubmit={handleSubmit}
              initialData={machine}
            />
          )}
        </div>
      </main>
    </>
  );
}
