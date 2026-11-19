import test from 'node:test';
import assert from 'node:assert/strict';
import { PROGRAMS } from '../data/programs';
import { searchPortalSuggestions } from './headerSearch';

test('searchPortalSuggestions returns empty lists for blank query', () => {
  const res = searchPortalSuggestions('   ', PROGRAMS, 'ar');
  assert.equal(res.programs.length, 0);
  assert.equal(res.services.length, 0);
});

test('searchPortalSuggestions matches Arabic program queries with normalization', () => {
  const res = searchPortalSuggestions('ادارة', PROGRAMS, 'ar');
  assert.ok(res.programs.length >= 3);
  assert.ok(res.programs.some((p) => p.titleAr.includes('إدارة الأعمال')));
});

test('searchPortalSuggestions matches English program queries', () => {
  const res = searchPortalSuggestions('logistics', PROGRAMS, 'en');
  assert.equal(res.programs.length, 1);
  assert.equal(res.programs[0].titleEn.includes('Logistics'), true);
});

test('searchPortalSuggestions matches portal services cleanly', () => {
  const res = searchPortalSuggestions('بوابة', PROGRAMS, 'ar');
  assert.ok(res.services.some((s) => s.id === 'lms'));
});
