import { useNavigate } from 'react-router-dom';
import { X, Search, Grid, Package, LogOut, User, Bell, Home, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBox } from '@/components/search/search-box';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar } from '@/components/ui/avatar';
import { NotificationBell } from '@/components/ui/notification-bell';
import { ScrollArea } from '@/components/ui/scroll-area';
import { signOut } from '@/lib/auth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  show?: boolean;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    onClose();
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Início",
      href: "/",
    },
    {
      icon: <Grid className="h-5 w-5" />,
      label: userProfile?.type === 'individual' ? 'Painel do Cliente' : 'Painel do Anunciante',
      href: "/dashboard",
      show: !!userProfile,
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "Anunciar Máquina",
      href: "/machines/new",
      show: userProfile?.type === 'company',
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Perfil",
      href: "/profile",
      show: !!userProfile,
    },
  ];

  const authItems: MenuItem[] = userProfile ? [
    {
      icon: <LogOut className="h-5 w-5" />,
      label: "Sair",
      onClick: handleSignOut,
    }
  ] : [
    {
      icon: <User className="h-5 w-5" />,
      label: "Entrar",
      href: "/login",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Cadastrar",
      href: "/register",
    }
  ];

  const handleNavigate = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      navigate(item.href);
      onClose();
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <NotificationBell />
          </div>

          {/* User Profile */}
          {userProfile && (
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <Avatar src={userProfile.photoURL} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{userProfile.displayName}</p>
                  <p className="text-sm text-gray-500 truncate">{userProfile.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="p-4 border-b">
            <SearchBox />
          </div>

          {/* Menu Items */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {menuItems
                .filter(item => item.show !== false)
                .map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 mb-1 font-normal"
                    onClick={() => handleNavigate(item)}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                ))}

              {/* Separator */}
              <div className="my-2 border-t" />

              {/* Auth Items */}
              {authItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 mb-1 font-normal"
                  onClick={() => handleNavigate(item)}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
