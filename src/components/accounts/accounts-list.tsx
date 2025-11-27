"use client";

import { Card } from '@/components/ui/card';
import { CreditCard, Wallet, Building2, TrendingUp, Plus, MoreVertical } from 'lucide-react';
import type { Account } from '@/lib/types';

interface AccountsListProps {
  accounts: Account[];
  onAddAccount?: () => void;
  onSelectAccount?: (account: Account) => void;
}

const accountIcons = {
  checking: Building2,
  card: CreditCard,
  cash: Wallet,
  investment: TrendingUp,
};

const accountLabels = {
  checking: 'Conta Corrente',
  card: 'Cartão',
  cash: 'Dinheiro',
  investment: 'Investimento',
};

export function AccountsList({ accounts, onAddAccount, onSelectAccount }: AccountsListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Minhas Contas
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas contas e saldos
          </p>
        </div>
        <button
          onClick={onAddAccount}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Conta</span>
        </button>
      </div>

      {/* Total Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="space-y-2">
          <p className="text-sm opacity-90">Saldo Total</p>
          <p className="text-3xl font-bold">
            {formatCurrency(accounts.reduce((sum, acc) => sum + acc.balance, 0))}
          </p>
          <p className="text-xs opacity-75">
            {accounts.length} {accounts.length === 1 ? 'conta' : 'contas'}
          </p>
        </div>
      </Card>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => {
          const Icon = accountIcons[account.type];
          const isNegative = account.balance < 0;

          return (
            <Card
              key={account.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => onSelectAccount?.(account)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: account.color || '#3B82F6' }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {accountLabels[account.type]}
                    </p>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {account.name}
                    </h3>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-muted-foreground mb-1">Saldo disponível</p>
                <p
                  className={`text-2xl font-bold ${
                    isNegative ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {formatCurrency(account.balance)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {accounts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Nenhuma conta cadastrada
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione sua primeira conta para começar a controlar suas finanças
              </p>
              <button
                onClick={onAddAccount}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar Conta
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
