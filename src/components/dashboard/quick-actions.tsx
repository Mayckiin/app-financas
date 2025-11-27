"use client";

import { Target, Wallet, BarChart3, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export function QuickActions() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Ações Rápidas
          </h3>
          <p className="text-sm text-muted-foreground">Acesso rápido às principais funções</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/categories">
            <Button 
              className="w-full h-auto py-4 flex-col gap-2 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              size="lg"
            >
              <FolderKanban className="w-6 h-6" />
              <span className="text-sm font-medium">Categorias</span>
            </Button>
          </Link>

          <Link href="/accounts">
            <Button 
              variant="outline" 
              className="w-full h-auto py-4 flex-col gap-2"
              size="lg"
            >
              <Wallet className="w-6 h-6" />
              <span className="text-sm font-medium">Contas</span>
            </Button>
          </Link>

          <Link href="/goals">
            <Button 
              variant="outline" 
              className="w-full h-auto py-4 flex-col gap-2"
              size="lg"
            >
              <Target className="w-6 h-6" />
              <span className="text-sm font-medium">Metas</span>
            </Button>
          </Link>

          <Link href="/reports">
            <Button 
              variant="outline" 
              className="w-full h-auto py-4 flex-col gap-2"
              size="lg"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm font-medium">Relatórios</span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
