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
  onSnapshot,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { Quote } from '@/types/quote';
import { 
  notifyNewQuoteRequest,
  notifyQuoteResponse,
  notifyQuoteApproved,
  notifyQuoteRejected,
  notifyDeliveryScheduled,
  notifyDeliveryCompleted,
  notifyReturnRequested,
  notifyReturnScheduled,
  notifyReturnCompleted,
  notifyPaymentReceived
} from './notification-manager';

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
    
    const quote = {
      ...data,
      machinePhotos: data.machinePhotos || [],
      ...(data.machineMainPhoto ? { machineMainPhoto: data.machineMainPhoto } : {}),
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(quotesRef, quote);
    const quoteId = docRef.id;

    // Enviar notificação
    await notifyNewQuoteRequest({ id: quoteId, ...quote });

    console.log('Quote created with ID:', quoteId);
    return quoteId;
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
    console.log('Buscando orçamentos para o proprietário:', ownerId);
    const quotesRef = collection(db, 'quotes');
    const q = query(
      quotesRef,
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );

    console.log('Executando query...');
    const querySnapshot = await getDocs(q);
    console.log('Total de orçamentos encontrados:', querySnapshot.size);

    const quotes = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    }) as Quote[];

    console.log('Orçamentos processados:', quotes);
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
    returnType?: 'store' | 'pickup';
    returnNotes?: string;
  }
) {
  try {
    const quoteRef = doc(db, 'quotes', quoteId);
    const quoteDoc = await getDoc(quoteRef);
    
    if (!quoteDoc.exists()) {
      throw new Error('Orçamento não encontrado');
    }

    const quote = { id: quoteId, ...quoteDoc.data() } as Quote;
    const updateData = {
      status,
      ...data,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(quoteRef, updateData);

    // Enviar notificações apropriadas baseadas no novo status
    try {
      switch (status) {
        case 'quoted':
          await notifyQuoteResponse(quote);
          break;
        case 'accepted':
          await notifyQuoteApproved(quote);
          break;
        case 'rejected':
          await notifyQuoteRejected(quote);
          break;
        case 'in_preparation':
          await notifyDeliveryScheduled(quote);
          break;
        case 'delivered':
          await notifyDeliveryCompleted(quote);
          break;
        case 'return_requested':
          await notifyReturnRequested(quote);
          break;
        case 'pickup_scheduled':
          await notifyReturnScheduled(quote);
          break;
        case 'completed':
          await notifyReturnCompleted(quote);
          // Também notificar sobre pagamento se houver valor
          if (quote.value) {
            await notifyPaymentReceived(quote);
          }
          break;
      }
    } catch (notificationError) {
      // Log do erro mas não falha a atualização do status
      console.error('Erro ao enviar notificação:', notificationError);
      
      // Salvar notificação com retry
      const retriesRef = collection(db, 'notification_retries');
      await addDoc(retriesRef, {
        quoteId,
        status,
        createdAt: serverTimestamp(),
        error: notificationError.message,
        retryCount: 0
      });
    }

    console.log('Quote updated successfully');
  } catch (error) {
    console.error('Error updating quote:', error);
    throw new Error('Não foi possível atualizar o orçamento');
  }
}

// Função para processar notificações que falharam
export async function processFailedNotifications() {
  const MAX_RETRIES = 3;
  
  try {
    const retriesRef = collection(db, 'notification_retries');
    const q = query(retriesRef, where('retryCount', '<', MAX_RETRIES));
    const snapshot = await getDocs(q);
    
    for (const doc of snapshot.docs) {
      const retry = doc.data();
      try {
        const quoteRef = await getDoc(doc(db, 'quotes', retry.quoteId));
        if (!quoteRef.exists()) continue;
        
        const quote = { id: retry.quoteId, ...quoteRef.data() } as Quote;
        
        // Tenta enviar a notificação novamente
        switch (retry.status) {
          case 'quoted':
            await notifyQuoteResponse(quote);
            break;
          case 'accepted':
            await notifyQuoteApproved(quote);
            break;
          case 'rejected':
            await notifyQuoteRejected(quote);
            break;
          case 'in_preparation':
            await notifyDeliveryScheduled(quote);
            break;
          case 'delivered':
            await notifyDeliveryCompleted(quote);
            break;
          case 'return_requested':
            await notifyReturnRequested(quote);
            break;
          case 'pickup_scheduled':
            await notifyReturnScheduled(quote);
            break;
          case 'completed':
            await notifyReturnCompleted(quote);
            if (quote.value) {
              await notifyPaymentReceived(quote);
            }
            break;
        }
        
        // Se chegou aqui, a notificação foi enviada com sucesso
        await deleteDoc(doc.ref);
        
      } catch (error) {
        // Incrementa o contador de tentativas
        await updateDoc(doc.ref, {
          retryCount: retry.retryCount + 1,
          lastError: error.message,
          lastRetry: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error('Erro ao processar notificações falhas:', error);
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