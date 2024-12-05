import { useState } from 'react';
import { Layout, Image, Clock, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BannerManager } from './banner-manager';
import { CategoryManager } from './category-manager';
import { PhaseManager } from './phase-manager';

type ContentSection = 'banners' | 'categories' | 'phases';

export function ContentDashboard() {
  const [activeSection, setActiveSection] = useState<ContentSection>('banners');

  const sections = [
    {
      id: 'banners' as const,
      name: 'Banners',
      icon: Layout,
      description: 'Gerencie os banners da página inicial'
    },
    {
      id: 'categories' as const,
      name: 'Categorias',
      icon: Grid,
      description: 'Configure as categorias de máquinas'
    },
    {
      id: 'phases' as const,
      name: 'Fases da Obra',
      icon: Clock,
      description: 'Organize as fases do processo construtivo'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'primary' : 'outline'}
            onClick={() => setActiveSection(section.id)}
            className="flex items-center gap-2"
          >
            <section.icon className="h-4 w-4" />
            {section.name}
          </Button>
        ))}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        {activeSection === 'banners' && <BannerManager />}
        {activeSection === 'categories' && <CategoryManager />}
        {activeSection === 'phases' && <PhaseManager />}
      </div>
    </div>
  );
}