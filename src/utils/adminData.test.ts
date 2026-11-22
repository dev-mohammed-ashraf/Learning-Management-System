import test from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultAdminState, DEMO_COMPANY_ACCOUNT, DEMO_COMPANY_ID } from '../data/adminData';
import type { AdminDataState } from '../types/admin';
import { authenticateDashboard } from './dashboardAuth';
import {
  addCategoryState,
  addExamQuestionState,
  addLessonState,
  addSectionState,
  computeAdminStats,
  createCourseState,
  createExamState,
  deleteCategoryState,
  deleteCourseState,
  deleteExamQuestionState,
  deleteExamState,
  deleteSectionState,
  deleteUserState,
  enrollStudentInCourseState,
  ensureDemoCompanyAccount,
  formatAdminMinutes,
  getAdminCourseStats,
  getCategoryCourseCounts,
  getCourseEnrollmentCounts,
  getExamPassingMarks,
  getExamTotalMarks,
  getMonthlyEnrollmentActivity,
  removeEnrollmentState,
  reorderExamQuestionsState,
  reorderLessonsState,
  reorderSectionsState,
  setCourseStatusState,
  setExamStatusState,
  updateCategoryState,
  updateCourseState,
  updateExamQuestionState,
  updateUserState,
} from './adminData';

function freshState(): AdminDataState {
  return createDefaultAdminState();
}

test('admin seed data is complete and internally consistent', () => {
  const state = freshState();
  assert.ok(state.courses.length >= 5);
  assert.ok(state.users.length >= 10);
  assert.ok(state.enrollments.length >= 10);
  assert.ok(state.categories.length >= 4);
  const userIds = new Set(state.users.map((u) => u.id));
  for (const course of state.courses) {
    assert.ok(userIds.has(course.instructorId), 'instructor must exist');
  }
  for (const enrollment of state.enrollments) {
    assert.ok(userIds.has(enrollment.studentId), 'student must exist');
    assert.ok(state.courses.some((c) => c.id === enrollment.courseId), 'course must exist');
  }
});

test('dashboard stats count courses, roles, enrollments, and statuses', () => {
  const stats = computeAdminStats(freshState());
  assert.equal(stats.totalCourses, 6);
  assert.equal(stats.totalInstructors, 4);
  assert.equal(stats.totalStudents, 10);
  assert.equal(stats.totalEnrollments, 16);
  assert.equal(stats.publishedCourses, 4);
  assert.equal(stats.draftCourses, 2);
});

test('course lifecycle: create, update status, delete cascades enrollments', () => {
  let state = freshState();
  const before = state.courses.length;

  state = createCourseState(
    state,
    {
      titleAr: 'دورة تجريبية جديدة',
      titleEn: 'New Demo Course',
      descriptionAr: 'وصف',
      descriptionEn: 'Description',
      image: '/src/assets/images/digital_learning_1795281370106.jpg',
      instructorId: 'u-ins-2',
      categoryId: 'cat-service',
      price: 199,
      level: 'beginner',
      status: 'draft',
    },
    '2026-11-01T10:00:00Z'
  );
  assert.equal(state.courses.length, before + 1);
  const created = state.courses[0];
  assert.equal(created.status, 'draft');
  assert.deepEqual(created.sections, []);

  state = setCourseStatusState(state, created.id, 'published', '2026-11-02T10:00:00Z');
  assert.equal(state.courses.find((c) => c.id === created.id)?.status, 'published');

  state = updateCourseState(state, created.id, { price: 250 }, '2026-11-03T10:00:00Z');
  assert.equal(state.courses.find((c) => c.id === created.id)?.price, 250);

  state = enrollStudentInCourseState(state, 'u-st-1', created.id, '2026-11-04T10:00:00Z');
  assert.equal(state.enrollments.filter((e) => e.courseId === created.id).length, 1);

  state = deleteCourseState(state, created.id);
  assert.equal(state.courses.length, before);
  assert.equal(state.enrollments.filter((e) => e.courseId === created.id).length, 0);
});

test('curriculum: sections and lessons add, delete, and reorder correctly', () => {
  let state = freshState();
  const courseId = 'c-biz-essentials';
  const course = state.courses.find((c) => c.id === courseId)!;
  const firstSectionId = course.sections[0].id;

  state = addSectionState(state, courseId, 'قسم تجريبي', 'Demo Section', '2026-11-01T10:00:00Z');
  const updated = state.courses.find((c) => c.id === courseId)!;
  assert.equal(updated.sections.length, course.sections.length + 1);
  const newSection = updated.sections[updated.sections.length - 1];

  state = addLessonState(
    state,
    courseId,
    newSection.id,
    {
      titleAr: 'درس تجريبي',
      titleEn: 'Demo Lesson',
      descriptionAr: 'وصف',
      descriptionEn: 'Desc',
      durationMinutes: 6,
      videoUrl: 'https://example.com/video.mp4',
      isPreview: true,
    },
    '2026-11-01T10:05:00Z'
  );
  let afterAdd = state.courses.find((c) => c.id === courseId)!;
  assert.equal(afterAdd.sections[afterAdd.sections.length - 1].lessons.length, 1);

  // Move the new section to the top
  state = reorderSectionsState(
    state,
    courseId,
    afterAdd.sections.length - 1,
    0,
    '2026-11-01T10:06:00Z'
  );
  afterAdd = state.courses.find((c) => c.id === courseId)!;
  assert.equal(afterAdd.sections[0].id, newSection.id);

  // Deleting a section removes its lessons
  const lessonsBeforeDelete = getAdminCourseStats(afterAdd).lessons;
  state = deleteSectionState(state, courseId, firstSectionId, '2026-11-01T10:08:00Z');
  const afterDelete = state.courses.find((c) => c.id === courseId)!;
  const removedCount = afterAdd.sections.find((s) => s.id === firstSectionId)!.lessons.length;
  assert.equal(getAdminCourseStats(afterDelete).lessons, lessonsBeforeDelete - removedCount);
  assert.ok(!afterDelete.sections.some((s) => s.id === firstSectionId));

  const allLessonIds = afterDelete.sections.flatMap((s) => s.lessons.map((l) => l.id));
  assert.equal(new Set(allLessonIds).size, allLessonIds.length);
});

test('enrollments dedupe per student+course and removal works', () => {
  let state = freshState();
  state = enrollStudentInCourseState(state, 'u-st-4', 'c-english', '2026-11-01T10:00:00Z');
  const countAfterFirst = state.enrollments.length;
  state = enrollStudentInCourseState(state, 'u-st-4', 'c-english', '2026-11-02T10:00:00Z');
  assert.equal(state.enrollments.length, countAfterFirst, 'duplicate enrollment is blocked');

  const created = state.enrollments.find(
    (e) => e.studentId === 'u-st-4' && e.courseId === 'c-english'
  )!;
  state = removeEnrollmentState(state, created.id);
  assert.equal(state.enrollments.length, countAfterFirst - 1);
});

test('user updates and deletion cascade their enrollments', () => {
  let state = freshState();
  state = updateUserState(state, 'u-st-4', {
    name: 'اسم معدل',
    role: 'instructor',
    status: 'active',
  });
  const updated = state.users.find((u) => u.id === 'u-st-4')!;
  assert.equal(updated.name, 'اسم معدل');
  assert.equal(updated.role, 'instructor');
  assert.equal(updated.status, 'active');

  state = deleteUserState(state, 'u-st-4');
  assert.ok(!state.users.some((u) => u.id === 'u-st-4'));
  assert.equal(state.enrollments.filter((e) => e.studentId === 'u-st-4').length, 0);
});

test('categories CRUD unassigns courses on delete and counts courses', () => {
  let state = freshState();
  const counts = getCategoryCourseCounts(state);
  assert.equal(counts['cat-business'], 2);
  assert.equal(counts['cat-logistics'], 1);

  state = addCategoryState(state, {
    nameAr: 'تصنيف تجريبي',
    nameEn: 'Demo Category',
    descriptionAr: 'وصف',
    descriptionEn: 'Desc',
    icon: '🧪',
  });
  const created = state.categories[state.categories.length - 1];
  assert.ok(created.id.startsWith('cat-'));

  state = updateCategoryState(state, created.id, { nameAr: 'تصنيف معدل' });
  assert.equal(state.categories.find((c) => c.id === created.id)?.nameAr, 'تصنيف معدل');

  state = deleteCategoryState(state, 'cat-business');
  assert.ok(!state.categories.some((c) => c.id === 'cat-business'));
  for (const course of state.courses) {
    assert.notEqual(course.categoryId, 'cat-business', 'courses become uncategorized');
  }
});

test('charts data: popularity ranking and monthly activity buckets', () => {
  const state = freshState();
  const popularity = getCourseEnrollmentCounts(state);
  assert.ok(popularity[0].count >= popularity[popularity.length - 1].count);
  assert.equal(
    popularity.reduce((sum, entry) => sum + entry.count, 0),
    state.enrollments.length
  );

  const activity = getMonthlyEnrollmentActivity(state, 6, new Date('2026-11-15T00:00:00Z'));
  assert.equal(activity.length, 6);
  assert.ok(activity.every((b) => b.count >= 0));
});

test('exam seed data is consistent: courses exist, totals match questions', () => {
  const state = freshState();
  assert.ok(state.exams.length >= 3);
  const courseIds = new Set(state.courses.map((course) => course.id));
  for (const exam of state.exams) {
    assert.ok(exam.questions.length >= 1, `${exam.id} needs questions`);
    assert.ok(exam.durationMinutes > 0);
    assert.ok(exam.passingPct > 0 && exam.passingPct <= 100);
    assert.ok(exam.maxAttempts >= 1);
    for (const question of exam.questions) {
      assert.ok(question.marks > 0);
      if (question.type === 'multiple_choice') {
        assert.ok(question.options.length >= 2, 'MC needs options');
        assert.ok(question.options.some((option) => option.id === question.correctOptionId), 'MC correct option must exist');
      }
    }
    // courseId either matches a catalog course or is a demo-learning course id
    assert.ok(courseIds.has(exam.courseId) || exam.courseId.startsWith('demo-'));
  }
});

test('exam totals are computed from question marks and passing score follows pct', () => {
  const state = freshState();
  const exam = state.exams.find((item) => item.id === 'ex-biz-midterm')!;
  const total = getExamTotalMarks(exam);
  assert.equal(total, exam.questions.reduce((sum, question) => sum + question.marks, 0));
  assert.equal(getExamPassingMarks(exam), Math.round((total * exam.passingPct) / 100));
});

test('exam lifecycle: create with questions, update, publish, delete', () => {
  let state = freshState();
  const before = state.exams.length;
  state = createExamState(
    state,
    {
      titleAr: 'اختبار تجريبي',
      titleEn: 'Demo Exam',
      descriptionAr: '',
      descriptionEn: '',
      courseId: 'c-biz-essentials',
      courseTitleAr: 'أساسيات إدارة الأعمال التطبيقية',
      courseTitleEn: 'Applied Business Administration Essentials',
      sectionTitleAr: '',
      sectionTitleEn: '',
      durationMinutes: 15,
      passingPct: 60,
      maxAttempts: 2,
      availableFrom: null,
      availableTo: null,
      showCorrectAnswers: true,
      instructionsAr: 'أجب عن جميع الأسئلة.',
      instructionsEn: 'Answer all questions.',
      status: 'draft',
      questions: [
        {
          id: 'q-t1',
          type: 'true_false',
          textAr: 'سؤال صح/خطأ',
          textEn: 'True/False question',
          options: [],
          correctOptionId: null,
          correctTrueFalse: true,
          expectedAnswerAr: '',
          expectedAnswerEn: '',
          marks: 2,
        },
        {
          id: 'q-t2',
          type: 'short_answer',
          textAr: 'سؤال إجابة قصيرة',
          textEn: 'Short answer question',
          options: [],
          correctOptionId: null,
          correctTrueFalse: false,
          expectedAnswerAr: 'التنظيم',
          expectedAnswerEn: 'organizing',
          image: 'https://example.com/q.png',
          marks: 3,
        },
      ],
    },
    '2026-11-01T10:00:00Z'
  );
  assert.equal(state.exams.length, before + 1);
  const created = state.exams[0];
  assert.equal(created.status, 'draft');
  assert.equal(created.questions.length, 2);
  assert.equal(getExamTotalMarks(created), 5);
  assert.equal(created.questions[1].image, 'https://example.com/q.png', 'question image persists');

  state = addExamQuestionState(
    state,
    created.id,
    {
      type: 'true_false',
      textAr: 'سؤال إضافي',
      textEn: 'Extra question',
      options: [],
      correctOptionId: null,
      correctTrueFalse: true,
      expectedAnswerAr: '',
      expectedAnswerEn: '',
      marks: 3,
    },
    '2026-11-01T10:05:00Z'
  );
  assert.equal(getExamTotalMarks(state.exams.find((exam) => exam.id === created.id)!), 8);

  state = setExamStatusState(state, created.id, 'published', '2026-11-02T10:00:00Z');
  assert.equal(state.exams.find((exam) => exam.id === created.id)?.status, 'published');

  state = deleteExamState(state, created.id);
  assert.equal(state.exams.length, before);
});

test('exam question builder: edit, delete, reorder questions', () => {
  let state = freshState();
  const examId = 'ex-biz-midterm';
  const exam = state.exams.find((item) => item.id === examId)!;
  const firstQuestionId = exam.questions[0].id;
  const secondQuestionId = exam.questions[1].id;

  state = updateExamQuestionState(state, examId, firstQuestionId, { marks: 5 }, '2026-11-01T10:00:00Z');
  assert.equal(state.exams.find((item) => item.id === examId)!.questions[0].marks, 5);

  state = reorderExamQuestionsState(state, examId, 1, 0, '2026-11-01T10:01:00Z');
  const reordered = state.exams.find((item) => item.id === examId)!;
  assert.equal(reordered.questions[0].id, secondQuestionId);
  assert.equal(reordered.questions[1].id, firstQuestionId);

  const countBefore = reordered.questions.length;
  state = deleteExamQuestionState(state, examId, secondQuestionId, '2026-11-01T10:02:00Z');
  const afterDelete = state.exams.find((item) => item.id === examId)!;
  assert.equal(afterDelete.questions.length, countBefore - 1);
  assert.ok(!afterDelete.questions.some((question) => question.id === secondQuestionId));
});

test('stale persisted snapshots are healed so the demo company login always works', () => {
  const seed = freshState();

  // Snapshot saved by an older build: the demo company drifted (old password,
  // deactivated status). It must be restored to the canonical demo credentials.
  const drifted: AdminDataState = {
    ...seed,
    companies: [
      { ...seed.companies[0], password: 'old-demo-2025', status: 'inactive' },
      ...seed.companies.slice(1),
    ],
  };
  const healed = ensureDemoCompanyAccount(drifted);
  const demo = healed.companies.find((company) => company.id === DEMO_COMPANY_ID);
  assert.ok(demo);
  assert.equal(demo.email, DEMO_COMPANY_ACCOUNT.email);
  assert.equal(demo.password, DEMO_COMPANY_ACCOUNT.password);
  assert.equal(demo.status, 'active');
  // The healed snapshot signs in exactly like the login page's pre-filled form.
  assert.deepEqual(authenticateDashboard('company', 'company@madaar.demo', 'Company123!', healed), {
    role: 'company',
    companyId: DEMO_COMPANY_ID,
  });
  // Other admin-managed accounts stay exactly as stored (Rowad stays inactive).
  assert.equal(
    healed.companies.find((company) => company.email === 'training@rowad.sa')?.status,
    'inactive'
  );

  // Canonical state passes through untouched (idempotent, no accidental edits).
  assert.deepEqual(ensureDemoCompanyAccount(seed), seed);

  // Snapshot missing the demo company entirely → the seeded record is restored.
  const withoutDemo: AdminDataState = {
    ...seed,
    companies: seed.companies.filter((company) => company.id !== DEMO_COMPANY_ID),
  };
  const restored = ensureDemoCompanyAccount(withoutDemo);
  assert.ok(restored.companies.some((company) => company.id === DEMO_COMPANY_ID));

  // A legacy record carrying the demo email under a different id is healed in
  // place (id preserved so stored student assignments keep working).
  const legacyId: AdminDataState = {
    ...seed,
    companies: [
      { ...seed.companies[0], id: 'co-legacy', email: 'Company@Madaar.Demo ' },
      ...seed.companies.slice(1),
    ],
  };
  const legacyHealed = ensureDemoCompanyAccount(legacyId);
  const legacyDemo = legacyHealed.companies.find((company) => company.id === 'co-legacy');
  assert.ok(legacyDemo);
  assert.equal(legacyDemo.email, DEMO_COMPANY_ACCOUNT.email);
  assert.equal(legacyDemo.password, DEMO_COMPANY_ACCOUNT.password);
  assert.equal(legacyDemo.status, 'active');
});
