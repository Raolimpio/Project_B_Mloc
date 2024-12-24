import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Feedback } from '@/components/ui/feedback';
import { MachineImageManager } from './machine-image-manager';
import { createMachine, updateMachine } from '@/lib/machines';
import { useAuth } from '@/contexts/auth-context';
import { 
  MACHINE_CATEGORIES, 
  WORK_TYPES,
  CONSTRUCTION_PHASES,
  APPLICATION_TYPES 
} from '@/lib/constants';
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
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: machine?.name || '',
    workType: machine?.workType || '',
    workPhase: machine?.workPhase || '',
    application: machine?.application || '',
    shortDescription: machine?.shortDescription || '',
    longDescription: machine?.longDescription || '',
    imageUrl: machine?.imageUrl || '',
    featured: machine?.featured || false,
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!formData.workType) {
      errors.workType = 'Tipo de trabalho é obrigatório';
    }
    
    if (!formData.workPhase) {
      errors.workPhase = 'Fase de trabalho é obrigatória';
    }
    
    if (!formData.application) {
      errors.application = 'Tipo de aplicação é obrigatório';
    }
    
    if (formData.shortDescription && formData.shortDescription.length > 150) {
      errors.shortDescription = 'Descrição curta deve ter no máximo 150 caracteres';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      setError('Usuário não autenticado');
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError('Por favor, corrija os erros no formulário');
      setFieldErrors(validationErrors);
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
            {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Tipo de Trabalho</label>
              <select
                required
                value={formData.workType}
                onChange={(e) => setFormData(prev => ({ ...prev, workType: e.target.value }))}
                className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              >
                <option value="">Selecione o tipo</option>
                {Object.entries(WORK_TYPES).map(([key, { name }]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
              {fieldErrors.workType && <p className="text-sm text-red-500">{fieldErrors.workType}</p>}
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
                {Object.entries(CONSTRUCTION_PHASES).map(([key, { name }]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
              {fieldErrors.workPhase && <p className="text-sm text-red-500">{fieldErrors.workPhase}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Aplicação</label>
              <select
                required
                value={formData.application}
                onChange={(e) => setFormData(prev => ({ ...prev, application: e.target.value }))}
                className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              >
                <option value="">Selecione a aplicação</option>
                {Object.entries(APPLICATION_TYPES).map(([key, { name }]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
              {fieldErrors.application && <p className="text-sm text-red-500">{fieldErrors.application}</p>}
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
              maxLength={150}
            />
            {fieldErrors.shortDescription && <p className="text-sm text-red-500">{fieldErrors.shortDescription}</p>}
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

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Produto em Destaque
              </span>
            </label>
            <p className="mt-1 text-sm text-gray-500">
              Marque esta opção para exibir este produto na seção de destaques
            </p>
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
      >
        {loading ? 'Salvando...' : machine ? 'Atualizar Máquina' : 'Criar Máquina'}
      </Button>
    </form>
  );
}