import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBox } from '@/components/search/search-box';
import { Logo } from '@/components/ui/logo';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { signOut } from '@/lib/auth';

export function Header() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-28 items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="outline" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Logo />
          </div>

          <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
            <SearchBox />
          </div>

          <div className="flex items-center gap-4">
            {userProfile ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  {userProfile.type === 'individual' ? 'Painel do Cliente' : 'Painel do Anunciante'}
                </Button>
                <button
                  onClick={() => navigate('/profile')}
                  className="rounded-full ring-2 ring-white ring-offset-2 ring-offset-primary-600 transition-shadow hover:shadow-md"
                >
                  <Avatar src={userProfile.photoURL} size="sm" />
                </button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
                {userProfile.type === 'company' && (
                  <Button size="sm" onClick={() => navigate('/machines/new')}>
                    Anunciar Máquina
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Cadastrar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}