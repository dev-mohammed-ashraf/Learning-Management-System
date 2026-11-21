import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ENROLLMENT_STEPS } from '../../data/programs';
import type { Locale } from '../../types/program';
import { splitTwoToneTitle } from '../../utils/programFilter';

interface EnrollmentJourneyProps {
  locale: Locale;
  onStartRegistration: () => void;
}

export function EnrollmentJourney({ locale, onStartRegistration }: EnrollmentJourneyProps) {
  const headingText =
    locale === 'ar' ? 'أربع خطوات لتبدأ التعلم' : 'Four Steps to Start Learning';
  const { lead, tail } = splitTwoToneTitle(headingText);

  return (
    <section className="bg-[#EAF3F6] dark:bg-[#102238] border-y border-[#DCE7ED] dark:border-white/12 py-[72px] max-[720px]:py-[50px]">
      <div className="wrap grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] max-[980px]:grid-cols-1 gap-[clamp(28px,4vw,64px)] items-center">
        <div className="grid gap-[12px] justify-items-start">
          <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#176B87] dark:text-[#28B5C5] tracking-[0.02em] mb-[2px]">
            <span>{locale === 'ar' ? 'مسار التسجيل الدراسي' : 'Study Enrollment'}</span>
          </div>

          <h2 className="text-[clamp(1.6rem,3vw,2.15rem)] font-extrabold text-[#142D4E] dark:text-[#F1F5F9] leading-[1.45] text-balance">
            {lead}
            {tail ? (
              <>
                {' '}
                <span className="text-[#176B87] dark:text-[#28B5C5]">{tail}</span>
              </>
            ) : null}
          </h2>

          <p className="text-[#4B6178] dark:text-[#B8C7D9] leading-[1.95] max-w-[62ch]">
            {locale === 'ar'
              ? 'من استعراض تفاصيل الدورة حتى دخولك إلى أول محاضرة مسائية، تسير خطوات تسجيلك إلكترونيًا بوضوح وسلاسة.'
              : 'From reviewing course details to joining your first evening lecture, every enrollment step happens online with complete clarity.'}
          </p>

          <div className="flex flex-wrap items-center gap-[14px_20px] mt-[8px]">
            <button
              type="button"
              onClick={onStartRegistration}
              className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[26px] py-[11px] font-bold text-[0.95rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] hover:shadow-[0_10px_24px_rgba(20,45,78,0.24)] transition-all cursor-pointer"
            >
              <span>{locale === 'ar' ? 'إنشاء حساب طالب' : 'Create Student Account'}</span>
              {locale === 'ar' ? (
                <ArrowLeft className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
              ) : (
                <ArrowRight className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <ol className="list-none m-0 p-0 grid">
          {ENROLLMENT_STEPS.map((step, index) => {
            const isLast = index === ENROLLMENT_STEPS.length - 1;
            return (
              <li
                key={step.number}
                className="ut-jr-step relative grid grid-cols-[52px_minmax(0,1fr)] gap-[18px] pb-[22px] last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={`num w-[52px] h-[52px] rounded-full grid place-items-center font-bold text-[1.15rem] border-2 relative z-[1] transition-colors ${
                    isLast
                      ? 'bg-[#176B87] text-white border-[#176B87] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:border-[#28B5C5] shadow-[0_10px_24px_rgba(23,107,135,0.28)]'
                      : 'bg-[#DDF3F5] text-[#142D4E] border-[#28B5C5] dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:border-[#28B5C5]'
                  }`}
                >
                  {step.number}
                </span>

                <div className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] px-[20px] py-[16px] transition-all duration-200 hover:border-[#28B5C5]/80 dark:hover:bg-[#1B3553] hover:shadow-[0_8px_24px_rgba(20,45,78,0.06)] hover:-translate-x-[3px]">
                  <h3 className="text-[1.02rem] font-bold text-[#142D4E] dark:text-[#F1F5F9] leading-[1.5]">
                    {locale === 'ar' ? step.titleAr : step.titleEn}
                  </h3>
                  <p className="text-[#64748B] dark:text-[#B8C7D9] text-[0.9rem] leading-[1.8] mt-[3px]">
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
