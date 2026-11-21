import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PROGRAMS } from '../../data/programs';
import type { Locale, Program } from '../../types/program';
import type { CourseEnrollmentRecord } from '../../types/student';
import { computeCourseProgressPct } from '../../utils/studentPlatform';
import { ProgramCard } from '../programs/ProgramCard';

interface FeaturedProgramsProps {
  locale: Locale;
  savedCourseIds?: string[];
  enrollments?: Record<string, CourseEnrollmentRecord>;
  onToggleSave?: (program: Program) => void;
  onOpenProgram: (program: Program, tab: 'details' | 'register') => void;
  onViewAllPrograms: () => void;
}

export function FeaturedPrograms({
  locale,
  savedCourseIds = [],
  enrollments = {},
  onToggleSave,
  onOpenProgram,
  onViewAllPrograms,
}: FeaturedProgramsProps) {
  const featured = PROGRAMS.slice(0, 3);

  return (
    <section className="bg-white dark:bg-[#102238] border-t border-[#DCE7ED] dark:border-white/12 py-[72px] max-[720px]:py-[52px]">
      <div className="wrap">
        <div className="flex items-end justify-between gap-[20px] flex-wrap mb-[34px]">
          <div>
            <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#176B87] dark:text-[#28B5C5] mb-[8px]">
              <span>{locale === 'ar' ? 'مسارات التعلم المتاحة' : 'Available Learning Tracks'}</span>
            </div>

            <h2 className="text-[clamp(1.65rem,3vw,2.2rem)] font-extrabold text-[#142D4E] dark:text-[#F1F5F9] leading-[1.4] text-balance">
              {locale === 'ar' ? (
                <>
                  أبرز الدورات <span className="text-[#176B87] dark:text-[#28B5C5]">والدبلومات المعتمدة</span>
                </>
              ) : (
                <>
                  Featured Courses <span className="text-[#176B87] dark:text-[#28B5C5]">&amp; Accredited Diplomas</span>
                </>
              )}
            </h2>

            <p className="text-[#64748B] dark:text-[#B8C7D9] text-[1rem] leading-[1.85] mt-[8px] max-w-[44rem]">
              {locale === 'ar'
                ? 'اختر التخصص الذي يثير شغفك المعرفي، واطّلع على تفاصيل المحاور الدراسية والساعات المعتمدة لكل مسار.'
                : 'Choose the field that matches your learning goals and review curriculum topics and credit hours for every track.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllPrograms}
            className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[22px] py-[10px] font-bold text-[0.92rem] border border-[#DCE7ED] bg-[#EAF3F6] text-[#142D4E] hover:border-[#28B5C5] hover:bg-[#DDF3F5] hover:text-[#176B87] dark:border-white/15 dark:bg-[#142D4E] dark:text-[#F1F5F9] dark:hover:border-[#28B5C5] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span>{locale === 'ar' ? 'استعراض كل الدورات' : 'Browse All Courses'}</span>
            {locale === 'ar' ? (
              <ArrowLeft className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1 gap-[24px]">
          {featured.map((program) => {
            const enrollment = enrollments[program.id];
            return (
              <ProgramCard
                key={program.id}
                program={program}
                locale={locale}
                isSaved={savedCourseIds.includes(program.id)}
                isEnrolled={Boolean(enrollment)}
                progressPct={computeCourseProgressPct(program, enrollment)}
                onToggleSave={onToggleSave}
                onOpenDetails={onOpenProgram}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
