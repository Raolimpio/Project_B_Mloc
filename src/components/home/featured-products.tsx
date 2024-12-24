import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { IMaquina } from '@/types/machine.types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function FeaturedProducts() {
  const [featuredMachines, setFeaturedMachines] = useState<IMaquina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMachines = async () => {
      try {
        const machinesRef = collection(db, 'maquinas');
        const q = query(
          machinesRef,
          where('destaque', '==', true),
          where('disponivel', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const machines: IMaquina[] = [];
        
        querySnapshot.forEach((doc) => {
          machines.push({ id: doc.id, ...doc.data() } as IMaquina);
        });
        
        setFeaturedMachines(machines);
      } catch (error) {
        console.error('Erro ao buscar máquinas em destaque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMachines();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (featuredMachines.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Produtos em Destaque</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {featuredMachines.map((machine) => (
          <Link key={machine.id} to={`/machines/${machine.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={machine.fotoPrincipal || machine.fotos[0]}
                alt={machine.nome}
                className="h-48 w-full object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{machine.nome}</h3>
                <p className="text-sm text-gray-600 mb-2">{machine.descricaoBreve}</p>
                {machine.precoPromocional && (
                  <p className="text-primary font-bold">
                    {formatCurrency(machine.precoPromocional)}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
