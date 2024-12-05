import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, orderBy, limit, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MachineCard } from '@/components/machines/machine-card';
import type { Machine } from '@/types';

export function MostRentedMachines() {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMostRentedMachines() {
      try {
        const quotesRef = collection(db, 'quotes');
        const machinesRef = collection(db, 'machines');
        
        // First get all machines to ensure we have data
        const allMachinesSnapshot = await getDocs(machinesRef);
        if (allMachinesSnapshot.empty) {
          setMachines([]);
          setLoading(false);
          return;
        }

        // Get completed rentals
        const quotesSnapshot = await getDocs(query(quotesRef, 
          where('status', 'in', ['returned', 'delivered'])
        ));

        // Count rentals per machine
        const rentalCounts = new Map<string, number>();
        quotesSnapshot.docs.forEach(doc => {
          const machineId = doc.data().machineId;
          rentalCounts.set(machineId, (rentalCounts.get(machineId) || 0) + 1);
        });

        // If no rentals, show random machines
        if (rentalCounts.size === 0) {
          const randomMachines = allMachinesSnapshot.docs
            .slice(0, 5)
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Machine[];
          
          setMachines(randomMachines);
          setLoading(false);
          return;
        }

        // Get top 5 rented machines
        const topMachineIds = Array.from(rentalCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id]) => id);

        // Get machine details in batches to avoid Firestore limitations
        const machinesData: Machine[] = [];
        for (let i = 0; i < topMachineIds.length; i += 10) {
          const batch = topMachineIds.slice(i, i + 10);
          const batchSnapshot = await getDocs(query(machinesRef, 
            where(documentId(), 'in', batch)
          ));
          
          batchSnapshot.docs.forEach(doc => {
            machinesData.push({
              id: doc.id,
              ...doc.data()
            } as Machine);
          });
        }

        setMachines(machinesData);
      } catch (error) {
        console.error('Error loading most rented machines:', error);
        // On error, try to show some machines anyway
        try {
          const fallbackSnapshot = await getDocs(query(
            collection(db, 'machines'),
            limit(5)
          ));
          
          const fallbackMachines = fallbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Machine[];
          
          setMachines(fallbackMachines);
        } catch (fallbackError) {
          console.error('Error loading fallback machines:', fallbackError);
          setMachines([]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadMostRentedMachines();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video w-full rounded-lg bg-gray-200"></div>
            <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (machines.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center">
        <p className="text-gray-600">Nenhuma máquina encontrada.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
      {machines.map((machine) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          onRentClick={(machine) => navigate(`/machines/${machine.id}`)}
        />
      ))}
    </div>
  );
}