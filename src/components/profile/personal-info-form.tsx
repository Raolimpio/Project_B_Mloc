import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserProfile } from '@/types/auth';

interface PersonalInfoFormProps {
  initialData: UserProfile;
  onSubmit: (data: Partial<UserProfile>) => void;
  loading?: boolean;
}

export function PersonalInfoForm({
  initialData,
  onSubmit,
  loading = false
}: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    displayName: initialData.displayName || '',
    email: initialData.email || '',
    phoneNumber: initialData.phoneNumber || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Nome Completo</Label>
        <Input
          id="displayName"
          type="text"
          required
          value={formData.displayName}
          onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Telefone</Label>
        <Input
          id="phoneNumber"
          type="tel"
          required
          value={formData.phoneNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
}