/**
 * Store Global - Fluxo.Fin
 * Sistema de gerenciamento de estado com persistência localStorage
 */

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  account: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface StoreState {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  goals: Goal[];
}

const STORAGE_KEY = 'fluxo_fin_store_v1';

// Estado inicial com dados de exemplo
const initialState: StoreState = {
  transactions: [
    {
      id: '1',
      type: 'income',
      amount: 5000,
      category: 'Salário',
      account: 'main',
      description: 'Salário mensal',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'expense',
      amount: 1200,
      category: 'Moradia',
      account: 'main',
      description: 'Aluguel',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ],
  categories: [
    { id: '1', name: 'Salário', type: 'income', icon: '💰', color: '#10b981' },
    { id: '2', name: 'Freelance', type: 'income', icon: '💼', color: '#3b82f6' },
    { id: '3', name: 'Investimentos', type: 'income', icon: '📈', color: '#8b5cf6' },
    { id: '4', name: 'Alimentação', type: 'expense', icon: '🍔', color: '#ef4444' },
    { id: '5', name: 'Transporte', type: 'expense', icon: '🚗', color: '#f59e0b' },
    { id: '6', name: 'Moradia', type: 'expense', icon: '🏠', color: '#ec4899' },
    { id: '7', name: 'Saúde', type: 'expense', icon: '⚕️', color: '#06b6d4' },
    { id: '8', name: 'Lazer', type: 'expense', icon: '🎮', color: '#a855f7' },
  ],
  accounts: [
    { id: 'main', name: 'Conta Principal', type: 'checking', balance: 12540.21, color: '#3b82f6' },
    { id: 'savings', name: 'Poupança', type: 'savings', balance: 5000, color: '#10b981' },
    { id: 'credit', name: 'Cartão de Crédito', type: 'credit', balance: -2500, color: '#ef4444' },
  ],
  goals: [
    {
      id: '1',
      name: 'Fundo de Emergência',
      targetAmount: 20000,
      currentAmount: 8500,
      deadline: '2025-12-31',
      category: 'Reserva',
    },
    {
      id: '2',
      name: 'Viagem Europa',
      targetAmount: 15000,
      currentAmount: 4200,
      deadline: '2025-07-01',
      category: 'Lazer',
    },
  ],
};

class Store {
  private state: StoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): StoreState {
    if (typeof window === 'undefined') return initialState;
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
    return initialState;
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState() {
    return this.state;
  }

  // Transactions
  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>) {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.state.transactions.unshift(newTransaction);
    this.saveState();
    return newTransaction;
  }

  updateTransaction(id: string, updates: Partial<Transaction>) {
    this.state.transactions = this.state.transactions.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    this.saveState();
  }

  deleteTransaction(id: string) {
    this.state.transactions = this.state.transactions.filter(t => t.id !== id);
    this.saveState();
  }

  // Categories
  addCategory(category: Omit<Category, 'id'>) {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    this.state.categories.push(newCategory);
    this.saveState();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>) {
    this.state.categories = this.state.categories.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    this.saveState();
  }

  deleteCategory(id: string) {
    this.state.categories = this.state.categories.filter(c => c.id !== id);
    this.saveState();
  }

  // Accounts
  addAccount(account: Omit<Account, 'id'>) {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
    };
    this.state.accounts.push(newAccount);
    this.saveState();
    return newAccount;
  }

  updateAccount(id: string, updates: Partial<Account>) {
    this.state.accounts = this.state.accounts.map(a =>
      a.id === id ? { ...a, ...updates } : a
    );
    this.saveState();
  }

  deleteAccount(id: string) {
    this.state.accounts = this.state.accounts.filter(a => a.id !== id);
    this.saveState();
  }

  // Goals
  addGoal(goal: Omit<Goal, 'id'>) {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    this.state.goals.push(newGoal);
    this.saveState();
    return newGoal;
  }

  updateGoal(id: string, updates: Partial<Goal>) {
    this.state.goals = this.state.goals.map(g =>
      g.id === id ? { ...g, ...updates } : g
    );
    this.saveState();
  }

  deleteGoal(id: string) {
    this.state.goals = this.state.goals.filter(g => g.id !== id);
    this.saveState();
  }

  // Utility methods
  clearAll() {
    this.state = initialState;
    this.saveState();
  }

  exportData() {
    return JSON.stringify(this.state, null, 2);
  }

  importData(jsonData: string) {
    try {
      const data = JSON.parse(jsonData);
      this.state = data;
      this.saveState();
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const store = new Store();
