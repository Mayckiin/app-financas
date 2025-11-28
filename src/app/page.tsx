"use client";

import { useState, useMemo, useEffect } from 'react';
import { Plus, LogOut, User, TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, PiggyBank, Target, AlertCircle, ArrowUpRight, ArrowDownRight, Activity, BarChart3, PieChart, LineChart, Clock, Calendar, Sparkles, TrendingUpIcon, Bell, Building2, Landmark } from 'lucide-react';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { ExpenseIncomeCards } from '@/components/dashboard/expense-income-cards';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { UpcomingBills } from '@/components/dashboard/upcoming-bills';
import { GoalsProgress } from '@/components/dashboard/goals-progress';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { UpcomingInstallmentsChart } from '@/components/dashboard/upcoming-installments-chart';
import { SpendingByPersonChart } from '@/components/dashboard/spending-by-person-chart';
import { QuickTransactionModal } from '@/components/quick-transaction-modal';
import { LoginScreen } from '@/components/auth/login-screen';
import { FinaAssistant } from '@/components/assistant/fina-assistant';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { useStore } from '@/hooks/use-store';
import { Card } from '@/components/ui/card';
import { KPICard } from '@/components/financial/kpi-card';
import { InsightCard } from '@/components/financial/insight-card';
import { KPICalculator } from '@/lib/utils/kpi-calculator';
import { InsightsEngine } from '@/lib/utils/insights-engine';

export default function Home() {
  const { transactions, accounts, goals } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const user = localStorage.getItem('fluxofin_user');
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  // Calcular dados do dashboard usando KPICalculator e InsightsEngine
  const dashboardData = useMemo(() => {
    if (!mounted) {
      return {
        totalBalance: 0,
        monthIncome: 0,
        monthExpenses: 0,
        topCategories: [],
        upcomingBills: [],
        expenseChange: 0,
        incomeChange: 0,
        kpiMetrics: null,
        aiInsights: [],
      };
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Transações do mês atual
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth;
    });

    // Transações do mês anterior
    const lastMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfLastMonth && transactionDate <= endOfLastMonth;
    });

    // Receitas e despesas do mês
    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Receitas e despesas do mês anterior
    const lastMonthIncome = lastMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calcular variações percentuais
    const expenseChange = lastMonthExpenses > 0 
      ? ((monthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    const incomeChange = lastMonthIncome > 0 
      ? ((monthIncome - lastMonthIncome) / lastMonthIncome) * 100 
      : 0;

    // Saldo total de todas as contas
    const totalBalance = KPICalculator.calculateConsolidatedBalance(accounts);

    // Calcular KPIs avançados
    const kpiMetrics = KPICalculator.calculateAllKPIs(transactions, accounts, '30d');

    // Top categorias de despesas
    const topCategories = KPICalculator.calculateCategoryBreakdown(
      transactions,
      startOfMonth,
      now,
      5
    );

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

    // Gerar insights de IA
    const aiInsights = InsightsEngine.generateAllInsights(
      transactions,
      monthIncome,
      monthExpenses,
      currentUser || 'user'
    );

    return {
      totalBalance,
      monthIncome,
      monthExpenses,
      topCategories,
      upcomingBills,
      expenseChange,
      incomeChange,
      kpiMetrics,
      aiInsights,
    };
  }, [transactions, accounts, mounted, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('fluxofin_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleDismissInsight = (id: string) => {
    // Implementar lógica de dismissal (pode ser adicionado ao store)
    console.log('Insight dismissed:', id);
  };

  // Se não autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <LoginScreen onLogin={(email) => {
      setIsAuthenticated(true);
      setCurrentUser(email);
    }} />;
  }

  // Mostrar loading enquanto não montou
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/50 mx-auto mb-4 animate-pulse">
            <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-amber-400 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Header Dark Premium - MOBILE OPTIMIZED */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-amber-500/20 sticky top-0 z-50 shadow-2xl shadow-amber-500/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2.5 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Logo Premium - Responsivo */}
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/50 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent truncate">
                    FluxoFin
                  </h1>
                  <p className="text-[9px] sm:text-xs text-gray-400 truncate hidden sm:block">
                    Premium Financial Control
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {/* Data - Oculta em mobile */}
              <div className="text-right hidden lg:block">
                <p className="text-sm text-gray-300 font-medium">
                  {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs text-amber-400">Atualizado agora</p>
              </div>
              
              {/* Notification Center - Integrado */}
              <NotificationCenter aiInsights={dashboardData.aiInsights} />
              
              {/* Logout button - Compacto em mobile */}
              <button
                onClick={handleLogout}
                className="p-1.5 sm:p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content - MOBILE OPTIMIZED */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 pb-24 sm:pb-28">
        <div className="space-y-4 sm:space-y-6">
          {/* KPIs Principais - MOBILE: 2 colunas, DESKTOP: 4 colunas */}
          {dashboardData.kpiMetrics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1 - Patrimônio Líquido - Roxo/Violeta */}
              <Card className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-purple-600/10 border-2 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
                
                <div className="relative p-3 sm:p-5 space-y-2 sm:space-y-4">
                  {/* Header com Ícone */}
                  <div className="flex items-start justify-between">
                    <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/30">
                      <Wallet className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg ${
                      dashboardData.kpiMetrics.netWorthChange >= 0 
                        ? 'bg-emerald-500/20 border border-emerald-500/30' 
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}>
                      {dashboardData.kpiMetrics.netWorthChange >= 0 ? (
                        <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-red-400" />
                      )}
                      <span className={`text-[9px] sm:text-xs font-bold ${
                        dashboardData.kpiMetrics.netWorthChange >= 0 ? 'text-emerald-300' : 'text-red-300'
                      }`}>
                        {dashboardData.kpiMetrics.netWorthChange >= 0 ? '+' : ''}{dashboardData.kpiMetrics.netWorthChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Título */}
                  <div>
                    <h3 className="text-[10px] sm:text-sm font-semibold text-white/90 mb-0.5 sm:mb-1">Patrimônio Líquido</h3>
                    <p className="text-base sm:text-2xl font-bold bg-gradient-to-r from-purple-300 via-violet-400 to-purple-500 bg-clip-text text-transparent">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(dashboardData.kpiMetrics.netWorth)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      dashboardData.kpiMetrics.netWorthChange >= 0 ? 'bg-emerald-400' : 'bg-red-400'
                    } animate-pulse`} />
                    <span className="text-white/80 font-medium">
                      {dashboardData.kpiMetrics.netWorthChange >= 0 ? 'Positivo' : 'Negativo'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Card 2 - Fluxo de Caixa - Verde/Esmeralda */}
              <Card className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-emerald-600/10 border-2 border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-emerald-500/20">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.1),transparent_50%)]" />
                
                <div className="relative p-3 sm:p-5 space-y-2 sm:space-y-4">
                  {/* Header com Ícone */}
                  <div className="flex items-start justify-between">
                    <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg sm:rounded-xl shadow-lg shadow-emerald-500/30">
                      <Activity className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg ${
                      dashboardData.kpiMetrics.cashFlowHealth === 'positive'
                        ? 'bg-emerald-500/20 border border-emerald-500/30' 
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}>
                      {dashboardData.kpiMetrics.cashFlowHealth === 'positive' ? (
                        <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-red-400" />
                      )}
                      <span className={`text-[9px] sm:text-xs font-bold ${
                        dashboardData.kpiMetrics.cashFlowHealth === 'positive' ? 'text-emerald-300' : 'text-red-300'
                      }`}>
                        {dashboardData.kpiMetrics.cashFlowHealth === 'positive' ? 'Positivo' : 'Negativo'}
                      </span>
                    </div>
                  </div>

                  {/* Título */}
                  <div>
                    <h3 className="text-[10px] sm:text-sm font-semibold text-white/90 mb-0.5 sm:mb-1">Fluxo de Caixa</h3>
                    <p className="text-base sm:text-2xl font-bold bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(dashboardData.kpiMetrics.cashFlow)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      dashboardData.kpiMetrics.cashFlowHealth === 'positive' ? 'bg-emerald-400' : 'bg-red-400'
                    } animate-pulse`} />
                    <span className="text-white/80 font-medium">
                      {dashboardData.kpiMetrics.cashFlowHealth === 'positive' ? 'Saudável' : 'Atenção'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Card 3 - Taxa de Poupança - Azul/Ciano */}
              <Card className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-blue-600/10 border-2 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-blue-500/20">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
                
                <div className="relative p-3 sm:p-5 space-y-2 sm:space-y-4">
                  {/* Header com Ícone */}
                  <div className="flex items-start justify-between">
                    <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/30">
                      <PiggyBank className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg ${
                      dashboardData.kpiMetrics.savingsRate >= 20
                        ? 'bg-emerald-500/20 border border-emerald-500/30' 
                        : 'bg-amber-500/20 border border-amber-500/30'
                    }`}>
                      <Target className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-300" />
                      <span className="text-[9px] sm:text-xs font-bold text-white/90">
                        20%
                      </span>
                    </div>
                  </div>

                  {/* Título */}
                  <div>
                    <h3 className="text-[10px] sm:text-sm font-semibold text-white/90 mb-0.5 sm:mb-1">Taxa de Poupança</h3>
                    <p className="text-base sm:text-2xl font-bold bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {dashboardData.kpiMetrics.savingsRate.toFixed(1)}%
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      dashboardData.kpiMetrics.savingsRate >= 20 ? 'bg-emerald-400' : 'bg-amber-400'
                    } animate-pulse`} />
                    <span className="text-white/80 font-medium">
                      {dashboardData.kpiMetrics.savingsRate >= 20 ? 'Excelente' : 'Melhorar'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Card 4 - Investimentos - Rosa/Pink */}
              <Card className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-pink-600/10 border-2 border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-pink-500/20">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(244,63,94,0.1),transparent_50%)]" />
                
                <div className="relative p-3 sm:p-5 space-y-2 sm:space-y-4">
                  {/* Header com Ícone */}
                  <div className="flex items-start justify-between">
                    <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg sm:rounded-xl shadow-lg shadow-pink-500/30">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                      <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                      <span className="text-[9px] sm:text-xs font-bold text-emerald-300">
                        30%
                      </span>
                    </div>
                  </div>

                  {/* Título */}
                  <div>
                    <h3 className="text-[10px] sm:text-sm font-semibold text-white/90 mb-0.5 sm:mb-1">Investimentos</h3>
                    <p className="text-base sm:text-2xl font-bold bg-gradient-to-r from-pink-300 via-rose-400 to-pink-500 bg-clip-text text-transparent">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(dashboardData.kpiMetrics.totalInvestments)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/80 font-medium">
                      Crescendo
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Receitas, Despesas e Saldo - MOBILE: 1 coluna, DESKTOP: 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1 - Receitas - Verde/Esmeralda */}
            <Card className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-emerald-600/10 border-2 border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-emerald-500/20">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(5,150,105,0.1),transparent_50%)]" />
              
              <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Header com Ícone */}
                <div className="flex items-start justify-between">
                  <div className="p-2 sm:p-2.5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg sm:rounded-xl shadow-lg shadow-emerald-500/30">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg ${
                    dashboardData.incomeChange >= 0 
                      ? 'bg-emerald-500/20 border border-emerald-500/30' 
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    {dashboardData.incomeChange >= 0 ? (
                      <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
                    )}
                    <span className={`text-xs font-bold ${
                      dashboardData.incomeChange >= 0 ? 'text-emerald-300' : 'text-red-300'
                    }`}>
                      {Math.abs(dashboardData.incomeChange).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Título */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white mb-1">Receitas</h3>
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(dashboardData.monthIncome)}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                {/* Status */}
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    dashboardData.incomeChange >= 0 ? 'bg-emerald-400' : 'bg-red-400'
                  } animate-pulse`} />
                  <span className="text-white font-medium">
                    {dashboardData.incomeChange >= 0 ? 'Crescimento' : 'Redução'} este mês
                  </span>
                </div>
              </div>
            </Card>

            {/* Card 2 - Despesas - Vermelho/Coral */}
            <Card className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-red-600/10 border-2 border-red-500/30 hover:border-red-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-red-500/20">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.1),transparent_50%)]" />
              
              <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Header com Ícone */}
                <div className="flex items-start justify-between">
                  <div className="p-2 sm:p-2.5 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg sm:rounded-xl shadow-lg shadow-red-500/30">
                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg ${
                    dashboardData.expenseChange <= 0 
                      ? 'bg-emerald-500/20 border border-emerald-500/30' 
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    {dashboardData.expenseChange <= 0 ? (
                      <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
                    )}
                    <span className={`text-xs font-bold ${
                      dashboardData.expenseChange <= 0 ? 'text-emerald-300' : 'text-red-300'
                    }`}>
                      {Math.abs(dashboardData.expenseChange).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Título */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white mb-1">Despesas</h3>
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(dashboardData.monthExpenses)}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                {/* Status */}
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    dashboardData.expenseChange <= 0 ? 'bg-emerald-400' : 'bg-red-400'
                  } animate-pulse`} />
                  <span className="text-white font-medium">
                    {dashboardData.expenseChange <= 0 ? 'Redução' : 'Aumento'} este mês
                  </span>
                </div>
              </div>
            </Card>

            {/* Card 3 - Saldo - Azul/Índigo */}
            <Card className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-blue-600/10 border-2 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-blue-500/20">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]" />
              
              <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Header com Ícone */}
                <div className="flex items-start justify-between">
                  <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/30">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg ${
                    (dashboardData.monthIncome - dashboardData.monthExpenses) >= 0 
                      ? 'bg-emerald-500/20 border border-emerald-500/30' 
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    {(dashboardData.monthIncome - dashboardData.monthExpenses) >= 0 ? (
                      <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
                    )}
                    <span className={`text-xs font-bold ${
                      (dashboardData.monthIncome - dashboardData.monthExpenses) >= 0 ? 'text-emerald-300' : 'text-red-300'
                    }`}>
                      {(dashboardData.monthIncome - dashboardData.monthExpenses) >= 0 ? 'Positivo' : 'Negativo'}
                    </span>
                  </div>
                </div>

                {/* Título */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white mb-1">Saldo</h3>
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-300 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(dashboardData.monthIncome - dashboardData.monthExpenses)}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                {/* Status */}
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    (dashboardData.monthIncome - dashboardData.monthExpenses) >= 0 ? 'bg-emerald-400' : 'bg-red-400'
                  } animate-pulse`} />
                  <span className="text-white font-medium">
                    {(dashboardData.monthIncome - dashboardData.monthExpenses) >= 0 ? 'Superávit' : 'Déficit'} mensal
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Saldo Total - MOBILE OPTIMIZED */}
          <Card className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-teal-600/10 border-2 border-teal-500/30 hover:border-teal-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-teal-500/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
            
            <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-5">
              {/* Header com Badge e Ícone - MOBILE OPTIMIZED */}
              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-xl shadow-lg shadow-teal-500/30">
                      <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-300 via-cyan-400 to-teal-500 bg-clip-text text-transparent">
                        Saldo Total Disponível
                      </h2>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mt-0.5 sm:mt-1">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400/80" />
                        <span className="text-white/90 font-medium">Consolidado de todas as contas</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Badge de Tendência - MOBILE OPTIMIZED */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg sm:rounded-xl shadow-lg shadow-emerald-500/30">
                    <TrendingUpIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="text-base sm:text-lg font-bold text-white">
                      +5.2%
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider">
                    Este mês
                  </span>
                </div>
              </div>

              {/* Divider com Gradiente */}
              <div className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

              {/* Valor Principal - MOBILE OPTIMIZED */}
              <div className="text-center py-2 sm:py-4">
                <p className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-teal-200 via-cyan-300 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(dashboardData.totalBalance)}
                </p>
              </div>

              {/* Footer com Estatísticas - MOBILE: 3 colunas compactas */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-black/20 rounded-lg sm:rounded-xl border border-teal-500/20 text-center">
                  <p className="text-[9px] sm:text-xs font-semibold text-white/70 mb-0.5 sm:mb-1">Contas Ativas</p>
                  <p className="text-base sm:text-lg font-bold text-teal-300">{accounts.length}</p>
                </div>
                <div className="p-2 sm:p-3 bg-black/20 rounded-lg sm:rounded-xl border border-teal-500/20 text-center">
                  <p className="text-[9px] sm:text-xs font-semibold text-white/70 mb-0.5 sm:mb-1">Maior Saldo</p>
                  <p className="text-base sm:text-lg font-bold text-teal-300">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(Math.max(...accounts.map(a => a.balance), 0))}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-black/20 rounded-lg sm:rounded-xl border border-teal-500/20 text-center">
                  <p className="text-[9px] sm:text-xs font-semibold text-white/70 mb-0.5 sm:mb-1">Status</p>
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs sm:text-sm font-bold text-emerald-300">Saudável</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Contas Bancárias - MOBILE: 1 coluna, DESKTOP: 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {accounts.map((account) => {
              // Definir cores baseadas no tipo de conta
              const accountStyles = {
                checking: {
                  gradient: 'from-blue-500/10 via-indigo-500/5 to-blue-600/10',
                  border: 'border-blue-500/30 hover:border-blue-400/50',
                  shadow: 'shadow-blue-500/20',
                  iconBg: 'from-blue-400 to-indigo-500',
                  iconShadow: 'shadow-blue-500/30',
                  textGradient: 'from-blue-300 via-indigo-400 to-blue-500',
                  icon: Building2,
                  radial1: 'rgba(59,130,246,0.15)',
                  radial2: 'rgba(99,102,241,0.1)',
                },
                savings: {
                  gradient: 'from-emerald-500/10 via-green-500/5 to-emerald-600/10',
                  border: 'border-emerald-500/30 hover:border-emerald-400/50',
                  shadow: 'shadow-emerald-500/20',
                  iconBg: 'from-emerald-400 to-green-500',
                  iconShadow: 'shadow-emerald-500/30',
                  textGradient: 'from-emerald-300 via-green-400 to-emerald-500',
                  icon: PiggyBank,
                  radial1: 'rgba(16,185,129,0.15)',
                  radial2: 'rgba(5,150,105,0.1)',
                },
                investment: {
                  gradient: 'from-purple-500/10 via-violet-500/5 to-purple-600/10',
                  border: 'border-purple-500/30 hover:border-purple-400/50',
                  shadow: 'shadow-purple-500/20',
                  iconBg: 'from-purple-400 to-violet-500',
                  iconShadow: 'shadow-purple-500/30',
                  textGradient: 'from-purple-300 via-violet-400 to-purple-500',
                  icon: TrendingUp,
                  radial1: 'rgba(168,85,247,0.15)',
                  radial2: 'rgba(139,92,246,0.1)',
                },
              };

              const style = accountStyles[account.type as keyof typeof accountStyles] || accountStyles.checking;
              const IconComponent = style.icon;

              return (
                <Card 
                  key={account.id}
                  className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${style.gradient} border-2 ${style.border} transition-all duration-300 backdrop-blur-xl shadow-2xl ${style.shadow}`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0" style={{
                    background: `radial-gradient(circle at 30% 20%, ${style.radial1}, transparent 50%)`
                  }} />
                  <div className="absolute inset-0" style={{
                    background: `radial-gradient(circle at 70% 80%, ${style.radial2}, transparent 50%)`
                  }} />
                  
                  <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                    {/* Header com Ícone e Tipo */}
                    <div className="flex items-start justify-between">
                      <div className={`p-2 sm:p-2.5 bg-gradient-to-br ${style.iconBg} rounded-lg sm:rounded-xl shadow-lg ${style.iconShadow}`}>
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/10 rounded-md sm:rounded-lg border border-white/20">
                        <span className="text-[9px] sm:text-xs font-semibold text-white uppercase tracking-wider">
                          {account.type === 'checking' && 'Corrente'}
                          {account.type === 'savings' && 'Poupança'}
                          {account.type === 'investment' && 'Investimento'}
                        </span>
                      </div>
                    </div>

                    {/* Nome da Conta */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white/90 mb-0.5 sm:mb-1">{account.name}</h3>
                      <p className="text-[10px] sm:text-xs text-white/70">
                        {account.type === 'checking' && 'Conta para movimentações diárias'}
                        {account.type === 'savings' && 'Reserva de emergência'}
                        {account.type === 'investment' && 'Crescimento de patrimônio'}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Saldo */}
                    <div>
                      <p className="text-[10px] sm:text-xs font-semibold text-white/70 mb-0.5 sm:mb-1">Saldo Disponível</p>
                      <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${style.textGradient} bg-clip-text text-transparent`}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(account.balance)}
                      </p>
                    </div>

                    {/* Footer com Status */}
                    <div className="flex items-center justify-between pt-1 sm:pt-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-medium text-white/80">Ativa</span>
                      </div>
                      <Landmark className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Grid de Widgets - MOBILE: 1 coluna, DESKTOP: 2 colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Gráfico de Categorias */}
            <CategoryChart data={dashboardData.topCategories} />

            {/* Contas a Vencer - MOBILE OPTIMIZED */}
            <Card className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-indigo-600/10 border-2 border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-indigo-500/20">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
              
              <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-5">
                {/* Header com Badge e Contador - RESPONSIVO */}
                <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-0">
                  <div className="space-y-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg sm:rounded-xl shadow-lg shadow-indigo-500/30">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-indigo-300 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
                        Contas a Vencer
                      </h2>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <span className="text-white font-medium">Próximos 7 dias</span>
                    </div>
                  </div>
                  
                  {/* Badge de Contagem */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg sm:rounded-xl shadow-lg shadow-indigo-500/30">
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        {dashboardData.upcomingBills.length}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider">
                      {dashboardData.upcomingBills.length === 1 ? 'Conta' : 'Contas'}
                    </span>
                  </div>
                </div>

                {/* Divider com Gradiente */}
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                {/* Lista de Contas */}
                <div className="space-y-2 sm:space-y-3">
                  <UpcomingBills bills={dashboardData.upcomingBills} />
                </div>
              </div>
            </Card>
          </div>

          {/* Parcelas Futuras - Card único em largura total */}
          <UpcomingInstallmentsChart transactions={transactions} />

          {/* Grid de Widgets - MOBILE: 1 coluna, DESKTOP: 2 colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Metas Financeiras */}
            <Card className="flex flex-col gap-4 sm:gap-6 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-gray-900/90 to-black/90 border-amber-500/30 hover:border-amber-500/50 transition-all backdrop-blur-xl shadow-2xl shadow-amber-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-lg">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-100">Metas Financeiras</h2>
                    <p className="text-[10px] sm:text-xs text-white">Acompanhe seu progresso</p>
                  </div>
                </div>
              </div>
              <GoalsProgress goals={goals} />
            </Card>

            {/* Ações Rápidas */}
            <QuickActions />
          </div>

          {/* Gráfico de Gastos por Pessoa */}
          <SpendingByPersonChart transactions={transactions} />
        </div>
      </main>

      {/* FINA Assistant - Floating Button */}
      <FinaAssistant />

      {/* Floating Action Button - Premium Gold - MOBILE: acima da navegação */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 text-black rounded-xl sm:rounded-2xl shadow-2xl shadow-amber-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 group border border-amber-300/50"
        aria-label="Lançamento rápido"
      >
        <Plus className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:rotate-90" strokeWidth={3} />
      </button>

      {/* Modal de Lançamento Rápido */}
      <QuickTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Footer Premium - MOBILE OPTIMIZED */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-amber-500/20 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-gray-400">
            <span className="text-amber-400 font-semibold">FluxoFin</span> Premium Dashboard © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
