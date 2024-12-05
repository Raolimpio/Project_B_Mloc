import { Button } from '@/components/ui/button';

type UserType = 'individual' | 'company';

interface UserTypeSelectorProps {
  userType: UserType;
  onTypeChange: (type: UserType) => void;
}

export function UserTypeSelector({ userType, onTypeChange }: UserTypeSelectorProps) {
  return (
    <div className="flex rounded-lg border p-1">
      <Button
        type="button"
        variant={userType === 'individual' ? 'primary' : 'secondary'}
        className="flex-1"
        onClick={() => onTypeChange('individual')}
      >
        Quero Alugar
      </Button>
      <Button
        type="button"
        variant={userType === 'company' ? 'primary' : 'secondary'}
        className="flex-1"
        onClick={() => onTypeChange('company')}
      >
        Quero Anunciar
      </Button>
    </div>
  );
}