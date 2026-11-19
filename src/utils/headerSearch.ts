import type { Locale, Program } from '../types/program';
import { normalizeArabicSearch } from './programFilter';

export type SearchServiceTarget =
  | 'diplomas'
  | 'fellowships'
  | 'about'
  | 'letters'
  | 'lms'
  | 'entities'
  | 'support'
  | 'contact';

export interface PortalServiceEntry {
  id: SearchServiceTarget;
  titleAr: string;
  titleEn: string;
  keywordsAr: string;
  keywordsEn: string;
}

export const PORTAL_SERVICES: PortalServiceEntry[] = [
  {
    id: 'lms',
    titleAr: 'بوابة التعلم الإلكتروني',
    titleEn: 'Learning Portal (LMS)',
    keywordsAr: 'بوابة التعلم المحاضرات الفصول الافتراضية الاختبارات الواجبات',
    keywordsEn: 'learning portal lms classes lectures exams virtual',
  },
  {
    id: 'entities',
    titleAr: 'خدمات الجهات والشركات',
    titleEn: 'Corporate & Entity Services',
    keywordsAr: 'خدمات الجهات الشراكات العقود التعاقد التدريب المؤسسي',
    keywordsEn: 'corporate entity services partnerships institutional training',
  },
  {
    id: 'letters',
    titleAr: 'إفادة جهة العمل',
    titleEn: 'Employer Verification Letters',
    keywordsAr: 'إفادة جهة العمل خطاب تعريف شهادة قيد موظف',
    keywordsEn: 'employer verification letter certificate work',
  },
  {
    id: 'support',
    titleAr: 'الدعم والاستفسارات',
    titleEn: 'Support & Inquiries',
    keywordsAr: 'الدعم الفني الاستفسارات المساعدة القبول التسجيل',
    keywordsEn: 'support inquiries helpdesk technical admissions',
  },
  {
    id: 'diplomas',
    titleAr: 'برامج الدبلومات المعتمدة',
    titleEn: 'Accredited Diploma Programs',
    keywordsAr: 'برامج الدبلومات دبلوم مهني مشارك عن بعد',
    keywordsEn: 'diplomas diploma accredited distance programs',
  },
  {
    id: 'fellowships',
    titleAr: 'برامج الزمالات المهنية',
    titleEn: 'Professional Fellowships',
    keywordsAr: 'برامج الزمالات زمالة مهنية',
    keywordsEn: 'fellowships fellowship professional',
  },
  {
    id: 'about',
    titleAr: 'عن معهد البحوث والاستشارات',
    titleEn: 'About the Institute',
    keywordsAr: 'عن المعهد الرؤية الرسالة جامعة تبوك',
    keywordsEn: 'about institute vision mission tabuk university',
  },
  {
    id: 'contact',
    titleAr: 'تواصل معنا',
    titleEn: 'Contact Us',
    keywordsAr: 'تواصل معنا الهاتف البريد واتساب الاتصال',
    keywordsEn: 'contact phone email whatsapp support',
  },
];

export interface SearchSuggestionsResult {
  programs: Program[];
  services: PortalServiceEntry[];
}

export function searchPortalSuggestions(
  query: string,
  programs: Program[],
  _locale: Locale
): SearchSuggestionsResult {
  const normalized = normalizeArabicSearch(query);
  if (!normalized) {
    return { programs: [], services: [] };
  }

  const matchingPrograms = programs.filter((program) => {
    const titleAr = normalizeArabicSearch(program.titleAr);
    const titleEn = program.titleEn.toLowerCase();
    const badgeAr = normalizeArabicSearch(program.badgeAr);
    const badgeEn = program.badgeEn.toLowerCase();
    return (
      titleAr.includes(normalized) ||
      titleEn.includes(normalized) ||
      badgeAr.includes(normalized) ||
      badgeEn.includes(normalized)
    );
  });

  const matchingServices = PORTAL_SERVICES.filter((service) => {
    const ar = normalizeArabicSearch(`${service.titleAr} ${service.keywordsAr}`);
    const en = `${service.titleEn} ${service.keywordsEn}`.toLowerCase();
    return ar.includes(normalized) || en.includes(normalized);
  });

  return {
    programs: matchingPrograms.slice(0, 5),
    services: matchingServices.slice(0, 4),
  };
}
