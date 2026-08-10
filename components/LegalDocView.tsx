import type { LegalDoc } from '@/lib/legal';

export default function LegalDocView({ doc }: { doc: LegalDoc }) {
  // Mientras el documento conserve campos entre corchetes ([RAZÓN SOCIAL],
  // [CIF/NIF]...) se muestra un aviso; desaparece solo al completarlos.
  const allText = [doc.intro, ...doc.sections.flatMap((s) => [s.heading, ...s.body])].join(' ');
  const hasPlaceholders = /\[[^\]]{2,}\]/.test(allText);

  return (
    <article className="pt-[calc(var(--header-h)+3rem)] pb-24 md:pb-32 bg-bone">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        {hasPlaceholders && (
          <div className="border border-amber-400 bg-amber-50 px-5 py-4 mb-10">
            <p className="font-sans text-sm text-amber-900 leading-relaxed">
              Documento pendiente de completar: faltan los datos entre corchetes (razón social,
              CIF...). / Document pending completion: bracketed fields still need to be filled in.
            </p>
          </div>
        )}
        <p className="eyebrow mb-5">Flamingo Yacht Club</p>
        <h1 className="display text-ink mb-4 display-2">
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
