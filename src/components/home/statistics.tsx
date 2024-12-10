import { TrendingUp, Users, Clock, Award } from 'lucide-react';

const stats = [
  {
    id: 1,
    name: 'Máquinas Disponíveis',
    value: '500+',
    icon: TrendingUp,
    description: 'Equipamentos prontos para locação'
  },
  {
    id: 2,
    name: 'Clientes Satisfeitos',
    value: '2000+',
    icon: Users,
    description: 'Empresas confiam em nossos serviços'
  },
  {
    id: 3,
    name: 'Anos no Mercado',
    value: '25+',
    icon: Clock,
    description: 'De experiência e tradição'
  },
  {
    id: 4,
    name: 'Certificações',
    value: '10+',
    icon: Award,
    description: 'Garantia de qualidade e segurança'
  }
];

export function Statistics() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Nossa Trajetória em Números
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Referência no mercado de locação de máquinas e equipamentos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-lg p-6 shadow-md text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
            <p className="text-lg font-medium text-gray-700 mb-1">{stat.name}</p>
            <p className="text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
