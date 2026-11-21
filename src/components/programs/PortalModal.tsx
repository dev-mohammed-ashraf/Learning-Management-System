import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, GraduationCap, Mail, Phone, X } from 'lucide-react';
import { PROGRAMS } from '../../data/programs';
import type { Locale, Program } from '../../types/program';

export type ModalState =
  | { type: 'closed' }
  | { type: 'program'; program: Program; tab: 'details' | 'register' }
  | { type: 'auth'; mode: 'login' | 'register' }
  | { type: 'info'; section: 'about' | 'letters' | 'contact' | 'policy' | 'lms' | 'entities' | 'support' };

interface PortalModalProps {
  locale: Locale;
  modal: ModalState;
  onClose: () => void;
  onSwitchModal: (next: ModalState) => void;
}

export function PortalModal({ locale, modal, onClose, onSwitchModal }: PortalModalProps) {
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState(PROGRAMS[0].id);
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'installments'>('full');
  const [formError, setFormError] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState('');

  useEffect(() => {
    setFormError('');
    setSubmittedMsg('');
    if (modal.type === 'program') {
      setSelectedProgramId(modal.program.id);
    }
  }, [modal]);

  useEffect(() => {
    if (modal.type === 'closed') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal.type, onClose]);

  if (modal.type === 'closed') {
    return null;
  }

  const handleSubmit = (e: React.FormEvent, mode: 'login' | 'register' | 'program-register' | 'contact') => {
    e.preventDefault();
    setFormError('');

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setFormError(
          locale === 'ar'
            ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور للدخول إلى حسابك.'
            : 'Please enter your email and password to sign in.'
        );
        return;
      }
      setSubmittedMsg(
        locale === 'ar'
          ? 'تم التحقق من بيانات الطالب بنجاح. جارٍ توجيهك إلى بوابة التعلّم الرقمي بجامعة تبوك.'
          : 'Student credentials verified. Redirecting to the University of Tabuk digital learning portal.'
      );
      return;
    }

    if (mode === 'contact') {
      if (!fullName.trim() || !phone.trim() || !email.trim()) {
        setFormError(
          locale === 'ar'
            ? 'يرجى كتابة الاسم الكامل ورقم الجوال والبريد الإلكتروني لنتمكن من الرد عليك.'
            : 'Please provide your full name, mobile number, and email so our team can reach you.'
        );
        return;
      }
      setSubmittedMsg(
        locale === 'ar'
          ? 'استلمنا استفسارك بنجاح، وسيتواصل معك فريق الإرشاد الطلابي خلال أوقات العمل الرسمية.'
          : 'Your inquiry has been received. Our student guidance team will respond during working hours.'
      );
      return;
    }

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError(
        locale === 'ar'
          ? 'يرجى تعبئة جميع الحقول المطلوبة لإتمام طلب التسجيل.'
          : 'Please complete all required registration fields.'
      );
      return;
    }
    if (nationalId.trim().length < 8) {
      setFormError(
        locale === 'ar'
          ? 'يرجى التحقق من إدخال رقم الهوية الوطنية أو الإقامة بشكل صحيح.'
          : 'Please enter a valid National ID or Iqama number.'
      );
      return;
    }

    const chosen = PROGRAMS.find((p) => p.id === selectedProgramId);
    const chosenTitle = chosen ? (locale === 'ar' ? chosen.titleAr : chosen.titleEn) : '';
    setSubmittedMsg(
      locale === 'ar'
        ? `تم استلام طلب تسجيلك المبدئي في "${chosenTitle}" (${paymentPlan === 'full' ? 'سداد كامل' : 'نظام التقسيط'}). أرسلنا تفاصيل المتابعة والفاتورة إلى بريدك الإلكتروني.`
        : `Your initial registration for "${chosenTitle}" (${paymentPlan === 'full' ? 'Full Payment' : 'Installments'}) has been recorded. Follow-up and billing details have been sent to your email.`
    );
  };

  const renderInfoBody = (section: Extract<ModalState, { type: 'info' }>['section']) => {
    if (section === 'about') {
      const faqs = [
        {
          qAr: 'كيف تُقدّم الدورات والدبلومات على المنصة؟',
          qEn: 'How are classes delivered on the platform?',
          aAr: 'تُقدّم جميع برامج الدبلوم المشارك المهني عن بُعد بنظام التعليم المتزامن المسائي لمدة عام دراسي (30 ساعة معتمدة).',
          aEn: 'All professional associate diplomas are delivered online via live evening sessions over one academic year (30 credit hours).',
        },
        {
          qAr: 'ما طبيعة الشهادة الممنوحة عند التخرج؟',
          qEn: 'What certificate do students earn upon graduation?',
          aAr: 'يحصل الطالب بعد استيفاء متطلبات التخرج على شهادة دبلوم مشارك مهني معتمدة من معهد البحوث والاستشارات بجامعة تبوك.',
          aEn: 'Graduates receive an accredited professional associate diploma certificate from the Research and Consulting Institute at University of Tabuk.',
        },
        {
          qAr: 'ما خيارات سداد الرسوم الدراسية؟',
          qEn: 'What tuition payment options are available?',
          aAr: 'تبلغ الرسوم 6,500 ر.س شاملة الضريبة، ويتاح السداد الكامل أو بالتقسيط الشهري عبر بوابة مدفوعات جامعة تبوك.',
          aEn: 'Tuition is 6,500 SAR (VAT included), payable either in full or in monthly installments via the University of Tabuk payment gateway.',
        },
      ];

      return (
        <div className="space-y-5">
          <div className="space-y-2.5">
            <h3 className="text-[1.25rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
              {locale === 'ar'
                ? 'عن منصة التعلّم — معهد البحوث والاستشارات بجامعة تبوك'
                : 'About the Learning Platform — University of Tabuk'}
            </h3>
            <p className="text-[#64748B] dark:text-[#B8C7D9] leading-[1.85] text-[0.95rem]">
              {locale === 'ar'
                ? 'توفر المنصة تجربة دراسية إلكترونية منظمة تتيح للطلبة والراغبين في التطوير العلمي والعملي الالتحاق ببرامج الدبلوم المشارك المهني المقدمة من معهد البحوث والاستشارات بجامعة تبوك منذ عام 2006م، وفق بيئة تعليمية معتمدة من المركز الوطني للتعليم الإلكتروني ووزارة التعليم.'
                : 'This platform delivers a structured online study experience enabling learners to enroll in accredited associate diplomas offered by the Research and Consulting Institute at the University of Tabuk since 2006, supervised by NELC and the Ministry of Education.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[12px] p-4">
              <div className="font-bold text-[#142D4E] dark:text-[#F1F5F9] text-[0.95rem]">
                {locale === 'ar' ? 'مسارات دراسية مسائية عن بُعد' : 'Evening Online Tracks'}
              </div>
              <p className="text-[0.84rem] text-[#64748B] dark:text-[#B8C7D9] mt-1">
                {locale === 'ar'
                  ? '30 ساعة معتمدة في جداول مسائية تساعدك على التوفيق بين التعلم والتزاماتك.'
                  : '30 credit hours arranged in evening schedules so learning fits around daily responsibilities.'}
              </p>
            </div>
            <div className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[12px] p-4">
              <div className="font-bold text-[#142D4E] dark:text-[#F1F5F9] text-[0.95rem]">
                {locale === 'ar' ? 'خيارات سداد ميسّرة' : 'Flexible Payment Plans'}
              </div>
              <p className="text-[0.84rem] text-[#64748B] dark:text-[#B8C7D9] mt-1">
                {locale === 'ar'
                  ? 'ادفع كاملًا أو بالتقسيط الإلكتروني مباشرة عبر بوابة مدفوعات جامعة تبوك.'
                  : 'Pay tuition in full or via monthly installments through the University of Tabuk gateway.'}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <h4 className="font-bold text-[#142D4E] dark:text-[#F1F5F9] text-[1rem]">
              {locale === 'ar' ? 'الأسئلة الشائعة للطلاب' : 'Student FAQs'}
            </h4>
            <div className="space-y-2.5">
              {faqs.map((faq) => (
                <div
                  key={faq.qAr}
                  className="bg-[#F8FBFD] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[12px] p-3.5"
                >
                  <div className="font-bold text-[#142D4E] dark:text-[#F1F5F9] text-[0.9rem]">
                    {locale === 'ar' ? faq.qAr : faq.qEn}
                  </div>
                  <p className="text-[0.84rem] text-[#64748B] dark:text-[#B8C7D9] leading-[1.75] mt-1">
                    {locale === 'ar' ? faq.aAr : faq.aEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (section === 'entities') {
      return (
        <div className="space-y-4">
          <h3 className="text-[1.25rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
            {locale === 'ar' ? 'شراكات الجهات وبرامج التدريب المؤسسي' : 'Institutional Training Partnerships'}
          </h3>
          <p className="text-[#64748B] dark:text-[#B8C7D9] leading-[1.85] text-[0.95rem]">
            {locale === 'ar'
              ? 'يتعاون معهد البحوث والاستشارات بجامعة تبوك مع الجهات في القطاعين العام والخاص لتصميم وتنفيذ مسارات دبلوم وتدريب متخصصة لمنسوبيها بما يتوافق مع أهدافها التشغيلية.'
              : 'The Research and Consulting Institute at University of Tabuk partners with public and private organizations to coordinate structured diploma and specialized training tracks for their teams.'}
          </p>
          <button
            type="button"
            onClick={() => onSwitchModal({ type: 'info', section: 'contact' })}
            className="inline-flex items-center justify-center rounded-[10px] px-[22px] py-[10px] font-bold text-[0.92rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
          >
            {locale === 'ar' ? 'تواصل لتنسيق شراكة تدريبية' : 'Contact Us for Partnerships'}
          </button>
        </div>
      );
    }

    if (section === 'letters') {
      return (
        <div className="space-y-4">
          <h3 className="text-[1.25rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
            {locale === 'ar' ? 'خطابات التعريف وإفادة الدراسة' : 'Enrollment & Study Verification Letters'}
          </h3>
          <p className="text-[#64748B] dark:text-[#B8C7D9] leading-[1.85] text-[0.95rem]">
            {locale === 'ar'
              ? 'تتيح المنصة للطلبة المسجلين إصدار خطاب تعريف وإفادة انتظام أو تخرج موثّقة إلكترونيًا لتقديمها إلى جهات العمل أو الجهات المعنية بكل يسر.'
              : 'Enrolled students can electronically request official enrollment, attendance, or graduation verification letters via their student portal account.'}
          </p>
          <button
            type="button"
            onClick={() => onSwitchModal({ type: 'auth', mode: 'login' })}
            className="inline-flex items-center justify-center rounded-[10px] px-[22px] py-[10px] font-bold text-[0.92rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
          >
            {locale === 'ar' ? 'دخول الطلاب لطلب الإفادة' : 'Student Sign In to Request'}
          </button>
        </div>
      );
    }

    if (section === 'policy') {
      return (
        <div className="space-y-4">
          <h3 className="text-[1.25rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
            {locale === 'ar' ? 'السياسات الأكاديمية والخصوصية' : 'Academic Policies & Privacy'}
          </h3>
          <ul className="space-y-2.5 text-[0.92rem] text-[#64748B] dark:text-[#B8C7D9] list-disc ps-5 leading-[1.8]">
            <li>
              {locale === 'ar'
                ? 'تُقدّم جميع برامج الدبلوم المشارك المهني عن بُعد بنظام التعليم المتزامن المسائي وفق تقويم دراسي واضح.'
                : 'All professional associate diplomas are delivered online via evening synchronous sessions on an organized academic calendar.'}
            </li>
            <li>
              {locale === 'ar'
                ? 'تشمل الرسوم الدراسية المعلنة (6,500 ر.س) ضريبة القيمة المضافة، وتُطبّق اللوائح المعتمدة لدى معهد البحوث والاستشارات بجامعة تبوك.'
                : 'Listed tuition fees (6,500 SAR) include VAT and are governed by Research and Consulting Institute regulations at University of Tabuk.'}
            </li>
            <li>
              {locale === 'ar'
                ? 'تُستخدم ملفات تعريف الارتباط لحفظ إعدادات اللغة وتيسير تجربة التصفح للطالب فقط.'
                : 'Cookies are used solely to preserve language preferences and support smooth student navigation.'}
            </li>
          </ul>
        </div>
      );
    }

    if (section === 'lms') {
      return (
        <div className="space-y-4">
          <h3 className="text-[1.25rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
            {locale === 'ar' ? 'بوابة التعلّم للطلاب (LMS)' : 'Student Learning Portal (LMS)'}
          </h3>
          <p className="text-[#64748B] dark:text-[#B8C7D9] leading-[1.85] text-[0.95rem]">
            {locale === 'ar'
              ? 'ادخل بحساب الطالب الخاص بك للوصول إلى القاعات الافتراضية، متابعة المحاضرات المسائية المسجلة، تسليم الأنشطة والواجبات، واستعراض جدول الاختبارات.'
              : 'Sign in with your student account to join virtual classrooms, review recorded lectures, submit coursework assignments, and check assessment schedules.'}
          </p>
          <button
            type="button"
            onClick={() => onSwitchModal({ type: 'auth', mode: 'login' })}
            className="inline-flex items-center justify-center rounded-[10px] px-[22px] py-[10px] font-bold text-[0.92rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
          >
            {locale === 'ar' ? 'الدخول إلى حساب الطالب' : 'Go to Student Sign In'}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-[1.25rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
          {locale === 'ar' ? 'الإرشاد والدعم الطلابي — تواصل معنا' : 'Student Support & Guidance — Contact Us'}
        </h3>
        <div className="flex flex-wrap gap-4 text-[0.9rem] text-[#183247] dark:text-[#F1F5F9] bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[12px] p-4">
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
            <span dir="ltr">+966 54 650 5679</span>
          </span>
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
            <span dir="ltr">014 456 3710</span>
          </span>
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
            <span dir="ltr">irc-programs@ut.edu.sa</span>
          </span>
        </div>

        {submittedMsg ? (
          <div className="bg-[#E7F5EE] dark:bg-[#102E24] border border-[#1F8A5B]/30 dark:border-[#2ECC71]/35 text-[#1F8A5B] dark:text-[#6EE7B7] rounded-[12px] p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-none mt-0.5" aria-hidden="true" />
            <p className="text-[0.92rem] font-semibold">{submittedMsg}</p>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, 'contact')} className="space-y-3">
            {formError && (
              <p className="text-[#C0392B] dark:text-[#FCA5A5] text-[0.86rem] font-semibold">{formError}</p>
            )}
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={locale === 'ar' ? 'رقم الجوال (05XXXXXXXX)' : 'Mobile Number'}
                className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
              />
            </div>
            <button
              type="submit"
              className="w-full h-[46px] rounded-[10px] bg-[#176B87] text-white font-bold text-[0.95rem] hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
            >
              {locale === 'ar' ? 'إرسال الاستفسار' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#0E223D]/65 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[18px] shadow-[0_22px_54px_rgba(20,45,78,0.25)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.55)] w-full max-w-[680px] max-h-[90vh] overflow-y-auto relative">
        <button
          type="button"
          onClick={onClose}
          aria-label={locale === 'ar' ? 'إغلاق' : 'Close'}
          className="absolute top-4 end-4 z-10 w-9 h-9 rounded-[10px] bg-white/95 border border-[#DCE7ED] text-[#183247] dark:bg-[#102238]/90 dark:border-white/15 dark:text-[#F1F5F9] grid place-items-center hover:border-[#28B5C5] hover:text-[#176B87] dark:hover:text-[#28B5C5] cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {modal.type === 'program' && (
          <div>
            <div className="relative h-[220px] bg-[#142D4E] overflow-hidden border-b-2 border-[#28B5C5]">
              <img
                src={modal.program.image}
                alt={locale === 'ar' ? modal.program.titleAr : modal.program.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(20,45,78,0.14), rgba(20,45,78,0.78))',
                }}
              />
              <div className="absolute bottom-4 inset-x-6 text-white">
                <span className="inline-block bg-[#DDF3F5]/95 text-[#142D4E] rounded-[6px] px-3 py-0.5 text-[0.72rem] font-bold mb-2">
                  {locale === 'ar' ? modal.program.badgeAr : modal.program.badgeEn}
                </span>
                <h2 className="text-[1.35rem] font-bold leading-snug">
                  {locale === 'ar' ? modal.program.titleAr : modal.program.titleEn}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex gap-2 border-b border-[#DCE7ED] dark:border-white/12 pb-3">
                <button
                  type="button"
                  onClick={() =>
                    onSwitchModal({ type: 'program', program: modal.program, tab: 'details' })
                  }
                  className={`px-4 py-2 rounded-[8px] text-[0.88rem] font-bold cursor-pointer transition-colors ${
                    modal.tab === 'details'
                      ? 'bg-[#142D4E] text-white dark:bg-[#28B5C5] dark:text-[#0B1726]'
                      : 'bg-[#EAF3F6] text-[#64748B] hover:text-[#142D4E] dark:bg-[#102238] dark:text-[#B8C7D9] dark:hover:text-[#F1F5F9]'
                  }`}
                >
                  {locale === 'ar' ? 'تفاصيل الدورة' : 'Course Details'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onSwitchModal({ type: 'program', program: modal.program, tab: 'register' })
                  }
                  className={`px-4 py-2 rounded-[8px] text-[0.88rem] font-bold cursor-pointer transition-colors ${
                    modal.tab === 'register'
                      ? 'bg-[#176B87] text-white dark:bg-[#28B5C5] dark:text-[#0B1726]'
                      : 'bg-[#EAF3F6] text-[#64748B] hover:text-[#142D4E] dark:bg-[#102238] dark:text-[#B8C7D9] dark:hover:text-[#F1F5F9]'
                  }`}
                >
                  {locale === 'ar' ? 'التسجيل في الدورة' : 'Enroll in Course'}
                </button>
              </div>

              {modal.tab === 'details' ? (
                <div className="space-y-4">
                  <p className="text-[#64748B] dark:text-[#B8C7D9] text-[0.95rem] leading-[1.9]">
                    {locale === 'ar' ? modal.program.descriptionAr : modal.program.descriptionEn}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="flex items-center gap-2.5 bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[10px] p-3 text-[0.82rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                      <Clock className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5] flex-none" aria-hidden="true" />
                      <span>{locale === 'ar' ? modal.program.durationAr : modal.program.durationEn}</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[10px] p-3 text-[0.82rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                      <BookOpen className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5] flex-none" aria-hidden="true" />
                      <span>{locale === 'ar' ? modal.program.creditsAr : modal.program.creditsEn}</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[10px] p-3 text-[0.82rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                      <GraduationCap className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5] flex-none" aria-hidden="true" />
                      <span>
                        {locale === 'ar'
                          ? modal.program.accreditationAr
                          : modal.program.accreditationEn}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#142D4E] dark:text-[#F1F5F9] text-[0.95rem] mb-2">
                      {locale === 'ar' ? 'المحاور الدراسية للدورة' : 'Core Course Modules'}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(locale === 'ar' ? modal.program.modulesAr : modal.program.modulesEn).map(
                        (mod) => (
                          <li
                            key={mod}
                            className="flex items-center gap-2 text-[0.86rem] text-[#183247] dark:text-[#F1F5F9] bg-[#EAF3F6] dark:bg-[#1B3553] rounded-[8px] px-3 py-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#1F8A5B] dark:text-[#28B5C5] flex-none" aria-hidden="true" />
                            <span>{mod}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="bg-[#F8FBFD] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[10px] px-3.5 py-2.5 text-[0.85rem] text-[#4B6178] dark:text-[#B8C7D9]">
                    <span className="font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                      {locale === 'ar' ? 'الفئة المستهدفة: ' : 'Who This Course Is For: '}
                    </span>
                    <span>
                      {locale === 'ar' ? modal.program.targetAudienceAr : modal.program.targetAudienceEn}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[12px] p-4 flex-wrap">
                    <div>
                      <div className="num text-[1.4rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                        {modal.program.price.toLocaleString('en-US')}{' '}
                        {locale === 'ar' ? modal.program.currencyAr : modal.program.currencyEn}
                      </div>
                      <div className="text-[0.76rem] text-[#64748B] dark:text-[#B8C7D9] font-semibold">
                        {locale === 'ar'
                          ? 'شامل الضريبة · متاح السداد الكامل أو بالتقسيط'
                          : 'VAT Included · Full payment or installments available'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onSwitchModal({ type: 'program', program: modal.program, tab: 'register' })
                      }
                      className="rounded-[10px] px-6 py-2.5 bg-[#176B87] text-white font-bold text-[0.92rem] hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                    >
                      {locale === 'ar' ? 'التسجيل في الدورة' : 'Enroll in Course'}
                    </button>
                  </div>
                </div>
              ) : submittedMsg ? (
                <div className="bg-[#E7F5EE] dark:bg-[#102E24] border border-[#1F8A5B]/30 dark:border-[#2ECC71]/35 text-[#1F8A5B] dark:text-[#6EE7B7] rounded-[12px] p-5 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-none mt-0.5" aria-hidden="true" />
                  <p className="text-[0.95rem] font-semibold leading-relaxed">{submittedMsg}</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmit(e, 'program-register')} className="space-y-3.5">
                  {formError && (
                    <p className="text-[#C0392B] dark:text-[#FCA5A5] text-[0.86rem] font-semibold">{formError}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={locale === 'ar' ? 'الاسم الرباعي' : 'Full Name'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
                    />
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder={locale === 'ar' ? 'رقم الهوية الوطنية / الإقامة' : 'National ID / Iqama'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={locale === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('full')}
                      className={`flex-1 py-2.5 px-3 rounded-[10px] border text-[0.86rem] font-bold cursor-pointer ${
                        paymentPlan === 'full'
                          ? 'border-[#176B87] bg-[#DDF3F5] text-[#142D4E] dark:border-[#28B5C5] dark:bg-[#1B3553] dark:text-[#F1F5F9]'
                          : 'border-[#DCE7ED] bg-white text-[#64748B] dark:border-white/12 dark:bg-[#102238] dark:text-[#B8C7D9]'
                      }`}
                    >
                      {locale === 'ar' ? 'سداد كامل (6,500 ر.س)' : 'Full Payment (6,500 SAR)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('installments')}
                      className={`flex-1 py-2.5 px-3 rounded-[10px] border text-[0.86rem] font-bold cursor-pointer ${
                        paymentPlan === 'installments'
                          ? 'border-[#176B87] bg-[#DDF3F5] text-[#142D4E] dark:border-[#28B5C5] dark:bg-[#1B3553] dark:text-[#F1F5F9]'
                          : 'border-[#DCE7ED] bg-white text-[#64748B] dark:border-white/12 dark:bg-[#102238] dark:text-[#B8C7D9]'
                      }`}
                    >
                      {locale === 'ar' ? 'نظام التقسيط الشهري' : 'Monthly Installments'}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-[48px] rounded-[10px] bg-[#176B87] text-white font-bold text-[0.95rem] hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                  >
                    {locale === 'ar' ? 'تأكيد طلب التسجيل' : 'Confirm Enrollment Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {modal.type === 'auth' && (
          <div className="p-6 space-y-5">
            <div>
              <h3 className="text-[1.3rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                {modal.mode === 'login'
                  ? locale === 'ar'
                    ? 'دخول الطلاب إلى المنصة'
                    : 'Student Portal Sign In'
                  : locale === 'ar'
                    ? 'إنشاء حساب طالب جديد'
                    : 'Create Student Account'}
              </h3>
              <p className="text-[#64748B] dark:text-[#B8C7D9] text-[0.9rem] mt-1">
                {locale === 'ar'
                  ? 'منصة التعلّم الرقمي — معهد البحوث والاستشارات، جامعة تبوك'
                  : 'Digital Learning Platform — Research & Consulting Institute, University of Tabuk'}
              </p>
            </div>

            {submittedMsg ? (
              <div className="bg-[#E7F5EE] dark:bg-[#102E24] border border-[#1F8A5B]/30 dark:border-[#2ECC71]/35 text-[#1F8A5B] dark:text-[#6EE7B7] rounded-[12px] p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-none mt-0.5" aria-hidden="true" />
                <p className="text-[0.92rem] font-semibold">{submittedMsg}</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => handleSubmit(e, modal.mode === 'login' ? 'login' : 'register')}
                className="space-y-3.5"
              >
                {formError && (
                  <p className="text-[#C0392B] dark:text-[#FCA5A5] text-[0.86rem] font-semibold">{formError}</p>
                )}

                {modal.mode === 'register' && (
                  <>
                    <select
                      value={selectedProgramId}
                      onChange={(e) => setSelectedProgramId(e.target.value)}
                      aria-label={locale === 'ar' ? 'الدورة المطلوبة' : 'Desired Course'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
                    >
                      {PROGRAMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {locale === 'ar' ? p.titleAr : p.titleEn}
                        </option>
                      ))}
                    </select>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                        className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
                      />
                      <input
                        type="text"
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        placeholder={locale === 'ar' ? 'رقم الهوية الوطنية / الإقامة' : 'National ID'}
                        className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
                      />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={locale === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
                    />
                  </>
                )}

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
                />

                {modal.mode === 'login' && (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={locale === 'ar' ? 'كلمة المرور' : 'Password'}
                    className="w-full h-[46px] px-4 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#176B87] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:bg-[#102238] dark:focus:border-[#28B5C5]"
                  />
                )}

                <button
                  type="submit"
                  className="w-full h-[48px] rounded-[10px] bg-[#176B87] text-white font-bold text-[0.95rem] hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                >
                  {modal.mode === 'login'
                    ? locale === 'ar'
                      ? 'دخول إلى المنصة'
                      : 'Sign In to Platform'
                    : locale === 'ar'
                      ? 'إنشاء حساب الطالب'
                      : 'Create Student Account'}
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-[#DCE7ED] dark:border-white/12 text-center text-[0.88rem] text-[#64748B] dark:text-[#B8C7D9]">
              {modal.mode === 'login' ? (
                <button
                  type="button"
                  onClick={() => onSwitchModal({ type: 'auth', mode: 'register' })}
                  className="text-[#176B87] dark:text-[#28B5C5] font-bold hover:underline cursor-pointer"
                >
                  {locale === 'ar' ? 'طالب جديد؟ أنشئ حسابك الآن' : 'New student? Create an account'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSwitchModal({ type: 'auth', mode: 'login' })}
                  className="text-[#176B87] dark:text-[#28B5C5] font-bold hover:underline cursor-pointer"
                >
                  {locale === 'ar' ? 'لديك حساب بالفعل؟ سجّل الدخول' : 'Already enrolled? Sign in'}
                </button>
              )}
            </div>
          </div>
        )}

        {modal.type === 'info' && <div className="p-6">{renderInfoBody(modal.section)}</div>}
      </div>
    </div>
  );
}
