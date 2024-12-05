import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserTypeSelector } from './user-type-selector';
import { AuthSocialButtons } from './auth-social-buttons';
import { registerUser, signInWithGoogle } from '@/lib/auth';
import type { UserProfile } from '@/types/auth';

type UserType = 'individual' | 'company';

export function RegisterForm() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    cpfCnpj: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.fullName || !formData.cpfCnpj || !formData.phone) {
      setError('Por favor, preencha todos os campos');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }

    if (!validateStep2()) return;

    setLoading(true);

    try {
      const userData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'> = {
        type: userType,
        email: formData.email,
        fullName: formData.fullName,
        cpfCnpj: formData.cpfCnpj,
        phone: formData.phone,
      };

      await registerUser(formData.email, formData.password, userData);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Falha ao criar conta');
      if (err.message.includes('e-mail já está em uso')) {
        setStep(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Falha ao entrar com Google');
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Crie sua conta</h1>
        <p className="mt-2 text-gray-600">
          {userType === 'individual'
            ? 'Encontre as melhores máquinas para alugar'
            : 'Comece a anunciar suas máquinas hoje mesmo'}
        </p>
      </div>

      <UserTypeSelector userType={userType} onTypeChange={setUserType} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">E-mail</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
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
                  onChange={handleChange}
                  className="w-full rounded-md border p-2 pr-10 focus:border-blue-500 focus:outline-none"
                  placeholder="Crie uma senha"
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
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

            <AuthSocialButtons onGoogleClick={handleGoogleSignIn} />

            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-blue-600 hover:underline"
              >
                Entrar
              </button>
            </p>
          </>
        ) : (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {userType === 'individual' ? 'Nome Completo' : 'Nome da Empresa'}
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                placeholder="Digite seu telefone"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Voltar
              </Button>
              <Button className="flex-1" type="submit" disabled={loading}>
                {loading ? 'Criando Conta...' : 'Criar Conta'}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}