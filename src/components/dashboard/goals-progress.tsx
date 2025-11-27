"use client";

import { Target, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string;
  color?: string;
}

interface GoalsProgressProps {
  goals: Goal[];
}

export function GoalsProgress({ goals }: GoalsProgressProps) {
  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getMonthsRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Metas Financeiras
            </h3>
            <p className="text-sm text-muted-foreground">Acompanhe seu progresso</p>
          </div>
          <Target className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const monthsRemaining = getMonthsRemaining(goal.dueDate);
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: goal.color || '#3498DB' }}
                      />
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {goal.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {monthsRemaining > 0 
                        ? `${monthsRemaining} ${monthsRemaining === 1 ? 'mês' : 'meses'} restantes`
                        : 'Prazo expirado'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {progress.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      }).format(goal.currentAmount)}
                    </p>
                  </div>
                </div>

                <Progress 
                  value={progress} 
                  className="h-2"
                  style={{
                    // @ts-ignore
                    '--progress-background': goal.color || '#3498DB',
                  }}
                />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Faltam {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    }).format(remaining)}
                  </span>
                  <span className="text-muted-foreground">
                    Meta: {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    }).format(goal.targetAmount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="outline" className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>
    </Card>
  );
}
