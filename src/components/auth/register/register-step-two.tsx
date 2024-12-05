import { Button } from '@/components/ui/button';
import type { RegisterFormData, UserType } from './types';

interface RegisterStepTwoProps {
  formData: RegisterFormData;
  userType: UserType;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
}

export function RegisterStepTwo({
  formData,
  userType,
  loading,
  error,
  onSubmit,
  onChange,
  onBack,
}: RegisterStepTwoProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">
          {userType === 'individual' ? 'Nome Completo' : 'Nome da Empresa'}
        </label>
        <input
          type="text"
          name="fullName"
          required
          value={formData.fullName}
          onChange={onChange}
          className="w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
          placeholder={userType === 'individual' ? 'Digite seu nome completo' : 'Digite o nome da empresa'}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          {userType === 'individual' ? 'CPF' : 'CNPJ'}
        </label>
        <input
          type="text"
          name="cpfCnpj"
          required
          value={formData.cpfCnpj}
          onChange={onChange}
          className="w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
          placeholder={userType === 'individual' ? 'Digite seu CPF' : 'Digite o CNPJ'}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Telefone</label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={onChange}
          className="w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
          placeholder="Digite seu telefone"
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button className="flex-1" type="submit" disabled={loading}>
          {loading ? 'Criando Conta...' : 'Criar Conta'}
        </Button>
      </div>
    </form>
  );
}