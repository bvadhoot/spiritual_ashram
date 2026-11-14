export type Language = "en" | "te";

export type PanchangSource = "prokerala" | "calculated";

export type Paksha = "Shukla" | "Krishna";

export interface TithiInfo {
  number: number;
  name: string;
  nameTe: string;
  paksha: Paksha;
  pakshaTe: string;
}

export interface NakshatraInfo {
  name: string;
  nameTe: string;
  pada: number;
}

export interface RashiInfo {
  name: string;
  nameTe: string;
  index: number;
}

export interface PanchangDay {
  date: string;
  tithi: TithiInfo;
  nakshatra: NakshatraInfo;
  rashi: RashiInfo;
  moonRashi: RashiInfo;
  rahuKalam: string;
  abhijit: string;
  sunrise: string;
  sunset: string;
  source: PanchangSource;
}

export interface Festival {
  id: string;
  date: string;
  endDate?: string;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  category: string;
  major: boolean;
}

export interface CalendarEvent {
  id: string;
  date: string;
  endDate?: string;
  title: string;
  location: string;
  description: string;
  category: string;
}

export interface CalendarDay extends PanchangDay {
  festivals: Festival[];
  events: CalendarEvent[];
  isToday: boolean;
}

export interface MonthCalendar {
  year: number;
  month: number;
  monthKey: string;
  today: string;
  days: CalendarDay[];
  festivals: Festival[];
}
