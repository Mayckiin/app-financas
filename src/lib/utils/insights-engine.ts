// Insights Engine - Rule-based AI para insights financeiros
import { Transaction, Insight } from '@/lib/types/financial';

export class InsightsEngine {
  /**
   * Detecta assinaturas recorrentes
   */
  static detectRecurringSubscriptions(
    transactions: Transaction[],
    userId: string
  ): Insight[] {
    const insights: Insight[] = [];
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    // Agrupar por título/merchant
    const merchantGroups = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return tDate >= threeMonthsAgo && t.type === 'expense';
      })
      .reduce((acc, t) => {
        // Validação: garantir que title ou description existe e é string
        const identifier = t.title || t.description || t.category;
        if (!identifier || typeof identifier !== 'string') return acc;
        
        const key = identifier.toLowerCase();
        if (!acc[key]) acc[key] = [];
        acc[key].push(t);
        return acc;
      }, {} as Record<string, Transaction[]>);

    // Detectar padrões mensais
    Object.entries(merchantGroups).forEach(([merchant, txs]) => {
      if (txs.length >= 3) {
        // Verificar se valores são similares (±10%)
        const avgAmount = txs.reduce((sum, t) => sum + t.amount, 0) / txs.length;
        const isSimilar = txs.every(t => 
          Math.abs(t.amount - avgAmount) / avgAmount <= 0.1
        );

        if (isSimilar) {
          const totalAnnual = avgAmount * 12;
          insights.push({
            id: `recurring-${merchant}-${Date.now()}`,
            userId,
            type: 'info',
            title: 'Assinatura recorrente detectada',
            message: `Você gasta R$ ${avgAmount.toFixed(2)}/mês com "${merchant}". Isso representa R$ ${totalAnnual.toFixed(2)}/ano. Considere revisar se ainda precisa desta assinatura.`,
            value: avgAmount,
            meta: { merchant, frequency: 'monthly', transactions: txs.length },
            status: 'active',
            createdAt: new Date(),
          });
        }
      }
    });

    return insights;
  }

  /**
   * Detecta picos de gastos
   */
  static detectSpendingSpikes(
    transactions: Transaction[],
    userId: string
  ): Insight[] {
    const insights: Insight[] = [];
    const now = new Date();
    
    // Gastos do mês atual
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthExpenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return tDate >= currentMonthStart && t.type === 'expense';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Média dos últimos 3 meses
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const lastThreeMonthsExpenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return tDate >= threeMonthsAgo && tDate < currentMonthStart && t.type === 'expense';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const avgMonthlyExpense = lastThreeMonthsExpenses / 3;

    // Detectar pico (>30% acima da média)
    if (currentMonthExpenses > avgMonthlyExpense * 1.3) {
      const increase = ((currentMonthExpenses - avgMonthlyExpense) / avgMonthlyExpense) * 100;
      insights.push({
        id: `spike-${Date.now()}`,
        userId,
        type: 'warning',
        title: 'Atenção: Gastos acima da média',
        message: `Seus gastos este mês estão ${increase.toFixed(1)}% acima da média dos últimos 3 meses. Revise suas despesas para manter o controle financeiro.`,
        value: currentMonthExpenses - avgMonthlyExpense,
        meta: { currentMonth: currentMonthExpenses, average: avgMonthlyExpense },
        status: 'active',
        createdAt: new Date(),
      });
    }

    return insights;
  }

  /**
   * Sugere otimização de fluxo de caixa
   */
  static suggestCashFlowOptimization(
    transactions: Transaction[],
    userId: string
  ): Insight[] {
    const insights: Insight[] = [];
    const now = new Date();
    
    // Analisar próximos 30 dias
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const upcomingExpenses = transactions
      .filter(t => {
        const dueDate = t.dueDate ? new Date(t.dueDate) : new Date(t.date);
        return dueDate >= now && dueDate <= next30Days && t.type === 'expense' && t.status === 'pending';
      })
      .sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date(a.date);
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    const totalUpcoming = upcomingExpenses.reduce((sum, t) => sum + t.amount, 0);

    // Receitas esperadas
    const upcomingIncome = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date >= now && date <= next30Days && t.type === 'income';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const projectedBalance = upcomingIncome - totalUpcoming;

    if (projectedBalance < 0) {
      insights.push({
        id: `cashflow-${Date.now()}`,
        userId,
        type: 'warning',
        title: 'Atenção ao fluxo de caixa',
        message: `Você tem R$ ${totalUpcoming.toFixed(2)} em despesas previstas para os próximos 30 dias, mas apenas R$ ${upcomingIncome.toFixed(2)} em receitas. Considere adiar pagamentos não urgentes ou buscar receitas extras.`,
        value: Math.abs(projectedBalance),
        meta: { upcomingExpenses: totalUpcoming, upcomingIncome, deficit: projectedBalance },
        status: 'active',
        createdAt: new Date(),
      });
    }

    return insights;
  }

  /**
   * Detecta oportunidades de economia
   */
  static detectSavingsOpportunities(
    transactions: Transaction[],
    userId: string
  ): Insight[] {
    const insights: Insight[] = [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Analisar gastos por categoria
    const categoryExpenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && t.type === 'expense';
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Categorias com potencial de economia
    const savingsCategories = [
      { name: 'Assinaturas', threshold: 200, savingsPct: 30 },
      { name: 'Alimentação', threshold: 800, savingsPct: 20 },
      { name: 'Transporte', threshold: 500, savingsPct: 15 },
      { name: 'Lazer', threshold: 400, savingsPct: 25 },
    ];

    savingsCategories.forEach(({ name, threshold, savingsPct }) => {
      const spent = categoryExpenses[name] || 0;
      if (spent > threshold) {
        const potentialSavings = spent * (savingsPct / 100);
        insights.push({
          id: `savings-${name}-${Date.now()}`,
          userId,
          type: 'tip',
          title: `Oportunidade de economia em ${name}`,
          message: `Você gastou R$ ${spent.toFixed(2)} em ${name} este mês. Reduzindo ${savingsPct}%, você pode economizar R$ ${potentialSavings.toFixed(2)}/mês.`,
          value: potentialSavings,
          meta: { category: name, currentSpending: spent, savingsPercentage: savingsPct },
          status: 'active',
          createdAt: new Date(),
        });
      }
    });

    return insights;
  }

  /**
   * Verifica metas de poupança
   */
  static checkSavingsGoals(
    income: number,
    expenses: number,
    userId: string
  ): Insight[] {
    const insights: Insight[] = [];
    
    if (income === 0) return insights;

    const savingsRate = ((income - expenses) / income) * 100;
    const idealRate = 20;

    if (savingsRate < idealRate) {
      const deficit = idealRate - savingsRate;
      const amountNeeded = (income * deficit) / 100;
      
      insights.push({
        id: `savings-goal-${Date.now()}`,
        userId,
        type: 'tip',
        title: 'Meta de poupança',
        message: `Sua taxa de poupança está em ${savingsRate.toFixed(1)}%. Para atingir a meta de ${idealRate}%, você precisa economizar mais R$ ${amountNeeded.toFixed(2)}/mês.`,
        value: amountNeeded,
        meta: { currentRate: savingsRate, targetRate: idealRate },
        status: 'active',
        createdAt: new Date(),
      });
    } else {
      insights.push({
        id: `savings-success-${Date.now()}`,
        userId,
        type: 'success',
        title: 'Parabéns! Meta de poupança atingida',
        message: `Sua taxa de poupança está em ${savingsRate.toFixed(1)}%, acima da meta de ${idealRate}%. Continue assim!`,
        value: savingsRate,
        meta: { currentRate: savingsRate, targetRate: idealRate },
        status: 'active',
        createdAt: new Date(),
      });
    }

    return insights;
  }

  /**
   * Gera todos os insights disponíveis
   */
  static generateAllInsights(
    transactions: Transaction[],
    income: number,
    expenses: number,
    userId: string
  ): Insight[] {
    const insights: Insight[] = [];

    // Executar todos os detectores
    insights.push(...this.detectRecurringSubscriptions(transactions, userId));
    insights.push(...this.detectSpendingSpikes(transactions, userId));
    insights.push(...this.suggestCashFlowOptimization(transactions, userId));
    insights.push(...this.detectSavingsOpportunities(transactions, userId));
    insights.push(...this.checkSavingsGoals(income, expenses, userId));

    // Limitar a 5 insights mais relevantes
    return insights.slice(0, 5);
  }
}
