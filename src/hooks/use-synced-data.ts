import { useAppSync } from '@/contexts/AppSyncProvider';
import { useTransactions } from '@/contexts/TransactionsProvider';
import { useSchedule } from '@/contexts/ScheduleProvider';
import { useNotifications } from '@/contexts/NotificationProvider';

/**
 * Hook unificado para acessar todos os dados sincronizados do app
 * Garante consistência e sincronização total entre todos os módulos
 */
export function useSyncedData() {
  const syncContext = useAppSync();
  const transactionsContext = useTransactions();
  const scheduleContext = useSchedule();
  const notificationsContext = useNotifications();

  return {
    // Sync Status
    syncStatus: syncContext.syncStatus,
    triggerSync: syncContext.triggerSync,
    forceRefresh: syncContext.forceRefresh,

    // Transactions
    transactions: transactionsContext.transactions,
    addTransaction: transactionsContext.addTransaction,
    updateTransaction: transactionsContext.updateTransaction,
    deleteTransaction: transactionsContext.deleteTransaction,
    getTransactionsByPeriod: transactionsContext.getTransactionsByPeriod,
    getTransactionsByCategory: transactionsContext.getTransactionsByCategory,
    getTransactionsByPerson: transactionsContext.getTransactionsByPerson,
    transactionsLoading: transactionsContext.isLoading,
    transactionsError: transactionsContext.error,

    // Schedule
    schedules: scheduleContext.schedules,
    addSchedule: scheduleContext.addSchedule,
    updateSchedule: scheduleContext.updateSchedule,
    deleteSchedule: scheduleContext.deleteSchedule,
    markScheduleAsCompleted: scheduleContext.markAsCompleted,
    getUpcomingSchedules: scheduleContext.getUpcomingSchedules,
    getSchedulesByType: scheduleContext.getSchedulesByType,
    schedulesLoading: scheduleContext.isLoading,
    schedulesError: scheduleContext.error,

    // Notifications
    notifications: notificationsContext.notifications,
    unreadCount: notificationsContext.unreadCount,
    addNotification: notificationsContext.addNotification,
    markNotificationAsRead: notificationsContext.markAsRead,
    markAllNotificationsAsRead: notificationsContext.markAllAsRead,
    deleteNotification: notificationsContext.deleteNotification,
    clearAllNotifications: notificationsContext.clearAll,
    getNotificationsByType: notificationsContext.getNotificationsByType,
    getNotificationsByPriority: notificationsContext.getNotificationsByPriority,
  };
}

/**
 * Hook para escutar mudanças em tempo real
 * Útil para componentes que precisam reagir a atualizações
 */
export function useRealtimeUpdates(callback: () => void) {
  if (typeof window === 'undefined') return;

  const handleUpdate = () => {
    callback();
  };

  window.addEventListener('transactions-updated', handleUpdate);
  window.addEventListener('schedules-updated', handleUpdate);
  window.addEventListener('notifications-updated', handleUpdate);
  window.addEventListener('app-sync-complete', handleUpdate);
  window.addEventListener('force-refresh', handleUpdate);

  return () => {
    window.removeEventListener('transactions-updated', handleUpdate);
    window.removeEventListener('schedules-updated', handleUpdate);
    window.removeEventListener('notifications-updated', handleUpdate);
    window.removeEventListener('app-sync-complete', handleUpdate);
    window.removeEventListener('force-refresh', handleUpdate);
  };
}
