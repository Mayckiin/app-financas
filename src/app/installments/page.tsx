"use client";

import { InstallmentsList } from '@/components/installments/installments-list';
import { mockInstallments } from '@/lib/mock-data';

export default function InstallmentsPage() {
  const handlePayInstallment = (installment: any) => {
    console.log('Marcar como pago:', installment);
    alert(`Parcela ${installment.installmentNumber}/${installment.totalInstallments} marcada como paga!`);
  };

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
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InstallmentsList
          installments={mockInstallments}
          onPayInstallment={handlePayInstallment}
        />
      </main>
    </div>
  );
}
