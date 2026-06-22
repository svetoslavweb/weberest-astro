const PHP_URL = 'https://www.weberest.com/bg/scripts/contact-form.php';

const SERVICE_TO_PHP = {
  design: 'design',
  marketing: 'seo',
  shop: 'eshop',
  other: 'other',
};

export const SERVICE_LABELS = {
  design: 'Дизайн / Редизайн',
  marketing: 'Google Маркетинг',
  shop: 'Онлайн Магазин',
  other: 'Други услуги',
};

export function detectServiceFromPhpPost(post) {
  if (post.design) return 'design';
  if (post.seo) return 'marketing';
  if (post.eshop) return 'shop';
  if (post.other) return 'other';
  return post.service;
}

export function payloadFromPhpPost(post) {
  const service = detectServiceFromPhpPost(post);

  return {
    referer: post.referer,
    name: post.name,
    email: post.email,
    phone: post.phone,
    currentSite: post.yourSite || post.currentSite,
    competitor: post.competitor,
    additionalInfo: post.projectNotes || post.additionalInfo || post.message,
    service,
    serviceLabel: post.serviceLabel || (service ? SERVICE_LABELS[service] : undefined),
  };
}

export function buildReferer(baseUrl, service, additionalInfo) {
  const notes = [];
  const serviceLabel = service ? SERVICE_LABELS[service] : '';

  if (serviceLabel) {
    notes.push(`Избрана услуга: ${serviceLabel}`);
  }
  if (additionalInfo) {
    notes.push(`Допълнителна информация: ${additionalInfo}`);
  }

  if (!notes.length) return baseUrl || 'https://www.weberest.com/bg/zapitanie/';
  return `${baseUrl || 'https://www.weberest.com/bg/zapitanie/'}\r\r${notes.join('\r')}`;
}

export function buildPhpBody(payload) {
  const params = new URLSearchParams();
  const additionalInfo = String(payload.additionalInfo || payload.message || '').trim();
  const service = payload.service;
  const serviceLabel = payload.serviceLabel || (service ? SERVICE_LABELS[service] : '');

  params.set('action', 'mail');
  params.set('name', payload.name || '');
  params.set('email', payload.email || '');
  params.set('domain', '');
  params.set('referer', buildReferer(payload.referer, service, additionalInfo));

  if (payload.currentSite) params.set('yourSite', payload.currentSite);
  if (payload.competitor) params.set('competitor', payload.competitor);
  if (serviceLabel) params.set('serviceLabel', serviceLabel);

  if (additionalInfo) {
    params.set('projectNotes', additionalInfo);
    params.set('additionalInfo', additionalInfo);
    params.set('message', additionalInfo);
  }

  const phpField = SERVICE_TO_PHP[service];
  if (phpField) params.set(phpField, 'on');

  if (payload.phone) {
    params.set('phone', String(payload.phone).replace(/\D/g, ''));
  }

  return params;
}

export async function forwardQuoteToPhp(payload, phpUrl = PHP_URL) {
  const response = await fetch(phpUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: buildPhpBody(payload),
  });

  const html = await response.text();
  const ok = response.ok && html.includes('изпратена успешно');
  return { ok, status: response.status, html };
}

export function parseUrlencodedBody(raw) {
  return Object.fromEntries(new URLSearchParams(raw));
}
