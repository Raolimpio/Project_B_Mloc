import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

interface AvatarUploadProps {
  currentPhotoURL?: string | null;
  onFileSelect: (file: File) => void;
  loading?: boolean;
}

export function AvatarUpload({ currentPhotoURL, onFileSelect, loading }: AvatarUploadProps) {
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreviewURL(null);
    // Reset file input
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <Avatar
          src={previewURL || currentPhotoURL}
          size="lg"
          className="ring-2 ring-white ring-offset-2 ring-offset-blue-600"
        />
        <div className="flex-1">
          <h3 className="mb-1 font-medium">Foto do Perfil</h3>
          <p className="text-sm text-gray-500">
            Escolha uma foto para seu perfil. PNG, JPG ou GIF até 2MB.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={loading}
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {loading ? 'Enviando...' : 'Escolher Foto'}
        </Button>
        {(previewURL || currentPhotoURL) && (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemove}
            disabled={loading}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <X className="mr-2 h-4 w-4" />
            Remover
          </Button>
        )}
      </div>

      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}