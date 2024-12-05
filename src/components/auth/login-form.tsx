import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthSocialButtons } from './auth-social-buttons';
import { signIn, signInWithGoogle } from '@/lib/auth';

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('E-mail ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Falha ao entrar com Google');
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
        <p className="mt-2 text-gray-600">Entre na sua conta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
            placeholder="Digite seu e-mail"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border p-2 pr-10 focus:border-blue-500 focus:outline-none"
              placeholder="Digite sua senha"
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
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <AuthSocialButtons onGoogleClick={handleGoogleSignIn} />

      <p className="text-center text-sm text-gray-600">
        Não tem uma conta?{' '}
        <button
          onClick={() => navigate('/register')}
          className="font-medium text-blue-600 hover:underline"
        >
          Cadastre-se
        </button>
      </p>
    </div>
  );
}