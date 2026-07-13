'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { getStats } from '@/lib/localize';

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {n}
      {suffix ?? ''}
    </span>
  );
}

export default function Stats({ locale }: { locale: string }) {
  const stats = getStats(locale);
  return (
    <section className="bg-ink text-white py-16 md:py-20">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="display text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="font-sans text-xs sm:text-sm text-white/55 tracking-wide mt-3 max-w-[14rem] mx-auto">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
