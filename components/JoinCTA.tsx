'use client';
import { ReactNode } from 'react';
import { useJoinFunnel } from './JoinFunnelProvider';

interface JoinCTAProps {
  tier?: string; // when set, the funnel jumps straight to this plan's result
  className?: string;
  children: ReactNode;
}

/** Opens the interactive "Hazte Socio" funnel. Drop-in replacement for the old
 *  `<Link href={bookingUrl}>` join buttons — keeps the same className/label. */
export default function JoinCTA({ tier, className = '', children }: JoinCTAProps) {
  const { openFunnel } = useJoinFunnel();
  return (
    <button type="button" onClick={() => openFunnel(tier)} className={className}>
      {children}
    </button>
  );
}
