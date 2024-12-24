import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import type { Notification } from '@/types/notification';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { notificationSound } from '@/assets/sounds/notification';

export function NotificationBell() {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevNotificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.5; // 50% volume
    
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!userProfile?.id) return;

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userProfile.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      // Check for new notifications
      const prevIds = new Set(prevNotificationsRef.current.map(n => n.id));
      const hasNewNotification = notifs.some(n => !prevIds.has(n.id));
      
      // Play sound if there's a new notification
      if (hasNewNotification && audioRef.current && document.visibilityState === 'visible') {
        audioRef.current.play().catch(() => {
          // Ignore errors - some browsers block autoplay
        });
      }

      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
      prevNotificationsRef.current = notifs;
    });

    return () => unsubscribe();
  }, [userProfile?.id]);

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return '💰';
      case 'delivery':
        return '🚚';
      case 'payment':
        return '💳';
      case 'message':
        return '💬';
      case 'maintenance':
        return '🔧';
      default:
        return 'ℹ️';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-white">
        <Card className="border-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h4 className="font-semibold text-gray-900">Notificações</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
              </Badge>
            )}
          </div>
          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <Bell className="h-8 w-8 mb-2 text-gray-400" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors",
                      !notification.read ? 'bg-blue-50/50' : ''
                    )}
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5 break-words">
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.createdAt as unknown as Date)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
