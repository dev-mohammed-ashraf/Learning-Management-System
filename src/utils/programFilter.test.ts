import test from 'node:test';
import assert from 'node:assert/strict';
import { PROGRAMS } from '../data/programs';
import {
  filterPrograms,
  normalizeArabicSearch,
  paginatePrograms,
  splitTwoToneTitle,
} from './programFilter';

test('normalizeArabicSearch strips diacritics and unifies alef forms', () => {
  assert.equal(normalizeArabicSearch('إدارة الأعمال'), 'اداره الاعمال');
  assert.equal(normalizeArabicSearch('تصفّح'), 'تصفح');
});

test('filterPrograms returns all 7 diplomas by default', () => {
  const result = filterPrograms(PROGRAMS, { kind: 'diplomas', search: '', type: '' });
  assert.equal(result.length, 7);
});

test('filterPrograms filters fellowships as empty (coming soon)', () => {
  const result = filterPrograms(PROGRAMS, { kind: 'fellowships', search: '', type: '' });
  assert.equal(result.length, 0);
});

test('filterPrograms matches Arabic search queries regardless of hamza', () => {
  const result = filterPrograms(PROGRAMS, {
    kind: 'diplomas',
    search: 'ادارة الاعمال',
    type: '',
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, '5');
});

test('filterPrograms matches English search queries', () => {
  const result = filterPrograms(PROGRAMS, {
    kind: 'diplomas',
    search: 'security',
    type: '',
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, '7');
});

test('paginatePrograms returns 6 items on page 1 and 1 item on page 2', () => {
  const diplomas = filterPrograms(PROGRAMS, { kind: 'diplomas', search: '', type: '' });
  const page1 = paginatePrograms(diplomas, 1, 6);
  const page2 = paginatePrograms(diplomas, 2, 6);
  assert.equal(page1.items.length, 6);
  assert.equal(page1.totalPages, 2);
  assert.equal(page1.currentPage, 1);
  assert.equal(page2.items.length, 1);
  assert.equal(page2.items[0].id, '8');
  assert.equal(page2.currentPage, 2);
});

test('splitTwoToneTitle splits hero and journey headings like the reference headings', () => {
  assert.deepEqual(splitTwoToneTitle('برامج الدبلومات'), {
    lead: 'برامج',
    tail: 'الدبلومات',
  });
  assert.deepEqual(splitTwoToneTitle('أربع خطوات لتقديم طلبك'), {
    lead: 'أربع خطوات لتقديم',
    tail: 'طلبك',
  });
});
