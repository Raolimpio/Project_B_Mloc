import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Review } from '@/types';

export async function createReview(data: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  try {
    const reviewData = {
      ...data,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'reviews'), reviewData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Falha ao criar avaliação');
  }
}

export async function getReviewsByMachine(machineId: string): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('machineId', '==', machineId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Review[];
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw new Error('Erro ao carregar avaliações');
  }
}