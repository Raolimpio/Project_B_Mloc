import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/upload';

interface BannerSettings {
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
}

const defaultBanner: BannerSettings = {
  imageUrl: '',
  title: null,
  subtitle: null
};

export function HeroBannerManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<BannerSettings>(defaultBanner);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const docRef = doc(db, 'site-settings', 'home');
        const docSnap = await getDoc(docRef);

        if (!isMounted) return;

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroBanner) {
            setSettings({
              imageUrl: data.heroBanner.imageUrl || '',
              title: data.heroBanner.title || null,
              subtitle: data.heroBanner.subtitle || null
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        if (isMounted) {
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar as configurações do banner',
            variant: 'error',
          });
        }
      }
    }

    loadSettings();
    return () => { isMounted = false; };
  }, [toast]);

  const handleSave = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      const docRef = doc(db, 'site-settings', 'home');
      
      const bannerToSave: BannerSettings = {
        imageUrl: settings.imageUrl || '',
        title: settings.title?.trim() || null,
        subtitle: settings.subtitle?.trim() || null
      };

      await setDoc(docRef, { heroBanner: bannerToSave });

      toast({
        title: '✨ Banner atualizado!',
        description: 'As alterações foram salvas com sucesso.',
        variant: 'success',
        duration: 4000,
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as alterações. Tente novamente.',
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isSaving) return;

    try {
      setIsSaving(true);
      const imageUrl = await uploadImage(file, 'banners');
      
      const updatedSettings = {
        ...settings,
        imageUrl
      };
      
      setSettings(updatedSettings);

      const bannerToSave: BannerSettings = {
        imageUrl,
        title: updatedSettings.title?.trim() || null,
        subtitle: updatedSettings.subtitle?.trim() || null
      };

      const docRef = doc(db, 'site-settings', 'home');
      await setDoc(docRef, { heroBanner: bannerToSave });

      toast({
        title: '🖼️ Imagem atualizada!',
        description: 'A nova imagem do banner foi salva com sucesso.',
        variant: 'success',
        duration: 4000,
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast({
        title: 'Erro no upload',
        description: error instanceof Error ? error.message : 'Não foi possível fazer upload da imagem. Tente novamente.',
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      setSettings(defaultBanner);
      
      const docRef = doc(db, 'site-settings', 'home');
      await setDoc(docRef, { 
        heroBanner: { 
          imageUrl: '',
          title: null,
          subtitle: null
        } 
      });

      toast({
        title: '🧹 Banner limpo!',
        description: 'Todas as configurações do banner foram removidas.',
        variant: 'success',
        duration: 4000,
      });
    } catch (error) {
      console.error('Erro ao limpar configurações:', error);
      toast({
        title: 'Erro ao limpar',
        description: 'Não foi possível limpar as configurações. Tente novamente.',
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview do Banner */}
      <Card>
        <CardHeader>
          <CardTitle>Preview do Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
            {settings.imageUrl ? (
              <img
                src={settings.imageUrl}
                alt="Preview do banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">Nenhuma imagem selecionada</p>
              </div>
            )}
            
            {(settings.title?.trim() || settings.subtitle?.trim()) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                {settings.title?.trim() && (
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {settings.title}
                  </h2>
                )}
                {settings.subtitle?.trim() && (
                  <p className="text-sm text-gray-100">
                    {settings.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Banner */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload de imagem */}
          <div className="space-y-2">
            <Label>Imagem do Banner</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isSaving}
            />
            <p className="text-sm text-gray-500">
              Recomendado: 1920x400px, máximo 2MB
            </p>
          </div>

          {/* Título (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="title">Título (opcional)</Label>
            <Input
              id="title"
              value={settings.title || ''}
              onChange={(e) => {
                const value = e.target.value;
                setSettings(prev => ({
                  ...prev,
                  title: value || null
                }));
              }}
              placeholder="Digite o título do banner (opcional)"
              disabled={isSaving}
            />
          </div>

          {/* Subtítulo (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo (opcional)</Label>
            <Textarea
              id="subtitle"
              value={settings.subtitle || ''}
              onChange={(e) => {
                const value = e.target.value;
                setSettings(prev => ({
                  ...prev,
                  subtitle: value || null
                }));
              }}
              placeholder="Digite o subtítulo do banner (opcional)"
              disabled={isSaving}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              Limpar Tudo
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Salvando...</span>
                </div>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
