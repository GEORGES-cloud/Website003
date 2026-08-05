import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/* Recibe los leads de la web (formulario de contacto, banner de bienvenida y
   JoinFunnel) y los reenvía por email al club.

   Prioridad de envío:
   1. SMTP de Hostinger (el propio buzón Hello@flamingoyachtclub.com) si hay
      SMTP_PASS configurada — sin cuentas externas.
   2. Resend, si hay RESEND_API_KEY.
   3. Sin nada configurado (desarrollo): solo log en el servidor. */

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
    console.log('[Contact form]', { name, email, phone, message, to: contactEmail });

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
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Contact form error]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
