import { useNotifications } from '../contexts/NotificationContext';

export const useNotificationManager = () => {
  const { addNotification } = useNotifications();

  const notifyQuoteCreated = (quoteId: string) => {
    addNotification({
      type: 'orçamento',
      title: 'Novo Orçamento Criado',
      message: `O orçamento #${quoteId} foi criado com sucesso.`
    });
  };

  const notifyQuoteApproved = (quoteId: string) => {
    addNotification({
      type: 'aprovação',
      title: 'Orçamento Aprovado',
      message: `O orçamento #${quoteId} foi aprovado!`
    });
  };

  const notifyQuoteRejected = (quoteId: string) => {
    addNotification({
      type: 'info',
      title: 'Orçamento Recusado',
      message: `O orçamento #${quoteId} foi recusado.`
    });
  };

  const notifyDeliveryScheduled = (quoteId: string, date: Date) => {
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);

    addNotification({
      type: 'entrega',
      title: 'Entrega Agendada',
      message: `A entrega do pedido #${quoteId} está agendada para ${formattedDate}`
    });
  };

  const notifyDeliveryCompleted = (quoteId: string) => {
    addNotification({
      type: 'entrega',
      title: 'Entrega Concluída',
      message: `A entrega do pedido #${quoteId} foi concluída com sucesso!`
    });
  };

  return {
    notifyQuoteCreated,
    notifyQuoteApproved,
    notifyQuoteRejected,
    notifyDeliveryScheduled,
    notifyDeliveryCompleted
  };
};
