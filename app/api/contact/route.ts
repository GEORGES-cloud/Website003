import { NextRequest, NextResponse } from 'next/server';

/* Recibe los leads de la web (formulario de contacto, banner de bienvenida y
   JoinFunnel) y los reenvía por email al club vía Resend. Sin RESEND_API_KEY
   (p. ej. en desarrollo) solo se registran en el log del servidor. */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    // Basta con un medio de contacto: email o teléfono (el banner de
    // bienvenida y el funnel dejan elegir el canal preferido).
    if (!name || !(email || phone) || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const contactEmail = process.env.CONTACT_EMAIL ?? 'Hello@flamingoyachtclub.com';
    const apiKey = process.env.RESEND_API_KEY;
    // Hasta verificar el dominio en Resend, onboarding@resend.dev permite
    // enviar al buzón del propietario de la cuenta. Con el dominio verificado:
    // RESEND_FROM="Flamingo Yacht Club <noreply@flamingoyachtclub.com>"
    const from = process.env.RESEND_FROM ?? 'Flamingo Yacht Club <onboarding@resend.dev>';

    console.log('[Contact form]', { name, email, phone, message, to: contactEmail });

    if (apiKey) {
      const html = `
        <h2>Nuevo lead de la web</h2>
        <p><strong>Nombre:</strong> ${esc(String(name))}</p>
        ${email ? `<p><strong>Email:</strong> ${esc(String(email))}</p>` : ''}
        ${phone ? `<p><strong>Teléfono:</strong> ${esc(String(phone))}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p>${esc(String(message))}</p>
      `;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [contactEmail],
          subject: `Nuevo lead — ${name}`,
          html,
          ...(email ? { reply_to: [email] } : {}),
        }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        console.error('[Contact form] Resend error', res.status, detail);
        return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Contact form error]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
