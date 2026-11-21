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
    titleAr: 'بوابة التعلم للطلاب',
    titleEn: 'Student Learning Portal (LMS)',
    keywordsAr: 'بوابة التعلم الدروس المحاضرات الفصول الافتراضية الاختبارات الواجبات',
    keywordsEn: 'learning portal lms classes lectures exams virtual courses',
  },
  {
    id: 'entities',
    titleAr: 'التدريب والتعاون المؤسسي',
    titleEn: 'Institutional Training Partnerships',
    keywordsAr: 'خدمات الجهات الشراكات العقود التعاقد التدريب المؤسسي',
    keywordsEn: 'corporate entity services partnerships institutional training',
  },
  {
    id: 'letters',
    titleAr: 'خطاب التعريف وإفادة الدراسة',
    titleEn: 'Enrollment & Study Verification',
    keywordsAr: 'إفادة جهة العمل خطاب تعريف شهادة قيد انتظام طالب',
    keywordsEn: 'employer verification letter enrollment certificate student',
  },
  {
    id: 'support',
    titleAr: 'الإرشاد والدعم الطلابي',
    titleEn: 'Student Support & Guidance',
    keywordsAr: 'الدعم الفني الاستفسارات المساعدة القبول التسجيل طلاب',
    keywordsEn: 'support inquiries helpdesk technical admissions student',
  },
  {
    id: 'diplomas',
    titleAr: 'دليل الدورات والدبلومات',
    titleEn: 'Courses & Diplomas Catalog',
    keywordsAr: 'برامج الدبلومات دورات دبلوم مهني مشارك عن بعد',
    keywordsEn: 'diplomas courses diploma accredited distance online',
  },
  {
    id: 'fellowships',
    titleAr: 'مسارات الزمالة التخصصية',
    titleEn: 'Fellowship Tracks',
    keywordsAr: 'برامج الزمالات زمالة مهنية تخصصية',
    keywordsEn: 'fellowships fellowship professional',
  },
  {
    id: 'about',
    titleAr: 'عن المنصة التعليمية',
    titleEn: 'About the Learning Platform',
    keywordsAr: 'عن المعهد المنصة الرؤية الرسالة جامعة تبوك أسئلة شائعة',
    keywordsEn: 'about institute platform vision mission tabuk university faq',
  },
  {
    id: 'contact',
    titleAr: 'التواصل مع الإرشاد الأكاديمي',
    titleEn: 'Contact Academic Support',
    keywordsAr: 'تواصل معنا الهاتف البريد واتساب الاتصال استفسار',
    keywordsEn: 'contact phone email whatsapp support guidance',
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
