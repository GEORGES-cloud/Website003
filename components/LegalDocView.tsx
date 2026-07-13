import type { LegalDoc } from '@/lib/legal';

export default function LegalDocView({ doc }: { doc: LegalDoc }) {
  return (
    <article className="pt-[136px] pb-24 md:pb-32 bg-bone">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <p className="eyebrow mb-5">Flamingo Yacht Club</p>
        <h1 className="display text-ink mb-4" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
          {doc.title}
        </h1>
        <p className="font-sans text-sm text-muted mb-10">{doc.updated}</p>
        <p className="font-sans text-lg text-ink/80 leading-relaxed mb-12">{doc.intro}</p>

        <div className="space-y-10">
          {doc.sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-sans text-xl font-medium text-ink mb-4">{s.heading}</h2>
              {s.body.map((p, j) => (
                <p key={j} className="font-sans text-base text-muted leading-relaxed mb-3">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
