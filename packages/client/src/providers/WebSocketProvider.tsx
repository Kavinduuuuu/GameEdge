'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { CafeStatus, Device } from '@/types';

interface WebSocketContextType {
  isConnected: boolean;
  isReconnecting: boolean;
  cafeStatus: CafeStatus | null;
  devices: Device[];
  lastMessage: unknown;
  sendMessage: (type: string, payload: unknown) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  isReconnecting: false,
  cafeStatus: null,
  devices: [],
  lastMessage: null,
  sendMessage: () => {},
});

export function useWebSocket() {
  return useContext(WebSocketContext);
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws';
const MAX_RECONNECT_DELAY = 30000;

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [cafeStatus, setCafeStatus] = useState<CafeStatus | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [lastMessage, setLastMessage] = useState<unknown>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelayRef = useRef(1000);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectDelayRef.current = 1000;
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);

          switch (message.type) {
            case 'cafe:status':
              setCafeStatus(message.payload as CafeStatus);
              break;
            case 'device:status':
              setDevices((prev) => {
                const updated = message.payload as Device;
                const index = prev.findIndex((d) => d.id === updated.id);
                if (index >= 0) {
                  const newDevices = [...prev];
                  newDevices[index] = updated;
                  return newDevices;
                }
                return [...prev, updated];
              });
              break;
            case 'booking:update':
              // Trigger booking refresh - handled by useBooking hook
              break;
          }
        } catch {
          // Invalid JSON, ignore
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setIsConnected(false);
        setIsReconnecting(true);

        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectDelayRef.current = Math.min(
            reconnectDelayRef.current * 2,
            MAX_RECONNECT_DELAY
          );
          connect();
        }, reconnectDelayRef.current);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      if (!mountedRef.current) return;
      setIsConnected(false);
      setIsReconnecting(true);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectDelayRef.current = Math.min(
          reconnectDelayRef.current * 2,
          MAX_RECONNECT_DELAY
        );
        connect();
      }, reconnectDelayRef.current);
    }
  }, []);

  const sendMessage = useCallback((type: string, payload: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        isReconnecting,
        cafeStatus,
        devices,
        lastMessage,
        sendMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
