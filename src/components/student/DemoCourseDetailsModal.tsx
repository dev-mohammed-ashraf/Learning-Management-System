import { useEffect } from 'react';
import { CheckCircle2, Clock, GraduationCap, ListVideo, X } from 'lucide-react';
import type { DemoCourse } from '../../types/coursePlayer';
import type { Locale } from '../../types/program';
import {
  formatDemoLessonDuration,
  formatDemoTotalDuration,
  getDemoCourseStats,
} from '../../utils/demoLearning';
import { ProgressBar } from '../common/ProgressBar';

interface DemoCourseDetailsModalProps {
  locale: Locale;
  course: DemoCourse;
  isEnrolled: boolean;
  progressPct: number;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
  onStartLearning: (courseId: string) => void;
}

/**
 * Demo course details: curriculum preview + simulated enrollment CTA.
 * Mirrors the existing PortalModal styling (overlay, card, close button).
 */
export function DemoCourseDetailsModal({
  locale,
  course,
  isEnrolled,
  progressPct,
  onClose,
  onEnroll,
  onStartLearning,
}: DemoCourseDetailsModalProps) {
  const isAr = locale === 'ar';
  const stats = getDemoCourseStats(course);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E223D]/65 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-[18px] border border-[#DCE7ED] bg-white shadow-[0_22px_54px_rgba(20,45,78,0.25)] dark:border-white/12 dark:bg-[#142D4E] dark:shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
        <button
          type="button"
          onClick={onClose}
          aria-label={isAr ? 'إغلاق' : 'Close'}
          className="absolute top-4 end-4 z-10 grid h-9 w-9 place-items-center rounded-[10px] border border-[#DCE7ED] bg-white/95 text-[#183247] hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/15 dark:bg-[#102238]/90 dark:text-[#F1F5F9] dark:hover:text-[#28B5C5] cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Hero */}
        <div className="relative h-[190px] overflow-hidden border-b-2 border-[#28B5C5] bg-[#142D4E]">
          <img
            src={course.image}
            alt={isAr ? course.titleAr : course.titleEn}
            className="h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(20,45,78,0.14), rgba(20,45,78,0.82))',
            }}
          />
          <div className="absolute inset-x-6 bottom-4 text-white">
            <span className="mb-2 inline-block rounded-[6px] bg-[#DDF3F5]/95 px-3 py-0.5 text-[0.72rem] font-bold text-[#142D4E]">
              {isAr ? 'كورس تجريبي · مجاني' : 'Demo Course · Free'}
            </span>
            <h2 className="text-[1.3rem] font-bold leading-snug">
              {isAr ? course.titleAr : course.titleEn}
            </h2>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="num inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.76rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
              <ListVideo className="w-3.5 h-3.5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
              {stats.totalLessons} {isAr ? 'دروس' : 'lessons'}
            </span>
            <span className="num inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.76rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
              <Clock className="w-3.5 h-3.5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
              {formatDemoTotalDuration(stats.totalMinutes, locale)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 text-[0.76rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
              {isAr ? course.levelAr : course.levelEn}
            </span>
          </div>

          <p className="text-[0.9rem] leading-[1.9] text-[#64748B] dark:text-[#B8C7D9]">
            {isAr ? course.descriptionAr : course.descriptionEn}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-3 rounded-[12px] bg-[#EAF3F6] px-4 py-3 dark:bg-[#102238]">
            <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#176B87] text-white dark:bg-[#28B5C5] dark:text-[#0B1726]">
              <GraduationCap className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[0.9rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                {isAr ? course.instructor.nameAr : course.instructor.nameEn}
              </div>
              <div className="truncate text-[0.76rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                {isAr ? course.instructor.roleAr : course.instructor.roleEn}
              </div>
            </div>
          </div>

          {/* Curriculum preview */}
          <div className="space-y-2">
            <h3 className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? 'محتوى الكورس' : 'Course Content'}
            </h3>
            <div className="space-y-2">
              {course.sections.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className="rounded-[12px] border border-[#DCE7ED] dark:border-white/12"
                >
                  <div className="flex items-center gap-2 border-b border-[#DCE7ED] bg-[#EAF3F6]/60 px-3.5 py-2.5 dark:border-white/12 dark:bg-[#102238]/60">
                    <span className="num text-[0.78rem] font-extrabold text-[#176B87] dark:text-[#28B5C5]">
                      {isAr ? `القسم ${sectionIndex + 1}` : `Section ${sectionIndex + 1}`}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[0.85rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                      {isAr ? section.titleAr : section.titleEn}
                    </span>
                    <span className="num text-[0.72rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                      {section.lessons.length} {isAr ? 'دروس' : 'lessons'}
                    </span>
                  </div>
                  <ul className="divide-y divide-[#DCE7ED] dark:divide-white/10">
                    {section.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-[0.82rem]"
                      >
                        <ListVideo
                          className="w-3.5 h-3.5 flex-none text-[#28B5C5]"
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1 truncate font-semibold text-[#183247] dark:text-[#B8C7D9]">
                          {isAr ? lesson.titleAr : lesson.titleEn}
                        </span>
                        <span className="num flex-none text-[0.72rem] font-semibold text-[#64748B] dark:text-[#7E93A9]">
                          {formatDemoLessonDuration(lesson.durationMinutes, locale)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          {isEnrolled ? (
            <div className="space-y-3 rounded-[12px] border border-[#DCE7ED] p-4 dark:border-white/12">
              <div className="flex items-center justify-between text-[0.84rem] font-bold">
                <span className="text-[#64748B] dark:text-[#B8C7D9]">
                  {isAr ? 'نسبة تقدمك' : 'Your progress'}
                </span>
                <span className="num text-[#142D4E] dark:text-[#F1F5F9]">{progressPct}%</span>
              </div>
              <ProgressBar value={progressPct} size="sm" />
              <button
                type="button"
                onClick={() => onStartLearning(course.id)}
                className="h-[48px] w-full rounded-[10px] bg-[#176B87] text-[0.95rem] font-bold text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
              >
                {isAr ? 'ابدأ التعلم' : 'Start Learning'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onEnroll(course.id)}
                className="h-[48px] w-full rounded-[10px] bg-[#176B87] text-[0.95rem] font-bold text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
              >
                {isAr ? 'اشترك في الكورس' : 'Enroll in Course'}
              </button>
              <p className="flex items-start gap-2 text-[0.78rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 flex-none text-[#1F8A5B] dark:text-[#6EE7B7]"
                  aria-hidden="true"
                />
                {isAr
                  ? 'تسجيل تجريبي فوري دون رسوم — لتجربة صفحة التعلم ومتابعة الدروس.'
                  : 'Instant demo enrollment with no fees — to try the learning page and lessons.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
