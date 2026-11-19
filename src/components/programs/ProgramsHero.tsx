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
    <div className="ut-page-hero py-[36px] relative overflow-hidden">
      <div className="wrap flex items-center justify-between gap-[34px] flex-wrap relative">
        <div>
          <div className="text-[0.78rem] text-[#B4CCE0] flex gap-[8px] items-center mb-[10px] relative flex-wrap">
            <button
              type="button"
              onClick={onGoHome}
              className="text-[#B4CCE0] hover:text-white transition-colors cursor-pointer"
            >
              {locale === 'ar' ? 'الرئيسية' : 'Home'}
            </button>
            <span aria-hidden="true">/</span>
            <b className="text-[#E7CC8F] font-bold">{titleText}</b>
          </div>

          <h1 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-[1.3] text-white relative">
            {lead}
            {tail ? (
              <>
                {' '}
                <span className="text-[#C99B3F]">{tail}</span>
              </>
            ) : null}
          </h1>

          <p className="text-[#DCE9F4] max-w-[44rem] mt-[10px] text-[1.02rem] leading-[1.95] relative">
            {leadParagraph}
          </p>
        </div>

        <div
          className="hidden min-[561px]:block flex-none ps-[20px] border-s-2 border-[#C99B3F]"
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
