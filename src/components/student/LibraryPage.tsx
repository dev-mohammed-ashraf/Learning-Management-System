import { useState } from 'react';
import { Bookmark, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import type { Locale, Program } from '../../types/program';
import type { LibraryFilterTab, StudentPlatformState } from '../../types/student';
import {
  computeCourseProgressPct,
  filterLibraryCourses,
} from '../../utils/studentPlatform';
import { PageHeroBanner } from '../common/PageHeroBanner';
import { ProgressBar } from '../common/ProgressBar';

interface LibraryPageProps {
  locale: Locale;
  state: StudentPlatformState;
  programs: Program[];
  onGoHome: () => void;
  onBrowseCourses: () => void;
  onOpenProgram: (program: Program, tab?: 'details' | 'register') => void;
  onToggleSave: (program: Program) => void;
  onToggleModule: (program: Program, moduleIndex: number) => void;
}

export function LibraryPage({
  locale,
  state,
  programs,
  onBrowseCourses,
  onOpenProgram,
  onToggleSave,
  onToggleModule,
}: LibraryPageProps) {
  const [activeTab, setActiveTab] = useState<LibraryFilterTab>('all');

  const tabs: { id: LibraryFilterTab; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'in_progress', labelAr: 'قيد التعلم', labelEn: 'In Progress' },
    { id: 'completed', labelAr: 'المكتملة', labelEn: 'Completed' },
    { id: 'saved', labelAr: 'المحفوظة', labelEn: 'Saved' },
  ];

  const items = filterLibraryCourses(state, programs, activeTab);

  return (
    <div>
      <PageHeroBanner
        locale={locale}
        eyebrowAr="مساحتك الدراسية الخاصة"
        eyebrowEn="Personal Study Shelf"
        titleAr="مكتبتي التعليمية"
        titleEn="My Educational Library"
        descriptionAr="إدارة الدورات التي سجّلت بها أو حفظتها للرجوع إليها، مع متابعة مباشرة لإتمام المحاور الدراسية في كل دبلوم."
        descriptionEn="Manage the courses you enrolled in or bookmarked, and check off course modules as you progress."
      />

      <section className="py-[32px] pb-[72px]">
        <div className="wrap space-y-6">
          {/* Filter Tabs */}
          <div
            role="tablist"
            aria-label={locale === 'ar' ? 'تصنيف مكتبتي التعليمية' : 'Library Filter Tabs'}
            className="flex flex-wrap items-center gap-[10px] border-b border-[#DCE7ED] dark:border-white/12 pb-[14px]"
          >
            {tabs.map((tab) => {
              const count = filterLibraryCourses(state, programs, tab.id).length;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-[40px] px-[16px] rounded-[12px] font-bold text-[0.88rem] inline-flex items-center gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#176B87] text-white dark:bg-[#28B5C5] dark:text-[#0B1726]'
                      : 'bg-[#EAF3F6] text-[#142D4E] hover:bg-[#DDF3F5] dark:bg-[#102238] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553]'
                  }`}
                >
                  <span>{locale === 'ar' ? tab.labelAr : tab.labelEn}</span>
                  <span
                    className={`num text-[0.76rem] px-1.5 py-0.5 rounded-[6px] ${
                      isSelected
                        ? 'bg-white/20 text-white dark:bg-[#0B1726]/20 dark:text-[#0B1726]'
                        : 'bg-white text-[#176B87] dark:bg-[#142D4E] dark:text-[#28B5C5]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {items.length === 0 ? (
            <div className="bg-[#EAF3F6] dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] py-[48px] px-[24px] text-center space-y-3">
              <BookOpen
                className="w-10 h-10 mx-auto text-[#176B87] dark:text-[#28B5C5]"
                aria-hidden="true"
              />
              <h2 className="text-[1.15rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                {activeTab === 'all'
                  ? locale === 'ar'
                    ? 'مكتبتك التعليمية فارغة حاليًا'
                    : 'Your educational library is currently empty'
                  : locale === 'ar'
                    ? 'لا توجد دورات ضمن هذا التصنيف بعد'
                    : 'No courses in this tab yet'}
              </h2>
              <p className="text-[#64748B] dark:text-[#B8C7D9] text-[0.92rem] max-w-[50ch] mx-auto">
                {locale === 'ar'
                  ? 'تصفّح كتالوج الدورات لحفظ ما يهمك أو التسجيل في دبلوم لبدء تتبّع محاوره الدراسية هنا.'
                  : 'Browse the Courses catalog to save a course or enroll in a diploma to track modules here.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onBrowseCourses}
                  className="rounded-[10px] px-[22px] py-[10px] font-bold text-[0.9rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                >
                  {locale === 'ar' ? 'استعراض الدورات المتاحة' : 'Browse Available Courses'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-[22px]">
              {items.map((program) => {
                const enrollment = state.enrollments[program.id];
                const isSaved = state.savedCourseIds.includes(program.id);
                const progressPct = computeCourseProgressPct(program, enrollment);
                const modules = locale === 'ar' ? program.modulesAr : program.modulesEn;

                return (
                  <article
                    key={program.id}
                    className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] overflow-hidden flex flex-col"
                  >
                    <div className="flex flex-col sm:flex-row border-b border-[#DCE7ED] dark:border-white/12">
                      <img
                        src={program.image}
                        alt={locale === 'ar' ? program.titleAr : program.titleEn}
                        className="w-full sm:w-[190px] h-[150px] sm:h-auto object-cover flex-none bg-[#142D4E]"
                      />
                      <div className="p-4 flex-1 flex flex-col justify-between gap-2 min-w-0">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[0.75rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                              {locale === 'ar' ? program.categoryAr : program.categoryEn}
                            </span>
                            <button
                              type="button"
                              onClick={() => onToggleSave(program)}
                              aria-label={
                                isSaved
                                  ? locale === 'ar'
                                    ? 'إزالة من المحفوظات'
                                    : 'Remove bookmark'
                                  : locale === 'ar'
                                    ? 'حفظ الدورة'
                                    : 'Save course'
                              }
                              className={`p-1.5 rounded-[8px] border cursor-pointer transition-colors ${
                                isSaved
                                  ? 'bg-[#DDF3F5] border-[#28B5C5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]'
                                  : 'bg-[#EAF3F6] border-[#DCE7ED] text-[#64748B] dark:bg-[#102238] dark:border-white/12'
                              }`}
                            >
                              <Bookmark
                                className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                          <h3 className="font-bold text-[1.02rem] text-[#142D4E] dark:text-[#F1F5F9]">
                            {locale === 'ar' ? program.titleAr : program.titleEn}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 text-[0.78rem] font-semibold text-[#64748B] dark:text-[#B8C7D9] flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                            {locale === 'ar' ? program.creditsAr : program.creditsEn}
                          </span>
                          <span>·</span>
                          <span>
                            {enrollment
                              ? enrollment.status === 'completed'
                                ? locale === 'ar'
                                  ? 'مكتملة'
                                  : 'Completed'
                                : locale === 'ar'
                                  ? 'قيد التعلّم'
                                  : 'In Progress'
                              : locale === 'ar'
                                ? 'محفوظة للمراجعة'
                                : 'Saved'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col gap-3">
                      {enrollment ? (
                        <>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[0.8rem] font-bold">
                              <span className="text-[#64748B] dark:text-[#B8C7D9]">
                                {locale === 'ar' ? 'نسبة إنجاز المحاور' : 'Module Completion'}
                              </span>
                              <span className="num text-[#142D4E] dark:text-[#F1F5F9]">
                                {progressPct}%
                              </span>
                            </div>
                            <ProgressBar value={progressPct} size="sm" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {modules.map((mod, idx) => {
                              const done = enrollment.completedModuleIndices.includes(idx);
                              return (
                                <button
                                  key={mod}
                                  type="button"
                                  onClick={() => onToggleModule(program, idx)}
                                  aria-pressed={done}
                                  className={`text-start px-3 py-2 rounded-[9px] border text-[0.8rem] font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                                    done
                                      ? 'bg-[#E7F5EE] border-[#1F8A5B]/35 text-[#142D4E] dark:bg-[#102E24] dark:border-[#2ECC71]/35 dark:text-[#F1F5F9]'
                                      : 'bg-[#EAF3F6] border-transparent text-[#183247] hover:border-[#28B5C5] dark:bg-[#102238] dark:text-[#B8C7D9]'
                                  }`}
                                >
                                  <CheckCircle2
                                    className={`w-4 h-4 flex-none ${
                                      done ? 'text-[#1F8A5B] dark:text-[#6EE7B7]' : 'text-[#94A3B8]'
                                    }`}
                                    aria-hidden="true"
                                  />
                                  <span className="truncate">{mod}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <p className="text-[0.86rem] text-[#64748B] dark:text-[#B8C7D9] leading-relaxed">
                          {locale === 'ar' ? program.descriptionAr : program.descriptionEn}
                        </p>
                      )}

                      <div className="mt-auto pt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenProgram(program, 'details')}
                          className="rounded-[10px] px-4 py-2 text-[0.85rem] font-bold bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                        >
                          {enrollment
                            ? locale === 'ar'
                              ? 'تفاصيل ومتابعة'
                              : 'View & Continue'
                            : locale === 'ar'
                              ? 'فتح التفاصيل والتسجيل'
                              : 'Details & Enroll'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
