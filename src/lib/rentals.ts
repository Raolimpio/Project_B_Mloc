import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Rental } from '@/types';

export async function createRental(data: Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const rentalData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'rentals'), rentalData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating rental:', error);
    throw new Error('Falha ao criar aluguel');
  }
}

export async function updateRental(id: string, data: Partial<Rental>) {
  try {
    const rentalRef = doc(db, 'rentals', id);
    await updateDoc(rentalRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating rental:', error);
    throw new Error('Falha ao atualizar aluguel');
  }
}

export async function getRental(id: string): Promise<Rental> {
  try {
    const docRef = doc(db, 'rentals', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Aluguel não encontrado');
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Rental;
  } catch (error) {
    console.error('Error getting rental:', error);
    throw new Error('Erro ao carregar aluguel');
  }
}

export async function getRentalsByRenter(renterId: string): Promise<Rental[]> {
  try {
    const rentalsRef = collection(db, 'rentals');
    const q = query(rentalsRef, where('renterId', '==', renterId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Rental[];
  } catch (error) {
    console.error('Error getting rentals:', error);
    throw new Error('Erro ao carregar aluguéis');
  }
}

export async function getRentalsByOwner(ownerId: string): Promise<Rental[]> {
  try {
    const rentalsRef = collection(db, 'rentals');
    const q = query(rentalsRef, where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Rental[];
  } catch (error) {
    console.error('Error getting rentals:', error);
    throw new Error('Erro ao carregar aluguéis');
  }
}