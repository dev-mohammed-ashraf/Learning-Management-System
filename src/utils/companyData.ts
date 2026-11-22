import type {
  AdminAccountStatus,
  AdminCompany,
  AdminCourse,
  AdminDataState,
  AdminEnrollment,
  AdminEnrollmentStatus,
  AdminExamAttempt,
  AdminUser,
} from '../types/admin';
import type { DemoLearningState } from '../types/coursePlayer';
import { getAdminLessons } from './adminData';

/**
 * Company (institutional) data layer.
 *
 * Every function takes the authenticated `companyId` and enforces the scoping
 * rule `student.companyId === companyId` before reading or mutating data, so a
 * company can never reach students, enrollments, or exam results that belong
 * to another company — even with tampered ids. Admin-only company account
 * CRUD lives in `adminData.ts`.
 */

/* ---------- Scoping helpers (the core access-control rule) ---------- */

/** Students belonging to the given company only (never shared across companies). */
export function getCompanyStudents(state: AdminDataState, companyId: string): AdminUser[] {
  return state.users.filter(
    (user) => user.role === 'student' && user.companyId === companyId
  );
}

/** Ownership guard — true only when the student belongs to this company. */
export function isCompanyStudent(
  state: AdminDataState,
  companyId: string,
  studentId: string
): boolean {
  const student = state.users.find((user) => user.id === studentId);
  return Boolean(
    student && student.role === 'student' && student.companyId === companyId
  );
}

export function getCompanyById(state: AdminDataState, companyId: string): AdminCompany | undefined {
  return state.companies.find((company) => company.id === companyId);
}

/** Demo sign-in check: active company with matching (demo) credentials. */
export function findCompanyForSignIn(
  state: AdminDataState,
  email: string,
  password: string
): AdminCompany | null {
  const normalizedEmail = email.trim().toLowerCase();
  const company = state.companies.find(
    (item) => item.email.trim().toLowerCase() === normalizedEmail
  );
  if (!company) return null;
  if (company.status !== 'active') return null;
  return company.password === password ? company : null;
}

/* ---------- Company course purchases (demo purchase flow) ---------- */

export type CompanyPurchaseErrorCode =
  | 'company-missing'
  | 'company-inactive'
  | 'student-not-found'
  | 'student-not-yours'
  | 'student-inactive'
  | 'course-not-found'
  | 'course-unpublished'
  | 'already-enrolled';

export type CompanyPurchaseResult =
  | { ok: true; state: AdminDataState; enrollment: AdminEnrollment }
  | { ok: false; reason: CompanyPurchaseErrorCode };

/**
 * Ownership-guarded lookup: the enrollment of a company student in a course,
 * or null when the student does not belong to the company / is not enrolled.
 */
export function getCompanyStudentEnrollment(
  state: AdminDataState,
  companyId: string,
  studentId: string,
  courseId: string
): AdminEnrollment | null {
  if (!isCompanyStudent(state, companyId, studentId)) return null;
  return (
    state.enrollments.find(
      (enrollment) => enrollment.studentId === studentId && enrollment.courseId === courseId
    ) ?? null
  );
}

export interface CompanyPurchaseRecord {
  enrollment: AdminEnrollment;
  student: AdminUser | null;
  course: AdminCourse | null;
  /** Price captured at purchase time, falling back to the current course price. */
  price: number | null;
}

/**
 * Purchase history for one company — strictly scoped to its own students.
 * Records are ordered newest first and include seeded enrollments of the
 * company's students alongside real company purchases.
 */
export function getCompanyPurchaseHistory(
  state: AdminDataState,
  companyId: string
): CompanyPurchaseRecord[] {
  return state.enrollments
    .filter((enrollment) =>
      enrollment.companyId
        ? enrollment.companyId === companyId
        : isCompanyStudent(state, companyId, enrollment.studentId)
    )
    .map((enrollment) => {
      const student = state.users.find((user) => user.id === enrollment.studentId) ?? null;
      const course = state.courses.find((item) => item.id === enrollment.courseId) ?? null;
      return {
        enrollment,
        student,
        course,
        price: enrollment.priceAtPurchase ?? course?.price ?? null,
      };
    })
    .sort((a, b) => {
      const aAt = a.enrollment.purchasedAt ?? a.enrollment.enrolledAt;
      const bAt = b.enrollment.purchasedAt ?? b.enrollment.enrolledAt;
      return bAt.localeCompare(aAt);
    });
}

/**
 * Demo purchase: create an active, company-attributed enrollment for one of
 * the company's own students. Every guard re-checks ownership on the data
 * layer, so a hand-submitted foreign student id can never be enrolled.
 */
export function purchaseCourseForStudentState(
  state: AdminDataState,
  companyId: string,
  studentId: string,
  courseId: string,
  nowIso: string = new Date().toISOString()
): CompanyPurchaseResult {
  // Guard 1: the authenticated company must exist and stay active.
  const company = getCompanyById(state, companyId);
  if (!company) return { ok: false, reason: 'company-missing' };
  if (company.status !== 'active') return { ok: false, reason: 'company-inactive' };

  // Guard 2: the student must exist, be active, and belong to THIS company.
  const student = state.users.find((user) => user.id === studentId && user.role === 'student');
  if (!student) return { ok: false, reason: 'student-not-found' };
  if (student.companyId !== companyId) return { ok: false, reason: 'student-not-yours' };
  if (student.status !== 'active') return { ok: false, reason: 'student-inactive' };

  // Guard 3: only published courses can be purchased.
  const course = state.courses.find((item) => item.id === courseId);
  if (!course) return { ok: false, reason: 'course-not-found' };
  if (course.status !== 'published') return { ok: false, reason: 'course-unpublished' };

  // Guard 4: a student can never be enrolled in the same course twice.
  if (
    state.enrollments.some(
      (enrollment) => enrollment.studentId === studentId && enrollment.courseId === courseId
    )
  ) {
    return { ok: false, reason: 'already-enrolled' };
  }

  const enrollment: AdminEnrollment = {
    id: `enr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    studentId,
    courseId,
    status: 'active',
    progressPct: 0,
    enrolledAt: nowIso,
    companyId,
    priceAtPurchase: course.price,
    purchasedAt: nowIso,
    source: 'company-purchase',
  };
  return {
    ok: true,
    enrollment,
    state: { ...state, enrollments: [enrollment, ...state.enrollments] },
  };
}

/**
 * Mirror the student's demo lesson progress into their company-purchase
 * enrollments so the company dashboard reflects live progress. Seeded and
 * admin-created enrollments are never rewritten (they keep manual progress).
 */
export function syncCompanyPurchaseProgress(
  state: AdminDataState,
  studentId: string,
  learning: DemoLearningState
): AdminDataState {
  let changed = false;
  const enrollments = state.enrollments.map((enrollment) => {
    if (enrollment.studentId !== studentId) return enrollment;
    if (enrollment.source !== 'company-purchase') return enrollment;
    const course = state.courses.find((item) => item.id === enrollment.courseId);
    if (!course) return enrollment;
    const lessonIds = new Set(getAdminLessons(course).map((lesson) => lesson.id));
    const total = lessonIds.size;
    const completed = (learning.progress[enrollment.courseId]?.completedLessonIds ?? []).filter(
      (lessonId) => lessonIds.has(lessonId)
    ).length;
    const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const status: AdminEnrollmentStatus = progressPct >= 100 ? 'completed' : 'active';
    if (enrollment.progressPct === progressPct && enrollment.status === status) {
      return enrollment;
    }
    changed = true;
    return { ...enrollment, progressPct, status };
  });
  return changed ? { ...state, enrollments } : state;
}

/* ---------- Student progress summaries (reused by admin + company views) ---------- */

export interface CompanyCourseProgress {
  course: AdminCourse;
  enrollment: AdminEnrollment;
  totalLessons: number;
  completedLessons: number;
  remainingLessons: number;
  progressPct: number;
  completed: boolean;
}

export interface CompanyStudentSummary {
  student: AdminUser;
  courses: CompanyCourseProgress[];
  enrolledCourses: number;
  completedCourses: number;
  /** Mean progress across the student's enrollments (0 when none). */
  overallProgressPct: number;
  totalLessons: number;
  completedLessons: number;
  remainingLessons: number;
  /** Exam attempts owned by this student (newest first). */
  attempts: AdminExamAttempt[];
  passedExams: number;
  failedExams: number;
  /** Latest known learning activity across enrollments and exam attempts. */
  lastActivityAt: string | null;
}

function deriveCourseProgress(
  state: AdminDataState,
  enrollment: AdminEnrollment
): CompanyCourseProgress | null {
  const course = state.courses.find((item) => item.id === enrollment.courseId);
  if (!course) return null;
  const totalLessons = getAdminLessons(course).length;
  const completedLessons =
    enrollment.status === 'completed'
      ? totalLessons
      : Math.min(totalLessons, Math.round((enrollment.progressPct / 100) * totalLessons));
  return {
    course,
    enrollment,
    totalLessons,
    completedLessons,
    remainingLessons: Math.max(0, totalLessons - completedLessons),
    progressPct: enrollment.status === 'completed' ? 100 : enrollment.progressPct,
    completed: enrollment.status === 'completed',
  };
}

/** Build the progress summary for one student (enrollments + exam attempts). */
export function getCompanyStudentSummary(
  state: AdminDataState,
  studentId: string,
  attempts: AdminExamAttempt[]
): CompanyStudentSummary {
  const student = state.users.find((user) => user.id === studentId) ?? null;
  const ownedAttempts = attempts
    .filter((attempt) => attempt.studentId === studentId)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));

  if (!student) {
    return {
      student: {
        id: studentId,
        name: '',
        email: '',
        role: 'student',
        status: 'inactive',
        registeredAt: '',
      },
      courses: [],
      enrolledCourses: 0,
      completedCourses: 0,
      overallProgressPct: 0,
      totalLessons: 0,
      completedLessons: 0,
      remainingLessons: 0,
      attempts: ownedAttempts,
      passedExams: 0,
      failedExams: 0,
      lastActivityAt: null,
    };
  }

  const courses = state.enrollments
    .filter((enrollment) => enrollment.studentId === studentId)
    .map((enrollment) => deriveCourseProgress(state, enrollment))
    .filter((entry): entry is CompanyCourseProgress => entry !== null);

  const totalLessons = courses.reduce((sum, entry) => sum + entry.totalLessons, 0);
  const completedLessons = courses.reduce((sum, entry) => sum + entry.completedLessons, 0);
  const overallProgressPct =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, entry) => sum + entry.progressPct, 0) / courses.length
        )
      : 0;

  const activityCandidates: string[] = [
    ...courses.map((entry) => entry.enrollment.enrolledAt),
    ...ownedAttempts.map((attempt) => attempt.submittedAt ?? attempt.startedAt),
  ].filter((value) => Boolean(value));

  return {
    student,
    courses,
    enrolledCourses: courses.length,
    completedCourses: courses.filter((entry) => entry.completed).length,
    overallProgressPct,
    totalLessons,
    completedLessons,
    remainingLessons: Math.max(0, totalLessons - completedLessons),
    attempts: ownedAttempts,
    passedExams: ownedAttempts.filter((attempt) => attempt.submittedAt && attempt.passed).length,
    failedExams: ownedAttempts.filter(
      (attempt) => attempt.submittedAt && attempt.passed === false
    ).length,
    lastActivityAt:
      activityCandidates.length > 0
        ? activityCandidates.reduce((latest, value) => (value > latest ? value : latest))
        : null,
  };
}

/* ---------- Company dashboard statistics ---------- */

export interface CompanyDashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalEnrollments: number;
  /** Mean of each active student's overall progress (0 when none). */
  avgProgressPct: number;
  completedCourses: number;
}

export function computeCompanyStats(
  state: AdminDataState,
  companyId: string,
  attempts: AdminExamAttempt[]
): CompanyDashboardStats {
  const students = getCompanyStudents(state, companyId);
  const activeStudents = students.filter((student) => student.status === 'active');
  const summaries = activeStudents.map((student) =>
    getCompanyStudentSummary(state, student.id, attempts)
  );
  const totalEnrollments = summaries.reduce((sum, summary) => sum + summary.enrolledCourses, 0);
  return {
    totalStudents: students.length,
    activeStudents: activeStudents.length,
    totalEnrollments,
    avgProgressPct:
      summaries.length > 0
        ? Math.round(
            summaries.reduce((sum, summary) => sum + summary.overallProgressPct, 0) /
              summaries.length
          )
        : 0,
    completedCourses: summaries.reduce((sum, summary) => sum + summary.completedCourses, 0),
  };
}

/* ---------- Guarded student mutations (company scope) ---------- */

export interface CompanyStudentDraftInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export function companyEmailExists(state: AdminDataState, email: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  return state.users.some((user) => user.email.trim().toLowerCase() === normalizedEmail);
}

/** Create a student belonging to the authenticated company (association is automatic). */
export function createCompanyStudentState(
  state: AdminDataState,
  companyId: string,
  input: CompanyStudentDraftInput,
  nowIso: string = new Date().toISOString()
): AdminDataState {
  // Guard: the company account must exist and be active.
  const company = getCompanyById(state, companyId);
  if (!company || company.status !== 'active') return state;
  // Guard: emails are unique across the demo platform.
  if (companyEmailExists(state, input.email)) return state;
  const student: AdminUser = {
    id: `stu-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.name.trim(),
    email: input.email.trim(),
    role: 'student',
    status: 'active',
    registeredAt: nowIso,
    companyId,
    phone: input.phone?.trim() || undefined,
    password: input.password,
  };
  return { ...state, users: [student, ...state.users] };
}

export interface CompanyStudentPatch {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

/**
 * Update basic info of a company-owned student. Returns the state unchanged
 * when the student does not belong to the authenticated company.
 */
export function updateCompanyStudentState(
  state: AdminDataState,
  companyId: string,
  studentId: string,
  patch: CompanyStudentPatch
): AdminDataState {
  if (!isCompanyStudent(state, companyId, studentId)) return state;
  if (patch.email !== undefined && companyEmailExists(state, patch.email)) {
    const existing = state.users.find((user) => user.id === studentId);
    const isSelf =
      existing && existing.email.trim().toLowerCase() === patch.email.trim().toLowerCase();
    if (!isSelf) return state;
  }
  return {
    ...state,
    users: state.users.map((user) =>
      user.id === studentId
        ? {
            ...user,
            name: patch.name !== undefined ? patch.name.trim() : user.name,
            email: patch.email !== undefined ? patch.email.trim() : user.email,
            phone: patch.phone !== undefined ? patch.phone.trim() || undefined : user.phone,
            password: patch.password !== undefined ? patch.password : user.password,
          }
        : user
    ),
  };
}

/**
 * Activate / deactivate a company-owned student. Returns the state unchanged
 * when the student does not belong to the authenticated company.
 */
export function setCompanyStudentStatusState(
  state: AdminDataState,
  companyId: string,
  studentId: string,
  status: AdminAccountStatus
): AdminDataState {
  if (!isCompanyStudent(state, companyId, studentId)) return state;
  return {
    ...state,
    users: state.users.map((user) => (user.id === studentId ? { ...user, status } : user)),
  };
}
