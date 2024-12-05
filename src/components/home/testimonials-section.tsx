const testimonials = [
  {
    name: 'João Silva',
    role: 'Engenheiro Civil',
    company: 'Construtora Silva',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
    content: 'A plataforma revolucionou nossa forma de alugar equipamentos. Processo ágil e seguro.'
  },
  {
    name: 'Maria Santos',
    role: 'Arquiteta',
    company: 'MS Arquitetura',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    content: 'Excelente variedade de máquinas e atendimento de primeira qualidade.'
  },
  {
    name: 'Carlos Oliveira',
    role: 'Diretor de Obras',
    company: 'CO Construções',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    content: 'Encontramos todos os equipamentos necessários em um só lugar. Recomendo!'
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">O que dizem nossos clientes</h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Histórias reais de clientes que transformaram seus projetos usando nossa plataforma
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="mr-4 h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} - {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}