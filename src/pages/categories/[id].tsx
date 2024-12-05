import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CategoryFilters } from '@/components/categories/category-filters';
import { MachineGrid } from '@/components/machines/machine-grid';
import { db } from '@/lib/firebase';
import { MACHINE_CATEGORIES } from '@/lib/constants';
import type { Machine } from '@/types';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    subcategory: searchParams.get('subcategory') || '',
  });

  const category = MACHINE_CATEGORIES.find((cat) => cat.id === id);

  useEffect(() => {
    async function loadMachines() {
      try {
        const machinesRef = collection(db, 'machines');
        let q = query(machinesRef);

        if (id) {
          q = query(machinesRef, where('category', '==', id));
        }

        const querySnapshot = await getDocs(q);
        const machinesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Machine[];
        
        setMachines(machinesData);
      } catch (error) {
        console.error('Erro ao carregar máquinas:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMachines();
  }, [id]);

  if (!category && id) {
    navigate('/categories');
    return null;
  }

  const breadcrumbItems = category ? [
    { label: 'Categorias', href: '/categories' },
    { label: category.name },
  ] : [
    { label: 'Categorias' }
  ];

  const filteredMachines = machines.filter(machine => {
    if (filters.subcategory && machine.subcategory !== filters.subcategory) {
      return false;
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        machine.name.toLowerCase().includes(searchTerm) ||
        machine.shortDescription?.toLowerCase().includes(searchTerm) ||
        machine.category.toLowerCase().includes(searchTerm) ||
        machine.subcategory.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{category?.name}</h1>
            <p className="mt-2 text-gray-600">
              {machines.length} {machines.length === 1 ? 'máquina disponível' : 'máquinas disponíveis'}
            </p>
          </div>

          <CategoryFilters
            category={category}
            onFilter={setFilters}
            totalMachines={machines.length}
            filteredCount={filteredMachines.length}
            initialFilters={{
              search: searchParams.get('q') || '',
              subcategory: searchParams.get('subcategory') || '',
            }}
          />

          <MachineGrid
            machines={filteredMachines}
            loading={loading}
            onMachineClick={(machine) => navigate(`/machines/${machine.id}`)}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}