import test from 'node:test';
import assert from 'node:assert/strict';
import { LEARNING_PATHS } from '../data/learningPlatform';
import { PROGRAMS } from '../data/programs';
import { filterPrograms } from './programFilter';
import {
  computeCourseProgressPct,
  computeDashboardMetrics,
  computeLearningPathProgress,
  createEmptyStudentState,
  createGoalState,
  deleteGoalState,
  enrollInProgramState,
  filterLibraryCourses,
  toggleCourseModuleState,
  toggleGroupMembershipState,
  toggleSavedProgramState,
  updateGoalState,
  updateProjectStatusState,
} from './studentPlatform';

test('createEmptyStudentState starts clean without fabricated metrics or fake enrollments', () => {
  const state = createEmptyStudentState();
  const metrics = computeDashboardMetrics(state, PROGRAMS);
  assert.equal(metrics.enrolledCount, 0);
  assert.equal(metrics.completedCount, 0);
  assert.equal(metrics.creditHoursEnrolled, 0);
  assert.equal(metrics.overallProgressPct, 0);
  assert.equal(state.activity.length, 0);
  assert.equal(state.account.signedIn, false);
});

test('filterPrograms supports category and Arabic sorting filters', () => {
  const business = filterPrograms(PROGRAMS, {
    kind: 'diplomas',
    search: '',
    type: '',
    category: 'business',
    sort: 'title_asc',
  });
  assert.equal(business.length, 2);
  assert.ok(business.every((p) => p.category === 'business'));
});

test('enrolling and completing all 4 modules transitions course to completed and updates dashboard', () => {
  const course = PROGRAMS.find((p) => p.id === '5')!;
  let state = createEmptyStudentState();
  state = enrollInProgramState(state, course, '2026-11-21T10:00:00Z');
  assert.equal(state.enrollments[course.id].status, 'in_progress');
  assert.equal(computeCourseProgressPct(course, state.enrollments[course.id]), 0);

  state = toggleCourseModuleState(state, course, 0, '2026-11-21T10:01:00Z');
  state = toggleCourseModuleState(state, course, 1, '2026-11-21T10:02:00Z');
  assert.equal(computeCourseProgressPct(course, state.enrollments[course.id]), 50);

  state = toggleCourseModuleState(state, course, 2, '2026-11-21T10:03:00Z');
  state = toggleCourseModuleState(state, course, 3, '2026-11-21T10:04:00Z');
  assert.equal(state.enrollments[course.id].status, 'completed');
  assert.equal(computeCourseProgressPct(course, state.enrollments[course.id]), 100);

  const metrics = computeDashboardMetrics(state, PROGRAMS);
  assert.equal(metrics.enrolledCount, 1);
  assert.equal(metrics.completedCount, 1);
  assert.equal(metrics.overallProgressPct, 100);
  assert.equal(metrics.creditHoursEnrolled, 30);
});

test('filterLibraryCourses isolates enrolled, completed, and saved courses cleanly', () => {
  const courseA = PROGRAMS.find((p) => p.id === '5')!;
  const courseB = PROGRAMS.find((p) => p.id === '8')!;

  let state = createEmptyStudentState();
  state = enrollInProgramState(state, courseA);
  state = toggleSavedProgramState(state, courseB);

  assert.equal(filterLibraryCourses(state, PROGRAMS, 'all').length, 2);
  assert.equal(filterLibraryCourses(state, PROGRAMS, 'in_progress').map((c) => c.id).join(','), '5');
  assert.equal(filterLibraryCourses(state, PROGRAMS, 'saved').map((c) => c.id).join(','), '8');
  assert.equal(filterLibraryCourses(state, PROGRAMS, 'completed').length, 0);
});

test('computeLearningPathProgress derives completion and next recommended course accurately', () => {
  const path = LEARNING_PATHS[0]; // ids: ['5', '6']
  const course5 = PROGRAMS.find((p) => p.id === '5')!;
  let state = createEmptyStudentState();
  state = enrollInProgramState(state, course5);
  for (let i = 0; i < course5.modulesAr.length; i += 1) {
    state = toggleCourseModuleState(state, course5, i);
  }

  const progress = computeLearningPathProgress(path, state, PROGRAMS);
  assert.equal(progress.totalCourses, 2);
  assert.equal(progress.completedCourses, 1);
  assert.equal(progress.progressPct, 50);
  assert.equal(progress.nextRecommendedProgramId, '6');
});

test('goals CRUD creates, clamps progress, completes, and deletes goals', () => {
  let state = createEmptyStudentState();
  state = createGoalState(state, { title: 'إتمام المحور الأول', targetDate: '2026-12-15', progress: 40 });
  assert.equal(state.goals.length, 1);
  const goalId = state.goals[0].id;
  assert.equal(state.goals[0].status, 'active');

  state = updateGoalState(state, goalId, { progress: 140 });
  assert.equal(state.goals[0].progress, 100);
  assert.equal(state.goals[0].status, 'completed');

  state = deleteGoalState(state, goalId);
  assert.equal(state.goals.length, 0);
});

test('project status updates and study group memberships toggle properly', () => {
  let state = createEmptyStudentState();
  state = updateProjectStatusState(
    state,
    'proj-5',
    'مشروع تخطيط تشغيلي',
    'Operational Plan',
    'submitted',
    'Draft v1 ready'
  );
  assert.equal(state.projectProgress['proj-5'].status, 'submitted');
  assert.equal(state.projectProgress['proj-5'].submissionNote, 'Draft v1 ready');

  state = toggleGroupMembershipState(state, 'group-business', 'حلقة النقاش', 'Study Circle');
  assert.deepEqual(state.joinedGroupIds, ['group-business']);
  state = toggleGroupMembershipState(state, 'group-business', 'حلقة النقاش', 'Study Circle');
  assert.deepEqual(state.joinedGroupIds, []);
});
