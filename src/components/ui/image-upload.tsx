import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './button';
import { uploadImage } from '@/lib/upload-manager';
import { UploadProgress } from './upload-progress';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onFileSelect: (file: File) => void;
  onUploadComplete: (url: string) => void;
  folder: string;
  id: string;
  onRemove?: () => void;
  loading?: boolean;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
}

export function ImageUpload({
  currentImageUrl,
  onFileSelect,
  onUploadComplete,
  folder,
  id,
  onRemove,
  loading,
  className,
  aspectRatio = 'square'
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[3/1]'
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Notificar seleção do arquivo
      onFileSelect(file);

      // Iniciar upload
      setUploadProgress(0);
      const path = `${folder}/${id}/${Date.now()}-${file.name}`;
      
      await uploadImage(file, path, {
        onProgress: (progress) => setUploadProgress(progress),
        onComplete: (url) => {
          setUploadProgress(null);
          onUploadComplete(url);
        },
        onError: (error) => {
          setError(error.message);
          setUploadProgress(null);
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar imagem');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  return (
    <div className={className}>
      <div className={`relative ${aspectRatioClasses[aspectRatio]} w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50`}>
        {(previewUrl || currentImageUrl) ? (
          <>
            <img
              src={previewUrl || currentImageUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemove}
              className="absolute right-2 top-2"
              disabled={loading || uploadProgress !== null}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="mb-1 text-sm font-medium text-gray-600">
              Clique para enviar ou arraste uma imagem
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG ou WebP até 5MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading || uploadProgress !== null}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        {uploadProgress !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <UploadProgress progress={uploadProgress} />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}