export const businessHours = {
  timezone: 'Europe/Sofia',
  /** Пон – Пет */
  weekdays: [1, 2, 3, 4, 5] as const,
  open: '09:00',
  close: '17:00',
  label: 'Пон – Пет, 09:00 – 17:00',
} as const;
