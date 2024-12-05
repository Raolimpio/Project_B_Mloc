import { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadProgress } from '@/components/ui/upload-progress';
import { uploadMachineImage, deleteMachineImage } from '@/lib/storage';
import { updateMachine } from '@/lib/machines';

interface MachineImageManagerProps {
  machineId: string;
  currentImageUrl?: string;
  onImageUpdate: (newImageUrl: string) => void;
}

export function MachineImageManager({ 
  machineId, 
  currentImageUrl,
  onImageUpdate 
}: MachineImageManagerProps) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      // Se já existe uma imagem, deletar primeiro
      if (currentImageUrl) {
        await deleteMachineImage(currentImageUrl);
      }

      // Upload da nova imagem
      const imageUrl = await uploadMachineImage(machineId, file);
      
      // Atualizar a máquina com a nova URL
      await updateMachine(machineId, { imageUrl });
      
      onImageUpdate(imageUrl);
      setUploadProgress(100);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Falha ao fazer upload da imagem. Tente novamente.');
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(null), 1000);
    }
  };

  const handleImageDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      if (currentImageUrl) {
        await deleteMachineImage(currentImageUrl);
        await updateMachine(machineId, { imageUrl: '' });
        onImageUpdate('');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Falha ao excluir imagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        {currentImageUrl ? (
          <>
            <img
              src={currentImageUrl}
              alt="Imagem da máquina"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => document.getElementById('machine-image-input')?.click()}
                disabled={loading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Trocar Imagem
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleImageDelete}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <label 
            htmlFor="machine-image-input" 
            className="flex h-full cursor-pointer flex-col items-center justify-center"
          >
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="mb-1 text-sm font-medium text-gray-600">
              Clique para enviar ou arraste uma imagem
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG ou WebP até 5MB
            </p>
          </label>
        )}

        <input
          id="machine-image-input"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
          className="hidden"
          disabled={loading}
        />
      </div>

      {uploadProgress !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <UploadProgress progress={uploadProgress} />
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}