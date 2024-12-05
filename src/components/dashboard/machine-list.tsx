import { Machine } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface MachineListProps {
  machines: Machine[];
  loading: boolean;
  onEdit: (machine: Machine) => void;
}

export function MachineList({ machines, loading, onEdit }: MachineListProps) {
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
      <div className="rounded-lg bg-white p-8 text-center">
        <p className="text-gray-600">Você ainda não tem máquinas cadastradas.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
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
          {machines.map((machine) => (
            <tr key={machine.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <img
                    src={machine.imageUrl}
                    alt={machine.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{machine.name}</div>
                    <div className="text-sm text-gray-500">{machine.shortDescription}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900">{machine.category}</div>
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
                  onClick={() => onEdit(machine)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}