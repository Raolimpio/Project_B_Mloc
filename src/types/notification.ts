export interface Notification {
  id: string;
  userId: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt?: Date;
  link?: string;
}