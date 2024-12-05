import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import type { MACHINE_CATEGORIES } from '@/lib/constants';

interface CategoryCardProps {
  category: typeof MACHINE_CATEGORIES[0];
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card hover>
      <div className="group relative aspect-video w-full overflow-hidden rounded-t-lg">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_CATEGORY_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white">{category.name}</h3>
          <p className="mt-1 text-sm text-white/80">
            {category.subcategories.length} subcategorias
          </p>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {category.subcategories.slice(0, 6).map((subcategory) => (
            <Badge key={subcategory} variant="secondary">
              {subcategory}
            </Badge>
          ))}
        </div>

        {category.subcategories.length > 6 && (
          <p className="mt-3 text-center text-sm text-gray-500">
            +{category.subcategories.length - 6} outras subcategorias
          </p>
        )}
      </CardContent>

      <CardFooter className="border-t p-4">
        <Link to={`/categories/${category.id}`} className="w-full">
          <Button className="w-full">
            Ver Máquinas
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}