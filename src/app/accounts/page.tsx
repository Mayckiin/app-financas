'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Wallet, CreditCard, PiggyBank, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/hooks/use-store';

const accountIcons = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
};

export default function AccountsPage() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking' as 'checking' | 'savings' | 'credit' | 'investment',
    balance: 0,
    color: '#3b82f6',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAccount) {
      updateAccount(editingAccount.id, formData);
    } else {
      addAccount(formData);
    }

    setIsModalOpen(false);
    setEditingAccount(null);
    setFormData({ name: '', type: 'checking', balance: 0, color: '#3b82f6' });
  };

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance,
      color: account.color,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta conta?')) {
      deleteAccount(id);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Contas
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie suas contas bancárias
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingAccount(null);
                setFormData({ name: '', type: 'checking', balance: 0, color: '#3b82f6' });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Nova Conta
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 mb-6 text-white shadow-2xl shadow-blue-500/30">
          <p className="text-sm opacity-90 mb-2">Saldo Total</p>
          <h2 className="text-4xl font-bold mb-4">
            {mounted ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBalance) : 'R$ 0,00'}
          </h2>
          <p className="text-sm opacity-75">{accounts.length} contas ativas</p>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => {
            const Icon = accountIcons[account.type];
            return (
              <div
                key={account.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: account.color }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {account.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 capitalize">
                  {account.type === 'checking' && 'Conta Corrente'}
                  {account.type === 'savings' && 'Poupança'}
                  {account.type === 'credit' && 'Cartão de Crédito'}
                  {account.type === 'investment' && 'Investimentos'}
                </p>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Saldo</p>
                  <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {mounted ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.balance) : 'R$ 0,00'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {editingAccount ? 'Editar Conta' : 'Nova Conta'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Nubank"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Poupança</option>
                  <option value="credit">Cartão de Crédito</option>
                  <option value="investment">Investimentos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Saldo Inicial *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor *
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                >
                  {editingAccount ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
