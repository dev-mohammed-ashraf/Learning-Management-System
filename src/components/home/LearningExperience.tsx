import { ArrowLeft, ArrowRight, Laptop, Layers, Target } from 'lucide-react';
import type { Locale } from '../../types/program';

interface LearningExperienceProps {
  locale: Locale;
  onExplorePrograms: () => void;
}

export function LearningExperience({ locale, onExplorePrograms }: LearningExperienceProps) {
  const pillars = [
    {
      icon: Laptop,
      titleAr: 'فصول افتراضية ومنظومة رقمية متكاملة',
      titleEn: 'Integrated Virtual Classrooms & LMS',
      descAr: 'إتاحة المحاضرات التفاعلية والمواد التعليمية عبر بوابة التعلم الإلكتروني في أي وقت ومن أي مكان.',
      descEn: 'Access live sessions and structured learning resources seamlessly through the digital learning portal.',
    },
    {
      icon: Layers,
      titleAr: 'مناهج تدريبية منظمة ومتدرجة',
      titleEn: 'Structured Progressive Curricula',
      descAr: 'بناء المعرفة التخصصية خطوة بخطوة عبر وحدات دراسية واضحة وخطط زمنية محددة.',
      descEn: 'Step-by-step mastery built through well-organized modules and clear semester schedules.',
    },
    {
      icon: Target,
      titleAr: 'تطبيق عملي يعزز الجاهزية المهنية',
      titleEn: 'Applied Practice for Career Readiness',
      descAr: 'نماذج وتطبيقات عملية تربط المفاهيم الأكاديمية بمتطلبات بيئات العمل الحقيقية.',
      descEn: 'Practical frameworks and case studies connecting academic concepts directly to workplace realities.',
    },
  ];

  return (
    <section className="bg-white py-[72px] max-[720px]:py-[52px]">
      <div className="wrap grid grid-cols-[minmax(0,6fr)_minmax(0,6fr)] max-[960px]:grid-cols-1 gap-[clamp(28px,4.5vw,64px)] items-center">
        <div className="relative max-[960px]:order-2">
          <div className="relative rounded-[18px] overflow-hidden border border-[#DCE7ED] bg-[#0E223D] shadow-[0_20px_48px_rgba(20,45,78,0.11)] aspect-[4/3]">
            <img
              src="/src/assets/images/learning_training_hall_1795124494586.jpg"
              alt={
                locale === 'ar'
                  ? 'قاعة تدريب ذكية حديثة في معهد البحوث والاستشارات بجامعة تبوك'
                  : 'Modern smart lecture hall at the Research and Consulting Institute'
              }
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center block"
            />
          </div>
          <div
            className="hidden sm:block pointer-events-none absolute -bottom-3 -start-3 w-[76px] h-[76px] rounded-es-[18px] border-b-2 border-s-2 border-[#28B5C5]"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col items-start max-[960px]:order-1">
          <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#176B87] mb-[10px]">
            <span>{locale === 'ar' ? 'منهجية التدريب' : 'Learning Methodology'}</span>
          </div>

          <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] font-extrabold text-[#142D4E] leading-[1.4] text-balance">
            {locale === 'ar' ? (
              <>
                تجربة تعليمية تجمع بين <span className="text-[#176B87]">المعرفة والتطبيق</span>
              </>
            ) : (
              <>
                A Learning Experience Uniting{' '}
                <span className="text-[#176B87]">Knowledge &amp; Practice</span>
              </>
            )}
          </h2>

          <p className="text-[#64748B] text-[1.02rem] leading-[1.9] mt-[12px] max-w-[42rem]">
            {locale === 'ar'
              ? 'صُممت مساراتنا التعليمية لتوفر بيئة تفاعلية متوازنة تدعم الفهم العميق والتطبيق العملي طوال فترة الدراسة.'
              : 'Our learning tracks provide a balanced interactive environment designed for deep understanding and applied competence.'}
          </p>

          <div className="grid gap-[14px] mt-[24px] w-full">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.titleAr}
                  className="flex items-start gap-[14px] rounded-[14px] border border-[#DCE7ED] bg-[#EAF3F6]/45 p-[16px] transition-colors hover:border-[#28B5C5]/80 hover:bg-[#EAF3F6]/80"
                >
                  <span className="w-[40px] h-[40px] rounded-[11px] bg-[#DDF3F5] text-[#176B87] border border-[#28B5C5]/25 grid place-items-center flex-none mt-[2px]">
                    <Icon className="w-[19px] h-[19px]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[0.98rem] font-bold text-[#142D4E] leading-[1.45]">
                      {locale === 'ar' ? pillar.titleAr : pillar.titleEn}
                    </h3>
                    <p className="text-[0.86rem] text-[#64748B] leading-[1.7] mt-[3px]">
                      {locale === 'ar' ? pillar.descAr : pillar.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-[24px]">
            <button
              type="button"
              onClick={onExplorePrograms}
              className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[22px] py-[10px] font-bold text-[0.92rem] border border-[#DCE7ED] bg-white text-[#142D4E] hover:border-[#28B5C5] hover:bg-[#DDF3F5]/65 hover:text-[#176B87] transition-all duration-200 cursor-pointer"
            >
              <span>{locale === 'ar' ? 'استكشف البرامج المتاحة' : 'Explore Available Programs'}</span>
              {locale === 'ar' ? (
                <ArrowLeft className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
              ) : (
                <ArrowRight className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
