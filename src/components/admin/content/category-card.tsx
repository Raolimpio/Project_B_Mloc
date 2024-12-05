import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import type { SiteContent } from '@/lib/content';

interface CategoryCardProps {
  category: SiteContent;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={category.imageUrl || DEFAULT_CATEGORY_IMAGE}
          alt={category.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_CATEGORY_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-semibold text-white">{category.title}</h3>
          {category.description && (
            <p className="mt-1 text-sm text-white/80">{category.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${category.active ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-600">
            {category.active ? 'Ativa' : 'Inativa'}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
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