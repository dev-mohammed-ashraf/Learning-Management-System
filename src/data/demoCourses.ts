import type { DemoCourse } from '../types/coursePlayer';

/**
 * Public sample videos (Google GTV demo bucket) — safe, openly accessible
 * clips used purely as demo lesson media for the mock learning experience.
 */
const SAMPLE_VIDEOS = {
  bigBuckBunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  elephantsDream: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  biggerBlazes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  biggerEscapes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  biggerFun: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  biggerJoyrides: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  biggerMeltdowns: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  subaruDirt: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  tearsOfSteel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  volkswagen: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  bullrun: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  forAGrand: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
} as const;

/**
 * Demo course #1 — applied business administration foundations.
 * Thumbnail reuses the existing Madaar asset library.
 */
const BUSINESS_COURSE: DemoCourse = {
  id: 'demo-business-essentials',
  titleAr: 'أساسيات إدارة الأعمال التطبيقية',
  titleEn: 'Applied Business Administration Essentials',
  descriptionAr:
    'دورة تجريبية عملية تبنّي المهارات الإدارية الأساسية: التخطيط التشغيلي، بناء الأهداف، اتخاذ القرار، وقياس الأداء عبر مؤشرات واضحة تناسب فرق العمل الناشئة.',
  descriptionEn:
    'A hands-on demo course covering core management skills: operational planning, goal setting, decision making, and performance measurement with clear, practical indicators.',
  instructor: {
    nameAr: 'د. سارة العتيبي',
    nameEn: 'Dr. Sarah Al-Otaibi',
    roleAr: 'مدرّبة إدارة أعمال معتمدة',
    roleEn: 'Certified Business Trainer',
  },
  image: '/src/assets/images/business_course_1795281370535.jpg',
  levelAr: 'مستوى مبتدئ',
  levelEn: 'Beginner Level',
  sections: [
    {
      id: 'biz-sec-1',
      titleAr: 'مدخل إلى الإدارة الحديثة',
      titleEn: 'Introduction to Modern Management',
      lessons: [
        {
          id: 'biz-01',
          titleAr: 'نظرة عامة على الدورة والمهارات المستهدفة',
          titleEn: 'Course Overview & Target Skills',
          descriptionAr:
            'تعريف بخريطة الدورة ومخرجات التعلم، وكيفية الاستفادة القصوى من الدروس العملية القصيرة قبل الانتقال إلى مفاهيم الإدارة.',
          descriptionEn:
            'A tour of the course roadmap and learning outcomes, and how to get the most from the short practical lessons ahead.',
          durationMinutes: 5,
          videoUrl: SAMPLE_VIDEOS.bigBuckBunny,
        },
        {
          id: 'biz-02',
          titleAr: 'ماهية الإدارة؟ الوظائف الأساسية الأربع',
          titleEn: 'What Is Management? The Four Core Functions',
          descriptionAr:
            'شرح مبسط لوظائف التخطيط والتنظيم والتوجيه والرقابة مع أمثلة من بيئات العمل الواقعية اليومية.',
          descriptionEn:
            'A simplified walkthrough of planning, organizing, leading, and controlling with everyday workplace examples.',
          durationMinutes: 7,
          videoUrl: SAMPLE_VIDEOS.elephantsDream,
        },
        {
          id: 'biz-03',
          titleAr: 'البيئة التنظيمية وأصحاب المصلحة',
          titleEn: 'Organizational Environment & Stakeholders',
          descriptionAr:
            'كيف تقرأ البيئة الداخلية والخارجية للمنشأة، وتصنّف أصحاب المصلحة وتدير توقعاتهم بذكاء.',
          descriptionEn:
            'Learn to read the internal and external environment, map stakeholders, and manage their expectations wisely.',
          durationMinutes: 6,
          videoUrl: SAMPLE_VIDEOS.biggerBlazes,
        },
        {
          id: 'biz-04',
          titleAr: 'أنماط القيادة وأثرها على الفريق',
          titleEn: 'Leadership Styles & Team Impact',
          descriptionAr:
            'مقارنة عملية بين أنماط القيادة التحويلية والتبادلية والتشاركية ومتى يناسب كل نمط فريقك.',
          descriptionEn:
            'A practical comparison of transformational, transactional, and participative leadership — and when each fits your team.',
          durationMinutes: 8,
          videoUrl: SAMPLE_VIDEOS.biggerEscapes,
        },
      ],
    },
    {
      id: 'biz-sec-2',
      titleAr: 'التخطيط التشغيلي واتخاذ القرار',
      titleEn: 'Operational Planning & Decision Making',
      lessons: [
        {
          id: 'biz-05',
          titleAr: 'من الرؤية إلى الخطة التشغيلية',
          titleEn: 'From Vision to Operational Plan',
          descriptionAr:
            'خطوات تحويل الرؤية الاستراتيجية إلى خطة تشغيلية قابلة للتنفيذ بمهام ومسؤوليات وتواريخ واضحة.',
          descriptionEn:
            'Steps to translate strategic vision into an executable operational plan with clear tasks, owners, and dates.',
          durationMinutes: 7,
          videoUrl: SAMPLE_VIDEOS.biggerFun,
        },
        {
          id: 'biz-06',
          titleAr: 'بناء الأهداف بمنهجية SMART',
          titleEn: 'Setting Goals with the SMART Method',
          descriptionAr:
            'تطبيق منهجية الأهداف الذكية على أمثلة تدريبية، وتجنب الأخطاء الشائعة في صياغة الأهداف الغامضة.',
          descriptionEn:
            'Apply SMART goal setting on training examples and avoid the common traps of vague objective writing.',
          durationMinutes: 6,
          videoUrl: SAMPLE_VIDEOS.biggerJoyrides,
        },
        {
          id: 'biz-07',
          titleAr: 'أدوات ترتيب الأولويات واتخاذ القرار',
          titleEn: 'Prioritization & Decision-Making Tools',
          descriptionAr:
            'استخدام مصفوفة أيزنهاور وشجرة القرار لترتيب المهام واختيار البدائل الأنسب تحت الضغط.',
          descriptionEn:
            'Use the Eisenhower matrix and decision trees to rank tasks and choose the best option under pressure.',
          durationMinutes: 8,
          videoUrl: SAMPLE_VIDEOS.biggerMeltdowns,
        },
        {
          id: 'biz-08',
          titleAr: 'إدارة المخاطر التشغيلية للمشاريع الصغيرة',
          titleEn: 'Managing Operational Risks in Small Projects',
          descriptionAr:
            'كيف تحدد مخاطر المشروع مبكرًا، وتقيّم أثرها واحتماليتها، وتجهز خطط استجابة بسيطة وفعالة.',
          descriptionEn:
            'Identify project risks early, assess impact and likelihood, and prepare simple, effective response plans.',
          durationMinutes: 7,
          videoUrl: SAMPLE_VIDEOS.sintel,
        },
      ],
    },
    {
      id: 'biz-sec-3',
      titleAr: 'القياس والأداء والمتابعة',
      titleEn: 'Measurement, Performance & Follow-up',
      lessons: [
        {
          id: 'biz-09',
          titleAr: 'مؤشرات الأداء الرئيسية KPIs',
          titleEn: 'Key Performance Indicators (KPIs)',
          descriptionAr:
            'اختيار مؤشرات أداء ذات معنى لفريقك، وربطها بالأهداف، وقراءة اتجاهاتها دون غرق في الأرقام.',
          descriptionEn:
            'Choose meaningful KPIs for your team, link them to goals, and read their trends without drowning in numbers.',
          durationMinutes: 7,
          videoUrl: SAMPLE_VIDEOS.tearsOfSteel,
        },
        {
          id: 'biz-10',
          titleAr: 'قراءة التقارير المالية لغير الماليين',
          titleEn: 'Reading Financial Reports for Non-Finance Roles',
          descriptionAr:
            'مدخل عملي لفهم قائمة الدخل والميزانية العمومية واكتشاف الإشارات المالية المهمة للقرارات الإدارية.',
          descriptionEn:
            'A practical primer on income statements and balance sheets, spotting the financial signals that drive decisions.',
          durationMinutes: 9,
          videoUrl: SAMPLE_VIDEOS.subaruDirt,
        },
        {
          id: 'biz-11',
          titleAr: 'جلسات المتابعة والتغذية الراجعة الفعالة',
          titleEn: 'Effective Follow-up Meetings & Feedback',
          descriptionAr:
            'إدارة اجتماعات متابعة قصيرة ومنتجة، وصياغة تغذية راجعة بنّاءة تحفّز الأداء بدل تثبيطه.',
          descriptionEn:
            'Run short, productive follow-up meetings and deliver constructive feedback that boosts performance.',
          durationMinutes: 6,
          videoUrl: SAMPLE_VIDEOS.volkswagen,
        },
        {
          id: 'biz-12',
          titleAr: 'مشروع ختامي: خطة تشغيل مصغرة',
          titleEn: 'Capstone: A Mini Operational Plan',
          descriptionAr:
            'تطبيق ختامي يجمع مهارات الدورة في إعداد خطة تشغيلية مصغرة لمنشأة افتراضية مع قائمة تحقق ذاتية.',
          descriptionEn:
            'A capstone exercise combining all course skills into a mini operational plan with a self-review checklist.',
          durationMinutes: 8,
          videoUrl: SAMPLE_VIDEOS.bullrun,
        },
      ],
    },
  ],
};

/**
 * Demo course #2 — professional client service & communication.
 */
const CLIENT_SERVICE_COURSE: DemoCourse = {
  id: 'demo-client-service',
  titleAr: 'مهارات خدمة العملاء والتواصل الاحترافي',
  titleEn: 'Client Service & Professional Communication Skills',
  descriptionAr:
    'دورة تجريبية تركّز على تجربة المستفيد: الاستماع النشط، إدارة الطلبات والشكاوى، التوثيق في أنظمة CRM، وكتابة الردود المهنية بثقة.',
  descriptionEn:
    'A demo course focused on client experience: active listening, handling requests and complaints, CRM documentation, and confident professional replies.',
  instructor: {
    nameAr: 'أ. محمد الشمري',
    nameEn: 'Mr. Mohammed Al-Shammari',
    roleAr: 'خبير خدمة عملاء ومدرب معتمد',
    roleEn: 'Customer Service Expert & Certified Trainer',
  },
  image: '/src/assets/images/customer_service_course_1795281370311.jpg',
  levelAr: 'مستوى مبتدئ',
  levelEn: 'Beginner Level',
  sections: [
    {
      id: 'svc-sec-1',
      titleAr: 'أساسيات تجربة المستفيد',
      titleEn: 'Client Experience Foundations',
      lessons: [
        {
          id: 'svc-01',
          titleAr: 'لماذا تُعد تجربة المستفيد ميزة تنافسية؟',
          titleEn: 'Why Client Experience Is a Competitive Edge',
          descriptionAr:
            'أثر التجربة الإيجابية على ولاء المستفيد وسمعة المنشأة، وأمثلة واقعية لفرق خدمة متميزة.',
          descriptionEn:
            'How a positive experience builds loyalty and reputation, with real examples of standout service teams.',
          durationMinutes: 5,
          videoUrl: SAMPLE_VIDEOS.forAGrand,
        },
        {
          id: 'svc-02',
          titleAr: 'رحلة المستفيد ونقاط الاتصال',
          titleEn: 'The Client Journey & Touchpoints',
          descriptionAr:
            'تتبع رحلة المستفيد من أول تواصل حتى إغلاق الطلب، وتحديد نقاط الاتصال الحاسمة التي تصنع الانطباع.',
          descriptionEn:
            'Trace the journey from first contact to case closure and pinpoint the touchpoints that shape impressions.',
          durationMinutes: 7,
          videoUrl: SAMPLE_VIDEOS.biggerFun,
        },
        {
          id: 'svc-03',
          titleAr: 'لغة الجسد ونبرة الصوت',
          titleEn: 'Body Language & Tone of Voice',
          descriptionAr:
            'إشارات التواصل غير اللفظي في اللقاءات والاتصالات المرئية، وضبط النبرة لتعكس الطمأنينة والاحتراف.',
          descriptionEn:
            'Non-verbal cues in meetings and video calls, and tuning your tone to signal calm professionalism.',
          durationMinutes: 6,
          videoUrl: SAMPLE_VIDEOS.biggerJoyrides,
        },
        {
          id: 'svc-04',
          titleAr: 'الاستماع النشط وإعادة الصياغة',
          titleEn: 'Active Listening & Paraphrasing',
          descriptionAr:
            'تقنيات الإصغاء الفعّال، وإعادة صياغة كلام المستفيد للتأكد من الفهم قبل تقديم الحل.',
          descriptionEn:
            'Effective listening techniques and paraphrasing to confirm understanding before offering solutions.',
          durationMinutes: 7,
          videoUrl: SAMPLE_VIDEOS.bigBuckBunny,
        },
      ],
    },
    {
      id: 'svc-sec-2',
      titleAr: 'إدارة الحالات والطلبات',
      titleEn: 'Handling Cases & Requests',
      lessons: [
        {
          id: 'svc-05',
          titleAr: 'دورة حياة طلب المستفيد',
          titleEn: 'The Client Request Lifecycle',
          descriptionAr:
            'مراحل استقبال الطلب وفرزه ومعالجته وإغلاقه، ونقاط التحقق التي تضمن عدم ضياع أي حالة.',
          descriptionEn:
            'Stages of receiving, triaging, processing, and closing requests, with checkpoints so no case slips through.',
          durationMinutes: 6,
          videoUrl: SAMPLE_VIDEOS.biggerBlazes,
        },
        {
          id: 'svc-06',
          titleAr: 'التعامل مع الشكاوى بلباقة',
          titleEn: 'Handling Complaints with Grace',
          descriptionAr:
            'نموذج عملي للاستجابة للشكاوى: الاعتذار المهني، احتواء الانفعال، وتقديم حل واضح بمتابعة.',
          descriptionEn:
            'A practical complaint-response model: professional apology, de-escalation, and a clear follow-up plan.',
          durationMinutes: 8,
          videoUrl: SAMPLE_VIDEOS.biggerMeltdowns,
        },
        {
          id: 'svc-07',
          titleAr: 'توثيق الحالات في أنظمة CRM',
          titleEn: 'Documenting Cases in CRM Systems',
          descriptionAr:
            'كتابة ملاحظات حالة واضحة وقابلة للإسناد، وتنظيم التصنيفات والأولويات داخل نظام المتابعة.',
          descriptionEn:
            'Write clear, assignable case notes and organize categories and priorities inside your tracking system.',
          durationMinutes: 7,
          videoUrl: SAMPLE_VIDEOS.elephantsDream,
        },
        {
          id: 'svc-08',
          titleAr: 'التصعيد الذكي للمشكلات المعقدة',
          titleEn: 'Smart Escalation for Complex Issues',
          descriptionAr:
            'متى تصعّد الحالة ولمن؟ إعداد ملخص تصعيد موجز يسرّع القرار ويحفظ حقوق المستفيد.',
          descriptionEn:
            'When and how to escalate, preparing a brief escalation summary that speeds decisions and protects clients.',
          durationMinutes: 6,
          videoUrl: SAMPLE_VIDEOS.biggerEscapes,
        },
      ],
    },
    {
      id: 'svc-sec-3',
      titleAr: 'الاحتراف المهني والقياس',
      titleEn: 'Professionalism & Measurement',
      lessons: [
        {
          id: 'svc-09',
          titleAr: 'كتابة الردود المهنية',
          titleEn: 'Writing Professional Replies',
          descriptionAr:
            'هيكلة الرد المكتوب: بداية إيجابية، جسم واضح، وخاتمة بوعود واقعية قابلة للتنفيذ.',
          descriptionEn:
            'Structuring written replies: a positive opener, a clear body, and a closing with realistic commitments.',
          durationMinutes: 7,
          videoUrl: SAMPLE_VIDEOS.sintel,
        },
        {
          id: 'svc-10',
          titleAr: 'إدارة ضغط العمل والوقت',
          titleEn: 'Managing Workload & Time Pressure',
          descriptionAr:
            'أدوات تنظيم قائمة الطلبات اليومية، والتعامل مع أوقات الذروة دون التضحية بجودة الخدمة.',
          descriptionEn:
            'Organize your daily request queue and survive peak hours without sacrificing service quality.',
          durationMinutes: 6,
          videoUrl: SAMPLE_VIDEOS.tearsOfSteel,
        },
        {
          id: 'svc-11',
          titleAr: 'قياس رضا المستفيدين',
          titleEn: 'Measuring Client Satisfaction',
          descriptionAr:
            'تصميم استبيانات قصيرة عالية الاستجابة، وقراءة نتائجها لتحسين الخدمة باستمرار.',
          descriptionEn:
            'Design short, high-response surveys and read the results to keep improving your service.',
          durationMinutes: 7,
          videoUrl: SAMPLE_VIDEOS.subaruDirt,
        },
        {
          id: 'svc-12',
          titleAr: 'مشروع ختامي: دليل خدمة مصغر',
          titleEn: 'Capstone: A Mini Service Playbook',
          descriptionAr:
            'تطبيق ختامي لإعداد دليل مصغر لردود فريق الخدمة مع سيناريوهات الحالات الشائعة.',
          descriptionEn:
            'A capstone exercise building a mini service playbook with scripts for common case scenarios.',
          durationMinutes: 8,
          videoUrl: SAMPLE_VIDEOS.volkswagen,
        },
      ],
    },
  ],
};

export const DEMO_COURSES: DemoCourse[] = [BUSINESS_COURSE, CLIENT_SERVICE_COURSE];
