import { useState } from 'react';
import { User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '@/types/auth';

interface PersonalInfoFormProps {
  userProfile: UserProfile;
  onSubmit: (data: Partial<UserProfile>) => void;
  loading: boolean;
}

export function PersonalInfoForm({ userProfile, onSubmit, loading }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName,
    phone: userProfile.phone,
    cpfCnpj: userProfile.cpfCnpj,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Nome Completo</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Telefone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          {userProfile.type === 'individual' ? 'CPF' : 'CNPJ'}
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            required
            value={formData.cpfCnpj}
            onChange={(e) => setFormData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
}