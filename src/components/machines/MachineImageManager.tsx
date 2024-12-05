import { useState, useCallback } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadProgress } from '@/components/ui/upload-progress';
import { uploadMachineImage, deleteMachineImage } from '@/lib/storage';
import Logger from '@/lib/logger';

interface MachineImageManagerProps {
  machineId: string;
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string) => void;
}

export function MachineImageManager({
  machineId,
  currentImageUrl,
  onImageUpdate
}: MachineImageManagerProps) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      // Delete existing image if any
      if (currentImageUrl) {
        await deleteMachineImage(currentImageUrl);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => prev !== null && prev < 90 ? prev + 10 : prev);
      }, 200);

      // Upload new image
      const imageUrl = await uploadMachineImage(machineId, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      onImageUpdate(imageUrl);
      
      setTimeout(() => setUploadProgress(null), 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      Logger.error('Image upload failed', error as Error);
    } finally {
      setLoading(false);
    }
  }, [machineId, currentImageUrl, onImageUpdate]);

  const handleImageDelete = useCallback(async () => {
    if (!currentImageUrl) return;

    try {
      setLoading(true);
      setError(null);
      await deleteMachineImage(currentImageUrl);
      onImageUpdate('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Delete failed');
      Logger.error('Image delete failed', error as Error);
    } finally {
      setLoading(false);
    }
  }, [currentImageUrl, onImageUpdate]);

  return (
    <div className="relative">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        {currentImageUrl ? (
          <>
            <img
              src={currentImageUrl}
              alt="Machine"
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
                Change Image
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
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG or WebP up to 5MB
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