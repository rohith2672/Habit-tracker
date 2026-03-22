export type FrequencyPreset = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type DayName =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

const WEEKDAYS: DayName[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const WEEKENDS: DayName[] = ['SATURDAY', 'SUNDAY'];
const ALL_DAYS: DayName[] = [...WEEKDAYS, ...WEEKENDS];

export function frequencyToPreset(frequency: string): FrequencyPreset {
  const f = frequency?.trim().toUpperCase();
  if (!f || f === 'DAILY') return 'daily';
  if (f === WEEKDAYS.join(',')) return 'weekdays';
  if (f === WEEKENDS.join(',')) return 'weekends';
  return 'custom';
}

export function frequencyToDays(frequency: string): DayName[] {
  const f = frequency?.trim().toUpperCase();
  if (!f || f === 'DAILY') return ALL_DAYS;
  return f.split(',').map((d) => d.trim() as DayName).filter(Boolean);
}

export function buildFrequency(preset: FrequencyPreset, customDays: DayName[]): string {
  switch (preset) {
    case 'daily':
      return 'daily';
    case 'weekdays':
      return WEEKDAYS.join(',');
    case 'weekends':
      return WEEKENDS.join(',');
    case 'custom': {
      // Sort by canonical week order
      const ordered = ALL_DAYS.filter((d) => customDays.includes(d));
      return ordered.join(',');
    }
  }
}

export function friendlyFrequency(frequency: string): string {
  const f = frequency?.trim().toUpperCase();
  if (!f || f === 'DAILY') return 'Daily';
  if (f === WEEKDAYS.join(',')) return 'Weekdays';
  if (f === WEEKENDS.join(',')) return 'Weekends';

  const days = f.split(',').map((d) => d.trim());
  const labels: Record<string, string> = {
    MONDAY: 'Mon',
    TUESDAY: 'Tue',
    WEDNESDAY: 'Wed',
    THURSDAY: 'Thu',
    FRIDAY: 'Fri',
    SATURDAY: 'Sat',
    SUNDAY: 'Sun',
  };
  return days.map((d) => labels[d] ?? d).join(', ');
}
