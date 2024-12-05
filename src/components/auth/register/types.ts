export type UserType = 'individual' | 'company';

export interface RegisterFormData {
  email: string;
  password: string;
  fullName: string;
  cpfCnpj: string;
  phone: string;
}

export interface RegisterFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}