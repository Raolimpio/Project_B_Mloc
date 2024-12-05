import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthSocialButtons } from '../auth-social-buttons';
import type { RegisterFormData } from './types';

interface RegisterStepOneProps {
  formData: RegisterFormData;
  showPassword: boolean;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGoogleSignIn: () => void;
  onTogglePassword: () => void;
  onNavigateLogin: () => void;
}

export function RegisterStepOne({
  formData,
  showPassword,
  loading,
  error,
  onSubmit,
  onChange,
  onGoogleSignIn,
  onTogglePassword,
  onNavigateLogin,
}: RegisterStepOneProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">E-mail</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={onChange}
          className="w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
          placeholder="Digite seu e-mail"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Senha</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            value={formData.password}
            onChange={onChange}
            className="w-full rounded-md border p-2 pr-10 focus:border-blue-500 focus:outline-none"
            placeholder="Crie uma senha"
            minLength={6}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          A senha deve ter pelo menos 6 caracteres
        </p>
      </div>

      <Button className="w-full" type="submit">
        Continuar
      </Button>

      <AuthSocialButtons onGoogleClick={onGoogleSignIn} />

      <p className="text-center text-sm text-gray-600">
        Já tem uma conta?{' '}
        <button
          type="button"
          onClick={onNavigateLogin}
          className="font-medium text-blue-600 hover:underline"
        >
          Entrar
        </button>
      </p>
    </form>
  );
}