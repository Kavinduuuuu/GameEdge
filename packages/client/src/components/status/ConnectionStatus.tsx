'use client';

import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useWebSocket } from '@/providers/WebSocketProvider';
import { cn } from '@/lib/utils';

export function ConnectionStatus() {
  const { isConnected, isReconnecting } = useWebSocket();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 rounded-full bg-gameedge-dark-800/90 backdrop-blur-sm border border-white/10 px-3 py-1.5 shadow-lg">
      {isConnected ? (
        <>
          <Wifi className="h-3.5 w-3.5 text-gameedge-success" />
          <span className="text-xs text-gameedge-success">Live</span>
        </>
      ) : isReconnecting ? (
        <>
          <Loader2 className="h-3.5 w-3.5 text-gameedge-warning animate-spin" />
          <span className="text-xs text-gameedge-warning">Reconnecting...</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5 text-gameedge-danger" />
          <span className="text-xs text-gameedge-danger">Offline</span>
        </>
      )}
    </div>
  );
}
