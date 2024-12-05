import { Button } from '@/components/ui/button';

interface AuthSocialButtonsProps {
  onGoogleClick?: () => void;
}

export function AuthSocialButtons({ onGoogleClick }: AuthSocialButtonsProps) {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Ou continue com</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button variant="outline" className="w-full" onClick={onGoogleClick}>
          Continuar com Google
        </Button>
      </div>
    </>
  );
}