import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhaseCard } from './phase-card';
import { PhaseModal } from './phase-modal';
import { getContent, createContent, updateContent, deleteContent } from '@/lib/content';
import type { SiteContent } from '@/lib/content';

export function PhaseManager() {
  const [phases, setPhases] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<SiteContent | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPhases();
  }, []);

  async function loadPhases() {
    try {
      const data = await getContent('phase');
      setPhases(data);
    } catch (error) {
      console.error('Error loading phases:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (data: Partial<SiteContent>) => {
    try {
      if (selectedPhase) {
        await updateContent(selectedPhase.id, data);
      } else {
        await createContent({
          type: 'phase',
          order: phases.length,
          active: true,
          ...data
        } as SiteContent);
      }
      await loadPhases();
      setShowModal(false);
      setSelectedPhase(null);
    } catch (error) {
      console.error('Error saving phase:', error);
    }
  };

  const handleDelete = async (phaseId: string) => {
    try {
      await deleteContent(phaseId);
      await loadPhases();
    } catch (error) {
      console.error('Error deleting phase:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando fases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Fases da Obra</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Fase
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            onEdit={() => {
              setSelectedPhase(phase);
              setShowModal(true);
            }}
            onDelete={() => handleDelete(phase.id)}
          />
        ))}
      </div>

      {showModal && (
        <PhaseModal
          phase={selectedPhase}
          onClose={() => {
            setShowModal(false);
            setSelectedPhase(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}