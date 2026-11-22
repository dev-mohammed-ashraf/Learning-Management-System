import type { AdminDataState } from '../types/admin';
import { createDefaultAdminState } from '../data/adminData';
import { ensureDemoCompanyAccount } from '../utils/adminData';

const STORAGE_KEY = 'madar_admin_demo_v1';

export function loadAdminDataState(): AdminDataState {
  const fallback = createDefaultAdminState();
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<AdminDataState>;
    // Companies were added later — merge the seed for older stored states, then
    // guarantee the demo company account keeps its canonical login credentials
    // so the /dashboard/login demo flow can never be broken by a stale snapshot.
    return ensureDemoCompanyAccount({
      courses: Array.isArray(parsed.courses) ? parsed.courses : fallback.courses,
      users: Array.isArray(parsed.users) ? parsed.users : fallback.users,
      companies: Array.isArray(parsed.companies) ? parsed.companies : fallback.companies,
      enrollments: Array.isArray(parsed.enrollments) ? parsed.enrollments : fallback.enrollments,
      categories: Array.isArray(parsed.categories) ? parsed.categories : fallback.categories,
      exams: Array.isArray(parsed.exams) ? parsed.exams : fallback.exams,
    });
  } catch {
    return fallback;
  }
}

export function saveAdminDataState(state: AdminDataState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota / privacy mode failures
  }
}
