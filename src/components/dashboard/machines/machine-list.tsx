import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Edit, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MACHINE_CATEGORIES, DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import { useAuth } from '@/contexts/auth-context';
import type { Machine } from '@/types';

interface MachineListProps {
  machines: Machine[];
  loading: boolean;
  onMachineClick?: (machine: Machine) => void;
  showActions?: boolean;
}

export function MachineList({ 
  machines, 
  loading, 
  onMachineClick,
  showActions = true 
}: MachineListProps) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(window.innerWidth >= 1024);

  const filteredMachines = machines.filter(machine => {
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const searchableText = `${machine.name} ${machine.category} ${machine.subcategory} ${machine.shortDescription}`.toLowerCase();
    
    const matchesSearch = searchTerms.every(term => searchableText.includes(term));
    const matchesCategory = !selectedCategory || machine.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando máquinas...</p>
        </div>
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar por nome, categoria ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 lg:hidden"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-medium">Filtrar por Categoria</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedCategory === '' ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory('')}
              >
                Todas
              </Button>
              {MACHINE_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  size="sm"
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMachines.map((machine) => (
          <div
            key={machine.id}
            className="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-video">
              <img
                src={machine.imageUrl || machine.photoUrl || DEFAULT_CATEGORY_IMAGE}
                alt={machine.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== DEFAULT_CATEGORY_IMAGE) {
                    target.src = DEFAULT_CATEGORY_IMAGE;
                  }
                }}
              />
            </div>
            
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-medium">{machine.name}</h3>
                <p className="text-sm text-gray-500">{machine.shortDescription}</p>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {MACHINE_CATEGORIES.find(cat => cat.id === machine.category)?.name}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {machine.subcategory}
                </span>
              </div>

              {userProfile?.uid === machine.ownerId ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/machines/edit/${machine.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => onMachineClick?.(machine)}
                >
                  Alugar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMachines.length === 0 && (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-gray-600">Nenhuma máquina encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
}