import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Feedback } from '@/components/ui/feedback';
import { MachineImageManager } from './machine-image-manager';
import { createMachine, updateMachine } from '@/lib/machines';
import { useAuth } from '@/contexts/auth-context';
import { MACHINE_CATEGORIES, WORK_PHASES } from '@/lib/constants';
import type { Machine } from '@/types';

interface MachineFormProps {
  machine?: Machine;
}

export function MachineForm({ machine }: MachineFormProps) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: machine?.name || '',
    category: machine?.category || '',
    subcategory: machine?.subcategory || '',
    workPhase: machine?.workPhase || '',
    shortDescription: machine?.shortDescription || '',
    longDescription: machine?.longDescription || '',
    imageUrl: machine?.imageUrl || '',
  });

  const selectedCategory = MACHINE_CATEGORIES.find(cat => cat.id === formData.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      setError('Usuário não autenticado');
      return;
    }

    if (!formData.name || !formData.category || !formData.subcategory || !formData.workPhase) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const machineData = {
        ...formData,
        ownerId: userProfile.uid,
      };

      if (machine) {
        await updateMachine(machine.id, machineData);
        setSuccess('Máquina atualizada com sucesso!');
      } else {
        await createMachine(machineData);
        setSuccess('Máquina criada com sucesso!');
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error saving machine:', err);
      setError(err instanceof Error ? err.message : 'Falha ao salvar máquina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
      {error && <Feedback type="error" message={error} />}
      {success && <Feedback type="success" message={success} />}

      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold">Informações Básicas</h2>
        
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Nome da Máquina</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              placeholder="Digite o nome da máquina"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Categoria</label>
              <select
                required
                value={formData.category}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    category: e.target.value,
                    subcategory: ''
                  }));
                }}
                className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              >
                <option value="">Selecione uma categoria</option>
                {MACHINE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Subcategoria</label>
              <select
                required
                value={formData.subcategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
                disabled={!formData.category}
              >
                <option value="">Selecione uma subcategoria</option>
                {selectedCategory?.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Fase da Obra</label>
              <select
                required
                value={formData.workPhase}
                onChange={(e) => setFormData(prev => ({ ...prev, workPhase: e.target.value }))}
                className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              >
                <option value="">Selecione a fase</option>
                {Object.keys(WORK_PHASES).map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Descrição Curta</label>
            <input
              type="text"
              required
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              placeholder="Breve descrição da máquina"
              maxLength={100}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Descrição Detalhada</label>
            <textarea
              required
              value={formData.longDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
              className="h-32 w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              placeholder="Descrição detalhada da máquina"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold">Foto Principal</h2>
        {machine?.id ? (
          <MachineImageManager
            machineId={machine.id}
            currentImageUrl={formData.imageUrl}
            onImageUpdate={(imageUrl) => setFormData(prev => ({ ...prev, imageUrl }))}
          />
        ) : (
          <p className="text-sm text-gray-500">
            Salve a máquina primeiro para poder gerenciar as imagens
          </p>
        )}
      </Card>

      <Button 
        className="w-full" 
        type="submit" 
        disabled={loading}
        size="lg"
      >
        {loading ? 'Salvando...' : machine ? 'Salvar Alterações' : 'Criar Anúncio'}
      </Button>
    </form>
  );
}