import { ArrowLeft, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import type { Locale } from '../../types/program';

interface AboutInstituteProps {
  locale: Locale;
  onDiscoverMore: () => void;
}

export function AboutInstitute({ locale, onDiscoverMore }: AboutInstituteProps) {
  const highlights = [
    {
      ar: 'دبلومات مهنية معتمدة منذ عام 2006م بمحتوى تطبيقي حديث.',
      en: 'Accredited professional diplomas offered since 2006 with up-to-date applied content.',
    },
    {
      ar: 'إشراف أكاديمي ومتابعة مستمرة عبر بوابة التعلّم الإلكتروني.',
      en: 'Academic guidance and structured progress tracking via our digital learning portal.',
    },
    {
      ar: 'تجربة رقمية متكاملة من التصفح والتسجيل حتى إتمام التخرج.',
      en: 'An end-to-end digital journey from course discovery through graduation.',
    },
  ];

  return (
    <section id="aboutInstitute" className="bg-white dark:bg-[#0B1726] py-[72px] max-[720px]:py-[52px]">
      <div className="wrap grid grid-cols-[minmax(0,5.6fr)_minmax(0,6.4fr)] max-[960px]:grid-cols-1 gap-[clamp(28px,4.5vw,64px)] items-center">
        <div className="flex flex-col items-start">
          <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#176B87] dark:text-[#28B5C5] mb-[10px]">
            <span>{locale === 'ar' ? 'رسالتنا التعليمية' : 'Our Learning Mission'}</span>
          </div>

          <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] font-extrabold text-[#142D4E] dark:text-[#F1F5F9] leading-[1.4] text-balance">
            {locale === 'ar' ? (
              <>
                بيئة جامعية <span className="text-[#176B87] dark:text-[#28B5C5]">تدعم رحلتك الدراسية</span>
              </>
            ) : (
              <>
                A University Space <span className="text-[#176B87] dark:text-[#28B5C5]">Built for Learners</span>
              </>
            )}
          </h2>

          <p className="text-[#64748B] dark:text-[#B8C7D9] text-[1.02rem] leading-[1.9] mt-[14px] max-w-[42rem]">
            {locale === 'ar'
              ? 'تمثل هذه المنصة الواجهة التعليمية الرقمية لمعهد البحوث والاستشارات بجامعة تبوك، حيث نضع الطالب في قلب التجربة الدراسية من خلال دبلومات مهنية تمنحك أساسًا معرفيًا متينًا وتجربة تعلم تفاعلية ميسّرة.'
              : 'Serving as the digital learning gateway of the Research and Consulting Institute at the University of Tabuk, our platform centers on the student experience—combining solid academic foundations with accessible online instruction.'}
          </p>

          <ul className="list-none m-0 p-0 grid gap-[10px] mt-[20px]">
            {highlights.map((item) => (
              <li key={item.ar} className="flex items-start gap-[10px] text-[0.92rem] font-semibold text-[#183247] dark:text-[#F1F5F9]">
                <CheckCircle2 className="w-[18px] h-[18px] text-[#28B5C5] flex-none mt-[4px]" aria-hidden="true" />
                <span>{locale === 'ar' ? item.ar : item.en}</span>
              </li>
            ))}
          </ul>

          <div className="mt-[26px]">
            <button
              type="button"
              onClick={onDiscoverMore}
              className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[24px] py-[11px] font-bold text-[0.94rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] hover:shadow-[0_10px_24px_rgba(20,45,78,0.22)] transition-all duration-200 cursor-pointer"
            >
              <Building2 className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
              <span>{locale === 'ar' ? 'اطّلع على ملف المنصة' : 'Read Platform Overview'}</span>
              {locale === 'ar' ? (
                <ArrowLeft className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
              ) : (
                <ArrowRight className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-[18px] overflow-hidden border border-[#DCE7ED] dark:border-white/12 bg-[#EAF3F6] dark:bg-[#142D4E] shadow-[0_20px_48px_rgba(20,45,78,0.10)] dark:shadow-[0_20px_48px_rgba(0,0,0,0.4)] aspect-[4/3]">
            <img
              src="/src/assets/images/modern_study_space_1795281369592.jpg"
              alt={
                locale === 'ar'
                  ? 'مكتبة جامعية حديثة ومقصورات دراسة رقمية مجهزة للطلاب'
                  : 'Contemporary university library and digital student study commons'
              }
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center block"
            />
          </div>
          <div
            className="hidden sm:block pointer-events-none absolute -top-3 -end-3 w-[76px] h-[76px] rounded-se-[18px] border-t-2 border-e-2 border-[#28B5C5]"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
