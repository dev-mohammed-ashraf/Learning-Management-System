import type {
  AiToolDefinition,
  AssessmentDefinition,
  LearningPathDefinition,
  ProjectDefinition,
  StudyGroupDefinition,
} from '../types/student';

export const LEARNING_PATHS: LearningPathDefinition[] = [
  {
    id: 'path-business-contracting',
    titleAr: 'مسار الإدارة والأعمال والتعاقدات',
    titleEn: 'Business Administration & Contracting Path',
    subtitleAr: 'مسار متسلسل لتأسيس المهارات الإدارية والمشتريات المؤسسية',
    subtitleEn: 'A sequential path building core management and procurement governance skills',
    descriptionAr:
      'يجمع هذا المسار بين دبلوم إدارة الأعمال ودبلوم إدارة المشتريات والعقود لإعداد المتعلم للتخطيط التشغيلي وإدارة العقود والمنافسات.',
    descriptionEn:
      'Combines Business Administration and Procurement & Contracts Management to prepare learners for operational planning and contract governance.',
    image: '/src/assets/images/business_course_1795281370535.jpg',
    programIds: ['5', '6'],
    status: 'active',
    durationAr: 'مساران معتمدان · 30 ساعة معتمدة لكل دبلوم',
    durationEn: '2 Accredited Diplomas · 30 Credit Hours Each',
  },
  {
    id: 'path-logistics-operations',
    titleAr: 'مسار اللوجستيات وتنظيم الفعاليات',
    titleEn: 'Logistics & Event Operations Path',
    subtitleAr: 'إدارة التدفق التشغيلي وسلاسل الإمداد والفعاليات الميدانية',
    subtitleEn: 'Coordinating operational workflows, supply chains, and live event logistics',
    descriptionAr:
      'يركز على التكامل بين إدارة اللوجستيات وسلاسل الإمداد وإدارة الحشود والفعاليات لتأهيل الطالب على التخطيط الميداني واللوجستي.',
    descriptionEn:
      'Connects Logistics & Supply Chain Management with Crowd & Event Management for end-to-end operational readiness.',
    image: '/src/assets/images/logistics_course_1795281369361.jpg',
    programIds: ['10', '14'],
    status: 'active',
    durationAr: 'مساران معتمدان · 30 ساعة معتمدة لكل دبلوم',
    durationEn: '2 Accredited Diplomas · 30 Credit Hours Each',
  },
  {
    id: 'path-communication-service',
    titleAr: 'مسار التواصل الاحترافي وخدمة المستفيدين',
    titleEn: 'Professional Communication & Client Service Path',
    subtitleAr: 'تعزيز مهارات خدمة العملاء والتواصل باللغة الإنجليزية',
    subtitleEn: 'Strengthening beneficiary experience and practical English communication',
    descriptionAr:
      'يربط بين دبلوم خدمة العملاء ودبلوم اللغة الإنجليزية لبناء كفاءة لغوية ومهنية عالية في بيئات العمل والتواصل المؤسسي.',
    descriptionEn:
      'Pairs Customer Service with the English Language Diploma to elevate communication quality in academic and workplace settings.',
    image: '/src/assets/images/customer_service_course_1795281370311.jpg',
    programIds: ['13', '8'],
    status: 'active',
    durationAr: 'مساران معتمدان · 30 ساعة معتمدة لكل دبلوم',
    durationEn: '2 Accredited Diplomas · 30 Credit Hours Each',
  },
  {
    id: 'path-safety-security',
    titleAr: 'مسار الأمن الوقائي وسلامة المنشآت',
    titleEn: 'Preventive Security & Facility Safety Path',
    subtitleAr: 'تأهيل متخصص في حماية المنشآت وإدارة غرف المراقبة والطوارئ',
    subtitleEn: 'Focused training on facility protection, monitoring workflows, and emergency protocols',
    descriptionAr:
      'يرتكز على دبلوم الحراسات الأمنية لبناء معرفة تطبيقية متكاملة حول الأمن الوقائي والتعامل المنظم مع البلاغات.',
    descriptionEn:
      'Built around the Security Guards Diploma to develop structured skills in preventive security and emergency response.',
    image: '/src/assets/images/security_course_1795281370219.jpg',
    programIds: ['7'],
    status: 'active',
    durationAr: 'مسار معتمد · 30 ساعة معتمدة',
    durationEn: '1 Accredited Diploma · 30 Credit Hours',
  },
  {
    id: 'path-fellowships-upcoming',
    titleAr: 'مسار الزمالات التخصصية (قيد الإعداد الأكاديمي)',
    titleEn: 'Specialized Fellowships Track (Coming Soon)',
    subtitleAr: 'مسارات زمالة متقدمة قيد الاعتماد الأكاديمي',
    subtitleEn: 'Advanced fellowship tracks currently undergoing academic accreditation',
    descriptionAr:
      'تعمل فرق المنصة على إعداد مسارات الزمالة التخصصية لإضافتها لاحقًا دون إدراج مقررات غير معتمدة.',
    descriptionEn:
      'The Madar platform team is preparing specialized fellowship tracks for future release without listing unaccredited courses.',
    image: '/src/assets/images/procurement_course_1795281371077.jpg',
    programIds: [],
    status: 'upcoming',
    durationAr: 'قريبًا على منصة مدار',
    durationEn: 'Upcoming on the Madar Platform',
  },
];

export const COURSE_ASSESSMENTS: AssessmentDefinition[] = [
  {
    id: 'assess-13',
    programId: '13',
    titleAr: 'تقييم جاهزية مبادئ خدمة المستفيدين وأنظمة CRM',
    titleEn: 'Client Service & CRM Foundations Readiness Check',
    descriptionAr:
      'مراجعة تطبيقية لمحاور تجربة المستفيد، مهارات الحوار، وآليات توثيق طلبات العملاء قبل الاختبار الرسمي.',
    descriptionEn:
      'Syllabus-aligned readiness review covering beneficiary experience, dialogue skills, and CRM request tracking.',
    questionCount: 4,
    durationMinutes: 15,
    sampleTopicsAr: [
      'مبادئ تجربة المستفيد وثقافة الخدمة',
      'مهارات الحوار والإصغاء وبناء الثقة',
      'استخدام أنظمة متابعة طلبات العملاء (CRM)',
      'معالجة الملاحظات والمواقف الصعبة بهدوء',
    ],
    sampleTopicsEn: [
      'Beneficiary Experience & Service Principles',
      'Active Listening & Constructive Dialogue',
      'Managing Client Requests Using CRM Tools',
      'Resolving Complaints & Difficult Scenarios',
    ],
  },
  {
    id: 'assess-14',
    programId: '14',
    titleAr: 'تقييم جاهزية التخطيط اللوجستي وسلامة الحشود',
    titleEn: 'Event Planning & Crowd Flow Readiness Check',
    descriptionAr:
      'مراجعة محاور تصميم خطط الفعاليات، إدارة التدفق البشري، والتنسيق الميداني لفرق التنظيم.',
    descriptionEn:
      'Review of event blueprints, crowd safety flow dynamics, and on-site team coordination.',
    questionCount: 4,
    durationMinutes: 15,
    sampleTopicsAr: [
      'تصميم خطط الفعاليات والمؤتمرات وجدولتها',
      'مبادئ سلامة الحشود وإدارة التدفق البشري',
      'التنسيق اللوجستي وتجهيز المواقع الميدانية',
      'قيادة فرق التنظيم والمتطوعين أثناء الحدث',
    ],
    sampleTopicsEn: [
      'Event Blueprints, Timelines & Scheduling',
      'Crowd Flow Dynamics & Venue Safety',
      'On-Site Logistics & Operational Readiness',
      'Coordinating Organizers & Volunteer Teams',
    ],
  },
  {
    id: 'assess-10',
    programId: '10',
    titleAr: 'تقييم جاهزية تخطيط المخزون وسلاسل الإمداد',
    titleEn: 'Supply Chain & Inventory Control Readiness Check',
    descriptionAr:
      'تحقق ذاتي من استيعاب مفاهيم سلاسل الإمداد، تنظيم المستودعات، وإجراءات النقل والشحن.',
    descriptionEn:
      'Self-check on modern supply chains, warehouse organization, freight operations, and supplier coordination.',
    questionCount: 4,
    durationMinutes: 20,
    sampleTopicsAr: [
      'مفاهيم سلاسل الإمداد والعمليات اللوجستية الحديثة',
      'أساسيات تخطيط المخزون وتنظيم المستودعات',
      'عمليات النقل والشحن وإجراءات التخليص',
      'تقدير الاحتياج والتنسيق المستمر مع الموردين',
    ],
    sampleTopicsEn: [
      'Modern Supply Chain & Logistics Foundations',
      'Inventory Control & Warehouse Organization',
      'Freight Operations & Shipping Workflows',
      'Demand Forecasting & Supplier Coordination',
    ],
  },
  {
    id: 'assess-5',
    programId: '5',
    titleAr: 'تقييم جاهزية أركان الإدارة والمحاسبة الأساسية',
    titleEn: 'Business Foundations & Accounting Readiness Check',
    descriptionAr:
      'مراجعة تأسيسية لمحاور الخطط التشغيلية، السلوك التنظيمي، وقراءة القوائم المالية الأساسية.',
    descriptionEn:
      'Core review covering operational planning, organizational behavior, and financial statement literacy.',
    questionCount: 4,
    durationMinutes: 20,
    sampleTopicsAr: [
      'أساسيات الإدارة وبناء الخطط التشغيلية',
      'فهم بيئة العمل وإدارة فرق الأفراد',
      'مدخل إلى المحاسبة وقراءة القوائم المالية',
      'أدوات التسويق وتخطيط المشاريع العملية',
    ],
    sampleTopicsEn: [
      'Management Foundations & Operational Planning',
      'Organizational Behavior & Team Dynamics',
      'Introductory Accounting & Financial Literacy',
      'Marketing Basics & Project Organization',
    ],
  },
  {
    id: 'assess-6',
    programId: '6',
    titleAr: 'تقييم جاهزية دورة المشتريات وحوكمة العقود',
    titleEn: 'Procurement Lifecycle & Contracts Readiness Check',
    descriptionAr:
      'مراجعة لنظام المنافسات والمشتريات الحكومية، فحص العروض، ومتابعة الالتزامات التعاقدية.',
    descriptionEn:
      'Readiness verification for tender documentation, public procurement governance, and contract obligations.',
    questionCount: 4,
    durationMinutes: 20,
    sampleTopicsAr: [
      'دورة المشتريات وإعداد وثائق المنافسات',
      'فهم نظام المنافسات والمشتريات الحكومية',
      'أصول قراءة العقود ومتابعة الالتزامات',
      'مهارات التفاوض وتقييم مخاطر التوريد',
    ],
    sampleTopicsEn: [
      'Procurement Lifecycle & Tender Preparation',
      'Public Procurement Rules & Governance',
      'Contract Review & Obligation Tracking',
      'Supplier Negotiation & Supply Risk',
    ],
  },
  {
    id: 'assess-7',
    programId: '7',
    titleAr: 'تقييم جاهزية الأمن الوقائي والاستجابة للطوارئ',
    titleEn: 'Preventive Security & Emergency Response Check',
    descriptionAr:
      'مراجعة لمهارات تأمين المنشآت، تشغيل غرف المراقبة، وإعداد التقارير الميدانية.',
    descriptionEn:
      'Readiness check covering facility access protection, monitoring operations, and incident reporting.',
    questionCount: 4,
    durationMinutes: 15,
    sampleTopicsAr: [
      'أساسيات الأمن الوقائي وتأمين المنشآت',
      'آليات عمل غرف المراقبة والأنظمة الأمنية',
      'السلامة المهنية والتعامل مع البلاغات والطوارئ',
      'إعداد التقارير الميدانية والانضباط التنظيمي',
    ],
    sampleTopicsEn: [
      'Preventive Security & Access Protection',
      'Monitoring Operations & Security Systems',
      'Safety Protocols & Emergency Response',
      'Field Incident Reporting & Conduct',
    ],
  },
  {
    id: 'assess-8',
    programId: '8',
    titleAr: 'تقييم جاهزية المراسلات والقواعد الإنجليزية',
    titleEn: 'Applied English Grammar & Writing Readiness Check',
    descriptionAr:
      'تحقق ذاتي من إتقان بناء الجملة الإنجليزية، الفهم السماعي، وصياغة تقارير العمل.',
    descriptionEn:
      'Self-check across applied grammar, listening fluency, and professional workplace writing.',
    questionCount: 4,
    durationMinutes: 20,
    sampleTopicsAr: [
      'بناء الجملة والقواعد الإنجليزية التطبيقية',
      'تطوير الاستماع والنطق والمحادثة اليومية',
      'صياغة الرسائل والتقارير الإنجليزية باحتراف',
      'مفردات التواصل الأكاديمي وبيئات العمل',
    ],
    sampleTopicsEn: [
      'Applied English Grammar & Sentence Structure',
      'Listening Comprehension & Spoken Fluency',
      'Structured Reports & Workplace Writing',
      'Academic & Professional Vocabulary',
    ],
  },
];

export const APPLIED_PROJECTS: ProjectDefinition[] = [
  {
    id: 'proj-5',
    programId: '5',
    pathId: 'path-business-contracting',
    titleAr: 'مشروع تخطيط تشغيلي لمبادرة مؤسسية ناشئة',
    titleEn: 'Operational Planning Blueprint for a Growing Organization',
    summaryAr:
      'إعداد خطة تشغيلية مصغرة تتضمن الهيكل التنظيمي، توزيع مهام الفريق، وتقدير التكاليف الأساسية.',
    summaryEn:
      'Draft a structured operational blueprint covering team structure, role responsibilities, and foundational budget mapping.',
    deliverablesAr: [
      'وثيقة الخطة التشغيلية والأهداف الفصلية',
      'جدول توزيع أدوار فريق العمل',
      'ملخص مالي مبدئي للإيرادات والمصروفات',
    ],
    deliverablesEn: [
      'Quarterly Operational Plan Document',
      'Team Roles & Responsibility Matrix',
      'Introductory Budget & Cost Summary',
    ],
  },
  {
    id: 'proj-6',
    programId: '6',
    pathId: 'path-business-contracting',
    titleAr: 'ملف منافسة ومراجعة بنود عقد توريد',
    titleEn: 'Tender Preparation & Supply Contract Review Dossier',
    summaryAr:
      'تطبيق عملي لصياغة كراسة احتياجات مبسطة، وتحديد معايير التقييم الفني والمالي، ومراجعة بنود الالتزام.',
    summaryEn:
      'Prepare a streamlined RFP specification, define vendor scoring criteria, and annotate key contract obligation clauses.',
    deliverablesAr: [
      'نموذج تحديد الاحتياج والمواصفات الفنية',
      'مصفوفة مفاضلة العروض ومخاطر التوريد',
      'قائمة تحقق لمراجعة بنود العقد والضمانات',
    ],
    deliverablesEn: [
      'Technical Scope & Requirements Sheet',
      'Vendor Evaluation & Supply Risk Matrix',
      'Contract Compliance & Obligations Checklist',
    ],
  },
  {
    id: 'proj-10',
    programId: '10',
    pathId: 'path-logistics-operations',
    titleAr: 'نموذج تنظيم مستودع وجدولة حركة الشحن',
    titleEn: 'Warehouse Layout & Freight Scheduling Model',
    summaryAr:
      'تصميم مخطط نظري لتوزيع مناطق الاستلام والتخزين والصرف، مع جدول متابعة مستويات المخزون.',
    summaryEn:
      'Design a conceptual warehouse zoning layout and a replenishment tracking sheet for inbound/outbound shipments.',
    deliverablesAr: [
      'خريطة توزيع مناطق التخزين والمناولة',
      'جدول تحديد نقاط إعادة الطلب للمخزون',
      'خطة تنسيق مواعيد النقل مع الموردين',
    ],
    deliverablesEn: [
      'Warehouse Zone & Handling Diagram',
      'Inventory Reorder Threshold Sheet',
      'Carrier & Supplier Dispatch Schedule',
    ],
  },
  {
    id: 'proj-14',
    programId: '14',
    pathId: 'path-logistics-operations',
    titleAr: 'خطة إدارة تدفق الزوار لفعالية مجتمعية',
    titleEn: 'Visitor Flow & Operations Plan for a Community Event',
    summaryAr:
      'بناء خطة تشغيل متكاملة لحدث افتراضي تشمل مسارات الدخول والخروج، ونقاط الإرشاد، وفرق المتطوعين.',
    summaryEn:
      'Build an end-to-end venue operations plan covering entry/exit corridors, wayfinding stations, and volunteer shifts.',
    deliverablesAr: [
      'مخطط مسارات الزوار ونقاط التجمع الآمنة',
      'الجدول الزمني للحدث وتوزيع المناوبات',
      'بروتوكول التعامل مع الحالات الطارئة في الموقع',
    ],
    deliverablesEn: [
      'Crowd Corridor & Assembly Zone Map',
      'Event Run-of-Show & Shift Roster',
      'On-Site Safety Escalation Protocol',
    ],
  },
  {
    id: 'proj-13',
    programId: '13',
    pathId: 'path-communication-service',
    titleAr: 'دليل استجابة وتوثيق طلبات المستفيدين (CRM)',
    titleEn: 'Client Care Playbook & CRM Ticket Workflow',
    summaryAr:
      'تصميم سيناريوهات ردود مهنية ومراحل تصنيف ومعالجة بلاغات المستفيدين عبر نظام المتابعة.',
    summaryEn:
      'Create professional response templates and a clear ticket triage workflow for resolving client requests calmly.',
    deliverablesAr: [
      'نماذج استجابة لحالات خدمة المستفيدين الشائعة',
      'تصنيف أولويات التذاكر ومسار التصعيد',
      'قائمة فحص جودة إغلاق الطلبات',
    ],
    deliverablesEn: [
      'Standard Client Communication Templates',
      'Ticket Priority & Escalation Flowchart',
      'Case Closure Quality Checklist',
    ],
  },
  {
    id: 'proj-8',
    programId: '8',
    pathId: 'path-communication-service',
    titleAr: 'ملف المراسلات والتقارير المهنية باللغة الإنجليزية',
    titleEn: 'Professional English Correspondence & Reporting Portfolio',
    summaryAr:
      'إعداد مجموعة مراسلات رسمية وتقرير عمل موجز باللغة الإنجليزية وفق قواعد الصياغة الأكاديمية والمهنية.',
    summaryEn:
      'Compile formal workplace emails and a concise executive summary written in clear academic and business English.',
    deliverablesAr: [
      'ثلاث رسائل تواصل رسمية باللغة الإنجليزية',
      'ملخص تنفيذي لتقرير عمل من صفحة واحدة',
      'مسرد مصطلحات التخصص الأساسية',
    ],
    deliverablesEn: [
      'Three Formal Workplace Correspondence Drafts',
      'One-Page Executive Activity Summary',
      'Core Academic & Workplace Glossary',
    ],
  },
  {
    id: 'proj-7',
    programId: '7',
    pathId: 'path-safety-security',
    titleAr: 'دليل إجراءات الأمن الوقائي وتوثيق البلاغات الميدانية',
    titleEn: 'Facility Preventive Security & Incident Reporting Manual',
    summaryAr:
      'صياغة إجراء قياسي لتفتيش المداخل، مراقبة نقاط التحقق في غرفة العمليات، وكتابة تقرير واقعة منضبط.',
    summaryEn:
      'Author standard operating steps for gate access verification, control room monitoring checks, and incident logs.',
    deliverablesAr: [
      'قائمة فحص نقاط الدخول والخروج للمنشأة',
      'جدول التحقق الدوري لغرفة المراقبة',
      'نموذج تقرير بلاغ ميداني متكامل',
    ],
    deliverablesEn: [
      'Facility Access Inspection Checklist',
      'Control Room Monitoring Routine Log',
      'Structured Field Incident Report Template',
    ],
  },
];

export const STUDY_GROUPS: StudyGroupDefinition[] = [
  {
    id: 'group-business',
    programId: '5',
    pathId: 'path-business-contracting',
    titleAr: 'حلقة نقاش الإدارة والأعمال والمشتريات',
    titleEn: 'Business Administration & Procurement Study Circle',
    descriptionAr:
      'مجموعة مخصصة لطلبة مسار الإدارة والأعمال وإدارة المشتريات والعقود لمراجعة المفاهيم التشغيلية وبنود المنافسات.',
    descriptionEn:
      'Dedicated peer group for Business Administration and Procurement learners reviewing operational planning and tender rules.',
    focusAr: 'التخطيط التشغيلي · المحاسبة · نظام المنافسات',
    focusEn: 'Operations · Accounting · Tender Rules',
  },
  {
    id: 'group-logistics',
    programId: '10',
    pathId: 'path-logistics-operations',
    titleAr: 'مجموعة دراسة سلاسل الإمداد وإدارة الفعاليات',
    titleEn: 'Logistics & Event Management Study Group',
    descriptionAr:
      'تجمع دارسي اللوجستيات وتنظيم الحشود لتبادل ملخصات تنظيم المستودعات وتخطيط الفعاليات الميدانية.',
    descriptionEn:
      'Unites Logistics and Event Management learners around warehouse planning and venue flow coordination topics.',
    focusAr: 'سلاسل الإمداد · المخزون · سلامة الحشود',
    focusEn: 'Supply Chains · Inventory · Crowd Safety',
  },
  {
    id: 'group-service-english',
    programId: '13',
    pathId: 'path-communication-service',
    titleAr: 'مجتمع مهارات التواصل وخدمة المستفيدين واللغة الإنجليزية',
    titleEn: 'Client Service & English Communication Circle',
    descriptionAr:
      'بيئة مساندة لطلبة خدمة العملاء واللغة الإنجليزية لتطبيق مهارات الحوار الاحترافي وكتابة المراسلات.',
    descriptionEn:
      'Supportive circle for Customer Service and English Diploma students practicing professional dialogue and writing.',
    focusAr: 'خدمة المستفيدين · CRM · المراسلات الإنجليزية',
    focusEn: 'Client Service · CRM · Business English',
  },
  {
    id: 'group-security',
    programId: '7',
    pathId: 'path-safety-security',
    titleAr: 'حلقة دراسة الأمن الوقائي وسلامة المنشآت',
    titleEn: 'Preventive Security & Safety Study Group',
    descriptionAr:
      'تهدف إلى مراجعة إجراءات حماية المنشآت، أنظمة المراقبة، وإعداد التقارير الميدانية لطلبة الحراسات الأمنية.',
    descriptionEn:
      'Focused on reviewing facility security, monitoring procedures, and field reporting with peers in the Security Diploma.',
    focusAr: 'الأمن الوقائي · غرف المراقبة · الطوارئ',
    focusEn: 'Facility Security · Monitoring · Emergency',
  },
];

export const AI_LEARNING_TOOLS: AiToolDefinition[] = [
  {
    id: 'concept-explainer',
    titleAr: 'مساعد شرح المفاهيم',
    titleEn: 'Concept Explainer',
    descriptionAr:
      'حوّل أي مفهوم نظري من محاور الدبلوم إلى شرح مبسط بأمثلة تطبيقية واضحة تناسب مستواك الدراسي.',
    descriptionEn:
      'Turn any syllabus concept into a clear, step-by-step explanation tailored to your current diploma track.',
    promptPlaceholderAr: 'مثال: اشرح الفرق بين المخزون الاحتياطي ونقطة إعادة الطلب مع مثال عملي.',
    promptPlaceholderEn: 'Example: Explain the difference between safety stock and reorder point.',
    exampleTopicAr: 'إدارة المخزون الاحتياطي ونقطة إعادة الطلب',
    exampleTopicEn: 'Safety Stock vs. Reorder Point',
  },
  {
    id: 'content-summarizer',
    titleAr: 'تلخيص المحتوى التعليمي',
    titleEn: 'Content Summarizer',
    descriptionAr:
      'لخّص المحاضرات والنصوص الدراسية الطويلة في نقاط مركزة ومفاتيح مراجعة سريعة قبل الاختبار.',
    descriptionEn:
      'Condense long lecture notes and readings into concise bullet takeaways and revision highlights.',
    promptPlaceholderAr: 'الصق فقرة أو ملخص محور دراسي لتوليد طلب التلخيص المنظم.',
    promptPlaceholderEn: 'Paste a lecture excerpt or module outline to structure a summary request.',
    exampleTopicAr: 'ملخص إجراءات طرح وفحص المنافسات الحكومية',
    exampleTopicEn: 'Public Tendering & Bid Evaluation Summary',
  },
  {
    id: 'review-questions',
    titleAr: 'إنشاء أسئلة للمراجعة',
    titleEn: 'Review Question Generator',
    descriptionAr:
      'أعدّ قائمة أسئلة مراجعة اختيار من متعدد أو مقالية قصيرة لقياس فهمك لكل وحدة دراسية.',
    descriptionEn:
      'Compose structured practice questions (MCQ or short answer) for self-testing after each module.',
    promptPlaceholderAr: 'اكتب موضوع الوحدة الدراسية وعدد الأسئلة المطلوبة للمراجعة.',
    promptPlaceholderEn: 'Enter the module topic and preferred question format for revision.',
    exampleTopicAr: 'أسئلة مراجعة حول معالجة شكاوى المستفيدين',
    exampleTopicEn: 'Revision Questions on Client Complaint Handling',
  },
  {
    id: 'study-planner',
    titleAr: 'إعداد خطة مذاكرة',
    titleEn: 'Study Schedule Planner',
    descriptionAr:
      'صمّم جدولًا أسبوعيًا للمذاكرة يتناسب مع الساعات المسائية عن بُعد ومواعيد اختباراتك.',
    descriptionEn:
      'Structure a balanced weekly study timetable aligned with your evening distance sessions.',
    promptPlaceholderAr: 'حدّد عدد ساعات فراغك الأسبوعية والدورة التي تود التركيز عليها.',
    promptPlaceholderEn: 'Specify your weekly study hours and target courses.',
    exampleTopicAr: 'خطة مذاكرة 6 ساعات أسبوعيًا لمحاور إدارة الأعمال',
    exampleTopicEn: '6-Hour Weekly Business Diploma Study Plan',
  },
  {
    id: 'idea-organizer',
    titleAr: 'المساعدة في تنظيم الأفكار',
    titleEn: 'Idea & Outline Organizer',
    descriptionAr:
      'رتّب أفكار مشروعك التطبيقي أو تقريرك الدراسي في محاور منطقية وعناوين فرعية واضحة.',
    descriptionEn:
      'Structure project drafts, reports, and presentation ideas into coherent sections and action steps.',
    promptPlaceholderAr: 'اكتب فكرة المشروع أو التقرير للحصول على هيكلة مقترحة لإرساله لمحرك الذكاء الاصطناعي.',
    promptPlaceholderEn: 'Describe your project idea or report topic to build a structured outline prompt.',
    exampleTopicAr: 'هيكلة خطة تنظيم تدفق الزوار في فعالية كبرى',
    exampleTopicEn: 'Structuring an Event Crowd Flow Operations Plan',
  },
];
