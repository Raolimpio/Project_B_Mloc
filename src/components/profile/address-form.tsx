import { useState } from 'react';
import { MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Address } from '@/types/auth';
import { Checkbox } from '@/components/ui/checkbox';

interface AddressFormProps {
  initialData?: Partial<Address>;
  onSubmit: (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  loading: boolean;
}

export function AddressForm({ initialData, onSubmit, loading }: AddressFormProps) {
  const [formData, setFormData] = useState({
    label: initialData?.label || '',
    street: initialData?.street || '',
    number: initialData?.number || '',
    complement: initialData?.complement || '',
    neighborhood: initialData?.neighborhood || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    isDefault: initialData?.isDefault || false,
  });

  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  const formatCEP = (cep: string) => {
    // Remove tudo que não é número
    const numbers = cep.replace(/\D/g, '');
    // Formata como CEP (00000-000)
    return numbers.replace(/^(\d{5})(\d{3}).*/, '$1-$2');
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCEP = formatCEP(e.target.value);
    setFormData(prev => ({ ...prev, zipCode: formattedCEP }));
    setCepError('');
  };

  const searchCEP = async (cep: string) => {
    // Remove qualquer caractere que não seja número
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      setCepError('CEP deve ter 8 números');
      return;
    }

    try {
      setCepLoading(true);
      setCepError('');
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError('CEP não encontrado');
        return;
      }

      setFormData(prev => ({
        ...prev,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      }));
    } catch (error) {
      setCepError('Erro ao buscar CEP');
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Nome do Endereço</Label>
        <Input
          id="label"
          type="text"
          required
          placeholder="Ex: Casa, Trabalho, Obra"
          value={formData.label}
          onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">CEP</Label>
        <div className="relative">
          <Input
            id="zipCode"
            type="text"
            required
            maxLength={9}
            value={formData.zipCode}
            onChange={handleCEPChange}
            onBlur={(e) => searchCEP(e.target.value)}
            placeholder="00000-000"
            disabled={loading || cepLoading}
            className={cepError ? 'border-red-500' : ''}
          />
          {cepLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          )}
        </div>
        {cepError && <p className="text-sm text-red-500">{cepError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Rua</Label>
        <Input
          id="street"
          type="text"
          required
          value={formData.street}
          onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
          disabled={loading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            type="text"
            required
            value={formData.number}
            onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            type="text"
            value={formData.complement}
            onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input
          id="neighborhood"
          type="text"
          required
          value={formData.neighborhood}
          onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
          disabled={loading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            type="text"
            required
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, isDefault: checked === true }))
          }
          disabled={loading}
        />
        <Label htmlFor="isDefault" className="cursor-pointer">
          Definir como endereço padrão
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Endereço'}
      </Button>
    </form>
  );
}