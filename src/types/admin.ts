import type { DemoLesson } from './coursePlayer';

/**
 * Demo Admin Dashboard types.
 * Everything here is mock-data oriented (localStorage only) and intentionally
 * separate from the real platform models so it can be wired to a backend later.
 */

export type AdminSectionId =
  | 'overview'
  | 'courses'
  | 'categories'
  | 'users'
  | 'companies'
  | 'enrollments'
  | 'exams';

export type AdminUserRole = 'admin' | 'instructor' | 'student';

export type AdminAccountStatus = 'active' | 'inactive';

export type AdminCourseStatus = 'draft' | 'published';

export type AdminCourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type AdminEnrollmentStatus = 'active' | 'completed';

export interface AdminCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  /** Emoji used as the category icon (demo only). */
  icon: string;
}

export interface AdminLesson extends DemoLesson {
  /** Previewable lessons are watchable before enrollment (demo flag). */
  isPreview: boolean;
}

export interface AdminSection {
  id: string;
  titleAr: string;
  titleEn: string;
  lessons: AdminLesson[];
}

export interface AdminCourse {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  instructorId: string;
  categoryId: string | null;
  /** Demo price (never a real payment). */
  price: number;
  level: AdminCourseLevel;
  status: AdminCourseStatus;
  sections: AdminSection[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminAccountStatus;
  registeredAt: string;
  /** Company association — omit for independent students. A student belongs to at most one company. */
  companyId?: string;
  /** Optional phone number (used by company-created student accounts). */
  phone?: string;
  /** Demo-only credentials (never a real secret) — assigned by the company/admin. */
  password?: string;
}

/**
 * Demo company account. Created and managed exclusively by the admin; the
 * company signs in with the assigned credentials and manages only its own
 * students. Kept separate from AdminUser so roles stay explicit.
 */
export interface AdminCompany {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  /** Demo-only credentials (never a real secret) — assigned by the admin. */
  password: string;
  status: AdminAccountStatus;
  createdAt: string;
}

export interface AdminEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: AdminEnrollmentStatus;
  progressPct: number;
  enrolledAt: string;
  /** Company attribution — set when a company purchased/assigned the course. */
  companyId?: string;
  /** Demo course price captured at purchase time (company purchase flow). */
  priceAtPurchase?: number;
  /** Purchase timestamp for company purchases (mirrors enrolledAt). */
  purchasedAt?: string;
  /** How the enrollment was created — kept explicit for future backend integration. */
  source?: 'admin' | 'company-purchase';
}

export interface AdminDataState {
  courses: AdminCourse[];
  users: AdminUser[];
  companies: AdminCompany[];
  enrollments: AdminEnrollment[];
  categories: AdminCategory[];
  exams: AdminExam[];
}

/* ---------- Exams (demo question bank & exam builder) ---------- */

export type AdminExamStatus = 'draft' | 'published';

export type AdminQuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface AdminQuestionOption {
  id: string;
  textAr: string;
  textEn: string;
}

export interface AdminQuestion {
  id: string;
  type: AdminQuestionType;
  textAr: string;
  textEn: string;
  /** Answer options — multiple choice only (empty for other types). */
  options: AdminQuestionOption[];
  /** Correct option id — multiple choice only. */
  correctOptionId: string | null;
  /** Correct answer — true/false only. */
  correctTrueFalse: boolean;
  /** Expected answer / grading guidance — short answer only. */
  expectedAnswerAr: string;
  expectedAnswerEn: string;
  /** Optional illustrative image URL (demo only). */
  image?: string;
  marks: number;
}

export interface AdminExam {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  courseId: string;
  /** Denormalized course title so demo exams stay readable even if the course is removed. */
  courseTitleAr: string;
  courseTitleEn: string;
  /** Optional section/lesson association (free-form demo labels). */
  sectionTitleAr: string;
  sectionTitleEn: string;
  durationMinutes: number;
  /** Passing threshold as a percentage of total marks. */
  passingPct: number;
  maxAttempts: number;
  /** Availability window (ISO strings, null = always available). */
  availableFrom: string | null;
  availableTo: string | null;
  /** Whether students can see correct answers after submitting. */
  showCorrectAnswers: boolean;
  instructionsAr: string;
  instructionsEn: string;
  status: AdminExamStatus;
  questions: AdminQuestion[];
  createdAt: string;
  updatedAt: string;
}

/** A demo student attempt on an exam (mock only, localStorage). */
export interface AdminExamAttempt {
  id: string;
  examId: string;
  courseId: string;
  /** Owning demo student (admin user id) — omitted for the unattributed local student. */
  studentId?: string;
  startedAt: string;
  submittedAt: string | null;
  /** questionId -> answer (option id for MC, boolean for TF, text for short answer). */
  answers: Record<string, string | boolean>;
  earnedMarks: number | null;
  totalMarks: number | null;
  scorePct: number | null;
  passed: boolean | null;
}
