import { Award, BriefcaseBusiness, Layers, MonitorCheck } from 'lucide-react';
import type { Locale } from '../../types/program';

interface TrustIndicatorsProps {
  locale: Locale;
}

export function TrustIndicators({ locale }: TrustIndicatorsProps) {
  const items = [
    {
      icon: Layers,
      titleAr: 'خطط دراسية واضحة',
      titleEn: 'Structured Study Plans',
      descAr: 'مناهج منظمة ومقسمة إلى وحدات تعليمية متدرجة.',
      descEn: 'Well-organized curricula divided into progressive learning modules.',
    },
    {
      icon: MonitorCheck,
      titleAr: 'دراسة مسائية عن بُعد',
      titleEn: 'Flexible Evening Online Study',
      descAr: 'محاضرات تفاعلية عن بُعد تلائم جدولك اليومي والتزاماتك.',
      descEn: 'Interactive evening sessions designed to fit your daily schedule.',
    },
    {
      icon: BriefcaseBusiness,
      titleAr: 'تطبيقات وحالات عملية',
      titleEn: 'Applied Learning Practice',
      descAr: 'محتوى يربط المفاهيم الدراسية بالتجارب والمهارات الميدانية.',
      descEn: 'Coursework connecting academic concepts to real workplace scenarios.',
    },
    {
      icon: Award,
      titleAr: 'شهادة جامعية معتمدة',
      titleEn: 'Accredited University Certificate',
      descAr: '30 ساعة معتمدة وشهادة معتمدة عند إتمام متطلبات التخرج.',
      descEn: '30 credit hours culminating in an accredited graduation certificate.',
    },
  ];

  return (
    <section
      aria-label={locale === 'ar' ? 'ركائز التجربة التعليمية' : 'Learning Experience Pillars'}
      className="bg-white dark:bg-[#0B1726] border-b border-[#DCE7ED] dark:border-white/12 py-[28px]"
    >
      <div className="wrap">
        <div className="grid grid-cols-4 max-[1024px]:grid-cols-2 max-[580px]:grid-cols-1 gap-[16px]">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.titleAr}
                className="flex items-start gap-[14px] rounded-[14px] border border-[#DCE7ED] bg-[#EAF3F6]/55 dark:border-white/12 dark:bg-[#142D4E] px-[18px] py-[16px] transition-all duration-200 hover:border-[#28B5C5]/75 hover:bg-white dark:hover:bg-[#1B3553] hover:shadow-[0_10px_28px_rgba(20,45,78,0.06)] dark:hover:shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
              >
                <span className="w-[42px] h-[42px] rounded-[12px] bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5] grid place-items-center flex-none border border-[#28B5C5]/25 dark:border-[#28B5C5]/30">
                  <Icon className="w-[20px] h-[20px]" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[0.95rem] font-bold text-[#142D4E] dark:text-[#F1F5F9] leading-[1.45]">
                    {locale === 'ar' ? item.titleAr : item.titleEn}
                  </h2>
                  <p className="text-[0.8rem] text-[#64748B] dark:text-[#B8C7D9] leading-[1.65] mt-[3px]">
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
