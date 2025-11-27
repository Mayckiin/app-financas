"use client";

import { Card } from '@/components/ui/card';
import { CreditCard, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import type { Installment } from '@/lib/types';

interface InstallmentsListProps {
  installments: Installment[];
  onPayInstallment?: (installment: Installment) => void;
}

export function InstallmentsList({ installments, onPayInstallment }: InstallmentsListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusInfo = (installment: Installment) => {
    const dueDate = new Date(installment.dueDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (installment.status === 'paid') {
      return {
        label: 'Pago',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950',
        icon: CheckCircle2,
      };
    }

    if (dueDate < today) {
      return {
        label: 'Vencido',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950',
        icon: AlertCircle,
      };
    }

    return {
      label: 'Pendente',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      icon: Clock,
    };
  };

  const totalPending = installments
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = installments
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Parcelamentos
        </h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe suas parcelas e dívidas
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Pendente</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Pago</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Installments List */}
      <Card className="divide-y divide-gray-200 dark:divide-gray-800">
        {installments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Nenhum parcelamento
            </h3>
            <p className="text-sm text-muted-foreground">
              Você não possui parcelamentos cadastrados
            </p>
          </div>
        ) : (
          installments.map((installment) => {
            const statusInfo = getStatusInfo(installment);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={installment.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Parcela {installment.installmentNumber}/{installment.totalInstallments}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Vencimento: {formatDate(installment.dueDate)}
                    </p>
                    {installment.paidAt && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Pago em {formatDate(installment.paidAt)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(installment.amount)}
                    </p>
                    {installment.status === 'pending' && (
                      <button
                        onClick={() => onPayInstallment?.(installment)}
                        className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Marcar como pago
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}
