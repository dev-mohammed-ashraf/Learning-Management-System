import type { DemoLearningState } from '../types/coursePlayer';

const STORAGE_KEY = 'madar_demo_learning_v1';

export function createEmptyDemoLearningState(): DemoLearningState {
  return {
    enrolledDemoCourseIds: [],
    progress: {},
  };
}

export function loadDemoLearningState(): DemoLearningState {
  const fallback = createEmptyDemoLearningState();
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<DemoLearningState>;
    return {
      enrolledDemoCourseIds: Array.isArray(parsed.enrolledDemoCourseIds)
        ? parsed.enrolledDemoCourseIds
        : [],
      progress: parsed.progress ?? {},
    };
  } catch {
    return fallback;
  }
}

export function saveDemoLearningState(state: DemoLearningState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota / privacy mode failures
  }
}
