import type { Locale } from '../types/program';

const HIJRI_MONTHS_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

const HIJRI_MONTHS_EN = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Ula',
  'Jumada al-Akhirah',
  'Rajab',
  'Shaban',
  'Ramadan',
  'Shawwal',
  'Dhul Qadah',
  'Dhul Hijjah',
];

const WEEKDAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Converts a Riyadh local Gregorian date (year, month 1..12, day) to Umm al-Qura / Kuwaiti Hijri date.
 * Calibrated against Saudi government portal output (2026-11-19 = Thursday 9 Jumada al-Akhirah 1448 AH).
 */
export function gregorianToHijri(gYear: number, gMonth: number, gDay: number): {
  year: number;
  month: number;
  day: number;
} {
  let m = gMonth;
  let y = gYear;
  if (m < 3) {
    y -= 1;
    m += 12;
  }
  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (gDay > 4) b = -10;
    }
  }

  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    gDay +
    b -
    1524;

  const iYear = 10631 / 30;
  const epochAstro = 1948084;
  const shift1 = 8.01 / 60;

  let z = jd - epochAstro;
  const cyc = Math.floor(z / 10631);
  z = z - 10631 * cyc;
  const j = Math.floor((z - shift1) / iYear);
  const hYear = 30 * cyc + j;
  z = z - Math.floor(j * iYear + shift1);
  let hMonth = Math.floor((z + 28.5001) / 29.5);
  if (hMonth === 13) hMonth = 12;
  const hDay = z - Math.floor(29.5001 * hMonth - 29);

  return { year: hYear, month: hMonth, day: hDay };
}

export function getRiyadhDateParts(date: Date): {
  year: number;
  month: number;
  day: number;
  weekdayIndex: number;
} {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';
  const year = Number(get('year'));
  const month = Number(get('month'));
  const day = Number(get('day'));
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const weekdayIndex = weekdayMap[get('weekday')] ?? 0;

  return { year, month, day, weekdayIndex };
}

export function formatSaudiHijriDateTime(
  date: Date,
  locale: Locale
): { dateStr: string; timeStr: string } {
  const { year, month, day, weekdayIndex } = getRiyadhDateParts(date);
  const hijri = gregorianToHijri(year, month, day);

  const dateStr =
    locale === 'ar'
      ? `${WEEKDAYS_AR[weekdayIndex]} ${hijri.day} ${HIJRI_MONTHS_AR[hijri.month - 1]} ${hijri.year}هـ`
      : `${WEEKDAYS_EN[weekdayIndex]}, ${hijri.day} ${HIJRI_MONTHS_EN[hijri.month - 1]} ${hijri.year} AH`;

  const timeFmt = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Riyadh',
  });

  return {
    dateStr,
    timeStr: timeFmt.format(date),
  };
}
