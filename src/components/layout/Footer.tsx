import { Mail, Phone } from 'lucide-react';
import { PROGRAMS } from '../../data/programs';
import type { Locale, Program } from '../../types/program';
import type { NavSection } from './MainNavbar';

interface FooterProps {
  locale: Locale;
  onSelectNav: (nav: NavSection) => void;
  onOpenProgram: (program: Program) => void;
  onOpenPolicy: () => void;
}

export function Footer({
  locale,
  onSelectNav,
  onOpenProgram,
  onOpenPolicy,
}: FooterProps) {
  const quickLinks: { labelAr: string; labelEn: string; nav?: NavSection; action?: 'policy' }[] = [
    { labelAr: 'البرامج', labelEn: 'Programs', nav: 'diplomas' },
    { labelAr: 'عن المعهد', labelEn: 'About Institute', nav: 'about' },
    { labelAr: 'الأسئلة الشائعة', labelEn: 'FAQs', nav: 'about' },
    { labelAr: 'برامج الزمالات', labelEn: 'Fellowships', nav: 'fellowships' },
    { labelAr: 'السياسات والأحكام', labelEn: 'Policies & Terms', action: 'policy' },
    { labelAr: 'إفادة جهة العمل', labelEn: 'Employer Letters', nav: 'letters' },
    { labelAr: 'تواصل معنا', labelEn: 'Contact Us', nav: 'contact' },
  ];

  const featuredIds = ['5', '6', '7', '8', '10', '13', '14'];
  const featuredPrograms = featuredIds
    .map((id) => PROGRAMS.find((p) => p.id === id))
    .filter((p): p is Program => Boolean(p));

  const shortFooterLabel = (program: Program): string => {
    if (locale === 'en') return program.titleEn;
    switch (program.id) {
      case '5':
        return 'دبلوم إدارة الأعمال';
      case '6':
        return 'دبلوم إدارة المشتريات والعقود';
      case '7':
        return 'دبلوم الحراسات الأمنية';
      case '8':
        return 'دبلوم اللغة الإنجليزية';
      case '10':
        return 'إدارة اللوجستيات وسلاسل الإمداد';
      case '13':
        return 'دبلوم خدمة العملاء';
      case '14':
        return 'دبلوم إدارة الحشود والفعاليات';
      default:
        return program.titleAr;
    }
  };

  return (
    <footer className="bg-[#0C3B61] text-[#B4CCE0] text-[0.92rem] leading-[1.75]">
      <div className="wrap">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.3fr] max-[920px]:grid-cols-2 max-[560px]:grid-cols-1 gap-[40px] max-[560px]:gap-[32px] pt-[64px] pb-[48px]">
          <div className="min-w-0">
            <img
              src="/assets/ut/logo-white.png"
              alt={
                locale === 'ar'
                  ? 'معهد البحوث والاستشارات — جامعة تبوك'
                  : 'Research and Consulting Institute — University of Tabuk'
              }
              width={480}
              height={156}
              className="block h-[64px] w-auto mb-[20px]"
            />
            <p className="text-[0.9rem] max-w-[40ch]">
              {locale === 'ar'
                ? 'نقدّم البرامج التعليمية والتدريبية منذ 2006م.'
                : 'Delivering academic and training programs since 2006.'}
            </p>
          </div>

          <div className="min-w-0">
            <h4 className="text-white text-[0.95rem] font-bold mb-[16px]">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-[10px] text-[0.9rem]">
              {quickLinks.map((item) => (
                <li key={item.labelAr}>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.action === 'policy') {
                        onOpenPolicy();
                      } else if (item.nav) {
                        onSelectNav(item.nav);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="cursor-pointer transition-colors hover:text-[#C99B3F] text-start"
                  >
                    {locale === 'ar' ? item.labelAr : item.labelEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-white text-[0.95rem] font-bold mb-[16px]">
              {locale === 'ar' ? 'أبرز البرامج' : 'Featured Programs'}
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-[10px] text-[0.9rem]">
              {featuredPrograms.map((program) => (
                <li key={program.id}>
                  <button
                    type="button"
                    onClick={() => onOpenProgram(program)}
                    className="cursor-pointer transition-colors hover:text-[#C99B3F] text-start"
                  >
                    {shortFooterLabel(program)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="text-white text-[0.95rem] font-bold mb-[16px]">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-[10px] text-[0.9rem]">
              <li className="flex gap-[10px] items-start">
                <Phone className="w-[16px] h-[16px] flex-none mt-[5px] text-[#C99B3F]" aria-hidden="true" />
                <a href="tel:+966546505679" dir="ltr" className="hover:text-[#C99B3F] transition-colors">
                  +966 54 650 5679
                </a>
              </li>
              <li className="flex gap-[10px] items-start">
                <Phone className="w-[16px] h-[16px] flex-none mt-[5px] text-[#C99B3F]" aria-hidden="true" />
                <a href="tel:+966144563710" dir="ltr" className="hover:text-[#C99B3F] transition-colors">
                  014 456 3710
                </a>
              </li>
              <li className="flex gap-[10px] items-start">
                <Mail className="w-[16px] h-[16px] flex-none mt-[5px] text-[#C99B3F]" aria-hidden="true" />
                <a
                  href="mailto:irc-programs@ut.edu.sa"
                  dir="ltr"
                  className="hover:text-[#C99B3F] transition-colors"
                >
                  irc-programs@ut.edu.sa
                </a>
              </li>
            </ul>

            <div className="font-bold text-white mt-[24px] mb-[12px] text-[0.9rem]">
              {locale === 'ar' ? 'اعتمادات وشراكات' : 'Accreditations & Partnerships'}
            </div>

            <div
              className="flex items-center gap-[20px] flex-wrap"
              aria-label={locale === 'ar' ? 'اعتمادات وشراكات' : 'Accreditations & Partnerships'}
            >
              <span
                className="h-[48px] grid place-items-center"
                title={locale === 'ar' ? 'المركز الوطني للتعليم الإلكتروني' : 'National eLearning Center'}
              >
                <img
                  src="/assets/ut/lg-nelc-onnavy.svg"
                  alt={locale === 'ar' ? 'المركز الوطني للتعليم الإلكتروني' : 'National eLearning Center'}
                  className="h-[44px] w-auto max-w-[150px] object-contain block opacity-95 hover:opacity-100 transition-opacity"
                />
              </span>

              <span
                className="h-[48px] grid place-items-center"
                title={locale === 'ar' ? 'وزارة التعليم' : 'Ministry of Education'}
              >
                <img
                  src="/assets/ut/lg-moe-onnavy.png"
                  alt={locale === 'ar' ? 'وزارة التعليم' : 'Ministry of Education'}
                  className="h-[44px] w-auto max-w-[150px] object-contain block opacity-95 hover:opacity-100 transition-opacity"
                />
              </span>

              <span
                className="h-[48px] grid place-items-center"
                title={
                  locale === 'ar'
                    ? 'وزارة الموارد البشرية والتنمية الاجتماعية'
                    : 'Ministry of Human Resources and Social Development'
                }
              >
                <img
                  src="/assets/ut/lg-hrsd-onnavy.svg"
                  alt={
                    locale === 'ar'
                      ? 'وزارة الموارد البشرية والتنمية الاجتماعية'
                      : 'Ministry of Human Resources and Social Development'
                  }
                  className="h-[44px] w-auto max-w-[150px] object-contain block opacity-95 hover:opacity-100 transition-opacity"
                />
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-center gap-[34px] max-[560px]:gap-[22px] flex-wrap border-t border-white/12 py-[28px] max-[560px]:py-[22px]"
          aria-label={locale === 'ar' ? 'الهوية الرسمية' : 'Official Identity'}
        >
          <img
            src="/assets/ut/ut-tabuk-white.svg"
            alt={locale === 'ar' ? 'جامعة تبوك' : 'University of Tabuk'}
            className="block w-auto h-[58px] max-[560px]:h-[48px] opacity-92 hover:opacity-100 transition-opacity"
          />
          <span className="w-[1px] h-[46px] bg-white/16 flex-none max-[560px]:hidden" aria-hidden="true" />
          <img
            src="/assets/ut/ut-ai-white.svg"
            alt={
              locale === 'ar'
                ? 'التقنيات المتقدمة والذكاء الاصطناعي 2026'
                : 'Advanced Technologies and AI 2026'
            }
            className="block w-auto h-[50px] max-[560px]:h-[40px] opacity-92 hover:opacity-100 transition-opacity"
          />
          <span className="w-[1px] h-[46px] bg-white/16 flex-none max-[560px]:hidden" aria-hidden="true" />
          <img
            src="/assets/ut/ut-vision-white.svg"
            alt={locale === 'ar' ? 'رؤية السعودية 2030' : 'Saudi Vision 2030'}
            className="block w-auto h-[56px] max-[560px]:h-[46px] opacity-92 hover:opacity-100 transition-opacity"
          />
        </div>

        <div className="border-t border-white/12 py-[20px] flex justify-between items-center gap-[16px] flex-wrap text-[0.82rem] max-[560px]:justify-center max-[560px]:text-center">
          <span>
            {locale === 'ar'
              ? '© 2026 معهد البحوث والاستشارات — جامعة تبوك. جميع الحقوق محفوظة.'
              : '© 2026 Research and Consulting Institute — University of Tabuk. All rights reserved.'}
          </span>
          <nav
            className="flex items-center gap-[20px]"
            aria-label={locale === 'ar' ? 'السياسات والأحكام' : 'Policies & Terms'}
          >
            <button
              type="button"
              onClick={onOpenPolicy}
              className="hover:text-[#C99B3F] transition-colors cursor-pointer"
            >
              {locale === 'ar' ? 'السياسات والأحكام' : 'Policies & Terms'}
            </button>
            <button
              type="button"
              onClick={() => onSelectNav('contact')}
              className="hover:text-[#C99B3F] transition-colors cursor-pointer"
            >
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
