import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export function DashboardFooter() {
  return (
    <footer className="mt-12 border-t bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-600">Sobre a Mariloc</h3>
            <p className="text-sm text-gray-500">
              Conectando empresas e profissionais aos melhores equipamentos para construção civil.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-600">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories" className="text-gray-500 hover:text-primary-600">
                  Categorias
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-500 hover:text-primary-600">
                  Meu Perfil
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-500 hover:text-primary-600">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-600">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-500">
                <MapPin className="mr-2 h-4 w-4" />
                São Paulo, SP
              </li>
              <li className="flex items-center text-gray-500">
                <Phone className="mr-2 h-4 w-4" />
                (11) 9999-9999
              </li>
              <li className="flex items-center text-gray-500">
                <Mail className="mr-2 h-4 w-4" />
                contato@mariloc.com.br
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mariloc. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}