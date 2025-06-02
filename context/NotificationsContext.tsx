import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'engine_result' | 'dashboard_result' | 'mechanic_message';
  read: boolean;
  date: string;
  linkId?: string;
};

type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
};

// Create context
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Provider component
export default function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialize with some sample data
  useEffect(() => {
    setNotifications([
      {
        id: '1',
        title: 'Diagnostic Complete',
        message: 'Your engine sound analysis is complete. Tap to view the results.',
        type: 'engine_result',
        read: false,
        date: '2023-09-15T14:48:00.000Z',
        linkId: '1'
      },
      {
        id: '2',
        title: 'Mechanic Response',
        message: 'John\'s Auto Repair has sent you a message regarding your diagnostic result.',
        type: 'mechanic_message',
        read: true,
        date: '2023-09-14T10:30:00.000Z',
        linkId: '1'
      },
      {
        id: '3',
        title: 'Dashboard Light Analysis',
        message: 'Your dashboard light analysis is complete. Tap to view the results.',
        type: 'dashboard_result',
        read: false,
        date: '2023-09-10T10:30:00.000Z',
        linkId: '2'
      }
    ]);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll }}>
      {children}
    </NotificationsContext.Provider>
  );
}

// Custom hook for using notifications context
export function useNotificationsContext() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }
  return context;
}