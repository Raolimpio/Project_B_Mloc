import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuoteSuccessModalProps {
  onClose: () => void;
  onViewQuotes: () => void;
}

export function QuoteSuccessModal({ onClose, onViewQuotes }: QuoteSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h2 className="mb-2 text-xl font-semibold">Solicitação Enviada!</h2>
        <p className="mb-6 text-gray-600">
          Sua solicitação de orçamento foi enviada com sucesso. O fornecedor
          analisará as informações e responderá em breve.
        </p>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Fechar
          </Button>
          <Button
            className="flex-1"
            onClick={onViewQuotes}
          >
            Ver Meus Orçamentos
          </Button>
        </div>
      </div>
    </div>
  );
}