/**
 * Componente de Status de Integridade do Sistema
 * 
 * Exibe indicador visual do status de integridade e permite ações manuais
 */

'use client';

import { useState } from 'react';
import { useIntegrityCheck } from '@/hooks/use-integrity-check';
import { Shield, CheckCircle, AlertTriangle, XCircle, RefreshCw, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function IntegrityStatus() {
  const { report, isChecking, runCheck, autoFix } = useIntegrityCheck(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  const handleAutoFix = async () => {
    setIsFixing(true);
    try {
      const result = await autoFix();
      
      if (result.fixed.length > 0) {
        console.log('✅ Correções aplicadas:', result.fixed);
      }
      
      if (result.failed.length > 0) {
        console.error('❌ Falhas:', result.failed);
      }
    } finally {
      setIsFixing(false);
    }
  };

  if (!report) {
    return null;
  }

  // Determinar cor e ícone baseado no status
  const statusConfig = {
    OK: {
      color: 'emerald',
      icon: CheckCircle,
      bgGradient: 'from-emerald-500/10 via-green-500/5 to-emerald-600/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      label: 'Sistema Operacional',
    },
    WARNING: {
      color: 'amber',
      icon: AlertTriangle,
      bgGradient: 'from-amber-500/10 via-yellow-500/5 to-amber-600/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      label: 'Atenção Necessária',
    },
    ERROR: {
      color: 'red',
      icon: XCircle,
      bgGradient: 'from-red-500/10 via-orange-500/5 to-red-600/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      label: 'Problemas Detectados',
    },
  };

  const config = statusConfig[report.status];
  const StatusIcon = config.icon;

  return (
    <Card className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${config.bgGradient} border-2 ${config.border} transition-all duration-300 backdrop-blur-xl shadow-xl`}>
      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-br ${config.bgGradient} rounded-lg border ${config.border}`}>
              <Shield className={`w-5 h-5 ${config.text}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Integridade do Sistema</h3>
              <div className="flex items-center gap-2">
                <StatusIcon className={`w-4 h-4 ${config.text}`} />
                <span className={`text-xs font-semibold ${config.text}`}>
                  {config.label}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => runCheck()}
              disabled={isChecking}
              className={`p-2 rounded-lg border ${config.border} hover:bg-white/5 transition-colors disabled:opacity-50`}
              title="Verificar novamente"
            >
              <RefreshCw className={`w-4 h-4 ${config.text} ${isChecking ? 'animate-spin' : ''}`} />
            </button>

            {(report.status === 'WARNING' || report.status === 'ERROR') && (
              <button
                onClick={handleAutoFix}
                disabled={isFixing}
                className={`p-2 rounded-lg border ${config.border} hover:bg-white/5 transition-colors disabled:opacity-50`}
                title="Corrigir automaticamente"
              >
                <Wrench className={`w-4 h-4 ${config.text} ${isFixing ? 'animate-pulse' : ''}`} />
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-lg border ${config.border} hover:bg-white/5 transition-colors`}
              title={isExpanded ? 'Recolher' : 'Expandir'}
            >
              {isExpanded ? (
                <ChevronUp className={`w-4 h-4 ${config.text}`} />
              ) : (
                <ChevronDown className={`w-4 h-4 ${config.text}`} />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-white/10">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-black/20 rounded-lg border border-white/10 text-center">
                <p className="text-xs text-white/70 mb-1">Erros</p>
                <p className={`text-lg font-bold ${report.errors.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {report.errors.length}
                </p>
              </div>
              <div className="p-2 bg-black/20 rounded-lg border border-white/10 text-center">
                <p className="text-xs text-white/70 mb-1">Avisos</p>
                <p className={`text-lg font-bold ${report.warnings.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {report.warnings.length}
                </p>
              </div>
              <div className="p-2 bg-black/20 rounded-lg border border-white/10 text-center">
                <p className="text-xs text-white/70 mb-1">Sugestões</p>
                <p className="text-lg font-bold text-blue-400">
                  {report.suggestions.length}
                </p>
              </div>
            </div>

            {/* Check Results */}
            <div className="space-y-2">
              <CheckResultItem 
                title="Estado Global"
                result={report.checks.globalState}
              />
              <CheckResultItem 
                title="Funcionalidades Críticas"
                result={report.checks.criticalFeatures}
              />
              <CheckResultItem 
                title="Integridade de Dados"
                result={report.checks.dataIntegrity}
              />
              <CheckResultItem 
                title="Layout e Navegação"
                result={report.checks.layoutNavigation}
              />
            </div>

            {/* Errors */}
            {report.errors.length > 0 && (
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                <p className="text-xs font-bold text-red-400 mb-2">❌ Erros Detectados:</p>
                <ul className="space-y-1">
                  {report.errors.map((error, index) => (
                    <li key={index} className="text-xs text-red-300">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {report.warnings.length > 0 && (
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <p className="text-xs font-bold text-amber-400 mb-2">⚠️ Avisos:</p>
                <ul className="space-y-1">
                  {report.warnings.map((warning, index) => (
                    <li key={index} className="text-xs text-amber-300">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {report.suggestions.length > 0 && (
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className="text-xs font-bold text-blue-400 mb-2">💡 Sugestões:</p>
                <ul className="space-y-1">
                  {report.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-xs text-blue-300">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timestamp */}
            <p className="text-xs text-white/50 text-center">
              Última verificação: {new Date(report.timestamp).toLocaleString('pt-BR')}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

interface CheckResultItemProps {
  title: string;
  result: {
    status: 'OK' | 'WARNING' | 'ERROR';
    message: string;
    details: string[];
  };
}

function CheckResultItem({ title, result }: CheckResultItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    OK: { icon: CheckCircle, color: 'text-emerald-400' },
    WARNING: { icon: AlertTriangle, color: 'text-amber-400' },
    ERROR: { icon: XCircle, color: 'text-red-400' },
  };

  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  return (
    <div className="p-2 bg-black/20 rounded-lg border border-white/10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${config.color}`} />
          <span className="text-xs font-semibold text-white">{title}</span>
        </div>
        <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="mt-2 pl-6 space-y-1">
          <p className="text-xs text-white/70">{result.message}</p>
          {result.details.length > 0 && (
            <ul className="space-y-0.5">
              {result.details.map((detail, index) => (
                <li key={index} className="text-xs text-white/60">
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
