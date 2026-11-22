import type {
  AdminCategory,
  AdminCompany,
  AdminCourse,
  AdminDataState,
  AdminEnrollment,
  AdminExam,
  AdminExamAttempt,
  AdminLesson,
  AdminQuestion,
  AdminQuestionOption,
  AdminUser,
} from '../types/admin';

/** Public sample clips (Google GTV demo bucket) reused for admin demo lessons. */
const SAMPLE_VIDEOS = {
  bunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  dream: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  blazes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  escapes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  fun: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  joyrides: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  meltdowns: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  subaru: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  steel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  volks: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  bullrun: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  grand: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
} as const;

const IMAGES = {
  business: '/src/assets/images/business_course_1795281370535.jpg',
  service: '/src/assets/images/customer_service_course_1795281370311.jpg',
  logistics: '/src/assets/images/logistics_course_1795281369361.jpg',
  security: '/src/assets/images/security_course_1795281370219.jpg',
  procurement: '/src/assets/images/procurement_course_1795281371077.jpg',
  language: '/src/assets/images/academic_language_lab_1795124201402.jpg',
  digital: '/src/assets/images/digital_learning_1795281370106.jpg',
  study: '/src/assets/images/modern_study_space_1795281369592.jpg',
} as const;

/** Demo thumbnail options offered in the course form (existing Madaar assets). */
export const ADMIN_COURSE_IMAGE_OPTIONS: string[] = Object.values(IMAGES);

function lesson(
  id: string,
  titleAr: string,
  titleEn: string,
  durationMinutes: number,
  videoUrl: string,
  isPreview = false
): AdminLesson {
  return {
    id,
    titleAr,
    titleEn,
    descriptionAr: 'درس تجريبي يشرح المفاهيم الأساسية للمحور بأمثلة عملية مبسطة.',
    descriptionEn:
      'A demo lesson explaining the core concepts of this module with simple practical examples.',
    durationMinutes,
    videoUrl,
    isPreview,
  };
}

export const ADMIN_CATEGORIES: AdminCategory[] = [
  {
    id: 'cat-business',
    nameAr: 'إدارة وأعمال',
    nameEn: 'Business & Management',
    descriptionAr: 'دورات في الإدارة والتخطيط والمشتريات والعقود.',
    descriptionEn: 'Courses in management, planning, procurement, and contracts.',
    icon: '📊',
  },
  {
    id: 'cat-logistics',
    nameAr: 'لوجستيات وفعاليات',
    nameEn: 'Logistics & Events',
    descriptionAr: 'سلاسل الإمداد والمستودعات وتنظيم الفعاليات.',
    descriptionEn: 'Supply chains, warehousing, and event operations.',
    icon: '🚚',
  },
  {
    id: 'cat-service',
    nameAr: 'خدمة العملاء',
    nameEn: 'Client Service',
    descriptionAr: 'تجربة المستفيد والتواصل المهني وإدارة الطلبات.',
    descriptionEn: 'Client experience, professional communication, and case handling.',
    icon: '💬',
  },
  {
    id: 'cat-security',
    nameAr: 'أمن وسلامة',
    nameEn: 'Security & Safety',
    descriptionAr: 'الأمن الوقائي وسلامة المنشآت والطوارئ.',
    descriptionEn: 'Preventive security, facility safety, and emergency response.',
    icon: '🛡️',
  },
  {
    id: 'cat-language',
    nameAr: 'اللغات',
    nameEn: 'Languages',
    descriptionAr: 'مهارات اللغة الإنجليزية للبيئات الأكاديمية والمهنية.',
    descriptionEn: 'English skills for academic and professional settings.',
    icon: '🌐',
  },
];

export const ADMIN_USERS: AdminUser[] = [
  { id: 'u-admin', name: 'أ. خالد المطيري', email: 'admin@madaar.sa', role: 'admin', status: 'active', registeredAt: '2024-03-12T09:00:00Z' },
  { id: 'u-ins-1', name: 'د. سارة العتيبي', email: 'sara.otaibi@madaar.sa', role: 'instructor', status: 'active', registeredAt: '2024-09-01T10:30:00Z' },
  { id: 'u-ins-2', name: 'أ. محمد الشمري', email: 'm.shammari@madaar.sa', role: 'instructor', status: 'active', registeredAt: '2024-10-15T11:15:00Z' },
  { id: 'u-ins-3', name: 'م. عبدالله القحطاني', email: 'a.qahtani@madaar.sa', role: 'instructor', status: 'active', registeredAt: '2025-01-20T08:45:00Z' },
  { id: 'u-ins-4', name: 'أ. نورة السبيعي', email: 'n.subaie@madaar.sa', role: 'instructor', status: 'active', registeredAt: '2025-02-11T13:20:00Z' },
  { id: 'u-st-1', name: 'ريم الحربي', email: 'reem.harbi@gmail.com', role: 'student', status: 'active', registeredAt: '2025-11-02T16:05:00Z', companyId: 'co-tech-horizon', phone: '+966 55 310 4471', password: 'reem-2026' },
  { id: 'u-st-2', name: 'فهد الدوسري', email: 'fahd.dossary@outlook.com', role: 'student', status: 'active', registeredAt: '2025-11-18T19:40:00Z', companyId: 'co-tech-horizon', phone: '+966 55 882 1109', password: 'fahd-2026' },
  { id: 'u-st-3', name: 'نوف العنزي', email: 'nouf.anazi@gmail.com', role: 'student', status: 'active', registeredAt: '2025-12-05T14:10:00Z', companyId: 'co-tech-horizon', phone: '+966 53 660 2214', password: 'nouf-2026' },
  { id: 'u-st-4', name: 'سلطان الشهري', email: 'sultan.shahri@gmail.com', role: 'student', status: 'inactive', registeredAt: '2025-12-14T12:00:00Z' },
  { id: 'u-st-5', name: 'لمى الزهراني', email: 'lama.zahrani@yahoo.com', role: 'student', status: 'active', registeredAt: '2026-01-09T10:25:00Z', companyId: 'co-binyan', phone: '+966 56 447 8830', password: 'lama-2026' },
  { id: 'u-st-6', name: 'تركي العسيري', email: 'turki.asiri@gmail.com', role: 'student', status: 'active', registeredAt: '2026-02-21T17:55:00Z', companyId: 'co-binyan', phone: '+966 50 221 6754', password: 'turki-2026' },
  { id: 'u-st-7', name: 'دانة المطيري', email: 'dana.mutairi@hotmail.com', role: 'student', status: 'active', registeredAt: '2026-03-15T09:35:00Z' },
  { id: 'u-st-8', name: 'بدر الغامدي', email: 'badr.ghamdi@gmail.com', role: 'student', status: 'active', registeredAt: '2026-05-30T20:15:00Z', companyId: 'co-rowad', phone: '+966 54 905 3327', password: 'badr-2026' },
  { id: 'u-st-9', name: 'هيا الجهني', email: 'haya.johani@gmail.com', role: 'student', status: 'active', registeredAt: '2026-07-12T11:50:00Z', companyId: 'co-rowad', phone: '+966 59 118 4462', password: 'haya-2026' },
  { id: 'u-st-10', name: 'عبدالرحمن السالم', email: 'abdulrahman.salem@gmail.com', role: 'student', status: 'inactive', registeredAt: '2026-08-01T15:30:00Z' },
];

/**
 * Fixed demo credentials for the dashboard login page (/dashboard/login).
 * Mock authentication only — never real secrets. These constants are the
 * single source of truth: the seeded accounts below and the login page both
 * read from them, so the published demo credentials can never drift apart.
 */
export const DEMO_ADMIN_ACCOUNT = {
  email: 'admin@madaar.demo',
  password: 'Admin123!',
  nameAr: 'أ. خالد المطيري',
  nameEn: 'Khaled Al-Mutairi',
} as const;

/** The seeded company account that doubles as the login page's demo company. */
export const DEMO_COMPANY_ID = 'co-tech-horizon';

export const DEMO_COMPANY_ACCOUNT = {
  companyId: DEMO_COMPANY_ID,
  email: 'company@madaar.demo',
  password: 'Company123!',
} as const;

/** Demo company accounts — created and managed exclusively by the admin.
 * Credentials are demo-only and assigned by the admin at creation time.
 * The first account doubles as the dashboard login page's demo company. */
export const ADMIN_COMPANIES: AdminCompany[] = [
  {
    id: DEMO_COMPANY_ID,
    nameAr: 'شركة أفق التقنية',
    nameEn: 'Tech Horizon Co.',
    email: DEMO_COMPANY_ACCOUNT.email,
    password: DEMO_COMPANY_ACCOUNT.password,
    status: 'active',
    createdAt: '2025-09-14T10:00:00Z',
  },
  {
    id: 'co-binyan',
    nameAr: 'شركة بنيان للمقاولات',
    nameEn: 'Binyan Contracting Co.',
    email: 'hr@binyan.sa',
    password: 'binyan2026',
    status: 'active',
    createdAt: '2026-01-08T12:30:00Z',
  },
  {
    id: 'co-rowad',
    nameAr: 'شركة رواد الأمن',
    nameEn: 'Rowad Security Co.',
    email: 'training@rowad.sa',
    password: 'rowad2026',
    status: 'inactive',
    createdAt: '2026-03-02T09:15:00Z',
  },
];

export const ADMIN_COURSES: AdminCourse[] = [
  {
    id: 'c-biz-essentials',
    titleAr: 'أساسيات إدارة الأعمال التطبيقية',
    titleEn: 'Applied Business Administration Essentials',
    descriptionAr:
      'دورة عملية تبني المهارات الإدارية الأساسية: التخطيط التشغيلي، بناء الأهداف، اتخاذ القرار، وقياس الأداء.',
    descriptionEn:
      'A hands-on course covering core management skills: operational planning, goal setting, decision making, and performance measurement.',
    image: IMAGES.business,
    instructorId: 'u-ins-1',
    categoryId: 'cat-business',
    price: 450,
    level: 'beginner',
    status: 'published',
    createdAt: '2025-10-02T09:00:00Z',
    updatedAt: '2026-06-14T13:20:00Z',
    sections: [
      {
        id: 'cs-b1',
        titleAr: 'مدخل إلى الإدارة الحديثة',
        titleEn: 'Introduction to Modern Management',
        lessons: [
          lesson('cl-b1a', 'نظرة عامة على الدورة', 'Course Overview', 5, SAMPLE_VIDEOS.bunny, true),
          lesson('cl-b1b', 'الوظائف الإدارية الأربع', 'The Four Management Functions', 7, SAMPLE_VIDEOS.dream),
          lesson('cl-b1c', 'البيئة التنظيمية وأصحاب المصلحة', 'Organizational Environment', 6, SAMPLE_VIDEOS.blazes),
        ],
      },
      {
        id: 'cs-b2',
        titleAr: 'التخطيط واتخاذ القرار',
        titleEn: 'Planning & Decision Making',
        lessons: [
          lesson('cl-b2a', 'بناء الأهداف بمنهجية SMART', 'SMART Goals', 6, SAMPLE_VIDEOS.escapes),
          lesson('cl-b2b', 'ترتيب الأولويات وقراءة المخاطر', 'Priorities & Risk', 8, SAMPLE_VIDEOS.sintel),
        ],
      },
    ],
  },
  {
    id: 'c-client-service',
    titleAr: 'مهارات خدمة العملاء والتواصل الاحترافي',
    titleEn: 'Client Service & Professional Communication',
    descriptionAr:
      'دورة تركز على تجربة المستفيد: الاستماع النشط، إدارة الطلبات والشكاوى، التوثيق، والردود المهنية.',
    descriptionEn:
      'A course focused on client experience: active listening, request handling, documentation, and professional replies.',
    image: IMAGES.service,
    instructorId: 'u-ins-2',
    categoryId: 'cat-service',
    price: 399,
    level: 'beginner',
    status: 'published',
    createdAt: '2025-11-11T10:00:00Z',
    updatedAt: '2026-07-02T12:45:00Z',
    sections: [
      {
        id: 'cs-s1',
        titleAr: 'أساسيات تجربة المستفيد',
        titleEn: 'Client Experience Foundations',
        lessons: [
          lesson('cl-s1a', 'لماذا تجربة المستفيد مهمة؟', 'Why Client Experience Matters', 5, SAMPLE_VIDEOS.grand, true),
          lesson('cl-s1b', 'رحلة المستفيد ونقاط الاتصال', 'Client Journey & Touchpoints', 7, SAMPLE_VIDEOS.fun),
          lesson('cl-s1c', 'الاستماع النشط وإعادة الصياغة', 'Active Listening', 7, SAMPLE_VIDEOS.bunny),
        ],
      },
      {
        id: 'cs-s2',
        titleAr: 'إدارة الحالات والطلبات',
        titleEn: 'Handling Cases & Requests',
        lessons: [
          lesson('cl-s2a', 'التعامل مع الشكاوى بلباقة', 'Handling Complaints', 8, SAMPLE_VIDEOS.meltdowns),
          lesson('cl-s2b', 'كتابة الردود المهنية', 'Writing Professional Replies', 7, SAMPLE_VIDEOS.sintel),
        ],
      },
    ],
  },
  {
    id: 'c-procurement',
    titleAr: 'إدارة المشتريات والعقود الحكومية',
    titleEn: 'Procurement & Public Contracts Management',
    descriptionAr:
      'مسار متقدم في دورة المشتريات وإعداد وثائق المنافسات وفحص العروض ومتابعة الالتزامات التعاقدية.',
    descriptionEn:
      'An advanced track on the procurement lifecycle, tender documentation, bid evaluation, and contract compliance.',
    image: IMAGES.procurement,
    instructorId: 'u-ins-1',
    categoryId: 'cat-business',
    price: 650,
    level: 'intermediate',
    status: 'draft',
    createdAt: '2026-04-18T08:30:00Z',
    updatedAt: '2026-09-05T10:10:00Z',
    sections: [
      {
        id: 'cs-p1',
        titleAr: 'دورة المشتريات',
        titleEn: 'Procurement Lifecycle',
        lessons: [
          lesson('cl-p1a', 'من تحديد الاحتياج إلى العقد', 'From Need to Contract', 8, SAMPLE_VIDEOS.steel, true),
          lesson('cl-p1b', 'إعداد كراسة الشروط والمواصفات', 'Preparing the RFP', 9, SAMPLE_VIDEOS.escapes),
          lesson('cl-p1c', 'فحص العروض والمفاضلة', 'Bid Evaluation', 10, SAMPLE_VIDEOS.subaru),
        ],
      },
    ],
  },
  {
    id: 'c-logistics',
    titleAr: 'سلاسل الإمداد وإدارة المستودعات',
    titleEn: 'Supply Chains & Warehouse Management',
    descriptionAr:
      'أساسيات تخطيط المخزون وتنظيم المستودعات وعمليات الشحن والتنسيق مع الموردين.',
    descriptionEn:
      'Fundamentals of inventory planning, warehouse organization, shipping operations, and supplier coordination.',
    image: IMAGES.logistics,
    instructorId: 'u-ins-3',
    categoryId: 'cat-logistics',
    price: 520,
    level: 'intermediate',
    status: 'published',
    createdAt: '2025-12-01T11:00:00Z',
    updatedAt: '2026-05-20T09:30:00Z',
    sections: [
      {
        id: 'cs-l1',
        titleAr: 'أساسيات سلاسل الإمداد',
        titleEn: 'Supply Chain Foundations',
        lessons: [
          lesson('cl-l1a', 'مفاهيم سلاسل الإمداد الحديثة', 'Modern Supply Chains', 6, SAMPLE_VIDEOS.joyrides, true),
          lesson('cl-l1b', 'تخطيط المخزون ونقاط إعادة الطلب', 'Inventory Planning', 8, SAMPLE_VIDEOS.fun),
        ],
      },
      {
        id: 'cs-l2',
        titleAr: 'عمليات المستودعات والشحن',
        titleEn: 'Warehouse & Freight Operations',
        lessons: [
          lesson('cl-l2a', 'تنظيم مناطق المستودع', 'Warehouse Zoning', 7, SAMPLE_VIDEOS.volks),
          lesson('cl-l2b', 'جدولة الشحن والتنسيق مع الموردين', 'Freight Scheduling', 7, SAMPLE_VIDEOS.bullrun),
        ],
      },
    ],
  },
  {
    id: 'c-security',
    titleAr: 'أساسيات الأمن الوقائي وسلامة المنشآت',
    titleEn: 'Preventive Security & Facility Safety Basics',
    descriptionAr:
      'مبادئ تأمين المنشآت وتشغيل غرف المراقبة وإعداد التقارير الميدانية للبلاغات.',
    descriptionEn:
      'Principles of facility protection, control-room operations, and field incident reporting.',
    image: IMAGES.security,
    instructorId: 'u-ins-3',
    categoryId: 'cat-security',
    price: 480,
    level: 'beginner',
    status: 'draft',
    createdAt: '2026-06-30T14:00:00Z',
    updatedAt: '2026-08-22T16:40:00Z',
    sections: [
      {
        id: 'cs-sec1',
        titleAr: 'مبادئ الأمن الوقائي',
        titleEn: 'Preventive Security Principles',
        lessons: [
          lesson('cl-sec1a', 'تأمين المداخل ونقاط التحقق', 'Access Control Basics', 6, SAMPLE_VIDEOS.steel, true),
          lesson('cl-sec1b', 'التقارير الميدانية للبلاغات', 'Field Incident Reports', 7, SAMPLE_VIDEOS.blazes),
        ],
      },
    ],
  },
  {
    id: 'c-english',
    titleAr: 'الإنجليزية للبيئات المهنية',
    titleEn: 'English for Professional Environments',
    descriptionAr:
      'تطوير مهارات القواعد التطبيقية والمحادثة والمراسلات المهنية باللغة الإنجليزية.',
    descriptionEn:
      'Developing applied grammar, conversation, and professional correspondence skills in English.',
    image: IMAGES.language,
    instructorId: 'u-ins-4',
    categoryId: 'cat-language',
    price: 350,
    level: 'beginner',
    status: 'published',
    createdAt: '2026-01-25T09:15:00Z',
    updatedAt: '2026-06-11T11:25:00Z',
    sections: [
      {
        id: 'cs-e1',
        titleAr: 'القواعد التطبيقية',
        titleEn: 'Applied Grammar',
        lessons: [
          lesson('cl-e1a', 'بناء الجملة والأزمنة', 'Sentence Structure & Tenses', 6, SAMPLE_VIDEOS.dream, true),
          lesson('cl-e1b', 'أدوات الربط والأسلوب الأكاديمي', 'Connectors & Academic Style', 7, SAMPLE_VIDEOS.grand),
        ],
      },
      {
        id: 'cs-e2',
        titleAr: 'المحادثة والمراسلات',
        titleEn: 'Conversation & Correspondence',
        lessons: [
          lesson('cl-e2a', 'محادثة يومية مهنية', 'Everyday Professional Talk', 6, SAMPLE_VIDEOS.escapes),
          lesson('cl-e2b', 'صياغة رسائل العمل', 'Workplace Emails', 8, SAMPLE_VIDEOS.meltdowns),
        ],
      },
    ],
  },
];

export const ADMIN_ENROLLMENTS: AdminEnrollment[] = [
  { id: 'enr-01', studentId: 'u-st-1', courseId: 'c-biz-essentials', status: 'completed', progressPct: 100, enrolledAt: '2026-05-04T10:00:00Z' },
  { id: 'enr-02', studentId: 'u-st-1', courseId: 'c-client-service', status: 'active', progressPct: 55, enrolledAt: '2026-07-18T14:20:00Z' },
  { id: 'enr-03', studentId: 'u-st-2', courseId: 'c-logistics', status: 'active', progressPct: 30, enrolledAt: '2026-06-09T09:10:00Z' },
  { id: 'enr-04', studentId: 'u-st-3', courseId: 'c-client-service', status: 'completed', progressPct: 100, enrolledAt: '2026-04-21T12:30:00Z' },
  { id: 'enr-05', studentId: 'u-st-3', courseId: 'c-english', status: 'active', progressPct: 45, enrolledAt: '2026-08-02T16:00:00Z' },
  { id: 'enr-06', studentId: 'u-st-5', courseId: 'c-biz-essentials', status: 'active', progressPct: 20, enrolledAt: '2026-08-15T11:45:00Z' },
  { id: 'enr-07', studentId: 'u-st-5', courseId: 'c-english', status: 'active', progressPct: 70, enrolledAt: '2026-06-27T18:05:00Z' },
  { id: 'enr-08', studentId: 'u-st-6', courseId: 'c-logistics', status: 'completed', progressPct: 100, enrolledAt: '2026-03-12T08:50:00Z' },
  { id: 'enr-09', studentId: 'u-st-7', courseId: 'c-client-service', status: 'active', progressPct: 15, enrolledAt: '2026-09-01T13:10:00Z' },
  { id: 'enr-10', studentId: 'u-st-7', courseId: 'c-biz-essentials', status: 'active', progressPct: 60, enrolledAt: '2026-07-25T15:35:00Z' },
  { id: 'enr-11', studentId: 'u-st-8', courseId: 'c-english', status: 'active', progressPct: 10, enrolledAt: '2026-09-14T10:20:00Z' },
  { id: 'enr-12', studentId: 'u-st-9', courseId: 'c-biz-essentials', status: 'active', progressPct: 40, enrolledAt: '2026-09-20T17:00:00Z' },
  { id: 'enr-13', studentId: 'u-st-9', courseId: 'c-logistics', status: 'active', progressPct: 25, enrolledAt: '2026-10-03T09:40:00Z' },
  { id: 'enr-14', studentId: 'u-st-2', courseId: 'c-client-service', status: 'active', progressPct: 80, enrolledAt: '2026-08-28T12:15:00Z' },
  { id: 'enr-15', studentId: 'u-st-6', courseId: 'c-biz-essentials', status: 'completed', progressPct: 100, enrolledAt: '2026-05-19T14:55:00Z' },
  { id: 'enr-16', studentId: 'u-st-1', courseId: 'c-logistics', status: 'active', progressPct: 5, enrolledAt: '2026-10-11T19:25:00Z' },
];

/** Demo exam seed for the exam management section. */
function makeAdminQuestion(
  id: string,
  type: AdminQuestion['type'],
  textAr: string,
  textEn: string,
  marks: number,
  options: AdminQuestionOption[] = [],
  correctOptionId: string | null = null,
  correctTrueFalse = false,
  expectedAnswerAr = '',
  expectedAnswerEn = ''
): AdminQuestion {
  return {
    id,
    type,
    textAr,
    textEn,
    options,
    correctOptionId,
    correctTrueFalse,
    expectedAnswerAr,
    expectedAnswerEn,
    marks,
  };
}

export const ADMIN_EXAMS: AdminExam[] = [
  {
    id: 'ex-biz-midterm',
    titleAr: 'الاختبار النصفي — أساسيات إدارة الأعمال',
    titleEn: 'Business Essentials Midterm Exam',
    descriptionAr: 'اختبار تجريبي يقيس فهمك للوظائف الإدارية والتخطيط التشغيلي وبناء الأهداف.',
    descriptionEn: 'A demo exam measuring your understanding of management functions, planning, and goal setting.',
    courseId: 'demo-business-essentials',
    courseTitleAr: 'أساسيات إدارة الأعمال التطبيقية',
    courseTitleEn: 'Applied Business Administration Essentials',
    sectionTitleAr: 'التخطيط واتخاذ القرار',
    sectionTitleEn: 'Planning & Decision Making',
    durationMinutes: 20,
    passingPct: 60,
    maxAttempts: 2,
    availableFrom: null,
    availableTo: null,
    showCorrectAnswers: true,
    instructionsAr:
      'أجب عن جميع الأسئلة. يمكنك التنقل بين الأسئلة قبل التسليم، ويُسلَّم الاختبار تلقائيًا عند انتهاء الوقت.',
    instructionsEn:
      'Answer all questions. You can navigate between questions before submitting; the exam is submitted automatically when time runs out.',
    status: 'published',
    createdAt: '2026-07-10T09:00:00Z',
    updatedAt: '2026-09-12T11:30:00Z',
    questions: [
      makeAdminQuestion('exq-1', 'multiple_choice', 'ما الوظيفة الإدارية التي تتابع الأداء وتقارنه بالخطط؟', 'Which management function monitors performance against plans?', 2, [
        { id: 'o1', textAr: 'التخطيط', textEn: 'Planning' },
        { id: 'o2', textAr: 'الرقابة', textEn: 'Controlling' },
        { id: 'o3', textAr: 'التنظيم', textEn: 'Organizing' },
        { id: 'o4', textAr: 'التوجيه', textEn: 'Leading' },
      ], 'o2'),
      makeAdminQuestion('exq-2', 'true_false', 'منهجية SMART تساعد على صياغة أهداف واضحة وقابلة للقياس.', 'The SMART method helps write clear, measurable goals.', 2, [], null, true),
      makeAdminQuestion('exq-3', 'multiple_choice', 'أي أداة تُستخدم لترتيب المهام حسب الأهمية والاستعجال؟', 'Which tool ranks tasks by importance and urgency?', 2, [
        { id: 'o1', textAr: 'مصفوفة أيزنهاور', textEn: 'Eisenhower Matrix' },
        { id: 'o2', textAr: 'قائمة الرواتب', textEn: 'Payroll list' },
        { id: 'o3', textAr: 'ميزانية التسويق', textEn: 'Marketing budget' },
      ], 'o1'),
      makeAdminQuestion('exq-4', 'short_answer', 'اذكر اسم الوظيفة الإدارية المسؤولة عن توزيع المهام والموارد.', 'Name the management function responsible for distributing tasks and resources.', 2, [], null, false, 'التنظيم', 'organizing'),
      makeAdminQuestion('exq-5', 'true_false', 'القيادة التحويلية تركز على تحفيز الفريق وتطويره.', 'Transformational leadership focuses on motivating and developing the team.', 2, [], null, true),
    ],
  },
  {
    id: 'ex-svc-final',
    titleAr: 'الاختبار النهائي — مهارات خدمة العملاء',
    titleEn: 'Client Service Final Exam',
    descriptionAr: 'اختبار تجريبي شامل لمهارات التعامل مع الطلبات والشكاوى والتواصل المهني.',
    descriptionEn: 'A comprehensive demo exam covering request handling, complaints, and professional communication.',
    courseId: 'demo-client-service',
    courseTitleAr: 'مهارات خدمة العملاء والتواصل الاحترافي',
    courseTitleEn: 'Client Service & Professional Communication Skills',
    sectionTitleAr: 'إدارة الحالات والطلبات',
    sectionTitleEn: 'Handling Cases & Requests',
    durationMinutes: 25,
    passingPct: 70,
    maxAttempts: 3,
    availableFrom: null,
    availableTo: null,
    showCorrectAnswers: true,
    instructionsAr: 'اقرأ كل سؤال بتمعّن واختر أفضل إجابة. يجب تحقيق النسبة المحددة للنجاح.',
    instructionsEn: 'Read each question carefully and pick the best answer. You must reach the passing percentage.',
    status: 'published',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-10-05T13:10:00Z',
    questions: [
      makeAdminQuestion('exq-10', 'multiple_choice', 'ما الخطوة الأولى عند استقبال شكوى غاضبة؟', 'What is the first step when receiving an angry complaint?', 2, [
        { id: 'o1', textAr: 'الرد فورًا بالحل النهائي', textEn: 'Reply instantly with the final solution' },
        { id: 'o2', textAr: 'الإصغاء واحتواء الانفعال', textEn: 'Listen and de-escalate' },
        { id: 'o3', textAr: 'تحويل المكالمة فورًا', textEn: 'Transfer the call immediately' },
      ], 'o2'),
      makeAdminQuestion('exq-11', 'true_false', 'إعادة الصياغة تساعد على التأكد من فهم طلب المستفيد.', 'Paraphrasing helps confirm you understood the request.', 2, [], null, true),
      makeAdminQuestion('exq-12', 'multiple_choice', 'أين تُوثَّق حالات المستفيدين عادةً؟', 'Where are client cases usually documented?', 2, [
        { id: 'o1', textAr: 'نظام CRM', textEn: 'CRM system' },
        { id: 'o2', textAr: 'دفتر ملاحظات شخصي', textEn: 'A personal notebook' },
        { id: 'o3', textAr: 'بريد الطالب', textEn: 'The student inbox' },
      ], 'o1'),
      makeAdminQuestion('exq-13', 'short_answer', 'ما المصطلح الذي يصف تحويل حالة معقدة لجهة أعلى؟', 'What term describes passing a complex case to a higher level?', 2, [], null, false, 'التصعيد', 'escalation'),
      makeAdminQuestion('exq-14', 'true_false', 'الوعود غير الواقعية تُحسّن رضا المستفيد.', 'Unrealistic promises improve client satisfaction.', 2, [], null, false),
    ],
  },
  {
    id: 'ex-biz-quiz',
    titleAr: 'اختبار سريع — التخطيط واتخاذ القرار',
    titleEn: 'Quick Quiz — Planning & Decision Making',
    descriptionAr: 'اختبار قصير (مسودة) لقياس جاهزية الطلبة قبل الاختبار النصفي.',
    descriptionEn: 'A short draft quiz assessing readiness before the midterm exam.',
    courseId: 'c-biz-essentials',
    courseTitleAr: 'أساسيات إدارة الأعمال التطبيقية',
    courseTitleEn: 'Applied Business Administration Essentials',
    sectionTitleAr: 'التخطيط واتخاذ القرار',
    sectionTitleEn: 'Planning & Decision Making',
    durationMinutes: 10,
    passingPct: 50,
    maxAttempts: 3,
    availableFrom: '2026-12-01T00:00:00Z',
    availableTo: '2026-12-31T23:59:59Z',
    showCorrectAnswers: false,
    instructionsAr: 'اختبار تدريبي قصير من ثلاثة أسئلة.',
    instructionsEn: 'A short three-question practice quiz.',
    status: 'draft',
    createdAt: '2026-10-20T08:30:00Z',
    updatedAt: '2026-10-28T14:00:00Z',
    questions: [
      makeAdminQuestion('exq-20', 'multiple_choice', 'ما الخطوة الأولى في بناء الخطة التشغيلية؟', 'What is the first step of an operational plan?', 1, [
        { id: 'o1', textAr: 'تحديد الرؤية والأهداف', textEn: 'Define vision and goals' },
        { id: 'o2', textAr: 'توزيع المكافآت', textEn: 'Distribute rewards' },
      ], 'o1'),
      makeAdminQuestion('exq-21', 'true_false', 'المخاطر التشغيلية يجب تجاهلها في المشاريع الصغيرة.', 'Operational risks should be ignored in small projects.', 1, [], null, false),
      makeAdminQuestion('exq-22', 'short_answer', 'اذكر أداة لترتيب الأولويات.', 'Name a prioritization tool.', 1, [], null, false, 'مصفوفة أيزنهاور', 'eisenhower'),
    ],
  },
  {
    id: 'ex-proc-quiz',
    titleAr: 'اختبار المشتريات والعقود',
    titleEn: 'Procurement & Contracts Quiz',
    descriptionAr: 'اختبار تجريبي منشور لمحاور دورة المشتريات ومنافسات القطاع الحكومي.',
    descriptionEn: 'A published demo quiz covering procurement lifecycle and public tendering topics.',
    courseId: 'c-procurement',
    courseTitleAr: 'إدارة المشتريات والعقود الحكومية',
    courseTitleEn: 'Procurement & Public Contracts Management',
    sectionTitleAr: 'دورة المشتريات',
    sectionTitleEn: 'Procurement Lifecycle',
    durationMinutes: 15,
    passingPct: 60,
    maxAttempts: 2,
    availableFrom: null,
    availableTo: null,
    showCorrectAnswers: true,
    instructionsAr: 'أجب عن الأسئلة المتعلقة بدورة المشتريات والمنافسات.',
    instructionsEn: 'Answer the questions about the procurement lifecycle and tendering.',
    status: 'published',
    createdAt: '2026-09-15T12:00:00Z',
    updatedAt: '2026-10-02T09:45:00Z',
    questions: [
      makeAdminQuestion('exq-30', 'multiple_choice', 'ما الوثيقة التي تُحدد احتياج المنشأة ومتطلباتها الفنية؟', 'Which document defines the entity needs and technical requirements?', 2, [
        { id: 'o1', textAr: 'كراسة الشروط والمواصفات', textEn: 'RFP specification' },
        { id: 'o2', textAr: 'كشف الرواتب', textEn: 'Payroll sheet' },
      ], 'o1'),
      makeAdminQuestion('exq-31', 'true_false', 'فحص العروض يتم قبل إعلان المنافسة.', 'Bid evaluation happens before announcing the tender.', 2, [], null, false),
    ],
  },
];

/**
 * Demo exam attempts attributed to specific demo students (company students
 * included) so dashboards can show real exam results. Grading values match
 * each exam's answer key exactly.
 */
export const DEMO_EXAM_ATTEMPTS: AdminExamAttempt[] = [
  {
    id: 'att-seed-01',
    examId: 'ex-biz-midterm',
    courseId: 'demo-business-essentials',
    studentId: 'u-st-1',
    startedAt: '2026-11-02T10:00:00Z',
    submittedAt: '2026-11-02T10:22:00Z',
    answers: { 'exq-1': 'o2', 'exq-2': true, 'exq-3': 'o2', 'exq-4': 'التنظيم', 'exq-5': true },
    earnedMarks: 8,
    totalMarks: 10,
    scorePct: 80,
    passed: true,
  },
  {
    id: 'att-seed-02',
    examId: 'ex-biz-midterm',
    courseId: 'demo-business-essentials',
    studentId: 'u-st-3',
    startedAt: '2026-11-04T13:30:00Z',
    submittedAt: '2026-11-04T13:51:00Z',
    answers: { 'exq-1': 'o2', 'exq-2': true, 'exq-3': 'o3', 'exq-4': 'تنظيم', 'exq-5': false },
    earnedMarks: 6,
    totalMarks: 10,
    scorePct: 60,
    passed: true,
  },
  {
    id: 'att-seed-03',
    examId: 'ex-biz-midterm',
    courseId: 'demo-business-essentials',
    studentId: 'u-st-9',
    startedAt: '2026-11-06T09:15:00Z',
    submittedAt: '2026-11-06T09:34:00Z',
    answers: { 'exq-1': 'o1', 'exq-2': true, 'exq-3': 'o2', 'exq-4': '', 'exq-5': true },
    earnedMarks: 4,
    totalMarks: 10,
    scorePct: 40,
    passed: false,
  },
  {
    id: 'att-seed-04',
    examId: 'ex-svc-final',
    courseId: 'demo-client-service',
    studentId: 'u-st-1',
    startedAt: '2026-11-09T16:00:00Z',
    submittedAt: '2026-11-09T16:24:00Z',
    answers: { 'exq-10': 'o2', 'exq-11': true, 'exq-12': 'o3', 'exq-13': 'التصعيد', 'exq-14': false },
    earnedMarks: 8,
    totalMarks: 10,
    scorePct: 80,
    passed: true,
  },
  {
    id: 'att-seed-05',
    examId: 'ex-svc-final',
    courseId: 'demo-client-service',
    studentId: 'u-st-3',
    startedAt: '2026-11-11T11:10:00Z',
    submittedAt: '2026-11-11T11:35:00Z',
    answers: { 'exq-10': 'o2', 'exq-11': true, 'exq-12': 'o1', 'exq-13': 'تصعيد', 'exq-14': true },
    earnedMarks: 6,
    totalMarks: 10,
    scorePct: 60,
    passed: false,
  },
  {
    id: 'att-seed-06',
    examId: 'ex-proc-quiz',
    courseId: 'c-procurement',
    studentId: 'u-st-5',
    startedAt: '2026-11-13T14:00:00Z',
    submittedAt: '2026-11-13T14:12:00Z',
    answers: { 'exq-30': 'o1', 'exq-31': true },
    earnedMarks: 2,
    totalMarks: 4,
    scorePct: 50,
    passed: false,
  },
  {
    id: 'att-seed-07',
    examId: 'ex-proc-quiz',
    courseId: 'c-procurement',
    studentId: 'u-st-6',
    startedAt: '2026-11-15T10:30:00Z',
    submittedAt: '2026-11-15T10:41:00Z',
    answers: { 'exq-30': 'o1', 'exq-31': false },
    earnedMarks: 4,
    totalMarks: 4,
    scorePct: 100,
    passed: true,
  },
  {
    id: 'att-seed-08',
    examId: 'ex-biz-midterm',
    courseId: 'demo-business-essentials',
    studentId: 'u-st-2',
    startedAt: '2026-11-21T18:00:00Z',
    submittedAt: null,
    answers: {},
    earnedMarks: null,
    totalMarks: null,
    scorePct: null,
    passed: null,
  },
];

export function createDefaultAdminState(): AdminDataState {
  return {
    courses: ADMIN_COURSES,
    users: ADMIN_USERS,
    companies: ADMIN_COMPANIES,
    enrollments: ADMIN_ENROLLMENTS,
    categories: ADMIN_CATEGORIES,
    exams: ADMIN_EXAMS,
  };
}


