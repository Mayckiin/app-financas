// Data Models para Dashboard Financeiro Premium

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  provider: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit_card';
  currency: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  purchaser?: string;
  date: Date;
  dueDate?: Date;
  type: 'income' | 'expense' | 'transfer';
  parentId?: string; // Para parcelas
  installmentNumber?: number;
  totalInstallments?: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Rule {
  id: string;
  userId: string;
  name: string;
  type: 'categorization' | 'automation';
  conditions: RuleCondition[];
  actions: RuleAction[];
  isActive: boolean;
  createdAt: Date;
}

export interface RuleCondition {
  field: 'title' | 'amount' | 'purchaser' | 'category';
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number;
}

export interface RuleAction {
  type: 'set_category' | 'add_tag' | 'set_purchaser';
  value: string;
}

export interface Insight {
  id: string;
  userId: string;
  type: 'warning' | 'info' | 'tip' | 'success';
  title: string;
  message: string;
  value?: number;
  meta?: Record<string, any>;
  status: 'active' | 'dismissed' | 'archived';
  createdAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

// KPIs e Métricas
export interface KPIMetrics {
  // Patrimônio
  netWorth: number;
  netWorthChange: number;
  
  // Fluxo de Caixa
  cashFlow: number;
  cashFlowHealth: 'positive' | 'negative' | 'neutral';
  
  // Investimentos
  totalInvestments: number;
  investmentReturn: number;
  
  // Dívidas
  totalDebt: number;
  debtToIncome: number;
  
  // Poupança
  savingsRate: number;
  monthlyBurnRate: number;
  
  // Período
  period: '7d' | '30d' | '90d' | '365d' | 'custom';
}

export interface CashFlowData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdown {
  categoryName: string;
  amount: number;
  percentage: number;
  color: string;
  transactions: number;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  isPaid: boolean;
  isRecurring: boolean;
}

// Widget Configuration
export interface WidgetConfig {
  id: string;
  type: 'balance' | 'cashflow' | 'categories' | 'bills' | 'goals' | 'kpi' | 'insights';
  position: { x: number; y: number };
  size: { width: number; height: number };
  isVisible: boolean;
  settings?: Record<string, any>;
}

export interface DashboardLayout {
  userId: string;
  widgets: WidgetConfig[];
  theme: 'midnight-gold' | 'custom';
  updatedAt: Date;
}
