interface Category {
  title: string;
  description: string;
  imageUrl: string;
}

const categories: Category[] = [
  {
    title: 'Equipamentos de Construção',
    description: 'Encontre escavadeiras, bulldozers, guindastes e muito mais.',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Máquinas Agrícolas',
    description: 'Explore tratores, colheitadeiras e equipamentos agrícolas.',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Ferramentas Industriais',
    description: 'Descubra ferramentas elétricas, geradores e máquinas industriais.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  },
];

export function FeaturedCategories() {
  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div key={category.title} className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">{category.title}</h3>
          <img
            src={category.imageUrl}
            alt={category.title}
            className="mb-4 h-48 w-full rounded-md object-cover"
          />
          <p className="text-gray-600">{category.description}</p>
        </div>
      ))}
    </section>
  );
}