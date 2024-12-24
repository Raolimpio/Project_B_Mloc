import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
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
  const [gruposCategoria, setGruposCategoria] = useState<{[key: string]: Categoria}>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const categoriasRef = collection(db, 'categorias');
        const snapshot = await getDocs(categoriasRef);
        
        const grupos: {[key: string]: Categoria} = {};
        
        snapshot.docs.forEach(doc => {
          const data = doc.data() as Categoria;
          if (data.tipo === 'grupo') {
            grupos[doc.id] = {
              id: doc.id,
              nome: data.nome,
              descricao: data.descricao,
              tipo: data.tipo,
              bannerUrl: data.bannerUrl,
              iconeUrl: data.iconeUrl,
              ordem: data.ordem || 0
            };
          }
        });

        setGruposCategoria(grupos);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="relative overflow-hidden rounded-2xl shadow-md">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-300 rounded" />
                    <div className="h-3 w-32 bg-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.values(gruposCategoria)
          .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
          .map((grupo) => (
            <Link
              key={grupo.id}
              to={`/categories/${grupo.id}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64">
                <OptimizedImage
                  src={grupo.bannerUrl}
                  alt={grupo.nome}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
