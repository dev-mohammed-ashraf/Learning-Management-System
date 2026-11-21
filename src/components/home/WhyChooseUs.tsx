import { BookMarked, Briefcase, Clock3, Cpu } from 'lucide-react';
import type { Locale } from '../../types/program';

interface WhyChooseUsProps {
  locale: Locale;
}

export function WhyChooseUs({ locale }: WhyChooseUsProps) {
  const features = [
    {
      icon: BookMarked,
      titleAr: 'تخصصات تطبيقية متنوعة',
      titleEn: 'Focused Applied Tracks',
      descAr: 'سبعة دبلومات مهنية معتمدة تغطي الإدارة، اللوجستيات، خدمة المستفيدين، المشتريات، الأمن، واللغة الإنجليزية.',
      descEn: 'Seven accredited diplomas spanning business, logistics, client experience, procurement, security, and English.',
    },
    {
      icon: Clock3,
      titleAr: 'تنظيم مرن لوقت الدراسة',
      titleEn: 'Flexible Evening Attendance',
      descAr: 'نظام الدراسة المسائية عن بُعد يساعدك على استكمال تعليمك دون تعارض مع ارتباطاتك اليومية.',
      descEn: 'Evening distance sessions let you pursue academic growth alongside your daily commitments.',
    },
    {
      icon: Briefcase,
      titleAr: 'أهداف ومحاور واضحة',
      titleEn: 'Clear Module Outlines',
      descAr: 'كل دورة تعرض محاورها الدراسية وساعاتها المعتمدة ورسومها بشفافية كاملة قبل اتخاذ قرار التسجيل.',
      descEn: 'Every course presents its core modules, credit hours, and tuition transparently before you enroll.',
    },
    {
      icon: Cpu,
      titleAr: 'أدوات تعلم رقمية متكاملة',
      titleEn: 'Connected Digital Classroom',
      descAr: 'قاعات افتراضية، محاضرات متاحة للمراجعة، وواجبات إلكترونية تدعم استيعابك في كل وحدة دراسية.',
      descEn: 'Virtual classrooms, reviewable recordings, and digital assignments reinforce comprehension across every module.',
    },
  ];

  return (
    <section className="bg-[#DDF3F5]/55 dark:bg-[#0B1726] border-y border-[#28B5C5]/25 dark:border-white/12 py-[72px] max-[720px]:py-[52px]">
      <div className="wrap">
        <div className="max-w-[44rem] mb-[36px]">
          <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#176B87] dark:text-[#28B5C5] mb-[10px]">
            <span>{locale === 'ar' ? 'تجربة الطالب أولاً' : 'Student-First Design'}</span>
          </div>

          <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] font-extrabold text-[#142D4E] dark:text-[#F1F5F9] leading-[1.4] text-balance">
            {locale === 'ar' ? (
              <>
                ما الذي يميّز <span className="text-[#176B87] dark:text-[#28B5C5]">التعلّم عبر منصتنا؟</span>
              </>
            ) : (
              <>
                What Sets Our{' '}
                <span className="text-[#176B87] dark:text-[#28B5C5]">Learning Platform Apart?</span>
              </>
            )}
          </h2>

          <p className="text-[#4B6178] dark:text-[#B8C7D9] text-[1rem] leading-[1.85] mt-[10px]">
            {locale === 'ar'
              ? 'حرصنا على تصميم مسار دراسي متوازن يمنح المتعلم وضوحًا في الأهداف، ومرونة في الحضور، ومحتوى علميًا قابلًا للتطبيق.'
              : 'We shaped a balanced academic experience giving learners clear study roadmaps, flexible attendance, and practical coursework.'}
          </p>
        </div>

        <div className="grid grid-cols-4 max-[1080px]:grid-cols-2 max-[600px]:grid-cols-1 gap-[20px]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.titleAr}
                className="group bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[24px] flex flex-col items-start transition-all duration-200 hover:-translate-y-[4px] hover:border-[#28B5C5] dark:hover:bg-[#1B3553]/90 hover:shadow-[0_18px_38px_rgba(20,45,78,0.09)] dark:hover:shadow-[0_18px_38px_rgba(0,0,0,0.36)]"
              >
                <div className="w-full flex items-center justify-between mb-[18px]">
                  <span className="w-[48px] h-[48px] rounded-[14px] bg-[#DDF3F5] text-[#176B87] border border-[#28B5C5]/30 dark:bg-[#1B3553] dark:text-[#28B5C5] dark:border-[#28B5C5]/30 grid place-items-center transition-colors group-hover:bg-[#176B87] group-hover:text-white group-hover:border-[#176B87] dark:group-hover:bg-[#28B5C5] dark:group-hover:text-[#0B1726] dark:group-hover:border-[#28B5C5]">
                    <Icon className="w-[22px] h-[22px]" aria-hidden="true" />
                  </span>
                  <span className="num text-[0.82rem] font-extrabold text-[#28B5C5]/80">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-[1.06rem] font-bold text-[#142D4E] dark:text-[#F1F5F9] leading-[1.45] mb-[8px]">
                  {locale === 'ar' ? feature.titleAr : feature.titleEn}
                </h3>

                <p className="text-[0.9rem] text-[#64748B] dark:text-[#B8C7D9] leading-[1.78]">
                  {locale === 'ar' ? feature.descAr : feature.descEn}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
