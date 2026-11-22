/**
 * Demo course player types.
 *
 * These models describe the demo-only course learning experience (mock data,
 * localStorage progress) and are intentionally separate from the accredited
 * `Program` catalog so the demo never touches real enrollment data.
 */

export interface DemoLesson {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  /** Lesson duration in minutes (used for the sidebar + totals). */
  durationMinutes: number;
  /** Publicly accessible sample video (demo only — no copyrighted media). */
  videoUrl: string;
}

export interface DemoCourseSection {
  id: string;
  titleAr: string;
  titleEn: string;
  lessons: DemoLesson[];
}

export interface DemoCourseInstructor {
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
}

export interface DemoCourse {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  instructor: DemoCourseInstructor;
  /** Local asset path reused from the existing Madaar image library. */
  image: string;
  levelAr: string;
  levelEn: string;
  sections: DemoCourseSection[];
}

export interface DemoCourseProgressRecord {
  courseId: string;
  /** Deduplicated completed lesson ids (a lesson can never count twice). */
  completedLessonIds: string[];
  /** Last lesson the student opened (resume point). */
  lastLessonId: string | null;
  updatedAt: string;
}

export interface DemoLearningState {
  enrolledDemoCourseIds: string[];
  progress: Record<string, DemoCourseProgressRecord>;
}
