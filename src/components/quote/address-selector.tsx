import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Address } from '@/types/address';
import { useAddresses } from '@/hooks/useAddresses';
import { AddressManager } from '../profile/address-manager';

interface AddressSelectorProps {
  onAddressSelect: (address: Address) => void;
}

export function AddressSelector({ onAddressSelect }: AddressSelectorProps) {
  const { addresses, addAddress, removeAddress, setDefaultAddress, getDefaultAddress } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    getDefaultAddress()?.id || null
  );
  const [showNewAddress, setShowNewAddress] = useState(false);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      onAddressSelect(selectedAddress);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Endereço de Entrega</h3>
        <Button
          variant="outline"
          onClick={() => setShowNewAddress(!showNewAddress)}
        >
          {showNewAddress ? 'Voltar aos Endereços' : 'Adicionar Novo Endereço'}
        </Button>
      </div>

      {showNewAddress ? (
        <AddressManager
          addresses={[]}
          onAddAddress={(newAddress) => {
            addAddress(newAddress);
            setShowNewAddress(false);
          }}
          onRemoveAddress={() => {}}
          onSetDefaultAddress={() => {}}
        />
      ) : (
        <div className="space-y-4">
          <RadioGroup
            value={selectedAddressId || undefined}
            onValueChange={handleAddressSelect}
          >
            {addresses.map((address) => (
              <div key={address.id} className="flex items-center space-x-2">
                <RadioGroupItem value={address.id} id={address.id} />
                <Label htmlFor={address.id}>
                  <Card className="p-3">
                    <p>{address.street}, {address.number}</p>
                    {address.complement && <p>{address.complement}</p>}
                    <p>{address.neighborhood}</p>
                    <p>{address.city} - {address.state}</p>
                    <p>CEP: {address.zipCode}</p>
                    {address.isDefault && (
                      <span className="text-sm text-muted-foreground">(Endereço padrão)</span>
                    )}
                  </Card>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {addresses.length === 0 && (
            <p className="text-center text-muted-foreground">
              Nenhum endereço cadastrado. Adicione um novo endereço.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
