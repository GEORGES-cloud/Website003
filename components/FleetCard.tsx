import Link from 'next/link';
import Image from 'next/image';
import type { LocalBoat } from '@/lib/localize';

interface FleetCardProps {
  boat: LocalBoat;
  locale: string;
  capacityLabel: string;
  lengthLabel: string;
}

export default function FleetCard({ boat, locale, capacityLabel }: FleetCardProps) {
  return (
    <Link href={`/${locale}/flota/${boat.slug}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] mb-5 bg-sand">
        <Image
          src={boat.image}
          alt={boat.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
        />
        <div className="absolute top-4 left-4">
          <span className="font-sans text-xs font-semibold tracking-wide2 uppercase text-white bg-ink/45 px-3 py-1.5">
            {boat.lengthM}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-sans text-xl font-medium text-ink group-hover:text-sea transition-colors leading-snug">
            {boat.name}
          </h3>
          <p className="font-sans text-sm text-muted mt-1.5">{boat.tagline}</p>
        </div>
        <div className="flex-none text-right pt-1">
          <p className="font-sans text-sm text-ink/70">
            {boat.capacity} <span className="text-muted">{capacityLabel}</span>
          </p>
          <p className="font-sans text-xs text-muted mt-1">{boat.year}</p>
        </div>
      </div>

      {/* Hover underline */}
      <div className="mt-4 h-px bg-line relative overflow-hidden">
        <div className="absolute inset-0 bg-sea translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-smooth" />
      </div>
    </Link>
  );
}
