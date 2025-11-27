"use client";

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { ExpenseIncomeCards } from '@/components/dashboard/expense-income-cards';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart';
import { UpcomingBills } from '@/components/dashboard/upcoming-bills';
import { GoalsProgress } from '@/components/dashboard/goals-progress';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { QuickTransactionModal } from '@/components/quick-transaction-modal';
import { useStore } from '@/hooks/use-store';

export default function Home() {
  const { transactions, accounts, goals } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calcular dados do dashboard a partir do store
  const dashboardData = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Transações do mês atual
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth;
    });

    // Receitas e despesas do mês
    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Saldo total de todas as contas
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // Top categorias de despesas
    const categoryTotals = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    
    const topCategories = Object.entries(categoryTotals)
      .map(([name, amount], index) => ({
        categoryName: name,
        amount: amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Projeção de fluxo de caixa (últimos 6 meses)
    const cashFlowProjection = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthTrans = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
      });

      const income = monthTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      return {
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        income,
        expense,
      };
    });

    // Contas a vencer (próximos 7 dias)
    const upcomingBills = monthTransactions
      .filter(t => {
        const dueDate = new Date(t.date);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue >= 0 && daysUntilDue <= 7 && t.type === 'expense';
      })
      .map(t => ({
        id: t.id,
        name: t.description || t.category,
        amount: t.amount,
        dueDate: t.date,
        category: t.category,
        isPaid: false,
      }))
      .slice(0, 5);

    return {
      totalBalance,
      monthIncome,
      monthExpenses,
      topCategories,
      cashFlowProjection,
      upcomingBills,
      expenseChange: 0, // Pode calcular comparação com mês anterior
      incomeChange: 0,
    };
  }, [transactions, accounts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Fluxo.Fin
              </h1>
              <p className="text-sm text-muted-foreground">
                Controle financeiro inteligente
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-muted-foreground">Atualizado agora</p>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="space-y-6">
          {/* Saldo Total - Destaque */}
          <BalanceCard 
            totalBalance={dashboardData.totalBalance} 
            trend={5.2}
          />

          {/* Despesas e Receitas */}
          <ExpenseIncomeCards
            monthExpenses={dashboardData.monthExpenses}
            monthIncome={dashboardData.monthIncome}
            expenseChange={dashboardData.expenseChange}
            incomeChange={dashboardData.incomeChange}
          />

          {/* Grid de Widgets - 2 colunas em desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Categorias */}
            <CategoryChart data={dashboardData.topCategories} />

            {/* Contas a Vencer */}
            <UpcomingBills bills={dashboardData.upcomingBills} />
          </div>

          {/* Fluxo de Caixa - Largura Total */}
          <CashFlowChart data={dashboardData.cashFlowProjection} />

          {/* Grid de Widgets - 2 colunas em desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metas Financeiras */}
            <GoalsProgress goals={goals} />

            {/* Ações Rápidas */}
            <QuickActions />
          </div>
        </div>
      </main>

      {/* Floating Action Button - Lançamento Rápido */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-2xl shadow-blue-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 group"
        aria-label="Lançamento rápido"
      >
        <Plus className="w-8 h-8 transition-transform group-hover:rotate-90" strokeWidth={2.5} />
      </button>

      {/* Modal de Lançamento Rápido */}
      <QuickTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Dashboard MVP - Fluxo.Fin © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
