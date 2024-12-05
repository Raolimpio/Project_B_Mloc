import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Play } from 'lucide-react';
import type { ProductVideo } from '@/lib/content';

interface ProductVideoCardProps {
  video: ProductVideo;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductVideoCard({ video, onEdit, onDelete }: ProductVideoCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <Play className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-1 font-medium">{video.title}</h3>
        <p className="mb-4 text-sm text-gray-500">
          {new URL(video.videoUrl).hostname}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}