import type {
  DemoCourse,
  DemoCourseProgressRecord,
  DemoLearningState,
  DemoLesson,
} from '../types/coursePlayer';
import type { Locale } from '../types/program';

export function createEmptyDemoLearningState(): DemoLearningState {
  return {
    enrolledDemoCourseIds: [],
    progress: {},
  };
}

/** Flatten the course curriculum into an ordered lesson list. */
export function getDemoLessons(course: DemoCourse): DemoLesson[] {
  return course.sections.flatMap((section) => section.lessons);
}

export function getDemoCourseStats(course: DemoCourse): {
  totalLessons: number;
  totalMinutes: number;
} {
  const lessons = getDemoLessons(course);
  return {
    totalLessons: lessons.length,
    totalMinutes: lessons.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  };
}

export function getDemoCourseProgress(
  state: DemoLearningState,
  courseId: string
): DemoCourseProgressRecord | undefined {
  return state.progress[courseId];
}

export function isDemoCourseEnrolled(state: DemoLearningState, courseId: string): boolean {
  return state.enrolledDemoCourseIds.includes(courseId);
}

export function isDemoLessonCompleted(
  record: DemoCourseProgressRecord | undefined,
  lessonId: string
): boolean {
  return Boolean(record?.completedLessonIds.includes(lessonId));
}

/** Progress percentage for a demo course (0–100). */
export function computeDemoCourseProgressPct(
  course: DemoCourse,
  record: DemoCourseProgressRecord | undefined
): number {
  const lessons = getDemoLessons(course);
  const totalLessons = lessons.length;
  if (totalLessons <= 0) return 0;
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const completed = (record?.completedLessonIds ?? []).filter((lessonId) =>
    lessonIds.has(lessonId)
  ).length;
  return Math.round((completed / totalLessons) * 100);
}

export function countCompletedDemoLessons(
  course: DemoCourse,
  record: DemoCourseProgressRecord | undefined
): number {
  const lessonIds = new Set(getDemoLessons(course).map((lesson) => lesson.id));
  return (record?.completedLessonIds ?? []).filter((lessonId) => lessonIds.has(lessonId)).length;
}

/** 1-based position of a lesson within the whole course, or null when missing. */
export function getDemoLessonPosition(
  course: DemoCourse,
  lessonId: string
): { index: number; total: number } | null {
  const lessons = getDemoLessons(course);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return null;
  return { index: index + 1, total: lessons.length };
}

export function getDemoAdjacentLessons(
  course: DemoCourse,
  lessonId: string
): { previous: DemoLesson | null; next: DemoLesson | null } {
  const lessons = getDemoLessons(course);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index < lessons.length - 1 ? lessons[index + 1] : null,
  };
}

/**
 * Resolve the lesson to open when entering a course:
 * the last opened lesson if it still exists, otherwise the first
 * incomplete lesson, otherwise the first lesson.
 */
export function resolveDemoStartLesson(
  course: DemoCourse,
  record: DemoCourseProgressRecord | undefined
): DemoLesson {
  const lessons = getDemoLessons(course);
  if (lessons.length === 0) {
    throw new Error(`Demo course ${course.id} has no lessons`);
  }
  if (record?.lastLessonId) {
    const last = lessons.find((lesson) => lesson.id === record.lastLessonId);
    if (last) return last;
  }
  return lessons.find((lesson) => !record?.completedLessonIds.includes(lesson.id)) ?? lessons[0];
}

/** Simulated enrollment — demo only, never touches real enrollment data. */
export function enrollDemoCourseState(
  state: DemoLearningState,
  courseId: string,
  nowIso: string = new Date().toISOString()
): DemoLearningState {
  if (state.enrolledDemoCourseIds.includes(courseId)) {
    return state;
  }
  return {
    ...state,
    enrolledDemoCourseIds: [...state.enrolledDemoCourseIds, courseId],
    progress: {
      ...state.progress,
      [courseId]: state.progress[courseId] ?? {
        courseId,
        completedLessonIds: [],
        lastLessonId: null,
        updatedAt: nowIso,
      },
    },
  };
}

/**
 * Toggle completion for a single lesson. Uses set semantics so the same
 * lesson can never be counted more than once.
 */
export function toggleDemoLessonState(
  state: DemoLearningState,
  courseId: string,
  lessonId: string,
  nowIso: string = new Date().toISOString()
): DemoLearningState {
  const baseRecord: DemoCourseProgressRecord = state.progress[courseId] ?? {
    courseId,
    completedLessonIds: [],
    lastLessonId: lessonId,
    updatedAt: nowIso,
  };

  const isCompleted = baseRecord.completedLessonIds.includes(lessonId);
  const nextCompleted = isCompleted
    ? baseRecord.completedLessonIds.filter((id) => id !== lessonId)
    : [...baseRecord.completedLessonIds, lessonId];

  return {
    ...state,
    progress: {
      ...state.progress,
      [courseId]: {
        ...baseRecord,
        completedLessonIds: nextCompleted,
        lastLessonId: baseRecord.lastLessonId ?? lessonId,
        updatedAt: nowIso,
      },
    },
  };
}

/** Persist the resume point when the student opens a lesson. */
export function setDemoLastLessonState(
  state: DemoLearningState,
  courseId: string,
  lessonId: string,
  nowIso: string = new Date().toISOString()
): DemoLearningState {
  const baseRecord: DemoCourseProgressRecord = state.progress[courseId] ?? {
    courseId,
    completedLessonIds: [],
    lastLessonId: lessonId,
    updatedAt: nowIso,
  };

  if (baseRecord.lastLessonId === lessonId) {
    return state;
  }

  return {
    ...state,
    progress: {
      ...state.progress,
      [courseId]: {
        ...baseRecord,
        lastLessonId: lessonId,
        updatedAt: nowIso,
      },
    },
  };
}

/** "5 دقائق" / "5 min" with light Arabic pluralization. */
export function formatDemoLessonDuration(minutes: number, locale: Locale): string {
  const safe = Math.max(0, Math.round(minutes));
  if (locale === 'en') {
    return `${safe} min`;
  }
  if (safe === 1) return 'دقيقة واحدة';
  if (safe === 2) return 'دقيقتان';
  if (safe <= 10) return `${safe} دقائق`;
  return `${safe} دقيقة`;
}

/** Compact total-duration label, e.g. "1 س 5 د" / "1h 5m". */
export function formatDemoTotalDuration(minutes: number, locale: Locale): string {
  const safe = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safe / 60);
  const rest = safe % 60;
  if (locale === 'en') {
    return hours > 0 ? `${hours}h ${rest}m` : `${rest}m`;
  }
  return hours > 0 ? `${hours} س ${rest} د` : `${rest} د`;
}
