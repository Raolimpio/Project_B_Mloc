import { 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import type { Quote } from '@/types/quote';

async function checkMachineAvailability(machineId: string, startDate: string, endDate: string) {
  // Sempre retorna disponível
  return true;
}

async function sendNotification(data: {
  userId: string;
  title: string;
  message: string;
  type: string;
  email: string;
}) {
  // Implementação da lógica de envio de notificação
  console.log('Sending notification:', data);
}

export async function createQuoteRequest(data: {
  machineId: string;
  machineName: string;
  machinePhotos: string[];
  machineMainPhoto?: string;
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
    
    // Garantir que machinePhotos seja um array e machineMainPhoto não seja undefined
    const { machineMainPhoto, machinePhotos, ...restData } = data;
    const quote = {
      ...restData,
      machinePhotos: machinePhotos || [], // Garantir que seja um array
      ...(machineMainPhoto ? { machineMainPhoto } : {}), // Só inclui se tiver valor
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(quotesRef, quote);
    
    // Enviar notificação ao proprietário
    await sendNotification({
      userId: data.ownerId,
      title: 'Novo Pedido de Orçamento',
      message: `Você recebeu um novo pedido de orçamento para ${data.machineName}`,
      type: 'quote_request',
      email: data.requesterEmail
    });

    console.log('Quote created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating quote request:', error);
    throw error;
  }
}

export async function getQuotesByRequester(requesterId: string) {
  try {
    const quotesRef = collection(db, 'quotes');
    const q = query(
      quotesRef,
      where('requesterId', '==', requesterId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    }) as Quote[];
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw new Error('Não foi possível carregar os orçamentos');
  }
}

export async function getQuotesByOwner(ownerId: string) {
  try {
    const quotesRef = collection(db, 'quotes');
    const q = query(
      quotesRef,
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Quote[];
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

export function subscribeToQuotes(userId: string, type: 'requester' | 'owner', callback: (quotes: Quote[]) => void) {
  console.log(`Iniciando subscription para ${type} ${userId}`);
  
  const quotesRef = collection(db, 'quotes');
  const quotesQuery = query(
    quotesRef,
    where(`${type}Id`, '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(quotesQuery, (snapshot) => {
    console.log(`Recebida atualização para ${type} ${userId}`);
    console.log('Documentos alterados:', snapshot.docChanges().map(change => ({
      type: change.type,
      id: change.doc.id,
      status: change.doc.data().status
    })));
    
    const quotes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    }) as Quote[];

    console.log(`Total de quotes carregadas: ${quotes.length}`);
    callback(quotes);
  }, (error) => {
    console.error(`Erro na subscription de ${type}:`, error);
  });
}