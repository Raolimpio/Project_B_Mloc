import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore';
import { storage, db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth-context';
import { CategoryModal } from './CategoryModal';
import { 
  IMaquina,
  ESTADOS_BRASILEIROS,
  ICategoria
} from '../../types/machine.types';

interface MachineFormProps {
  onSubmit: (data: IMaquina) => void;
  initialData?: Partial<IMaquina>;
}

interface CategoriasPorTipo {
  tipoTrabalho: ICategoria[];
  faseObra: ICategoria[];
  aplicacao: ICategoria[];
}

export const MachineForm: React.FC<MachineFormProps> = ({ onSubmit, initialData }) => {
  const { userProfile } = useAuth();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<IMaquina>({
    defaultValues: {
      ...initialData,
      proprietarioId: userProfile?.uid,
      categorias: initialData?.categorias || [],
      categoriasDetalhadas: {
        tipoTrabalho: initialData?.categoriasDetalhadas?.tipoTrabalho || [],
        faseDaObra: initialData?.categoriasDetalhadas?.faseDaObra || [],
        aplicacao: initialData?.categoriasDetalhadas?.aplicacao || []
      },
      disponivel: initialData?.disponivel ?? true,
      destaque: initialData?.destaque ?? false
    }
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState<{
    show: boolean;
    tipo: 'tipoTrabalho' | 'faseObra' | 'aplicacao' | null;
  }>({ show: false, tipo: null });
  const [categorias, setCategorias] = useState<CategoriasPorTipo>({
    tipoTrabalho: [],
    faseObra: [],
    aplicacao: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const categoriasRef = collection(db, 'categorias');
        const snapshot = await getDocs(categoriasRef);
        
        const categoriasAgrupadas: CategoriasPorTipo = {
          tipoTrabalho: [],
          faseObra: [],
          aplicacao: []
        };

        snapshot.docs.forEach(doc => {
          const categoria = { id: doc.id, ...doc.data() } as ICategoria;
          switch(categoria.tipo) {
            case 'tipoTrabalho':
              categoriasAgrupadas.tipoTrabalho.push(categoria);
              break;
            case 'faseObra':
              categoriasAgrupadas.faseObra.push(categoria);
              break;
            case 'aplicacao':
              categoriasAgrupadas.aplicacao.push(categoria);
              break;
          }
        });

        ['tipoTrabalho', 'faseObra', 'aplicacao'].forEach(tipo => {
          categoriasAgrupadas[tipo].sort((a, b) => a.nome.localeCompare(b.nome));
        });

        setCategorias(categoriasAgrupadas);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategorias();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const imageRef = ref(storage, `machines/${userProfile?.uid}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(imageRef, file);
        return getDownloadURL(snapshot.ref);
      });

      const urls = await Promise.all(uploadPromises);
      
      setValue('imagemProduto', urls[0]);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setValue('localizacao.coordenadas.lat', position.coords.latitude);
        setValue('localizacao.coordenadas.lng', position.coords.longitude);
      });
    }
  };

  const handleCategorySuccess = () => {
    const carregarCategorias = async () => {
      try {
        const categoriasRef = collection(db, 'categorias');
        const snapshot = await getDocs(categoriasRef);
        
        const novasCategorias: CategoriasPorTipo = {
          tipoTrabalho: [],
          faseObra: [],
          aplicacao: []
        };

        snapshot.docs.forEach(doc => {
          const categoria = { id: doc.id, ...doc.data() } as ICategoria;
          switch (categoria.tipo) {
            case 'tipoTrabalho':
              novasCategorias.tipoTrabalho.push(categoria);
              break;
            case 'faseObra':
              novasCategorias.faseObra.push(categoria);
              break;
            case 'aplicacao':
              novasCategorias.aplicacao.push(categoria);
              break;
          }
        });

        setCategorias(novasCategorias);
      } catch (error) {
        console.error('Erro ao recarregar categorias:', error);
      }
    };

    carregarCategorias();
    setShowCategoryModal({ show: false, tipo: null });
  };

  const handleFormSubmit = (data: IMaquina) => {
    const categoriaIds: string[] = [];
    
    if (data.categoriasDetalhadas?.tipoTrabalho) {
      data.categoriasDetalhadas.tipoTrabalho.forEach(tipo => {
        categoriaIds.push(tipo);
      });
    }
    
    if (data.categoriasDetalhadas?.faseDaObra) {
      data.categoriasDetalhadas.faseDaObra.forEach(fase => {
        categoriaIds.push(fase);
      });
    }
    
    if (data.categoriasDetalhadas?.aplicacao) {
      data.categoriasDetalhadas.aplicacao.forEach(app => {
        categoriaIds.push(app);
      });
    }

    data.categorias = categoriaIds;

    if (typeof data.precoPromocional === 'string' && data.precoPromocional) {
      data.precoPromocional = parseFloat(data.precoPromocional);
    }

    if (!data.disponivel) {
      data.disponivel = false;
    }

    onSubmit(data);
  };

  if (!userProfile) {
    return <div>Você precisa estar logado para cadastrar uma máquina.</div>;
  }

  if (loading) {
    return <div>Carregando categorias...</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Informações Básicas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome da Máquina <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('nome', { required: 'Nome é obrigatório' })}
              className="w-full border rounded p-2"
            />
            {errors.nome && (
              <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Preço Promocional (R$/dia) <span className="text-gray-500 text-xs">(opcional)</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register('precoPromocional')}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('disponivel')}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium">Disponível para Locação</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('destaque')}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium">Produto em Destaque</span>
            </label>
          </div>
        </div>
      </div>

      {/* Descrições */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Descrições</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição Breve <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('descricaoBreve', { required: 'Descrição breve é obrigatória' })}
              className="w-full border rounded p-2"
            />
            {errors.descricaoBreve && (
              <p className="text-red-500 text-sm mt-1">{errors.descricaoBreve.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição Completa <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('descricao', { required: 'Descrição é obrigatória' })}
              rows={4}
              className="w-full border rounded p-2"
            />
            {errors.descricao && (
              <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Categorias</h3>
        
        {/* Tipo de Trabalho */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              Tipos de Trabalho <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryModal({ show: true, tipo: 'tipoTrabalho' })}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              + Adicionar Novo
            </button>
          </div>
          <select
            multiple
            {...register('categoriasDetalhadas.tipoTrabalho', { required: 'Selecione pelo menos um tipo de trabalho' })}
            className="w-full border rounded p-2"
          >
            {categorias.tipoTrabalho.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          {errors.categoriasDetalhadas?.tipoTrabalho && (
            <p className="text-red-500 text-sm mt-1">{errors.categoriasDetalhadas.tipoTrabalho.message}</p>
          )}
        </div>

        {/* Fase da Obra */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              Fases da Obra <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryModal({ show: true, tipo: 'faseObra' })}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              + Adicionar Nova
            </button>
          </div>
          <select
            multiple
            {...register('categoriasDetalhadas.faseDaObra', { required: 'Selecione pelo menos uma fase' })}
            className="w-full border rounded p-2"
          >
            {categorias.faseObra.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          {errors.categoriasDetalhadas?.faseDaObra && (
            <p className="text-red-500 text-sm mt-1">{errors.categoriasDetalhadas.faseDaObra.message}</p>
          )}
        </div>

        {/* Aplicação */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              Aplicações <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryModal({ show: true, tipo: 'aplicacao' })}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              + Adicionar Nova
            </button>
          </div>
          <select
            multiple
            {...register('categoriasDetalhadas.aplicacao', { required: 'Selecione pelo menos uma aplicação' })}
            className="w-full border rounded p-2"
          >
            {categorias.aplicacao.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          {errors.categoriasDetalhadas?.aplicacao && (
            <p className="text-red-500 text-sm mt-1">{errors.categoriasDetalhadas.aplicacao.message}</p>
          )}
        </div>
      </div>

      {/* Mídia */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mídia</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Imagem do Produto <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border rounded p-2"
              disabled={uploadingImage}
            />
            {uploadingImage && <p className="text-sm text-gray-500 mt-1">Fazendo upload...</p>}
            {watch('imagemProduto') && (
              <img
                src={watch('imagemProduto')}
                alt="Preview"
                className="mt-2 max-h-40 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              URL do Vídeo do Produto <span className="text-gray-500 text-xs">(opcional)</span>
            </label>
            <input
              type="url"
              {...register('videoProduto')}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border rounded p-2"
            />
            <p className="text-sm text-gray-500 mt-1">Cole o link do YouTube do vídeo do produto</p>
          </div>
        </div>
      </div>

      {/* Localização (Opcional) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Localização <span className="text-gray-500 text-sm">(opcional)</span>
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <input
                type="text"
                {...register('localizacao.cidade')}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                {...register('localizacao.estado')}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um estado</option>
                {ESTADOS_BRASILEIROS.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGetLocation}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Usar Localização Atual
            </button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700"
        >
          Salvar Máquina
        </button>
      </div>

      {/* Modal de Nova Categoria */}
      {showCategoryModal.show && showCategoryModal.tipo && (
        <CategoryModal
          tipo={showCategoryModal.tipo}
          onClose={() => setShowCategoryModal({ show: false, tipo: null })}
          onSuccess={handleCategorySuccess}
        />
      )}
    </form>
  );
};
