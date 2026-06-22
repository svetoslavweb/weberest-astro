import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import {
  forwardQuoteToPhp,
  buildPhpBody,
  parseUrlencodedBody,
  payloadFromPhpPost,
} from './scripts/forward-quote-to-php.mjs';

const PHP_PROXY_TARGET = 'https://www.weberest.com/bg/scripts/contact-form.php';

const PHP_PATHS = new Set(['/bg/scripts/contact-form.php', '/scripts/contact-form.php']);
const API_PATHS = new Set(['/bg/api/quote', '/bg/api/quote/', '/api/quote', '/api/quote/']);

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function formProxyPlugin() {
  return {
    name: 'form-proxy',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? '').split('?')[0];

        if (req.method === 'POST' && PHP_PATHS.has(path)) {
          try {
            const raw = await readRequestBody(req);
            const post = parseUrlencodedBody(raw.toString());
            const payload = payloadFromPhpPost(post);
            const enrichedBody = buildPhpBody({
              ...payload,
              referer: payload.referer || req.headers.referer || 'https://www.weberest.com/bg/zapitanie/',
            }).toString();

            const upstream = await fetch(PHP_PROXY_TARGET, {
              method: 'POST',
              headers: {
                'Content-Type':
                  req.headers['content-type'] ?? 'application/x-www-form-urlencoded; charset=UTF-8',
              },
              body: enrichedBody,
            });
            const html = await upstream.text();
            res.statusCode = upstream.status;
            res.setHeader(
              'Content-Type',
              upstream.headers.get('content-type') ?? 'text/html; charset=UTF-8',
            );
            res.end(html);
          } catch {
            res.statusCode = 502;
            res.end('Proxy error');
          }
          return;
        }

        if (req.method === 'POST' && API_PATHS.has(path)) {
          try {
            const raw = await readRequestBody(req);
            const payload = JSON.parse(raw.toString('utf8'));

            if (payload.companyWebsite || payload.domain) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
              return;
            }

            const required = ['service', 'name', 'email', 'phone', 'consent'];
            for (const field of required) {
              if (!payload[field]) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: `Missing field: ${field}` }));
                return;
              }
            }

            const result = await forwardQuoteToPhp({
              ...payload,
              referer: payload.referer || req.headers.referer,
            });

            res.statusCode = result.ok ? 200 : 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.ok ? { ok: true } : { error: 'Mail handler failed' }));
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid request' }));
          }
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  site: 'https://www.weberest.com',
  base: '/bg',
  trailingSlash: 'always',
  compressHTML: true,
  devToolbar: {
    enabled: false,
  },
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/scripts/'),
    }),
  ],
  vite: {
    plugins: [formProxyPlugin()],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
});
