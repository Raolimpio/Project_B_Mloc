import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Machine } from '@/types';

export async function createMachine(data: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const machineData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'machines'), machineData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating machine:', error);
    throw new Error('Falha ao criar máquina');
  }
}

export async function updateMachine(id: string, data: Partial<Machine>) {
  try {
    const machineRef = doc(db, 'machines', id);
    await updateDoc(machineRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating machine:', error);
    throw new Error('Falha ao atualizar máquina');
  }
}

export async function deleteMachine(id: string) {
  try {
    // Delete machine document
    const machineRef = doc(db, 'machines', id);
    await deleteDoc(machineRef);

    // Delete all images in the machine's folder
    const imagesRef = ref(storage, `machines/${id}`);
    try {
      await deleteObject(imagesRef);
    } catch (error) {
      console.error('Error deleting machine images:', error);
      // Continue even if image deletion fails
    }
  } catch (error) {
    console.error('Error deleting machine:', error);
    throw new Error('Falha ao excluir máquina');
  }
}

export async function getMachine(id: string): Promise<Machine> {
  try {
    const docRef = doc(db, 'machines', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Máquina não encontrada');
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Machine;
  } catch (error) {
    console.error('Error getting machine:', error);
    throw new Error('Erro ao carregar máquina');
  }
}

export async function getMachinesByOwner(ownerId: string): Promise<Machine[]> {
  try {
    const machinesRef = collection(db, 'machines');
    const q = query(machinesRef, where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Machine[];
  } catch (error) {
    console.error('Error getting machines:', error);
    throw new Error('Erro ao carregar máquinas');
  }
}