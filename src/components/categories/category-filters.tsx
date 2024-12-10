import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../ui/button';

interface Subcategoria {
  id: string;
  nome: string;
  descricao: string;
  descricaoBreve: string;
}

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  descricaoBreve: string;
  subcategorias: Subcategoria[];
}

interface CategoryFiltersProps {
  category: Categoria | null;
  onFilter: (filters: { search: string; subcategory: string }) => void;
  totalMachines: number;
  filteredCount: number;
  initialFilters?: {
    search: string;
    subcategory: string;
  };
}

export function CategoryFilters({ 
  category,
  onFilter,
  totalMachines,
  filteredCount,
  initialFilters
}: CategoryFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(initialFilters?.search || '');

  useEffect(() => {
    if (initialFilters) {
      setSearch(initialFilters.search);
    }
  }, [initialFilters]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilter({ search: value, subcategory: '' });
  };

  const clearFilters = () => {
    setSearch('');
    onFilter({ search: '', subcategory: '' });
  };

  const hasActiveFilters = search;

  return (
    <div className="sticky top-0 z-10 mb-6 space-y-4 bg-white pb-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Mostrando {filteredCount} de {totalMachines} máquinas
        </div>
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Buscar máquinas..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-primary-600 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
