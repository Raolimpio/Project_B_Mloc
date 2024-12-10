import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ICategoriaForm {
  tipo: 'grupo' | 'tipoTrabalho' | 'faseObra' | 'aplicacao';
  nome: string;
  descricao: string;
  bannerUrl: string;
  iconeUrl: string;
  ordem?: number;
  grupoPai?: string;
}

const CategoryForm = () => {
  const [categoria, setCategoria] = useState<ICategoriaForm>({
    tipo: 'tipoTrabalho',
    nome: '',
    descricao: '',
    bannerUrl: '',
    iconeUrl: '',
    ordem: 0
  });

  const [grupos, setGrupos] = useState<Array<{ id: string; nome: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarGrupos = async () => {
      try {
        const gruposRef = collection(db, 'categorias');
        const q = query(gruposRef, where('tipo', '==', 'grupo'));
        const snapshot = await getDocs(q);
        
        const gruposData = snapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome
        }));

        setGrupos(gruposData);
      } catch (error) {
        console.error('Erro ao carregar grupos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarGrupos();
  }, []);

  const tiposCategoria = [
    { id: 'grupo', label: 'Grupo Principal' },
    { id: 'tipoTrabalho', label: 'Tipo de Trabalho' },
    { id: 'faseObra', label: 'Fase da Obra' },
    { id: 'aplicacao', label: 'Aplicação' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Gerar ID baseado no nome (slug)
      const id = 'cat-' + categoria.nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Validar URLs das imagens
      if (!categoria.bannerUrl || !categoria.iconeUrl) {
        alert('Por favor, forneça URLs válidas para o banner e o ícone.');
        return;
      }

      // Salvar no Firestore
      await addDoc(collection(db, 'categorias'), {
        ...categoria,
        id
      });

      // Limpar formulário
      setCategoria({
        tipo: 'tipoTrabalho',
        nome: '',
        descricao: '',
        bannerUrl: '',
        iconeUrl: '',
        ordem: 0
      });

      alert('Categoria salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria. Verifique o console para mais detalhes.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Nova Categoria</h2>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de Categoria</label>
          <select
            className="w-full border rounded p-2"
            value={categoria.tipo}
            onChange={(e) => setCategoria({
              ...categoria,
              tipo: e.target.value as ICategoriaForm['tipo']
            })}
          >
            {tiposCategoria.map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        {categoria.tipo !== 'grupo' && (
          <div>
            <label className="block text-sm font-medium mb-2">Grupo Principal</label>
            <select
              className="w-full border rounded p-2"
              value={categoria.grupoPai || ''}
              onChange={(e) => setCategoria({
                ...categoria,
                grupoPai: e.target.value || undefined
              })}
            >
              <option value="">Selecione um grupo</option>
              {grupos.map(grupo => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Nome da Categoria</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={categoria.nome}
            onChange={(e) => setCategoria({ ...categoria, nome: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={categoria.descricao}
            onChange={(e) => setCategoria({ ...categoria, descricao: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ordem de Exibição</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={categoria.ordem}
            onChange={(e) => setCategoria({ ...categoria, ordem: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold">Imagens</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">URL do Banner</label>
          <input
            type="url"
            className="w-full border rounded p-2"
            value={categoria.bannerUrl}
            onChange={(e) => setCategoria({ ...categoria, bannerUrl: e.target.value })}
            required
            placeholder="https://exemplo.com/imagem-banner.jpg"
          />
          {categoria.bannerUrl && (
            <div className="mt-2">
              <img
                src={categoria.bannerUrl}
                alt="Banner Preview"
                className="max-h-40 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL do Ícone</label>
          <input
            type="url"
            className="w-full border rounded p-2"
            value={categoria.iconeUrl}
            onChange={(e) => setCategoria({ ...categoria, iconeUrl: e.target.value })}
            required
            placeholder="https://exemplo.com/imagem-icone.jpg"
          />
          {categoria.iconeUrl && (
            <div className="mt-2">
              <img
                src={categoria.iconeUrl}
                alt="Ícone Preview"
                className="max-h-20 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Salvar Categoria
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
