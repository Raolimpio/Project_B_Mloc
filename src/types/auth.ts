export interface UserProfile {
  uid: string;
  type: 'individual' | 'company';
  email: string;
  fullName: string;
  cpfCnpj: string;
  phone: string;
  photoURL?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}