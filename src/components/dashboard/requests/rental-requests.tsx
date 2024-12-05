import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RentalRequest {
  id: string;
  customerName: string;
  machineName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockRequests: RentalRequest[] = [
  {
    id: '1',
    customerName: 'João Silva',
    machineName: 'Betoneira 200L',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    status: 'pending'
  },
  {
    id: '2',
    customerName: 'Maria Santos',
    machineName: 'Compressor de Ar 100L',
    startDate: '2024-03-18',
    endDate: '2024-03-25',
    status: 'pending'
  }
];

export function RentalRequests() {
  if (mockRequests.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">Nenhuma solicitação pendente</h3>
        <p className="mt-2 text-gray-600">
          Quando você receber solicitações de aluguel, elas aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mockRequests.map((request) => (
        <div key={request.id} className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{request.customerName}</h3>
              <p className="text-sm text-gray-600">{request.machineName}</p>
            </div>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
              Pendente
            </span>
          </div>
          
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Período</p>
              <p className="mt-1">
                {new Date(request.startDate).toLocaleDateString()} até{' '}
                {new Date(request.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="flex-1">
              Recusar
            </Button>
            <Button className="flex-1">
              Aprovar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}