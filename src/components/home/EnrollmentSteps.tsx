import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Locale } from '../../types/program';

interface EnrollmentStepsProps {
  locale: Locale;
  onStartRegistration: () => void;
}

export function EnrollmentSteps({ locale, onStartRegistration }: EnrollmentStepsProps) {
  const steps = [
    {
      number: '1',
      titleAr: 'استكشف البرامج',
      titleEn: 'Explore Programs',
      descAr: 'تصفح الدبلومات والبرامج التدريبية المتاحة واطلع على تفاصيلها ومساراتها.',
      descEn: 'Browse available diplomas and training tracks with full curriculum details.',
    },
    {
      number: '2',
      titleAr: 'اختر برنامجك',
      titleEn: 'Choose Your Program',
      descAr: 'حدّد التخصص الذي يتوافق مع طموحك المهني ومتطلباتك الأكاديمية.',
      descEn: 'Select the specialization that aligns with your career goals and schedule.',
    },
    {
      number: '3',
      titleAr: 'أنشئ حسابك',
      titleEn: 'Create Your Account',
      descAr: 'سجّل بياناتك عبر البوابة الإلكترونية وأكمل طلب الالتحاق بكل يسر.',
      descEn: 'Complete your online profile and submit your enrollment request digitally.',
    },
    {
      number: '4',
      titleAr: 'ابدأ رحلتك',
      titleEn: 'Start Your Journey',
      descAr: 'فعّل وصولك إلى بوابة التعلم الإلكتروني وانطلق في مسارك التدريبي.',
      descEn: 'Activate your learning portal access and begin attending your sessions.',
    },
  ];

  return (
    <section className="bg-[#EAF3F6] border-y border-[#DCE7ED] py-[72px] max-[720px]:py-[52px]">
      <div className="wrap">
        <div className="flex items-end justify-between gap-[20px] flex-wrap mb-[40px]">
          <div className="max-w-[44rem]">
            <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#176B87] mb-[10px]">
              <span>{locale === 'ar' ? 'خطوات التسجيل' : 'How to Get Started'}</span>
            </div>

            <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] font-extrabold text-[#142D4E] leading-[1.4] text-balance">
              {locale === 'ar' ? (
                <>
                  ابدأ رحلتك التعليمية في <span className="text-[#176B87]">أربع خطوات</span>
                </>
              ) : (
                <>
                  Begin Your Learning Journey in{' '}
                  <span className="text-[#176B87]">Four Simple Steps</span>
                </>
              )}
            </h2>

            <p className="text-[#4B6178] text-[1rem] leading-[1.85] mt-[8px]">
              {locale === 'ar'
                ? 'إجراءات إلكترونية واضحة وميسّرة تمنحك انتقالًا سريعًا من اختيار البرنامج إلى بدء الدراسة.'
                : 'Clear online steps designed to take you smoothly from selecting your program to your first class.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onStartRegistration}
            className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[26px] py-[12px] font-bold text-[0.95rem] bg-[#176B87] text-white hover:bg-[#142D4E] shadow-[0_8px_22px_rgba(23,107,135,0.22)] hover:shadow-[0_12px_28px_rgba(20,45,78,0.26)] transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span>{locale === 'ar' ? 'ابدأ التسجيل الآن' : 'Start Registration Now'}</span>
            {locale === 'ar' ? (
              <ArrowLeft className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
            )}
          </button>
        </div>

        <ol className="relative list-none m-0 p-0 grid grid-cols-4 max-[959px]:grid-cols-1 gap-[20px] max-[959px]:gap-[0px]">
          <div
            className="hidden min-[960px]:block pointer-events-none absolute top-[26px] inset-x-[12.5%] h-[2px] bg-gradient-to-r rtl:from-[#176B87] rtl:via-[#28B5C5] rtl:to-[#28B5C5]/35 ltr:from-[#28B5C5]/35 ltr:via-[#28B5C5] ltr:to-[#176B87]"
            aria-hidden="true"
          />

          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            return (
              <li
                key={step.number}
                className="relative flex flex-col max-[959px]:grid max-[959px]:grid-cols-[52px_minmax(0,1fr)] max-[959px]:gap-[18px] max-[959px]:pb-[20px] max-[959px]:last:pb-0"
              >
                {!isLast && (
                  <span
                    className="hidden max-[959px]:block pointer-events-none absolute start-[25px] top-[56px] bottom-[4px] w-[2px] bg-gradient-to-b from-[#176B87] via-[#28B5C5] to-[#DCE7ED]"
                    aria-hidden="true"
                  />
                )}
                <div className="flex justify-center max-[959px]:justify-start mb-[16px] max-[959px]:mb-0 relative z-[1]">
                  <span
                    className={`num w-[52px] h-[52px] rounded-full grid place-items-center font-extrabold text-[1.15rem] border-2 transition-colors ${
                      isLast
                        ? 'bg-[#176B87] text-white border-[#176B87] shadow-[0_10px_24px_rgba(23,107,135,0.28)]'
                        : 'bg-[#DDF3F5] text-[#142D4E] border-[#28B5C5]'
                    }`}
                  >
                    {step.number}
                  </span>
                </div>

                <div className="flex-1 bg-white border border-[#DCE7ED] rounded-[16px] p-[22px] max-[959px]:p-[18px] transition-all duration-200 hover:border-[#28B5C5] hover:shadow-[0_12px_28px_rgba(20,45,78,0.07)]">
                  <h3 className="text-[1.04rem] font-bold text-[#142D4E] leading-[1.45]">
                    {locale === 'ar' ? step.titleAr : step.titleEn}
                  </h3>
                  <p className="text-[0.88rem] text-[#64748B] leading-[1.75] mt-[6px]">
                    {locale === 'ar' ? step.descAr : step.descEn}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
