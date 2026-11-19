import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PROGRAMS } from '../../data/programs';
import type { Locale, Program } from '../../types/program';
import { ProgramCard } from '../programs/ProgramCard';

interface FeaturedProgramsProps {
  locale: Locale;
  onOpenProgram: (program: Program, tab: 'details' | 'register') => void;
  onViewAllPrograms: () => void;
}

export function FeaturedPrograms({
  locale,
  onOpenProgram,
  onViewAllPrograms,
}: FeaturedProgramsProps) {
  const featured = PROGRAMS.slice(0, 3);

  return (
    <section className="bg-white border-t border-[#DCE7ED] py-[72px] max-[720px]:py-[52px]">
      <div className="wrap">
        <div className="flex items-end justify-between gap-[20px] flex-wrap mb-[34px]">
          <div>
            <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#176B87] mb-[8px]">
              <span>{locale === 'ar' ? 'برامج الدبلومات المعتمدة' : 'Accredited Diplomas'}</span>
            </div>

            <h2 className="text-[clamp(1.65rem,3vw,2.2rem)] font-extrabold text-[#142D4E] leading-[1.4] text-balance">
              {locale === 'ar' ? (
                <>
                  اكتشف <span className="text-[#176B87]">برامجنا الأكاديمية</span>
                </>
              ) : (
                <>
                  Discover Our <span className="text-[#176B87]">Academic Programs</span>
                </>
              )}
            </h2>

            <p className="text-[#64748B] text-[1rem] leading-[1.85] mt-[8px] max-w-[44rem]">
              {locale === 'ar'
                ? 'اختر البرنامج الذي يناسب طموحاتك وابدأ رحلتك نحو مستقبل مهني أكثر تميزًا.'
                : 'Choose the program that fits your ambitions and begin your journey toward a distinguished career.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllPrograms}
            className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[22px] py-[10px] font-bold text-[0.92rem] border border-[#DCE7ED] bg-[#EAF3F6] text-[#142D4E] hover:border-[#28B5C5] hover:bg-[#DDF3F5] hover:text-[#176B87] transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span>{locale === 'ar' ? 'عرض جميع البرامج' : 'View All Programs'}</span>
            {locale === 'ar' ? (
              <ArrowLeft className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1 gap-[24px]">
          {featured.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              locale={locale}
              onOpenDetails={onOpenProgram}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
