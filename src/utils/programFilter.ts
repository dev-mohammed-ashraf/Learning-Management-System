import type { PaginatedResult, Program, ProgramFilterParams } from '../types/program';

export const PROGRAMS_PER_PAGE = 6;

export function normalizeArabicSearch(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

export function filterPrograms(programs: Program[], params: ProgramFilterParams): Program[] {
  const query = normalizeArabicSearch(params.search);
  const filtered = programs.filter((program) => {
    if (program.kind !== params.kind) {
      return false;
    }
    if (params.type && program.deliveryTypeValue !== params.type) {
      return false;
    }
    if (params.category && program.category !== params.category) {
      return false;
    }
    if (query) {
      const hayAr = normalizeArabicSearch(
        `${program.titleAr} ${program.categoryAr} ${program.descriptionAr}`
      );
      const hayEn = `${program.titleEn} ${program.categoryEn} ${program.descriptionEn}`.toLowerCase();
      if (!hayAr.includes(query) && !hayEn.includes(query)) {
        return false;
      }
    }
    return true;
  });

  if (params.sort === 'title_asc') {
    return [...filtered].sort((a, b) => a.titleAr.localeCompare(b.titleAr, 'ar'));
  }
  if (params.sort === 'title_desc') {
    return [...filtered].sort((a, b) => b.titleAr.localeCompare(a.titleAr, 'ar'));
  }
  return filtered;
}

export function paginatePrograms<T>(
  items: T[],
  page: number,
  perPage: number = PROGRAMS_PER_PAGE
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    totalItems,
    totalPages,
    currentPage: safePage,
  };
}

export function splitTwoToneTitle(title: string): { lead: string; tail: string } {
  const clean = title.trim().replace(/\s+/g, ' ');
  const words = clean.split(' ');
  if (words.length < 2) {
    return { lead: clean, tail: '' };
  }
  const tailCount = words.length >= 5 ? 2 : 1;
  return {
    lead: words.slice(0, -tailCount).join(' '),
    tail: words.slice(-tailCount).join(' '),
  };
}
