"use client";

import { CalendarView } from '@/components/calendar/calendar-view';
import { mockCalendarEvents } from '@/lib/mock-data';

export default function CalendarPage() {
  const handleEventClick = (event: any) => {
    console.log('Evento clicado:', event);
    alert(`${event.description} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(event.amount)}`);
  };

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarView
          events={mockCalendarEvents}
          onEventClick={handleEventClick}
        />
      </main>
    </div>
  );
}
