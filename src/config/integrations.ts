export const integrationsConfig = {
  gtmId: import.meta.env.PUBLIC_GTM_ID ?? '',
  ga4Id: import.meta.env.PUBLIC_GA4_ID ?? '',
  clarityId: import.meta.env.PUBLIC_CLARITY_ID ?? '',
  metaPixelId: import.meta.env.PUBLIC_META_PIXEL_ID ?? '',
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '',
  googleSiteVerification: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  googleMapsEmbedUrl: import.meta.env.PUBLIC_GOOGLE_MAPS_EMBED_URL ?? '',
  formActionUrl: import.meta.env.PUBLIC_FORM_ACTION_URL ?? '/bg/scripts/contact-form.php',
  formApiUrl: import.meta.env.PUBLIC_FORM_API_URL ?? '/bg/api/quote/',
  formWebhookUrl: import.meta.env.FORM_WEBHOOK_URL ?? '',
  formNotifyEmail: import.meta.env.FORM_NOTIFY_EMAIL ?? 'info@weberest.com',
} as const;

export const isTrackingEnabled = () =>
  Boolean(integrationsConfig.gtmId || integrationsConfig.ga4Id || integrationsConfig.metaPixelId);
