import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { ProductLayout } from '../../components/layout/product-layout';
import { MachineGrid } from '../../components/machines/machine-grid';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { db } from '../../lib/firebase';

interface Maquina {
  id: string;
  nome: string;
  descricaoBreve: string;
  imagemProduto: string;
  precoPromocional: number;
  categorias: string[];
}

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  bannerUrl: string;
  iconeUrl: string;
  ordem: number;
  grupoPai?: string;
}

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Maquina[]>([]);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [subcategorias, setSubcategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const handleMachineClick = (machine: Maquina) => {
    navigate(`/machines/${machine.id}`);
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        if (!id) return;

        // Carregar dados da categoria
        const categoriaDoc = await getDoc(doc(db, 'categorias', id));
        if (!categoriaDoc.exists()) {
          console.error('Categoria não encontrada');
          return;
        }

        const categoriaData = categoriaDoc.data() as Categoria;
        setCategoria({ id: categoriaDoc.id, ...categoriaData });

        // Se for um grupo, carregar subcategorias
        if (categoriaData.tipo === 'grupo') {
          const subcatsQuery = query(
            collection(db, 'categorias'),
            where('grupoPai', '==', id)
          );
          const subcatsSnapshot = await getDocs(subcatsQuery);
          const subcatsData = subcatsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Categoria));
          setSubcategorias(subcatsData);

          // Para grupos, carregar máquinas de todas as subcategorias
          const machinesRef = collection(db, 'machines');
          const subcatIds = subcatsData.map(sub => sub.id);
          const q = query(
            machinesRef,
            where('categorias', 'array-contains-any', subcatIds)
          );
          const machinesSnapshot = await getDocs(q);
          const machinesData = machinesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Maquina));
          setMachines(machinesData);
        } else {
          // Se for uma categoria específica, carregar apenas suas máquinas
          const machinesRef = collection(db, 'machines');
          const q = query(
            machinesRef,
            where('categorias', 'array-contains', id)
          );
          const machinesSnapshot = await getDocs(q);
          const machinesData = machinesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Maquina));
          setMachines(machinesData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id]);

  if (loading) {
    return (
      <ProductLayout>
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 space-y-4">
                    <div className="h-48 bg-gray-200 rounded-md"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </ProductLayout>
    );
  }

  if (!categoria) {
    return (
      <ProductLayout>
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <p>Categoria não encontrada</p>
          </div>
        </main>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                {
                  label: 'Categorias',
                  href: '/categories'
                },
                {
                  label: categoria.nome
                }
              ]}
            />
          </div>

          {/* Banner da categoria */}
          <div className="relative h-48 w-full mb-8 rounded-lg overflow-hidden">
            <img
              src={categoria.bannerUrl}
              alt={categoria.nome}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white p-2 shadow-lg">
                  <img
                    src={categoria.iconeUrl}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{categoria.nome}</h1>
                  {categoria.descricao && (
                    <p className="text-gray-200 mt-2">{categoria.descricao}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mostrar subcategorias se for um grupo */}
          {categoria.tipo === 'grupo' && subcategorias.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Subcategorias</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subcategorias.map((subcat) => (
                  <Link
                    key={subcat.id}
                    to={`/categories/${subcat.id}`}
                    className="block p-4 rounded-lg border border-gray-200 hover:border-primary-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={subcat.iconeUrl}
                        alt={subcat.nome}
                        className="w-10 h-10 object-contain"
                      />
                      <span className="font-medium">{subcat.nome}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Grid de máquinas */}
          <MachineGrid machines={machines} onMachineClick={handleMachineClick} />
        </div>
      </main>
    </ProductLayout>
  );
}
