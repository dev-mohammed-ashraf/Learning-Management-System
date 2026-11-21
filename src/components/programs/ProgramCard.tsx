import { Bookmark, BookOpen, CheckCircle2, Clock, GraduationCap } from 'lucide-react';
import type { Locale, Program } from '../../types/program';

interface ProgramCardProps {
  program: Program;
  locale: Locale;
  isSaved?: boolean;
  isEnrolled?: boolean;
  progressPct?: number;
  onToggleSave?: (program: Program) => void;
  onOpenDetails: (program: Program, initialMode: 'details' | 'register') => void;
}

export function ProgramCard({
  program,
  locale,
  isSaved = false,
  isEnrolled = false,
  progressPct = 0,
  onToggleSave,
  onOpenDetails,
}: ProgramCardProps) {
  const title = locale === 'ar' ? program.titleAr : program.titleEn;
  const badge = locale === 'ar' ? program.badgeAr : program.badgeEn;
  const category = locale === 'ar' ? program.categoryAr : program.categoryEn;
  const duration = locale === 'ar' ? program.durationAr : program.durationEn;
  const credits = locale === 'ar' ? program.creditsAr : program.creditsEn;
  const accreditation = locale === 'ar' ? program.accreditationAr : program.accreditationEn;
  const currency = locale === 'ar' ? program.currencyAr : program.currencyEn;
  const taxLabel = locale === 'ar' ? program.taxLabelAr : program.taxLabelEn;
  const ctaLabel = isEnrolled
    ? locale === 'ar'
      ? 'متابعة الدراسة'
      : 'Continue Course'
    : locale === 'ar'
      ? program.ctaLabelAr
      : program.ctaLabelEn;

  const isRegisterCta =
    !isEnrolled &&
    (program.ctaLabelAr === 'التسجيل في الدورة' || program.ctaLabelAr === 'سجّل الآن');

  return (
    <article className="group ut-pcard bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] overflow-hidden flex flex-col transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(20,45,78,0.10)] dark:hover:shadow-[0_20px_44px_rgba(0,0,0,0.42)] hover:border-[#28B5C5]/70">
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#142D4E] border-b-2 border-[#28B5C5]/70">
        <button
          type="button"
          onClick={() => onOpenDetails(program, 'details')}
          aria-label={`${title} — ${badge}`}
          className="w-full h-full block cursor-pointer text-start focus-visible:outline-2 focus-visible:outline-[#176B87]"
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
                'linear-gradient(180deg, rgba(20, 45, 78, 0.04) 0%, rgba(20, 45, 78, 0.36) 100%)',
            }}
            aria-hidden="true"
          />
        </button>

        <span className="pointer-events-none absolute top-[12px] start-[12px] bg-[#DDF3F5]/95 text-[#142D4E] dark:bg-[#0B1726]/90 dark:text-[#28B5C5] border border-[#28B5C5]/35 rounded-[8px] px-[12px] py-[2px] text-[0.72rem] font-bold shadow-[0_2px_8px_rgba(20,45,78,0.12)]">
          {badge}
        </span>

        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(program)}
            aria-pressed={isSaved}
            aria-label={
              isSaved
                ? locale === 'ar'
                  ? `إزالة "${title}" من المكتبة المحفوظة`
                  : `Remove "${title}" from saved library`
                : locale === 'ar'
                  ? `حفظ "${title}" في المكتبة التعليمية`
                  : `Save "${title}" to educational library`
            }
            className={`absolute top-[10px] end-[10px] w-[34px] h-[34px] rounded-[10px] grid place-items-center border transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#28B5C5] ${
              isSaved
                ? 'bg-[#28B5C5] border-[#28B5C5] text-[#0B1726] shadow-[0_4px_12px_rgba(40,181,197,0.3)]'
                : 'bg-white/90 border-[#DCE7ED] text-[#142D4E] hover:border-[#28B5C5] hover:text-[#176B87] dark:bg-[#0B1726]/85 dark:border-white/20 dark:text-[#F1F5F9]'
            }`}
          >
            <Bookmark className={`w-[16px] h-[16px] ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="px-[18px] pt-[15px] pb-[18px] flex flex-col gap-[6px] flex-1">
        <div className="flex items-center justify-between gap-2 mb-[2px]">
          <span className="text-[0.74rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
            {category}
          </span>
          {isEnrolled && (
            <span className="inline-flex items-center gap-1 text-[0.72rem] font-bold text-[#1F8A5B] dark:text-[#6EE7B7]">
              <CheckCircle2 className="w-[13px] h-[13px]" aria-hidden="true" />
              <span className="num">
                {locale === 'ar' ? `مسجّل · ${progressPct}%` : `Enrolled · ${progressPct}%`}
              </span>
            </span>
          )}
        </div>

        <h3 className="text-[1.04rem] font-bold leading-[1.55] text-[#142D4E] dark:text-[#F1F5F9]">
          <button
            type="button"
            onClick={() => onOpenDetails(program, 'details')}
            className="text-start hover:text-[#176B87] dark:hover:text-[#28B5C5] transition-colors cursor-pointer"
          >
            {title}
          </button>
        </h3>

        <div className="flex flex-col mt-[2px]">
          <span className="flex items-center gap-[10px] py-[6px] text-[0.82rem] font-semibold leading-[1.8] text-[#183247] dark:text-[#B8C7D9] border-b border-dashed border-[#DCE7ED] dark:border-white/12">
            <Clock
              className="w-[28px] h-[28px] p-[6px] rounded-[8px] bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5] flex-none"
              aria-hidden="true"
            />
            <span>{duration}</span>
          </span>
          <span className="flex items-center gap-[10px] py-[6px] text-[0.82rem] font-semibold leading-[1.8] text-[#183247] dark:text-[#B8C7D9] border-b border-dashed border-[#DCE7ED] dark:border-white/12">
            <BookOpen
              className="w-[28px] h-[28px] p-[6px] rounded-[8px] bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5] flex-none"
              aria-hidden="true"
            />
            <span>{credits}</span>
          </span>
          <span className="flex items-center gap-[10px] py-[6px] text-[0.82rem] font-semibold leading-[1.8] text-[#183247] dark:text-[#B8C7D9]">
            <GraduationCap
              className="w-[28px] h-[28px] p-[6px] rounded-[8px] bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5] flex-none"
              aria-hidden="true"
            />
            <span>{accreditation}</span>
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-[10px] pt-[10px]">
          <div className="flex items-baseline justify-between gap-[10px] bg-[#EAF3F6] border border-[#DCE7ED] dark:bg-[#102238] dark:border-white/12 rounded-[12px] px-[14px] py-[9px]">
            <b className="num text-[1.35rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {program.price.toLocaleString('en-US')} {currency}
            </b>
            <span className="text-[0.72rem] text-[#64748B] dark:text-[#B8C7D9] font-bold whitespace-nowrap">
              {taxLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenDetails(program, isRegisterCta ? 'register' : 'details')}
            className="w-full inline-flex items-center justify-center rounded-[10px] px-[16px] py-[9px] font-bold text-[0.86rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] transition-all duration-200 cursor-pointer"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
