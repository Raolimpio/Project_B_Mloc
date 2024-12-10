import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Edit2, Trash2, X } from 'lucide-react';
import { db, storage } from '../../../lib/firebase';
import { Button } from '../../../components/ui/button';
import { CategoryModal } from '../../../components/forms/CategoryModal';
import type { ICategoria } from '../../../types/machine.types';

interface EditModalProps {
  categoria: ICategoria;
  onClose: () => void;
  onSave: (id: string, data: Omit<ICategoria, 'id'>) => Promise<void>;
}

function EditModal({ categoria, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<Omit<ICategoria, 'id'>>({
    nome: categoria.nome,
    descricao: categoria.descricao,
    tipo: categoria.tipo,
    bannerUrl: categoria.bannerUrl,
    iconeUrl: categoria.iconeUrl,
    ordem: categoria.ordem || 0 // Garantir que ordem sempre tenha um valor
  });
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'icon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (type === 'banner') {
        setUploadingBanner(true);
      } else {
        setUploadingIcon(true);
      }

      const timestamp = Date.now();
      const sanitizedFilename = file.name.replace(/[^a-z0-9.-]/gi, '_');
      const storageRef = ref(storage, `categories/${categoria.id}/${timestamp}-${type}-${sanitizedFilename}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (type === 'banner') {
        setFormData(prev => ({ ...prev, bannerUrl: url }));
      } else {
        setFormData(prev => ({ ...prev, iconeUrl: url }));
      }
    } catch (error) {
      console.error(`Erro ao fazer upload de ${type}:`, error);
    } finally {
      if (type === 'banner') {
        setUploadingBanner(false);
      } else {
        setUploadingIcon(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Garantir que todos os campos obrigatórios estejam presentes
      const updateData = {
        ...formData,
        ordem: formData.ordem || 0, // Garantir que ordem sempre tenha um valor
        tipo: categoria.tipo // Manter o tipo original
      };
      await onSave(categoria.id, updateData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">Editar Categoria</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              required
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              className="w-full border rounded p-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Banner</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'banner')}
                  className="w-full border rounded p-2"
                  disabled={uploadingBanner}
                />
                {uploadingBanner && <p className="text-sm text-gray-500">Fazendo upload...</p>}
                {formData.bannerUrl && (
                  <img
                    src={formData.bannerUrl}
                    alt="Banner Preview"
                    className="mt-2 max-h-32 rounded object-cover"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ícone</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'icon')}
                  className="w-full border rounded p-2"
                  disabled={uploadingIcon}
                />
                {uploadingIcon && <p className="text-sm text-gray-500">Fazendo upload...</p>}
                {formData.iconeUrl && (
                  <img
                    src={formData.iconeUrl}
                    alt="Ícone Preview"
                    className="mt-2 h-16 w-16 rounded object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CategoryManager() {
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategoria | null>(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const categoriasRef = collection(db, 'categorias');
      const snapshot = await getDocs(categoriasRef);
      const categoriasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        ordem: doc.data().ordem || 0 // Garantir que ordem sempre tenha um valor
      } as ICategoria));
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (id: string, updateData: Omit<ICategoria, 'id'>) => {
    try {
      const categoriaRef = doc(db, 'categorias', id);
      // Garantir que ordem sempre tenha um valor
      const dataToUpdate = {
        ...updateData,
        ordem: updateData.ordem || 0
      };
      await updateDoc(categoriaRef, dataToUpdate);
      await loadCategorias();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      throw error;
    }
  };

  const handleDeleteCategory = async (categoria: ICategoria) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${categoria.nome}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'categorias', categoria.id));
      await loadCategorias();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gerenciar Categorias</h2>
        <Button onClick={() => setShowAddModal(true)}>
          Adicionar Categoria
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={categoria.iconeUrl}
                  alt=""
                  className="h-12 w-12 rounded object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-icon.jpg';
                  }}
                />
                <div>
                  <h3 className="font-medium">{categoria.nome}</h3>
                  <p className="text-sm text-gray-500">{categoria.tipo}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCategory(categoria)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(categoria)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <img
                src={categoria.bannerUrl}
                alt=""
                className="h-32 w-full rounded object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            </div>

            <p className="mt-3 text-sm text-gray-600">{categoria.descricao}</p>
          </div>
        ))}
      </div>

      {showAddModal && (
        <CategoryModal
          tipo="tipoTrabalho"
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadCategorias();
          }}
        />
      )}

      {editingCategory && (
        <EditModal
          categoria={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}
