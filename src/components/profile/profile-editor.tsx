import { useState } from 'react';
import { User, UserCircle, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { PersonalInfoForm } from './personal-info-form';
import { AddressForm } from './address-form';
import { AvatarUpload } from './avatar-upload';
import { updateUserProfile } from '@/lib/users';
import { uploadUserAvatar, deleteUserAvatar } from '@/lib/storage';
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
      setSuccess('Informações pessoais atualizadas com sucesso!');
      onUpdate();
    } catch (err) {
      setError('Erro ao atualizar informações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (address: UserProfile['address']) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(userProfile.uid, { address });
      setSuccess('Endereço atualizado com sucesso!');
      onUpdate();
    } catch (err) {
      setError('Erro ao atualizar endereço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AvatarUpload
        currentPhotoURL={userProfile.photoURL}
        onFileSelect={handleAvatarUpload}
        loading={loading}
      />

      <div className="flex flex-wrap gap-4">
        <Button
          variant={activeSection === 'personal' ? 'primary' : 'outline'}
          onClick={() => setActiveSection('personal')}
          className="flex items-center gap-2"
        >
          <UserCircle className="h-4 w-4" />
          Informações Pessoais
        </Button>
        <Button
          variant={activeSection === 'address' ? 'primary' : 'outline'}
          onClick={() => setActiveSection('address')}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Endereço
        </Button>
      </div>

      {error && (
        <Feedback type="error" message={error} />
      )}

      {success && (
        <Feedback type="success" message={success} />
      )}

      {activeSection === 'personal' ? (
        <PersonalInfoForm
          userProfile={userProfile}
          onSubmit={handlePersonalInfoSubmit}
          loading={loading}
        />
      ) : (
        <AddressForm
          address={userProfile.address}
          onSubmit={handleAddressSubmit}
          loading={loading}
        />
      )}
    </div>
  );
}