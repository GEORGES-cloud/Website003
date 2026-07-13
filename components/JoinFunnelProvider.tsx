'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface JoinFunnelContextValue {
  open: boolean;
  preselectTier: string | null;
  openFunnel: (tier?: string) => void;
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
  const [preselectTier, setPreselectTier] = useState<string | null>(null);

  const openFunnel = useCallback((tier?: string) => {
    setPreselectTier(tier ?? null);
    setOpen(true);
  }, []);

  const closeFunnel = useCallback(() => setOpen(false), []);

  return (
    <JoinFunnelContext.Provider value={{ open, preselectTier, openFunnel, closeFunnel }}>
      {children}
    </JoinFunnelContext.Provider>
  );
}
