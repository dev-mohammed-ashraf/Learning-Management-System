import { ArrowLeft, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import type { Locale } from '../../types/program';

interface AboutInstituteProps {
  locale: Locale;
  onDiscoverMore: () => void;
}

export function AboutInstitute({ locale, onDiscoverMore }: AboutInstituteProps) {
  const highlights = [
    {
      ar: 'تقديم برامج دبلومات مهنية وأكاديمية معتمدة منذ عام 2006م.',
      en: 'Delivering accredited professional and academic diplomas since 2006.',
    },
    {
      ar: 'دعم احتياجات الأفراد والجهات في القطاعين العام والخاص.',
      en: 'Serving both individual learners and public/private institutions.',
    },
    {
      ar: 'تطوير المهارات التطبيقية بما يواكب مستهدفات التنمية وسوق العمل.',
      en: 'Building applied competencies aligned with workforce development goals.',
    },
  ];

  return (
    <section id="aboutInstitute" className="bg-white py-[72px] max-[720px]:py-[52px]">
      <div className="wrap grid grid-cols-[minmax(0,5.6fr)_minmax(0,6.4fr)] max-[960px]:grid-cols-1 gap-[clamp(28px,4.5vw,64px)] items-center">
        <div className="flex flex-col items-start">
          <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#176B87] mb-[10px]">
            <span>{locale === 'ar' ? 'الهوية الأكاديمية' : 'Institutional Profile'}</span>
          </div>

          <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] font-extrabold text-[#142D4E] leading-[1.4] text-balance">
            {locale === 'ar' ? (
              <>
                عن معهد <span className="text-[#176B87]">البحوث والاستشارات</span>
              </>
            ) : (
              <>
                About the <span className="text-[#176B87]">Research &amp; Consulting Institute</span>
              </>
            )}
          </h2>

          <p className="text-[#64748B] text-[1.02rem] leading-[1.9] mt-[14px] max-w-[42rem]">
            {locale === 'ar'
              ? 'يعمل معهد البحوث والاستشارات بجامعة تبوك على تقديم خدمات وبرامج أكاديمية وتدريبية تسهم في تنمية القدرات البشرية، وتعزيز المعرفة، وتلبية احتياجات الأفراد والجهات.'
              : 'The Research and Consulting Institute at the University of Tabuk delivers academic and training services and programs that develop human capabilities, strengthen knowledge, and serve both individuals and organizations.'}
          </p>

          <ul className="list-none m-0 p-0 grid gap-[10px] mt-[20px]">
            {highlights.map((item) => (
              <li key={item.ar} className="flex items-start gap-[10px] text-[0.92rem] font-semibold text-[#183247]">
                <CheckCircle2 className="w-[18px] h-[18px] text-[#28B5C5] flex-none mt-[4px]" aria-hidden="true" />
                <span>{locale === 'ar' ? item.ar : item.en}</span>
              </li>
            ))}
          </ul>

          <div className="mt-[26px]">
            <button
              type="button"
              onClick={onDiscoverMore}
              className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[24px] py-[11px] font-bold text-[0.94rem] bg-[#176B87] text-white hover:bg-[#142D4E] hover:shadow-[0_10px_24px_rgba(20,45,78,0.22)] transition-all duration-200 cursor-pointer"
            >
              <Building2 className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
              <span>{locale === 'ar' ? 'اكتشف المزيد عن المعهد' : 'Discover More About the Institute'}</span>
              {locale === 'ar' ? (
                <ArrowLeft className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
              ) : (
                <ArrowRight className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-[18px] overflow-hidden border border-[#DCE7ED] bg-[#EAF3F6] shadow-[0_20px_48px_rgba(20,45,78,0.10)] aspect-[4/3]">
            <img
              src="/src/assets/images/about_research_campus_1795124493852.jpg"
              alt={
                locale === 'ar'
                  ? 'البهو الأكاديمي الحديث في معهد البحوث والاستشارات بجامعة تبوك'
                  : 'Modern academic atrium at the Research and Consulting Institute'
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
