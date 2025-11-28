"use client";

import { Target, Wallet, BarChart3, FolderKanban, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export function QuickActions() {
  return (
    <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-blue-600/10 border-2 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-blue-500/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.15),transparent_50%)]" />
      
      <div className="relative p-6 space-y-5">
        {/* Header com Badge e Ícone */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
                Ações Rápidas
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FolderKanban className="w-4 h-4 text-blue-400/80" />
              <span className="text-white font-medium">Acesso rápido às principais funções</span>
            </div>
          </div>
          
          {/* Badge de Contagem */}
          <div className="flex flex-col items-end gap-1">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30">
              <span className="text-2xl font-bold text-white">5</span>
            </div>
            <span className="text-xs font-semibold text-blue-300/90 uppercase tracking-wider">
              Ações
            </span>
          </div>
        </div>

        {/* Divider com Gradiente */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        {/* Grid de Botões */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/categories">
            <Button 
              className="w-full h-auto py-4 flex-col gap-2 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 border border-blue-400/50 transition-all hover:scale-105"
              size="lg"
            >
              <FolderKanban className="w-6 h-6" />
              <span className="text-sm font-semibold">Categorias</span>
            </Button>
          </Link>

          <Link href="/accounts">
            <Button 
              className="w-full h-auto py-4 flex-col gap-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 text-gray-100 border border-blue-500/30 hover:border-blue-500/50 shadow-lg transition-all hover:scale-105"
              size="lg"
            >
              <Wallet className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-medium text-white">Contas</span>
            </Button>
          </Link>

          <Link href="/goals">
            <Button 
              className="w-full h-auto py-4 flex-col gap-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 text-gray-100 border border-blue-500/30 hover:border-blue-500/50 shadow-lg transition-all hover:scale-105"
              size="lg"
            >
              <Target className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-medium text-white">Metas</span>
            </Button>
          </Link>

          <Link href="/reports">
            <Button 
              className="w-full h-auto py-4 flex-col gap-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 text-gray-100 border border-blue-500/30 hover:border-blue-500/50 shadow-lg transition-all hover:scale-105"
              size="lg"
            >
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-medium text-white">Relatórios</span>
            </Button>
          </Link>

          <Link href="/agenda" className="col-span-2">
            <Button 
              className="w-full h-auto py-4 flex-col gap-2 bg-gradient-to-br from-indigo-600/80 to-blue-700/80 hover:from-indigo-500/80 hover:to-blue-600/80 text-white border border-indigo-400/50 hover:border-indigo-400/70 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
              size="lg"
            >
              <Calendar className="w-6 h-6" />
              <span className="text-sm font-semibold">Agenda Financeira</span>
            </Button>
          </Link>
        </div>

        {/* Footer com Info */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="flex items-center justify-center p-3 bg-black/20 rounded-xl border border-blue-500/20">
          <span className="text-xs font-medium text-blue-200/90">
            Acesse rapidamente suas ferramentas favoritas
          </span>
        </div>
      </div>
    </Card>
  );
}
