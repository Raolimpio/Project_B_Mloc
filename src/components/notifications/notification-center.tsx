import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationList } from './notification-list';
import { useNotifications } from '@/hooks/use-notifications';
import type { Notification } from '@/types/notification';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg">
            <div className="border-b p-4">
              <h3 className="font-semibold">Notificações</h3>
            </div>
            <NotificationList
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        </>
      )}
    </div>
  );
}