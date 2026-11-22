import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_COURSES } from '../data/demoCourses';
import type { DemoCourse } from '../types/coursePlayer';
import {
  computeDemoCourseProgressPct,
  countCompletedDemoLessons,
  createEmptyDemoLearningState,
  enrollDemoCourseState,
  formatDemoLessonDuration,
  formatDemoTotalDuration,
  getDemoAdjacentLessons,
  getDemoCourseStats,
  getDemoLessonPosition,
  getDemoLessons,
  resolveDemoStartLesson,
  setDemoLastLessonState,
  toggleDemoLessonState,
} from './demoLearning';

const course: DemoCourse = DEMO_COURSES[0];

test('demo courses ship with well-formed curricula and unique lesson ids', () => {
  assert.ok(DEMO_COURSES.length >= 2);
  for (const demoCourse of DEMO_COURSES) {
    const lessons = getDemoLessons(demoCourse);
    assert.ok(lessons.length >= 8, `${demoCourse.id} should have a real curriculum`);
    assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length, 'lesson ids must be unique');
    assert.ok(demoCourse.sections.length >= 2, 'course should have multiple sections');
    for (const lesson of lessons) {
      assert.ok(lesson.videoUrl.startsWith('https://'), 'demo videos must be public URLs');
      assert.ok(lesson.durationMinutes > 0);
      assert.ok(lesson.titleAr && lesson.titleEn && lesson.descriptionAr && lesson.descriptionEn);
    }
  }
  const stats = getDemoCourseStats(course);
  assert.equal(stats.totalLessons, 12);
  assert.equal(stats.totalMinutes, 84);
});

test('demo enrollment is idempotent and isolated from real platform enrollments', () => {
  let state = createEmptyDemoLearningState();
  state = enrollDemoCourseState(state, course.id, '2026-11-22T10:00:00Z');
  assert.deepEqual(state.enrolledDemoCourseIds, [course.id]);

  // Enrolling again must not duplicate the entry
  state = enrollDemoCourseState(state, course.id, '2026-11-22T10:01:00Z');
  assert.equal(state.enrolledDemoCourseIds.length, 1);
  assert.ok(state.progress[course.id], 'enrollment creates a progress record');
});

test('toggling lesson completion never counts the same lesson twice', () => {
  let state = enrollDemoCourseState(createEmptyDemoLearningState(), course.id);
  const firstLesson = getDemoLessons(course)[0];

  state = toggleDemoLessonState(state, course.id, firstLesson.id, '2026-11-22T10:02:00Z');
  state = toggleDemoLessonState(state, course.id, firstLesson.id, '2026-11-22T10:03:00Z');
  const record = state.progress[course.id];
  assert.deepEqual(record.completedLessonIds, [], 'double toggle must undo completion');

  state = toggleDemoLessonState(state, course.id, firstLesson.id, '2026-11-22T10:04:00Z');
  assert.equal(countCompletedDemoLessons(course, state.progress[course.id]), 1);
  assert.equal(computeDemoCourseProgressPct(course, state.progress[course.id]), 8);
});

test('completing every lesson reaches 100% and progress rounds honestly', () => {
  let state = enrollDemoCourseState(createEmptyDemoLearningState(), course.id);
  const lessons = getDemoLessons(course);
  for (const lesson of lessons) {
    state = toggleDemoLessonState(state, course.id, lesson.id, '2026-11-22T10:05:00Z');
  }
  assert.equal(countCompletedDemoLessons(course, state.progress[course.id]), lessons.length);
  assert.equal(computeDemoCourseProgressPct(course, state.progress[course.id]), 100);
});

test('lesson navigation resolves positions and previous/next correctly', () => {
  const lessons = getDemoLessons(course);
  const first = lessons[0];
  const second = lessons[1];
  const last = lessons[lessons.length - 1];

  assert.deepEqual(getDemoLessonPosition(course, first.id), { index: 1, total: lessons.length });
  assert.deepEqual(getDemoAdjacentLessons(course, first.id), { previous: null, next: second });
  assert.equal(getDemoAdjacentLessons(course, last.id).next, null);
  assert.equal(getDemoAdjacentLessons(course, last.id).previous, lessons[lessons.length - 2]);
  assert.deepEqual(getDemoAdjacentLessons(course, 'missing-id'), { previous: null, next: null });
});

test('start lesson resumes from the last opened lesson and skips completed ones', () => {
  let state = enrollDemoCourseState(createEmptyDemoLearningState(), course.id);
  const lessons = getDemoLessons(course);

  // Fresh enrollment starts at the first lesson
  assert.equal(resolveDemoStartLesson(course, state.progress[course.id]).id, lessons[0].id);

  // Opening a lesson sets the resume point
  state = setDemoLastLessonState(state, course.id, lessons[2].id, '2026-11-22T10:06:00Z');
  assert.equal(resolveDemoStartLesson(course, state.progress[course.id]).id, lessons[2].id);

  // Completing lessons 1-3 makes the first incomplete lesson the fallback
  state = toggleDemoLessonState(state, course.id, lessons[0].id);
  state = toggleDemoLessonState(state, course.id, lessons[1].id);
  state = toggleDemoLessonState(state, course.id, lessons[2].id);
  const resumed = resolveDemoStartLesson({ ...course }, undefined);
  assert.equal(resumed.id, lessons[0].id, 'no record falls back to the first lesson');
  const record = state.progress[course.id];
  assert.equal(resolveDemoStartLesson(course, { ...record, lastLessonId: null }).id, lessons[3].id);
});

test('duration formatting is bilingual with Arabic pluralization', () => {
  assert.equal(formatDemoLessonDuration(5, 'ar'), '5 دقائق');
  assert.equal(formatDemoLessonDuration(1, 'ar'), 'دقيقة واحدة');
  assert.equal(formatDemoLessonDuration(2, 'ar'), 'دقيقتان');
  assert.equal(formatDemoLessonDuration(15, 'ar'), '15 دقيقة');
  assert.equal(formatDemoLessonDuration(7, 'en'), '7 min');
  assert.equal(formatDemoTotalDuration(83, 'ar'), '1 س 23 د');
  assert.equal(formatDemoTotalDuration(45, 'en'), '45m');
  assert.equal(formatDemoTotalDuration(65, 'en'), '1h 5m');
});
