import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const contactEmail = process.env.CONTACT_EMAIL ?? 'info@flamingoyachtclub.com';

    // TODO: Replace with Resend / Nodemailer for production
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Flamingo Yacht Club <noreply@flamingoyachtclub.com>',
    //   to: contactEmail,
    //   subject: `Nuevo mensaje de ${name}`,
    //   html: `<p>${message}</p><p>Email: ${email}</p><p>Tel: ${phone}</p>`,
    // });

    console.log('[Contact form]', { name, email, phone, message, to: contactEmail });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Contact form error]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
