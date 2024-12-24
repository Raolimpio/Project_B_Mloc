import { useState, useEffect } from 'react';
import { Address } from '@/types/address';

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Carregar endereços do localStorage ao iniciar
  useEffect(() => {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  // Salvar endereços no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (newAddress: Omit<Address, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const address: Address = {
      ...newAddress,
      id,
      isDefault: addresses.length === 0 ? true : newAddress.isDefault,
    };

    if (address.isDefault) {
      // Se o novo endereço for padrão, remove o padrão dos outros
      setAddresses(prev => 
        prev.map(a => ({ ...a, isDefault: false })).concat(address)
      );
    } else {
      setAddresses(prev => [...prev, address]);
    }
  };

  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(address => address.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev =>
      prev.map(address => ({
        ...address,
        isDefault: address.id === id,
      }))
    );
  };

  const getDefaultAddress = () => {
    return addresses.find(address => address.isDefault);
  };

  return {
    addresses,
    addAddress,
    removeAddress,
    setDefaultAddress,
    getDefaultAddress,
  };
}
