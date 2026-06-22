export type BreadcrumbItem = { name: string; url: string };

export const homeCrumb: BreadcrumbItem = { name: 'Начало', url: '/' };

export function buildBreadcrumbs(...items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [homeCrumb, ...items];
}
