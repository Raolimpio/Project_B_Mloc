export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface AddressFormData extends Omit<Address, 'id' | 'isDefault'> {
  isDefault?: boolean;
}
