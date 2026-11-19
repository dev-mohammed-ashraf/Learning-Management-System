import { BookOpen, Clock, GraduationCap } from 'lucide-react';
import type { Locale, Program } from '../../types/program';

interface ProgramCardProps {
  program: Program;
  locale: Locale;
  onOpenDetails: (program: Program, initialMode: 'details' | 'register') => void;
}

export function ProgramCard({ program, locale, onOpenDetails }: ProgramCardProps) {
  const title = locale === 'ar' ? program.titleAr : program.titleEn;
  const badge = locale === 'ar' ? program.badgeAr : program.badgeEn;
  const duration = locale === 'ar' ? program.durationAr : program.durationEn;
  const credits = locale === 'ar' ? program.creditsAr : program.creditsEn;
  const accreditation = locale === 'ar' ? program.accreditationAr : program.accreditationEn;
  const currency = locale === 'ar' ? program.currencyAr : program.currencyEn;
  const taxLabel = locale === 'ar' ? program.taxLabelAr : program.taxLabelEn;
  const ctaLabel = locale === 'ar' ? program.ctaLabelAr : program.ctaLabelEn;

  const isRegisterCta = program.ctaLabelAr === 'سجّل الآن';

  return (
    <article className="ut-pcard bg-white border border-[#E3EAF1] rounded-[14px] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(12,59,97,0.11)] hover:border-[#1C5D92]/30">
      <button
        type="button"
        onClick={() => onOpenDetails(program, 'details')}
        aria-label={`${title} — ${badge}`}
        className="ut-pcard-thumb relative w-full aspect-[16/9] overflow-hidden block cursor-pointer bg-[#0C3B61] text-start focus-visible:outline-2 focus-visible:outline-[#1C5D92]"
      >
        <img
          src={program.image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_55%] block"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 59, 122, 0.08), rgba(0, 59, 122, 0.42))',
          }}
          aria-hidden="true"
        />
        <span className="absolute top-[12px] start-[12px] bg-white/92 text-[#0C3B61] rounded-[6px] px-[12px] py-[2px] text-[0.7rem] font-bold">
          {badge}
        </span>
      </button>

      <div className="px-[18px] pt-[16px] pb-[18px] flex flex-col gap-[6px] flex-1">
        <h3 className="text-[1.02rem] font-bold leading-[1.55] text-[#12263A]">
          <button
            type="button"
            onClick={() => onOpenDetails(program, 'details')}
            className="text-start hover:text-[#1C5D92] transition-colors cursor-pointer"
          >
            {title}
          </button>
        </h3>

        <div className="flex flex-col mt-[2px]">
          <span className="flex items-center gap-[10px] py-[6px] text-[0.8rem] font-bold leading-[1.8] text-[#12263A] border-b border-dashed border-[#E3EAF1]">
            <Clock
              className="w-[26px] h-[26px] p-[6px] rounded-[8px] bg-[#E8EEF4] text-[#0C3B61] flex-none"
              aria-hidden="true"
            />
            <span>{duration}</span>
          </span>
          <span className="flex items-center gap-[10px] py-[6px] text-[0.8rem] font-bold leading-[1.8] text-[#12263A] border-b border-dashed border-[#E3EAF1]">
            <BookOpen
              className="w-[26px] h-[26px] p-[6px] rounded-[8px] bg-[#E8EEF4] text-[#0C3B61] flex-none"
              aria-hidden="true"
            />
            <span>{credits}</span>
          </span>
          <span className="flex items-center gap-[10px] py-[6px] text-[0.8rem] font-bold leading-[1.8] text-[#12263A]">
            <GraduationCap
              className="w-[26px] h-[26px] p-[6px] rounded-[8px] bg-[#E8EEF4] text-[#0C3B61] flex-none"
              aria-hidden="true"
            />
            <span>{accreditation}</span>
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-[10px] pt-[10px]">
          <div className="flex items-baseline justify-between gap-[10px] bg-[#F5F8FB] rounded-[12px] px-[14px] py-[9px]">
            <b className="num text-[1.35rem] font-bold text-[#0C3B61]">
              {program.price.toLocaleString('en-US')} {currency}
            </b>
            <span className="text-[0.7rem] text-[#5E7489] font-bold whitespace-nowrap">
              {taxLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenDetails(program, isRegisterCta ? 'register' : 'details')}
            className="w-full inline-flex items-center justify-center rounded-[8px] px-[16px] py-[7px] font-bold text-[0.83rem] bg-[#1C5D92] text-white hover:bg-[#154A76] hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(28,93,146,0.3)] active:translate-y-0 transition-all cursor-pointer"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
