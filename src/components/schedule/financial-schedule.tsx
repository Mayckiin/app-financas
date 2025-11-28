"use client";

import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, X, Bell, Repeat, User, DollarSign, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface Schedule {
  id: string;
  title: string;
  type: 'lembrete' | 'cobranca' | 'tarefa';
  date: Date;
  value?: number;
  person?: string;
  repeat?: 'diaria' | 'semanal' | 'mensal' | 'nenhuma';
  notification: boolean;
  createdAt: Date;
}

export function FinancialSchedule() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'lembrete' as Schedule['type'],
    date: '',
    value: '',
    person: '',
    repeat: 'nenhuma' as Schedule['repeat'],
    notification: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      date: new Date(formData.date),
      value: formData.value ? parseFloat(formData.value) : undefined,
      person: formData.person || undefined,
      repeat: formData.repeat,
      notification: formData.notification,
      createdAt: new Date()
    };

    setSchedules(prev => [...prev, newSchedule]);
    setIsModalOpen(false);
    setFormData({
      title: '',
      type: 'lembrete',
      date: '',
      value: '',
      person: '',
      repeat: 'nenhuma',
      notification: true
    });
  };

  const handleDelete = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const getTypeColor = (type: Schedule['type']) => {
    switch (type) {
      case 'lembrete':
        return 'border-green-500/40 bg-green-500/10 text-green-400';
      case 'cobranca':
        return 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400';
      case 'tarefa':
        return 'border-red-500/40 bg-red-500/10 text-red-400';
    }
  };

  const getTypeLabel = (type: Schedule['type']) => {
    switch (type) {
      case 'lembrete':
        return 'Lembrete';
      case 'cobranca':
        return 'Cobrança';
      case 'tarefa':
        return 'Tarefa';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-amber-500/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="p-2.5 bg-gradient-to-br from-amber-500/30 to-yellow-500/30 rounded-xl shadow-lg shadow-amber-500/20">
            <CalendarIcon className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Agenda Financeira</h2>
            <p className="text-sm text-white">Gerencie cobranças, lembretes e tarefas</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 text-black font-semibold rounded-xl shadow-lg shadow-amber-500/30 transition-all hover:scale-105 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          Novo Agendamento
        </button>
      </div>

      {/* Schedules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.length === 0 ? (
          <Card className="col-span-full p-12 text-center bg-gradient-to-br from-gray-900/95 to-black/95 border-amber-500/30">
            <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">Nenhum agendamento</h3>
            <p className="text-gray-400 text-sm mb-4">
              Crie lembretes, cobranças e tarefas para organizar suas finanças
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-amber-300 hover:text-amber-200 transition-colors text-sm"
            >
              Criar primeiro agendamento
            </button>
          </Card>
        ) : (
          schedules.map((schedule) => (
            <Card
              key={schedule.id}
              className={`p-4 bg-gradient-to-br from-gray-900/95 to-black/95 border transition-all hover:scale-105 ${getTypeColor(schedule.type)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(schedule.type)}`}>
                  {getTypeLabel(schedule.type)}
                </span>
                <button
                  onClick={() => handleDelete(schedule.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-white font-semibold text-lg mb-2">{schedule.title}</h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <CalendarIcon className="w-4 h-4 text-amber-400" />
                  {schedule.date.toLocaleDateString('pt-BR')}
                </div>

                {schedule.value && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    R$ {schedule.value.toFixed(2)}
                  </div>
                )}

                {schedule.person && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4 text-blue-400" />
                    {schedule.person}
                  </div>
                )}

                {schedule.repeat && schedule.repeat !== 'nenhuma' && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Repeat className="w-4 h-4 text-purple-400" />
                    {schedule.repeat.charAt(0).toUpperCase() + schedule.repeat.slice(1)}
                  </div>
                )}

                {schedule.notification && (
                  <div className="flex items-center gap-2 text-amber-400">
                    <Bell className="w-4 h-4" />
                    Notificação ativa
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-gradient-to-br from-gray-950 via-black to-gray-900 border-amber-500/40 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Novo Agendamento</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-amber-500/20 rounded-lg transition-colors text-amber-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-900/50 border border-amber-500/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
                  placeholder="Ex: Pagar IPVA"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Schedule['type'] })}
                  className="w-full bg-gray-900/50 border border-amber-500/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/60"
                >
                  <option value="lembrete">Lembrete</option>
                  <option value="cobranca">Cobrança</option>
                  <option value="tarefa">Tarefa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-900/50 border border-amber-500/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/60"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Valor (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full bg-gray-900/50 border border-amber-500/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pessoa (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.person}
                    onChange={(e) => setFormData({ ...formData, person: e.target.value })}
                    className="w-full bg-gray-900/50 border border-amber-500/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
                    placeholder="Nome"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Repetição
                </label>
                <select
                  value={formData.repeat}
                  onChange={(e) => setFormData({ ...formData, repeat: e.target.value as Schedule['repeat'] })}
                  className="w-full bg-gray-900/50 border border-amber-500/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/60"
                >
                  <option value="nenhuma">Não repetir</option>
                  <option value="diaria">Diária</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notification"
                  checked={formData.notification}
                  onChange={(e) => setFormData({ ...formData, notification: e.target.checked })}
                  className="w-4 h-4 rounded border-amber-500/30 bg-gray-900/50 text-amber-500 focus:ring-amber-500/50"
                />
                <label htmlFor="notification" className="text-sm text-gray-300">
                  Ativar notificação
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 text-black font-semibold rounded-lg shadow-lg shadow-amber-500/30 transition-all"
                >
                  Criar Agendamento
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
