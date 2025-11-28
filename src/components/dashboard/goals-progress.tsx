"use client";

import { Target, Plus, TrendingUp, Calendar } from 'lucide-react';
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

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = calculateProgress(totalCurrent, totalTarget);

  return (
    <Card className="relative overflow-hidden border flex flex-col gap-6 rounded-xl p-6 bg-gradient-to-br from-emerald-950/90 via-teal-950/90 to-cyan-950/90 border-emerald-500/30 hover:border-emerald-500/50 transition-all backdrop-blur-xl shadow-2xl shadow-emerald-500/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.15),transparent_50%)]" />
      
      <div className="relative space-y-6">
        {/* Header Premium */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Metas Financeiras
                </h3>
                <p className="text-sm text-white/90 font-medium">Acompanhe seu progresso</p>
              </div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-sm">
            <span className="text-sm font-bold text-emerald-400">{goals.length} {goals.length === 1 ? 'meta' : 'metas'}</span>
          </div>
        </div>

        {/* Divider com gradiente */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        {/* Overall Progress */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/90">Progresso Geral</span>
            <span className="text-lg font-bold text-emerald-400">{overallProgress.toFixed(0)}%</span>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-3 bg-emerald-950/50"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-white/80">
            <span>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(totalCurrent)}
            </span>
            <span>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(totalTarget)}
            </span>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const monthsRemaining = getMonthsRemaining(goal.dueDate);
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <div 
                key={goal.id} 
                className="p-4 rounded-xl bg-gradient-to-br from-gray-900/40 to-black/40 border border-emerald-500/20 hover:border-emerald-500/40 transition-all backdrop-blur-sm group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-2.5 h-2.5 rounded-full shadow-lg" 
                          style={{ backgroundColor: goal.color || '#10B981' }}
                        />
                        <p className="font-semibold text-sm text-white">
                          {goal.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-white/70" />
                        <p className="text-xs text-white font-medium">
                          {monthsRemaining > 0 
                            ? `${monthsRemaining} ${monthsRemaining === 1 ? 'mês' : 'meses'} restantes`
                            : 'Prazo expirado'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">
                        {progress.toFixed(0)}%
                      </p>
                      <p className="text-xs text-white/80 font-medium">
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
                    className="h-2.5 bg-emerald-950/50"
                    style={{
                      // @ts-ignore
                      '--progress-background': goal.color || '#10B981',
                    }}
                  />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/80 font-medium">
                      Faltam {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      }).format(remaining)}
                    </span>
                    <span className="text-white/80 font-medium">
                      Meta: {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      }).format(goal.targetAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider com gradiente */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        {/* Footer com estatísticas */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-white/90 font-medium">
              Total economizado: {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(totalCurrent)}
            </span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 transition-all" 
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>
    </Card>
  );
}
