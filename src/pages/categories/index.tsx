import { CategoryShowcase } from '@/components/home/category-showcase';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { ProductLayout } from '@/components/layout/product-layout';

export default function CategoriesPage() {
  return (
    <ProductLayout>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                {
                  label: 'Categorias'
                }
              ]}
            />
          </div>

          {/* Banner da categoria */}
          <div className="relative mb-8 overflow-hidden rounded-lg">
            <div className="h-48">
              <OptimizedImage
                src="/images/categories-banner.jpg"
                alt="Categorias de Máquinas"
                priority
                aspectRatio="auto"
                className="h-full"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white p-2 shadow-lg">
                  <OptimizedImage
                    src="/images/categories-icon.jpg"
                    alt=""
                    aspectRatio="square"
                    objectFit="contain"
                    priority
                    fallbackSrc="/placeholder-icon.jpg"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Categorias</h1>
                  <p className="mt-2 text-gray-200">
                    Encontre a máquina ideal para cada fase da sua obra
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <CategoryShowcase />
        </div>
      </main>
    </ProductLayout>
  );
}