"use client";

import { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info, TrendingUp, Sparkles, TrendingDown, DollarSign } from 'lucide-react';
import { useStore } from '@/hooks/use-store';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'alert' | 'insight';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  actionLabel?: string;
}

interface NotificationCenterProps {
  aiInsights?: AIInsight[];
}

export function NotificationCenter({ aiInsights = [] }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { transactions } = useStore();

  // Gerar notificações baseadas em vencimentos e insights de IA
  useEffect(() => {
    const now = new Date();
    const allNotifications: Notification[] = [];

    // Adicionar insights de IA como notificações
    aiInsights.forEach((insight) => {
      allNotifications.push({
        id: `insight-${insight.id}`,
        type: 'insight',
        title: insight.title,
        message: insight.message,
        timestamp: now,
        read: false,
        actionLabel: insight.actionable ? insight.actionLabel : undefined,
      });
    });

    // Adicionar notificações de vencimentos
    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        const dueDate = new Date(transaction.date);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Notificações para contas próximas ao vencimento
        if (daysUntilDue === 7) {
          allNotifications.push({
            id: `bill-7-${transaction.id}`,
            type: 'info',
            title: 'Conta vence em 7 dias',
            message: `${transaction.description || transaction.category}: R$ ${transaction.amount.toFixed(2)}`,
            timestamp: now,
            read: false,
            actionLabel: 'Ver detalhes'
          });
        } else if (daysUntilDue === 3) {
          allNotifications.push({
            id: `bill-3-${transaction.id}`,
            type: 'warning',
            title: 'Conta vence em 3 dias',
            message: `${transaction.description || transaction.category}: R$ ${transaction.amount.toFixed(2)}`,
            timestamp: now,
            read: false,
            actionLabel: 'Marcar como paga'
          });
        } else if (daysUntilDue === 1) {
          allNotifications.push({
            id: `bill-1-${transaction.id}`,
            type: 'alert',
            title: 'Conta vence amanhã!',
            message: `${transaction.description || transaction.category}: R$ ${transaction.amount.toFixed(2)}`,
            timestamp: now,
            read: false,
            actionLabel: 'Pagar agora'
          });
        } else if (daysUntilDue === 0) {
          allNotifications.push({
            id: `bill-0-${transaction.id}`,
            type: 'alert',
            title: 'Conta vence hoje!',
            message: `${transaction.description || transaction.category}: R$ ${transaction.amount.toFixed(2)}`,
            timestamp: now,
            read: false,
            actionLabel: 'Pagar agora'
          });
        }
      }
    });

    setNotifications(allNotifications);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length, aiInsights.length]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'insight':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColorClasses = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/40 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/40 bg-yellow-500/10';
      case 'alert':
        return 'border-red-500/40 bg-red-500/10';
      case 'insight':
        return 'border-purple-500/40 bg-purple-500/10';
      default:
        return 'border-blue-500/40 bg-blue-500/10';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button - ESTILO BRANCO */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors relative group"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5 text-white group-hover:text-white/80 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Notification Panel - Mobile Responsive */}
      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed sm:absolute top-16 sm:top-12 right-0 left-0 sm:left-auto w-full sm:w-96 max-h-[calc(100vh-5rem)] sm:max-h-[600px] bg-gradient-to-br from-gray-950 via-black to-gray-900 border-t sm:border border-amber-500/40 sm:rounded-xl shadow-2xl shadow-amber-500/20 z-50 overflow-hidden backdrop-blur-xl">
            {/* Header - Mobile Optimized */}
            <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-b border-amber-500/30 p-3 sm:p-4 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-base sm:text-lg truncate">Notificações</h3>
                <p className="text-amber-300 text-xs">
                  {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                </p>
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border transition-all ${
                        notification.read
                          ? 'bg-gray-900/50 border-gray-700/40 opacity-60'
                          : getColorClasses(notification.type)
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-sm mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-gray-300 text-xs mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                              >
                                Marcar como lida
                              </button>
                            )}
                          </div>
                          {notification.actionLabel && !notification.read && (
                            <button
                              onClick={notification.onAction}
                              className="mt-2 w-full px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-xs text-amber-300 hover:text-amber-200 transition-colors"
                            >
                              {notification.actionLabel}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
