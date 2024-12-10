import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';

interface CategoryModalProps {
  tipo: 'tipoTrabalho' | 'faseObra' | 'aplicacao';
  onClose: () => void;
  onSuccess: () => void;
}

const TIPO_LABEL_MAP = {
  tipoTrabalho: 'Tipo de Trabalho',
  faseObra: 'Fase da Obra',
  aplicacao: 'Aplicação'
};

export function CategoryModal({ tipo, onClose, onSuccess }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'icon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'banner') {
      setBannerFile(file);
    } else {
      setIconFile(file);
    }
  };

  const uploadImage = async (file: File, id: string, type: 'banner' | 'icon'): Promise<string> => {
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-z0-9.-]/gi, '_');
    const storageRef = ref(storage, `categories/${id}/${timestamp}-${type}-${sanitizedFilename}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gerar ID baseado no nome (slug)
      const id = 'cat-' + formData.nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Upload das imagens
      let bannerUrl = '';
      let iconeUrl = '';

      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, id, 'banner');
      }

      if (iconFile) {
        iconeUrl = await uploadImage(iconFile, id, 'icon');
      }

      // Salvar no Firestore
      await addDoc(collection(db, 'categorias'), {
        id,
        nome: formData.nome,
        descricao: formData.descricao,
        tipo: tipo,
        bannerUrl,
        iconeUrl,
        ordem: 0 // A ordem pode ser ajustada posteriormente
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">Nova {TIPO_LABEL_MAP[tipo]}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full border rounded p-2"
              placeholder={`Nome da ${TIPO_LABEL_MAP[tipo]}`}
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
              placeholder={`Descrição da ${TIPO_LABEL_MAP[tipo]}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Banner</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'banner')}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ícone</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'icon')}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border rounded hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
