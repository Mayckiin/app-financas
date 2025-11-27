// Tipos principais do Fluxo.Fin

export type TransactionType = 'expense' | 'income' | 'transfer';
export type AccountType = 'checking' | 'card' | 'cash' | 'investment';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  categoryId: string;
  accountId: string;
  date: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
  color?: string;
}

export interface DashboardSummary {
  totalBalance: number;
  monthExpenses: number;
  monthIncome: number;
  expenseChange: number; // % variação M/M
  incomeChange: number;
  topCategories: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  upcomingBills: Array<{
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    isPaid: boolean;
  }>;
  cashFlowProjection: Array<{
    date: string;
    income: number;
    expense: number;
    balance: number;
  }>;
}
