'use client';

import { useState } from 'react';
import { X, Plus, Minus, Calendar, User } from 'lucide-react';
import { useStore } from '@/hooks/use-store';

interface QuickTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickTransactionModal({ isOpen, onClose }: QuickTransactionModalProps) {
  const { categories, accounts, addTransaction } = useStore();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('main');
  const [description, setDescription] = useState('');
  const [personName, setPersonName] = useState('');
  const [isInstallment, setIsInstallment] = useState(false);
  const [installments, setInstallments] = useState(1);
  const [firstInstallmentDate, setFirstInstallmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => c.type === type);

  const installmentValue = isInstallment && installments > 1 
    ? (parseFloat(amount) / installments).toFixed(2)
    : amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (isInstallment && installments > 1) {
      // Criar múltiplas transações para cada parcela
      const baseAmount = parseFloat(amount);
      const installmentAmount = baseAmount / installments;
      const firstDate = new Date(firstInstallmentDate);

      for (let i = 0; i < installments; i++) {
        const installmentDate = new Date(firstDate);
        installmentDate.setMonth(firstDate.getMonth() + i);

        addTransaction({
          type,
          amount: installmentAmount,
          category,
          account,
          description: `${description} (${i + 1}/${installments})`,
          date: installmentDate.toISOString(),
          personName: personName || undefined,
          isInstallment: true,
          installmentNumber: i + 1,
          totalInstallments: installments,
        });
      }
    } else {
      addTransaction({
        type,
        amount: parseFloat(amount),
        category,
        account,
        description,
        date: new Date().toISOString(),
        personName: personName || undefined,
        isInstallment: false,
      });
    }

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setPersonName('');
    setIsInstallment(false);
    setInstallments(1);
    setFirstInstallmentDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/20 w-full max-w-md animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header Premium */}
        <div className="flex items-center justify-between p-6 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-yellow-500/10">
          <h2 className="text-xl font-bold text-white">
            Nova Transação
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-500/10 rounded-lg transition-colors text-gray-400 hover:text-amber-400 border border-amber-500/20"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/50 rounded-lg border border-amber-500/20">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium transition-all ${
                type === 'expense'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Minus className="w-4 h-4" />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium transition-all ${
                type === 'income'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Plus className="w-4 h-4" />
              Receita
            </button>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-300 mb-2">
              Valor *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-semibold text-lg">
                R$
              </span>
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                required
                className="w-full pl-14 pr-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-500 transition-all font-medium text-lg"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-300 mb-2">
              Categoria *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white transition-all font-medium"
            >
              <option value="">Selecione...</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Person Name */}
          <div>
            <label htmlFor="personName" className="block text-sm font-semibold text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Nome (Quem gastou/recebeu)
            </label>
            <input
              id="personName"
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-500 transition-all"
            />
          </div>

          {/* Installment Toggle */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-lg">
            <input
              type="checkbox"
              id="isInstallment"
              checked={isInstallment}
              onChange={(e) => setIsInstallment(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-amber-500/50 bg-black/50 text-amber-500 focus:ring-2 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="isInstallment" className="text-sm font-semibold text-gray-300 cursor-pointer">
              Transação Parcelada
            </label>
          </div>

          {/* Installment Details */}
          {isInstallment && (
            <div className="space-y-4 p-4 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/30 rounded-lg">
              <div>
                <label htmlFor="installments" className="block text-sm font-semibold text-gray-300 mb-2">
                  Número de Parcelas
                </label>
                <select
                  id="installments"
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white transition-all font-medium"
                >
                  {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}x de R$ {installmentValue}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="firstInstallmentDate" className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data da 1ª Parcela
                </label>
                <input
                  id="firstInstallmentDate"
                  type="date"
                  value={firstInstallmentDate}
                  onChange={(e) => setFirstInstallmentDate(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white transition-all"
                />
              </div>

              <div className="p-4 bg-black/50 border border-green-500/30 rounded-lg">
                <p className="text-sm text-gray-300 font-medium">
                  <span className="font-bold text-amber-400">Total:</span> R$ {amount || '0,00'}
                </p>
                <p className="text-sm text-gray-300 font-medium mt-1">
                  <span className="font-bold text-green-400">Parcela:</span> {installments}x de R$ {installmentValue}
                </p>
              </div>
            </div>
          )}

          {/* Account */}
          <div>
            <label htmlFor="account" className="block text-sm font-semibold text-gray-300 mb-2">
              Conta *
            </label>
            <select
              id="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white transition-all font-medium"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-2">
              Descrição (opcional)
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Almoço no restaurante"
              className="w-full px-4 py-3 bg-black/50 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-500 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-black/50 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-800/50 hover:border-gray-500 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 text-black rounded-lg font-semibold shadow-lg shadow-amber-500/30 transition-all"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
