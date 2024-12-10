import { MapPin, Phone, Mail, Facebook, Instagram, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-primary-600 text-white mt-auto w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Mariloc</h3>
            <p className="mb-4 text-sm text-white/80">
              Conectando empresas e profissionais aos melhores equipamentos para construção civil.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-white/80" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-white/80" />
              <Github className="h-5 w-5 cursor-pointer hover:text-white/80" />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories" className="hover:text-white/80">Categorias</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white/80">Cadastre-se</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white/80">Login</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white/80">Sobre Nós</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Subcategorias</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories/construction?subcategory=Escavadeiras" className="hover:text-white/80">
                  Escavadeiras
                </Link>
              </li>
              <li>
                <Link to="/categories/construction?subcategory=Betoneiras" className="hover:text-white/80">
                  Betoneiras
                </Link>
              </li>
              <li>
                <Link to="/categories/construction?subcategory=Compressores" className="hover:text-white/80">
                  Compressores
                </Link>
              </li>
              <li>
                <Link to="/categories/construction?subcategory=Geradores" className="hover:text-white/80">
                  Geradores
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@mariloc.com.br</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-white/60">
            &copy; {new Date().getFullYear()} Mariloc. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}