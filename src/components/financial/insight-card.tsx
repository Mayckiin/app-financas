"use client";

import { Card } from '@/components/ui/card';
import { AlertCircle, X } from 'lucide-react';
import { Insight } from '@/lib/types/financial';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: Insight;
  onDismiss?: (id: string) => void;
}

export function InsightCard({ insight, onDismiss }: InsightCardProps) {
  const getColorClasses = () => {
    switch (insight.type) {
      case 'warning':
        return {
          card: 'from-red-900/20 to-red-950/20 border-red-500/30 hover:border-red-500/50',
          icon: 'bg-red-500/20',
          iconColor: 'text-red-400',
          title: 'text-red-300',
        };
      case 'success':
        return {
          card: 'from-emerald-900/20 to-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50',
          icon: 'bg-emerald-500/20',
          iconColor: 'text-emerald-400',
          title: 'text-emerald-300',
        };
      case 'tip':
        return {
          card: 'from-blue-900/20 to-blue-950/20 border-blue-500/30 hover:border-blue-500/50',
          icon: 'bg-blue-500/20',
          iconColor: 'text-blue-400',
          title: 'text-blue-300',
        };
      default:
        return {
          card: 'from-amber-900/20 to-amber-950/20 border-amber-500/30 hover:border-amber-500/50',
          icon: 'bg-amber-500/20',
          iconColor: 'text-amber-400',
          title: 'text-amber-300',
        };
    }
  };

  const colors = getColorClasses();

  return (
    <Card 
      className={cn(
        "p-4 bg-gradient-to-br backdrop-blur-xl border transition-all relative group",
        colors.card
      )}
    >
      {onDismiss && (
        <button
          onClick={() => onDismiss(insight.id)}
          className="absolute top-2 right-2 p-1 rounded-lg bg-black/20 hover:bg-black/40 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Dispensar insight"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
      
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", colors.icon)}>
          <AlertCircle className={cn("w-5 h-5", colors.iconColor)} />
        </div>
        <div className="flex-1 pr-6">
          <h3 className={cn("text-sm font-semibold mb-1", colors.title)}>
            {insight.title}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">{insight.message}</p>
          {insight.value && (
            <p className="text-xs text-gray-500 mt-2">
              Valor: {insight.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
