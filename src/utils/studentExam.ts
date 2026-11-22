import type { AdminExam, AdminExamAttempt, AdminQuestion } from '../types/admin';
import type { DemoCourse, DemoLearningState } from '../types/coursePlayer';

/** Normalize free-text answers for lenient demo grading (short answer). */
export function normalizeAnswerText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '') // Arabic diacritics + tatweel
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ');
}

export function getExamTotalMarks(exam: AdminExam): number {
  return exam.questions.reduce((sum, question) => sum + Math.max(0, question.marks), 0);
}

export function getExamPassingMarks(exam: AdminExam): number {
  return Math.round((getExamTotalMarks(exam) * exam.passingPct) / 100);
}

export function isQuestionCorrect(question: AdminQuestion, answer: string | boolean | undefined): boolean {
  if (answer === undefined || answer === null || answer === '') return false;
  switch (question.type) {
    case 'multiple_choice':
      return typeof answer === 'string' && answer === question.correctOptionId;
    case 'true_false':
      return typeof answer === 'boolean' && answer === question.correctTrueFalse;
    case 'short_answer': {
      if (typeof answer !== 'string') return false;
      const normalizedAnswer = normalizeAnswerText(answer);
      if (!normalizedAnswer) return false;
      const expected = [question.expectedAnswerAr, question.expectedAnswerEn]
        .filter((value) => value.trim() !== '')
        .map((value) => normalizeAnswerText(value));
      return expected.some((value) => normalizedAnswer.includes(value) || value.includes(normalizedAnswer));
    }
    default:
      return false;
  }
}

export interface AttemptGrade {
  earnedMarks: number;
  totalMarks: number;
  scorePct: number;
  passed: boolean;
}

/** Auto-grade a demo attempt (MC/TF exact match, short answer lenient text match). */
export function gradeAttempt(
  exam: AdminExam,
  answers: Record<string, string | boolean>
): AttemptGrade {
  let earnedMarks = 0;
  for (const question of exam.questions) {
    if (isQuestionCorrect(question, answers[question.id])) {
      earnedMarks += Math.max(0, question.marks);
    }
  }
  const totalMarks = getExamTotalMarks(exam);
  const scorePct = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
  return {
    earnedMarks,
    totalMarks,
    scorePct,
    passed: scorePct >= exam.passingPct,
  };
}

export function getAttemptsForExam(
  attempts: AdminExamAttempt[],
  examId: string,
  studentId?: string | null
): AdminExamAttempt[] {
  return attempts
    .filter(
      (attempt) =>
        attempt.examId === examId &&
        (studentId === undefined || attempt.studentId === studentId)
    )
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

/**
 * Count submitted attempts for an exam.
 * - `studentId` omitted → legacy behavior (all submitted attempts).
 * - `studentId` is a string → only that demo student's submitted attempts.
 * - `studentId` is null → only unattributed (local anonymous student) attempts.
 */
export function countSubmittedAttempts(
  attempts: AdminExamAttempt[],
  examId: string,
  studentId?: string | null
): number {
  return attempts.filter((attempt) => {
    if (attempt.examId !== examId || !attempt.submittedAt) return false;
    if (studentId === undefined) return true; // legacy: no per-student filtering
    if (studentId === null) return !attempt.studentId; // unattributed attempts only
    return attempt.studentId === studentId;
  }).length;
}

export function getBestAttempt(
  attempts: AdminExamAttempt[],
  examId: string,
  studentId?: string | null
): AdminExamAttempt | null {
  const submitted = getAttemptsForExam(attempts, examId, studentId).filter(
    (attempt) => attempt.submittedAt
  );
  if (submitted.length === 0) return null;
  return submitted.reduce((best, attempt) =>
    (attempt.scorePct ?? -1) >= (best.scorePct ?? -1) ? attempt : best
  );
}

export function getActiveAttempt(
  attempts: AdminExamAttempt[],
  examId: string,
  studentId?: string | null
): AdminExamAttempt | null {
  return (
    getAttemptsForExam(attempts, examId, studentId).find((attempt) => !attempt.submittedAt) ?? null
  );
}

export type ExamStartBlock = 'max_attempts' | 'not_published' | 'not_available' | null;

/** Availability window + publish status + attempts remaining check (per student when attributed). */
export function canStartExam(
  exam: AdminExam,
  attempts: AdminExamAttempt[],
  nowIso: string = new Date().toISOString(),
  studentId?: string | null
): ExamStartBlock {
  if (exam.status !== 'published') return 'not_published';
  const now = new Date(nowIso).getTime();
  if (exam.availableFrom && now < new Date(exam.availableFrom).getTime()) return 'not_available';
  if (exam.availableTo && now > new Date(exam.availableTo).getTime()) return 'not_available';
  if (
    countSubmittedAttempts(attempts, exam.id, studentId) >= Math.max(1, exam.maxAttempts)
  ) {
    return 'max_attempts';
  }
  return null;
}

/**
 * Enrollment gating: exams tied to one of the demo courses require an active
 * demo enrollment; exams tied to admin-only catalog courses stay open (demo).
 */
export function isExamEnrollmentLocked(
  exam: AdminExam,
  demoLearning: DemoLearningState,
  demoCourses: DemoCourse[]
): boolean {
  const isDemoCourse = demoCourses.some((course) => course.id === exam.courseId);
  if (!isDemoCourse) return false;
  return !demoLearning.enrolledDemoCourseIds.includes(exam.courseId);
}

/** Countdown label, e.g. "12:05" or "1:02:10" for long exams. */
export function formatCountdown(msRemaining: number): string {
  const safe = Math.max(0, Math.floor(msRemaining / 1000));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}
