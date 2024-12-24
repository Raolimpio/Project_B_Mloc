import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { collection, getDocs, query, where, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
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

interface HeroBannerSettings {
  imageUrl: string;
  title: string;
  subtitle: string;
}

export function HeroSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [allMachines, setAllMachines] = useState<IMaquina[]>([]);
  const [filteredResults, setFilteredResults] = useState<IMaquina[]>([]);
  const [loading, setLoading] = useState(true);
  const [gruposCategoria, setGruposCategoria] = useState<{[key: string]: Categoria}>({});
  const [bannerSettings, setBannerSettings] = useState<HeroBannerSettings>({
    imageUrl: '',
    title: 'Encontre o equipamento ideal para seu projeto',
    subtitle: 'Alugue máquinas e equipamentos de qualidade'
  });

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

  // Carregar configurações do banner
  useEffect(() => {
    const loadBannerSettings = async () => {
      try {
        console.log('Carregando banner na home...');
        const siteSettingsRef = doc(db, 'site-settings', 'home');
        const siteSettingsDoc = await getDoc(siteSettingsRef);
        
        if (siteSettingsDoc.exists()) {
          const data = siteSettingsDoc.data();
          console.log('Dados do site-settings:', data);
          if (data.heroBanner) {
            console.log('Banner encontrado na home:', data.heroBanner);
            setBannerSettings(prev => ({
              ...prev,
              ...data.heroBanner
            }));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do banner:', error);
      }
    };

    loadBannerSettings();
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
    <div className="relative bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Banner com bordas arredondadas e contido */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
          {/* Background image sem efeitos */}
          {bannerSettings.imageUrl && (
            <img
              src={bannerSettings.imageUrl}
              alt="Banner background"
              className="h-[400px] w-full object-cover"
            />
          )}

          {/* Textos opcionais */}
          {(bannerSettings.title || bannerSettings.subtitle) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              {bannerSettings.title && (
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                  {bannerSettings.title}
                </h1>
              )}
              {bannerSettings.subtitle && (
                <p className="mx-auto mt-3 max-w-md text-base text-gray-100 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                  {bannerSettings.subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Barra de busca */}
        <div className="relative -mt-10 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busque por máquinas..."
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/95 backdrop-blur-sm 
                text-gray-900 placeholder-gray-500 shadow-lg text-sm sm:text-base
                focus:outline-none focus:ring-2 focus:ring-secondary-500
                transition-all duration-200"
            />
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
              {loading ? (
                <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-secondary-500 border-t-transparent" />
              ) : (
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500" />
              )}
            </div>
          </div>

          {/* Resultados da busca */}
          {filteredResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border-2 border-primary-100 
              max-h-[60vh] sm:max-h-96 overflow-y-auto z-50">
              {filteredResults.map((machine) => (
                <button
                  key={machine.id}
                  onClick={() => handleMachineClick(machine)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-primary-50 flex items-center gap-2 sm:gap-4
                    border-b border-gray-100 last:border-none transition-colors duration-200"
                >
                  {machine.imagemProduto && (
                    <img
                      src={machine.imagemProduto}
                      alt={machine.nome}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-primary-600 text-sm sm:text-base">{machine.nome}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{machine.descricaoBreve}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categorias Populares */}
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-3 gap-3 sm:gap-8 max-w-2xl mx-auto">
            {Object.values(gruposCategoria)
              .sort((a, b) => a.ordem - b.ordem)
              .slice(0, 3)
              .map((grupo) => (
                <button
                  key={grupo.id}
                  onClick={() => handleCategoriaClick(grupo.id)}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white mb-2 sm:mb-3">
                    {grupo.iconeUrl && (
                      <img
                        src={grupo.iconeUrl}
                        alt={grupo.nome}
                        className="w-full h-full object-contain p-2"
                      />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white text-center">
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