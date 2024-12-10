import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Image } from '../ui/image';

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
  const [gruposCategoria, setGruposCategoria] = useState<{[key: string]: Categoria}>({});
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(gruposCategoria)
            .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
            .map((grupo) => (
              <Link
                key={grupo.id}
                to={`/categories/${grupo.id}`}
                className="group block relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
              >
                {/* Banner da categoria */}
                <div className="relative h-48 w-full">
                  <Image
                    src={grupo.bannerUrl}
                    alt={grupo.nome}
                    className="w-full h-full transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                </div>
                
                {/* Conteúdo sobreposto */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white p-2 shadow-lg">
                      <Image
                        src={grupo.iconeUrl}
                        alt=""
                        className="w-full h-full object-contain"
                        fallbackSrc="/placeholder-icon.jpg"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{grupo.nome}</h3>
                      {grupo.descricao && (
                        <p className="text-sm text-white/80">{grupo.descricao}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
