'use client';

import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Download, FileText, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/hooks/use-store';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function ReportsPage() {
  const { transactions, categories } = useStore();
  const [period, setPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mounted, setMounted] = useState(false);

  // Garantir que o componente só renderize após montagem no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtrar transações por período
  const filteredTransactions = useMemo(() => {
    if (!mounted) return [];
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      let isInPeriod = true;

      if (period === 'week') isInPeriod = transactionDate >= startOfWeek;
      if (period === 'month') isInPeriod = transactionDate >= startOfMonth;
      if (period === 'year') isInPeriod = transactionDate >= startOfYear;

      const isInCategory = selectedCategory === 'all' || t.category === selectedCategory;

      return isInPeriod && isInCategory;
    });
  }, [transactions, period, selectedCategory, mounted]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!mounted) {
      return {
        income: 0,
        expenses: 0,
        balance: 0,
        categoryBreakdown: {},
        transactionCount: 0,
      };
    }

    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    const categoryBreakdown = filteredTransactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { income: 0, expense: 0, total: 0 };
      }
      if (t.type === 'income') {
        acc[t.category].income += t.amount;
      } else {
        acc[t.category].expense += t.amount;
      }
      acc[t.category].total += t.amount;
      return acc;
    }, {} as Record<string, { income: number; expense: number; total: number }>);

    return {
      income,
      expenses,
      balance,
      categoryBreakdown,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions, mounted]);

  // Exportar CSV
  const exportCSV = () => {
    const data = filteredTransactions.map(t => ({
      Data: new Date(t.date).toLocaleDateString('pt-BR'),
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
      Categoria: t.category,
      Conta: t.account,
      Descrição: t.description,
      Valor: t.amount,
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Exportar Excel
  const exportExcel = () => {
    const data = filteredTransactions.map(t => ({
      Data: new Date(t.date).toLocaleDateString('pt-BR'),
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
      Categoria: t.category,
      Conta: t.account,
      Descrição: t.description,
      Valor: t.amount,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transações');

    // Adicionar resumo
    const summary = [
      ['Resumo Financeiro'],
      [''],
      ['Receitas', stats.income],
      ['Despesas', stats.expenses],
      ['Saldo', stats.balance],
      [''],
      ['Total de Transações', stats.transactionCount],
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, ws2, 'Resumo');

    XLSX.writeFile(wb, `relatorio-${period}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Mostrar loading enquanto não montar
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Relatórios
                </h1>
                <p className="text-sm text-white">
                  Análise detalhada das suas finanças
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button
                onClick={exportExcel}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Excel</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="year">Este Ano</option>
                <option value="all">Todos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
              >
                <option value="all">Todas</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg shadow-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Receitas</p>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.income)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg shadow-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Despesas</p>
              <TrendingDown className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.expenses)}
            </p>
          </div>

          <div className={`bg-gradient-to-br ${stats.balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-gray-500 to-gray-600'} rounded-xl p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">Saldo</p>
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.balance)}
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Breakdown por Categoria
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown)
              .sort(([, a], [, b]) => b.total - a.total)
              .map(([category, data]) => {
                const categoryInfo = categories.find(c => c.name === category);
                const percentage = ((data.total / (stats.income + stats.expenses)) * 100).toFixed(1);
                
                return (
                  <div key={category} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{categoryInfo?.icon || '📦'}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{category}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {data.income > 0 && `Receitas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.income)}`}
                          {data.income > 0 && data.expense > 0 && ' | '}
                          {data.expense > 0 && `Despesas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.expense)}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.total)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Transações ({filteredTransactions.length})
          </h2>
          <div className="space-y-2">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.description || transaction.category}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
