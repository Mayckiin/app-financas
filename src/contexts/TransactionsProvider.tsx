"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  person?: string;
  account?: string;
  installments?: number;
  currentInstallment?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionsByPeriod: (startDate: Date, endDate: Date) => Transaction[];
  getTransactionsByCategory: (category: string) => Transaction[];
  getTransactionsByPerson: (person: string) => Transaction[];
  isLoading: boolean;
  error: string | null;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar transações do localStorage na inicialização
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const stored = localStorage.getItem('fluxofin_transactions');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Validar dados
          const validated = parsed.filter((t: any) => 
            t.id && t.amount && t.date && t.type && ['income', 'expense'].includes(t.type)
          );
          setTransactions(validated);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Erro ao carregar transações:', err);
        setError('Erro ao carregar transações');
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Sincronizar com localStorage sempre que transações mudarem
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('fluxofin_transactions', JSON.stringify(transactions));
      // Disparar evento de atualização
      window.dispatchEvent(new CustomEvent('transactions-updated', { detail: transactions }));
    }
  }, [transactions, isLoading]);

  // Escutar eventos de sincronização
  useEffect(() => {
    const handleSyncComplete = () => {
      // Recarregar dados após sincronização
      const stored = localStorage.getItem('fluxofin_transactions');
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    };

    window.addEventListener('app-sync-complete', handleSyncComplete);
    return () => window.removeEventListener('app-sync-complete', handleSyncComplete);
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Validação completa anti-bug
      if (!transaction.amount || transaction.amount <= 0) {
        throw new Error('Valor inválido');
      }
      if (!transaction.date) {
        throw new Error('Data é obrigatória');
      }
      if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
        throw new Error('Tipo inválido');
      }
      if (!transaction.category) {
        throw new Error('Categoria é obrigatória');
      }

      const now = new Date().toISOString();
      const newTransaction: Transaction = {
        ...transaction,
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };

      // Atualizar estado local imediatamente
      setTransactions(prev => [...prev, newTransaction]);

      // Simular sincronização com backend
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Aqui você faria a chamada real para o backend
      // await api.post('/transactions', newTransaction);

      console.log('✅ Transação adicionada:', newTransaction.id);
      
    } catch (err: any) {
      console.error('❌ Erro ao adicionar transação:', err);
      setError(err.message || 'Erro ao adicionar transação');
      throw err;
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    try {
      // Validação
      if (updates.amount !== undefined && updates.amount <= 0) {
        throw new Error('Valor inválido');
      }
      if (updates.type && !['income', 'expense'].includes(updates.type)) {
        throw new Error('Tipo inválido');
      }

      const now = new Date().toISOString();
      
      // Atualizar estado local imediatamente
      setTransactions(prev => 
        prev.map(t => 
          t.id === id 
            ? { ...t, ...updates, updatedAt: now }
            : t
        )
      );

      // Simular sincronização com backend
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Aqui você faria a chamada real para o backend
      // await api.patch(`/transactions/${id}`, updates);

      console.log('✅ Transação atualizada:', id);
      
    } catch (err: any) {
      console.error('❌ Erro ao atualizar transação:', err);
      setError(err.message || 'Erro ao atualizar transação');
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      // Atualizar estado local imediatamente
      setTransactions(prev => prev.filter(t => t.id !== id));

      // Simular sincronização com backend
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Aqui você faria a chamada real para o backend
      // await api.delete(`/transactions/${id}`);

      console.log('✅ Transação deletada:', id);
      
    } catch (err: any) {
      console.error('❌ Erro ao deletar transação:', err);
      setError(err.message || 'Erro ao deletar transação');
      throw err;
    }
  }, []);

  const getTransactionsByPeriod = useCallback((startDate: Date, endDate: Date) => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions]);

  const getTransactionsByCategory = useCallback((category: string) => {
    return transactions.filter(t => t.category === category);
  }, [transactions]);

  const getTransactionsByPerson = useCallback((person: string) => {
    return transactions.filter(t => t.person === person);
  }, [transactions]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionsByPeriod,
        getTransactionsByCategory,
        getTransactionsByPerson,
        isLoading,
        error,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
}
