'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

interface LifestyleGalleryProps {
  title: string;
}

const CELLS = [
  { src: '/images/life-1.jpg', row: 'row-span-2', delay: 0, kb: true },
  { src: '/images/life-3.jpg', row: '', delay: 0.1 },
  { src: '/images/life-4.jpg', row: '', delay: 0.15 },
  { src: '/images/life-6.jpg', row: '', delay: 0.2 },
  { src: '/images/life-5.jpg', row: 'row-span-2', delay: 0.25, kb: true },
  { src: '/images/exp-sunset.jpg', row: '', delay: 0.05 },
];

export default function LifestyleGallery({ title }: LifestyleGalleryProps) {
  return (
    <section className="py-24 md:py-36 bg-sand">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10">
        <ScrollReveal>
          <h2 className="display text-ink mb-14" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4rem)' }}>
            {title}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[40vw] md:auto-rows-auto md:grid-rows-3 gap-3 md:gap-4 md:h-[720px]">
          {CELLS.map((cell, i) => (
            <motion.div
              key={i}
              className={`relative overflow-hidden ${cell.row} group`}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: cell.delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <Image
                src={cell.src}
                alt="Yate de lujo en el mar"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className={
                  cell.kb
                    ? 'object-cover animate-kenburns'
                    : 'object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-[1.08]'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
