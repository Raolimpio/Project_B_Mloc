import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Feedback } from '@/components/ui/feedback';
import { createMachine, updateMachine } from '@/lib/machines';
import { useAuth } from '@/contexts/auth-context';
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

    // Validate image URL
    if (formData.imageUrl) {
      try {
        new URL(formData.imageUrl);
      } catch (err) {
        setError('URL da imagem inválida');
        return;
      }
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
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('Error saving machine:', err);
      setError('Falha ao salvar máquina');
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
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  category: e.target.value,
                  subcategory: '' 
                }))}
                className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              >
                <option value="">Selecione uma categoria</option>
                <option value="construction">Construção Civil</option>
                <option value="industrial">Industrial</option>
                <option value="tools">Ferramentas</option>
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
                {formData.category === 'construction' && (
                  <>
                    <option value="Betoneiras">Betoneiras</option>
                    <option value="Compactadores">Compactadores</option>
                    <option value="Geradores">Geradores</option>
                  </>
                )}
                {formData.category === 'industrial' && (
                  <>
                    <option value="Compressores">Compressores</option>
                    <option value="Soldas">Soldas</option>
                    <option value="Bombas">Bombas</option>
                  </>
                )}
                {formData.category === 'tools' && (
                  <>
                    <option value="Furadeiras">Furadeiras</option>
                    <option value="Serras">Serras</option>
                    <option value="Lixadeiras">Lixadeiras</option>
                  </>
                )}
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
                <option value="foundation">Fundação</option>
                <option value="structure">Estrutura</option>
                <option value="finishing">Acabamento</option>
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

          <div>
            <label className="mb-1 block text-sm font-medium">URL da Imagem</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-primary-600 focus:outline-none"
                placeholder="https://"
              />
            </div>
            {formData.imageUrl && (
              <div className="mt-4">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-48 w-full rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </div>
            )}
          </div>
        </div>
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