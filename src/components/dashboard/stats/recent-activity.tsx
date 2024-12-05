import { useMemo } from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare, Package, Truck, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Quote } from '@/types/quote';

interface RecentActivityProps {
  quotes: Quote[];
}

export function RecentActivity({ quotes }: RecentActivityProps) {
  const recentActivity = useMemo(() => {
    return quotes
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);
  }, [quotes]);

  const getStatusIcon = (status: Quote['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'quoted':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'in_preparation':
        return <Package className="h-5 w-5 text-purple-600" />;
      case 'in_transit':
        return <Truck className="h-5 w-5 text-orange-600" />;
      case 'delivered':
        return <MapPin className="h-5 w-5 text-teal-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: Quote['status']) => {
    switch (status) {
      case 'pending':
        return 'Nova solicitação';
      case 'quoted':
        return 'Orçamento enviado';
      case 'accepted':
        return 'Orçamento aprovado';
      case 'rejected':
        return 'Orçamento recusado';
      case 'in_preparation':
        return 'Em preparação';
      case 'in_transit':
        return 'Em rota de entrega';
      case 'delivered':
        return 'Entregue';
      default:
        return 'Status desconhecido';
    }
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100';
      case 'quoted':
        return 'bg-blue-100';
      case 'accepted':
        return 'bg-green-100';
      case 'rejected':
        return 'bg-red-100';
      case 'in_preparation':
        return 'bg-purple-100';
      case 'in_transit':
        return 'bg-orange-100';
      case 'delivered':
        return 'bg-teal-100';
      default:
        return 'bg-gray-100';
    }
  };

  if (recentActivity.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Nenhuma atividade recente.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {recentActivity.map((quote) => (
        <div key={quote.id} className="flex items-center gap-4">
          <div className={`rounded-full p-2 ${getStatusColor(quote.status)}`}>
            {getStatusIcon(quote.status)}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{quote.machineName}</h3>
            <p className="text-sm text-gray-500">
              {getStatusText(quote.status)}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(quote.updatedAt, {
              addSuffix: true,
              locale: ptBR,
            })}
          </p>
        </div>
      ))}
    </div>
  );
}