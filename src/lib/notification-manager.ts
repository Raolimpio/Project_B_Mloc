import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Quote } from '@/types/quote';
import type { Notification } from '@/types/notification';

export async function createNotification({
  userId,
  title,
  body,
  type,
  data
}: {
  userId: string;
  title: string;
  body: string;
  type: Notification['type'];
  data?: Record<string, any>;
}) {
  try {
    const notificationsRef = collection(db, 'notifications');
    await addDoc(notificationsRef, {
      userId,
      title,
      body,
      type,
      data,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

// Notificações para o fluxo de orçamento
export async function notifyNewQuoteRequest(quote: Quote) {
  // Notificar proprietário
  await createNotification({
    userId: quote.ownerId,
    title: 'Novo Pedido de Orçamento',
    body: `Você recebeu um novo pedido de orçamento para ${quote.machineName}`,
    type: 'quote',
    data: { quoteId: quote.id }
  });
}

export async function notifyQuoteResponse(quote: Quote) {
  // Notificar solicitante
  await createNotification({
    userId: quote.requesterId,
    title: 'Orçamento Respondido',
    body: `O proprietário respondeu seu pedido de orçamento para ${quote.machineName}`,
    type: 'quote',
    data: { quoteId: quote.id }
  });
}

export async function notifyQuoteApproved(quote: Quote) {
  // Notificar proprietário
  await createNotification({
    userId: quote.ownerId,
    title: 'Orçamento Aprovado',
    body: `Seu orçamento para ${quote.machineName} foi aprovado!`,
    type: 'quote',
    data: { quoteId: quote.id }
  });
}

export async function notifyQuoteRejected(quote: Quote) {
  // Notificar proprietário
  await createNotification({
    userId: quote.ownerId,
    title: 'Orçamento Recusado',
    body: `Seu orçamento para ${quote.machineName} foi recusado`,
    type: 'quote',
    data: { quoteId: quote.id }
  });
}

export async function notifyDeliveryScheduled(quote: Quote) {
  // Notificar solicitante
  await createNotification({
    userId: quote.requesterId,
    title: 'Entrega Agendada',
    body: `A entrega do equipamento ${quote.machineName} foi agendada`,
    type: 'delivery',
    data: { quoteId: quote.id }
  });
}

export async function notifyDeliveryCompleted(quote: Quote) {
  // Notificar proprietário e solicitante
  await Promise.all([
    createNotification({
      userId: quote.ownerId,
      title: 'Entrega Confirmada',
      body: `O equipamento ${quote.machineName} foi entregue com sucesso`,
      type: 'delivery',
      data: { quoteId: quote.id }
    }),
    createNotification({
      userId: quote.requesterId,
      title: 'Entrega Confirmada',
      body: `O equipamento ${quote.machineName} foi entregue. Por favor, confirme o recebimento`,
      type: 'delivery',
      data: { quoteId: quote.id }
    })
  ]);
}

export async function notifyReturnRequested(quote: Quote) {
  // Notificar proprietário
  await createNotification({
    userId: quote.ownerId,
    title: 'Solicitação de Devolução',
    body: `Foi solicitada a devolução do equipamento ${quote.machineName}`,
    type: 'return',
    data: { quoteId: quote.id }
  });
}

export async function notifyReturnScheduled(quote: Quote) {
  // Notificar solicitante
  await createNotification({
    userId: quote.requesterId,
    title: 'Devolução Agendada',
    body: `A devolução do equipamento ${quote.machineName} foi agendada`,
    type: 'return',
    data: { quoteId: quote.id }
  });
}

export async function notifyReturnCompleted(quote: Quote) {
  // Notificar proprietário e solicitante
  await Promise.all([
    createNotification({
      userId: quote.ownerId,
      title: 'Devolução Confirmada',
      body: `O equipamento ${quote.machineName} foi devolvido com sucesso`,
      type: 'return',
      data: { quoteId: quote.id }
    }),
    createNotification({
      userId: quote.requesterId,
      title: 'Devolução Confirmada',
      body: `A devolução do equipamento ${quote.machineName} foi confirmada`,
      type: 'return',
      data: { quoteId: quote.id }
    })
  ]);
}

export async function notifyPaymentReceived(quote: Quote) {
  // Notificar proprietário e solicitante
  await Promise.all([
    createNotification({
      userId: quote.ownerId,
      title: 'Pagamento Recebido',
      body: `O pagamento do aluguel de ${quote.machineName} foi recebido`,
      type: 'payment',
      data: { quoteId: quote.id }
    }),
    createNotification({
      userId: quote.requesterId,
      title: 'Pagamento Confirmado',
      body: `Seu pagamento para o aluguel de ${quote.machineName} foi confirmado`,
      type: 'payment',
      data: { quoteId: quote.id }
    })
  ]);
}

export async function notifyMaintenanceRequired(quote: Quote, issue: string) {
  // Notificar proprietário
  await createNotification({
    userId: quote.ownerId,
    title: 'Manutenção Necessária',
    body: `Foi reportado um problema com ${quote.machineName}: ${issue}`,
    type: 'maintenance',
    data: { quoteId: quote.id, issue }
  });
}
