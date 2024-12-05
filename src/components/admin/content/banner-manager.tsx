import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SortableBannerItem } from './sortable-banner-item';
import { BannerModal } from './banner-modal';
import { getContent, createContent, updateContent, deleteContent } from '@/lib/content';
import type { SiteContent } from '@/lib/content';

export function BannerManager() {
  const [banners, setBanners] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<SiteContent | null>(null);
  const [showModal, setShowModal] = useState(false);

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
    } catch (error) {
      console.error('Error loading banners:', error);
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
      } catch (error) {
        console.error('Error reordering banners:', error);
        loadBanners();
      }
    }
  };

  const handleSave = async (data: Partial<SiteContent>) => {
    try {
      if (selectedBanner) {
        await updateContent(selectedBanner.id, data);
      } else {
        await createContent({
          type: 'banner',
          order: banners.length,
          active: true,
          ...data
        } as SiteContent);
      }
      await loadBanners();
      setShowModal(false);
      setSelectedBanner(null);
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleDelete = async (bannerId: string) => {
    try {
      await deleteContent(bannerId);
      await loadBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
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
        <Button onClick={() => setShowModal(true)}>
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
                onEdit={() => {
                  setSelectedBanner(banner);
                  setShowModal(true);
                }}
                onDelete={() => handleDelete(banner.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showModal && (
        <BannerModal
          banner={selectedBanner}
          onClose={() => {
            setShowModal(false);
            setSelectedBanner(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}