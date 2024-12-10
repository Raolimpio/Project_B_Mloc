import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import debounce from 'lodash/debounce';
import { Button } from '@/components/ui/button';

interface IMaquina {
  id: string;
  nome: string;
  descricao: string;
  descricaoBreve: string;
  disponivel: boolean;
  precoPromocional?: number;
  imagemProduto?: string;
  especificacoes?: { [key: string]: string };
  marca?: string;
  modelo?: string;
  localizacao?: { cidade: string; estado: string };
}

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  bannerUrl: string;
  iconeUrl: string;
  ordem: number;
}

export function HeroSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [allMachines, setAllMachines] = useState<IMaquina[]>([]);
  const [filteredResults, setFilteredResults] = useState<IMaquina[]>([]);
  const [loading, setLoading] = useState(true);
  const [gruposCategoria, setGruposCategoria] = useState<{[key: string]: Categoria}>({});

  // Carregar todas as máquinas uma vez só
  useEffect(() => {
    const loadMachines = async () => {
      try {
        const machinesRef = collection(db, 'machines');
        const snapshot = await getDocs(machinesRef);
        
        const machines = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Dados da máquina:', data); // Para debug
          return {
            id: doc.id,
            ...data
          } as IMaquina;
        });

        setAllMachines(machines);
      } catch (error) {
        console.error('Erro ao carregar máquinas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMachines();
  }, []);

  // Carregar grupos de categoria do Firebase
  useEffect(() => {
    const carregarGrupos = async () => {
      try {
        const categoriasRef = collection(db, 'categorias');
        const snapshot = await getDocs(categoriasRef);
        
        console.log('Total de documentos:', snapshot.docs.length);
        
        const grupos: {[key: string]: Categoria} = {};
        
        snapshot.docs.forEach(doc => {
          const data = doc.data() as Categoria;
          console.log('Categoria encontrada:', {
            id: doc.id,
            tipo: data.tipo,
            nome: data.nome,
            iconeUrl: data.iconeUrl
          });
          
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

        console.log('Grupos filtrados:', grupos);
        setGruposCategoria(grupos);
      } catch (error) {
        console.error('Erro ao carregar grupos:', error);
      }
    };

    carregarGrupos();
  }, []);

  const handleMachineClick = (machine: IMaquina) => {
    if (machine.id) {
      navigate(`/machines/${machine.id}`);
    }
  };

  const handleCategoriaClick = (grupoId: string) => {
    navigate(`/categories/${grupoId}`);
  };

  // Função de busca local com debounce
  const filterMachines = debounce((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();
    
    const filtered = allMachines.filter((machine) => {
      // Busca no nome
      const nameMatch = machine.nome?.toLowerCase().includes(searchTermLower);
      
      // Busca na descrição breve
      const shortDescMatch = machine.descricaoBreve?.toLowerCase().includes(searchTermLower);
      
      // Busca na descrição completa
      const descMatch = machine.descricao?.toLowerCase().includes(searchTermLower);
      
      // Busca nas especificações (se existirem)
      const specsMatch = machine.especificacoes ? 
        Object.values(machine.especificacoes).some(
          value => value?.toLowerCase().includes(searchTermLower)
        ) : false;
      
      // Busca na marca e modelo (se existirem)
      const brandMatch = machine.marca?.toLowerCase().includes(searchTermLower);
      const modelMatch = machine.modelo?.toLowerCase().includes(searchTermLower);
      
      // Busca na localização (se existir)
      const locationMatch = machine.localizacao ? (
        machine.localizacao.cidade?.toLowerCase().includes(searchTermLower) ||
        machine.localizacao.estado?.toLowerCase().includes(searchTermLower)
      ) : false;

      // Retorna true se encontrar em qualquer um dos campos
      return nameMatch || shortDescMatch || descMatch || specsMatch || 
             brandMatch || modelMatch || locationMatch;
    });

    setFilteredResults(filtered);
  }, 300);

  // Efeito para buscar quando o termo muda
  useEffect(() => {
    filterMachines(searchTerm);
    
    return () => {
      filterMachines.cancel();
    };
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Encontre o Equipamento Ideal para seu Projeto
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-12">
            Locação simplificada de máquinas e equipamentos para construção civil
          </p>
        </div>

        {/* Barra de Busca */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busque por máquinas, marcas ou modelos..."
              className="w-full px-6 py-4 rounded-xl bg-white/95 backdrop-blur-sm 
                text-gray-900 placeholder-gray-500 shadow-lg
                focus:outline-none focus:ring-2 focus:ring-secondary-500
                transition-all duration-200"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary-500 border-t-transparent" />
              ) : (
                <Search className="w-5 h-5 text-secondary-500" />
              )}
            </div>
          </div>

          {/* Resultados da busca */}
          {filteredResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border-2 border-primary-100 
              max-h-96 overflow-y-auto z-50">
              {filteredResults.map((machine) => (
                <button
                  key={machine.id}
                  onClick={() => handleMachineClick(machine)}
                  className="w-full px-4 py-3 text-left hover:bg-primary-50 flex items-center gap-4
                    border-b border-gray-100 last:border-none transition-colors duration-200"
                >
                  {machine.imagemProduto && (
                    <img
                      src={machine.imagemProduto}
                      alt={machine.nome}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-primary-600">{machine.nome}</h3>
                    <p className="text-sm text-gray-500">{machine.descricaoBreve}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categorias Populares */}
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {Object.values(gruposCategoria)
              .sort((a, b) => a.ordem - b.ordem)
              .slice(0, 3)
              .map((grupo) => (
                <button
                  key={grupo.id}
                  onClick={() => handleCategoriaClick(grupo.id)}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white mb-3">
                    {grupo.iconeUrl && (
                      <img
                        src={grupo.iconeUrl}
                        alt={grupo.nome}
                        className="w-full h-full object-contain p-2"
                      />
                    )}
                  </div>
                  <p className="text-sm font-medium text-white text-center">
                    {grupo.nome}
                  </p>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}