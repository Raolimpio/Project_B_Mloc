import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import type { Notification } from '@/types/notification';

export function useNotifications() {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userProfile.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Notification[];
      
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile?.id]);

  const markAsRead = async (notificationId: string) => {
    if (!userProfile?.id) return;

    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
      updatedAt: new Date()
    });
  };

  const markAllAsRead = async () => {
    if (!userProfile?.id) return;

    const unreadNotifications = notifications.filter(n => !n.read);
    const updatePromises = unreadNotifications.map(notification => 
      updateDoc(doc(db, 'notifications', notification.id), {
        read: true,
        updatedAt: new Date()
      })
    );

    await Promise.all(updatePromises);
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead
  };
}
