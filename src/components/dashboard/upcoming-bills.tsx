'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

interface UpcomingBillsProps {
  bills: Bill[];
}

export function UpcomingBills({ bills }: UpcomingBillsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateString: string) => {
    // Parse the date string and format consistently
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBadgeVariant = (daysUntil: number, isPaid: boolean) => {
    if (isPaid) return 'default';
    if (daysUntil < 0) return 'destructive';
    if (daysUntil <= 3) return 'destructive';
    if (daysUntil <= 7) return 'secondary';
    return 'outline';
  };

  // Se não montou ainda, não renderiza nada para evitar hydration mismatch
  if (!mounted) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Contas a Vencer
              </h3>
              <p className="text-sm text-muted-foreground">Próximos 7 dias</p>
            </div>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                      {bill.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Carregando...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(bill.amount)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    -
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contas a Vencer
            </h3>
            <p className="text-sm text-muted-foreground">Próximos 7 dias</p>
          </div>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          {bills.map((bill) => {
            const daysUntil = getDaysUntilDue(bill.dueDate);
            const badgeVariant = getBadgeVariant(daysUntil, bill.isPaid);
            
            return (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {bill.isPaid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                      daysUntil <= 3 ? 'text-red-600' : 'text-orange-600'
                    }`} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                      {bill.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(bill.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(bill.amount)}
                  </span>
                  <Badge variant={badgeVariant} className="text-xs">
                    {bill.isPaid ? 'Pago' : daysUntil < 0 ? 'Atrasado' : `${daysUntil}d`}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
