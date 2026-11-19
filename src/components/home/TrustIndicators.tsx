import { Award, BriefcaseBusiness, Layers, MonitorCheck } from 'lucide-react';
import type { Locale } from '../../types/program';

interface TrustIndicatorsProps {
  locale: Locale;
}

export function TrustIndicators({ locale }: TrustIndicatorsProps) {
  const items = [
    {
      icon: Layers,
      titleAr: 'برامج تدريبية وأكاديمية متنوعة',
      titleEn: 'Diverse Academic & Training Programs',
      descAr: 'دبلومات مهنية متخصصة تلبي مسارات وظيفية متعددة.',
      descEn: 'Specialized professional diplomas across key career tracks.',
    },
    {
      icon: BriefcaseBusiness,
      titleAr: 'تأهيل الكفاءات لسوق العمل',
      titleEn: 'Workforce Capability Readiness',
      descAr: 'تركيز عملي على المهارات المطلوبة في القطاعات الحيوية.',
      descEn: 'Practical focus on skills demanded across vital sectors.',
    },
    {
      icon: Award,
      titleAr: 'خبرات أكاديمية ومهنية',
      titleEn: 'Academic & Professional Expertise',
      descAr: 'مناهج مصممة وفق معايير جامعة تبوك الأكاديمية.',
      descEn: 'Curricula structured to University of Tabuk academic standards.',
    },
    {
      icon: MonitorCheck,
      titleAr: 'بيئة تعليمية متطورة',
      titleEn: 'Modern Learning Environment',
      descAr: 'منظومة تعلم إلكتروني تفاعلية ومصادر رقمية حديثة.',
      descEn: 'Interactive online classrooms and contemporary digital resources.',
    },
  ];

  return (
    <section
      aria-label={locale === 'ar' ? 'مؤشرات الثقة المؤسسية' : 'Institutional Trust Indicators'}
      className="bg-white border-b border-[#DCE7ED] py-[28px]"
    >
      <div className="wrap">
        <div className="grid grid-cols-4 max-[1024px]:grid-cols-2 max-[580px]:grid-cols-1 gap-[16px]">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.titleAr}
                className="flex items-start gap-[14px] rounded-[14px] border border-[#DCE7ED] bg-[#EAF3F6]/55 px-[18px] py-[16px] transition-all duration-200 hover:border-[#28B5C5]/75 hover:bg-white hover:shadow-[0_10px_28px_rgba(20,45,78,0.06)]"
              >
                <span className="w-[42px] h-[42px] rounded-[12px] bg-[#DDF3F5] text-[#176B87] grid place-items-center flex-none border border-[#28B5C5]/25">
                  <Icon className="w-[20px] h-[20px]" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[0.95rem] font-bold text-[#142D4E] leading-[1.45]">
                    {locale === 'ar' ? item.titleAr : item.titleEn}
                  </h2>
                  <p className="text-[0.8rem] text-[#64748B] leading-[1.65] mt-[3px]">
                    {locale === 'ar' ? item.descAr : item.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
