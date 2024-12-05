import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { UploadProgress } from '@/components/ui/upload-progress';
import { uploadImage } from '@/lib/upload-manager';
import type { SiteContent } from '@/lib/content';

interface BannerModalProps {
  banner?: SiteContent | null;
  onClose: () => void;
  onSave: (data: Partial<SiteContent>) => void;
}

export function BannerModal({ banner, onClose, onSave }: BannerModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    description: banner?.description || '',
    link: banner?.link || '',
    imageUrl: banner?.imageUrl || '',
    active: banner?.active ?? true,
  });

  const handleImageUpload = async (file: File) => {
    setUploadProgress(0);

    try {
      await uploadImage(file, `banners/${Date.now()}-${file.name}`, {
        onProgress: (progress) => setUploadProgress(progress),
        onComplete: (url) => {
          setFormData(prev => ({ ...prev, imageUrl: url }));
          setUploadProgress(null);
        },
        onError: (error) => {
          console.error('Error uploading image:', error);
          setUploadProgress(null);
        }
      });
    } catch (error) {
      console.error('Error handling image upload:', error);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving banner:', error);
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
          {banner ? 'Editar Banner' : 'Novo Banner'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Imagem do Banner</label>
            <div className="relative">
              <ImageUpload
                currentImageUrl={formData.imageUrl}
                onFileSelect={handleImageUpload}
                onRemove={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                aspectRatio="banner"
              />

              {uploadProgress !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <UploadProgress progress={uploadProgress} />
                </div>
              )}
            </div>
          </div>

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
            <label className="mb-1 block text-sm font-medium">Link (opcional)</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              placeholder="https://"
            />
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
              Banner Ativo
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