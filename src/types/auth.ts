export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}