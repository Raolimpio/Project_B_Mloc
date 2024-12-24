import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ThemeSettings } from '@/types/theme';
import { Upload, Undo } from 'lucide-react';
import { defaultTheme } from '@/config/default-theme';
import { uploadImage } from '@/lib/upload';

export function ThemeManager() {
  const { settings, updateTheme, updateLogo } = useTheme();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('branding');
  const [previewTheme, setPreviewTheme] = useState<ThemeSettings>(
    settings?.theme || defaultTheme
  );
  const [isDirty, setIsDirty] = useState(false);

  // Atualiza o preview quando as configurações mudam
  useEffect(() => {
    if (settings?.theme) {
      setPreviewTheme(settings.theme);
      setIsDirty(false);
    }
  }, [settings?.theme]);

  const handleColorChange = (key: keyof ThemeSettings['colors'], value: string) => {
    setPreviewTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleTypographyChange = (
    key: keyof ThemeSettings['typography'],
    value: string
  ) => {
    setPreviewTheme((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleSpacingChange = (
    key: keyof ThemeSettings['spacing'],
    value: string
  ) => {
    setPreviewTheme((prev) => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [key]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleBorderRadiusChange = (
    key: keyof ThemeSettings['borderRadius'],
    value: string
  ) => {
    setPreviewTheme((prev) => ({
      ...prev,
      borderRadius: {
        ...prev.borderRadius,
        [key]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleShadowChange = (
    key: keyof ThemeSettings['shadows'],
    value: string
  ) => {
    setPreviewTheme((prev) => ({
      ...prev,
      shadows: {
        ...prev.shadows,
        [key]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const logoUrl = await uploadImage(file, `site/logo/${file.name}`);
      
      await updateLogo({
        url: logoUrl,
        width: 200,
        height: 80,
        alt: 'Logo da empresa',
      });

      toast({
        title: 'Logo atualizada com sucesso!',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar logo',
        description: 'Tente novamente mais tarde',
        variant: 'error',
      });
    }
  };

  const handleSaveTheme = async () => {
    try {
      await updateTheme(previewTheme);
      setIsDirty(false);
      toast({
        title: 'Tema atualizado com sucesso!',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar tema',
        description: 'Tente novamente mais tarde',
        variant: 'error',
      });
    }
  };

  const handleResetTheme = () => {
    setPreviewTheme(defaultTheme);
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Personalização do Site</h2>
          <p className="text-sm text-gray-600">
            Customize a aparência do seu site
          </p>
        </div>
        <div className="flex gap-2">
          {isDirty && (
            <Button variant="outline" onClick={handleResetTheme}>
              <Undo className="mr-2 h-4 w-4" />
              Restaurar Padrão
            </Button>
          )}
          <Button onClick={handleSaveTheme} disabled={!isDirty}>
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="branding">Identidade Visual</TabsTrigger>
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="typography">Tipografia</TabsTrigger>
            <TabsTrigger value="spacing">Espaçamento</TabsTrigger>
            <TabsTrigger value="components">Componentes</TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Logo do Site</h3>
              <div className="flex items-center gap-6 rounded-lg border p-4">
                <img
                  src={settings?.logo?.url}
                  alt={settings?.logo?.alt}
                  className="h-20 w-auto object-contain"
                />
                <div className="space-y-2">
                  <Label
                    htmlFor="logo-upload"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    Alterar Logo
                  </Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <p className="text-sm text-gray-500">
                    Recomendado: PNG ou SVG com fundo transparente
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Cores Principais</h3>
                <div className="space-y-4">
                  {Object.entries(previewTheme.colors).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key}</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded-md border"
                          style={{ backgroundColor: value }}
                        />
                        <Input
                          type="color"
                          value={value}
                          onChange={(e) =>
                            handleColorChange(
                              key as keyof ThemeSettings['colors'],
                              e.target.value
                            )
                          }
                          className="h-10 w-20"
                        />
                        <Input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleColorChange(
                              key as keyof ThemeSettings['colors'],
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Cores do Sistema</h3>
                <div className="space-y-4">
                  {Object.entries(previewTheme.colors).slice(2).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key}</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded-md border"
                          style={{ backgroundColor: value }}
                        />
                        <Input
                          type="color"
                          value={value}
                          onChange={(e) =>
                            handleColorChange(
                              key as keyof ThemeSettings['colors'],
                              e.target.value
                            )
                          }
                          className="h-10 w-20"
                        />
                        <Input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleColorChange(
                              key as keyof ThemeSettings['colors'],
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Fontes</h3>
                <div className="space-y-4">
                  {Object.entries(previewTheme.typography).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key}</Label>
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleTypographyChange(
                            key as keyof ThemeSettings['typography'],
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preview</h3>
                <div className="space-y-4 rounded-lg border p-4">
                  <h1 className="text-4xl font-bold" style={{ fontFamily: previewTheme.typography.headingFontFamily }}>
                    Título Principal
                  </h1>
                  <h2 className="text-2xl font-semibold" style={{ fontFamily: previewTheme.typography.headingFontFamily }}>
                    Subtítulo
                  </h2>
                  <p style={{ 
                    fontFamily: previewTheme.typography.fontFamily,
                    fontSize: previewTheme.typography.baseFontSize,
                    lineHeight: previewTheme.typography.lineHeight
                  }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Espaçamentos</h3>
                <div className="space-y-4">
                  {Object.entries(previewTheme.spacing).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key}</Label>
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleSpacingChange(
                            key as keyof ThemeSettings['spacing'],
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preview</h3>
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="space-y-2">
                    {Object.entries(previewTheme.spacing).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="bg-primary"
                          style={{ width: value, height: '20px' }}
                        />
                        <span className="text-sm">{key}: {value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Border Radius</h3>
                    <div className="space-y-4">
                      {Object.entries(previewTheme.borderRadius).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label className="capitalize">{key}</Label>
                          <Input
                            type="text"
                            value={value}
                            onChange={(e) =>
                              handleBorderRadiusChange(
                                key as keyof ThemeSettings['borderRadius'],
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Shadows</h3>
                    <div className="space-y-4">
                      {Object.entries(previewTheme.shadows).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label className="capitalize">{key}</Label>
                          <Input
                            type="text"
                            value={value}
                            onChange={(e) =>
                              handleShadowChange(
                                key as keyof ThemeSettings['shadows'],
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Preview</h3>
                <div className="space-y-6 rounded-lg border p-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Border Radius</h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {Object.entries(previewTheme.borderRadius).map(([key, value]) => (
                        <div
                          key={key}
                          className="aspect-square bg-primary"
                          style={{ borderRadius: value }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Shadows</h4>
                    <div className="grid gap-4">
                      {Object.entries(previewTheme.shadows).map(([key, value]) => (
                        <div
                          key={key}
                          className="h-16 rounded-lg bg-white p-4"
                          style={{ boxShadow: value }}
                        >
                          Shadow {key}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Botões</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button>Botão Primário</Button>
                      <Button variant="outline">Botão Secundário</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Cards</h4>
                    <Card className="p-4">
                      <h5 className="font-medium">Card de exemplo</h5>
                      <p className="text-sm text-gray-600">
                        Conteúdo do card com estilos aplicados
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
