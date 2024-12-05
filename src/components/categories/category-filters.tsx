import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MACHINE_SUBCATEGORIES } from '@/lib/constants';

interface CategoryFiltersProps {
  category: any;
  onFilter: (filters: { search: string; subcategory: string }) => void;
  totalMachines: number;
  filteredCount: number;
  initialFilters?: {
    search: string;
    subcategory: string;
  };
}

export function CategoryFilters({ 
  onFilter,
  totalMachines,
  filteredCount,
  initialFilters
}: CategoryFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [subcategory, setSubcategory] = useState(initialFilters?.subcategory || '');

  useEffect(() => {
    if (initialFilters) {
      setSearch(initialFilters.search);
      setSubcategory(initialFilters.subcategory);
    }
  }, [initialFilters]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilter({ search: value, subcategory });
  };

  const handleSubcategoryChange = (value: string) => {
    setSubcategory(value === subcategory ? '' : value);
    onFilter({ search, subcategory: value === subcategory ? '' : value });
  };

  const clearFilters = () => {
    setSearch('');
    setSubcategory('');
    onFilter({ search: '', subcategory: '' });
  };

  const hasActiveFilters = search || subcategory;

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
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800">
              {Number(!!search) + Number(!!subcategory)}
            </span>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          {Object.entries(MACHINE_SUBCATEGORIES).map(([group, items]) => (
            <div key={group} className="mb-6 last:mb-0">
              <h3 className="mb-3 font-medium text-gray-900">{group}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Button
                    key={item}
                    size="sm"
                    variant={subcategory === item ? 'primary' : 'outline'}
                    onClick={() => handleSubcategoryChange(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}