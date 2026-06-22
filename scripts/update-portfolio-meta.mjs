#!/usr/bin/env node
/**
 * Update portfolio categories and hero descriptions per project niche.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORTFOLIO_DIR = path.join(__dirname, '../src/content/portfolio');

/** wpId → { categories, description } */
const PROJECT_META = {
  10220: {
    categories: ['firmeni-web-saitove'],
    description:
      'Фирмен сайт на вносител на професионални металорежещи инструменти — каталог, B2B представяне и доверие, изградено за над 30 години опит на пазара.',
  },
  10202: {
    categories: ['online-magazini'],
    description:
      'Онлайн аптека с продуктов каталог, поръчки и удобна навигация по категории здравни и козметични продукти.',
  },
  10198: {
    categories: ['online-magazini'],
    description:
      'Онлайн бутик за дамски дрехи и аксесоари с каталог, стилове за всеки повод, поръчки и доставка с Еконт.',
  },
  10218: {
    categories: ['firmeni-web-saitove', 'online-magazini'],
    description:
      'Сайт на автодилър и сервиз с представяне на марки, автомобили, сервизни услуги и онлайн каталог за авточасти.',
  },
  10178: {
    categories: ['firmeni-web-saitove'],
    description:
      'Фирмен сайт на производител на PVC и AL дограма и стъклопакети — продукти, проекти и запитвания от клиенти.',
  },
  10206: {
    categories: ['online-magazini'],
    description:
      'Онлайн магазин за дърва, въглища и отоплителни материали с доставка, цени и поръчки за дома и бизнеса.',
  },
  10166: {
    categories: ['online-magazini', 'mnogoezichnost'],
    description:
      'Мултиезичен онлайн магазин за велосипеди и спортна екипировка на български, румънски и немски език.',
  },
  10194: {
    categories: ['firmeni-web-saitove'],
    description:
      'Официален сайт на община Елена — публична информация, услуги за граждани, новини и административни ресурси.',
  },
  10543: {
    categories: ['firmeni-web-saitove'],
    description:
      'Корпоративен сайт на производител на опаковъчни материали и решения — продукти, индустрии и B2B запитвания.',
  },
  10200: {
    categories: ['online-magazini'],
    description:
      'E-commerce каталог за барбекюта, пещи, градински чешми и огнеупорни изделия с онлайн поръчки и доставка.',
  },
  10176: {
    categories: ['hotelski-saitove', 'mnogoezichnost'],
    description:
      'Хотелски сайт с представяне на стаи, удобства и резервации на български и английски език във Видин.',
  },
  10611: {
    categories: ['saitove-nedvijimi-imoti'],
    description:
      'Уеб платформа за агенция за недвижими имоти с обяви, филтри, търсене и профили на имоти за продажба и наем.',
  },
  10188: {
    categories: ['firmeni-web-saitove'],
    description:
      'Сайт на бизнес инкубатор и стартиращи компании — програми, менторство, събития и ресурси за предприемачи.',
  },
  10214: {
    categories: ['firmeni-web-saitove'],
    description:
      'Фирмен сайт на рекламна агенция с портфолио, услуги по брандинг, печат и дигитален маркетинг.',
  },
  10182: {
    categories: ['ресторанти'],
    description:
      'Сайт на ресторант „Кралска закуска“ с меню, атмосфера, локация и информация за заведението в Русе.',
  },
  10184: {
    categories: ['училища'],
    description:
      'Уеб сайт на частно училище „Леонардо да Винчи“ — прием, програми, екип и комуникация с родители.',
  },
  10186: {
    categories: ['firmeni-web-saitove'],
    description:
      'Фирмен сайт на строителна компания от Русе — услуги, реализирани обекти, сертификати и контакти.',
  },
  10541: {
    categories: ['online-magazini'],
    description:
      'Онлайн магазин за дамски обувки с богат каталог, марки и модели за всекидневен и елегантен стил.',
  },
  10192: {
    categories: ['firmeni-web-saitove'],
    description:
      'Сайт на компания за подови настилки и интериорни решения — продукти, проекти и запитвания от клиенти.',
  },
  10204: {
    categories: ['online-magazini'],
    description:
      'Онлайн магазин за системи за обратна осмоза, филтриране на вода и резервни части с продуктов каталог.',
  },
  10212: {
    categories: ['училища'],
    description:
      'Официален сайт на ОУ „Христо Смирненски“ — новини, документи, прием и информация за учебния процес.',
  },
  10550: {
    categories: ['online-magazini'],
    description:
      'Онлайн магазин за хранителни добавки, витамини и здравословни продукти с каталог и доставка.',
  },
  10222: {
    categories: ['saitove-nedvijimi-imoti'],
    description:
      'Уеб платформа за обяви за имоти с търсене, филтри, карти и инструменти за агенции и частни продавачи.',
  },
  10540: {
    categories: ['firmeni-web-saitove'],
    description:
      'Фирмен сайт на специалисти по покривни системи, улуци и фасадни решения — услуги, проекти и оферти.',
  },
  10216: {
    categories: ['online-magazini'],
    description:
      'Онлайн магазин за професионални електроинструменти, консумативи и аксесоари с каталог, марки и поръчки.',
  },
  10210: {
    categories: ['online-magazini'],
    description:
      'Онлайн магазин за скейтboard, longboard и streetwear екипировка с богат продуктов каталог и доставка.',
  },
  10162: {
    categories: ['online-magazini', 'mnogoezichnost'],
    description:
      'Мултиезичен онлайн магазин за бельо и трикотаж с голям асортимент, категории и версия на английски език.',
  },
  10168: {
    categories: ['online-magazini'],
    description:
      'E-commerce платформа за спортни лицензи, екипировка и фен merchandise с онлайн поръчки и доставка.',
  },
  10180: {
    categories: ['saitove-nedvijimi-imoti'],
    description:
      'Сайт на агенция за недвижими имоти с обяви за продажба и наем, филтри и представяне на имоти.',
  },
  10544: {
    categories: ['online-magazini'],
    description:
      'Онлайн магазин за риба, морски дарове и свежи продукти с каталог, поръчки и информация за качество.',
  },
  10208: {
    categories: ['firmeni-web-saitove'],
    description:
      'Корпоративен сайт на дистрибутор на вендинг автомати и кафе решения — продукти, услуги и B2B контакти.',
  },
  10542: {
    categories: ['online-magazini'],
    description:
      'Онлайн бутик за официални и сватбени рокли с каталог, колекции и представяне на модели за специални поводи.',
  },
  10174: {
    categories: ['firmeni-web-saitove'],
    description:
      'Фирмен сайт на производител на PVC и AL прозорци, врати и дограма — продукти, проекти и контакти.',
  },
  10164: {
    categories: ['hotelski-saitove', 'mnogoezichnost'],
    description:
      'Хотелски сайт на „Дунав“ във Видин с представяне на стаи, ресторант, резервации и туристическа информация.',
  },
};

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const wpIdMatch = content.match(/^wpId:\s*(\d+)/m);
  if (!wpIdMatch) return { file: path.basename(filePath), status: 'no-wpId' };

  const meta = PROJECT_META[Number(wpIdMatch[1])];
  if (!meta) return { file: path.basename(filePath), status: 'no-meta' };

  const yaml = meta.categories.map((c) => `  - "${c}"`).join('\n');
  if (content.match(/^categories:\n(?:  - "[^"]+"\n)+/m)) {
    content = content.replace(/^categories:\n(?:  - "[^"]+"\n)+/m, `categories:\n${yaml}\n`);
  }

  if (content.match(/^description:\s/m)) {
    content = content.replace(/^description:.*$/m, `description: "${meta.description.replace(/"/g, '\\"')}"`);
  } else {
    content = content.replace(/^(title:.*\n)/m, `$1description: "${meta.description.replace(/"/g, '\\"')}"\n`);
  }

  fs.writeFileSync(filePath, content);
  return { file: path.basename(filePath), status: 'updated' };
}

const files = fs.readdirSync(PORTFOLIO_DIR).filter((f) => f.endsWith('.md'));
const results = files.map((file) => updateFile(path.join(PORTFOLIO_DIR, file)));

console.log(`Updated ${results.filter((r) => r.status === 'updated').length} / ${files.length} files`);
for (const item of results.filter((r) => r.status !== 'updated')) {
  console.warn(`${item.status}: ${item.file}`);
}
