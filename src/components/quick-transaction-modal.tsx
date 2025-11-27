"use client";

import { useState } from 'react';
import { X, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { mockAccounts, mockCategories } from '@/lib/mock-data';
import { TransactionType } from '@/lib/types';

interface QuickTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickTransactionModal({ isOpen, onClose }: QuickTransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [selectedAccount, setSelectedAccount] = useState(mockAccounts[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Filtrar categorias por tipo
  const availableCategories = mockCategories.filter(cat => cat.type === type);

  // Formatar valor monetário
  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const numberValue = parseFloat(numbers) / 100;
    return numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAmountChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      setAmount(numbers);
    }
  };

  const handleSubmit = () => {
    if (!amount || !selectedCategory) return;

    // Animação de sucesso
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setAmount('');
      setSelectedCategory(null);
      setNote('');
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300 sm:animate-in sm:zoom-in-95">
        {/* Success Animation Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-green-500 z-50 flex items-center justify-center animate-in fade-in duration-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
              </div>
              <p className="text-white text-xl font-semibold">Transação registrada!</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Lançamento Rápido
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Tipo de Transação */}
          <div className="flex gap-3">
            <button
              onClick={() => setType('expense')}
              className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <TrendingDown className="w-5 h-5 mx-auto mb-1" />
              Despesa
            </button>
            <button
              onClick={() => setType('income')}
              className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all ${
                type === 'income'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <TrendingUp className="w-5 h-5 mx-auto mb-1" />
              Receita
            </button>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-400">
                R$
              </span>
              <input
                type="text"
                value={amount ? formatCurrency(amount) : ''}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0,00"
                className="w-full pl-20 pr-4 py-6 text-4xl font-bold bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100"
                autoFocus
              />
            </div>
          </div>

          {/* Conta - Carrossel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Conta
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {mockAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  className={`flex-shrink-0 px-6 py-4 rounded-2xl border-2 transition-all ${
                    selectedAccount.id === account.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {account.name}
                    </p>
                    <p className={`text-xs mt-1 ${
                      account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Categorias - Grid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Categoria
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <span className="text-xl">
                      {category.icon === 'utensils' && '🍽️'}
                      {category.icon === 'car' && '🚗'}
                      {category.icon === 'home' && '🏠'}
                      {category.icon === 'smile' && '😊'}
                      {category.icon === 'heart' && '❤️'}
                      {category.icon === 'dollar-sign' && '💰'}
                      {category.icon === 'briefcase' && '💼'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                    {category.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Nota (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nota (opcional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: Almoço com cliente"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Footer - Botão Confirmar */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={handleSubmit}
            disabled={!amount || !selectedCategory}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
              amount && selectedCategory
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirmar Lançamento
          </button>
        </div>
      </div>
    </div>
  );
}
