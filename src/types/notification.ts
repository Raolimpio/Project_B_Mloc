export type NotificationType = 
  | 'quote'           // Orçamentos
  | 'quote_approved'  // Orçamentos aprovados
  | 'delivery'        // Atualizações de entrega
  | 'payment'         // Pagamentos
  | 'message'         // Mensagens
  | 'maintenance'     // Manutenção
  | 'system';         // Sistema

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}