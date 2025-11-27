"use client";

import { Plus, CreditCard, ArrowLeftRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
          <Button 
            className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            size="lg"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Lançar</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-4 flex-col gap-2"
            size="lg"
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-sm font-medium">Parcela</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-4 flex-col gap-2"
            size="lg"
          >
            <ArrowLeftRight className="w-6 h-6" />
            <span className="text-sm font-medium">Transferir</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-4 flex-col gap-2"
            size="lg"
          >
            <Download className="w-6 h-6" />
            <span className="text-sm font-medium">Exportar</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
