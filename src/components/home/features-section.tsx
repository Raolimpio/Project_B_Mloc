import { Shield, Clock, Users, Wrench } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Segurança Garantida',
    description: 'Equipamentos verificados e fornecedores qualificados'
  },
  {
    icon: Clock,
    title: 'Processo Ágil',
    description: 'Solicite orçamentos e alugue em poucos cliques'
  },
  {
    icon: Users,
    title: 'Suporte Especializado',
    description: 'Time técnico pronto para ajudar quando precisar'
  },
  {
    icon: Wrench,
    title: 'Manutenção em Dia',
    description: 'Máquinas com manutenção regular e documentação completa'
  }
];

export function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Por que escolher nossa plataforma?</h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Oferecemos a melhor experiência em aluguel de máquinas e equipamentos,
            com foco em segurança, agilidade e suporte especializado.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <feature.icon className="mb-4 h-8 w-8 text-blue-600" />
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}