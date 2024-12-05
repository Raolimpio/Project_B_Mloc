import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Upload, Trash2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SiteContent } from '@/lib/content';

interface SortableBannerItemProps {
  banner: SiteContent;
  onUpdate: (id: string, data: Partial<SiteContent>) => void;
  onDelete: (id: string, imageUrl?: string) => void;
  onImageUpload: (file: File, bannerId: string) => void;
}

export function SortableBannerItem({ 
  banner,
  onUpdate,
  onDelete,
  onImageUpload,
}: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4">
      <div className="flex items-start gap-4">
        <button
          {...attributes}
          {...listeners}
          className="mt-2 cursor-move text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Título</label>
              <input
                type="text"
                value={banner.title}
                onChange={(e) => onUpdate(banner.id, { title: e.target.value })}
                className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Link</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={banner.link || ''}
                  onChange={(e) => onUpdate(banner.id, { link: e.target.value })}
                  className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-primary-600 focus:outline-none"
                  placeholder="https://"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Descrição</label>
            <textarea
              value={banner.description || ''}
              onChange={(e) => onUpdate(banner.id, { description: e.target.value })}
              className="h-20 w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
            />
          </div>

          <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg bg-gray-100">
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500">Nenhuma imagem selecionada</p>
              </div>
            )}
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      onImageUpload(file, banner.id);
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Imagem
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(banner.id, banner.imageUrl)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={banner.active}
                onChange={(e) => onUpdate(banner.id, { active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              />
              <span className="text-sm">Banner Ativo</span>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}