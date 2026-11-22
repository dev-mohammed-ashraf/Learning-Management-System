import type {
  AdminAccountStatus,
  AdminCategory,
  AdminCompany,
  AdminCourse,
  AdminCourseLevel,
  AdminCourseStatus,
  AdminDataState,
  AdminExam,
  AdminExamStatus,
  AdminLesson,
  AdminQuestion,
  AdminSection,
  AdminUser,
  AdminUserRole,
} from '../types/admin';
import type { Locale } from '../types/program';
import { ADMIN_COMPANIES, DEMO_COMPANY_ACCOUNT, DEMO_COMPANY_ID } from '../data/adminData';

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function touch(state: AdminDataState, courseId: string, nowIso: string): AdminDataState {
  return {
    ...state,
    courses: state.courses.map((course) =>
      course.id === courseId ? { ...course, updatedAt: nowIso } : course
    ),
  };
}

/* ---------- Derived stats ---------- */

export interface AdminDashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
  totalEnrollments: number;
  publishedCourses: number;
  draftCourses: number;
}

export function computeAdminStats(state: AdminDataState): AdminDashboardStats {
  return {
    totalCourses: state.courses.length,
    totalStudents: state.users.filter((u) => u.role === 'student').length,
    totalInstructors: state.users.filter((u) => u.role === 'instructor').length,
    totalEnrollments: state.enrollments.length,
    publishedCourses: state.courses.filter((c) => c.status === 'published').length,
    draftCourses: state.courses.filter((c) => c.status === 'draft').length,
  };
}

export function getAdminLessons(course: AdminCourse): AdminLesson[] {
  return course.sections.flatMap((section) => section.lessons);
}

export function getAdminCourseStats(course: AdminCourse): {
  sections: number;
  lessons: number;
  totalMinutes: number;
} {
  const lessons = getAdminLessons(course);
  return {
    sections: course.sections.length,
    lessons: lessons.length,
    totalMinutes: lessons.reduce((sum, l) => sum + l.durationMinutes, 0),
  };
}

/** Enrollments per course, sorted by popularity. */
export function getCourseEnrollmentCounts(
  state: AdminDataState
): Array<{ course: AdminCourse; count: number }> {
  return state.courses
    .map((course) => ({
      course,
      count: state.enrollments.filter((e) => e.courseId === course.id).length,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Enrollments grouped by month for the last `months` calendar months. */
export function getMonthlyEnrollmentActivity(
  state: AdminDataState,
  months: number = 6,
  now: Date = new Date()
): Array<{ key: string; label: string; count: number }> {
  const buckets: Array<{ key: string; label: string; count: number }> = [];
  const base = new Date(now.getFullYear(), now.getMonth(), 1);
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en', { month: 'short' }),
      count: 0,
    });
  }
  for (const enrollment of state.enrollments) {
    const date = new Date(enrollment.enrolledAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.count += 1;
  }
  return buckets;
}

/** Enrollments grouped by category (distribution). */
export function getCategoryEnrollmentDistribution(
  state: AdminDataState
): Array<{ category: AdminCategory | null; label: string; count: number }> {
  const byCategory = new Map<string, number>();
  for (const enrollment of state.enrollments) {
    const course = state.courses.find((c) => c.id === enrollment.courseId);
    const categoryId = course?.categoryId ?? 'uncategorized';
    byCategory.set(categoryId, (byCategory.get(categoryId) ?? 0) + 1);
  }
  return state.categories
    .map((category) => ({
      category,
      label: category.nameAr,
      count: byCategory.get(category.id) ?? 0,
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function getCategoryCourseCounts(state: AdminDataState): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const course of state.courses) {
    if (course.categoryId) {
      counts[course.categoryId] = (counts[course.categoryId] ?? 0) + 1;
    }
  }
  return counts;
}

export function countUserEnrollments(state: AdminDataState, userId: string): number {
  return state.enrollments.filter((e) => e.studentId === userId).length;
}

/* ---------- Course CRUD ---------- */

export interface AdminCourseDraftInput {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  instructorId: string;
  categoryId: string | null;
  price: number;
  level: AdminCourseLevel;
  status: AdminCourseStatus;
}

export function createCourseState(
  state: AdminDataState,
  input: AdminCourseDraftInput,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  const course: AdminCourse = {
    ...input,
    id: makeId('course'),
    sections: [],
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  return { ...state, courses: [course, ...state.courses] };
}

export function updateCourseState(
  state: AdminDataState,
  courseId: string,
  patch: Partial<Omit<AdminCourse, 'id' | 'createdAt'>>,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...touch(state, courseId, nowIso),
    courses: state.courses.map((course) =>
      course.id === courseId ? { ...course, ...patch, updatedAt: nowIso } : course
    ),
  };
}

export function deleteCourseState(
  state: AdminDataState,
  courseId: string
): AdminDataState {
  return {
    ...state,
    courses: state.courses.filter((course) => course.id !== courseId),
    enrollments: state.enrollments.filter((enrollment) => enrollment.courseId !== courseId),
  };
}

export function setCourseStatusState(
  state: AdminDataState,
  courseId: string,
  status: AdminCourseStatus,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return updateCourseState(state, courseId, { status }, nowIso);
}

/* ---------- Sections ---------- */

export function addSectionState(
  state: AdminDataState,
  courseId: string,
  titleAr: string,
  titleEn: string,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  const section: AdminSection = { id: makeId('sec'), titleAr, titleEn, lessons: [] };
  return {
    ...touch(state, courseId, nowIso),
    courses: state.courses.map((course) =>
      course.id === courseId
        ? { ...course, sections: [...course.sections, section], updatedAt: nowIso }
        : course
    ),
  };
}

export function updateSectionState(
  state: AdminDataState,
  courseId: string,
  sectionId: string,
  patch: Partial<Pick<AdminSection, 'titleAr' | 'titleEn'>>,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...touch(state, courseId, nowIso),
    courses: state.courses.map((course) =>
      course.id === courseId
        ? {
            ...course,
            sections: course.sections.map((section) =>
              section.id === sectionId ? { ...section, ...patch } : section
            ),
          }
        : course
    ),
  };
}

export function deleteSectionState(
  state: AdminDataState,
  courseId: string,
  sectionId: string,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...touch(state, courseId, nowIso),
    courses: state.courses.map((course) =>
      course.id === courseId
        ? { ...course, sections: course.sections.filter((s) => s.id !== sectionId) }
        : course
    ),
  };
}

export function reorderSectionsState(
  state: AdminDataState,
  courseId: string,
  fromIndex: number,
  toIndex: number,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...touch(state, courseId, nowIso),
    courses: state.courses.map((course) => {
      if (course.id !== courseId) return course;
      const sections = [...course.sections];
      if (
        fromIndex < 0 ||
        fromIndex >= sections.length ||
        toIndex < 0 ||
        toIndex >= sections.length
      ) {
        return course;
      }
      const [moved] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, moved);
      return { ...course, sections };
    }),
  };
}

/* ---------- Lessons ---------- */

export function addLessonState(
  state: AdminDataState,
  courseId: string,
  sectionId: string,
  input: Omit<AdminLesson, 'id'>,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  const lesson: AdminLesson = { ...input, id: makeId('lesson') };
  return {
    ...touch(state, courseId, nowIso),
    courses: state.courses.map((course) =>
      course.id === courseId
        ? {
            ...course,
            sections: course.sections.map((section) =>
              section.id === sectionId
                ? { ...section, lessons: [...section.lessons, lesson] }
                : section
            ),
          }
        : course
    ),
  };
}

export function updateLessonState(
  state: AdminDataState,
  courseId: string,
  sectionId: string,
  lessonId: string,
  patch: Partial<Omit<AdminLesson, 'id'>>,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...touch(state, courseId, nowIso),
    courses: state.courses.map((course) =>
      course.id === courseId
        ? {
            ...course,
            sections: course.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    lessons: section.lessons.map((lesson) =>
                      lesson.id === lessonId ? { ...lesson, ...patch } : lesson
                    ),
                  }
                : section
            ),
          }
        : course
    ),
  };
}

export function deleteLessonState(
  state: AdminDataState,
  courseId: string,
  sectionId: string,
  lessonId: string,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...touch(state, courseId, nowIso),
    courses: state.courses.map((course) =>
      course.id === courseId
        ? {
            ...course,
            sections: course.sections.map((section) =>
              section.id === sectionId
                ? { ...section, lessons: section.lessons.filter((l) => l.id !== lessonId) }
                : section
            ),
          }
        : course
    ),
  };
}

export function reorderLessonsState(
  state: AdminDataState,
  courseId: string,
  sectionId: string,
  fromIndex: number,
  toIndex: number,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...touch(state, courseId, nowIso),
    courses: state.courses.map((course) =>
      course.id === courseId
        ? {
            ...course,
            sections: course.sections.map((section) => {
              if (section.id !== sectionId) return section;
              const lessons = [...section.lessons];
              if (
                fromIndex < 0 ||
                fromIndex >= lessons.length ||
                toIndex < 0 ||
                toIndex >= lessons.length
              ) {
                return section;
              }
              const [moved] = lessons.splice(fromIndex, 1);
              lessons.splice(toIndex, 0, moved);
              return { ...section, lessons };
            }),
          }
        : course
    ),
  };
}

/* ---------- Users ---------- */

export function updateUserState(
  state: AdminDataState,
  userId: string,
  patch: Partial<Pick<AdminUser, 'name' | 'email' | 'role' | 'status'>>
): AdminDataState {
  return {
    ...state,
    users: state.users.map((user) => (user.id === userId ? { ...user, ...patch } : user)),
  };
}

export function deleteUserState(state: AdminDataState, userId: string): AdminDataState {
  return {
    ...state,
    users: state.users.filter((user) => user.id !== userId),
    enrollments: state.enrollments.filter((enrollment) => enrollment.studentId !== userId),
  };
}

/* ---------- Companies (admin-managed accounts) ---------- */

export interface AdminCompanyDraftInput {
  nameAr: string;
  nameEn: string;
  email: string;
  password: string;
  status: AdminAccountStatus;
}

/**
 * Demo-integrity guard: the first seeded company account doubles as the
 * dashboard login page's demo company, so its credentials must always match
 * the published demo credentials. Older localStorage snapshots (saved before
 * the demo credentials were finalised) or accidental drift would otherwise
 * keep rejecting the pre-filled login form forever. This heals the demo
 * company account on load; every other admin-managed company account is left
 * exactly as the admin configured it.
 */
export function ensureDemoCompanyAccount(state: AdminDataState): AdminDataState {
  const canonicalEmail = DEMO_COMPANY_ACCOUNT.email.trim().toLowerCase();
  const index = state.companies.findIndex(
    (company) =>
      company.id === DEMO_COMPANY_ID ||
      company.email.trim().toLowerCase() === canonicalEmail
  );
  if (index === -1) {
    // Snapshot predates the demo company account → restore the seeded record.
    return { ...state, companies: [ADMIN_COMPANIES[0], ...state.companies] };
  }
  const existing = state.companies[index];
  if (
    existing.email === DEMO_COMPANY_ACCOUNT.email &&
    existing.password === DEMO_COMPANY_ACCOUNT.password &&
    existing.status === 'active'
  ) {
    // Already canonical (an explicit admin deactivation stays respected).
    return state;
  }
  const companies = [...state.companies];
  companies[index] = {
    ...existing,
    email: DEMO_COMPANY_ACCOUNT.email,
    password: DEMO_COMPANY_ACCOUNT.password,
    status: 'active',
  };
  return { ...state, companies };
}

export function createCompanyState(
  state: AdminDataState,
  input: AdminCompanyDraftInput,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  const company: AdminCompany = {
    ...input,
    id: makeId('co'),
    createdAt: nowIso,
  };
  return { ...state, companies: [company, ...state.companies] };
}

export function updateCompanyState(
  state: AdminDataState,
  companyId: string,
  patch: Partial<Omit<AdminCompany, 'id' | 'createdAt'>>
): AdminDataState {
  return {
    ...state,
    companies: state.companies.map((company) =>
      company.id === companyId ? { ...company, ...patch } : company
    ),
  };
}

export function setCompanyStatusState(
  state: AdminDataState,
  companyId: string,
  status: AdminAccountStatus
): AdminDataState {
  return updateCompanyState(state, companyId, { status });
}

/**
 * Delete a company account. Associated students are detached (they become
 * independent students) — their enrollments and exam history are preserved.
 */
export function deleteCompanyState(state: AdminDataState, companyId: string): AdminDataState {
  return {
    ...state,
    companies: state.companies.filter((company) => company.id !== companyId),
    users: state.users.map((user) =>
      user.companyId === companyId ? { ...user, companyId: undefined } : user
    ),
  };
}

export function getCompanyStudentCount(state: AdminDataState, companyId: string): number {
  return state.users.filter((user) => user.role === 'student' && user.companyId === companyId)
    .length;
}

/* ---------- Enrollments ---------- */

export function enrollStudentInCourseState(
  state: AdminDataState,
  studentId: string,
  courseId: string,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  const exists = state.enrollments.some(
    (enrollment) => enrollment.studentId === studentId && enrollment.courseId === courseId
  );
  if (exists) return state;
  return {
    ...state,
    enrollments: [
      {
        id: makeId('enr'),
        studentId,
        courseId,
        status: 'active',
        progressPct: 0,
        enrolledAt: nowIso,
      },
      ...state.enrollments,
    ],
  };
}

export function removeEnrollmentState(
  state: AdminDataState,
  enrollmentId: string
): AdminDataState {
  return {
    ...state,
    enrollments: state.enrollments.filter((enrollment) => enrollment.id !== enrollmentId),
  };
}

/* ---------- Categories ---------- */

export function addCategoryState(
  state: AdminDataState,
  input: Omit<AdminCategory, 'id'>
): AdminDataState {
  const category: AdminCategory = { ...input, id: makeId('cat') };
  return { ...state, categories: [...state.categories, category] };
}

export function updateCategoryState(
  state: AdminDataState,
  categoryId: string,
  patch: Partial<Omit<AdminCategory, 'id'>>
): AdminDataState {
  return {
    ...state,
    categories: state.categories.map((category) =>
      category.id === categoryId ? { ...category, ...patch } : category
    ),
  };
}

export function deleteCategoryState(
  state: AdminDataState,
  categoryId: string
): AdminDataState {
  return {
    ...state,
    categories: state.categories.filter((category) => category.id !== categoryId),
    courses: state.courses.map((course) =>
      course.categoryId === categoryId ? { ...course, categoryId: null } : course
    ),
  };
}

/* ---------- Exams & question builder ---------- */

export function getExamTotalMarks(exam: AdminExam): number {
  return exam.questions.reduce((sum, question) => sum + Math.max(0, question.marks), 0);
}

export function getExamPassingMarks(exam: AdminExam): number {
  return Math.round((getExamTotalMarks(exam) * exam.passingPct) / 100);
}

export interface AdminExamDraftInput {
  /** Optional explicit id — used when the caller pre-generates one (create flow). */
  id?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  courseId: string;
  courseTitleAr: string;
  courseTitleEn: string;
  sectionTitleAr: string;
  sectionTitleEn: string;
  durationMinutes: number;
  passingPct: number;
  maxAttempts: number;
  availableFrom: string | null;
  availableTo: string | null;
  showCorrectAnswers: boolean;
  instructionsAr: string;
  instructionsEn: string;
  status: AdminExamStatus;
  questions?: AdminQuestion[];
}

export function createExamState(
  state: AdminDataState,
  input: AdminExamDraftInput,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  const exam: AdminExam = {
    ...input,
    id: input.id ?? makeId('exam'),
    questions: input.questions ?? [],
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  return { ...state, exams: [exam, ...state.exams] };
}

export function updateExamState(
  state: AdminDataState,
  examId: string,
  patch: Partial<Omit<AdminExam, 'id' | 'createdAt'>>,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...state,
    exams: state.exams.map((exam) =>
      exam.id === examId ? { ...exam, ...patch, updatedAt: nowIso } : exam
    ),
  };
}

export function deleteExamState(state: AdminDataState, examId: string): AdminDataState {
  return { ...state, exams: state.exams.filter((exam) => exam.id !== examId) };
}

export function setExamStatusState(
  state: AdminDataState,
  examId: string,
  status: AdminExamStatus,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return updateExamState(state, examId, { status }, nowIso);
}

export function addExamQuestionState(
  state: AdminDataState,
  examId: string,
  question: Omit<AdminQuestion, 'id'>,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...state,
    exams: state.exams.map((exam) =>
      exam.id === examId
        ? {
            ...exam,
            questions: [...exam.questions, { ...question, id: makeId('q') }],
            updatedAt: nowIso,
          }
        : exam
    ),
  };
}

export function updateExamQuestionState(
  state: AdminDataState,
  examId: string,
  questionId: string,
  patch: Partial<Omit<AdminQuestion, 'id'>>,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...state,
    exams: state.exams.map((exam) =>
      exam.id === examId
        ? {
            ...exam,
            questions: exam.questions.map((question) =>
              question.id === questionId ? { ...question, ...patch } : question
            ),
            updatedAt: nowIso,
          }
        : exam
    ),
  };
}

export function deleteExamQuestionState(
  state: AdminDataState,
  examId: string,
  questionId: string,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...state,
    exams: state.exams.map((exam) =>
      exam.id === examId
        ? {
            ...exam,
            questions: exam.questions.filter((question) => question.id !== questionId),
            updatedAt: nowIso,
          }
        : exam
    ),
  };
}

export function reorderExamQuestionsState(
  state: AdminDataState,
  examId: string,
  fromIndex: number,
  toIndex: number,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  return {
    ...state,
    exams: state.exams.map((exam) => {
      if (exam.id !== examId) return exam;
      const questions = [...exam.questions];
      if (
        fromIndex < 0 ||
        fromIndex >= questions.length ||
        toIndex < 0 ||
        toIndex >= questions.length
      ) {
        return exam;
      }
      const [moved] = questions.splice(fromIndex, 1);
      questions.splice(toIndex, 0, moved);
      return { ...exam, questions, updatedAt: nowIso };
    }),
  };
}

/* ---------- Labels & formatting ---------- */

export const ADMIN_LEVEL_LABELS: Record<AdminCourseLevel, { ar: string; en: string }> = {
  beginner: { ar: 'مبتدئ', en: 'Beginner' },
  intermediate: { ar: 'متوسط', en: 'Intermediate' },
  advanced: { ar: 'متقدم', en: 'Advanced' },
};

export function getAdminLevelLabel(level: AdminCourseLevel, locale: Locale): string {
  const labels = ADMIN_LEVEL_LABELS[level];
  return locale === 'ar' ? labels.ar : labels.en;
}

export const ADMIN_ROLE_LABELS: Record<AdminUserRole, { ar: string; en: string }> = {
  admin: { ar: 'مدير', en: 'Admin' },
  instructor: { ar: 'مدرّب', en: 'Instructor' },
  student: { ar: 'طالب', en: 'Student' },
};

export function formatAdminDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function formatAdminMinutes(minutes: number, locale: Locale): string {
  const safe = Math.max(0, Math.round(minutes));
  if (locale === 'en') return `${safe} min`;
  if (safe === 1) return 'دقيقة واحدة';
  if (safe === 2) return 'دقيقتان';
  if (safe <= 10) return `${safe} دقائق`;
  return `${safe} دقيقة`;
}
