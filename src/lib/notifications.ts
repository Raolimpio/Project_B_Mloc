import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import { db, messaging, functions } from './firebase';
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

export async function sendNotification(data: CreateNotificationData & { email?: string }) {
  try {
    // Criar notificação no banco
    await createNotification(data);

    // Se tiver email, enviar notificação por email também
    if (data.email) {
      await sendEmailNotification(data);
    }

    // Enviar notificação push se o usuário tiver token
    const userDoc = await getDoc(doc(db, 'users', data.userId));
    const fcmToken = userDoc.data()?.fcmToken;
    
    if (fcmToken) {
      await sendPushNotification({
        token: fcmToken,
        title: data.title,
        body: data.message
      });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Falha ao enviar notificação');
  }
}

async function sendEmailNotification(data: CreateNotificationData & { email: string }) {
  // Implementar lógica de envio de email usando Firebase Functions
  const sendEmail = httpsCallable(functions, 'sendEmail');
  await sendEmail({
    to: data.email,
    subject: data.title,
    text: data.message
  });
}

async function sendPushNotification({ token, title, body }: {
  token: string;
  title: string;
  body: string;
}) {
  const message = {
    notification: {
      title,
      body,
    },
    token
  };

  try {
    await messaging.send(message);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}