"use client";

import { ArrowDownCircle, ArrowUpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Despesas */}
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <ArrowDownCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Despesas do Mês</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(monthExpenses)}
            </h3>
            <div className={`flex items-center gap-1 text-sm ${
              expenseChange < 0 ? 'text-green-600' : 'text-red-600'
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
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <ArrowUpCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Receitas do Mês</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(monthIncome)}
            </h3>
            <div className={`flex items-center gap-1 text-sm ${
              incomeChange >= 0 ? 'text-green-600' : 'text-red-600'
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
