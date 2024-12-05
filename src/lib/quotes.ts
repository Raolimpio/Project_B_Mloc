import { 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Quote } from '@/types/quote';

export async function createQuoteRequest(data: {
  machineId: string;
  machineName: string;
  machinePhoto: string;
  ownerId: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  startDate: string;
  endDate: string;
  purpose: string;
  location: string;
}) {
  try {
    console.log('Creating quote request:', data);
    const quotesRef = collection(db, 'quotes');
    const quote = {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(quotesRef, quote);
    console.log('Quote created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating quote request:', error);
    throw new Error('Não foi possível criar a solicitação de orçamento');
  }
}

export async function getQuotesByRequester(requesterId: string) {
  try {
    console.log('Fetching quotes for requester:', requesterId);
    const quotesRef = collection(db, 'quotes');
    const q = query(
      quotesRef, 
      where('requesterId', '==', requesterId)
    );
    
    const snapshot = await getDocs(q);
    console.log('Raw quotes data:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    const quotes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
    
    console.log('Processed quotes:', quotes);
    return quotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw new Error('Não foi possível carregar os orçamentos');
  }
}

export async function getQuotesByOwner(ownerId: string) {
  try {
    console.log('Fetching quotes for owner:', ownerId);
    const quotesRef = collection(db, 'quotes');
    const q = query(
      quotesRef, 
      where('ownerId', '==', ownerId)
    );
    
    const snapshot = await getDocs(q);
    const quotes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
    
    console.log('Quotes found:', quotes);
    return quotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw new Error('Não foi possível carregar os orçamentos');
  }
}

export async function updateQuoteStatus(
  quoteId: string,
  status: Quote['status'],
  data?: {
    value?: number;
    message?: string;
  }
) {
  try {
    const quoteRef = doc(db, 'quotes', quoteId);
    const updateData = {
      status,
      ...data,
      updatedAt: serverTimestamp()
    };
    
    console.log('Updating quote:', quoteId, updateData);
    await updateDoc(quoteRef, updateData);
    console.log('Quote updated successfully');
  } catch (error) {
    console.error('Error updating quote:', error);
    throw new Error('Não foi possível atualizar o orçamento');
  }
}