import { Search, Calendar, Truck, Phone } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Encontre o Equipamento',
    description: 'Busque e compare entre nossa ampla variedade de máquinas e equipamentos',
    icon: Search,
  },
  {
    id: 2,
    title: 'Faça sua Reserva',
    description: 'Escolha as datas e condições de locação que melhor atendem sua necessidade',
    icon: Calendar,
  },
  {
    id: 3,
    title: 'Entrega Garantida',
    description: 'Receba o equipamento no local da obra, com toda segurança e pontualidade',
    icon: Truck,
  },
  {
    id: 4,
    title: 'Suporte Técnico',
    description: 'Conte com nossa equipe especializada para qualquer necessidade',
    icon: Phone,
  },
];

export function HowItWorks() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold text-primary-600 mb-6">
          Como Funciona
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Processo simples e rápido para você alugar o equipamento ideal
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Linha conectora */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary-500 to-transparent 
          hidden lg:block -translate-y-1/2" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative group"
            >
              {/* Card do passo */}
              <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-100/50 h-full
                group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-200
                border-2 border-primary-100 group-hover:border-primary-200">
                {/* Número do passo com efeito de pulsar */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary-500 text-white 
                  rounded-full flex items-center justify-center font-bold z-10 relative">
                  <div className="absolute inset-0 rounded-full bg-secondary-400 animate-ping opacity-75" />
                  <span className="relative z-10">{step.id}</span>
                </div>

                {/* Ícone */}
                <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-8
                  group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-200">
                  <step.icon className="w-10 h-10 text-primary-600" />
                </div>

                {/* Conteúdo */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary-600 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Indicador de próximo passo em mobile */}
              {index < steps.length - 1 && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-0.5 h-8 
                  bg-gradient-to-b from-secondary-500 to-transparent md:hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
