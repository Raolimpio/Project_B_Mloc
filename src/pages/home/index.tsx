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

  useEffect(() => {
    const fetchHomeData = async () => {
      // Buscar configurações da home
      const homeDoc = await getDoc(doc(db, 'site-settings', 'home'));
      if (homeDoc.exists()) {
        const data = homeDoc.data();
        if (data.heroBanner?.imageUrl) {
          // Só carregar campos que existem, não auto-preencher
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

      // Buscar categorias
      const categoriesRef = collection(db, 'categorias');
      const categoriesSnapshot = await getDocs(categoriesRef);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ICategoria[];
      setCategories(categoriesData);
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
        <div className="container mx-auto px-4 py-12">
          {heroBanner && (
            <div 
              className="relative h-[400px] rounded-2xl overflow-hidden w-full"
            >
              <img 
                src={heroBanner.imageUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              {(heroBanner.title || heroBanner.subtitle) && (
                <div className="absolute inset-0 flex flex-col justify-center text-white px-8">
                  {heroBanner.title && (
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroBanner.title}</h1>
                  )}
                  {heroBanner.subtitle && (
                    <p className="text-xl mb-8">{heroBanner.subtitle}</p>
                  )}
                  {heroBanner.buttonText && (
                    <Button 
                      size="lg" 
                      asChild
                      className="w-fit"
                    >
                      <a href={heroBanner.buttonLink}>{heroBanner.buttonText}</a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Banners de Categorias */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {mainCategories.map((category) => (
              <a 
                key={category.id}
                href={`/categories/${category.id}`}
                className="relative h-48 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
              >
                <img 
                  src={category.bannerUrl || '/placeholder.jpg'} 
                  alt=""
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Subcategorias */}
        <div className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {topSubcategories.map((subcat) => (
                <a 
                  key={subcat.id}
                  href={`/categories/${subcat.id}`}
                  className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <img 
                    src={subcat.iconeUrl} 
                    alt={subcat.nome}
                    className="w-12 h-12 mb-2"
                  />
                  <span className="text-sm text-center">{subcat.nome}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="container mx-auto px-4 py-8">
          <FeaturedMachines />
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}