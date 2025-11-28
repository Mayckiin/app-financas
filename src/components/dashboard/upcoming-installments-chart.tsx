"use client";

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditCard, Calendar, TrendingUp } from 'lucide-react';

interface Transaction {
  id: string;
  parentId?: string;
  description?: string;
  amount: number;
  installmentNumber?: number;
  totalInstallments?: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

interface UpcomingInstallmentsChartProps {
  transactions: Transaction[];
}

interface MonthlyData {
  month: string;
  total: number;
}

// Função para agrupar parcelas futuras por mês
function getInstallmentsByMonth(transactions: Transaction[]): Record<string, number> {
  const today = new Date();
  const monthly: Record<string, number> = {};

  transactions.forEach(tx => {
    // Apenas despesas com data futura
    if (tx.type !== 'expense') return;
    if (!tx.date) return;

    const dueDate = new Date(tx.date);
    if (dueDate < today) return; // Ignora parcelas vencidas

    const key = tx.date.slice(0, 7); // "2024-03"

    monthly[key] = (monthly[key] || 0) + Number(tx.amount || 0);
  });

  return monthly;
}

// Converter para formato do gráfico
function convertToChartData(monthly: Record<string, number>): MonthlyData[] {
  return Object.keys(monthly)
    .sort()
    .map(key => ({
      month: formatMonthLabel(key),
      total: monthly[key]
    }));
}

// Formatar label do mês (2024-03 -> Mar/24)
function formatMonthLabel(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`;
}

// Formatar valor em moeda
function formatMoney(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function UpcomingInstallmentsChart({ transactions }: UpcomingInstallmentsChartProps) {
  const data = useMemo(() => {
    const monthly = getInstallmentsByMonth(transactions);
    return convertToChartData(monthly);
  }, [transactions]);

  // Calcular total de parcelas futuras
  const totalUpcoming = useMemo(() => {
    return data.reduce((sum, item) => sum + item.total, 0);
  }, [data]);

  return (
    <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-600/10 border-2 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]" />
      
      <div className="relative p-6 space-y-5">
        {/* Header Premium com Badge */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg shadow-purple-500/30">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                Parcelas Futuras
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-purple-400/80" />
              <span className="text-purple-200/90 font-medium">Gastos parcelados por mês</span>
            </div>
          </div>
          
          {/* Badge de Total */}
          <div className="flex flex-col items-end gap-1">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl shadow-lg shadow-purple-500/30">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-lg font-bold text-white">
                  {formatMoney(totalUpcoming)}
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-300/90 uppercase tracking-wider">
              Total a Vencer
            </span>
          </div>
        </div>

        {/* Divider com Gradiente */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* Gráfico */}
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-purple-300/70 space-y-3">
            <div className="p-4 bg-purple-500/10 rounded-2xl">
              <CreditCard className="w-12 h-12 text-purple-400/50" />
            </div>
            <p className="text-sm font-medium">Nenhuma parcela futura encontrada</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradientPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#EC4899" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#9333EA" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.1)" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: "#D8B4FE", fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: "rgba(168,85,247,0.2)" }}
              />
              <YAxis 
                tickFormatter={(v) => formatMoney(v)}
                tick={{ fill: "#D8B4FE", fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: "rgba(168,85,247,0.2)" }}
              />
              <Tooltip
                formatter={(value: number) => [formatMoney(value), 'Total']}
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#F3F4F6',
                  boxShadow: '0 10px 40px rgba(168, 85, 247, 0.3)',
                }}
                labelStyle={{ color: '#E9D5FF', fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Bar 
                dataKey="total" 
                fill="url(#barGradientPurple)"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Footer com Estatísticas */}
        {data.length > 0 && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-black/20 rounded-xl border border-purple-500/20">
                <p className="text-xs text-purple-300/80 mb-1">Períodos</p>
                <p className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                  {data.length} {data.length === 1 ? 'mês' : 'meses'}
                </p>
              </div>
              <div className="p-3 bg-black/20 rounded-xl border border-purple-500/20">
                <p className="text-xs text-purple-300/80 mb-1">Média Mensal</p>
                <p className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                  {formatMoney(totalUpcoming / data.length)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
