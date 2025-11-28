"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'lembrete' | 'cobranca' | 'tarefa' | 'compromisso';
  date: string;
  value?: number;
  person?: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  notification: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ScheduleContextType {
  schedules: Schedule[];
  addSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => Promise<void>;
  updateSchedule: (id: string, updates: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  getUpcomingSchedules: (days: number) => Schedule[];
  getSchedulesByType: (type: Schedule['type']) => Schedule[];
  isLoading: boolean;
  error: string | null;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar agendamentos do localStorage na inicialização
  useEffect(() => {
    const loadSchedules = () => {
      try {
        const stored = localStorage.getItem('fluxofin_schedules');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Validar dados
          const validated = parsed.filter((s: any) => 
            s.id && s.title && s.date && s.type
          );
          setSchedules(validated);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Erro ao carregar agendamentos:', err);
        setError('Erro ao carregar agendamentos');
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, []);

  // Sincronizar com localStorage sempre que agendamentos mudarem
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('fluxofin_schedules', JSON.stringify(schedules));
      // Disparar evento de atualização
      window.dispatchEvent(new CustomEvent('schedules-updated', { detail: schedules }));
    }
  }, [schedules, isLoading]);

  // Escutar eventos de sincronização
  useEffect(() => {
    const handleSyncComplete = () => {
      const stored = localStorage.getItem('fluxofin_schedules');
      if (stored) {
        setSchedules(JSON.parse(stored));
      }
    };

    window.addEventListener('app-sync-complete', handleSyncComplete);
    return () => window.removeEventListener('app-sync-complete', handleSyncComplete);
  }, []);

  // Verificar agendamentos pendentes e gerar notificações
  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      schedules.forEach(schedule => {
        if (!schedule.completed && schedule.notification) {
          const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
          
          if (scheduleDate === today) {
            // Disparar notificação
            window.dispatchEvent(new CustomEvent('schedule-notification', {
              detail: {
                id: schedule.id,
                title: schedule.title,
                type: schedule.type,
                value: schedule.value,
              }
            }));
          }
        }
      });
    };

    // Verificar a cada minuto
    const interval = setInterval(checkSchedules, 60000);
    checkSchedules(); // Verificar imediatamente

    return () => clearInterval(interval);
  }, [schedules]);

  const addSchedule = useCallback(async (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => {
    try {
      // Validação completa anti-bug
      if (!schedule.title || schedule.title.trim() === '') {
        throw new Error('Título é obrigatório');
      }
      if (!schedule.date) {
        throw new Error('Data é obrigatória');
      }
      if (!schedule.type || !['lembrete', 'cobranca', 'tarefa', 'compromisso'].includes(schedule.type)) {
        throw new Error('Tipo inválido');
      }
      if (schedule.value !== undefined && schedule.value < 0) {
        throw new Error('Valor inválido');
      }

      const now = new Date().toISOString();
      const newSchedule: Schedule = {
        ...schedule,
        id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      // Atualizar estado local imediatamente
      setSchedules(prev => [...prev, newSchedule]);

      // Simular sincronização com backend
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('✅ Agendamento criado:', newSchedule.id);
      
    } catch (err: any) {
      console.error('❌ Erro ao criar agendamento:', err);
      setError(err.message || 'Erro ao criar agendamento');
      throw err;
    }
  }, []);

  const updateSchedule = useCallback(async (id: string, updates: Partial<Schedule>) => {
    try {
      // Validação
      if (updates.title !== undefined && updates.title.trim() === '') {
        throw new Error('Título não pode ser vazio');
      }
      if (updates.value !== undefined && updates.value < 0) {
        throw new Error('Valor inválido');
      }

      const now = new Date().toISOString();
      
      // Atualizar estado local imediatamente
      setSchedules(prev => 
        prev.map(s => 
          s.id === id 
            ? { ...s, ...updates, updatedAt: now }
            : s
        )
      );

      // Simular sincronização com backend
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('✅ Agendamento atualizado:', id);
      
    } catch (err: any) {
      console.error('❌ Erro ao atualizar agendamento:', err);
      setError(err.message || 'Erro ao atualizar agendamento');
      throw err;
    }
  }, []);

  const deleteSchedule = useCallback(async (id: string) => {
    try {
      // Atualizar estado local imediatamente
      setSchedules(prev => prev.filter(s => s.id !== id));

      // Simular sincronização com backend
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('✅ Agendamento deletado:', id);
      
    } catch (err: any) {
      console.error('❌ Erro ao deletar agendamento:', err);
      setError(err.message || 'Erro ao deletar agendamento');
      throw err;
    }
  }, []);

  const markAsCompleted = useCallback(async (id: string) => {
    try {
      const now = new Date().toISOString();
      
      setSchedules(prev => 
        prev.map(s => 
          s.id === id 
            ? { ...s, completed: true, updatedAt: now }
            : s
        )
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('✅ Agendamento marcado como concluído:', id);
      
    } catch (err: any) {
      console.error('❌ Erro ao marcar agendamento:', err);
      setError(err.message || 'Erro ao marcar agendamento');
      throw err;
    }
  }, []);

  const getUpcomingSchedules = useCallback((days: number) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return schedules.filter(s => {
      const scheduleDate = new Date(s.date);
      return !s.completed && scheduleDate >= now && scheduleDate <= futureDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [schedules]);

  const getSchedulesByType = useCallback((type: Schedule['type']) => {
    return schedules.filter(s => s.type === type && !s.completed);
  }, [schedules]);

  return (
    <ScheduleContext.Provider
      value={{
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        markAsCompleted,
        getUpcomingSchedules,
        getSchedulesByType,
        isLoading,
        error,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}
