import { createDefaultAdminState, DEMO_EXAM_ATTEMPTS } from '../data/adminData';
import type { AdminExamAttempt } from '../types/admin';

const STORAGE_KEY = 'madar_demo_exam_attempts_v1';

export function createEmptyStudentExamState(): AdminExamAttempt[] {
  return [];
}

export function loadStudentExamAttempts(): AdminExamAttempt[] {
  if (typeof window === 'undefined') {
    return createEmptyStudentExamState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First run: seed attributed demo attempts (company students included)
      // so dashboards can demonstrate exam results with mock data.
      return [...DEMO_EXAM_ATTEMPTS];
    }
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as AdminExamAttempt[]) : createEmptyStudentExamState();
  } catch {
    return createEmptyStudentExamState();
  }
}

export function saveStudentExamAttempts(attempts: AdminExamAttempt[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  } catch {
    // Ignore storage quota / privacy mode failures
  }
}
