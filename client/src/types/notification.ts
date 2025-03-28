export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date | string;
  isRead: boolean;
  link?: string;
  icon?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error'; 