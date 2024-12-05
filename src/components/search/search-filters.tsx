import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MACHINE_CATEGORIES } from '@/lib/constants';

interface SearchFiltersProps {
  onFilter: (filters: {
    category: string;
    model: string;
  }) => void;
}

export function SearchFilters({ onFilter }: SearchFiltersProps) {
  const [category, setCategory] = useState('');
  const [model, setModel] = useState('');

  const handleFilter = () => {
    onFilter({
      category,
      model
    });
  };

  return (
    <div className="flex gap-4">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1 rounded-lg border bg-white px-4 py-3"
      >
        <option value="">Todas as Categorias</option>
        {MACHINE_CATEGORIES.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="flex-1 rounded-lg border bg-white px-4 py-3"
      >
        <option value="">Todos os Modelos</option>
        {category && MACHINE_CATEGORIES
          .find(cat => cat.id === category)
          ?.subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
      </select>

      <Button
        onClick={handleFilter}
        className="bg-secondary-500 px-8 text-white hover:bg-secondary-600"
      >
        Buscar
      </Button>
    </div>
  );
}