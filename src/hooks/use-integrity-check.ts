/**
 * Hook React para Sistema de Verificação de Integridade
 * 
 * Executa verificações automáticas e fornece interface para componentes React
 */

import { useState, useEffect, useCallback } from 'react';
import { integrityChecker, IntegrityReport } from '@/lib/system/integrity-checker';

export interface IntegrityHookResult {
  report: IntegrityReport | null;
  isChecking: boolean;
  runCheck: () => Promise<void>;
  autoFix: () => Promise<{ fixed: string[]; failed: string[] }>;
  lastCheckTime: Date | null;
}

export function useIntegrityCheck(autoRunOnMount: boolean = true): IntegrityHookResult {
  const [report, setReport] = useState<IntegrityReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  const runCheck = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await integrityChecker.runFullScan();
      setReport(result);
      setLastCheckTime(new Date());
      
      // Log no console para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.group('🔍 FluxoFin Integrity Check');
        console.log('Status:', result.status);
        console.log('Timestamp:', result.timestamp);
        
        if (result.errors.length > 0) {
          console.error('❌ Errors:', result.errors);
        }
        
        if (result.warnings.length > 0) {
          console.warn('⚠️ Warnings:', result.warnings);
        }
        
        if (result.suggestions.length > 0) {
          console.info('💡 Suggestions:', result.suggestions);
        }
        
        console.log('Global State:', result.checks.globalState);
        console.log('Critical Features:', result.checks.criticalFeatures);
        console.log('Data Integrity:', result.checks.dataIntegrity);
        console.log('Layout Navigation:', result.checks.layoutNavigation);
        console.groupEnd();
      }
    } catch (error) {
      console.error('Erro ao executar verificação de integridade:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const autoFix = useCallback(async () => {
    const result = await integrityChecker.autoFix();
    
    // Executar nova verificação após correções
    await runCheck();
    
    return result;
  }, [runCheck]);

  // Executar verificação automática na montagem
  useEffect(() => {
    if (autoRunOnMount) {
      runCheck();
    }
  }, [autoRunOnMount, runCheck]);

  // Executar verificação periódica (a cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      runCheck();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [runCheck]);

  return {
    report,
    isChecking,
    runCheck,
    autoFix,
    lastCheckTime,
  };
}
