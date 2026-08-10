import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/* Webhook de Sanity: al publicar un cambio en /studio, Sanity llama aquí y
   se invalida la caché del tipo de contenido editado — la web se refresca en
   segundos sin redeploy.

   Configuración en sanity.io/manage → API → Webhooks:
     URL:        https://<dominio>/api/revalidate
     Trigger:    create, update, delete
     Filter:     _type in ["boat","faq","testimonial","stat","milestone","tier","legalDoc","lifestyleGallery","siteSettings"]
     Projection: { "tags": [_type] }
     Secret:     el mismo valor que SANITY_REVALIDATE_SECRET en Vercel */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ tags?: string[] }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    if (!body?.tags?.length) {
      return NextResponse.json({ error: 'Missing tags' }, { status: 400 });
    }

    for (const tag of body.tags) revalidateTag(tag);
    return NextResponse.json({ revalidated: body.tags, now: Date.now() });
  } catch (err) {
    console.error('[Revalidate] error', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
