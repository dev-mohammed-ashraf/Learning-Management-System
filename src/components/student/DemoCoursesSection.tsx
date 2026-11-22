import { MonitorPlay } from 'lucide-react';
import type { DemoCourse, DemoLearningState } from '../../types/coursePlayer';
import type { Locale } from '../../types/program';
import {
  computeDemoCourseProgressPct,
  formatDemoTotalDuration,
  getDemoCourseProgress,
  getDemoCourseStats,
  isDemoCourseEnrolled,
} from '../../utils/demoLearning';
import { ProgressBar } from '../common/ProgressBar';

interface DemoCoursesSectionProps {
  locale: Locale;
  courses: DemoCourse[];
  learning: DemoLearningState;
  onOpenCourse: (course: DemoCourse) => void;
  onStartLearning: (courseId: string) => void;
  onEnrollCourse: (courseId: string) => void;
}

/**
 * Library strip showcasing the demo courses: browse, instant demo enrollment,
 * and "Start Learning" entry point into the course learning page.
 */
export function DemoCoursesSection({
  locale,
  courses,
  learning,
  onOpenCourse,
  onStartLearning,
  onEnrollCourse,
}: DemoCoursesSectionProps) {
  const isAr = locale === 'ar';

  return (
    <section
      aria-label={isAr ? 'الدورات التفاعلية التجريبية' : 'Interactive demo courses'}
      className="rounded-[16px] border border-[#28B5C5]/35 bg-[#DDF3F5]/50 p-4 dark:border-[#28B5C5]/25 dark:bg-[#102238]/60 sm:p-5"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="grid h-10 w-10 flex-none place-items-center rounded-[10px] bg-[#176B87] text-white dark:bg-[#28B5C5] dark:text-[#0B1726]">
          <MonitorPlay className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[1.02rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? 'الدورات التفاعلية (تجريبي)' : 'Interactive Courses (Demo)'}
          </h2>
          <p className="text-[0.82rem] leading-relaxed text-[#64748B] dark:text-[#B8C7D9]">
            {isAr
              ? 'جرّب تجربة تعلم كاملة ببيانات تجريبية: تسجيل مجاني فوري، مشغّل فيديو، ومتابعة تقدم الدروس — دون أي رسوم أو بيانات حقيقية.'
              : 'Try a full learning experience with mock data: free instant enrollment, a video player, and lesson progress tracking — no fees, no real data.'}
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {courses.map((course) => {
          const enrolled = isDemoCourseEnrolled(learning, course.id);
          const progressPct = computeDemoCourseProgressPct(
            course,
            getDemoCourseProgress(learning, course.id)
          );
          const stats = getDemoCourseStats(course);
          const title = isAr ? course.titleAr : course.titleEn;

          return (
            <article
              key={course.id}
              className="flex flex-col gap-3 rounded-[14px] border border-[#DCE7ED] bg-white p-4 dark:border-white/12 dark:bg-[#142D4E] sm:flex-row"
            >
              <img
                src={course.image}
                alt={title}
                className="h-[92px] w-full flex-none rounded-[10px] object-cover sm:w-[128px]"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 className="truncate text-[0.95rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                  {title}
                </h3>
                <p className="truncate text-[0.76rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                  {isAr ? course.instructor.nameAr : course.instructor.nameEn} ·{' '}
                  {isAr ? course.instructor.roleAr : course.instructor.roleEn}
                </p>
                <div className="num flex flex-wrap items-center gap-x-2 text-[0.74rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                  <span>
                    {stats.totalLessons} {isAr ? 'دروس' : 'lessons'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDemoTotalDuration(stats.totalMinutes, locale)}</span>
                  {enrolled && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-[#176B87] dark:text-[#28B5C5]">
                        {isAr ? `مكتمل ${progressPct}%` : `${progressPct}% done`}
                      </span>
                    </>
                  )}
                </div>

                {enrolled && <ProgressBar value={progressPct} size="sm" />}

                <div className="mt-auto flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenCourse(course)}
                    className="rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3.5 py-2 text-[0.8rem] font-bold text-[#183247] transition-colors hover:bg-[#DDF3F5] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9] dark:hover:bg-[#1B3553] cursor-pointer"
                  >
                    {isAr ? 'التفاصيل' : 'Details'}
                  </button>
                  {enrolled ? (
                    <button
                      type="button"
                      onClick={() => onStartLearning(course.id)}
                      className="rounded-[10px] bg-[#176B87] px-4 py-2 text-[0.8rem] font-bold text-white transition-colors hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                    >
                      {progressPct > 0
                        ? isAr
                          ? 'متابعة التعلم'
                          : 'Continue Learning'
                        : isAr
                          ? 'ابدأ التعلم'
                          : 'Start Learning'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onEnrollCourse(course.id)}
                      className="rounded-[10px] bg-[#176B87] px-4 py-2 text-[0.8rem] font-bold text-white transition-colors hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                    >
                      {isAr ? 'اشترك في الكورس' : 'Enroll in Course'}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
