# Weberest Astro

Статичен Astro сайт за [Weberest](https://www.weberest.com/bg/) — без WordPress, с HTML5/CSS3, custom SCSS, SEO и migration pipeline от WordPress SQL dump.

## Изисквания

- Node.js 20+
- npm 10+

## Стартиране

```bash
npm install
npm run migrate
npm run dev
```

## Команди

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev сървър |
| `npm run build` | Production build |
| `npm run migrate` | Миграция от `../weberest_new.sql` → Markdown + `data/wordpress-export.json` |
| `npm run migrate:images` | Копиране на uploads от `../wp-content/uploads` |
| `npm run seo-audit` | SEO title parity check |

## Структура

- `src/content/` — Markdown съдържание (pages, blog, portfolio, services)
- `src/components/` — UI компоненти, SEO, форма, интеграции
- `scripts/migrate-wordpress.mjs` — WordPress SQL → Markdown
- `data/` — redirects, SEO audit, migration report
- `functions/api/quote.js` — Cloudflare Pages form endpoint

## Deploy (Cloudflare Pages)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Environment variables: `PUBLIC_GTM_ID`, `PUBLIC_GA4_ID`, `FORM_WEBHOOK_URL`

## Migration sources

- SQL: `../weberest_new.sql`
- SEO CSV: `page_titles_all.csv` (Desktop)
