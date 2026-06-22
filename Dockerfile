FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS dev

COPY . .

EXPOSE 4321

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4321"]

FROM deps AS build

COPY . .

ARG PUBLIC_GTM_ID=""
ARG PUBLIC_GA4_ID=""
ARG PUBLIC_CLARITY_ID=""
ARG PUBLIC_META_PIXEL_ID=""
ARG PUBLIC_TURNSTILE_SITE_KEY=""
ARG PUBLIC_GOOGLE_MAPS_EMBED_URL=""
ARG PUBLIC_GOOGLE_SITE_VERIFICATION=""
ARG PUBLIC_FORM_ACTION_URL="/bg/scripts/contact-form.php"
ARG PUBLIC_FORM_API_URL="/bg/api/quote/"

ENV PUBLIC_GTM_ID=$PUBLIC_GTM_ID \
    PUBLIC_GA4_ID=$PUBLIC_GA4_ID \
    PUBLIC_CLARITY_ID=$PUBLIC_CLARITY_ID \
    PUBLIC_META_PIXEL_ID=$PUBLIC_META_PIXEL_ID \
    PUBLIC_TURNSTILE_SITE_KEY=$PUBLIC_TURNSTILE_SITE_KEY \
    PUBLIC_GOOGLE_MAPS_EMBED_URL=$PUBLIC_GOOGLE_MAPS_EMBED_URL \
    PUBLIC_GOOGLE_SITE_VERIFICATION=$PUBLIC_GOOGLE_SITE_VERIFICATION \
    PUBLIC_FORM_ACTION_URL=$PUBLIC_FORM_ACTION_URL \
    PUBLIC_FORM_API_URL=$PUBLIC_FORM_API_URL

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html/bg

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
