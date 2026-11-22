import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { AdminDataState, AdminExamAttempt } from '../types/admin';
import { createDefaultAdminState } from '../data/adminData';
import { countSubmittedAttempts } from './studentExam';
import { authenticateDashboard } from './dashboardAuth';
import {
  computeCompanyStats,
  createCompanyStudentState,
  findCompanyForSignIn,
  getCompanyPurchaseHistory,
  getCompanyStudentEnrollment,
  getCompanyStudentSummary,
  getCompanyStudents,
  isCompanyStudent,
  purchaseCourseForStudentState,
  setCompanyStudentStatusState,
  syncCompanyPurchaseProgress,
  updateCompanyStudentState,
} from './companyData';
import {
  createCompanyState,
  deleteCompanyState,
  getAdminLessons,
  setCompanyStatusState,
} from './adminData';
import {
  createEmptyDemoLearningState,
  enrollDemoCourseState,
  toggleDemoLessonState,
} from './demoLearning';
import { adminCourseToDemoCourse } from './demoCourseBridge';

function freshState(): AdminDataState {
  return createDefaultAdminState();
}

function attempt(overrides: Partial<AdminExamAttempt>): AdminExamAttempt {
  return {
    id: overrides.id ?? 'att-x',
    examId: overrides.examId ?? 'ex-biz-midterm',
    courseId: 'demo-business-essentials',
    studentId: overrides.studentId,
    startedAt: overrides.startedAt ?? '2026-11-01T10:00:00Z',
    submittedAt: overrides.submittedAt !== undefined ? overrides.submittedAt : '2026-11-01T10:20:00Z',
    answers: {},
    earnedMarks: overrides.earnedMarks ?? 0,
    totalMarks: overrides.totalMarks ?? 10,
    scorePct: overrides.scorePct ?? 0,
    passed: overrides.passed ?? false,
  };
}

test('company seed data is consistent: accounts exist and students are assigned', () => {
  const state = freshState();
  assert.ok(state.companies.length >= 3, 'at least three demo companies');
  const tech = state.companies.find((company) => company.id === 'co-tech-horizon');
  assert.ok(tech, 'tech horizon exists');
  assert.equal(tech.status, 'active');
  assert.ok(state.companies.some((company) => company.status === 'inactive'), 'one inactive demo company');

  const techStudents = getCompanyStudents(state, 'co-tech-horizon').map((student) => student.id);
  assert.deepEqual(techStudents.sort(), ['u-st-1', 'u-st-2', 'u-st-3']);

  // Independent students have no companyId at all.
  for (const id of ['u-st-4', 'u-st-7', 'u-st-10']) {
    const student = state.users.find((user) => user.id === id);
    assert.ok(student && !student.companyId, `${id} is independent`);
  }

  // Every assigned student points at a real company account.
  for (const student of state.users) {
    if (student.companyId) {
      assert.ok(
        state.companies.some((company) => company.id === student.companyId),
        `${student.id} points at a real company`
      );
    }
  }
});

test('company scoping: only own students are visible and ownership is enforced', () => {
  const state = freshState();
  const binyanIds = getCompanyStudents(state, 'co-binyan').map((student) => student.id);
  assert.deepEqual(binyanIds.sort(), ['u-st-5', 'u-st-6']);
  assert.equal(getCompanyStudents(state, 'co-binyan').some((s) => s.id === 'u-st-1'), false);

  assert.equal(isCompanyStudent(state, 'co-binyan', 'u-st-5'), true);
  assert.equal(isCompanyStudent(state, 'co-binyan', 'u-st-1'), false, 'cross-company access denied');
  assert.equal(isCompanyStudent(state, 'co-binyan', 'u-admin'), false, 'non-students denied');
  assert.equal(isCompanyStudent(state, 'co-missing', 'u-st-5'), false);
});

test('company student creation assigns the company automatically and dedupes emails', () => {
  let state = freshState();
  const before = state.users.length;

  // Duplicate email is rejected.
  state = createCompanyStudentState(state, 'co-binyan', {
    name: 'مكرر',
    email: 'reem.harbi@gmail.com',
    password: 'temp-1234',
  });
  assert.equal(state.users.length, before, 'duplicate email rejected');

  // Inactive company cannot create students.
  state = createCompanyStudentState(state, 'co-rowad', {
    name: 'موقوف',
    email: 'new.rowad@example.com',
    password: 'temp-1234',
  });
  assert.equal(state.users.length, before, 'inactive company blocked');

  // Valid creation: company association is automatic (no manual selection).
  state = createCompanyStudentState(state, 'co-binyan', {
    name: 'سالم القحطاني',
    email: 'salem.qahtani@example.com',
    password: 'temp-1234',
    phone: '+966 50 000 0000',
  });
  assert.equal(state.users.length, before + 1);
  const created = state.users[0];
  assert.equal(created.role, 'student');
  assert.equal(created.companyId, 'co-binyan');
  assert.equal(created.status, 'active');
  assert.equal(created.phone, '+966 50 000 0000');
  assert.equal(created.password, 'temp-1234');
});

test('company mutations are refused for students of another company', () => {
  let state = freshState();

  // co-binyan cannot edit co-tech-horizon's student.
  const untouched = updateCompanyStudentState(state, 'co-binyan', 'u-st-1', { name: 'اخترق' });
  assert.equal(untouched, state, 'cross-company edit is a no-op');

  // co-binyan cannot deactivate co-rowad's student.
  const notDeactivated = setCompanyStudentStatusState(state, 'co-binyan', 'u-st-8', 'inactive');
  assert.equal(notDeactivated, state, 'cross-company deactivation is a no-op');

  // Own-student edit works (basic info only).
  state = updateCompanyStudentState(state, 'co-binyan', 'u-st-5', { name: 'لمى الزهراني المعدلة' });
  assert.equal(state.users.find((user) => user.id === 'u-st-5')?.name, 'لمى الزهراني المعدلة');

  // Own-student deactivation works.
  state = setCompanyStudentStatusState(state, 'co-binyan', 'u-st-5', 'inactive');
  assert.equal(state.users.find((user) => user.id === 'u-st-5')?.status, 'inactive');
});

test('deleting a company detaches its students and keeps their enrollments', () => {
  let state = freshState();
  const enrollmentsBefore = state.enrollments.length;
  state = deleteCompanyState(state, 'co-tech-horizon');
  assert.equal(state.companies.some((company) => company.id === 'co-tech-horizon'), false);
  for (const id of ['u-st-1', 'u-st-2', 'u-st-3']) {
    const student = state.users.find((user) => user.id === id);
    assert.ok(student, `${id} still exists`);
    assert.equal(student!.companyId, undefined, `${id} became independent`);
  }
  assert.equal(state.enrollments.length, enrollmentsBefore, 'enrollments preserved');
  assert.equal(getCompanyStudents(state, 'co-tech-horizon').length, 0);
});

test('company stats are computed from its own students only', () => {
  const state = freshState();
  const binyan = computeCompanyStats(state, 'co-binyan', []);
  assert.equal(binyan.totalStudents, 2);
  assert.equal(binyan.activeStudents, 2);
  assert.equal(binyan.totalEnrollments, 4);
  assert.equal(binyan.completedCourses, 2);
  assert.equal(binyan.avgProgressPct, 73); // (45 + 100) / 2

  const tech = computeCompanyStats(state, 'co-tech-horizon', []);
  assert.equal(tech.totalStudents, 3);
  assert.equal(tech.totalEnrollments, 7);
  assert.equal(tech.completedCourses, 2);
  assert.equal(tech.avgProgressPct, 60); // (53 + 55 + 73) / 3
});

test('student summary derives lessons, exams, and last activity from existing data', () => {
  const state = freshState();

  const summary = getCompanyStudentSummary(state, 'u-st-1', []);
  // Business Essentials (completed, 5 lessons) + Client Service 55% of 5 + Logistics 5% of 4.
  assert.equal(summary.enrolledCourses, 3);
  assert.equal(summary.completedCourses, 1);
  assert.equal(summary.overallProgressPct, 53);
  assert.equal(summary.totalLessons, 14);
  assert.equal(summary.completedLessons, 8);
  assert.equal(summary.remainingLessons, 6);
  assert.equal(summary.passedExams, 0);
  assert.equal(summary.lastActivityAt, '2026-10-11T19:25:00Z');

  // With attributed demo attempts, exam results appear per student.
  const seeded = [
    attempt({ id: 'a1', studentId: 'u-st-1', scorePct: 80, passed: true, submittedAt: '2026-11-09T16:24:00Z' }),
    attempt({ id: 'a2', studentId: 'u-st-9', scorePct: 40, passed: false, submittedAt: '2026-11-06T09:34:00Z' }),
    attempt({ id: 'a3', studentId: undefined, scorePct: 100, passed: true }),
  ];
  const summaryWithExams = getCompanyStudentSummary(state, 'u-st-1', seeded);
  assert.equal(summaryWithExams.attempts.length, 1);
  assert.equal(summaryWithExams.passedExams, 1);
  assert.equal(summaryWithExams.failedExams, 0);
  assert.equal(summaryWithExams.lastActivityAt, '2026-11-09T16:24:00Z');
});

test('demo company sign-in verifies credentials and account status', () => {
  const state = freshState();
  const ok = findCompanyForSignIn(state, 'Company@Madaar.demo', 'Company123!');
  assert.ok(ok && ok.id === 'co-tech-horizon', 'case-insensitive email + password match');

  assert.equal(findCompanyForSignIn(state, 'company@madaar.demo', 'wrong'), null, 'bad password');
  assert.equal(
    findCompanyForSignIn(state, 'training@rowad.sa', 'rowad2026'),
    null,
    'inactive company cannot sign in'
  );
  assert.equal(findCompanyForSignIn(state, 'nobody@nowhere.sa', 'x'), null);
});

test('dashboard demo auth: admin and company sessions are role-scoped', () => {
  const state = freshState();

  // Admin: exact demo credentials only.
  assert.deepEqual(authenticateDashboard('admin', 'admin@madaar.demo', 'Admin123!', state), {
    role: 'admin',
  });
  assert.equal(authenticateDashboard('admin', 'admin@madaar.demo', 'WrongPass!', state), null);
  assert.equal(authenticateDashboard('admin', 'other@madaar.demo', 'Admin123!', state), null);

  // Company: verified against the admin-managed company accounts.
  const companySession = authenticateDashboard(
    'company',
    'COMPANY@madaar.demo',
    'Company123!',
    state
  );
  assert.ok(companySession && companySession.role === 'company');
  assert.equal(
    companySession && companySession.role === 'company' ? companySession.companyId : '',
    'co-tech-horizon'
  );
  assert.equal(authenticateDashboard('company', 'company@madaar.demo', 'nope', state), null);

  // Role scoping is strict: an account can never sign in under the other type,
  // so company credentials are rejected by the admin branch and vice versa.
  assert.equal(
    authenticateDashboard('admin', 'company@madaar.demo', 'Company123!', state),
    null,
    'company credentials must not open an admin session'
  );
  assert.equal(
    authenticateDashboard('company', 'admin@madaar.demo', 'Admin123!', state),
    null,
    'admin credentials must not open a company session'
  );

  // Email comparison tolerates surrounding whitespace and letter case; the
  // password comparison stays exact.
  const paddedSession = authenticateDashboard(
    'company',
    '  COMPANY@Madaar.demo ',
    'Company123!',
    state
  );
  assert.ok(paddedSession && paddedSession.role === 'company');
});

test('company course purchase: creates scoped enrollment and blocks duplicates', () => {
  const NOW = '2026-11-20T10:00:00Z';
  let state = freshState();

  // Happy path: Tech Horizon buys the (published) English course for u-st-1.
  const result = purchaseCourseForStudentState(
    state,
    'co-tech-horizon',
    'u-st-1',
    'c-english',
    NOW
  );
  assert.ok(result.ok, 'purchase should succeed');
  state = result.state;
  const created = state.enrollments.find(
    (enrollment) => enrollment.studentId === 'u-st-1' && enrollment.courseId === 'c-english'
  );
  assert.ok(created);
  assert.equal(created.companyId, 'co-tech-horizon');
  assert.equal(created.priceAtPurchase, 350);
  assert.equal(created.status, 'active');
  assert.equal(created.progressPct, 0);
  assert.equal(created.purchasedAt, NOW);
  assert.equal(created.source, 'company-purchase');
  assert.equal(
    getCompanyStudentEnrollment(state, 'co-tech-horizon', 'u-st-1', 'c-english')?.id,
    created.id
  );

  // Duplicate enrollment is blocked with a clear reason.
  assert.deepEqual(purchaseCourseForStudentState(state, 'co-tech-horizon', 'u-st-1', 'c-english', NOW), {
    ok: false,
    reason: 'already-enrolled',
  });

  // A hand-submitted foreign student id is refused (u-st-5 belongs to Binyan).
  assert.deepEqual(
    purchaseCourseForStudentState(state, 'co-tech-horizon', 'u-st-5', 'c-biz-essentials', NOW),
    { ok: false, reason: 'student-not-yours' }
  );

  // Draft courses cannot be purchased.
  assert.deepEqual(
    purchaseCourseForStudentState(state, 'co-tech-horizon', 'u-st-2', 'c-procurement', NOW),
    { ok: false, reason: 'course-unpublished' }
  );

  // Inactive companies cannot purchase.
  assert.deepEqual(purchaseCourseForStudentState(state, 'co-rowad', 'u-st-8', 'c-english', NOW), {
    ok: false,
    reason: 'company-inactive',
  });

  // Unknown hand-submitted student ids are refused.
  assert.deepEqual(
    purchaseCourseForStudentState(state, 'co-tech-horizon', 'stu-fake', 'c-english', NOW),
    { ok: false, reason: 'student-not-found' }
  );
});

test('company purchase history is company-scoped and ordered newest first', () => {
  const NOW = '2026-11-20T10:00:00Z';
  const EARLIER = '2026-11-10T10:00:00Z';
  let state = freshState();

  const first = purchaseCourseForStudentState(state, 'co-tech-horizon', 'u-st-1', 'c-english', EARLIER);
  assert.ok(first.ok);
  state = first.state;
  const second = purchaseCourseForStudentState(
    state,
    'co-tech-horizon',
    'u-st-2',
    'c-biz-essentials',
    NOW
  );
  assert.ok(second.ok);
  state = second.state;

  const history = getCompanyPurchaseHistory(state, 'co-tech-horizon');
  // Seeded enrollments of its own students are included, newest purchase first.
  assert.ok(history.length >= 2);
  assert.equal(history[0].enrollment.courseId, 'c-biz-essentials');
  assert.equal(history[0].price, 450);
  assert.ok(
    history.every((record) => isCompanyStudent(state, 'co-tech-horizon', record.enrollment.studentId))
  );

  // Binyan never sees Tech Horizon's purchases (different company ids and
  // students owned by different companies).
  const binyanHistory = getCompanyPurchaseHistory(state, 'co-binyan');
  assert.ok(binyanHistory.every((record) => record.enrollment.companyId !== 'co-tech-horizon'));
  assert.ok(
    binyanHistory.every((record) => isCompanyStudent(state, 'co-binyan', record.enrollment.studentId))
  );
});

test('demo lesson progress syncs into company-purchase enrollments only', () => {
  const NOW = '2026-11-20T10:00:00Z';
  let state = freshState();
  const purchase = purchaseCourseForStudentState(state, 'co-tech-horizon', 'u-st-1', 'c-english', NOW);
  assert.ok(purchase.ok);
  state = purchase.state;

  const course = state.courses.find((item) => item.id === 'c-english')!;
  const lessons = getAdminLessons(course);
  assert.ok(lessons.length > 0);
  const findPurchased = () =>
    state.enrollments.find(
      (enrollment) => enrollment.studentId === 'u-st-1' && enrollment.courseId === 'c-english'
    );

  // Simulate the student completing one lesson of the purchased course.
  let learning = enrollDemoCourseState(createEmptyDemoLearningState(), course.id);
  learning = toggleDemoLessonState(learning, course.id, lessons[0].id, NOW);
  state = syncCompanyPurchaseProgress(state, 'u-st-1', learning);
  assert.equal(findPurchased()?.progressPct, Math.round((1 / lessons.length) * 100));

  // Completing every lesson (fresh demo progress state, each lesson once)
  // flips the enrollment to completed.
  let learningAll = enrollDemoCourseState(createEmptyDemoLearningState(), course.id);
  for (const lesson of lessons) {
    learningAll = toggleDemoLessonState(learningAll, course.id, lesson.id, NOW);
  }
  state = syncCompanyPurchaseProgress(state, 'u-st-1', learningAll);
  assert.equal(findPurchased()?.status, 'completed');
  assert.equal(findPurchased()?.progressPct, 100);

  // Seeded (non-purchase) enrollments are never rewritten by the sync.
  const seeded = state.enrollments.find((enrollment) => enrollment.id === 'enr-02')!;
  const afterSync = syncCompanyPurchaseProgress(state, 'u-st-1', learningAll);
  assert.equal(
    afterSync.enrollments.find((enrollment) => enrollment.id === 'enr-02')?.progressPct,
    seeded.progressPct
  );
});

test('purchased admin courses bridge into the demo course-player model', () => {
  const state = freshState();
  const course = state.courses.find((item) => item.id === 'c-english')!;
  const bridged = adminCourseToDemoCourse(
    course,
    state.users.find((user) => user.id === course.instructorId)
  );
  assert.equal(bridged.id, course.id);
  assert.equal(bridged.titleEn, course.titleEn);
  assert.equal(bridged.sections.length, course.sections.length);
  assert.equal(bridged.sections[0].lessons.length, course.sections[0].lessons.length);
  assert.ok(bridged.sections[0].lessons[0].videoUrl);
});

test('admin company CRUD: create and toggle status', () => {
  let state = freshState();
  const before = state.companies.length;
  state = createCompanyState(state, {
    nameAr: 'شركة تجريبية',
    nameEn: 'Demo Co.',
    email: 'demo@company.sa',
    password: 'demo1234',
    status: 'active',
  });
  assert.equal(state.companies.length, before + 1);
  const created = state.companies[0];
  assert.ok(created.id.startsWith('co-'));
  assert.ok(created.createdAt);

  state = setCompanyStatusState(state, created.id, 'inactive');
  assert.equal(state.companies[0].status, 'inactive');
});

test('exam attempt attribution is student-aware (used by company dashboards)', () => {
  const attempts = [
    attempt({ id: 'a1', studentId: 'u-st-1', submittedAt: '2026-11-02T10:22:00Z' }),
    attempt({ id: 'a2', studentId: 'u-st-3', submittedAt: '2026-11-04T13:51:00Z' }),
    attempt({ id: 'a3', studentId: undefined, submittedAt: '2026-11-05T09:00:00Z' }),
    attempt({ id: 'a4', studentId: 'u-st-1', submittedAt: null }),
  ];

  assert.equal(countSubmittedAttempts(attempts, 'ex-biz-midterm'), 3, 'legacy: all submitted');
  assert.equal(countSubmittedAttempts(attempts, 'ex-biz-midterm', 'u-st-1'), 1, 'per student');
  assert.equal(countSubmittedAttempts(attempts, 'ex-biz-midterm', 'u-st-2'), 0, 'other student');
  assert.equal(countSubmittedAttempts(attempts, 'ex-biz-midterm', null), 1, 'unattributed only');
});
