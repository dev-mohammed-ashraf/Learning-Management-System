import type { ReactNode } from 'react';
import type { Locale } from '../../types/program';
import { splitTwoToneTitle } from '../../utils/programFilter';
import { BrandLogo } from './BrandLogo';

interface PageHeroBannerProps {
  locale: Locale;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  eyebrowAr?: string;
  eyebrowEn?: string;
  onGoHome: () => void;
  actionSlot?: ReactNode;
}

export function PageHeroBanner({
  locale,
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  eyebrowAr,
  eyebrowEn,
  onGoHome,
  actionSlot,
}: PageHeroBannerProps) {
  const titleText = locale === 'ar' ? titleAr : titleEn;
  const { lead, tail } = splitTwoToneTitle(titleText);
  const description = locale === 'ar' ? descriptionAr : descriptionEn;
  const eyebrow = locale === 'ar' ? eyebrowAr : eyebrowEn;

  return (
    <div className="ut-page-hero pt-[122px] pb-[40px] max-[1023px]:pt-[160px] max-[767px]:pt-[202px] max-[767px]:pb-[30px] relative overflow-hidden border-b border-white/10">
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

      <div className="wrap flex items-center justify-between gap-[28px] flex-wrap relative">
        <div className="min-w-0 flex-1">
          <div className="text-[0.8rem] text-[#CBD8E6] flex gap-[8px] items-center mb-[10px] relative flex-wrap">
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

          {eyebrow && (
            <div className="text-[0.78rem] font-bold text-[#28B5C5] tracking-wide mb-[6px]">
              {eyebrow}
            </div>
          )}

          <h1 className="text-[clamp(1.75rem,3.3vw,2.45rem)] font-extrabold leading-[1.3] text-white relative">
            {lead}
            {tail ? (
              <>
                {' '}
                <span className="text-[#28B5C5]">{tail}</span>
              </>
            ) : null}
          </h1>

          <div className="w-[48px] h-[3px] rounded-full bg-[#28B5C5] mt-[12px] mb-[12px]" aria-hidden="true" />

          <p className="text-[#DDF3F5]/90 max-w-[46rem] text-[0.98rem] leading-[1.85] relative">
            {description}
          </p>

          {actionSlot && <div className="mt-[18px]">{actionSlot}</div>}
        </div>

        <div
          className="hidden min-[561px]:block flex-none ps-[22px] border-s-2 border-[#28B5C5]/60"
          aria-label={
            locale === 'ar'
              ? 'منصة مدار للتعلّم الرقمي — جامعة تبوك'
              : 'Madar Digital Learning Platform — University of Tabuk'
          }
        >
          <BrandLogo locale={locale} variant="full" surface="dark" size="md" />
        </div>
      </div>
    </div>
  );
}
