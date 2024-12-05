import { useState, useEffect } from 'react';
import { Save, Link as LinkIcon, Pencil, X, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Feedback } from '@/components/ui/feedback';
import { getImageUrls, updateImageUrls } from '@/lib/image-urls';

const IMAGE_LOCATIONS = {
  banners: [
    { id: 'hero', name: 'Banner Principal', description: 'Banner hero da página inicial' },
    { id: 'categories', name: 'Banner Categorias', description: 'Banner da seção de categorias' },
    { id: 'about', name: 'Banner Sobre', description: 'Banner da seção sobre nós' }
  ],
  categories: [
    { id: 'construction', name: 'Construção Civil', description: 'Imagem da categoria construção' },
    { id: 'industrial', name: 'Industrial', description: 'Imagem da categoria industrial' },
    { id: 'tools', name: 'Ferramentas', description: 'Imagem da categoria ferramentas' }
  ],
  phases: [
    { id: 'foundation', name: 'Fundação', description: 'Imagem da fase de fundação' },
    { id: 'structure', name: 'Estrutura', description: 'Imagem da fase estrutural' },
    { id: 'finishing', name: 'Acabamento', description: 'Imagem da fase de acabamento' }
  ],
  machines: [
    { id: 'betoneira', name: 'Betoneira', description: 'Imagem padrão para betoneiras' },
    { id: 'compressor', name: 'Compressor', description: 'Imagem padrão para compressores' },
    { id: 'generator', name: 'Gerador', description: 'Imagem padrão para geradores' }
  ],
  brands: [
    { id: 'makita', name: 'Makita', description: 'Logo da Makita' },
    { id: 'bosch', name: 'Bosch', description: 'Logo da Bosch' },
    { id: 'csm', name: 'CSM', description: 'Logo da CSM' }
  ],
  defaults: [
    { id: 'machine', name: 'Máquina Padrão', description: 'Imagem padrão para máquinas sem foto' },
    { id: 'category', name: 'Categoria Padrão', description: 'Imagem padrão para categorias' },
    { id: 'profile', name: 'Perfil Padrão', description: 'Imagem padrão para perfis de usuário' }
  ]
};

export function ImageUrlManager() {
  const [selectedType, setSelectedType] = useState<keyof typeof IMAGE_LOCATIONS>('banners');
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempUrl, setTempUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImageUrls();
  }, []);

  const loadImageUrls = async () => {
    try {
      const data = await getImageUrls();
      setUrls(data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar URLs das imagens');
      setLoading(false);
    }
  };

  const handleEdit = (id: string, currentUrl: string) => {
    setEditingId(id);
    setTempUrl(currentUrl || '');
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempUrl('');
  };

  const handleSave = async (id: string) => {
    try {
      if (tempUrl) {
        new URL(tempUrl); // Validar URL
      }

      const updatedUrls = {
        ...urls,
        [selectedType]: {
          ...(urls[selectedType] || {}),
          [id]: tempUrl
        }
      };

      await updateImageUrls(selectedType, updatedUrls[selectedType]);
      setUrls(updatedUrls);
      setEditingId(null);
      setTempUrl('');
      setSuccess('URL atualizada com sucesso!');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('URL inválida ou erro ao salvar');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {Object.keys(IMAGE_LOCATIONS).map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? 'primary' : 'outline'}
            onClick={() => setSelectedType(type as keyof typeof IMAGE_LOCATIONS)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {error && <Feedback type="error" message={error} />}
      {success && <Feedback type="success" message={success} />}

      <Card className="divide-y">
        {IMAGE_LOCATIONS[selectedType].map((item) => (
          <div key={item.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              {editingId !== item.id ? (
                <div className="flex items-center gap-2">
                  {urls[selectedType]?.[item.id] && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(urls[selectedType][item.id], '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item.id, urls[selectedType]?.[item.id] || '')}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSave(item.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {editingId === item.id ? (
              <div className="mt-2">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="https://"
                    className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              urls[selectedType]?.[item.id] && (
                <div className="mt-2 flex items-center gap-4">
                  <img 
                    src={urls[selectedType][item.id]} 
                    alt={item.name}
                    className="h-16 w-16 rounded object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = urls.defaults.default_category;
                    }}
                  />
                  <p className="flex-1 truncate text-sm text-gray-600">
                    {urls[selectedType][item.id]}
                  </p>
                </div>
              )
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}