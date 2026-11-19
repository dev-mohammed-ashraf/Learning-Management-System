import type { Locale, ProgramKind } from '../../types/program';
import { splitTwoToneTitle } from '../../utils/programFilter';

interface ProgramsHeroProps {
  locale: Locale;
  kind: ProgramKind;
  onGoHome: () => void;
}

export function ProgramsHero({ locale, kind, onGoHome }: ProgramsHeroProps) {
  const titleText =
    locale === 'ar'
      ? kind === 'diplomas'
        ? 'برامج الدبلومات'
        : 'برامج الزمالات'
      : kind === 'diplomas'
        ? 'Diploma Programs'
        : 'Fellowship Programs';

  const { lead, tail } = splitTwoToneTitle(titleText);

  const leadParagraph =
    locale === 'ar'
      ? kind === 'diplomas'
        ? 'تصفّح جميع البرامج الأكاديمية المتاحة في معهد البحوث والاستشارات بجامعة تبوك.'
        : 'برامج زمالة مهنية متخصصة يقدمها معهد البحوث والاستشارات بجامعة تبوك.'
      : kind === 'diplomas'
        ? 'Browse all the academic programs available at the Research and Consulting Institute at the University of Tabuk.'
        : 'Specialized professional fellowship programs offered by the Research and Consulting Institute at the University of Tabuk.';

  return (
    <div className="ut-page-hero py-[40px] max-[1023px]:pt-[70px] max-[720px]:pt-[66px] max-[720px]:pb-[32px] relative overflow-hidden border-b border-white/10">
      <svg
        className="pointer-events-none absolute -top-12 end-[-40px] w-[360px] h-[240px] opacity-[0.14] text-[#28B5C5]"
        viewBox="0 0 360 240"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="240" cy="80" r="110" stroke="currentColor" strokeWidth="1" />
        <circle cx="240" cy="80" r="72" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
        <path d="M40 200 L180 60 L330 60" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="wrap flex items-center justify-between gap-[34px] flex-wrap relative">
        <div>
          <div className="text-[0.8rem] text-[#CBD8E6] flex gap-[8px] items-center mb-[12px] relative flex-wrap">
            <button
              type="button"
              onClick={onGoHome}
              className="text-[#CBD8E6] hover:text-[#28B5C5] transition-colors cursor-pointer"
            >
              {locale === 'ar' ? 'الرئيسية' : 'Home'}
            </button>
            <span className="text-[#64748B]" aria-hidden="true">/</span>
            <b className="text-[#28B5C5] font-bold">{titleText}</b>
          </div>

          <h1 className="text-[clamp(1.85rem,3.5vw,2.65rem)] font-extrabold leading-[1.3] text-white relative">
            {lead}
            {tail ? (
              <>
                {' '}
                <span className="text-[#28B5C5]">{tail}</span>
              </>
            ) : null}
          </h1>

          <div className="w-[52px] h-[3px] rounded-full bg-[#28B5C5] mt-[12px] mb-[12px]" aria-hidden="true" />

          <p className="text-[#DDF3F5]/90 max-w-[44rem] text-[1.02rem] leading-[1.9] relative">
            {leadParagraph}
          </p>
        </div>

        <div
          className="hidden min-[561px]:block flex-none ps-[22px] border-s-2 border-[#28B5C5]/60"
          aria-label={
            locale === 'ar'
              ? 'معهد البحوث والاستشارات — جامعة تبوك'
              : 'Research and Consulting Institute — University of Tabuk'
          }
        >
          <img
            src="/assets/ut/logo-white.png"
            alt={
              locale === 'ar'
                ? 'معهد البحوث والاستشارات — جامعة تبوك'
                : 'Research and Consulting Institute — University of Tabuk'
            }
            className="w-[180px] h-[58px] max-[820px]:w-[140px] max-[820px]:h-[45px] object-contain opacity-96 block"
          />
        </div>
      </div>
    </div>
  );
}
