import type { Timestamp } from 'firebase/firestore';

export interface Quote {
  id: string;
  machineId: string;
  machineName: string;
  machinePhoto: string;
  ownerId: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'in_preparation' | 'in_transit' | 'delivered' | 'return_requested' | 'returned';
  startDate: string;
  endDate: string;
  purpose: string;
  location: string;
  value?: number;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  returnType?: 'store' | 'pickup';
  returnNotes?: string;
  deliveryStatus?: {
    status: 'in_preparation' | 'in_transit' | 'delivered';
    updatedAt: Date;
    notes?: string;
  };
}