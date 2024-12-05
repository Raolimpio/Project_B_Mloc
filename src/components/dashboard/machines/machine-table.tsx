import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { MACHINE_CATEGORIES } from '@/lib/constants';
import type { Machine } from '@/types';

interface MachineTableProps {
  machines: Machine[];
  loading: boolean;
  onDelete?: (machine: Machine) => void;
}

export function MachineTable({ machines, loading, onDelete }: MachineTableProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);

  const filteredMachines = machines.filter(machine => {
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const searchableText = `${machine.name} ${machine.category} ${machine.subcategory} ${machine.shortDescription}`.toLowerCase();
    
    const matchesSearch = searchTerms.every(term => searchableText.includes(term));
    const matchesCategory = !selectedCategory || machine.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (machine: Machine) => {
    setMachineToDelete(machine);
  };

  const handleConfirmDelete = () => {
    if (machineToDelete && onDelete) {
      onDelete(machineToDelete);
      setMachineToDelete(null);
    }
  };

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

  return (
    <div className="space-y-4">
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
            className="flex items-center gap-2"
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

      <div className="overflow-hidden rounded-lg border bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Máquina
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredMachines.map((machine) => (
              <tr key={machine.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={machine.imageUrl || machine.photoUrl}
                      alt={machine.name}
                      className="h-10 w-10 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{machine.name}</div>
                      <div className="text-sm text-gray-500">{machine.shortDescription}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {MACHINE_CATEGORIES.find(cat => cat.id === machine.category)?.name}
                  </div>
                  <div className="text-sm text-gray-500">{machine.subcategory}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                    Disponível
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => navigate(`/machines/edit/${machine.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeleteClick(machine)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMachines.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhuma máquina encontrada</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!machineToDelete}
        title="Excluir Máquina"
        message={`Tem certeza que deseja excluir a máquina "${machineToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setMachineToDelete(null)}
        variant="danger"
      />
    </div>
  );
}