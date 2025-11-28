// KPI Calculator - Cálculos avançados para métricas financeiras
import { Transaction, Account, KPIMetrics, CashFlowData, CategoryBreakdown } from '@/lib/types/financial';

export class KPICalculator {
  /**
   * Calcula o saldo consolidado de todas as contas
   */
  static calculateConsolidatedBalance(accounts: Account[]): number {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  }

  /**
   * Calcula o fluxo de caixa para um período específico
   */
  static calculateCashFlow(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date
  ): number {
    const periodTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });

    const inflows = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const outflows = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return inflows - outflows;
  }

  /**
   * Calcula a evolução patrimonial
   */
  static calculateNetWorth(
    accounts: Account[],
    investments: number,
    debts: number
  ): number {
    const totalAssets = this.calculateConsolidatedBalance(accounts) + investments;
    return totalAssets - debts;
  }

  /**
   * Calcula o ROI de investimentos
   */
  static calculateROI(currentValue: number, investedValue: number): number {
    if (investedValue === 0) return 0;
    return ((currentValue - investedValue) / investedValue) * 100;
  }

  /**
   * Calcula a relação dívida/renda (DTI - Debt to Income)
   */
  static calculateDTI(monthlyDebt: number, monthlyIncome: number): number {
    if (monthlyIncome === 0) return 0;
    return (monthlyDebt / monthlyIncome) * 100;
  }

  /**
   * Calcula a taxa de queima mensal (Monthly Burn Rate)
   */
  static calculateBurnRate(
    transactions: Transaction[],
    months: number = 3
  ): number {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1);

    const expenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return tDate >= startDate && t.type === 'expense';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return expenses / months;
  }

  /**
   * Calcula a taxa de poupança
   */
  static calculateSavingsRate(income: number, expenses: number): number {
    if (income === 0) return 0;
    return ((income - expenses) / income) * 100;
  }

  /**
   * Gera dados de fluxo de caixa para gráfico
   */
  static generateCashFlowData(
    transactions: Transaction[],
    months: number = 6
  ): CashFlowData[] {
    const now = new Date();
    const data: CashFlowData[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        income,
        expense,
        balance: income - expense,
      });
    }

    return data;
  }

  /**
   * Calcula breakdown de categorias
   */
  static calculateCategoryBreakdown(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    limit: number = 5
  ): CategoryBreakdown[] {
    const periodTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate && t.type === 'expense';
    });

    const categoryTotals = periodTransactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { amount: 0, count: 0 };
      }
      acc[t.category].amount += t.amount;
      acc[t.category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    const totalExpenses = Object.values(categoryTotals).reduce(
      (sum, val) => sum + val.amount,
      0
    );

    const colors = [
      '#C59D3E', // Gold
      '#D4B76A', // Light Gold
      '#FFA500', // Orange Gold
      '#FFD700', // Bright Gold
      '#B8860B', // Dark Gold
    ];

    return Object.entries(categoryTotals)
      .map(([name, data], index) => ({
        categoryName: name,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        color: colors[index % colors.length],
        transactions: data.count,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  }

  /**
   * Calcula todas as métricas KPI de uma vez
   */
  static calculateAllKPIs(
    transactions: Transaction[],
    accounts: Account[],
    period: '7d' | '30d' | '90d' | '365d' = '30d'
  ): KPIMetrics {
    const now = new Date();
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 };
    const days = daysMap[period];
    
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const endDate = now;

    // Calcular receitas e despesas do período
    const periodTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });

    const income = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Simular investimentos e dívidas
    const totalBalance = this.calculateConsolidatedBalance(accounts);
    const investments = totalBalance * 0.3;
    const debts = periodTransactions
      .filter(t => t.totalInstallments && t.totalInstallments > 1)
      .reduce((sum, t) => {
        const remaining = (t.totalInstallments || 1) - (t.installmentNumber || 1);
        return sum + t.amount * remaining;
      }, 0);

    const netWorth = this.calculateNetWorth(accounts, investments, debts);
    const cashFlow = this.calculateCashFlow(transactions, startDate, endDate);
    const savingsRate = this.calculateSavingsRate(income, expenses);
    const burnRate = this.calculateBurnRate(transactions, 3);
    const dti = this.calculateDTI(debts / 12, income / (days / 30));

    // Calcular variação do patrimônio (simulado)
    const netWorthChange = cashFlow > 0 ? 5.2 : -2.3;

    return {
      netWorth,
      netWorthChange,
      cashFlow,
      cashFlowHealth: cashFlow > 0 ? 'positive' : cashFlow < 0 ? 'negative' : 'neutral',
      totalInvestments: investments,
      investmentReturn: 8.5, // Simulado
      totalDebt: debts,
      debtToIncome: dti,
      savingsRate,
      monthlyBurnRate: burnRate,
      period,
    };
  }
}
