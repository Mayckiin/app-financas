"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  isSyncing: boolean;
  error: string | null;
}

interface AppSyncContextType {
  syncStatus: SyncStatus;
  triggerSync: () => Promise<void>;
  forceRefresh: () => void;
}

const AppSyncContext = createContext<AppSyncContextType | undefined>(undefined);

export function AppSyncProvider({ children }: { children: ReactNode }) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    lastSync: null,
    isSyncing: false,
    error: null,
  });

  // Auto-harmonização na inicialização
  useEffect(() => {
    const initializeSync = async () => {
      console.log('🔄 Iniciando auto-harmonização do sistema...');
      
      // Verificar integridade dos dados
      const storedTransactions = localStorage.getItem('fluxofin_transactions');
      const storedAccounts = localStorage.getItem('fluxofin_accounts');
      const storedGoals = localStorage.getItem('fluxofin_goals');
      
      // Validar e corrigir inconsistências
      if (storedTransactions) {
        try {
          const transactions = JSON.parse(storedTransactions);
          // Validar cada transação
          const validTransactions = transactions.filter((t: any) => {
            return t.id && t.amount && t.date && t.type;
          });
          
          if (validTransactions.length !== transactions.length) {
            console.warn('⚠️ Transações inválidas removidas:', transactions.length - validTransactions.length);
            localStorage.setItem('fluxofin_transactions', JSON.stringify(validTransactions));
          }
        } catch (error) {
          console.error('❌ Erro ao validar transações:', error);
        }
      }
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
      }));
      
      console.log('✅ Auto-harmonização concluída');
    };

    initializeSync();
  }, []);

  // Sincronização periódica (polling a cada 30 segundos)
  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (!syncStatus.isSyncing) {
        triggerSync();
      }
    }, 30000); // 30 segundos

    return () => clearInterval(syncInterval);
  }, [syncStatus.isSyncing]);

  // Detectar mudanças de conectividade
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true, error: null }));
      triggerSync();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ 
        ...prev, 
        isOnline: false, 
        error: 'Sem conexão com a internet' 
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = useCallback(async () => {
    if (syncStatus.isSyncing) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      // Simular sincronização com backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Aqui você faria as chamadas reais para o backend:
      // - Buscar novas transações
      // - Atualizar parcelas e status
      // - Carregar notificações automáticas
      // - Atualizar agendamentos
      // - Sincronizar dados da assistente virtual
      
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSync: new Date(),
        error: null,
      }));
      
      // Disparar evento customizado para notificar outros componentes
      window.dispatchEvent(new CustomEvent('app-sync-complete'));
      
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: 'Erro ao sincronizar dados',
      }));
      
      // Tentar novamente após 5 segundos
      setTimeout(() => {
        triggerSync();
      }, 5000);
    }
  }, [syncStatus.isSyncing]);

  const forceRefresh = useCallback(() => {
    console.log('🔄 Forçando refresh completo...');
    window.dispatchEvent(new CustomEvent('force-refresh'));
    triggerSync();
  }, [triggerSync]);

  return (
    <AppSyncContext.Provider value={{ syncStatus, triggerSync, forceRefresh }}>
      {children}
    </AppSyncContext.Provider>
  );
}

export function useAppSync() {
  const context = useContext(AppSyncContext);
  if (context === undefined) {
    throw new Error('useAppSync must be used within an AppSyncProvider');
  }
  return context;
}
