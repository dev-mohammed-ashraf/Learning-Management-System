import type { Locale, ProgramKind } from '../../types/program';
import { splitTwoToneTitle } from '../../utils/programFilter';
import { BrandLogo } from '../common/BrandLogo';

interface ProgramsHeroProps {
  locale: Locale;
  kind: ProgramKind;
}

export function ProgramsHero({ locale, kind }: ProgramsHeroProps) {
  const titleText =
    locale === 'ar'
      ? kind === 'diplomas'
        ? 'الدبلومات والدورات المعتمدة'
        : 'الزمالات التخصصية'
      : kind === 'diplomas'
        ? 'Accredited Diplomas & Courses'
        : 'Specialized Fellowships';

  const { lead, tail } = splitTwoToneTitle(titleText);

  const leadParagraph =
    locale === 'ar'
      ? kind === 'diplomas'
        ? 'تصفّح جميع الدورات وبرامج الدبلوم المشارك المهني المقدمة عن بُعد على منصة مدار، وقارن المحاور والساعات المعتمدة لاختيار مسارك الدراسي.'
        : 'مسارات زمالة تخصصية قيد الإعداد الأكاديمي تمهيدًا لإطلاقها عبر منصة مدار.'
      : kind === 'diplomas'
        ? 'Browse all online professional associate diploma courses offered on the Madar platform, and compare modules and credit hours to choose your study path.'
        : 'Specialized professional fellowship tracks currently under academic preparation for release on the Madar platform.';

  return (
    <div className="ut-page-hero pt-[122px] pb-[44px] max-[1023px]:pt-[160px] max-[767px]:pt-[202px] max-[767px]:pb-[32px] relative overflow-hidden border-b border-white/10">
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
              ? 'منصة مدار للتعلم الرقمي'
              : 'Madar Digital Learning Platform'
          }
        >
          <BrandLogo locale={locale} variant="full" surface="dark" size="md" />
        </div>
      </div>
    </div>
  );
}
