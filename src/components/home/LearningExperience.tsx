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
      titleAr: 'قاعات دراسية افتراضية وموارد رقمية',
      titleEn: 'Virtual Classrooms & Digital Materials',
      descAr: 'احضر المحاضرات المسائية المباشرة وارجع إلى المحتوى التعليمي والملخصات من بوابة التعلم في أي وقت.',
      descEn: 'Join live evening lectures and revisit study guides and materials anytime through the student portal.',
    },
    {
      icon: Layers,
      titleAr: 'تدرّج معرفي من الأساسيات للإتقان',
      titleEn: 'Step-by-Step Academic Progression',
      descAr: 'وحدات تعليمية مترابطة تنقلك من المفاهيم التأسيسية إلى المهارات التخصصية المتقدمة بوضوح.',
      descEn: 'Connected learning units guide you smoothly from foundational concepts to specialized applications.',
    },
    {
      icon: Target,
      titleAr: 'أنشطة وتطبيقات واقعية',
      titleEn: 'Practical Exercises & Case Studies',
      descAr: 'دراسات حالة وتدريبات موجهة تحاكي مواقف العمل الفعلية وتثبت ما تعلمته خلال الفصل الدراسي.',
      descEn: 'Guided case studies and applied tasks mirror real-world scenarios throughout the semester.',
    },
  ];

  return (
    <section className="bg-white dark:bg-[#0B1726] py-[72px] max-[720px]:py-[52px]">
      <div className="wrap grid grid-cols-[minmax(0,6fr)_minmax(0,6fr)] max-[960px]:grid-cols-1 gap-[clamp(28px,4.5vw,64px)] items-center">
        <div className="relative max-[960px]:order-2">
          <div className="relative rounded-[18px] overflow-hidden border border-[#DCE7ED] dark:border-white/12 bg-[#0E223D] shadow-[0_20px_48px_rgba(20,45,78,0.11)] dark:shadow-[0_20px_48px_rgba(0,0,0,0.42)] aspect-[4/3]">
            <img
              src="/src/assets/images/digital_learning_1795281370106.jpg"
              alt={
                locale === 'ar'
                  ? 'منظومة التعلم الإلكتروني التفاعلية وجداول المقررات الرقمية والكتب الدراسية'
                  : 'Interactive digital learning workstation displaying online course modules, progress tracking, and textbooks'
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
          <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#176B87] dark:text-[#28B5C5] mb-[10px]">
            <span>{locale === 'ar' ? 'أسلوب الدراسة' : 'How You Learn'}</span>
          </div>

          <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] font-extrabold text-[#142D4E] dark:text-[#F1F5F9] leading-[1.4] text-balance">
            {locale === 'ar' ? (
              <>
                تعلّم تفاعلي يربط <span className="text-[#176B87] dark:text-[#28B5C5]">النظرية بالممارسة</span>
              </>
            ) : (
              <>
                Interactive Study Connecting{' '}
                <span className="text-[#176B87] dark:text-[#28B5C5]">Theory &amp; Practice</span>
              </>
            )}
          </h2>

          <p className="text-[#64748B] dark:text-[#B8C7D9] text-[1.02rem] leading-[1.9] mt-[12px] max-w-[42rem]">
            {locale === 'ar'
              ? 'لا يقتصر التعلّم هنا على استعراض الدروس، بل يمتد إلى التفاعل المباشر والتطبيق العملي الذي يرسّخ الفهم ويبني ثقة المتعلم.'
              : 'Learning here goes beyond passive reading—encouraging active participation and practical exercises that build lasting confidence.'}
          </p>

          <div className="grid gap-[14px] mt-[24px] w-full">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.titleAr}
                  className="flex items-start gap-[14px] rounded-[14px] border border-[#DCE7ED] bg-[#EAF3F6]/45 dark:border-white/12 dark:bg-[#142D4E] p-[16px] transition-colors hover:border-[#28B5C5]/80 hover:bg-[#EAF3F6]/80 dark:hover:bg-[#1B3553]"
                >
                  <span className="w-[40px] h-[40px] rounded-[11px] bg-[#DDF3F5] text-[#176B87] border border-[#28B5C5]/25 dark:bg-[#1B3553] dark:text-[#28B5C5] dark:border-[#28B5C5]/30 grid place-items-center flex-none mt-[2px]">
                    <Icon className="w-[19px] h-[19px]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[0.98rem] font-bold text-[#142D4E] dark:text-[#F1F5F9] leading-[1.45]">
                      {locale === 'ar' ? pillar.titleAr : pillar.titleEn}
                    </h3>
                    <p className="text-[0.86rem] text-[#64748B] dark:text-[#B8C7D9] leading-[1.7] mt-[3px]">
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
              className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[22px] py-[10px] font-bold text-[0.92rem] border border-[#DCE7ED] bg-white text-[#142D4E] hover:border-[#28B5C5] hover:bg-[#DDF3F5]/65 hover:text-[#176B87] dark:border-white/15 dark:bg-[#142D4E] dark:text-[#F1F5F9] dark:hover:border-[#28B5C5] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] transition-all duration-200 cursor-pointer"
            >
              <span>{locale === 'ar' ? 'اكتشف الدورات المتاحة' : 'Explore Available Courses'}</span>
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
