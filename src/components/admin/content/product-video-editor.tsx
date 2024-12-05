import { useState, useEffect } from 'react';
import { Plus, Trash2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Feedback } from '@/components/ui/feedback';
import { getProductVideos, addProductVideo, deleteProductVideo } from '@/lib/content';
import type { ProductVideo } from '@/lib/content';

export function ProductVideoEditor() {
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    if (selectedProductId) {
      loadVideos(selectedProductId);
    }
  }, [selectedProductId]);

  async function loadVideos(productId: string) {
    try {
      setLoading(true);
      const data = await getProductVideos(productId);
      setVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
      setError('Erro ao carregar vídeos');
    } finally {
      setLoading(false);
    }
  }

  const handleAddVideo = async (productId: string, videoData: Omit<ProductVideo, 'id'>) => {
    try {
      await addProductVideo(videoData);
      await loadVideos(productId);
    } catch (error) {
      console.error('Error adding video:', error);
      setError('Erro ao adicionar vídeo');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await deleteProductVideo(videoId);
      await loadVideos(selectedProductId);
    } catch (error) {
      console.error('Error deleting video:', error);
      setError('Erro ao excluir vídeo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vídeos do Produto</h3>
        <Button onClick={() => handleAddVideo(selectedProductId, {
          productId: selectedProductId,
          title: 'Novo Vídeo',
          videoUrl: '',
        })}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Vídeo
        </Button>
      </div>

      {error && <Feedback type="error" message={error} />}

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Selecione o Produto</label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full rounded-lg border p-2"
        >
          <option value="">Selecione um produto</option>
          {/* Add product options dynamically */}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {videos.map((video) => (
            <Card key={video.id} className="p-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Video className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Título</label>
                  <input
                    type="text"
                    value={video.title}
                    onChange={() => {}}
                    className="w-full rounded-lg border p-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">URL do Vídeo</label>
                  <input
                    type="url"
                    value={video.videoUrl}
                    onChange={() => {}}
                    className="w-full rounded-lg border p-2"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Salvar</Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}