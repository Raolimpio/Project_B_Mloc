import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc, deleteDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
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
  const [loading, setLoading] = useState(false);
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

  // Efeito para atualizar o contador de não lidas
  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    console.log('Atualizando contador de não lidas:', count);
    setUnreadCount(count);
  }, [notifications]);

  useEffect(() => {
    if (!userProfile?.uid) return;

    console.log('Iniciando listener de notificações para:', userProfile.uid);

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userProfile.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Recebida atualização de notificações');
      
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Notification[];
      
      // Check for new notifications
      const prevIds = new Set(prevNotificationsRef.current.map(n => n.id));
      const hasNewNotification = notifs.some(n => !prevIds.has(n.id));
      
      if (hasNewNotification) {
        console.log('Nova notificação detectada!');
        // Play sound if there's a new notification
        if (audioRef.current && document.visibilityState === 'visible') {
          audioRef.current.play().catch((error) => {
            console.warn('Erro ao tocar som:', error);
          });
        }
      }

      setNotifications(notifs);
      prevNotificationsRef.current = notifs;
    }, (error) => {
      console.error('Erro ao carregar notificações:', error);
    });

    return () => unsubscribe();
  }, [userProfile?.uid]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp()
      });
      
      // Atualiza localmente para feedback imediato
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read: true } 
            : n
        )
      );
      
      console.log('Notificação marcada como lida:', notificationId);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const batch = writeBatch(db);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      unreadNotifications.forEach(notification => {
        const notificationRef = doc(db, 'notifications', notification.id);
        batch.update(notificationRef, {
          read: true,
          readAt: serverTimestamp()
        });
      });
      
      await batch.commit();
      
      // Atualiza localmente para feedback imediato
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      console.log('Todas as notificações marcadas como lidas');
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (notificationId: string) => {
    if (loading) return;
    setLoading(true);
    
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      
      // Remove localmente para feedback imediato
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
      
      console.log('Notificação removida:', notificationId);
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return '💰';
      case 'delivery':
        return '🚚';
      case 'return':
        return '↩️';
      case 'payment':
        return '💳';
      case 'maintenance':
        return '🔧';
      case 'message':
        return '💬';
      case 'info':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  const formatDate = (date: Date) => {
    try {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffMinutes < 60) {
        return `${diffMinutes}min atrás`;
      } else if (diffHours < 24) {
        return `${diffHours}h atrás`;
      } else if (diffDays === 1) {
        return 'Ontem';
      } else if (diffDays < 7) {
        return `${diffDays} dias atrás`;
      } else {
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(date);
      }
    } catch (error) {
      return 'Data inválida';
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
              className="notification-badge"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0 bg-white">
        <Card className="border-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">Notificações</h4>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={handleMarkAllAsRead}
                disabled={loading}
              >
                Marcar todas como lidas
              </Button>
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
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-gray-900 text-sm">
                            {notification.title}
                          </p>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleMarkAsRead(notification.id)}
                                disabled={loading}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRemove(notification.id)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
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
