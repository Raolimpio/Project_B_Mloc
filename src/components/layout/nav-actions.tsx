import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { NotificationBell } from '@/components/ui/notification-bell';
import { useAuth } from '@/contexts/auth-context';
import { signOut } from '@/lib/auth';

interface NavActionsProps {
  isMobile?: boolean;
}

export function NavActions({ isMobile = false }: NavActionsProps) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className={cn(
      "flex items-center gap-4",
      isMobile ? "flex-col w-full" : "flex-row"
    )}>
      {userProfile && (
        <>
          <NotificationBell />
          <div className={cn(
            "flex items-center",
            isMobile ? "w-full justify-between" : "gap-4"
          )}>
            <div className="flex items-center gap-3">
              <Avatar
                src={userProfile.photoURL || undefined}
                alt={userProfile.displayName || 'Avatar'}
              />
              <div className="hidden lg:block">
                <p className="text-sm font-medium">
                  {userProfile.displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userProfile.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "icon"}
              onClick={handleSignOut}
              className={cn(
                isMobile ? "w-full justify-start" : ""
              )}
            >
              <LogOut className="h-5 w-5" />
              {isMobile && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        </>
      )}
      {!userProfile && (
        <div className={cn(
          "flex",
          isMobile ? "flex-col w-full gap-2" : "flex-row gap-4"
        )}>
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className={cn(
              isMobile ? "w-full justify-start" : ""
            )}
          >
            Entrar
          </Button>
          <Button
            onClick={() => navigate('/register')}
            className={cn(
              isMobile ? "w-full justify-start" : ""
            )}
          >
            Cadastrar
          </Button>
        </div>
      )}
    </div>
  );
}
