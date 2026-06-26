import { businessHours } from '@config/business-hours';

export interface BusinessHoursStatus {
  isOpen: boolean;
  badgeLabel: 'Отворено' | 'Затворено';
  detailLabel: string;
}

const DAY_NAMES_BG = [
  'неделя',
  'понеделник',
  'вторник',
  'сряда',
  'четвъртък',
  'петък',
  'събота',
] as const;

function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function getDayInZone(date: Date, timeZone: string): number {
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(date);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[weekday] ?? 0;
}

function getMinutesInZone(date: Date, timeZone: string): number {
  const formatted = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  const [hours, minutes] = formatted.split(':').map(Number);
  return hours * 60 + minutes;
}

function isWeekday(day: number): boolean {
  return (businessHours.weekdays as readonly number[]).includes(day);
}

function nextOpenDetail(now: Date, timeZone: string): string {
  const day = getDayInZone(now, timeZone);
  const minutes = getMinutesInZone(now, timeZone);
  const openMinutes = parseTime(businessHours.open);

  if (isWeekday(day) && minutes < openMinutes) {
    return `Отваря в ${businessHours.open}`;
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = (day + offset) % 7;
    if (!isWeekday(nextDay)) continue;

    if (offset === 1) {
      return `Отваря утре в ${businessHours.open}`;
    }

    return `Отваря в ${DAY_NAMES_BG[nextDay]} в ${businessHours.open}`;
  }

  return `Отваря в понеделник в ${businessHours.open}`;
}

export function getBusinessHoursStatus(
  now = new Date(),
  timeZone = businessHours.timezone,
): BusinessHoursStatus {
  const day = getDayInZone(now, timeZone);
  const minutes = getMinutesInZone(now, timeZone);
  const openMinutes = parseTime(businessHours.open);
  const closeMinutes = parseTime(businessHours.close);
  const isOpen = isWeekday(day) && minutes >= openMinutes && minutes < closeMinutes;

  if (isOpen) {
    return {
      isOpen: true,
      badgeLabel: 'Отворено',
      detailLabel: `Затваря в ${businessHours.close}`,
    };
  }

  return {
    isOpen: false,
    badgeLabel: 'Затворено',
    detailLabel: nextOpenDetail(now, timeZone),
  };
}
