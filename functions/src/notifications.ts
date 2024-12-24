import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Inicializa o admin se ainda não foi inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const MAX_RETRIES = 3;

// Executa a cada 5 minutos
export const processFailedNotifications = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    try {
      const retriesRef = db.collection('notification_retries');
      const snapshot = await retriesRef
        .where('retryCount', '<', MAX_RETRIES)
        .get();

      console.log(`Processando ${snapshot.size} notificações falhas`);
      
      const batch = db.batch();
      let processedCount = 0;
      let successCount = 0;
      let failedCount = 0;

      for (const doc of snapshot.docs) {
        const retry = doc.data();
        try {
          const quoteRef = await db.doc(`quotes/${retry.quoteId}`).get();
          if (!quoteRef.exists) {
            // Remove retry se o orçamento não existe mais
            batch.delete(doc.ref);
            continue;
          }

          const quote = { id: retry.quoteId, ...quoteRef.data() };
          const notificationRef = db.collection('notifications').doc();
          
          // Cria a notificação baseada no status
          const notification = {
            userId: getNotificationUserId(quote, retry.status),
            title: getNotificationTitle(retry.status),
            body: getNotificationBody(quote, retry.status),
            type: getNotificationType(retry.status),
            data: { quoteId: quote.id },
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          };

          // Adiciona a notificação ao batch
          batch.set(notificationRef, notification);
          
          // Remove o retry do batch
          batch.delete(doc.ref);
          
          successCount++;
        } catch (error) {
          console.error(`Erro ao processar notificação ${doc.id}:`, error);
          
          // Incrementa o contador de tentativas
          batch.update(doc.ref, {
            retryCount: retry.retryCount + 1,
            lastError: error.message,
            lastRetry: admin.firestore.FieldValue.serverTimestamp()
          });
          
          failedCount++;
        }
        
        processedCount++;
        
        // Comita o batch a cada 500 operações
        if (processedCount % 500 === 0) {
          await batch.commit();
        }
      }

      // Comita as operações restantes
      if (processedCount % 500 !== 0) {
        await batch.commit();
      }

      console.log(`Processamento concluído:
        - Total processado: ${processedCount}
        - Sucesso: ${successCount}
        - Falhas: ${failedCount}`);
      
      return { success: true, processed: processedCount };
    } catch (error) {
      console.error('Erro ao processar notificações falhas:', error);
      return { success: false, error: error.message };
    }
  });

// Limpa notificações antigas (mais de 30 dias)
export const cleanupOldNotifications = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const notificationsRef = db.collection('notifications');
      const snapshot = await notificationsRef
        .where('createdAt', '<', thirtyDaysAgo)
        .get();

      console.log(`Limpando ${snapshot.size} notificações antigas`);
      
      const batch = db.batch();
      let count = 0;

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
        
        if (count % 500 === 0) {
          batch.commit();
        }
      });

      if (count % 500 !== 0) {
        await batch.commit();
      }

      console.log(`${count} notificações antigas removidas`);
      return { success: true, cleaned: count };
    } catch (error) {
      console.error('Erro ao limpar notificações antigas:', error);
      return { success: false, error: error.message };
    }
  });

// Funções auxiliares
function getNotificationUserId(quote: any, status: string): string {
  switch (status) {
    case 'quoted':
    case 'in_preparation':
    case 'delivered':
    case 'pickup_scheduled':
      return quote.requesterId;
    case 'accepted':
    case 'rejected':
    case 'return_requested':
    case 'completed':
      return quote.ownerId;
    default:
      return quote.ownerId;
  }
}

function getNotificationTitle(status: string): string {
  switch (status) {
    case 'quoted':
      return 'Orçamento Respondido';
    case 'accepted':
      return 'Orçamento Aprovado';
    case 'rejected':
      return 'Orçamento Recusado';
    case 'in_preparation':
      return 'Entrega Agendada';
    case 'delivered':
      return 'Equipamento Entregue';
    case 'return_requested':
      return 'Solicitação de Devolução';
    case 'pickup_scheduled':
      return 'Devolução Agendada';
    case 'completed':
      return 'Locação Finalizada';
    default:
      return 'Atualização do Orçamento';
  }
}

function getNotificationBody(quote: any, status: string): string {
  switch (status) {
    case 'quoted':
      return `O proprietário respondeu seu pedido de orçamento para ${quote.machineName}`;
    case 'accepted':
      return `Seu orçamento para ${quote.machineName} foi aprovado!`;
    case 'rejected':
      return `Seu orçamento para ${quote.machineName} foi recusado`;
    case 'in_preparation':
      return `A entrega do equipamento ${quote.machineName} foi agendada`;
    case 'delivered':
      return `O equipamento ${quote.machineName} foi entregue. Por favor, confirme o recebimento`;
    case 'return_requested':
      return `Foi solicitada a devolução do equipamento ${quote.machineName}`;
    case 'pickup_scheduled':
      return `A devolução do equipamento ${quote.machineName} foi agendada`;
    case 'completed':
      return `A locação do equipamento ${quote.machineName} foi finalizada`;
    default:
      return `Houve uma atualização no orçamento de ${quote.machineName}`;
  }
}

function getNotificationType(status: string): string {
  switch (status) {
    case 'quoted':
    case 'accepted':
    case 'rejected':
      return 'quote';
    case 'in_preparation':
    case 'delivered':
      return 'delivery';
    case 'return_requested':
    case 'pickup_scheduled':
    case 'completed':
      return 'return';
    default:
      return 'info';
  }
}
