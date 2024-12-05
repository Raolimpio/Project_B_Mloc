import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryCard } from './category-card';
import { CategoryModal } from './category-modal';
import { getContent, createContent, updateContent, deleteContent } from '@/lib/content';
import type { SiteContent } from '@/lib/content';

export function CategoryManager() {
  const [categories, setCategories] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<SiteContent | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getContent('category');
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (data: Partial<SiteContent>) => {
    try {
      if (selectedCategory) {
        await updateContent(selectedCategory.id, data);
      } else {
        await createContent({
          type: 'category',
          order: categories.length,
          active: true,
          ...data
        } as SiteContent);
      }
      await loadCategories();
      setShowModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteContent(categoryId);
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categorias de Máquinas</h3>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={() => {
              setSelectedCategory(category);
              setShowModal(true);
            }}
            onDelete={() => handleDelete(category.id)}
          />
        ))}
      </div>

      {showModal && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => {
            setShowModal(false);
            setSelectedCategory(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}