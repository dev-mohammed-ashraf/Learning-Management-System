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
    locale === 'ar' ? 'أربع خطوات لتقديم طلبك' : 'Four Steps to Submit Your Application';
  const { lead, tail } = splitTwoToneTitle(headingText);

  return (
    <section className="bg-[#F5F8FB] border-y border-[#E3EAF1] py-[72px] max-[720px]:py-[50px]">
      <div className="wrap grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] max-[980px]:grid-cols-1 gap-[clamp(28px,4vw,64px)] items-center">
        <div className="grid gap-[12px] justify-items-start">
          <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.82rem] font-bold text-[#A87E2B] tracking-[0.02em] mb-[2px]">
            <span>{locale === 'ar' ? 'رحلة الالتحاق' : 'Enrollment Journey'}</span>
          </div>

          <h2 className="text-[clamp(1.6rem,3vw,2.15rem)] font-bold text-[#0C3B61] leading-[1.45] text-balance">
            {lead}
            {tail ? (
              <>
                {' '}
                <span className="text-[#A87E2B]">{tail}</span>
              </>
            ) : null}
          </h2>

          <p className="text-[#5E7489] leading-[1.95] max-w-[62ch]">
            {locale === 'ar'
              ? 'من اختيار البرنامج حتى أول محاضرة، تتم رحلتك إلكترونيًا بالكامل دون مراجعات أو أوراق.'
              : 'From selecting your program to attending your first lecture, your entire journey is completed online with zero paperwork.'}
          </p>

          <div className="flex flex-wrap items-center gap-[14px_20px] mt-[8px]">
            <button
              type="button"
              onClick={onStartRegistration}
              className="inline-flex items-center justify-center gap-[8px] rounded-[10px] px-[26px] py-[11px] font-bold text-[0.95rem] bg-[#1C5D92] text-white hover:bg-[#154A76] hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(28,93,146,0.3)] transition-all cursor-pointer"
            >
              <span>{locale === 'ar' ? 'ابدأ التسجيل' : 'Start Registration'}</span>
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
                  className={`num w-[52px] h-[52px] rounded-full grid place-items-center font-bold text-[1.15rem] border-2 relative z-[1] ${
                    isLast
                      ? 'bg-[#1C5D92] text-white border-[#1C5D92] shadow-[0_10px_24px_rgba(28,93,146,0.3)]'
                      : 'bg-[#C99B3F]/14 text-[#A87E2B] border-[#C99B3F]'
                  }`}
                >
                  {step.number}
                </span>

                <div className="bg-white border border-[#E3EAF1] rounded-[18px] px-[20px] py-[16px] transition-all duration-200 hover:border-[#D3E1EE] hover:shadow-[0_4px_16px_rgba(12,59,97,0.05)] hover:-translate-x-[3px]">
                  <h3 className="text-[1.02rem] font-bold text-[#12263A] leading-[1.5]">
                    {locale === 'ar' ? step.titleAr : step.titleEn}
                  </h3>
                  <p className="text-[#5E7489] text-[0.9rem] leading-[1.8] mt-[3px]">
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
