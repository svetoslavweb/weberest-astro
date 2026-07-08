import { renderSitemapIndex } from '@utils/sitemap';

export const prerender = true;

export function GET() {
  return new Response(renderSitemapIndex(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
