import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import { db, messaging } from './firebase';
import type { Notification } from '@/types/notification';

type CreateNotificationData = Omit<Notification, 'id' | 'createdAt' | 'read'>;

export async function createNotification(data: CreateNotificationData) {
  try {
    const notificationsRef = collection(db, 'notifications');
    await addDoc(notificationsRef, {
      ...data,
      read: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Falha ao criar notificação');
  }
}

export async function requestNotificationPermission(userId: string) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging);
      
      // Save the token to the user's document
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmToken: token,
        notificationsEnabled: true
      });

      return token;
    }
    return null;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
}

export function setupMessageListener(callback: (payload: any) => void) {
  onMessage(messaging, (payload) => {
    callback(payload);
  });
}