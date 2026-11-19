import type { Locale } from '../../types/program';

interface SecondaryBarProps {
  locale: Locale;
  onToggleLocale: () => void;
  onOpenPortalInfo: (section: 'lms' | 'entities' | 'support') => void;
}

export function SecondaryBar({
  locale,
  onToggleLocale,
  onOpenPortalInfo,
}: SecondaryBarProps) {
  return (
    <div className="bg-[#0C3B61] text-[#B4CCE0] text-[0.75rem] max-[720px]:hidden">
      <div className="wrap flex items-center justify-between gap-[18px] py-[7px] flex-wrap">
        <div className="flex items-center gap-[2px]">
          <button
            type="button"
            onClick={() => onOpenPortalInfo('lms')}
            className="cursor-pointer px-[10px] py-[2px] rounded-[6px] font-bold transition-colors hover:text-white"
          >
            {locale === 'ar' ? 'بوابة التعلم' : 'Learning Portal'}
          </button>
          <i className="opacity-35 not-italic" aria-hidden="true">·</i>
          <button
            type="button"
            onClick={() => onOpenPortalInfo('entities')}
            className="cursor-pointer px-[10px] py-[2px] rounded-[6px] font-bold transition-colors hover:text-white"
          >
            {locale === 'ar' ? 'خدمات الجهات' : 'Corporate Services'}
          </button>
          <i className="opacity-35 not-italic" aria-hidden="true">·</i>
          <button
            type="button"
            onClick={() => onOpenPortalInfo('support')}
            className="cursor-pointer px-[10px] py-[2px] rounded-[6px] font-bold transition-colors hover:text-white"
          >
            {locale === 'ar' ? 'الدعم والاستفسارات' : 'Support & Inquiries'}
          </button>
        </div>

        <div className="flex items-center gap-[18px]">
          <button
            type="button"
            onClick={onToggleLocale}
            title={locale === 'ar' ? 'English' : 'العربية'}
            className="border border-white/25 bg-transparent text-[#EAF3FB] rounded-[6px] px-[12px] py-[1px] font-bold text-[0.72rem] leading-[1.8] transition-colors hover:bg-white/10 cursor-pointer"
          >
            {locale === 'ar' ? 'EN' : 'AR'}
          </button>
        </div>
      </div>
    </div>
  );
}
