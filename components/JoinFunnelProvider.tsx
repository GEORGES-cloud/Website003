'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface JoinFunnelContextValue {
  open: boolean;
  openFunnel: () => void;
  closeFunnel: () => void;
}

const JoinFunnelContext = createContext<JoinFunnelContextValue | null>(null);

export function useJoinFunnel(): JoinFunnelContextValue {
  const ctx = useContext(JoinFunnelContext);
  if (!ctx) throw new Error('useJoinFunnel must be used within <JoinFunnelProvider>');
  return ctx;
}

export default function JoinFunnelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openFunnel = useCallback(() => setOpen(true), []);
  const closeFunnel = useCallback(() => setOpen(false), []);

  return (
    <JoinFunnelContext.Provider value={{ open, openFunnel, closeFunnel }}>
      {children}
    </JoinFunnelContext.Provider>
  );
}
