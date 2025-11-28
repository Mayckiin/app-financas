"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, TrendingUp, AlertTriangle, Calendar, DollarSign, PieChart, Target, Search, Database, Globe } from 'lucide-react';
import { useStore } from '@/hooks/use-store';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  dataSource?: 'app' | 'external';
}

interface FinaAssistantProps {
  className?: string;
}

export function FinaAssistant({ className = '' }: FinaAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🌟 Olá! Sou a FINA, sua assistente financeira inteligente.\n\nEstou conectada a TODOS os dados do seu app:\n✅ Transações e lançamentos\n✅ Categorias e contas\n✅ Metas financeiras\n✅ Parcelamentos\n✅ Pesquisa externa (Google)\n\nComo posso ajudar você hoje?',
      timestamp: new Date(),
      suggestions: [
        'Analisar mês atual',
        'Maiores gastos',
        'Status das metas',
        'Próximas contas',
        'Pesquisar investimentos'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { transactions, categories, accounts, goals } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Função para pesquisa externa (simulação de integração com Google)
  const performExternalSearch = (query: string): string => {
    const searchTerms = query.toLowerCase();
    
    // Simulação de respostas baseadas em conhecimento financeiro
    if (searchTerms.includes('investimento') || searchTerms.includes('investir')) {
      return `🌐 **Pesquisa Externa - Investimentos**\n\nBaseado em dados atualizados:\n\n📊 **Opções de Investimento 2025:**\n• Tesouro Direto: ~12-13% ao ano (baixo risco)\n• CDB: 100-120% do CDI (baixo risco)\n• Fundos Imobiliários: 8-12% ao ano (médio risco)\n• Ações: variável (alto risco/retorno)\n\n💡 **Recomendação:** Diversifique entre renda fixa (60%) e variável (40%) para equilibrar risco e retorno.\n\n⚠️ Consulte um assessor financeiro para orientação personalizada.`;
    }
    
    if (searchTerms.includes('economia') || searchTerms.includes('economizar')) {
      return `🌐 **Pesquisa Externa - Dicas de Economia**\n\n💰 **Top 5 Estratégias para Economizar:**\n1. Regra 50-30-20: 50% necessidades, 30% desejos, 20% poupança\n2. Cancele assinaturas não utilizadas\n3. Compare preços antes de comprar\n4. Cozinhe em casa (economize até 60%)\n5. Use transporte público quando possível\n\n📈 Pequenas economias diárias = grandes resultados anuais!`;
    }
    
    if (searchTerms.includes('inflação') || searchTerms.includes('ipca')) {
      return `🌐 **Pesquisa Externa - Inflação**\n\n📊 **IPCA Atual (estimativa 2025):**\n• Meta: 3,0% ao ano\n• Tolerância: 1,5% a 4,5%\n\n💡 **Impacto no seu bolso:**\nPara manter o poder de compra, seus investimentos devem render acima da inflação.\n\n✅ Invista em ativos que protegem contra inflação (Tesouro IPCA+, imóveis).`;
    }
    
    if (searchTerms.includes('aposentadoria') || searchTerms.includes('previdência')) {
      return `🌐 **Pesquisa Externa - Planejamento de Aposentadoria**\n\n🎯 **Quanto poupar para aposentadoria:**\n• Regra geral: 10-15% da renda mensal\n• Quanto antes começar, menor o esforço\n\n📊 **Opções:**\n• INSS (público)\n• Previdência Privada (PGBL/VGBL)\n• Investimentos próprios\n\n💡 Diversifique suas fontes de renda para o futuro!`;
    }
    
    return `🌐 **Pesquisa Externa**\n\nRealizei uma busca sobre "${query}".\n\n💡 **Sugestão:** Tente perguntas sobre:\n• Investimentos e aplicações\n• Dicas de economia\n• Inflação e IPCA\n• Planejamento de aposentadoria\n• Educação financeira\n\nOu pergunte sobre seus dados financeiros no app!`;
  };

  // Análise completa de todos os dados do app
  const analyzeUserData = (query: string): { content: string; dataSource: 'app' | 'external' } => {
    const lowerQuery = query.toLowerCase();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Detectar se é uma pesquisa externa
    const externalKeywords = ['pesquisar', 'buscar', 'google', 'internet', 'investimento', 'inflação', 'ipca', 'economia', 'aposentadoria', 'previdência'];
    const isExternalSearch = externalKeywords.some(keyword => lowerQuery.includes(keyword));
    
    if (isExternalSearch) {
      return {
        content: performExternalSearch(query),
        dataSource: 'external'
      };
    }
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth;
    });

    const expenses = monthTransactions.filter(t => t.type === 'expense');
    const incomes = monthTransactions.filter(t => t.type === 'income');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);

    // Análise de mês atual
    if (lowerQuery.includes('mês') || lowerQuery.includes('mes') || lowerQuery.includes('atual')) {
      const balance = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0';
      
      return {
        content: `📊 **Análise do Mês Atual**\n\n💰 **Receitas:** R$ ${totalIncome.toFixed(2)}\n💸 **Despesas:** R$ ${totalExpenses.toFixed(2)}\n${balance >= 0 ? '✅' : '⚠️'} **Saldo:** R$ ${balance.toFixed(2)}\n\n📈 **Taxa de Poupança:** ${savingsRate}%\n📝 **Total de transações:** ${monthTransactions.length}\n\n${balance < 0 ? '⚠️ Atenção: Você gastou mais do que ganhou este mês!' : balance > 0 ? '🎉 Parabéns! Você está economizando este mês!' : ''}`,
        dataSource: 'app'
      };
    }

    // Análise de maiores gastos
    if (lowerQuery.includes('maior') && (lowerQuery.includes('gasto') || lowerQuery.includes('despesa'))) {
      const topExpenses = expenses
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
      
      if (topExpenses.length === 0) {
        return {
          content: '📊 Você ainda não tem gastos registrados neste mês.',
          dataSource: 'app'
        };
      }

      let content = `💸 **Seus Maiores Gastos do Mês**\n\n`;
      topExpenses.forEach((t, i) => {
        content += `${i + 1}. ${t.description || t.category}: R$ ${t.amount.toFixed(2)}\n`;
      });
      content += `\n📊 **Total de despesas:** R$ ${totalExpenses.toFixed(2)}`;
      
      return { content, dataSource: 'app' };
    }

    // Análise por categoria
    if (lowerQuery.includes('categoria')) {
      const categoryTotals = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

      const sortedCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a);

      if (sortedCategories.length === 0) {
        return {
          content: '📊 Você ainda não tem gastos categorizados neste mês.',
          dataSource: 'app'
        };
      }

      let content = `📂 **Gastos por Categoria**\n\n`;
      sortedCategories.slice(0, 5).forEach(([cat, amount], i) => {
        const percentage = ((amount / totalExpenses) * 100).toFixed(1);
        content += `${i + 1}. ${cat}: R$ ${amount.toFixed(2)} (${percentage}%)\n`;
      });
      
      return { content, dataSource: 'app' };
    }

    // Análise de contas
    if (lowerQuery.includes('conta') || lowerQuery.includes('saldo')) {
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      
      let content = `💳 **Suas Contas**\n\n`;
      accounts.forEach(acc => {
        const emoji = acc.balance >= 0 ? '✅' : '⚠️';
        content += `${emoji} ${acc.name}: R$ ${acc.balance.toFixed(2)}\n`;
      });
      content += `\n💰 **Saldo Total:** R$ ${totalBalance.toFixed(2)}`;
      
      return { content, dataSource: 'app' };
    }

    // Análise de metas
    if (lowerQuery.includes('meta') || lowerQuery.includes('objetivo')) {
      if (goals.length === 0) {
        return {
          content: '🎯 Você ainda não tem metas financeiras cadastradas.\n\n💡 Crie metas para acompanhar seu progresso!',
          dataSource: 'app'
        };
      }

      let content = `🎯 **Suas Metas Financeiras**\n\n`;
      goals.forEach(goal => {
        const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);
        const remaining = goal.targetAmount - goal.currentAmount;
        content += `📌 ${goal.name}\n`;
        content += `   Progresso: ${progress}% (R$ ${goal.currentAmount.toFixed(2)} / R$ ${goal.targetAmount.toFixed(2)})\n`;
        content += `   Faltam: R$ ${remaining.toFixed(2)}\n`;
        content += `   Prazo: ${new Date(goal.deadline).toLocaleDateString('pt-BR')}\n\n`;
      });
      
      return { content, dataSource: 'app' };
    }

    // Análise de categorias disponíveis
    if (lowerQuery.includes('quais categorias') || lowerQuery.includes('lista de categorias')) {
      const incomeCategories = categories.filter(c => c.type === 'income');
      const expenseCategories = categories.filter(c => c.type === 'expense');
      
      let content = `📂 **Categorias Cadastradas**\n\n`;
      content += `💰 **Receitas (${incomeCategories.length}):**\n`;
      incomeCategories.forEach(cat => content += `   ${cat.icon} ${cat.name}\n`);
      content += `\n💸 **Despesas (${expenseCategories.length}):**\n`;
      expenseCategories.forEach(cat => content += `   ${cat.icon} ${cat.name}\n`);
      
      return { content, dataSource: 'app' };
    }

    // Análise de parcelamentos
    if (lowerQuery.includes('parcel')) {
      const installments = transactions.filter(t => t.installments && t.installments > 1);
      
      if (installments.length === 0) {
        return {
          content: '📊 Você não tem parcelamentos ativos no momento.',
          dataSource: 'app'
        };
      }

      const totalInstallments = installments.reduce((sum, t) => sum + t.amount, 0);
      let content = `💳 **Parcelamentos Ativos**\n\n`;
      content += `📊 Total de parcelamentos: ${installments.length}\n`;
      content += `💰 Valor total: R$ ${totalInstallments.toFixed(2)}\n\n`;
      
      installments.slice(0, 5).forEach(t => {
        content += `• ${t.description}: R$ ${t.amount.toFixed(2)}\n`;
      });
      
      return { content, dataSource: 'app' };
    }

    // Próximas contas a vencer
    if (lowerQuery.includes('próxima') || lowerQuery.includes('proxima') || lowerQuery.includes('vencer')) {
      const upcomingBills = transactions.filter(t => {
        const dueDate = new Date(t.date);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue >= 0 && daysUntilDue <= 7 && t.type === 'expense';
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (upcomingBills.length === 0) {
        return {
          content: '✅ Você não tem contas a vencer nos próximos 7 dias!',
          dataSource: 'app'
        };
      }

      let content = `⏰ **Contas a Vencer (Próximos 7 dias)**\n\n`;
      upcomingBills.forEach(bill => {
        const dueDate = new Date(bill.date);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const urgency = daysUntilDue <= 1 ? '🔴' : daysUntilDue <= 3 ? '🟡' : '🟢';
        content += `${urgency} ${bill.description || bill.category}: R$ ${bill.amount.toFixed(2)}\n`;
        content += `   Vence em ${daysUntilDue} dia(s) - ${dueDate.toLocaleDateString('pt-BR')}\n\n`;
      });
      
      return { content, dataSource: 'app' };
    }

    // Resposta padrão com todas as opções
    return {
      content: `🤔 Não entendi sua pergunta. Aqui está o que posso fazer:\n\n📊 **Análises do App:**\n• Analisar mês atual\n• Maiores gastos\n• Gastos por categoria\n• Status das contas\n• Progresso das metas\n• Parcelamentos ativos\n• Próximas contas a vencer\n• Listar categorias\n\n🌐 **Pesquisas Externas:**\n• Investimentos\n• Dicas de economia\n• Inflação e IPCA\n• Planejamento de aposentadoria\n\nTente perguntar algo específico!`,
      dataSource: 'app'
    };
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular delay de digitação
    setTimeout(() => {
      const { content: response, dataSource } = analyzeUserData(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        dataSource,
        suggestions: [
          'Analisar mês atual',
          'Maiores gastos',
          'Status das metas',
          'Próximas contas',
          'Pesquisar investimentos'
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 text-black rounded-full shadow-2xl shadow-amber-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 group border border-amber-300/50 ${className}`}
        aria-label="Abrir assistente FINA"
      >
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" strokeWidth={2.5} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse"></span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-4 sm:w-96 sm:h-[600px] w-full h-full bg-gradient-to-br from-gray-950 via-black to-gray-900 border-0 sm:border sm:border-amber-500/40 rounded-none sm:rounded-2xl shadow-2xl shadow-amber-500/20 z-50 flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-b border-amber-500/30 p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50 relative flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-black" strokeWidth={2.5} />
                <Database className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2 truncate">
                  FINA
                  <span className="hidden sm:inline text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 flex-shrink-0">
                    Conectada
                  </span>
                </h3>
                <p className="text-amber-300 text-xs sm:text-sm flex items-center gap-1 truncate">
                  <Database className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Sincronizada com todos os dados</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-amber-500/20 rounded-lg transition-colors text-amber-400 hover:text-amber-300 flex-shrink-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-amber-500/30 to-yellow-500/30 border border-amber-500/40 text-white'
                      : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-amber-500/20 text-gray-100'
                  }`}
                >
                  {/* Data Source Badge */}
                  {message.dataSource && message.type === 'assistant' && (
                    <div className="flex items-center gap-1 mb-2 text-xs">
                      {message.dataSource === 'app' ? (
                        <>
                          <Database className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span className="text-green-400">Dados do App</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3 text-blue-400 flex-shrink-0" />
                          <span className="text-blue-400">Pesquisa Externa</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs sm:text-sm whitespace-pre-line break-words">{message.content}</p>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.type === 'assistant' && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-2.5 sm:px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-xs text-amber-300 hover:text-amber-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-amber-500/20 rounded-2xl p-3 sm:p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-amber-500/30 p-3 sm:p-4 bg-black/40 backdrop-blur-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Pergunte sobre seus dados..."
                className="flex-1 bg-gray-900/50 border border-amber-500/30 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-colors text-xs sm:text-sm"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="p-2 sm:p-2.5 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 disabled:from-gray-700 disabled:to-gray-800 text-black disabled:text-gray-500 rounded-xl transition-all disabled:cursor-not-allowed shadow-lg shadow-amber-500/30 disabled:shadow-none flex-shrink-0"
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
