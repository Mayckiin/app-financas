"use client";

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BalanceCardProps {
  totalBalance: number;
  trend?: number; // % de variação
}

export function BalanceCard({ totalBalance, trend = 0 }: BalanceCardProps) {
  const isPositiveTrend = trend >= 0;
  
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0 shadow-xl">
      <div className="space-y-2">
        <p className="text-sm font-medium opacity-90">Saldo Total Disponível</p>
        <div className="flex items-end justify-between">
          <h2 className="text-4xl font-bold tracking-tight">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(totalBalance)}
          </h2>
          {trend !== 0 && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              isPositiveTrend ? 'text-green-300' : 'text-red-300'
            }`}>
              {isPositiveTrend ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
        
        {/* Mini sparkline visual */}
        <div className="flex items-end gap-0.5 h-8 mt-4">
          {[40, 55, 45, 60, 50, 70, 65, 80, 75, 85, 90, 95].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-white/30 rounded-t-sm transition-all hover:bg-white/50"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
