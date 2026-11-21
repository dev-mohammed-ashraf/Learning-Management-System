import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Layers } from 'lucide-react';
import { LEARNING_PATHS } from '../../data/learningPlatform';
import type { Locale, Program } from '../../types/program';
import type { StudentPlatformState } from '../../types/student';
import {
  computeCourseProgressPct,
  computeLearningPathProgress,
} from '../../utils/studentPlatform';
import { PageHeroBanner } from '../common/PageHeroBanner';
import { ProgressBar } from '../common/ProgressBar';

interface LearningPathsPageProps {
  locale: Locale;
  state: StudentPlatformState;
  programs: Program[];
  onGoHome: () => void;
  onOpenProgram: (program: Program, tab?: 'details' | 'register') => void;
}

export function LearningPathsPage({
  locale,
  state,
  programs,
  onOpenProgram,
}: LearningPathsPageProps) {
  return (
    <div>
      <PageHeroBanner
        locale={locale}
        eyebrowAr="تخطيط التدرّج الأكاديمي"
        eyebrowEn="Guided Curriculum Sequences"
        titleAr="المسارات التعليمية المنظمة"
        titleEn="Structured Learning Paths"
        descriptionAr="مسارات مترابطة تجمع دورات الدبلوم المعتمدة في تسلسل واضح لبناء مهارات متكاملة، مع حساب تقدّمك الحقيقي تلقائيًا."
        descriptionEn="Curated sequences grouping accredited diploma courses into clear career tracks, automatically reflecting your real study progress."
      />

      <section className="py-[32px] pb-[72px]">
        <div className="wrap space-y-6">
          {LEARNING_PATHS.map((path) => {
            const pathCourses = path.programIds
              .map((id) => programs.find((p) => p.id === id))
              .filter((p): p is Program => Boolean(p));
            const progress = computeLearningPathProgress(path, state, programs);
            const isUpcoming = path.status === 'upcoming';
            const nextProgram = pathCourses.find(
              (p) => p.id === progress.nextRecommendedProgramId
            );

            return (
              <article
                key={path.id}
                className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[18px] overflow-hidden"
              >
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-4 relative min-h-[210px] bg-[#142D4E]">
                    <img
                      src={path.image}
                      alt={locale === 'ar' ? path.titleAr : path.titleEn}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(14,34,61,0.18), rgba(14,34,61,0.72))',
                      }}
                    />
                    <span
                      className={`absolute top-4 start-4 rounded-[8px] px-3 py-1 text-[0.74rem] font-bold ${
                        isUpcoming
                          ? 'bg-[#0E223D]/90 text-[#FDE68A] border border-[#F59E0B]/40'
                          : 'bg-[#DDF3F5] text-[#142D4E]'
                      }`}
                    >
                      {isUpcoming
                        ? locale === 'ar'
                          ? 'قيد الإعداد'
                          : 'Upcoming Track'
                        : locale === 'ar'
                          ? `${pathCourses.length} دورات متسلسلة`
                          : `${pathCourses.length} Sequential Courses`}
                    </span>
                  </div>

                  <div className="col-span-12 md:col-span-8 p-[22px] flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-[0.8rem] font-bold text-[#176B87] dark:text-[#28B5C5] mb-1">
                        <Layers className="w-4 h-4" aria-hidden="true" />
                        <span>{locale === 'ar' ? path.durationAr : path.durationEn}</span>
                      </div>
                      <h2 className="text-[1.25rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                        {locale === 'ar' ? path.titleAr : path.titleEn}
                      </h2>
                      <p className="text-[0.9rem] text-[#64748B] dark:text-[#B8C7D9] mt-1 leading-relaxed">
                        {locale === 'ar' ? path.descriptionAr : path.descriptionEn}
                      </p>
                    </div>

                    {!isUpcoming && (
                      <>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[0.82rem] font-bold">
                            <span className="text-[#64748B] dark:text-[#B8C7D9]">
                              {locale === 'ar'
                                ? `نسبة إتمام المسار (${progress.completedCourses} من ${progress.totalCourses} مكتملة)`
                                : `Path Progress (${progress.completedCourses} of ${progress.totalCourses} completed)`}
                            </span>
                            <span className="num text-[#142D4E] dark:text-[#F1F5F9]">
                              {progress.progressPct}%
                            </span>
                          </div>
                          <ProgressBar value={progress.progressPct} />
                        </div>

                        <div className="space-y-2">
                          <div className="text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                            {locale === 'ar' ? 'تسلسل الدورات في المسار:' : 'Course Sequence:'}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {pathCourses.map((course, idx) => {
                              const record = state.enrollments[course.id];
                              const coursePct = computeCourseProgressPct(course, record);
                              return (
                                <button
                                  key={course.id}
                                  type="button"
                                  onClick={() => onOpenProgram(course, 'details')}
                                  className="text-start bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 hover:border-[#28B5C5] rounded-[12px] p-3 transition-colors cursor-pointer"
                                >
                                  <div className="flex items-center justify-between gap-2 text-[0.75rem] font-bold text-[#176B87] dark:text-[#28B5C5] mb-1">
                                    <span className="num">
                                      {locale === 'ar' ? `الخطوة ${idx + 1}` : `Step ${idx + 1}`}
                                    </span>
                                    {record && (
                                      <span className="inline-flex items-center gap-1 text-[#1F8A5B] dark:text-[#6EE7B7]">
                                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                                        <span className="num">{coursePct}%</span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-bold text-[0.9rem] text-[#142D4E] dark:text-[#F1F5F9]">
                                    {locale === 'ar' ? course.titleAr : course.titleEn}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[0.76rem] text-[#64748B] dark:text-[#B8C7D9] mt-1">
                                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>{locale === 'ar' ? course.creditsAr : course.creditsEn}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {nextProgram && (
                          <div className="pt-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => onOpenProgram(nextProgram, 'details')}
                              className="inline-flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-[0.86rem] font-bold bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                            >
                              <span>
                                {state.enrollments[nextProgram.id]
                                  ? locale === 'ar'
                                    ? `متابعة: ${nextProgram.titleAr}`
                                    : `Continue: ${nextProgram.titleEn}`
                                  : locale === 'ar'
                                    ? `ابدأ المسار بـ: ${nextProgram.titleAr}`
                                    : `Start with: ${nextProgram.titleEn}`}
                              </span>
                              {locale === 'ar' ? (
                                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                              ) : (
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
