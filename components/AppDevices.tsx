'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ScrollReveal from './ScrollReveal';

/* La app del club en sus dispositivos (portátil + teléfono, maquetados en CSS).
   Rescatado del diseño original y alineado con la flota y el motion actuales. */

const EASE = [0.22, 1, 0.36, 1] as const;

// Panel de reservas estilizado (solo diseño) — flota actual del club
function DashboardMock() {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const rows = [
    { name: 'Blue · SPX 210', blocks: [{ c: 'bg-sea/80', s: 1, w: 2 }, { c: 'bg-sea-light/70', s: 4, w: 1 }] },
    { name: 'NAVAN C30', blocks: [{ c: 'bg-sea-light/70', s: 2, w: 2 }, { c: 'bg-sea/80', s: 5, w: 2 }] },
    { name: 'Level 43ST', blocks: [{ c: 'bg-sea/60', s: 1, w: 1 }, { c: 'bg-sea-light/60', s: 3, w: 3 }] },
  ];
  return (
    <div className="w-full h-full bg-white flex flex-col text-[5px] sm:text-[6px]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-line">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sea/20" />
          <span className="font-semibold text-ink text-[6px] sm:text-[7px]">Flamingo Yacht Club · Puerto Banús</span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-sea text-white text-[5px] sm:text-[6px]">+ Reserva</span>
      </div>
      <div className="flex-1 p-3">
        <div className="grid grid-cols-8 gap-1 mb-1.5">
          <span />
          {days.map((d) => (
            <span key={d} className="text-center text-muted font-semibold">{d}</span>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.name} className="grid grid-cols-8 gap-1 items-center mb-1.5">
            <span className="text-muted truncate">{r.name}</span>
            <div className="col-span-7 relative h-3.5 sm:h-4">
              <div className="absolute inset-0 grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="rounded-[2px] bg-sand" />
                ))}
              </div>
              {r.blocks.map((b, i) => (
                <span
                  key={i}
                  className={`absolute top-0 bottom-0 rounded-[2px] ${b.c}`}
                  style={{ left: `calc(${((b.s - 1) / 7) * 100}% + 1px)`, width: `calc(${(b.w / 7) * 100}% - 2px)` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AppDevices() {
  const t = useTranslations('home.app');
  const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#';
  const playStoreUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? '#';
  const features = ['f1', 'f2', 'f3'] as const;

  return (
    <section className="py-24 md:py-36 bg-bone overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Copy */}
          <div className="lg:pr-8">
            <ScrollReveal>
              <p className="eyebrow mb-6">{t('eyebrow')}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="display text-ink mb-7" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4rem)' }}>
                {t('titleLead')} {t('titleAccent')}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="font-sans text-lg text-muted leading-relaxed mb-12 max-w-md">{t('description')}</p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <ul className="border-t border-ink/10 mb-12">
                {features.map((f) => (
                  <li key={f} className="border-b border-ink/10 py-5 font-sans text-base text-ink">
                    {t(f)}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <div className="flex gap-8">
                <Link href={appStoreUrl} className="link-underline">App Store</Link>
                <Link href={playStoreUrl} className="link-underline">Google Play</Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Dispositivos */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            viewport={{ once: true, margin: '-80px' }}
            className="relative pb-10"
          >
            {/* Portátil */}
            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="rounded-t-xl bg-ink p-2 sm:p-2.5 shadow-2xl">
                <div className="rounded-md overflow-hidden aspect-[16/10] bg-white">
                  <DashboardMock />
                </div>
              </div>
              <div className="relative h-3 bg-gradient-to-b from-[#c8ccce] to-[#9aa0a3] rounded-b-xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-[#7e8487] rounded-b-md" />
              </div>
            </div>

            {/* Teléfono superpuesto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
              viewport={{ once: true, margin: '-80px' }}
              className="absolute -bottom-2 -left-2 sm:left-6 w-[130px] sm:w-[160px]"
            >
              <div className="rounded-[1.6rem] bg-ink p-1.5 shadow-2xl">
                <div className="relative rounded-[1.3rem] overflow-hidden aspect-[9/19] bg-white">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-ink rounded-b-xl z-10" />
                  <div className="absolute inset-0 flex flex-col">
                    <div className="px-3 pt-5 pb-2">
                      <p className="font-sans text-[7px] font-semibold text-ink">Flamingo Yacht Club</p>
                      <p className="font-sans text-[5px] text-muted">Hola, Carlos</p>
                    </div>
                    <div className="relative flex-1 mx-2.5 mb-2.5 rounded-lg overflow-hidden">
                      <Image src="/images/fleet-searay.jpg" alt="" fill sizes="160px" className="img-grade object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                      <div className="absolute bottom-1.5 left-2 right-2">
                        <p className="font-sans text-[6px] font-semibold text-white">Blue · SPX 210</p>
                        <div className="mt-1 rounded bg-sea text-white text-center text-[5px] font-semibold py-1">
                          Reservar
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
