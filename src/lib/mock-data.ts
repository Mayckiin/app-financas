// Dados mockados para demonstração do Dashboard

import { Account, Category, Transaction, Goal, DashboardSummary } from './types';

export const mockAccounts: Account[] = [
  { id: '1', name: 'Conta Corrente', type: 'checking', balance: 5420.50, currency: 'BRL', color: '#0D6EFD' },
  { id: '2', name: 'Cartão Crédito', type: 'card', balance: -1850.00, currency: 'BRL', color: '#E74C3C' },
  { id: '3', name: 'Carteira', type: 'cash', balance: 320.00, currency: 'BRL', color: '#2ECC71' },
  { id: '4', name: 'Investimentos', type: 'investment', balance: 12500.00, currency: 'BRL', color: '#9B59B6' },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Alimentação', type: 'expense', color: '#FF6B6B', icon: 'utensils' },
  { id: '2', name: 'Transporte', type: 'expense', color: '#4ECDC4', icon: 'car' },
  { id: '3', name: 'Moradia', type: 'expense', color: '#45B7D1', icon: 'home' },
  { id: '4', name: 'Lazer', type: 'expense', color: '#FFA07A', icon: 'smile' },
  { id: '5', name: 'Saúde', type: 'expense', color: '#98D8C8', icon: 'heart' },
  { id: '6', name: 'Salário', type: 'income', color: '#2ECC71', icon: 'dollar-sign' },
  { id: '7', name: 'Freelance', type: 'income', color: '#27AE60', icon: 'briefcase' },
];

export const mockTransactions: Transaction[] = [
  { id: '1', type: 'expense', amount: 85.50, currency: 'BRL', categoryId: '1', accountId: '1', date: '2025-01-15', note: 'Almoço cliente', status: 'confirmed' },
  { id: '2', type: 'expense', amount: 120.00, currency: 'BRL', categoryId: '2', accountId: '2', date: '2025-01-14', note: 'Uber', status: 'confirmed' },
  { id: '3', type: 'income', amount: 4500.00, currency: 'BRL', categoryId: '6', accountId: '1', date: '2025-01-10', status: 'confirmed' },
  { id: '4', type: 'expense', amount: 1200.00, currency: 'BRL', categoryId: '3', accountId: '1', date: '2025-01-05', note: 'Aluguel', status: 'confirmed' },
  { id: '5', name: 'Freelance projeto X', type: 'income', amount: 2500.00, currency: 'BRL', categoryId: '7', accountId: '1', date: '2025-01-12', status: 'confirmed' },
];

export const mockGoals: Goal[] = [
  { id: '1', name: 'Viagem Europa', targetAmount: 15000, currentAmount: 8500, dueDate: '2025-12-31', color: '#3498DB' },
  { id: '2', name: 'Reserva Emergência', targetAmount: 20000, currentAmount: 12500, dueDate: '2025-06-30', color: '#2ECC71' },
  { id: '3', name: 'Novo Notebook', targetAmount: 5000, currentAmount: 3200, dueDate: '2025-03-31', color: '#9B59B6' },
];

export const mockDashboardSummary: DashboardSummary = {
  totalBalance: 16390.50,
  monthExpenses: 3850.00,
  monthIncome: 7000.00,
  expenseChange: -12.5, // 12.5% menos que mês anterior
  incomeChange: 8.3, // 8.3% mais que mês anterior
  topCategories: [
    { categoryId: '3', categoryName: 'Moradia', amount: 1200.00, percentage: 31.2, color: '#45B7D1' },
    { categoryId: '1', categoryName: 'Alimentação', amount: 950.00, percentage: 24.7, color: '#FF6B6B' },
    { categoryId: '2', categoryName: 'Transporte', amount: 680.00, percentage: 17.7, color: '#4ECDC4' },
    { categoryId: '4', categoryName: 'Lazer', amount: 520.00, percentage: 13.5, color: '#FFA07A' },
    { categoryId: '5', categoryName: 'Saúde', amount: 500.00, percentage: 13.0, color: '#98D8C8' },
  ],
  upcomingBills: [
    { id: '1', name: 'Cartão de Crédito', amount: 1850.00, dueDate: '2025-01-25', isPaid: false },
    { id: '2', name: 'Internet', amount: 120.00, dueDate: '2025-01-28', isPaid: false },
    { id: '3', name: 'Energia', amount: 180.00, dueDate: '2025-01-30', isPaid: false },
    { id: '4', name: 'Água', amount: 85.00, dueDate: '2025-02-02', isPaid: true },
  ],
  cashFlowProjection: [
    { date: '2025-01-20', income: 500, expense: 350, balance: 16540.50 },
    { date: '2025-01-21', income: 0, expense: 120, balance: 16420.50 },
    { date: '2025-01-22', income: 1200, expense: 280, balance: 17340.50 },
    { date: '2025-01-23', income: 0, expense: 450, balance: 16890.50 },
    { date: '2025-01-24', income: 0, expense: 180, balance: 16710.50 },
    { date: '2025-01-25', income: 0, expense: 1850, balance: 14860.50 },
    { date: '2025-01-26', income: 800, expense: 220, balance: 15440.50 },
  ],
};
