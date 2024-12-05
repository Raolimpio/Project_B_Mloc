import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SiteContent } from '@/lib/content';

interface PhaseModalProps {
  phase?: SiteContent | null;
  onClose: () => void;
  onSave: (data: Partial<SiteContent>) => void;
}

export function PhaseModal({ phase, onClose, onSave }: PhaseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: phase?.title || '',
    description: phase?.description || '',
    icon: phase?.icon || '',
    machines: phase?.machines || [],
    active: phase?.active ?? true,
  });

  const handleAddMachine = () => {
    setFormData(prev => ({
      ...prev,
      machines: [...prev.machines, '']
    }));
  };

  const handleRemoveMachine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      machines: prev.machines.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateMachine = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      machines: prev.machines.map((machine, i) => i === index ? value : machine)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving phase:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">
          {phase ? 'Editar Fase' : 'Nova Fase'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="h-24 w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Emoji/Ícone</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              placeholder="Ex: 🏗️"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Máquinas Relacionadas</label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddMachine}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.machines.map((machine, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={machine}
                    onChange={(e) => handleUpdateMachine(index, e.target.value)}
                    className="flex-1 rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
                    placeholder="Nome da máquina"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMachine(index)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            />
            <label htmlFor="active" className="ml-2 text-sm font-medium">
              Fase Ativa
            </label>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}