import test from 'node:test';
import assert from 'node:assert/strict';
import { formatSaudiHijriDateTime, gregorianToHijri } from './hijriDate';

test('gregorianToHijri converts 2026-11-19 and 2026-11-20 to Jumada al-Akhirah 1448 AH', () => {
  assert.deepEqual(gregorianToHijri(2026, 11, 19), {
    year: 1448,
    month: 6,
    day: 9,
  });
  assert.deepEqual(gregorianToHijri(2026, 11, 20), {
    year: 1448,
    month: 6,
    day: 10,
  });
});

test('formatSaudiHijriDateTime produces Arabic Hijri string matching government bar', () => {
  const sample = new Date('2026-11-19T21:01:00Z'); // 2026-11-20 00:01 Riyadh
  const { dateStr } = formatSaudiHijriDateTime(sample, 'ar');
  assert.equal(dateStr, 'الجمعة 10 جمادى الآخرة 1448هـ');
});
