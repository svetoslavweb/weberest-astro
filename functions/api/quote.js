import {
  buildPhpBody,
  forwardQuoteToPhp,
  payloadFromPhpPost,
  parseUrlencodedBody,
} from '../../scripts/forward-quote-to-php.mjs';

const PHP_URL = 'https://www.weberest.com/bg/scripts/contact-form.php';

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();

    if (payload.companyWebsite || payload.domain) {
      return Response.json({ ok: true });
    }

    const turnstileSecret = context.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && payload.turnstileToken) {
      const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: payload.turnstileToken,
        }),
      });
      const result = await verify.json();
      if (!result.success) {
        return Response.json({ error: 'Turnstile verification failed' }, { status: 403 });
      }
    }

    const required = ['service', 'name', 'email', 'phone', 'consent'];
    for (const field of required) {
      if (!payload[field]) {
        return Response.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const phpUrl = context.env.FORM_PHP_URL || PHP_URL;
    const result = await forwardQuoteToPhp(
      { ...payload, referer: payload.referer || context.request.headers.get('referer') },
      phpUrl,
    );

    if (!result.ok) {
      return Response.json({ error: 'Mail handler failed' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export { buildPhpBody, payloadFromPhpPost, parseUrlencodedBody };
