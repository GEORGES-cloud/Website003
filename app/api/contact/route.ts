import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/* Recibe los leads de la web (formulario de contacto, banner de bienvenida y
   JoinFunnel) y los reenvía por email al club.

   Prioridad de envío:
   1. SMTP de Hostinger (el propio buzón Hello@flamingoyachtclub.com) si hay
      SMTP_PASS configurada — sin cuentas externas.
   2. Resend, si hay RESEND_API_KEY.
   3. Sin nada configurado: en desarrollo se loguea; en producción responde
      503 para que el fallo se vea — antes devolvía ok y el lead se perdía
      sin que nadie se enterase. */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Anti-spam de mejor esfuerzo por instancia: ventana deslizante de envíos por
   IP. En serverless cada instancia lleva su propio contador — suficiente
   como freno junto al honeypot, sin base de datos. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Evita que el Map crezca sin límite entre ráfagas de tráfico.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, company } = body;

    // Honeypot: el campo "company" está oculto para personas; si llega
    // relleno es un bot. Se descarta fingiendo éxito para no darle pistas.
    if (company) {
      return NextResponse.json({ ok: true });
    }

    const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
    if (rateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Basta con un medio de contacto: email o teléfono (el banner de
    // bienvenida y el funnel dejan elegir el canal preferido).
    if (!name || !(email || phone) || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const contactEmail = process.env.CONTACT_EMAIL ?? 'Hello@flamingoyachtclub.com';

    const subject = `Nuevo lead — ${name}`;
    const html = `
      <h2>Nuevo lead de la web</h2>
      <p><strong>Nombre:</strong> ${esc(String(name))}</p>
      ${email ? `<p><strong>Email:</strong> ${esc(String(email))}</p>` : ''}
      ${phone ? `<p><strong>Teléfono:</strong> ${esc(String(phone))}</p>` : ''}
      <p><strong>Mensaje:</strong></p>
      <p>${esc(String(message))}</p>
    `;

    const smtpPass = process.env.SMTP_PASS;
    const resendKey = process.env.RESEND_API_KEY;

    if (smtpPass) {
      // — SMTP de Hostinger: envía el propio buzón del club —
      const smtpUser = process.env.SMTP_USER ?? contactEmail;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST ?? 'smtp.hostinger.com',
        port: Number(process.env.SMTP_PORT ?? 465),
        secure: (process.env.SMTP_PORT ?? '465') === '465',
        auth: { user: smtpUser, pass: smtpPass },
      });
      try {
        await transporter.sendMail({
          from: `Flamingo Yacht Club <${smtpUser}>`,
          to: contactEmail,
          subject,
          html,
          ...(email ? { replyTo: String(email) } : {}),
        });
      } catch (e) {
        console.error('[Contact form] SMTP error', e);
        return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 });
      }
    } else if (resendKey) {
      // — Resend (alternativa) —
      const from = process.env.RESEND_FROM ?? 'Flamingo Yacht Club <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [contactEmail],
          subject,
          html,
          ...(email ? { reply_to: [email] } : {}),
        }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        console.error('[Contact form] Resend error', res.status, detail);
        return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 });
      }
    } else if (process.env.NODE_ENV === 'production') {
      // Sin transporte configurado en producción el lead se perdería en
      // silencio: mejor que el formulario enseñe su estado de error.
      console.error('[Contact form] Ni SMTP_PASS ni RESEND_API_KEY configuradas — lead rechazado');
      return NextResponse.json({ error: 'Email not configured' }, { status: 503 });
    } else {
      // Desarrollo sin credenciales: registro sin datos personales.
      console.warn('[Contact form] Lead recibido (sin transporte de email configurado en dev)');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Contact form error]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
