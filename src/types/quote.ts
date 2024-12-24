import { Address } from './auth';

export type QuoteStatus = 
  | 'pending'           // Aguardando resposta do proprietário
  | 'quoted'           // Proprietário informou o valor
  | 'accepted'         // Cliente aceitou o orçamento
  | 'rejected'         // Cliente rejeitou o orçamento
  | 'canceled'         // Orçamento cancelado
  | 'in_preparation'   // Máquina está sendo preparada
  | 'in_transit'       // Máquina está em trânsito
  | 'delivered'        // Máquina foi entregue
  | 'return_requested' // Cliente solicitou devolução
  | 'pickup_scheduled' // Coleta agendada pelo proprietário
  | 'return_in_transit' // Máquina em trânsito para devolução
  | 'completed';       // Locação finalizada

export interface ServiceDetails {
  serviceType: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  additionalNotes?: string;
}

export interface Quote {
  id: string;
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
  status: QuoteStatus;
  value?: number;
  message?: string;
  returnType?: 'store' | 'pickup';  // Tipo de devolução
  returnNotes?: string;             // Observações da devolução
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteRequest {
  serviceDetails: Omit<ServiceDetails, 'startDate' | 'endDate'> & {
    startDate: string;
    endDate?: string;
  };
  deliveryAddressId: string;
  providerId: string;
}