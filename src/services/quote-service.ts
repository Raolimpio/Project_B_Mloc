import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import type { Quote, QuoteRequest, QuoteStatus } from '@/types/quote';
import type { Address } from '@/types/auth';

const QUOTES_COLLECTION = 'quotes';

export const quoteService = {
  async createQuote(userId: string, request: QuoteRequest): Promise<string> {
    try {
      // Primeiro, busca o endereço selecionado
      const addressRef = doc(db, 'addresses', request.deliveryAddressId);
      const addressSnap = await getDoc(addressRef);
      
      if (!addressSnap.exists()) {
        throw new Error('Endereço não encontrado');
      }

      const deliveryAddress = {
        id: addressSnap.id,
        ...addressSnap.data()
      } as Address;

      // Cria o orçamento
      const quotesRef = collection(db, QUOTES_COLLECTION);
      const quoteData = {
        userId,
        providerId: request.providerId,
        serviceDetails: {
          ...request.serviceDetails,
          startDate: new Date(request.serviceDetails.startDate),
          endDate: request.serviceDetails.endDate ? new Date(request.serviceDetails.endDate) : null
        },
        deliveryAddress,
        status: 'pending' as QuoteStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(quotesRef, quoteData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  },

  async updateQuoteStatus(quoteId: string, status: QuoteStatus): Promise<void> {
    try {
      const quoteRef = doc(db, QUOTES_COLLECTION, quoteId);
      await updateDoc(quoteRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  },

  async getUserQuotes(userId: string): Promise<Quote[]> {
    try {
      const quotesRef = collection(db, QUOTES_COLLECTION);
      const q = query(quotesRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        serviceDetails: {
          ...doc.data().serviceDetails,
          startDate: doc.data().serviceDetails.startDate?.toDate(),
          endDate: doc.data().serviceDetails.endDate?.toDate()
        }
      } as Quote));
    } catch (error) {
      console.error('Error getting user quotes:', error);
      throw error;
    }
  },

  async getProviderQuotes(providerId: string): Promise<Quote[]> {
    try {
      const quotesRef = collection(db, QUOTES_COLLECTION);
      const q = query(quotesRef, where('providerId', '==', providerId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        serviceDetails: {
          ...doc.data().serviceDetails,
          startDate: doc.data().serviceDetails.startDate?.toDate(),
          endDate: doc.data().serviceDetails.endDate?.toDate()
        }
      } as Quote));
    } catch (error) {
      console.error('Error getting provider quotes:', error);
      throw error;
    }
  },

  async getQuote(quoteId: string): Promise<Quote | null> {
    try {
      const quoteRef = doc(db, QUOTES_COLLECTION, quoteId);
      const snapshot = await getDoc(quoteRef);

      if (!snapshot.exists()) {
        return null;
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate(),
        updatedAt: snapshot.data().updatedAt?.toDate(),
        serviceDetails: {
          ...snapshot.data().serviceDetails,
          startDate: snapshot.data().serviceDetails.startDate?.toDate(),
          endDate: snapshot.data().serviceDetails.endDate?.toDate()
        }
      } as Quote;
    } catch (error) {
      console.error('Error getting quote:', error);
      throw error;
    }
  }
};
