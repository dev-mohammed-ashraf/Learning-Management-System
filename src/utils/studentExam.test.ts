import test from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultAdminState } from '../data/adminData';
import type { AdminExam, AdminExamAttempt } from '../types/admin';
import {
  canStartExam,
  countSubmittedAttempts,
  formatCountdown,
  getActiveAttempt,
  getBestAttempt,
  getAttemptsForExam,
  getExamPassingMarks,
  getExamTotalMarks,
  gradeAttempt,
  isExamEnrollmentLocked,
  isQuestionCorrect,
  normalizeAnswerText,
} from './studentExam';

const state = createDefaultAdminState();
const exam: AdminExam = state.exams.find((item) => item.id === 'ex-biz-midterm')!;

function attempt(partial: Partial<AdminExamAttempt>): AdminExamAttempt {
  return {
    id: 'att-1',
    examId: exam.id,
    courseId: exam.courseId,
    startedAt: '2026-11-10T10:00:00Z',
    submittedAt: null,
    answers: {},
    earnedMarks: null,
    totalMarks: null,
    scorePct: null,
    passed: null,
    ...partial,
  };
}

test('exam totals: 5 questions x 2 marks = 10 marks, passing marks follow pct', () => {
  assert.equal(getExamTotalMarks(exam), 10);
  assert.equal(getExamPassingMarks(exam), 6);
});

test('question grading: MC exact option, TF exact boolean, short answer lenient match', () => {
  const mc = exam.questions.find((question) => question.id === 'exq-1')!;
  const tf = exam.questions.find((question) => question.id === 'exq-2')!;
  const sa = exam.questions.find((question) => question.id === 'exq-4')!;

  assert.equal(isQuestionCorrect(mc, 'o2'), true);
  assert.equal(isQuestionCorrect(mc, 'o1'), false);
  assert.equal(isQuestionCorrect(mc, undefined), false);

  assert.equal(isQuestionCorrect(tf, true), true);
  assert.equal(isQuestionCorrect(tf, false), false);

  assert.equal(isQuestionCorrect(sa, 'التنظيم'), true);
  assert.equal(isQuestionCorrect(sa, 'التـنظيـم'), true, 'diacritics/tatweel are normalized');
  assert.equal(isQuestionCorrect(sa, 'اعتمدنا التنظيم الجيد'), true, 'expected text contained in answer');
  assert.equal(isQuestionCorrect(sa, 'organizing'), true, 'english expected answer also matches');
  assert.equal(isQuestionCorrect(sa, 'التخطيط'), false);
});

test('attempt grading computes earned marks, percentage, and pass/fail', () => {
  const grade = gradeAttempt(exam, {
    exq_1_placeholder: true, // ignored — wrong id shape must not crash
    exq1: 'o2',
    'exq-1': 'o2',
    'exq-2': true,
    'exq-3': 'o1',
    'exq-4': '  التنظيم ',
    'exq-5': true,
  });
  assert.equal(grade.earnedMarks, 10);
  assert.equal(grade.totalMarks, 10);
  assert.equal(grade.scorePct, 100);
  assert.equal(grade.passed, true);

  const failing = gradeAttempt(exam, { 'exq-1': 'o1', 'exq-2': false, 'exq-3': 'o1', 'exq-4': 'لا أعرف', 'exq-5': false });
  assert.equal(failing.earnedMarks, 2);
  assert.equal(failing.scorePct, 20);
  assert.equal(failing.passed, false);
});

test('attempt gating: published + attempts remaining + availability window', () => {
  assert.equal(canStartExam(exam, [], '2026-11-10T10:00:00Z'), null);

  const full = [
    attempt({ id: 'a1', submittedAt: '2026-11-10T10:20:00Z' }),
    attempt({ id: 'a2', submittedAt: '2026-11-11T10:20:00Z' }),
  ];
  assert.equal(canStartExam(exam, full, '2026-11-12T10:00:00Z'), 'max_attempts');

  const draftExam = { ...exam, status: 'draft' as const };
  assert.equal(canStartExam(draftExam, [], '2026-11-10T10:00:00Z'), 'not_published');

  const windowedExam = {
    ...exam,
    availableFrom: '2027-01-01T00:00:00Z',
    availableTo: '2027-01-31T23:59:59Z',
  };
  assert.equal(canStartExam(windowedExam, [], '2026-11-10T10:00:00Z'), 'not_available');
  assert.equal(canStartExam(windowedExam, [], '2027-01-15T10:00:00Z'), null);

  // In-progress (unsubmitted) attempt does not consume an attempt slot
  const inProgress = [attempt({ id: 'a1' })];
  assert.equal(canStartExam(exam, inProgress, '2026-11-10T10:05:00Z'), null);
  assert.equal(countSubmittedAttempts(exam ? [attempt({ id: 'a2', submittedAt: '2026-11-10T10:20:00Z' })] : [], exam.id), 1);
});

test('attempt lookup helpers find active and best attempts', () => {
  const attempts = [
    attempt({ id: 'a1', submittedAt: '2026-11-10T10:20:00Z', scorePct: 40 }),
    attempt({ id: 'a2', submittedAt: '2026-11-11T10:20:00Z', scorePct: 80 }),
  ];
  assert.equal(getAttemptsForExam(attempts, exam.id).length, 2);
  assert.equal(getBestAttempt(attempts, exam.id)?.id, 'a2');
  assert.equal(getBestAttempt(attempts, 'missing'), null);
  assert.equal(getActiveAttempt([...attempts, attempt({ id: 'a3' })], exam.id)?.id, 'a3');
});

test('enrollment lock applies only to demo-course exams', () => {
  const demoLearning = { enrolledDemoCourseIds: [], progress: {} };
  const enrolled = { enrolledDemoCourseIds: ['demo-business-essentials'], progress: {} };
  const demoCourses = [{ id: 'demo-business-essentials' }, { id: 'demo-client-service' }];

  const adminCatalogExam = state.exams.find((item) => item.id === 'ex-proc-quiz')!;
  assert.equal(
    isExamEnrollmentLocked(adminCatalogExam, demoLearning, demoCourses as never),
    false,
    'admin catalog exam stays open'
  );
  assert.equal(isExamEnrollmentLocked(adminCatalogExam, enrolled, demoCourses as never), false);

  // ex-biz-midterm is tied to a demo-learning course
  assert.equal(isExamEnrollmentLocked(exam, demoLearning, demoCourses as never), true);
  assert.equal(isExamEnrollmentLocked(exam, enrolled, demoCourses as never), false);
});

test('countdown formatting covers minutes and hours', () => {
  assert.equal(formatCountdown(0), '00:00');
  assert.equal(formatCountdown(65_000), '01:05');
  assert.equal(formatCountdown(3_725_000), '1:02:05');
  assert.equal(formatCountdown(-5_000), '00:00', 'expired clamps to zero');
});

test('normalizeAnswerText unifies alef variants and spacing', () => {
  assert.equal(normalizeAnswerText('  أهــلاً  بكم '), 'اهلا بكم');
});
