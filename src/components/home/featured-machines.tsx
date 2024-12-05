import { useEffect, useState } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MachineCard } from '@/components/machines/machine-card';
import type { Machine } from '@/types';

export function FeaturedMachines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMachines() {
      try {
        const machinesRef = collection(db, 'machines');
        const q = query(machinesRef, limit(6));
        const snapshot = await getDocs(q);
        
        const machinesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Machine[];
        
        setMachines(machinesData);
      } catch (error) {
        console.error('Error loading machines:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMachines();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando máquinas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          onRentClick={(machine) => console.log('Rent click:', machine.id)}
        />
      ))}
    </div>
  );
}