"use client";

import { ArrowDownCircle, ArrowUpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface ExpenseIncomeCardsProps {
  monthExpenses: number;
  monthIncome: number;
  expenseChange: number;
  incomeChange: number;
}

export function ExpenseIncomeCards({
  monthExpenses,
  monthIncome,
  expenseChange,
  incomeChange,
}: ExpenseIncomeCardsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Função para formatar moeda de forma consistente
  const formatCurrency = (value: number) => {
    if (!mounted) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-black/90 border-amber-500/30 hover:border-amber-500/50 transition-all backdrop-blur-xl shadow-2xl shadow-amber-500/5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400">
                <ArrowDownCircle className="w-5 h-5" />
                <p className="text-sm font-medium text-gray-100">Despesas do Mês</p>
              </div>
              <h3 className="text-3xl font-bold text-gray-100">
                R$ 0,00
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-300">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">0.0% vs mês anterior</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-black/90 border-amber-500/30 hover:border-amber-500/50 transition-all backdrop-blur-xl shadow-2xl shadow-amber-500/5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <ArrowUpCircle className="w-5 h-5" />
                <p className="text-sm font-medium text-gray-100">Receitas do Mês</p>
              </div>
              <h3 className="text-3xl font-bold text-gray-100">
                R$ 0,00
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-300">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">0.0% vs mês anterior</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Despesas */}
      <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-black/90 border-amber-500/30 hover:border-amber-500/50 transition-all backdrop-blur-xl shadow-2xl shadow-amber-500/5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-400">
              <ArrowDownCircle className="w-5 h-5" />
              <p className="text-sm font-medium text-gray-100">Despesas do Mês</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-100">
              {formatCurrency(monthExpenses)}
            </h3>
            <div className={`flex items-center gap-1 text-sm ${
              expenseChange < 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {expenseChange < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              <span className="font-medium">
                {Math.abs(expenseChange).toFixed(1)}% vs mês anterior
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Receitas */}
      <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-black/90 border-amber-500/30 hover:border-amber-500/50 transition-all backdrop-blur-xl shadow-2xl shadow-amber-500/5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <ArrowUpCircle className="w-5 h-5" />
              <p className="text-sm font-medium text-gray-100">Receitas do Mês</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-100">
              {formatCurrency(monthIncome)}
            </h3>
            <div className={`flex items-center gap-1 text-sm ${
              incomeChange >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {incomeChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">
                {Math.abs(incomeChange).toFixed(1)}% vs mês anterior
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
