"use client";

import { useAppSync } from '@/contexts/AppSyncProvider';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export function SyncStatusIndicator() {
  const { syncStatus, triggerSync } = useAppSync();

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return 'text-red-400';
    if (syncStatus.error) return 'text-yellow-400';
    if (syncStatus.isSyncing) return 'text-blue-400';
    return 'text-green-400';
  };

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) return <WifiOff className="w-4 h-4" />;
    if (syncStatus.error) return <AlertCircle className="w-4 h-4" />;
    if (syncStatus.isSyncing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) return 'Offline';
    if (syncStatus.error) return 'Erro na sincronização';
    if (syncStatus.isSyncing) return 'Sincronizando...';
    if (syncStatus.lastSync) {
      const now = new Date();
      const lastSync = new Date(syncStatus.lastSync);
      const diffMinutes = Math.floor((now.getTime() - lastSync.getTime()) / 60000);
      
      if (diffMinutes < 1) return 'Sincronizado agora';
      if (diffMinutes === 1) return 'Sincronizado há 1 min';
      if (diffMinutes < 60) return `Sincronizado há ${diffMinutes} min`;
      return 'Sincronizado';
    }
    return 'Aguardando sincronização';
  };

  return (
    <button
      onClick={() => !syncStatus.isSyncing && triggerSync()}
      disabled={syncStatus.isSyncing}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
        syncStatus.isSyncing 
          ? 'bg-blue-500/10 border-blue-500/30 cursor-wait' 
          : 'bg-gray-900/50 border-amber-500/20 hover:border-amber-500/40 hover:bg-gray-900/70'
      }`}
      title={syncStatus.error || getStatusText()}
    >
      <span className={getStatusColor()}>
        {getStatusIcon()}
      </span>
      <span className="text-xs text-gray-300 hidden sm:inline">
        {getStatusText()}
      </span>
    </button>
  );
}
