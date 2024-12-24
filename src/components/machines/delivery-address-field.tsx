import { useState, useEffect } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { AddressAutocomplete } from '../ui/address-autocomplete';
import { useAuth } from '../../contexts/auth-context';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface DeliveryAddressFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function DeliveryAddressField({ value, onChange }: DeliveryAddressFieldProps) {
  const { userProfile } = useAuth();
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);

  useEffect(() => {
    if (userProfile?.uid) {
      loadSavedAddresses();
    }
  }, [userProfile?.uid]);

  const loadSavedAddresses = async () => {
    if (!userProfile?.uid) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', userProfile.uid));
      if (userDoc.exists()) {
        const addresses = userDoc.data().deliveryAddresses || [];
        setSavedAddresses(addresses);
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    }
  };

  const handleSaveNewAddress = async () => {
    if (!userProfile?.uid || !newAddress.trim()) return;

    try {
      const userRef = doc(db, 'users', userProfile.uid);
      const updatedAddresses = [...savedAddresses, newAddress];
      
      await updateDoc(userRef, {
        deliveryAddresses: updatedAddresses
      });

      setSavedAddresses(updatedAddresses);
      onChange(newAddress);
      setNewAddress('');
      setShowNewAddress(false);
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
    }
  };

  if (!userProfile) {
    // Se não estiver logado, mostra campo com autocompletar
    return (
      <div>
        <label className="mb-1 block text-sm font-medium">Local de Entrega</label>
        <AddressAutocomplete
          value={value}
          onChange={onChange}
          placeholder="Digite o endereço de entrega"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Local de Entrega</label>
      
      {/* Lista de endereços salvos */}
      {savedAddresses.length > 0 && !showNewAddress && (
        <div className="mb-2 space-y-2">
          {savedAddresses.map((address, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange(address)}
              className={`flex w-full items-center gap-2 rounded-lg border p-2 text-left hover:bg-gray-50 ${
                value === address ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="flex-1">{address}</span>
            </button>
          ))}
        </div>
      )}

      {/* Campo para novo endereço */}
      {showNewAddress ? (
        <div className="space-y-2">
          <AddressAutocomplete
            value={newAddress}
            onChange={setNewAddress}
            placeholder="Digite o novo endereço"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowNewAddress(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleSaveNewAddress}
              disabled={!newAddress.trim()}
            >
              Salvar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setShowNewAddress(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Novo Endereço
        </Button>
      )}
    </div>
  );
}
