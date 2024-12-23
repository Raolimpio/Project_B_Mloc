import { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MachineCard } from '@/components/machines/machine-card';
import type { IMaquina } from '@/types/machine.types';

export function FeaturedMachines() {
  const [machines, setMachines] = useState<IMaquina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMachines() {
      try {
        const machinesRef = collection(db, 'machines');
        const q = query(
          machinesRef,
          where('destaque', '==', true),
          limit(6)
        );
        const snapshot = await getDocs(q);
        const machinesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as IMaquina[];
        
        setMachines(machinesData);
      } catch (error) {
        console.error('Erro ao carregar máquinas:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMachines();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Carregando máquinas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Máquinas em Destaque
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Confira nossa seleção de equipamentos mais populares, com disponibilidade imediata para locação
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {machines.length > 0 ? (
          machines.map((machine) => (
            <div key={machine.id}>
              <MachineCard
                machine={machine}
                onRentClick={(machine) => {
                  console.log('Solicitando orçamento para:', machine.id);
                  // TODO: Implementar lógica de orçamento
                }}
              />
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">Nenhuma máquina em destaque no momento</p>
          </div>
        )}
      </div>
    </div>
  );
}