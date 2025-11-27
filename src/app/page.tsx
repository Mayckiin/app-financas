"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { ExpenseIncomeCards } from '@/components/dashboard/expense-income-cards';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart';
import { UpcomingBills } from '@/components/dashboard/upcoming-bills';
import { GoalsProgress } from '@/components/dashboard/goals-progress';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { QuickTransactionModal } from '@/components/quick-transaction-modal';
import { mockDashboardSummary, mockGoals } from '@/lib/mock-data';

export default function Home() {
  const summary = mockDashboardSummary;
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <p className="text-sm text-muted-foreground">Janeiro 2025</p>
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
            totalBalance={summary.totalBalance} 
            trend={5.2}
          />

          {/* Despesas e Receitas */}
          <ExpenseIncomeCards
            monthExpenses={summary.monthExpenses}
            monthIncome={summary.monthIncome}
            expenseChange={summary.expenseChange}
            incomeChange={summary.incomeChange}
          />

          {/* Grid de Widgets - 2 colunas em desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Categorias */}
            <CategoryChart data={summary.topCategories} />

            {/* Contas a Vencer */}
            <UpcomingBills bills={summary.upcomingBills} />
          </div>

          {/* Fluxo de Caixa - Largura Total */}
          <CashFlowChart data={summary.cashFlowProjection} />

          {/* Grid de Widgets - 2 colunas em desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metas Financeiras */}
            <GoalsProgress goals={mockGoals} />

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
