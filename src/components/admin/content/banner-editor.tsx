import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Upload, Plus, Trash2, Save, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getContent, createContent, updateContent, deleteContent, uploadContentImage, deleteContentImage } from '@/lib/content';
import { SortableBannerItem } from './sortable-banner-item';
import type { SiteContent } from '@/lib/content';

interface BannerEditorProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export function BannerEditor({ onError, onSuccess }: BannerEditorProps) {
  const [banners, setBanners] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    try {
      const data = await getContent('banner');
      setBanners(data);
    } catch (err) {
      onError('Erro ao carregar banners');
    } finally {
      setLoading(false);
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = banners.findIndex(item => item.id === active.id);
      const newIndex = banners.findIndex(item => item.id === over.id);
      
      const newBanners = arrayMove(banners, oldIndex, newIndex);
      setBanners(newBanners);

      try {
        await Promise.all(
          newBanners.map((banner, index) => 
            updateContent(banner.id, { order: index })
          )
        );
        onSuccess('Ordem dos banners atualizada');
      } catch (err) {
        onError('Erro ao reordenar banners');
        loadBanners();
      }
    }
  };

  const handleCreateBanner = async () => {
    try {
      const newBanner: Omit<SiteContent, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'banner',
        title: 'Novo Banner',
        description: '',
        order: banners.length,
        active: true,
      };

      await createContent(newBanner);
      await loadBanners();
      onSuccess('Banner criado com sucesso');
    } catch (err) {
      onError('Erro ao criar banner');
    }
  };

  const handleUpdateBanner = async (id: string, data: Partial<SiteContent>) => {
    try {
      await updateContent(id, data);
      await loadBanners();
      onSuccess('Banner atualizado com sucesso');
    } catch (err) {
      onError('Erro ao atualizar banner');
    }
  };

  const handleDeleteBanner = async (id: string, imageUrl?: string) => {
    try {
      if (imageUrl) {
        await deleteContentImage(imageUrl);
      }
      await deleteContent(id);
      await loadBanners();
      onSuccess('Banner excluído com sucesso');
    } catch (err) {
      onError('Erro ao excluir banner');
    }
  };

  const handleImageUpload = async (file: File, bannerId: string) => {
    try {
      const imageUrl = await uploadContentImage(file, `banners/${bannerId}`);
      await updateContent(bannerId, { imageUrl });
      await loadBanners();
      onSuccess('Imagem atualizada com sucesso');
    } catch (err) {
      onError('Erro ao fazer upload da imagem');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Banners do Site</h3>
        <Button onClick={handleCreateBanner}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Banner
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={banners.map(banner => banner.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {banners.map((banner) => (
              <SortableBannerItem
                key={banner.id}
                banner={banner}
                onUpdate={handleUpdateBanner}
                onDelete={handleDeleteBanner}
                onImageUpload={handleImageUpload}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {banners.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-gray-500">Nenhum banner cadastrado</p>
          <Button onClick={handleCreateBanner} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Banner
          </Button>
        </div>
      )}
    </div>
  );
}