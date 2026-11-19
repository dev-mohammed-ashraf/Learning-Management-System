import { BookMarked, Briefcase, Clock3, Cpu } from 'lucide-react';
import type { Locale } from '../../types/program';

interface WhyChooseUsProps {
  locale: Locale;
}

export function WhyChooseUs({ locale }: WhyChooseUsProps) {
  const features = [
    {
      icon: BookMarked,
      titleAr: 'برامج أكاديمية متخصصة',
      titleEn: 'Specialized Academic Programs',
      descAr: 'دبلومات مهنية وأكاديمية معتمدة مصممة بعناية لتغطية التخصصات الإدارية والأمنية واللغوية واللوجستية.',
      descEn: 'Accredited professional and academic diplomas structured across administrative, security, language, and logistics fields.',
    },
    {
      icon: Clock3,
      titleAr: 'مرونة في التعلم',
      titleEn: 'Flexible Learning Experience',
      descAr: 'جداول دراسية مسائية ونظام تعلم إلكتروني متكامل يتيح لك التوفيق بين التزاماتك المهنية وتطوير مسارك.',
      descEn: 'Evening schedules and integrated digital learning enable seamless balance between work commitments and study.',
    },
    {
      icon: Briefcase,
      titleAr: 'محتوى يواكب سوق العمل',
      titleEn: 'Market-Aligned Curriculum',
      descAr: 'خطط تدريبية مركّزة تجمع بين المعرفة النظرية والمهارات التطبيقية التي تحتاجها القطاعات الحديثة.',
      descEn: 'Focused curricula combining academic foundations with practical skills sought across modern sectors.',
    },
    {
      icon: Cpu,
      titleAr: 'بيئة تعليمية متطورة',
      titleEn: 'Advanced Learning Environment',
      descAr: 'منظومة رقمية حديثة وقاعات تدريب مجهزة تدعم التفاعل المستمر والمتابعة الأكاديمية الميسرة.',
      descEn: 'Contemporary digital systems and equipped learning spaces supporting smooth academic engagement.',
    },
  ];

  return (
    <section className="bg-[#DDF3F5]/55 border-y border-[#28B5C5]/25 py-[72px] max-[720px]:py-[52px]">
      <div className="wrap">
        <div className="max-w-[44rem] mb-[36px]">
          <div className="ut-eyebrow inline-flex items-center gap-[9px] text-[0.84rem] font-bold text-[#176B87] mb-[10px]">
            <span>{locale === 'ar' ? 'مزايا المعهد' : 'Why Our Institute'}</span>
          </div>

          <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] font-extrabold text-[#142D4E] leading-[1.4] text-balance">
            {locale === 'ar' ? (
              <>
                لماذا تختار <span className="text-[#176B87]">معهد البحوث والاستشارات؟</span>
              </>
            ) : (
              <>
                Why Choose the{' '}
                <span className="text-[#176B87]">Research &amp; Consulting Institute?</span>
              </>
            )}
          </h2>

          <p className="text-[#4B6178] text-[1rem] leading-[1.85] mt-[10px]">
            {locale === 'ar'
              ? 'نحرص على تقديم تجربة أكاديمية وتدريبية متكاملة تجمع بين الجودة المؤسسية والجاهزية المهنية.'
              : 'We deliver an integrated academic and training experience uniting institutional quality with career readiness.'}
          </p>
        </div>

        <div className="grid grid-cols-4 max-[1080px]:grid-cols-2 max-[600px]:grid-cols-1 gap-[20px]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.titleAr}
                className="group bg-white border border-[#DCE7ED] rounded-[16px] p-[24px] flex flex-col items-start transition-all duration-200 hover:-translate-y-[4px] hover:border-[#28B5C5] hover:shadow-[0_18px_38px_rgba(20,45,78,0.09)]"
              >
                <div className="w-full flex items-center justify-between mb-[18px]">
                  <span className="w-[48px] h-[48px] rounded-[14px] bg-[#DDF3F5] text-[#176B87] border border-[#28B5C5]/30 grid place-items-center transition-colors group-hover:bg-[#176B87] group-hover:text-white group-hover:border-[#176B87]">
                    <Icon className="w-[22px] h-[22px]" aria-hidden="true" />
                  </span>
                  <span className="num text-[0.82rem] font-extrabold text-[#28B5C5]/80">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-[1.06rem] font-bold text-[#142D4E] leading-[1.45] mb-[8px]">
                  {locale === 'ar' ? feature.titleAr : feature.titleEn}
                </h3>

                <p className="text-[0.9rem] text-[#64748B] leading-[1.78]">
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
