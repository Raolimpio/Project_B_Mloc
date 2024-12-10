import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Image } from '@/components/ui/image';

export default function CategoriesPage() {
  return (
    <>
      <Header />
      <main>
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
          <div className="relative h-48 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src="/images/categories-banner.jpg"
              alt="Categorias de Máquinas"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white p-2 shadow-lg">
                  <Image
                    src="/images/categories-icon.jpg"
                    alt=""
                    className="w-full h-full object-contain"
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
      <Footer />
    </>
  );
}