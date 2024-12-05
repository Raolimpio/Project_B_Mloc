import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserTypeSelector } from '../user-type-selector';
import { RegisterStepOne } from './register-step-one';
import { RegisterStepTwo } from './register-step-two';
import { registerUser, signInWithGoogle } from '@/lib/auth';
import type { UserProfile } from '@/types/auth';
import type { UserType, RegisterFormData } from './types';

const initialFormData: RegisterFormData = {
  email: '',
  password: '',
  fullName: '',
  cpfCnpj: '',
  phone: '',
};

export function RegisterForm() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);

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

      {step === 1 ? (
        <RegisterStepOne
          formData={formData}
          showPassword={showPassword}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onGoogleSignIn={handleGoogleSignIn}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onNavigateLogin={() => navigate('/login')}
        />
      ) : (
        <RegisterStepTwo
          formData={formData}
          userType={userType}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onBack={() => setStep(1)}
        />
      )}
    </div>
  );
}