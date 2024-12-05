import { useState, useEffect } from 'react';
import { Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCategoryIcons, updateCategoryIcon, uploadContentImage } from '@/lib/content';
import type { CategoryIcon } from '@/lib/content';

export function CategoryIconsEditor() {
  const [icons, setIcons] = useState<CategoryIcon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIcons();
  }, []);

  async function loadIcons() {
    try {
      const data = await getCategoryIcons();
      setIcons(data);
    } catch (error) {
      console.error('Error loading icons:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (file: File, iconId: string) => {
    try {
      const imageUrl = await uploadContentImage(file, `category-icons/${iconId}`);
      await updateCategoryIcon(iconId, { imageUrl });
      await loadIcons();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleIconUpdate = async (id: string, data: Partial<CategoryIcon>) => {
    try {
      await updateCategoryIcon(id, data);
      await loadIcons();
    } catch (error) {
      console.error('Error updating icon:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {icons.map((icon) => (
          <Card key={icon.id} className="p-4">
            <div className="relative h-24 w-24 mx-auto mb-4">
              {icon.imageUrl ? (
                <img
                  src={icon.imageUrl}
                  alt={icon.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-4xl">
                  {icon.icon}
                </div>
              )}
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-0 right-0"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      handleImageUpload(file, icon.id);
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nome</label>
                <input
                  type="text"
                  value={icon.name}
                  onChange={(e) => handleIconUpdate(icon.id, { name: e.target.value })}
                  className="w-full rounded-lg border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Emoji/Ícone</label>
                <input
                  type="text"
                  value={icon.icon}
                  onChange={(e) => handleIconUpdate(icon.id, { icon: e.target.value })}
                  className="w-full rounded-lg border p-2"
                />
              </div>

              <Button 
                className="w-full"
                onClick={() => handleIconUpdate(icon.id, { order: icon.order })}
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}