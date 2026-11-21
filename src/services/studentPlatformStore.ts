import type { StudentPlatformState } from '../types/student';
import { createEmptyStudentState } from '../utils/studentPlatform';

const STORAGE_KEY = 'madar_student_platform_v1';

export function loadStudentPlatformState(): StudentPlatformState {
  const fallback = createEmptyStudentState();
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<StudentPlatformState>;
    return {
      account: {
        ...fallback.account,
        ...(parsed.account ?? {}),
      },
      preferences: {
        ...fallback.preferences,
        ...(parsed.preferences ?? {}),
      },
      enrollments: parsed.enrollments ?? {},
      savedCourseIds: Array.isArray(parsed.savedCourseIds) ? parsed.savedCourseIds : [],
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      projectProgress: parsed.projectProgress ?? {},
      joinedGroupIds: Array.isArray(parsed.joinedGroupIds) ? parsed.joinedGroupIds : [],
      selfCheckDoneIds: Array.isArray(parsed.selfCheckDoneIds) ? parsed.selfCheckDoneIds : [],
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
    };
  } catch {
    return fallback;
  }
}

export function saveStudentPlatformState(state: StudentPlatformState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota / privacy mode failures
  }
}
