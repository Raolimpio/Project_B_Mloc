import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MACHINE_CATEGORIES } from '@/lib/constants';

export function HeroSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  const selectedCategory = MACHINE_CATEGORIES.find(cat => cat.id === category);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (category) params.append('category', category);
    if (subcategory) params.append('subcategory', subcategory);

    navigate(`/categories${category ? `/${category}` : ''}?${params.toString()}`);
  };

  return (
    <section className="relative bg-primary-600 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-500">
            Mariloc Locação de Máquinas e Equipamentos
          </h1>
          
          <div className="mx-auto mt-8 max-w-4xl">
            <h2 className="mb-12 text-5xl font-bold text-white">
              A Ferramenta <span className="text-secondary-500">certa</span>
              <br />
              para sua obra.
            </h2>

            <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar máquinas..."
                  className="w-full rounded-lg bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
              </div>

              <div className="flex gap-4">
                <select 
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory('');
                  }}
                  className="flex-1 rounded-lg border bg-white px-4 py-3 text-gray-900"
                >
                  <option value="">Todas as Categorias</option>
                  {MACHINE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="flex-1 rounded-lg border bg-white px-4 py-3 text-gray-900"
                  disabled={!category}
                >
                  <option value="">Todos os Modelos</option>
                  {selectedCategory?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>

                <Button 
                  type="submit"
                  className="bg-secondary-500 px-8 text-white hover:bg-secondary-600"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-white/80">
            As melhores marcas mundiais, você aluga na Mariloc, de Profissional para Profissional.
          </p>
        </div>
      </div>
    </section>
  );
}