import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QuoteAddressSelector } from './quote-address-selector';
import { useQuoteManager } from '@/hooks/useQuoteManager';
import { useAuth } from '@/contexts/auth-context';
import { Feedback } from '@/components/ui/feedback';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Address } from '@/types/auth';
import type { QuoteRequest } from '@/types/quote';

interface QuoteRequestFormProps {
  providerId: string;
  onSuccess?: (quoteId: string) => void;
  onCancel?: () => void;
}

export function QuoteRequestForm({ 
  providerId, 
  onSuccess,
  onCancel 
}: QuoteRequestFormProps) {
  const { userProfile } = useAuth();
  const { createQuote } = useQuoteManager();
  
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    startDate: '',
    endDate: '',
    additionalNotes: ''
  });

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setError(''); // Limpa erro se havia erro de endereço
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAddress) {
      setError('Selecione um endereço de entrega');
      return;
    }

    if (!formData.startDate) {
      setError('Selecione uma data de início');
      return;
    }

    try {
      setLoading(true);

      const quoteRequest: QuoteRequest = {
        serviceDetails: {
          serviceType: formData.serviceType,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          additionalNotes: formData.additionalNotes || undefined
        },
        deliveryAddressId: selectedAddress.id,
        providerId
      };

      const quoteId = await createQuote(quoteRequest);
      setSuccess('Orçamento solicitado com sucesso!');
      
      // Limpa o formulário após sucesso
      setFormData({
        serviceType: '',
        description: '',
        startDate: '',
        endDate: '',
        additionalNotes: ''
      });
      
      onSuccess?.(quoteId);
    } catch (err) {
      console.error('Error creating quote:', err);
      setError('Erro ao criar orçamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Faça login para solicitar um orçamento</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.href = '/login'}
          >
            Fazer Login
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Feedback type="error" message={error} />}
      {success && <Feedback type="success" message={success} />}

      <div className="space-y-6">
        {/* Seção de Endereço */}
        <Card className="p-6">
          <QuoteAddressSelector
            onAddressSelect={handleAddressSelect}
          />
        </Card>

        {/* Seção de Detalhes do Serviço */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Detalhes do Serviço</h3>
              <p className="text-sm text-muted-foreground">
                Forneça os detalhes do serviço que você precisa
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">Tipo de Serviço</Label>
                <Input
                  id="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                  placeholder="Ex: Aluguel de Betoneira"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Serviço</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva os detalhes do serviço que você precisa..."
                  disabled={loading}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={loading}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Término (Opcional)</Label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      disabled={loading || !formData.startDate}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Observações Adicionais (Opcional)</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  placeholder="Alguma informação adicional que queira compartilhar..."
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Seção de Resumo */}
        {selectedAddress && (
          <Card className="p-6 bg-muted/50">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Resumo do Pedido</h3>
                <p className="text-sm text-muted-foreground">
                  Confira os detalhes antes de enviar
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Endereço de Entrega</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="font-medium">{selectedAddress.label}</p>
                    <p className="text-muted-foreground">
                      {selectedAddress.street}, {selectedAddress.number}
                      {selectedAddress.complement && ` - ${selectedAddress.complement}`}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedAddress.neighborhood}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedAddress.city} - {selectedAddress.state}
                    </p>
                    <p className="text-muted-foreground">
                      CEP: {selectedAddress.zipCode}
                    </p>
                  </div>
                </div>

                {formData.serviceType && (
                  <div>
                    <h4 className="font-medium">Serviço</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formData.serviceType}
                    </p>
                  </div>
                )}

                {formData.startDate && (
                  <div>
                    <h4 className="font-medium">Período</h4>
                    <div className="mt-1 text-sm text-muted-foreground">
                      <p>Início: {new Date(formData.startDate).toLocaleDateString()}</p>
                      {formData.endDate && (
                        <p>Término: {new Date(formData.endDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || !selectedAddress}
            className="flex-1"
          >
            {loading ? 'Enviando...' : 'Solicitar Orçamento'}
          </Button>
        </div>
      </div>
    </form>
  );
}
