import { useState, useEffect } from 'react';
import { Upload, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Feedback } from '@/components/ui/feedback';
import { WORK_PHASES } from '@/lib/constants';
import { uploadContentImage } from '@/lib/content';

interface WorkPhase {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  machines: string[];
  order: number;
}

export function WorkPhaseEditor() {
  const [phases, setPhases] = useState<WorkPhase[]>(
    Object.entries(WORK_PHASES).map(([name, data], index) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon: data.icon,
      machines: data.machines,
      order: index,
    }))
  );
  const [error, setError] = useState('');

  const handleImageUpload = async (file: File, phaseId: string) => {
    try {
      const imageUrl = await uploadContentImage(file, `work-phases/${phaseId}`);
      setPhases(prev => prev.map(phase => 
        phase.id === phaseId ? { ...phase, imageUrl } : phase
      ));
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Erro ao fazer upload da imagem');
    }
  };

  const handleAddMachine = (phaseId: string) => {
    setPhases(prev => prev.map(phase => 
      phase.id === phaseId 
        ? { ...phase, machines: [...phase.machines, ''] }
        : phase
    ));
  };

  const handleRemoveMachine = (phaseId: string, index: number) => {
    setPhases(prev => prev.map(phase => 
      phase.id === phaseId 
        ? { ...phase, machines: phase.machines.filter((_, i) => i !== index) }
        : phase
    ));
  };

  const handleUpdateMachine = (phaseId: string, index: number, value: string) => {
    setPhases(prev => prev.map(phase => 
      phase.id === phaseId 
        ? {
            ...phase,
            machines: phase.machines.map((m, i) => i === index ? value : m)
          }
        : phase
    ));
  };

  return (
    <div className="space-y-6">
      {error && <Feedback type="error" message={error} />}

      <div className="grid gap-6 md:grid-cols-2">
        {phases.map((phase) => (
          <Card key={phase.id} className="p-4">
            <div className="relative h-32 w-full overflow-hidden rounded-lg">
              {phase.imageUrl ? (
                <img
                  src={phase.imageUrl}
                  alt={phase.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-4xl">
                  {phase.icon}
                </div>
              )}
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-2 right-2"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      handleImageUpload(file, phase.id);
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Imagem
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nome da Fase</label>
                <input
                  type="text"
                  value={phase.name}
                  onChange={(e) => setPhases(prev => prev.map(p => 
                    p.id === phase.id ? { ...p, name: e.target.value } : p
                  ))}
                  className="w-full rounded-lg border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Emoji/Ícone</label>
                <input
                  type="text"
                  value={phase.icon}
                  onChange={(e) => setPhases(prev => prev.map(p => 
                    p.id === phase.id ? { ...p, icon: e.target.value } : p
                  ))}
                  className="w-full rounded-lg border p-2"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">Máquinas</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddMachine(phase.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {phase.machines.map((machine, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={machine}
                        onChange={(e) => handleUpdateMachine(phase.id, index, e.target.value)}
                        className="flex-1 rounded-lg border p-2"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveMachine(phase.id, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}