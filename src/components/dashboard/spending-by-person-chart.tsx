"use client";

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Users, TrendingUp, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  date: string;
  purchaser?: string;
  installmentNumber?: number;
  totalInstallments?: number;
}

interface SpendingByPersonChartProps {
  transactions: Transaction[];
}

export function SpendingByPersonChart({ transactions }: SpendingByPersonChartProps) {
  // Processar dados: agrupar gastos por pessoa no mês atual
  const chartData = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Filtrar apenas despesas do mês atual
    const monthExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' && transactionDate >= startOfMonth;
    });

    // Agrupar por pessoa (purchaser)
    const spendingByPerson: Record<string, number> = {};

    monthExpenses.forEach(transaction => {
      const person = transaction.purchaser || 'Não informado';
      spendingByPerson[person] = (spendingByPerson[person] || 0) + transaction.amount;
    });

    // Converter para array e ordenar por valor (maior para menor)
    return Object.entries(spendingByPerson)
      .map(([person, total]) => ({
        person,
        total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  // Cores laranja/coral para as barras (gradiente vibrante)
  const barColors = [
    '#FF6B35', // Laranja coral principal
    '#FF8C42', // Laranja médio
    '#FFA94D', // Laranja claro
    '#FFB84D', // Laranja suave
    '#FF7F50', // Coral
  ];

  // Formatador de moeda
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Tooltip customizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-orange-500/40 rounded-xl p-4 shadow-2xl shadow-orange-500/20">
          <p className="text-orange-400 font-semibold text-sm mb-1">
            {payload[0].payload.person}
          </p>
          <p className="text-white font-bold text-xl">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Total gasto no mês
          </p>
        </div>
      );
    }
    return null;
  };

  // Calcular total geral
  const totalSpending = chartData.reduce((sum, item) => sum + item.total, 0);
  const averageSpending = chartData.length > 0 ? totalSpending / chartData.length : 0;

  return (
    <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 via-red-500/5 to-orange-600/10 border-2 border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-orange-500/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,53,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,140,66,0.15),transparent_50%)]" />
      
      <div className="relative p-6 space-y-5">
        {/* Header com Badge e Contador */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-lg shadow-orange-500/30">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                Gastos por Pessoa
              </h2>
            </div>
            <p className="text-white text-sm font-medium">
              Distribuição de despesas no mês
            </p>
          </div>
          
          {/* Badge de Contagem */}
          <div className="flex flex-col items-end gap-1">
            <div className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl shadow-lg shadow-orange-500/30">
              <span className="text-2xl font-bold text-white">
                {chartData.length}
              </span>
            </div>
            <span className="text-xs font-semibold text-orange-300/90 uppercase tracking-wider">
              {chartData.length === 1 ? 'Pessoa' : 'Pessoas'}
            </span>
          </div>
        </div>

        {/* Divider com Gradiente */}
        <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-12 h-12 text-orange-400/50 mx-auto mb-3" />
              <p className="text-white text-sm font-medium">Nenhum gasto registrado no mês</p>
              <p className="text-gray-400 text-xs mt-1">Adicione transações para visualizar</p>
            </div>
          </div>
        ) : (
          <>
            {/* Gráfico de Barras */}
            <div className="h-80 bg-black/20 rounded-xl p-4 border border-orange-500/20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(255,107,53,0.1)" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="person" 
                    tick={{ fill: '#FED7AA', fontSize: 12, fontWeight: 600 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    tick={{ fill: '#FED7AA', fontSize: 12, fontWeight: 600 }}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 107, 53, 0.1)' }} />
                  <Bar 
                    dataKey="total" 
                    radius={[8, 8, 0, 0]}
                    maxBarSize={80}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={barColors[index % barColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/20 rounded-xl border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-semibold text-orange-200/90 uppercase tracking-wider">
                    Total Geral
                  </span>
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
                  {formatCurrency(totalSpending)}
                </p>
              </div>

              <div className="p-4 bg-black/20 rounded-xl border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-semibold text-orange-200/90 uppercase tracking-wider">
                    Média por Pessoa
                  </span>
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
                  {formatCurrency(averageSpending)}
                </p>
              </div>
            </div>

            {/* Legenda com totais - Top 3 */}
            {chartData.length > 0 && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-orange-200/90 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-400" />
                    Top Gastadores
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {chartData.slice(0, 3).map((item, index) => (
                      <div 
                        key={item.person}
                        className="flex items-center justify-between p-3 bg-black/30 border border-orange-500/20 rounded-xl hover:border-orange-500/40 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-lg shadow-orange-500/30">
                            <span className="text-white font-bold text-sm">#{index + 1}</span>
                          </div>
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: barColors[index % barColors.length] }}
                          />
                          <span className="text-sm text-white font-semibold truncate max-w-[150px]">
                            {item.person}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
                            {formatCurrency(item.total)}
                          </p>
                          <p className="text-xs text-orange-300/70">
                            {((item.total / totalSpending) * 100).toFixed(1)}% do total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
