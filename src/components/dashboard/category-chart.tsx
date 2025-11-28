"use client";

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, TrendingDown } from 'lucide-react';

interface CategoryData {
  categoryName: string;
  amount: number;
  percentage: number;
  color: string;
}

interface CategoryChartProps {
  data: CategoryData[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  // Calcular total de gastos
  const totalAmount = data.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-600/10 border-2 border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-amber-500/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(234,179,8,0.1),transparent_50%)]" />
      
      <div className="relative p-6 space-y-5">
        {/* Header com Badge e Contador */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-lg shadow-amber-500/30">
                <PieChart className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Top 5 Categorias
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingDown className="w-4 h-4 text-amber-400/80" />
              <span className="text-amber-200/90 font-medium">Maiores gastos do mês</span>
            </div>
          </div>
          
          {/* Badge de Contagem */}
          <div className="flex flex-col items-end gap-1">
            <div className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl shadow-lg shadow-amber-500/30">
              <span className="text-2xl font-bold text-black">
                {data.length}
              </span>
            </div>
            <span className="text-xs font-semibold text-amber-300/90 uppercase tracking-wider">
              {data.length === 1 ? 'Categoria' : 'Categorias'}
            </span>
          </div>
        </div>

        {/* Divider com Gradiente */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        {/* Gráfico */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-amber-500/10" />
            <XAxis 
              dataKey="categoryName" 
              tick={{ fontSize: 12, fill: '#fbbf24' }}
              angle={-45}
              textAnchor="end"
              height={80}
              stroke="#f59e0b"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#fbbf24' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`}
              stroke="#f59e0b"
            />
            <Tooltip
              formatter={(value: number) => [
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(value),
                'Valor'
              ]}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                border: '2px solid rgba(251, 191, 36, 0.5)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#fbbf24',
                boxShadow: '0 10px 40px rgba(251, 191, 36, 0.3)',
              }}
              labelStyle={{ color: '#fde68a', fontWeight: 'bold' }}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Divider com Gradiente */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        {/* Lista com percentuais */}
        <div className="space-y-2">
          {data.map((category) => (
            <div key={category.categoryName} className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-amber-500/10 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full shadow-lg" 
                  style={{ backgroundColor: category.color, boxShadow: `0 0 10px ${category.color}` }}
                />
                <span className="font-medium text-amber-100">{category.categoryName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-amber-300">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(category.amount)}
                </span>
                <span className="text-xs font-bold text-amber-400/80 bg-amber-500/10 px-2 py-1 rounded-md">
                  {category.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer com Total */}
        {data.length > 0 && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-amber-500/20">
              <span className="text-sm font-semibold text-amber-200/90">Total de Gastos</span>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(totalAmount)}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
