'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FluxoFinLogo } from '@/components/ui/FluxoFinLogo';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { login, register, forgotPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (!result) {
          setError('Email ou senha incorretos');
        }
      } else if (mode === 'register') {
        if (!name.trim()) {
          setError('Nome é obrigatório');
          setIsLoading(false);
          return;
        }
        const result = await register(email, password, name);
        if (!result) {
          setError('Email já cadastrado');
        }
      } else if (mode === 'forgot') {
        const result = await forgotPassword(email);
        if (result) {
          setSuccess('Instruções enviadas para seu email!');
          setTimeout(() => setMode('login'), 2000);
        } else {
          setError('Email não encontrado');
        }
      }
    } catch (err) {
      setError('Erro ao processar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-900)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--midnight-gold)] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--neon-green)] opacity-5 rounded-full blur-3xl" />
      </div>

      {/* Card de Login */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FluxoFinLogo className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FluxoFin</h1>
          <p className="text-[var(--gold-soft)] text-sm">
            Controle financeiro premium
          </p>
        </div>

        {/* Formulário */}
        <div className="glass rounded-2xl p-8 border border-[var(--midnight-gold)]/20 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'login'
                  ? 'bg-[var(--midnight-gold)] text-black'
                  : 'bg-[var(--surface-700)] text-gray-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'register'
                  ? 'bg-[var(--midnight-gold)] text-black'
                  : 'bg-[var(--surface-700)] text-gray-400 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Mensagens */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome (apenas no registro) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--surface-700)] border border-[var(--muted-500)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--midnight-gold)] transition-colors"
                    placeholder="Seu nome"
                    required={mode === 'register'}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--surface-700)] border border-[var(--muted-500)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--midnight-gold)] transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Senha (não mostrar no modo forgot) */}
            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-[var(--surface-700)] border border-[var(--muted-500)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--midnight-gold)] transition-colors"
                    placeholder="••••••••"
                    required={mode !== 'forgot'}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Esqueci minha senha */}
            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-sm text-[var(--gold-soft)] hover:text-[var(--midnight-gold)] transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[var(--midnight-gold)] to-[var(--gold-soft)] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[var(--midnight-gold)]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {mode === 'login' && 'Entrar'}
                  {mode === 'register' && 'Criar Conta'}
                  {mode === 'forgot' && 'Recuperar Senha'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Voltar (modo forgot) */}
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-sm text-gray-400 hover:text-white transition-colors"
              >
                Voltar para login
              </button>
            )}
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          FluxoFin © 2025 - Controle financeiro premium
        </p>
      </div>
    </div>
  );
}
