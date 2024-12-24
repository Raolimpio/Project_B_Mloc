import { Link } from 'react-router-dom';

const mainCategories = [
  {
    id: 'cat-tipos-trabalho',
    nome: 'Tipos de Trabalho',
    descricao: 'Encontre máquinas por tipo de serviço',
    iconeUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
    tipo: 'tipoTrabalho'
  },
  {
    id: 'cat-fases-obra',
    nome: 'Fases da Obra',
    descricao: 'Equipamentos para cada etapa da sua obra',
    iconeUrl: 'https://images.unsplash.com/photo-1597844808175-66f8f064ba37',
    tipo: 'faseObra'
  },
  {
    id: 'cat-aplicacao',
    nome: 'Aplicação',
    descricao: 'Soluções específicas para cada segmento',
    iconeUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407',
    tipo: 'aplicacao'
  }
];

export function FeaturedCategories() {
  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mainCategories.map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.tipo}`}
          className="group relative block overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={category.iconeUrl}
              alt={category.nome}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="p-6">
            <h3 className="mb-2 text-xl font-bold text-gray-900">{category.nome}</h3>
            <p className="text-sm text-gray-600">{category.descricao}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}