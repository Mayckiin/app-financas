"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'bill' | 'installment' | 'goal' | 'alert' | 'schedule' | 'insight';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  expiresAt?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getNotificationsByType: (type: Notification['type']) => Notification[];
  getNotificationsByPriority: (priority: Notification['priority']) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Carregar notificações do localStorage na inicialização
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem('fluxofin_notifications');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Remover notificações expiradas
          const now = new Date();
          const valid = parsed.filter((n: Notification) => 
            !n.expiresAt || new Date(n.expiresAt) > now
          );
          setNotifications(valid);
        }
      } catch (err) {
        console.error('❌ Erro ao carregar notificações:', err);
      }
    };

    loadNotifications();
  }, []);

  // Sincronizar com localStorage sempre que notificações mudarem
  useEffect(() => {
    localStorage.setItem('fluxofin_notifications', JSON.stringify(notifications));
    // Disparar evento de atualização
    window.dispatchEvent(new CustomEvent('notifications-updated', { detail: notifications }));
  }, [notifications]);

  // Escutar eventos de transações para gerar notificações automáticas
  useEffect(() => {
    const handleTransactionsUpdate = (event: any) => {
      const transactions = event.detail;
      const now = new Date();
      
      // Verificar contas próximas ao vencimento
      transactions.forEach((transaction: any) => {
        if (transaction.type === 'expense') {
          const dueDate = new Date(transaction.date);
          const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Notificar 7, 3, 1 dias antes e no dia
          if ([7, 3, 1, 0].includes(daysUntilDue)) {
            const priority = daysUntilDue === 0 ? 'urgent' : daysUntilDue === 1 ? 'high' : 'medium';
            const message = daysUntilDue === 0 
              ? `Vence hoje: ${transaction.description || transaction.category}`
              : `Vence em ${daysUntilDue} dia(s): ${transaction.description || transaction.category}`;
            
            addNotification({
              type: 'bill',
              title: 'Conta a Vencer',
              message,
              priority,
              metadata: { transactionId: transaction.id, dueDate: transaction.date },
            });
          }
        }
      });
    };

    window.addEventListener('transactions-updated', handleTransactionsUpdate);
    return () => window.removeEventListener('transactions-updated', handleTransactionsUpdate);
  }, []);

  // Escutar eventos de agendamentos
  useEffect(() => {
    const handleScheduleNotification = (event: any) => {
      const { title, type, value } = event.detail;
      
      addNotification({
        type: 'schedule',
        title: '📅 Lembrete Agendado',
        message: value 
          ? `${title} - R$ ${value.toFixed(2)}`
          : title,
        priority: type === 'cobranca' ? 'high' : 'medium',
      });
    };

    window.addEventListener('schedule-notification', handleScheduleNotification);
    return () => window.removeEventListener('schedule-notification', handleScheduleNotification);
  }, []);

  // Limpar notificações expiradas periodicamente
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      setNotifications(prev => 
        prev.filter(n => !n.expiresAt || new Date(n.expiresAt) > now)
      );
    }, 60000); // A cada minuto

    return () => clearInterval(cleanupInterval);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Disparar evento para UI
    window.dispatchEvent(new CustomEvent('new-notification', { detail: newNotification }));
    
    console.log('🔔 Nova notificação:', newNotification.title);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const getNotificationsByPriority = useCallback((priority: Notification['priority']) => {
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        getNotificationsByType,
        getNotificationsByPriority,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
