import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  GraduationCap,
  Layers,
  ListVideo,
  Lock,
  RotateCcw,
  X,
} from 'lucide-react';
import type { DemoCourse, DemoLearningState } from '../../types/coursePlayer';
import type { AdminExam, AdminExamAttempt } from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  computeDemoCourseProgressPct,
  countCompletedDemoLessons,
  formatDemoLessonDuration,
  formatDemoTotalDuration,
  getDemoAdjacentLessons,
  getDemoCourseProgress,
  getDemoCourseStats,
  getDemoLessonPosition,
  getDemoLessons,
  isDemoCourseEnrolled,
  resolveDemoStartLesson,
} from '../../utils/demoLearning';
import { ProgressBar } from '../common/ProgressBar';
import {
  countSubmittedAttempts,
  getBestAttempt,
  getExamTotalMarks,
} from '../../utils/studentExam';
import { CourseLessonSidebar } from './CourseLessonSidebar';
import { CourseVideoPlayer } from './CourseVideoPlayer';

interface CourseLearningPageProps {
  locale: Locale;
  course: DemoCourse;
  learning: DemoLearningState;
  onBackToLibrary: () => void;
  onEnroll: (courseId: string) => void;
  onToggleLesson: (courseId: string, lessonId: string) => void;
  onSelectLesson: (courseId: string, lessonId: string) => void;
  /** Published exams tied to this demo course + the student's demo attempts. */
  exams?: AdminExam[];
  examAttempts?: AdminExamAttempt[];
  onOpenExam?: (examId: string) => void;
}

/**
 * Demo course learning experience: header with progress, curriculum sidebar,
 * responsive video player, lesson info, and completion tracking (mock data,
 * localStorage only — never touches real enrollment records).
 */
export function CourseLearningPage({
  locale,
  course,
  learning,
  onBackToLibrary,
  onEnroll,
  onToggleLesson,
  onSelectLesson,
  exams = [],
  examAttempts = [],
  onOpenExam,
}: CourseLearningPageProps) {
  const isAr = locale === 'ar';
  const record = getDemoCourseProgress(learning, course.id);
  const enrolled = isDemoCourseEnrolled(learning, course.id);
  const completedLessonIds = useMemo(() => record?.completedLessonIds ?? [], [record]);
  const lessons = useMemo(() => getDemoLessons(course), [course]);
  const stats = getDemoCourseStats(course);
  const progressPct = computeDemoCourseProgressPct(course, record);
  const completedCount = countCompletedDemoLessons(course, record);

  const [activeLessonId, setActiveLessonId] = useState<string>(() =>
    resolveDemoStartLesson(course, record).id
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0];
  const position = getDemoLessonPosition(course, activeLesson.id) ?? {
    index: 1,
    total: lessons.length,
  };
  const { previous, next } = getDemoAdjacentLessons(course, activeLesson.id);
  const isLessonCompleted = completedLessonIds.includes(activeLesson.id);

  // Mobile drawer: lock page scroll and close on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen]);

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    onSelectLesson(course.id, lessonId);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompleted = () => {
    onToggleLesson(course.id, activeLesson.id);
  };

  const BackArrow = isAr ? ArrowRight : ArrowLeft;
  const NextArrow = isAr ? ChevronLeft : ChevronRight;
  const PrevArrow = isAr ? ChevronRight : ChevronLeft;

  const courseTitle = isAr ? course.titleAr : course.titleEn;
  const instructorName = isAr ? course.instructor.nameAr : course.instructor.nameEn;
  const instructorRole = isAr ? course.instructor.roleAr : course.instructor.roleEn;

  return (
    <div>
      {/* Learning toolbar: back, course identity, overall progress */}
      <div className="border-b border-[#DCE7ED] bg-[#EAF3F6]/70 backdrop-blur-sm dark:border-white/12 dark:bg-[#102238]/70">
        <div className="wrap pt-[122px] max-[1023px]:pt-[160px] max-[767px]:pt-[202px] pb-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
            <button
              type="button"
              onClick={onBackToLibrary}
              className="group inline-flex items-center gap-2 rounded-[10px] border border-[#DCE7ED] bg-white px-3.5 py-2 text-[0.85rem] font-bold text-[#183247] transition-colors hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/12 dark:bg-[#142D4E] dark:text-[#F1F5F9] dark:hover:border-[#28B5C5] dark:hover:text-[#28B5C5] cursor-pointer"
            >
              <BackArrow className="w-4 h-4" aria-hidden="true" />
              {isAr ? 'مكتبتي' : 'My Library'}
            </button>

            <div className="min-w-0">
              <div className="text-[0.72rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                {isAr ? 'تتعلم الآن · كورس تجريبي' : 'Now learning · Demo course'}
              </div>
              <h1 className="max-w-[460px] truncate text-[1.05rem] font-extrabold text-[#142D4E] sm:text-[1.2rem] dark:text-[#F1F5F9]">
                {courseTitle}
              </h1>
              <div className="truncate text-[0.78rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                {instructorName} · {instructorRole}
              </div>
            </div>

            <div className="ms-auto flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-[12px] border border-[#DCE7ED] bg-white px-4 py-2.5 dark:border-white/12 dark:bg-[#142D4E]">
                <div>
                  <div className="text-[0.72rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                    {isAr ? 'التقدم' : 'Progress'}
                  </div>
                  <div className="num text-[1.05rem] font-extrabold leading-none text-[#176B87] dark:text-[#28B5C5]">
                    {progressPct}%
                  </div>
                </div>
                <div className="w-[120px] sm:w-[150px]">
                  <ProgressBar
                    value={progressPct}
                    size="sm"
                    label={isAr ? 'نسبة إتمام الكورس' : 'Course completion'}
                  />
                </div>
                <div className="num hidden text-[0.78rem] font-semibold text-[#64748B] sm:block dark:text-[#B8C7D9]">
                  {completedCount}/{stats.totalLessons} {isAr ? 'دروس مكتملة' : 'lessons done'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#176B87] px-4 py-2.5 text-[0.85rem] font-bold text-white hover:bg-[#142D4E] lg:hidden dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
              >
                <ListVideo className="w-4 h-4" aria-hidden="true" />
                {isAr ? 'محتوى الكورس' : 'Course Content'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap pt-6 pb-[72px] max-[767px]:pb-[48px]">
        {!enrolled ? (
          /* Enrollment gate — demo content unlocks after simulated enrollment */
          <div className="mx-auto max-w-[760px] space-y-5 rounded-[18px] border border-[#DCE7ED] bg-white p-6 text-center shadow-[var(--shadow-sm)] sm:p-9 dark:border-white/12 dark:bg-[#142D4E]">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#DDF3F5] dark:bg-[#1B3553]">
              <Lock className="w-6 h-6 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[1.3rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                {courseTitle}
              </h2>
              <p className="mx-auto max-w-[58ch] text-[0.92rem] leading-[1.9] text-[#64748B] dark:text-[#B8C7D9]">
                {isAr ? course.descriptionAr : course.descriptionEn}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.78rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                <GraduationCap className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                {instructorName}
              </span>
              <span className="num inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.78rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                <ListVideo className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                {stats.totalLessons} {isAr ? 'دروس' : 'lessons'}
              </span>
              <span className="num inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.78rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                <Clock className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                {formatDemoTotalDuration(stats.totalMinutes, locale)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.78rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                <BookOpen className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                {isAr ? course.levelAr : course.levelEn}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onEnroll(course.id)}
              className="mx-auto block rounded-[12px] bg-[#176B87] px-8 py-3 text-[0.98rem] font-bold text-white transition-colors hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
            >
              {isAr ? 'اشترك في الكورس' : 'Enroll in Course'}
            </button>
            <p className="text-[0.78rem] text-[#64748B] dark:text-[#B8C7D9]">
              {isAr
                ? 'تسجيل تجريبي مجاني لأغراض العرض فقط — دون أي رسوم أو بيانات حقيقية.'
                : 'Free demo enrollment for preview purposes only — no fees, no real data.'}
            </p>
            <div>
              <button
                type="button"
                onClick={onBackToLibrary}
                className="rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-5 py-2.5 text-[0.85rem] font-bold text-[#183247] hover:bg-[#DDF3F5] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9] dark:hover:bg-[#1B3553] cursor-pointer"
              >
                {isAr ? 'الرجوع إلى مكتبتي' : 'Back to My Library'}
              </button>
            </div>
          </div>
        ) : (
          /* Enrollment complete — the learning experience */
          <>
            {progressPct === 100 && (
              <div className="mb-6 flex items-center gap-3 rounded-[14px] border border-[#1F8A5B]/35 bg-[#E7F5EE] px-5 py-4 dark:border-[#2ECC71]/35 dark:bg-[#102E24]">
                <CheckCircle2
                  className="w-6 h-6 flex-none text-[#1F8A5B] dark:text-[#6EE7B7]"
                  aria-hidden="true"
                />
                <p className="text-[0.92rem] font-bold text-[#1F8A5B] dark:text-[#6EE7B7]">
                  {isAr
                    ? 'ممتاز! أكملت جميع دروس هذا الكورس التجريبي.'
                    : 'Great job! You completed every lesson in this demo course.'}
                </p>
              </div>
            )}

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_348px]">
              {/* Main column: video + lesson info */}
              <div className="min-w-0 space-y-5">
                <CourseVideoPlayer
                  key={activeLesson.id}
                  locale={locale}
                  lesson={activeLesson}
                  poster={course.image}
                />

                <div className="space-y-4 rounded-[16px] border border-[#DCE7ED] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6 dark:border-white/12 dark:bg-[#142D4E]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="num rounded-[8px] bg-[#DDF3F5] px-3 py-1.5 text-[0.76rem] font-bold text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]">
                      {isAr
                        ? `الدرس ${position.index} من ${position.total}`
                        : `Lesson ${position.index} of ${position.total}`}
                    </span>
                    <span className="num inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.76rem] font-bold text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {formatDemoLessonDuration(activeLesson.durationMinutes, locale)}
                    </span>
                  </div>

                  <h2 className="text-[1.3rem] font-extrabold leading-snug text-[#142D4E] sm:text-[1.55rem] dark:text-[#F1F5F9]">
                    {isAr ? activeLesson.titleAr : activeLesson.titleEn}
                  </h2>

                  <p className="text-[0.95rem] leading-[1.9] text-[#64748B] dark:text-[#B8C7D9]">
                    {isAr ? activeLesson.descriptionAr : activeLesson.descriptionEn}
                  </p>

                  <div className="flex items-center gap-3 rounded-[12px] bg-[#EAF3F6] px-4 py-3 dark:bg-[#102238]">
                    <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#176B87] text-white dark:bg-[#28B5C5] dark:text-[#0B1726]">
                      <GraduationCap className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[0.9rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                        {instructorName}
                      </div>
                      <div className="truncate text-[0.76rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                        {instructorRole} · {isAr ? 'مدرّب الدورة' : 'Course Instructor'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
                    {isLessonCompleted ? (
                      <>
                        <span className="inline-flex items-center gap-2 rounded-[10px] border border-[#1F8A5B]/35 bg-[#E7F5EE] px-4 py-2.5 text-[0.88rem] font-bold text-[#1F8A5B] dark:border-[#2ECC71]/35 dark:bg-[#102E24] dark:text-[#6EE7B7]">
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          {isAr ? 'تم إكمال الدرس' : 'Lesson completed'}
                        </span>
                        <button
                          type="button"
                          onClick={handleToggleCompleted}
                          aria-label={isAr ? 'إلغاء إكمال الدرس' : 'Unmark lesson as completed'}
                          title={isAr ? 'تراجع' : 'Undo'}
                          className="grid h-[42px] w-[42px] place-items-center rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[#64748B] transition-colors hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/12 dark:bg-[#102238] dark:text-[#B8C7D9] dark:hover:text-[#28B5C5] cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleToggleCompleted}
                        className="inline-flex items-center gap-2 rounded-[10px] bg-[#176B87] px-5 py-2.5 text-[0.88rem] font-bold text-white transition-colors hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        {isAr ? 'تحديد كمكتمل' : 'Mark as Completed'}
                      </button>
                    )}

                    <div className="ms-auto flex items-center gap-2">
                      <button
                        type="button"
                        disabled={!previous}
                        onClick={() => previous && handleSelectLesson(previous.id)}
                        className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-4 py-2.5 text-[0.86rem] font-bold text-[#183247] transition-colors hover:bg-[#DDF3F5] disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9] dark:hover:bg-[#1B3553] cursor-pointer"
                      >
                        <PrevArrow className="w-4 h-4" aria-hidden="true" />
                        {isAr ? 'السابق' : 'Previous'}
                      </button>
                      <button
                        type="button"
                        disabled={!next}
                        onClick={() => next && handleSelectLesson(next.id)}
                        className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#176B87] px-4 py-2.5 text-[0.86rem] font-bold text-white transition-colors hover:bg-[#142D4E] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                      >
                        {isAr ? 'التالي' : 'Next'}
                        <NextArrow className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* About this course */}
                <div className="space-y-3 rounded-[16px] border border-[#DCE7ED] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6 dark:border-white/12 dark:bg-[#142D4E]">
                  <h3 className="text-[1.05rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                    {isAr ? 'عن هذه الدورة' : 'About This Course'}
                  </h3>
                  <p className="text-[0.9rem] leading-[1.9] text-[#64748B] dark:text-[#B8C7D9]">
                    {isAr ? course.descriptionAr : course.descriptionEn}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="num inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.76rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                      <Layers className="w-3.5 h-3.5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                      {course.sections.length} {isAr ? 'أقسام' : 'sections'}
                    </span>
                    <span className="num inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.76rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                      <ListVideo className="w-3.5 h-3.5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                      {stats.totalLessons} {isAr ? 'دروس' : 'lessons'}
                    </span>
                    <span className="num inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.76rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                      <Clock className="w-3.5 h-3.5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                      {formatDemoTotalDuration(stats.totalMinutes, locale)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.76rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                      <BookOpen className="w-3.5 h-3.5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                      {isAr ? course.levelAr : course.levelEn}
                    </span>
                  </div>
                </div>

                {/* Course exams (published, demo) */}
                {exams.length > 0 && onOpenExam && (
                  <div className="space-y-3 rounded-[16px] border border-[#DCE7ED] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6 dark:border-white/12 dark:bg-[#142D4E]">
                    <h3 className="flex items-center gap-2 text-[1.05rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                      <ClipboardList className="h-5 w-5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                      {isAr ? 'اختبارات الكورس' : 'Course Exams'}
                    </h3>
                    <div className="space-y-2.5">
                      {exams.map((exam) => {
                        const used = countSubmittedAttempts(examAttempts, exam.id);
                        const best = getBestAttempt(examAttempts, exam.id);
                        return (
                          <div
                            key={exam.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#DCE7ED] bg-[#EAF3F6]/60 px-4 py-3 dark:border-white/12 dark:bg-[#102238]/60"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-[0.88rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                                {isAr ? exam.titleAr : exam.titleEn}
                              </div>
                              <div className="num truncate text-[0.74rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                                {exam.questions.length} {isAr ? 'أسئلة' : 'questions'} · {exam.durationMinutes}{' '}
                                {isAr ? 'دقيقة' : 'min'} · {getExamTotalMarks(exam)}{' '}
                                {isAr ? 'درجة · النجاح' : 'marks · pass'} {exam.passingPct}%
                                {used > 0
                                  ? isAr
                                    ? ` · محاولات: ${used}/${exam.maxAttempts}`
                                    : ` · attempts: ${used}/${exam.maxAttempts}`
                                  : ''}
                              </div>
                            </div>
                            <div className="flex flex-none items-center gap-2">
                              {best && (
                                <span
                                  className={`num rounded-[8px] px-3 py-1 text-[0.74rem] font-extrabold ${
                                    best.passed
                                      ? 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]'
                                      : 'bg-[#FCEBE9] text-[#C0392B] dark:bg-[#331411] dark:text-[#FCA5A5]'
                                  }`}
                                >
                                  {isAr ? 'أفضل نتيجة' : 'Best'}: {best.scorePct}%
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => onOpenExam(exam.id)}
                                className="rounded-[10px] bg-[#176B87] px-4 py-2 text-[0.8rem] font-bold text-white transition-colors hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                              >
                                {best
                                  ? isAr
                                    ? 'إعادة المحاولة'
                                    : 'Retake'
                                  : isAr
                                    ? 'ابدأ الاختبار'
                                    : 'Start Exam'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Curriculum sidebar (desktop) */}
              <aside className="hidden lg:block">
                <div className="sticky top-[108px]">
                  <CourseLessonSidebar
                    locale={locale}
                    course={course}
                    activeLessonId={activeLesson.id}
                    completedLessonIds={completedLessonIds}
                    onSelectLesson={handleSelectLesson}
                    className="max-h-[calc(100vh-150px)]"
                  />
                </div>
              </aside>
            </div>

            {/* Mobile curriculum drawer */}
            {drawerOpen && (
              <div
                className="fixed inset-0 z-[95] lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label={isAr ? 'محتوى الكورس' : 'Course content'}
              >
                <div
                  className="absolute inset-0 bg-[#0E223D]/60 backdrop-blur-[2px]"
                  onClick={() => setDrawerOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute inset-y-0 start-0 flex w-[88%] max-w-[380px] flex-col bg-white shadow-2xl dark:bg-[#142D4E]">
                  <div className="flex items-center justify-between border-b border-[#DCE7ED] px-4 py-3 dark:border-white/12">
                    <span className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                      {courseTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDrawerOpen(false)}
                      aria-label={isAr ? 'إغلاق' : 'Close'}
                      className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#DCE7ED] bg-white text-[#183247] hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/15 dark:bg-[#102238] dark:text-[#F1F5F9] dark:hover:text-[#28B5C5] cursor-pointer"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 p-3">
                    <CourseLessonSidebar
                      locale={locale}
                      course={course}
                      activeLessonId={activeLesson.id}
                      completedLessonIds={completedLessonIds}
                      onSelectLesson={handleSelectLesson}
                      variant="drawer"
                      className="h-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
