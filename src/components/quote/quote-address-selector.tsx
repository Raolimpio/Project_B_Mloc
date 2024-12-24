import { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AddressForm } from '@/components/profile/address-form';
import type { Address } from '@/types/auth';
import { useAddressManager } from '@/hooks/useAddressManager';

interface QuoteAddressSelectorProps {
  onAddressSelect: (address: Address) => void;
}

export function QuoteAddressSelector({
  onAddressSelect,
}: QuoteAddressSelectorProps) {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const { 
    addresses, 
    loading: addressesLoading, 
    addAddress,
    loadAddresses 
  } = useAddressManager();

  // Encontra o endereço padrão
  const defaultAddress = addresses.find(addr => addr.isDefault);
  
  // Se houver endereço padrão, use-o como seleção inicial
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Seleciona automaticamente o endereço padrão quando os endereços são carregados
  useEffect(() => {
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
      onAddressSelect(defaultAddress); // Chama onAddressSelect com o endereço padrão
    }
  }, [defaultAddress, selectedAddressId, onAddressSelect]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      onAddressSelect(selectedAddress);
    }
  };

  const handleAddNewAddress = async (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newAddressId = await addAddress(addressData);
      await loadAddresses();
      setShowNewAddressForm(false);
      
      // Se for o primeiro endereço ou for marcado como padrão,
      // seleciona automaticamente após adicionar
      if (addresses.length === 0 || addressData.isDefault) {
        const newAddress = addresses.find(addr => addr.id === newAddressId);
        if (newAddress) {
          handleAddressSelect(newAddress.id);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar endereço:', error);
    }
  };

  if (showNewAddressForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewAddressForm(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Endereços
          </Button>
        </div>
        
        <AddressForm
          onSubmit={handleAddNewAddress}
          loading={addressesLoading}
        />
      </div>
    );
  }

  if (addressesLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (addresses.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Nenhum Endereço Cadastrado</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Você precisa cadastrar um endereço para continuar
            </p>
          </div>
          <Button onClick={() => setShowNewAddressForm(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Endereço
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Selecione o Endereço de Entrega</h3>
        <Button
          variant="outline"
          onClick={() => setShowNewAddressForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Endereço
        </Button>
      </div>

      <RadioGroup
        value={selectedAddressId || undefined}
        onValueChange={handleAddressSelect}
        className="space-y-2"
      >
        {addresses.map((address) => (
          <div key={address.id} className="flex items-start space-x-2">
            <RadioGroupItem value={address.id} id={address.id} className="mt-4" />
            <Label htmlFor={address.id} className="flex-1 cursor-pointer">
              <Card className={`p-4 hover:bg-accent/50 transition-colors ${
                address.isDefault ? 'border-primary' : ''
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{address.label}</p>
                      {address.isDefault && (
                        <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Padrão
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm">
                    {address.street}, {address.number}
                    {address.complement && ` - ${address.complement}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.neighborhood}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.city} - {address.state}
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
    </div>
  );
}
