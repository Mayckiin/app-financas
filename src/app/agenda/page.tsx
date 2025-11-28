"use client";

import { FinancialSchedule } from '@/components/schedule/financial-schedule';

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FinancialSchedule />
      </main>
    </div>
  );
}
