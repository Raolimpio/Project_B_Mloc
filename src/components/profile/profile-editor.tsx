import { useState } from 'react';
import { User, UserCircle, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { PersonalInfoForm } from './personal-info-form';
import { AddressManager } from './address-manager';
import { AvatarUpload } from './avatar-upload';
import { updateUserProfile } from '@/lib/users';
import { uploadUserAvatar, deleteUserAvatar } from '@/lib/storage';
import { useAddressManager } from '@/hooks/useAddressManager';
import type { UserProfile } from '@/types/auth';

interface ProfileEditorProps {
  userProfile: UserProfile;
  onUpdate: () => void;
}

type ActiveSection = 'personal' | 'address';

export function ProfileEditor({ userProfile, onUpdate }: ProfileEditorProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    addresses,
    loading: addressesLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useAddressManager();

  const handleAvatarUpload = async (file: File) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Delete existing avatar if any
      if (userProfile.photoURL) {
        await deleteUserAvatar(userProfile.uid);
      }

      // Upload new avatar
      const photoURL = await uploadUserAvatar(userProfile.uid, file);
      
      // Update user profile
      await updateUserProfile(userProfile.uid, { photoURL });
      setSuccess('Foto atualizada com sucesso!');
      onUpdate();
    } catch (err) {
      setError('Erro ao atualizar foto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoSubmit = async (data: Partial<UserProfile>) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(userProfile.uid, data);
      setSuccess('Perfil atualizado com sucesso!');
      onUpdate();
    } catch (err) {
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <AvatarUpload
            photoURL={userProfile.photoURL}
            onUpload={handleAvatarUpload}
            loading={loading}
          />
        </div>

        <div className="w-full sm:w-2/3 space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={activeSection === 'personal' ? 'default' : 'outline'}
              onClick={() => setActiveSection('personal')}
              className="flex-1"
            >
              <User className="h-4 w-4 mr-2" />
              Dados Pessoais
            </Button>
            <Button
              variant={activeSection === 'address' ? 'default' : 'outline'}
              onClick={() => setActiveSection('address')}
              className="flex-1"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Endereços
            </Button>
          </div>

          {error && <Feedback type="error" message={error} />}
          {success && <Feedback type="success" message={success} />}

          {activeSection === 'personal' ? (
            <PersonalInfoForm
              initialData={userProfile}
              onSubmit={handlePersonalInfoSubmit}
              loading={loading}
            />
          ) : (
            <AddressManager
              addresses={addresses}
              onAddAddress={addAddress}
              onUpdateAddress={updateAddress}
              onDeleteAddress={deleteAddress}
              onSetDefaultAddress={setDefaultAddress}
              loading={addressesLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}