export const portfolioCategoryLabels: Record<string, string> = {
  'firmeni-web-saitove': 'Фирмени уеб сайтове',
  'hotelski-saitove': 'Хотелски сайтове',
  'internet-marketing': 'Интернет маркетинг',
  'mnogoezichnost': 'Многоезичност',
  'mobilni-saitove': 'Мобилни сайтове',
  'online-magazini': 'Онлайн магазини',
  'saitove-nedvijimi-imoti': 'Сайтове за недвижими имоти',
  ресторанти: 'Ресторанти',
  училища: 'Училища',
};

/** Ред на филтрите като на стария сайт */
export const portfolioCategoryOrder = [
  'internet-marketing',
  'mnogoezichnost',
  'mobilni-saitove',
  'online-magazini',
  'ресторанти',
  'saitove-nedvijimi-imoti',
  'училища',
  'firmeni-web-saitove',
  'hotelski-saitove',
];

export function normalizePortfolioCategory(value: string): string {
  if (!value) return value;

  let normalized = value;
  if (normalized.includes('%')) {
    try {
      normalized = decodeURIComponent(normalized);
    } catch {
      // keep raw value
    }
  }

  return normalized;
}

export function canonicalPortfolioCategory(value: string): string {
  return normalizePortfolioCategory(value);
}

export function getPortfolioCategoryLabel(value: string): string {
  const slug = canonicalPortfolioCategory(value);
  return portfolioCategoryLabels[slug] ?? slug;
}

export function collectPortfolioCategories(categories: string[]): string[] {
  const unique = new Set(categories.map(canonicalPortfolioCategory));
  return portfolioCategoryOrder.filter((slug) => unique.has(slug));
}

export function portfolioItemMatchesCategory(itemCategories: string[] | undefined, activeCategory: string): boolean {
  if (!itemCategories?.length) return false;
  const normalizedActive = canonicalPortfolioCategory(activeCategory);
  return itemCategories.some((category) => canonicalPortfolioCategory(category) === normalizedActive);
}
