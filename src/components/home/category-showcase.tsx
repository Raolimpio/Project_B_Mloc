import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { OptimizedImage } from '../ui/optimized-image';

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  bannerUrl: string;
  iconeUrl: string;
  ordem?: number;
}

export function CategoryShowcase() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        // Buscar apenas as categorias principais (grupo)
        const categoriasRef = collection(db, 'categorias');
        const q = query(
          categoriasRef,
          where('grupo', '==', true)
        );
        const snapshot = await getDocs(q);
        
        const categoriasData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Categoria));

        setCategorias(categoriasData);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarCategorias();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="animate-pulse rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 h-6 w-3/4 rounded bg-gray-200"></div>
            <div className="mb-4 h-48 w-full rounded-md bg-gray-200"></div>
            <div className="h-4 w-full rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <Link
            key={categoria.id}
            to={`/categories/${categoria.id}`}
            className="group relative overflow-hidden rounded-lg"
          >
            <div className="aspect-[16/9]">
              <OptimizedImage
                src={categoria.bannerUrl}
                alt={categoria.nome}
                aspectRatio="16:9"
                className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                fallbackSrc="/placeholder-category.jpg"
                quality={85}
                priority={true}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{categoria.nome}</h3>
              <p className="text-sm text-white/90">{categoria.descricao}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
