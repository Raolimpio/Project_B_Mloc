import { useState } from 'react';
import { Plus, Star, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AddressForm } from './address-form';
import type { Address } from '@/types/auth';

interface AddressManagerProps {
  addresses: Address[];
  onAddAddress: (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  onDeleteAddress: (addressId: string) => Promise<void>;
  onSetDefaultAddress: (addressId: string) => Promise<void>;
  loading?: boolean;
}

export function AddressManager({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  loading = false
}: AddressManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const handleAddSubmit = async (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    await onAddAddress(addressData);
    setShowAddForm(false);
  };

  const handleUpdateSubmit = async (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (editingAddressId) {
      await onUpdateAddress(editingAddressId, addressData);
      setEditingAddressId(null);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!loading) {
      await onSetDefaultAddress(addressId);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!loading && window.confirm('Tem certeza que deseja excluir este endereço?')) {
      await onDeleteAddress(addressId);
    }
  };

  if (editingAddressId) {
    const addressToEdit = addresses.find(addr => addr.id === editingAddressId);
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Editar Endereço</h3>
          <Button
            variant="outline"
            onClick={() => setEditingAddressId(null)}
          >
            Cancelar
          </Button>
        </div>
        
        {addressToEdit && (
          <AddressForm
            initialData={addressToEdit}
            onSubmit={handleUpdateSubmit}
            loading={loading}
          />
        )}
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Novo Endereço</h3>
          <Button
            variant="outline"
            onClick={() => setShowAddForm(false)}
          >
            Cancelar
          </Button>
        </div>
        
        <AddressForm
          onSubmit={handleAddSubmit}
          loading={loading}
          initialData={{ isDefault: addresses.length === 0 }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Meus Endereços</h3>
        <Button
          onClick={() => setShowAddForm(true)}
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Endereço
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Você ainda não tem endereços cadastrados
            </p>
            <Button onClick={() => setShowAddForm(true)} disabled={loading}>
              Cadastrar Endereço
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id} className="p-4">
              <div className="flex justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {address.street}, {address.number}
                    </p>
                    {address.isDefault && (
                      <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Padrão
                      </span>
                    )}
                  </div>
                  {address.complement && (
                    <p className="text-sm text-muted-foreground">
                      {address.complement}
                    </p>
                  )}
                  <p className="text-sm">
                    {address.neighborhood}
                  </p>
                  <p className="text-sm">
                    {address.city} - {address.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP: {address.zipCode}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={loading}
                      title="Definir como padrão"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingAddressId(address.id)}
                    disabled={loading}
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                    disabled={loading || address.isDefault}
                    className="text-red-500 hover:text-red-600"
                    title={address.isDefault ? 'Não é possível excluir o endereço padrão' : 'Excluir'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
