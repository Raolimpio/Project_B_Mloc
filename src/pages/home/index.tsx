import { Header } from '@/components/layout/header';
import { HomeFooter } from '@/components/layout/home-footer';
import { FeaturedMachines } from '@/components/home/featured-machines';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { CONSTRUCTION_PHASES, MACHINE_CATEGORIES, WORK_TYPES } from '@/lib/constants';
import { ICategoria } from '@/types/machine.types';

interface HeroBanner {
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
}

export function HomePage() {
  const [heroBanner, setHeroBanner] = useState<HeroBanner | null>(null);
  const [categories, setCategories] = useState<ICategoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Carregar dados em paralelo
        const [homeDocPromise, categoriesPromise] = await Promise.all([
          getDoc(doc(db, 'site-settings', 'home')),
          getDocs(collection(db, 'categorias'))
        ]);

        // Processar dados do banner
        if (homeDocPromise.exists()) {
          const data = homeDocPromise.data();
          if (data.heroBanner?.imageUrl) {
            const banner: HeroBanner = {
              imageUrl: data.heroBanner.imageUrl,
              ...(data.heroBanner.title?.trim() ? { title: data.heroBanner.title } : {}),
              ...(data.heroBanner.subtitle?.trim() ? { subtitle: data.heroBanner.subtitle } : {}),
              ...(data.heroBanner.buttonText?.trim() ? { buttonText: data.heroBanner.buttonText } : {}),
              ...(data.heroBanner.buttonLink?.trim() ? { buttonLink: data.heroBanner.buttonLink } : {})
            };
            setHeroBanner(banner);
          }
        }

        // Processar categorias
        const categoriesData = categoriesPromise.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ICategoria[];
        
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados da home:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Pegar as 3 principais categorias para os banners
  const mainCategories = categories
    .filter(cat => !cat.grupoPai) // Apenas categorias principais
    .sort((a, b) => a.ordem - b.ordem)
    .slice(0, 3);

  // Pegar as 5 subcategorias mais importantes
  const topSubcategories = categories
    .filter(cat => cat.grupoPai) // Apenas subcategorias
    .sort((a, b) => a.ordem - b.ordem)
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Banner Hero */}
        <section className="container mx-auto px-4 py-6">
          {heroBanner && (
            <div className="relative h-[400px] rounded-lg overflow-hidden w-full shadow-md">
              <img 
                src={heroBanner.imageUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              {(heroBanner.title || heroBanner.subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-center text-white px-6">
                  {heroBanner.title && (
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">{heroBanner.title}</h1>
                  )}
                  {heroBanner.subtitle && (
                    <p className="text-lg mb-4">{heroBanner.subtitle}</p>
                  )}
                  {heroBanner.buttonText && (
                    <Button 
                      size="lg"
                      className="w-fit"
                    >
                      {heroBanner.buttonText}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Banners de Categorias */}
        <section className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mainCategories.map((category) => (
              <a 
                key={category.id}
                href={`/categories/${category.id}`}
                className="group relative h-56 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img 
                  src={category.bannerUrl || '/placeholder.jpg'} 
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </section>

        {/* Subcategorias */}
        <section className="bg-gray-50 py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {topSubcategories.map((subcat) => (
                <a 
                  key={subcat.id}
                  href={`/categories/${subcat.id}`}
                  className="flex flex-col items-center p-3 bg-white rounded-lg hover:shadow-sm transition-all duration-300"
                >
                  <img 
                    src={subcat.iconeUrl} 
                    alt={subcat.nome}
                    className="w-10 h-10 mb-2"
                  />
                  <span className="text-sm text-center">{subcat.nome}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Máquinas em Destaque */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <FeaturedMachines />
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}