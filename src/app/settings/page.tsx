"use client";

import { Card } from '@/components/ui/card';
import { User, Bell, Lock, Download, HelpCircle, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'Conta',
      items: [
        { icon: User, label: 'Perfil', description: 'Editar informações pessoais' },
        { icon: Bell, label: 'Notificações', description: 'Gerenciar alertas e lembretes' },
        { icon: Lock, label: 'Segurança', description: 'Senha e autenticação' },
      ],
    },
    {
      title: 'Dados',
      items: [
        { icon: Download, label: 'Exportar', description: 'Baixar seus dados em CSV/PDF' },
      ],
    },
    {
      title: 'Suporte',
      items: [
        { icon: HelpCircle, label: 'Ajuda', description: 'Central de ajuda e tutoriais' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Fluxo.Fin
              </h1>
              <p className="text-sm text-muted-foreground">
                Controle financeiro inteligente
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Configurações
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas preferências e configurações
          </p>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                {section.title}
              </h3>
              <Card className="divide-y divide-gray-200 dark:divide-gray-800">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {item.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </Card>
            </div>
          ))}

          {/* Logout Button */}
          <Card className="p-4">
            <button className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 py-2 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair da conta</span>
            </button>
          </Card>

          {/* App Info */}
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>Fluxo.Fin v1.0.0 (MVP)</p>
            <p className="mt-1">© 2025 - Todos os direitos reservados</p>
          </div>
        </div>
      </main>
    </div>
  );
}
