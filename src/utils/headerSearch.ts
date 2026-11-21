import type { Locale, Program } from '../types/program';
import { normalizeArabicSearch } from './programFilter';

export type SearchServiceTarget =
  | 'dashboard'
  | 'library'
  | 'diplomas'
  | 'paths'
  | 'goals'
  | 'assessments'
  | 'projects'
  | 'groups'
  | 'ai-tools'
  | 'profile'
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
    id: 'dashboard',
    titleAr: 'لوحة الإنجاز الطلابية',
    titleEn: 'Student Achievement Dashboard',
    keywordsAr: 'لوحة الإنجاز التقدم الإحصائيات الساعات النشاط المتابعة',
    keywordsEn: 'dashboard progress stats activity analytics overview',
  },
  {
    id: 'library',
    titleAr: 'مكتبتي التعليمية',
    titleEn: 'My Educational Library',
    keywordsAr: 'مكتبتي التعليمية الدورات المسجلة المحفوظة المكتملة قيد التعلم',
    keywordsEn: 'library saved enrolled completed in progress courses',
  },
  {
    id: 'paths',
    titleAr: 'المسارات التعليمية',
    titleEn: 'Learning Paths',
    keywordsAr: 'المسارات التعليمية الخطة الدراسية التدرج الأكاديمي',
    keywordsEn: 'learning paths tracks roadmap sequence',
  },
  {
    id: 'goals',
    titleAr: 'أهدافي الدراسية',
    titleEn: 'Learning Goals',
    keywordsAr: 'أهدافي هدف دراسي تخطيط متابعة الإنجاز',
    keywordsEn: 'goals target study plan progress',
  },
  {
    id: 'assessments',
    titleAr: 'الاختبارات والتقييمات',
    titleEn: 'Assessments & Quizzes',
    keywordsAr: 'الاختبارات التقييم مراجعة جاهزية الامتحان',
    keywordsEn: 'assessments exams quizzes evaluation check',
  },
  {
    id: 'projects',
    titleAr: 'المشاريع التطبيقية',
    titleEn: 'Applied Projects',
    keywordsAr: 'المشاريع مشاريع تطبيقية تسليم عمل عملي',
    keywordsEn: 'projects practical deliverables submission',
  },
  {
    id: 'groups',
    titleAr: 'مجموعات الدراسة',
    titleEn: 'Study Groups',
    keywordsAr: 'مجموعات الدراسة زملاء نقاش تعلم تعاوني',
    keywordsEn: 'study groups peers community discussion',
  },
  {
    id: 'ai-tools',
    titleAr: 'أدوات الذكاء الاصطناعي للتعلم',
    titleEn: 'AI Learning Tools',
    keywordsAr: 'أدوات الذكاء الاصطناعي شرح تلخيص أسئلة مراجعة خطة مذاكرة',
    keywordsEn: 'ai tools study assistant explain summarize flashcards quiz plan',
  },
  {
    id: 'profile',
    titleAr: 'الملف الشخصي للطالب',
    titleEn: 'Student Profile & Settings',
    keywordsAr: 'الملف الشخصي الحساب التفضيلات الشهادات',
    keywordsEn: 'profile account preferences certificates settings',
  },
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
    titleAr: 'عن منصة مدار التعليمية',
    titleEn: 'About Madar Learning Platform',
    keywordsAr: 'مدار عن المعهد المنصة الرؤية الرسالة جامعة تبوك أسئلة شائعة',
    keywordsEn: 'madar about institute platform vision mission tabuk university faq',
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
