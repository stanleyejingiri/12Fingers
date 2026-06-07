//src/types/config.ts
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimeRange {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

export interface CountryInfo {
  code: string;
  name: string;
}

export interface AppConfig {
  enabledDays: DayOfWeek[];
  timeRanges: TimeRange[];
  country: CountryInfo | null;
}

export const DEFAULT_CONFIG: AppConfig = {
  enabledDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  timeRanges: [{ start: '08:00', end: '17:00' }],
  country: null   // 🔴 no default country
};