import { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Feedback } from '../ui/feedback';
import { useAddressManager } from '../../hooks/useAddressManager';
import { AddressForm } from '../profile/address-form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import type { IMaquina as Machine } from '../../types/machine.types';
import type { UserProfile, Address } from '../../types/auth';

const formatAddress = (address: Address) => {
  return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''}, ${address.neighborhood}, ${address.city} - ${address.state}, CEP: ${address.zipCode}`;
};

interface InitialQuoteModalProps {
  machine: Machine;
  userProfile?: UserProfile | null;
  onClose: () => void;
  onSubmit: (quoteData: InitialQuoteData) => void;
}

export interface InitialQuoteData {
  startDate: string;
  endDate: string;
  purpose: string;
  location: string;
  addressId: string;
}

export function InitialQuoteModal({ machine, userProfile, onClose, onSubmit }: InitialQuoteModalProps) {
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { addresses, loading: addressesLoading, addAddress, loadAddresses } = useAddressManager();
  
  const defaultAddress = addresses.find(addr => addr.isDefault);
  
  const [formData, setFormData] = useState<InitialQuoteData>({
    startDate: '',
    endDate: '',
    purpose: '',
    location: defaultAddress ? formatAddress(defaultAddress) : '',
    addressId: defaultAddress?.id || '',
  });

  const selectedAddress = addresses.find(addr => addr.id === formData.addressId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.addressId || !selectedAddress) {
      setError('Selecione um endereço de entrega');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('A data final deve ser posterior à data inicial');
      return;
    }

    onSubmit({
      ...formData,
      location: formatAddress(selectedAddress),
    });
  };

  const handleAddNewAddress = async (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newAddressId = await addAddress(addressData);
      await loadAddresses();
      setShowAddressForm(false);
      
      // Se for o primeiro endereço ou for marcado como padrão,
      // seleciona automaticamente
      if (addresses.length === 0 || addressData.isDefault) {
        setFormData(prev => ({ ...prev, addressId: newAddressId }));
      }
    } catch (error) {
      console.error('Erro ao adicionar endereço:', error);
      setError('Erro ao adicionar endereço. Tente novamente.');
    }
  };

  if (!userProfile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-full max-w-lg rounded-lg bg-white p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold">Faça login para continuar</h2>
            <p className="mb-6 text-muted-foreground">
              Para solicitar um orçamento, você precisa estar logado
            </p>
            <Button
              onClick={() => window.location.href = '/login'}
              className="w-full"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">Solicitar Orçamento</h2>

        {error && (
          <Feedback
            type="error"
            message={error}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Data Inicial</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Data Final</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
                  min={formData.startDate}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Finalidade do Uso</label>
            <textarea
              required
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="h-24 w-full rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Descreva como pretende utilizar o equipamento"
            />
          </div>

          {showAddressForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Novo Endereço</h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddressForm(false)}
                >
                  Voltar
                </Button>
              </div>
              <AddressForm
                onSubmit={handleAddNewAddress}
                loading={addressesLoading}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Local de Entrega</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Endereço
                </Button>
              </div>

              {addresses.length === 0 ? (
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Você ainda não tem endereços cadastrados
                  </p>
                  <Button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="w-full"
                  >
                    Cadastrar Endereço
                  </Button>
                </Card>
              ) : (
                <RadioGroup
                  value={formData.addressId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, addressId: value }))}
                  className="space-y-2"
                >
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-start space-x-2">
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                        <Card className={`p-3 hover:bg-accent/50 transition-colors ${
                          address.isDefault ? 'border-primary' : ''
                        }`}>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {address.label}
                              {address.isDefault && (
                                <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                                  Padrão
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.street}, {address.number}
                              {address.complement && ` - ${address.complement}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.neighborhood}, {address.city} - {address.state}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              CEP: {address.zipCode}
                            </p>
                          </div>
                        </Card>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!formData.addressId}
            >
              Continuar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
