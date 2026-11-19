import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import type { Locale } from '../../types/program';

interface HomeHeroProps {
  locale: Locale;
  onExplorePrograms: () => void;
  onLearnAbout: () => void;
}

export function HomeHero({ locale, onExplorePrograms, onLearnAbout }: HomeHeroProps) {
  return (
    <section className="ut-page-hero relative overflow-hidden py-[56px] max-[960px]:py-[44px] max-[720px]:py-[36px] border-b border-white/10">
      <svg
        className="pointer-events-none absolute -top-16 end-[-60px] w-[460px] h-[320px] opacity-[0.14] text-[#28B5C5]"
        viewBox="0 0 460 320"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="300" cy="110" r="140" stroke="currentColor" strokeWidth="1" />
        <circle cx="300" cy="110" r="92" stroke="currentColor" strokeWidth="1" strokeDasharray="5 6" />
        <path d="M30 270 L210 90 L420 90" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="wrap relative grid grid-cols-[minmax(0,6.2fr)_minmax(0,5.8fr)] max-[960px]:grid-cols-1 gap-[clamp(28px,4vw,56px)] items-center">
        <div className="flex flex-col items-start">
          <div className="ut-eyebrow inline-flex items-center gap-[10px] text-[0.86rem] font-bold text-[#DDF3F5] mb-[14px]">
            <span>
              {locale === 'ar'
                ? 'معهد البحوث والاستشارات — جامعة تبوك'
                : 'Research & Consulting Institute — University of Tabuk'}
            </span>
          </div>

          <h1 className="text-[clamp(2rem,3.8vw,3.1rem)] font-extrabold leading-[1.28] text-white text-balance">
            {locale === 'ar' ? (
              <>
                نرتقي بالمعرفة... ونصنع{' '}
                <span className="text-[#28B5C5]">مستقبل الكفاءات</span>
              </>
            ) : (
              <>
                Elevating Knowledge... Shaping{' '}
                <span className="text-[#28B5C5]">Future Capabilities</span>
              </>
            )}
          </h1>

          <div className="w-[64px] h-[3px] rounded-full bg-[#28B5C5] my-[18px]" aria-hidden="true" />

          <p className="text-[#DDF3F5]/90 text-[1.06rem] max-[720px]:text-[0.98rem] leading-[1.9] max-w-[40rem]">
            {locale === 'ar'
              ? 'نقدم برامج تدريبية وأكاديمية متخصصة تسهم في تطوير المهارات، وتأهيل الكفاءات، ومواكبة متطلبات سوق العمل.'
              : 'We deliver specialized training and academic programs that advance skills, prepare qualified talent, and align with labor market needs.'}
          </p>

          <div className="flex flex-wrap items-center gap-[12px] mt-[26px] max-[520px]:w-full">
            <button
              type="button"
              onClick={onExplorePrograms}
              className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[26px] py-[12px] font-bold text-[0.96rem] bg-[#28B5C5] text-[#142D4E] hover:bg-[#DDF3F5] shadow-[0_8px_24px_rgba(40,181,197,0.28)] transition-all duration-200 cursor-pointer max-[520px]:flex-1 whitespace-nowrap"
            >
              <span>{locale === 'ar' ? 'استكشف البرامج' : 'Explore Programs'}</span>
              {locale === 'ar' ? (
                <ArrowLeft className="w-[18px] h-[18px] flex-none" aria-hidden="true" />
              ) : (
                <ArrowRight className="w-[18px] h-[18px] flex-none" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={onLearnAbout}
              className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[24px] py-[12px] font-bold text-[0.96rem] border border-[#DDF3F5]/35 bg-white/[0.06] text-white hover:border-[#28B5C5] hover:text-[#28B5C5] hover:bg-white/[0.1] transition-all duration-200 cursor-pointer max-[520px]:flex-1 whitespace-nowrap"
            >
              <Compass className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
              <span>{locale === 'ar' ? 'تعرّف على المعهد' : 'About the Institute'}</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-[18px] overflow-hidden border border-[#28B5C5]/30 bg-[#0E223D] shadow-[0_24px_60px_rgba(8,22,42,0.45)] aspect-[4/3]">
            <img
              src="/src/assets/images/hero_university_architecture_1795124493606.jpg"
              alt={
                locale === 'ar'
                  ? 'المبنى الحديث لمعهد البحوث والاستشارات بجامعة تبوك'
                  : 'Modern architectural building of the Research and Consulting Institute at the University of Tabuk'
              }
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center block"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(20, 45, 78, 0.04) 0%, rgba(20, 45, 78, 0.28) 100%)',
              }}
              aria-hidden="true"
            />
          </div>
          <div
            className="hidden sm:block pointer-events-none absolute -bottom-3 -start-3 w-[84px] h-[84px] rounded-es-[18px] border-b-2 border-s-2 border-[#28B5C5]/60"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
