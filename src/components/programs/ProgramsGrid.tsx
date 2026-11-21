import type { Locale, Program, ProgramKind } from '../../types/program';
import type { CourseEnrollmentRecord } from '../../types/student';
import { computeCourseProgressPct } from '../../utils/studentPlatform';
import { ProgramCard } from './ProgramCard';

interface ProgramsGridProps {
  locale: Locale;
  kind: ProgramKind;
  programs: Program[];
  hasActiveFilters: boolean;
  savedCourseIds?: string[];
  enrollments?: Record<string, CourseEnrollmentRecord>;
  onToggleSave?: (program: Program) => void;
  onOpenDetails: (program: Program, initialMode: 'details' | 'register') => void;
  onResetFilters: () => void;
  onOpenContact: () => void;
}

export function ProgramsGrid({
  locale,
  kind,
  programs,
  hasActiveFilters,
  savedCourseIds = [],
  enrollments = {},
  onToggleSave,
  onOpenDetails,
  onResetFilters,
  onOpenContact,
}: ProgramsGridProps) {
  if (kind === 'fellowships' && programs.length === 0 && !hasActiveFilters) {
    return (
      <div className="bg-[#EAF3F6] dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] py-[44px] px-[24px] text-center">
        <h3 className="text-[1.15rem] font-bold text-[#142D4E] dark:text-[#F1F5F9] mb-[8px]">
          {locale === 'ar' ? 'مسارات الزمالة قيد الإعداد' : 'Fellowship Tracks Coming Soon'}
        </h3>
        <p className="text-[#64748B] dark:text-[#B8C7D9] text-[0.95rem] max-w-[52ch] mx-auto mb-[18px]">
          {locale === 'ar'
            ? 'نعمل حاليًا على تجهيز خطط برامج الزمالة التخصصية. يمكنك مراسلة فريق الإرشاد الأكاديمي للاستفسار عن مواعيد الإطلاق القادمة.'
            : 'We are currently preparing our specialized fellowship curricula. Reach out to our academic support team for upcoming release schedules.'}
        </p>
        <button
          type="button"
          onClick={onOpenContact}
          className="inline-flex items-center justify-center rounded-[10px] px-[24px] py-[10px] font-bold text-[0.92rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] transition-colors cursor-pointer"
        >
          {locale === 'ar' ? 'تواصل مع الدعم' : 'Contact Support'}
        </button>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="bg-[#EAF3F6] dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] py-[44px] px-[24px] text-center">
        <h3 className="text-[1.1rem] font-bold text-[#142D4E] dark:text-[#F1F5F9] mb-[8px]">
          {locale === 'ar' ? 'لم نعثر على دورات مطابقة' : 'No matching courses found'}
        </h3>
        <p className="text-[#64748B] dark:text-[#B8C7D9] text-[0.92rem] mb-[18px]">
          {locale === 'ar'
            ? 'جرّب البحث بكلمة أخرى أو أعد ضبط خيارات التصفية لاستعراض جميع الدورات المتاحة.'
            : 'Try adjusting your search keywords or resetting filters to explore all available courses.'}
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center justify-center rounded-[10px] px-[22px] py-[10px] font-bold text-[0.9rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] transition-colors cursor-pointer"
        >
          {locale === 'ar' ? 'عرض جميع الدورات' : 'Show All Courses'}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1 gap-[24px]">
      {programs.map((program) => {
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
            onOpenDetails={onOpenDetails}
          />
        );
      })}
    </div>
  );
}
