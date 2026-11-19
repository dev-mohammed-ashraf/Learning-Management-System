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
    <article className="group ut-pcard bg-white border border-[#DCE7ED] rounded-[16px] overflow-hidden flex flex-col transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(20,45,78,0.10)] hover:border-[#28B5C5]/70">
      <button
        type="button"
        onClick={() => onOpenDetails(program, 'details')}
        aria-label={`${title} — ${badge}`}
        className="relative w-full aspect-[16/9] overflow-hidden block cursor-pointer bg-[#142D4E] text-start border-b-2 border-[#28B5C5]/70 focus-visible:outline-2 focus-visible:outline-[#176B87]"
      >
        <img
          src={program.image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center block transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(20, 45, 78, 0.04) 0%, rgba(20, 45, 78, 0.34) 100%)',
          }}
          aria-hidden="true"
        />
        <span className="absolute top-[12px] start-[12px] bg-[#DDF3F5]/95 text-[#142D4E] border border-[#28B5C5]/35 rounded-[8px] px-[12px] py-[2px] text-[0.72rem] font-bold shadow-[0_2px_8px_rgba(20,45,78,0.12)]">
          {badge}
        </span>
      </button>

      <div className="px-[18px] pt-[16px] pb-[18px] flex flex-col gap-[6px] flex-1">
        <div className="w-[34px] h-[3px] rounded-full bg-[#28B5C5] mb-[2px]" aria-hidden="true" />

        <h3 className="text-[1.04rem] font-bold leading-[1.55] text-[#142D4E]">
          <button
            type="button"
            onClick={() => onOpenDetails(program, 'details')}
            className="text-start hover:text-[#176B87] transition-colors cursor-pointer"
          >
            {title}
          </button>
        </h3>

        <div className="flex flex-col mt-[2px]">
          <span className="flex items-center gap-[10px] py-[6px] text-[0.82rem] font-semibold leading-[1.8] text-[#183247] border-b border-dashed border-[#DCE7ED]">
            <Clock
              className="w-[28px] h-[28px] p-[6px] rounded-[8px] bg-[#DDF3F5] text-[#176B87] flex-none"
              aria-hidden="true"
            />
            <span>{duration}</span>
          </span>
          <span className="flex items-center gap-[10px] py-[6px] text-[0.82rem] font-semibold leading-[1.8] text-[#183247] border-b border-dashed border-[#DCE7ED]">
            <BookOpen
              className="w-[28px] h-[28px] p-[6px] rounded-[8px] bg-[#DDF3F5] text-[#176B87] flex-none"
              aria-hidden="true"
            />
            <span>{credits}</span>
          </span>
          <span className="flex items-center gap-[10px] py-[6px] text-[0.82rem] font-semibold leading-[1.8] text-[#183247]">
            <GraduationCap
              className="w-[28px] h-[28px] p-[6px] rounded-[8px] bg-[#DDF3F5] text-[#176B87] flex-none"
              aria-hidden="true"
            />
            <span>{accreditation}</span>
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-[10px] pt-[10px]">
          <div className="flex items-baseline justify-between gap-[10px] bg-[#EAF3F6] border border-[#DCE7ED] rounded-[12px] px-[14px] py-[9px]">
            <b className="num text-[1.35rem] font-extrabold text-[#142D4E]">
              {program.price.toLocaleString('en-US')} {currency}
            </b>
            <span className="text-[0.72rem] text-[#64748B] font-bold whitespace-nowrap">
              {taxLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenDetails(program, isRegisterCta ? 'register' : 'details')}
            className="w-full inline-flex items-center justify-center rounded-[10px] px-[16px] py-[9px] font-bold text-[0.86rem] bg-[#176B87] text-white hover:bg-[#142D4E] hover:shadow-[0_8px_20px_rgba(20,45,78,0.22)] transition-all duration-200 cursor-pointer"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
