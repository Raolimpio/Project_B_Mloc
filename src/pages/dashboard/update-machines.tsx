import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/feedback';
import { updateAllMachinesOwner } from '@/lib/update-machines';

export default function UpdateMachinesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const count = await updateAllMachinesOwner('BU0nNFx2vuZXtPnOmPeG4ngcECk1');
      setSuccess(true);
      console.log(`Updated ${count} machines successfully`);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Failed to update machines:', err);
      setError('Falha ao atualizar as máquinas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Atualizar Propriedade das Máquinas</h1>
        
        {error && (
          <Feedback type="error" message={error} />
        )}
        
        {success && (
          <Feedback type="success" message="Máquinas atualizadas com sucesso!" />
        )}

        <Button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Atualizando...' : 'Atualizar Todas as Máquinas'}
        </Button>
      </div>
    </div>
  );
}