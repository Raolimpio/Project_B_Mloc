import { CheckCircle, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatWhatsAppMessage, generateWhatsAppLink } from '@/lib/whatsapp';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import type { Machine } from '@/types';

interface QuoteSuccessModalProps {
  onClose: () => void;
  onViewQuotes: () => void;
  machine: Machine;
  quoteData: {
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    additionalInfo: string;
  };
}

export function QuoteSuccessModal({ onClose, onViewQuotes, machine, quoteData }: QuoteSuccessModalProps) {
  const [ownerPhone, setOwnerPhone] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerPhone = async () => {
      try {
        const ownerDoc = await getDoc(doc(db, 'users', machine.proprietarioId));
        if (ownerDoc.exists()) {
          setOwnerPhone(ownerDoc.data().phone);
        }
      } catch (error) {
        console.error('Erro ao buscar telefone do proprietário:', error);
      }
    };

    fetchOwnerPhone();
  }, [machine.proprietarioId]);

  const handleWhatsAppClick = () => {
    if (!ownerPhone) return;
    
    const message = formatWhatsAppMessage(machine, quoteData);
    const whatsappLink = generateWhatsAppLink(ownerPhone, message);
    window.open(whatsappLink, '_blank');
  };

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

        <div className="flex flex-col gap-3">
          {ownerPhone && (
            <Button
              className="w-full"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Continuar no WhatsApp
            </Button>
          )}
          
          <div className="flex gap-3">
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
    </div>
  );
}