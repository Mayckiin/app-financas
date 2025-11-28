"use client";

import { Card } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-amber-400',
  iconBgColor = 'from-amber-500/20 to-yellow-500/20',
  trend,
  subtitle,
  className,
}: KPICardProps) {
  const getTrendColor = () => {
    if (!trend) return '';
    return trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card 
      className={cn(
        "p-6 bg-gradient-to-br from-gray-900/90 to-black/90 border-amber-500/30 hover:border-amber-500/50 transition-all backdrop-blur-xl shadow-2xl shadow-amber-500/5",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 bg-gradient-to-br rounded-lg shadow-lg", `shadow-${iconColor}/20`, iconBgColor)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        {(change !== undefined || changeLabel) && (
          <span className={cn("text-xs flex items-center gap-1 font-semibold", getTrendColor())}>
            {TrendIcon && <TrendIcon className="w-3 h-3" />}
            {changeLabel || `${change && change >= 0 ? '+' : ''}${change?.toFixed(1)}%`}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-1 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-100 mb-1">
        {typeof value === 'number' 
          ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : value
        }
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
    </Card>
  );
}
