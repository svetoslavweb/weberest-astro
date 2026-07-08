import { getSitemapUrls, renderUrlset } from '@utils/sitemap';

export const prerender = true;

export async function GET() {
  const urls = await getSitemapUrls();

  return new Response(renderUrlset(urls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
