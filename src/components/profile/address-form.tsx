import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '@/types/auth';

interface AddressFormProps {
  address?: UserProfile['address'];
  onSubmit: (address: UserProfile['address']) => void;
  loading: boolean;
}

export function AddressForm({ address, onSubmit, loading }: AddressFormProps) {
  const [formData, setFormData] = useState({
    street: address?.street || '',
    number: address?.number || '',
    complement: address?.complement || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">CEP</label>
          <input
            type="text"
            required
            value={formData.zipCode}
            onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
            className="w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Rua</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            required
            value={formData.street}
            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Número</label>
          <input
            type="text"
            required
            value={formData.number}
            onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
            className="w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Complemento</label>
          <input
            type="text"
            value={formData.complement}
            onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))}
            className="w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Cidade</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className="w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Estado</label>
          <select
            required
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            className="w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Selecione o estado</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Endereço'}
      </Button>
    </form>
  );
}