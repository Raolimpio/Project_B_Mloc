import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from '@/types/auth';

export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Falha ao atualizar perfil');
  }
}