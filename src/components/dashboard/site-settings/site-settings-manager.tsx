import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeroBannerManager } from './hero-banner-manager';
import { ThemeManager } from './theme-manager';

export function SiteSettingsManager() {
  const [activeTab, setActiveTab] = useState('theme');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="theme">Tema</TabsTrigger>
        <TabsTrigger value="hero">Banner Principal</TabsTrigger>
      </TabsList>
      <TabsContent value="theme">
        <ThemeManager />
      </TabsContent>
      <TabsContent value="hero">
        <HeroBannerManager />
      </TabsContent>
    </Tabs>
  );
}
