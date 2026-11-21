import { ArrowLeft, ArrowRight, PhoneCall } from 'lucide-react';
import type { Locale } from '../../types/program';

interface HomeCallToActionProps {
  locale: Locale;
  onBrowsePrograms: () => void;
  onContactUs: () => void;
}

export function HomeCallToAction({
  locale,
  onBrowsePrograms,
  onContactUs,
}: HomeCallToActionProps) {
  return (
    <section className="ut-page-hero relative overflow-hidden py-[68px] max-[720px]:py-[50px] border-t border-white/10 border-b border-white/15">
      <svg
        className="pointer-events-none absolute -bottom-20 start-[-40px] w-[420px] h-[260px] opacity-[0.14] text-[#28B5C5]"
        viewBox="0 0 420 260"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="130" cy="150" r="110" stroke="currentColor" strokeWidth="1" />
        <circle cx="130" cy="150" r="70" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
        <path d="M240 150 H390" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="wrap relative flex items-center justify-between gap-[28px] flex-wrap">
        <div className="max-w-[44rem]">
          <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#DDF3F5] mb-[10px]">
            <span>{locale === 'ar' ? 'انضم إلى مجتمع المتعلمين' : 'Join Our Learning Community'}</span>
          </div>

          <h2 className="text-[clamp(1.75rem,3.2vw,2.45rem)] font-extrabold text-white leading-[1.35] text-balance">
            {locale === 'ar' ? (
              <>
                ابدأ رحلتك الدراسية <span className="text-[#28B5C5]">بثقة ووضوح</span>
              </>
            ) : (
              <>
                Begin Your Study Journey <span className="text-[#28B5C5]">With Clarity</span>
              </>
            )}
          </h2>

          <p className="text-[#DDF3F5]/90 text-[1.02rem] leading-[1.88] mt-[10px]">
            {locale === 'ar'
              ? 'تصفّح دليل الدورات والدبلومات المعتمدة لاختيار المسار الذي يناسب تطلعاتك، أو تواصل مع فريق الإرشاد الأكاديمي لمساعدتك في الإجابة عن استفساراتك.'
              : 'Browse our accredited courses and diploma tracks to pick the path that fits your goals, or reach out to our academic support team with any questions.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-[12px] max-[520px]:w-full">
          <button
            type="button"
            onClick={onBrowsePrograms}
            className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[26px] py-[12px] font-bold text-[0.96rem] bg-[#28B5C5] text-[#142D4E] hover:bg-[#DDF3F5] transition-all duration-200 cursor-pointer max-[520px]:flex-1 whitespace-nowrap"
          >
            <span>{locale === 'ar' ? 'اكتشف الدورات' : 'Explore Courses'}</span>
            {locale === 'ar' ? (
              <ArrowLeft className="w-[18px] h-[18px] flex-none" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-[18px] h-[18px] flex-none" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onContactUs}
            className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[24px] py-[12px] font-bold text-[0.96rem] border border-[#DDF3F5]/35 bg-white/[0.06] text-white hover:border-[#28B5C5] hover:text-[#28B5C5] hover:bg-white/[0.1] transition-all duration-200 cursor-pointer max-[520px]:flex-1 whitespace-nowrap"
          >
            <PhoneCall className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
            <span>{locale === 'ar' ? 'تحدث مع فريق الدعم' : 'Talk to Support'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
