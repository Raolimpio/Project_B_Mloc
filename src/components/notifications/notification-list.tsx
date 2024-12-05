import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';
import type { Notification } from '@/types/notification';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhuma notificação
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex cursor-pointer gap-3 border-b p-4 transition-colors hover:bg-gray-50 ${
            !notification.read ? 'bg-blue-50' : ''
          }`}
          onClick={() => onMarkAsRead(notification.id)}
        >
          {getIcon(notification.type)}
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="text-sm text-gray-600">{notification.message}</p>
            <p className="mt-1 text-xs text-gray-500">
              {formatDistanceToNow(notification.createdAt, {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}