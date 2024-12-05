import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { UploadProgress } from '@/components/ui/upload-progress';
import { uploadImage } from '@/lib/upload-manager';
import type { ProductVideo } from '@/lib/content';

interface ProductVideoModalProps {
  video?: ProductVideo | null;
  onClose: () => void;
  onSave: (data: Partial<ProductVideo>) => void;
}

export function ProductVideoModal({ video, onClose, onSave }: ProductVideoModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: video?.title || '',
    videoUrl: video?.videoUrl || '',
    thumbnailUrl: video?.thumbnailUrl || '',
    productId: video?.productId || '',
    order: video?.order || 0,
  });

  const handleThumbnailUpload = async (file: File) => {
    setUploadProgress(0);

    try {
      await uploadImage(file, `videos/thumbnails/${Date.now()}-${file.name}`, {
        onProgress: (progress) => setUploadProgress(progress),
        onComplete: (url) => {
          setFormData(prev => ({ ...prev, thumbnailUrl: url }));
          setUploadProgress(null);
        },
        onError: (error) => {
          console.error('Error uploading thumbnail:', error);
          setUploadProgress(null);
        }
      });
    } catch (error) {
      console.error('Error handling thumbnail upload:', error);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving video:', error);
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
          {video ? 'Editar Vídeo' : 'Novo Vídeo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              placeholder="Título do vídeo"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">URL do Vídeo</label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Thumbnail</label>
            <div className="relative">
              <ImageUpload
                currentImageUrl={formData.thumbnailUrl}
                onFileSelect={handleThumbnailUpload}
                onRemove={() => setFormData(prev => ({ ...prev, thumbnailUrl: '' }))}
                aspectRatio="video"
              />

              {uploadProgress !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <UploadProgress progress={uploadProgress} />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Produto</label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
            >
              <option value="">Selecione um produto</option>
              {/* TODO: Adicionar lista de produtos */}
            </select>
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
              disabled={loading || uploadProgress !== null}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}