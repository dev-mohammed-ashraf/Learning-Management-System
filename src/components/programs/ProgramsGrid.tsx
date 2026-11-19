import type { Locale, Program, ProgramKind } from '../../types/program';
import { ProgramCard } from './ProgramCard';

interface ProgramsGridProps {
  locale: Locale;
  kind: ProgramKind;
  programs: Program[];
  hasActiveFilters: boolean;
  onOpenDetails: (program: Program, initialMode: 'details' | 'register') => void;
  onResetFilters: () => void;
  onOpenContact: () => void;
}

export function ProgramsGrid({
  locale,
  kind,
  programs,
  hasActiveFilters,
  onOpenDetails,
  onResetFilters,
  onOpenContact,
}: ProgramsGridProps) {
  if (kind === 'fellowships' && programs.length === 0 && !hasActiveFilters) {
    return (
      <div className="bg-[#EAF3F6] border border-[#DCE7ED] rounded-[16px] py-[44px] px-[24px] text-center">
        <h3 className="text-[1.15rem] font-bold text-[#142D4E] mb-[8px]">
          {locale === 'ar' ? 'برامج الزمالات قريبًا' : 'Fellowship Programs Coming Soon'}
        </h3>
        <p className="text-[#64748B] text-[0.95rem] max-w-[52ch] mx-auto mb-[18px]">
          {locale === 'ar'
            ? 'نعمل على إطلاق برامج الزمالة المهنية. تواصل معنا لمعرفة المواعيد أو لطلب برنامج زمالة لجهتك.'
            : 'We are preparing to launch our professional fellowship programs. Contact us for schedules or institutional requests.'}
        </p>
        <button
          type="button"
          onClick={onOpenContact}
          className="inline-flex items-center justify-center rounded-[10px] px-[24px] py-[10px] font-bold text-[0.92rem] bg-[#176B87] text-white hover:bg-[#142D4E] transition-colors cursor-pointer"
        >
          {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
        </button>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="bg-[#EAF3F6] border border-[#DCE7ED] rounded-[16px] py-[44px] px-[24px] text-center">
        <h3 className="text-[1.1rem] font-bold text-[#142D4E] mb-[8px]">
          {locale === 'ar' ? 'لا توجد برامج مطابقة لبحثك' : 'No matching programs found'}
        </h3>
        <p className="text-[#64748B] text-[0.92rem] mb-[18px]">
          {locale === 'ar'
            ? 'جرّب تعديل كلمات البحث أو إعادة ضبط خيارات التصفية لعرض جميع البرامج المتاحة.'
            : 'Try adjusting your search keywords or resetting filters to browse all available programs.'}
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center justify-center rounded-[10px] px-[22px] py-[10px] font-bold text-[0.9rem] bg-[#176B87] text-white hover:bg-[#142D4E] transition-colors cursor-pointer"
        >
          {locale === 'ar' ? 'عرض جميع البرامج' : 'Show All Programs'}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1 gap-[24px]">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          locale={locale}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
}
