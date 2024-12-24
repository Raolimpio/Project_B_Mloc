import { useState, useRef } from 'react';
import { UserCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AvatarUploadProps {
  photoURL: string | null;
  onUpload: (file: File) => void;
  loading?: boolean;
}

export function AvatarUpload({ photoURL, onUpload, loading = false }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    onUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {photoURL || previewUrl ? (
          <img
            src={previewUrl || photoURL || ''}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <UserCircle className="w-32 h-32 text-muted-foreground" />
        )}
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        variant="outline"
        onClick={handleClick}
        disabled={loading}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        Alterar Foto
      </Button>
    </div>
  );
}