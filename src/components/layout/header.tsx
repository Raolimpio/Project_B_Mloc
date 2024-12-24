import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBox } from '@/components/search/search-box';
import { Logo } from '@/components/ui/logo';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { signOut } from '@/lib/auth';
import { useState } from 'react';
import { MobileMenu } from './mobile-menu';
import { NotificationBell } from '@/components/ui/notification-bell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Logo />
          </div>

          <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
            <SearchBox />
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            {userProfile ? (
              <>
                {userProfile.type === 'company' && (
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/machines/new')}
                    className="px-6"
                  >
                    Anunciar Máquina
                  </Button>
                )}
                <div className="flex items-center gap-4">
                  <NotificationBell />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-full ring-2 ring-white ring-offset-2 ring-offset-primary-600 transition-shadow hover:shadow-md">
                        <Avatar src={userProfile.photoURL} size="sm" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{userProfile.displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">{userProfile.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        {userProfile.type === 'individual' ? 'Painel do Cliente' : 'Painel do Anunciante'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-6"
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </Button>
                <Button 
                  size="sm" 
                  className="px-6"
                  onClick={() => navigate('/register')}
                >
                  Cadastrar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
}