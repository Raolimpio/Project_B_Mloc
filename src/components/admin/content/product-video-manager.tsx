import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductVideoCard } from './product-video-card';
import { ProductVideoModal } from './product-video-modal';
import { getProductVideos, addProductVideo, updateProductVideo, deleteProductVideo } from '@/lib/content';
import type { ProductVideo } from '@/lib/content';

export function ProductVideoManager() {
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<ProductVideo | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      const data = await getProductVideos('all'); // 'all' para buscar todos os vídeos
      setVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (data: Partial<ProductVideo>) => {
    try {
      if (selectedVideo) {
        await updateProductVideo(selectedVideo.id, data);
      } else {
        await addProductVideo(data);
      }
      await loadVideos();
      setShowModal(false);
      setSelectedVideo(null);
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleDelete = async (videoId: string) => {
    try {
      await deleteProductVideo(videoId);
      await loadVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando vídeos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vídeos dos Produtos</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Vídeo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <ProductVideoCard
            key={video.id}
            video={video}
            onEdit={() => {
              setSelectedVideo(video);
              setShowModal(true);
            }}
            onDelete={() => handleDelete(video.id)}
          />
        ))}
      </div>

      {showModal && (
        <ProductVideoModal
          video={selectedVideo}
          onClose={() => {
            setShowModal(false);
            setSelectedVideo(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}