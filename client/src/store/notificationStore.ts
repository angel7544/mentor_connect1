import { create } from 'zustand';
import { Notification } from '../types/notification';
import { dummyNotifications } from '../data/notificationData';

type NotificationStore = {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  fetchNotifications: () => Promise<void>;
}

const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  
  setNotifications: (notifications) => set({ notifications }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(notification => 
      notification.id === id 
        ? { ...notification, isRead: true } 
        : notification
    )
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(notification => ({ ...notification, isRead: true }))
  })),
  
  clearAll: () => set({ notifications: [] }),
  
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, you would fetch from an API
      // const response = await fetch('/api/notifications');
      // const data = await response.json();
      
      // For now, simulate an API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ notifications: dummyNotifications, loading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notifications', 
        loading: false 
      });
    }
  }
})) as unknown as () => NotificationStore;

export default useNotificationStore; 