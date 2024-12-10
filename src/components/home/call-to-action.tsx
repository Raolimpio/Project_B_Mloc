import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <div className="container mx-auto px-4">
      <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]" />
        
        <div className="relative px-6 py-16 md:px-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                Pronto para Transformar seu Projeto em Realidade?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Entre em contato conosco e descubra como podemos ajudar a 
                impulsionar seu sucesso com as melhores soluções em locação
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Card de Contato */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-colors duration-200
                border border-white/20 hover:border-secondary-500/50">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-secondary-500/20 rounded-xl">
                    <Phone className="w-6 h-6 text-secondary-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Fale Conosco
                  </h3>
                  <p className="text-white/80 mb-4">
                    Atendimento personalizado para suas necessidades
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full md:w-auto bg-secondary-500 hover:bg-secondary-600 text-white"
                    onClick={() => window.location.href = 'tel:(11) 9999-9999'}
                  >
                    (11) 9999-9999
                  </Button>
                </div>
              </div>

              {/* Card de Email */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-colors duration-200
                border border-white/20 hover:border-secondary-500/50">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-secondary-500/20 rounded-xl">
                    <Mail className="w-6 h-6 text-secondary-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Email
                  </h3>
                  <p className="text-white/80 mb-4">
                    Solicite um orçamento ou tire suas dúvidas
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full md:w-auto bg-secondary-500 hover:bg-secondary-600 text-white"
                    onClick={() => window.location.href = 'mailto:contato@mariloc.com.br'}
                  >
                    contato@mariloc.com.br
                  </Button>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-secondary-500" />
                <span>Segunda a Sexta, das 8h às 18h</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-secondary-500" />
                <span>São Paulo - SP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
