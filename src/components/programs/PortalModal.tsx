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
            ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور.'
            : 'Please enter your email and password.'
        );
        return;
      }
      setSubmittedMsg(
        locale === 'ar'
          ? 'تم التحقق من بيانات الدخول. جارٍ تحويلك إلى بوابة المتدرب في معهد البحوث والاستشارات.'
          : 'Credentials verified. Redirecting to the Research and Consulting Institute learner portal.'
      );
      return;
    }

    if (mode === 'contact') {
      if (!fullName.trim() || !phone.trim() || !email.trim()) {
        setFormError(
          locale === 'ar'
            ? 'يرجى تعبئة الاسم ورقم الجوال والبريد الإلكتروني.'
            : 'Please fill in your full name, phone number, and email.'
        );
        return;
      }
      setSubmittedMsg(
        locale === 'ar'
          ? 'تم استلام رسالتك بنجاح، وسيتواصل معك فريق القبول والاستفسارات خلال ساعات العمل الرسمية.'
          : 'Your inquiry has been received. Our admissions team will contact you during official working hours.'
      );
      return;
    }

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError(
        locale === 'ar'
          ? 'يرجى استكمال جميع الحقول المطلوبة للتسجيل.'
          : 'Please complete all required registration fields.'
      );
      return;
    }
    if (nationalId.trim().length < 8) {
      setFormError(
        locale === 'ar'
          ? 'يرجى إدخال رقم الهوية الوطنية أو الإقامة بشكل صحيح.'
          : 'Please enter a valid National ID or Iqama number.'
      );
      return;
    }

    const chosen = PROGRAMS.find((p) => p.id === selectedProgramId);
    const chosenTitle = chosen ? (locale === 'ar' ? chosen.titleAr : chosen.titleEn) : '';
    setSubmittedMsg(
      locale === 'ar'
        ? `تم تسجيل طلب الالتحاق المبدئي في "${chosenTitle}" بنجاح (${paymentPlan === 'full' ? 'سداد كامل' : 'نظام التقسيط'}). تم إرسال تفاصيل الفاتورة إلى بريدك الإلكتروني.`
        : `Initial enrollment submitted for "${chosenTitle}" (${paymentPlan === 'full' ? 'Full Payment' : 'Installments'}). Payment details were sent to your email.`
    );
  };

  const renderInfoBody = (section: Extract<ModalState, { type: 'info' }>['section']) => {
    if (section === 'about' || section === 'entities') {
      return (
        <div className="space-y-4">
          <h3 className="text-[1.25rem] font-bold text-[#0C3B61]">
            {locale === 'ar'
              ? section === 'entities'
                ? 'خدمات الجهات والشراكات المؤسسية'
                : 'عن معهد البحوث والاستشارات — جامعة تبوك'
              : section === 'entities'
                ? 'Corporate & Institutional Services'
                : 'About the Research and Consulting Institute — University of Tabuk'}
          </h3>
          <p className="text-[#5E7489] leading-[1.85] text-[0.95rem]">
            {locale === 'ar'
              ? 'يقدّم معهد البحوث والاستشارات بجامعة تبوك منذ عام 2006م برامج الدبلومات المهنية المعتمدة والاستشارات الأكاديمية والتدريبية المصممة وفق احتياجات سوق العمل ورؤية السعودية 2030، بإشراف واعتماد المركز الوطني للتعليم الإلكتروني ووزارة التعليم.'
              : 'Since 2006, the Research and Consulting Institute at the University of Tabuk has delivered accredited professional diplomas and specialized training aligned with Saudi Vision 2030 and supervised by NELC and the Ministry of Education.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#F5F8FB] border border-[#E3EAF1] rounded-[12px] p-4">
              <div className="font-bold text-[#0C3B61] text-[0.95rem]">
                {locale === 'ar' ? 'برامج معتمدة عن بُعد' : 'Accredited Online Diplomas'}
              </div>
              <p className="text-[0.84rem] text-[#5E7489] mt-1">
                {locale === 'ar'
                  ? '30 ساعة معتمدة بدراسة مسائية مرنة تناسب الموظفين والخريجين.'
                  : '30 credit hours with flexible evening schedules suited for working learners.'}
              </p>
            </div>
            <div className="bg-[#F5F8FB] border border-[#E3EAF1] rounded-[12px] p-4">
              <div className="font-bold text-[#0C3B61] text-[0.95rem]">
                {locale === 'ar' ? 'سداد مرن وتقسيط' : 'Flexible Payment & Installments'}
              </div>
              <p className="text-[0.84rem] text-[#5E7489] mt-1">
                {locale === 'ar'
                  ? 'سداد إلكتروني متكامل عبر بوابة مدفوعات جامعة تبوك.'
                  : 'Seamless online full or installment billing via University of Tabuk payment portal.'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (section === 'letters') {
      return (
        <div className="space-y-4">
          <h3 className="text-[1.25rem] font-bold text-[#0C3B61]">
            {locale === 'ar' ? 'خدمة إفادة جهة العمل' : 'Employer Verification Letters'}
          </h3>
          <p className="text-[#5E7489] leading-[1.85] text-[0.95rem]">
            {locale === 'ar'
              ? 'يمكن للمتدربين المسجلين في برامج الدبلومات استخراج خطاب تعريف وإفادة انتظام أو تخرج موثّقة لتقديمها لجهة العمل إلكترونيًا عبر بوابة المتدرب.'
              : 'Enrolled learners can request official attendance and enrollment verification letters electronically for submission to employers.'}
          </p>
          <button
            type="button"
            onClick={() => onSwitchModal({ type: 'auth', mode: 'login' })}
            className="inline-flex items-center justify-center rounded-[10px] px-[22px] py-[10px] font-bold text-[0.92rem] bg-[#1C5D92] text-white hover:bg-[#154A76] cursor-pointer"
          >
            {locale === 'ar' ? 'الدخول لطلب الإفادة' : 'Sign In to Request Letter'}
          </button>
        </div>
      );
    }

    if (section === 'policy') {
      return (
        <div className="space-y-4">
          <h3 className="text-[1.25rem] font-bold text-[#0C3B61]">
            {locale === 'ar' ? 'السياسات والأحكام والخصوصية' : 'Policies, Terms & Privacy'}
          </h3>
          <ul className="space-y-2.5 text-[0.92rem] text-[#5E7489] list-disc ps-5 leading-[1.8]">
            <li>
              {locale === 'ar'
                ? 'تُقدّم جميع برامج الدبلوم المشارك المهني عن بُعد بنظام التعليم المتزامن المسائي.'
                : 'All professional associate diplomas are delivered online via evening synchronous learning.'}
            </li>
            <li>
              {locale === 'ar'
                ? 'تشمل الرسوم الدراسية المعلنة (6,500 ر.س) ضريبة القيمة المضافة وتخضع سياسة الاسترداد للوائح معهد البحوث والاستشارات.'
                : 'Listed tuition fees (6,500 SAR) include VAT; refund rules follow Institute regulations.'}
            </li>
            <li>
              {locale === 'ar'
                ? 'تُستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وحفظ تفضيلات اللغة فقط.'
                : 'Cookies are used solely to improve navigation experience and preserve language preferences.'}
            </li>
          </ul>
        </div>
      );
    }

    if (section === 'lms') {
      return (
        <div className="space-y-4">
          <h3 className="text-[1.25rem] font-bold text-[#0C3B61]">
            {locale === 'ar' ? 'بوابة التعلم الإلكتروني' : 'Online Learning Portal'}
          </h3>
          <p className="text-[#5E7489] leading-[1.85] text-[0.95rem]">
            {locale === 'ar'
              ? 'سجّل الدخول بحسابك للوصول إلى القاعات الافتراضية، المحاضرات المسجلة، الواجبات، والاختبارات الفصلية.'
              : 'Sign in with your learner account to access virtual classrooms, recorded lectures, assignments, and exams.'}
          </p>
          <button
            type="button"
            onClick={() => onSwitchModal({ type: 'auth', mode: 'login' })}
            className="inline-flex items-center justify-center rounded-[10px] px-[22px] py-[10px] font-bold text-[0.92rem] bg-[#1C5D92] text-white hover:bg-[#154A76] cursor-pointer"
          >
            {locale === 'ar' ? 'الانتقال إلى تسجيل الدخول' : 'Proceed to Sign In'}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-[1.25rem] font-bold text-[#0C3B61]">
          {locale === 'ar' ? 'الدعم والاستفسارات — تواصل معنا' : 'Support & Inquiries — Contact Us'}
        </h3>
        <div className="flex flex-wrap gap-4 text-[0.9rem] text-[#12263A] bg-[#F5F8FB] border border-[#E3EAF1] rounded-[12px] p-4">
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#1C5D92]" aria-hidden="true" />
            <span dir="ltr">+966 54 650 5679</span>
          </span>
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#1C5D92]" aria-hidden="true" />
            <span dir="ltr">014 456 3710</span>
          </span>
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#1C5D92]" aria-hidden="true" />
            <span dir="ltr">irc-programs@ut.edu.sa</span>
          </span>
        </div>

        {submittedMsg ? (
          <div className="bg-[#E7F5EE] border border-[#1F8A5B]/30 text-[#1F8A5B] rounded-[12px] p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-none mt-0.5" aria-hidden="true" />
            <p className="text-[0.92rem] font-semibold">{submittedMsg}</p>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, 'contact')} className="space-y-3">
            {formError && (
              <p className="text-[#C0392B] text-[0.86rem] font-semibold">{formError}</p>
            )}
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={locale === 'ar' ? 'رقم الجوال (05XXXXXXXX)' : 'Mobile Number'}
                className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
              />
            </div>
            <button
              type="submit"
              className="w-full h-[46px] rounded-[10px] bg-[#1C5D92] text-white font-bold text-[0.95rem] hover:bg-[#154A76] cursor-pointer"
            >
              {locale === 'ar' ? 'إرسال الاستفسار' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#082640]/60 backdrop-blur-[2px] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-[#E3EAF1] rounded-[18px] shadow-[0_22px_54px_rgba(12,59,97,0.25)] w-full max-w-[680px] max-h-[90vh] overflow-y-auto relative">
        <button
          type="button"
          onClick={onClose}
          aria-label={locale === 'ar' ? 'إغلاق' : 'Close'}
          className="absolute top-4 end-4 z-10 w-9 h-9 rounded-[10px] bg-white/95 border border-[#E3EAF1] text-[#12263A] grid place-items-center hover:border-[#1C5D92] hover:text-[#1C5D92] cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {modal.type === 'program' && (
          <div>
            <div className="relative h-[220px] bg-[#0C3B61] overflow-hidden">
              <img
                src={modal.program.image}
                alt={locale === 'ar' ? modal.program.titleAr : modal.program.titleEn}
                className="w-full h-full object-cover object-[center_55%]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(12,59,97,0.12), rgba(12,59,97,0.72))',
                }}
              />
              <div className="absolute bottom-4 inset-x-6 text-white">
                <span className="inline-block bg-white/92 text-[#0C3B61] rounded-[6px] px-3 py-0.5 text-[0.72rem] font-bold mb-2">
                  {locale === 'ar' ? modal.program.badgeAr : modal.program.badgeEn}
                </span>
                <h2 className="text-[1.35rem] font-bold leading-snug">
                  {locale === 'ar' ? modal.program.titleAr : modal.program.titleEn}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex gap-2 border-b border-[#E3EAF1] pb-3">
                <button
                  type="button"
                  onClick={() =>
                    onSwitchModal({ type: 'program', program: modal.program, tab: 'details' })
                  }
                  className={`px-4 py-2 rounded-[8px] text-[0.88rem] font-bold cursor-pointer transition-colors ${
                    modal.tab === 'details'
                      ? 'bg-[#0C3B61] text-white'
                      : 'bg-[#F5F8FB] text-[#5E7489] hover:text-[#0C3B61]'
                  }`}
                >
                  {locale === 'ar' ? 'تفاصيل البرنامج' : 'Program Details'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onSwitchModal({ type: 'program', program: modal.program, tab: 'register' })
                  }
                  className={`px-4 py-2 rounded-[8px] text-[0.88rem] font-bold cursor-pointer transition-colors ${
                    modal.tab === 'register'
                      ? 'bg-[#1C5D92] text-white'
                      : 'bg-[#F5F8FB] text-[#5E7489] hover:text-[#0C3B61]'
                  }`}
                >
                  {locale === 'ar' ? 'التسجيل في البرنامج' : 'Enroll Now'}
                </button>
              </div>

              {modal.tab === 'details' ? (
                <div className="space-y-4">
                  <p className="text-[#5E7489] text-[0.95rem] leading-[1.9]">
                    {locale === 'ar' ? modal.program.descriptionAr : modal.program.descriptionEn}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="flex items-center gap-2.5 bg-[#F5F8FB] border border-[#E3EAF1] rounded-[10px] p-3 text-[0.82rem] font-bold text-[#12263A]">
                      <Clock className="w-4 h-4 text-[#1C5D92] flex-none" aria-hidden="true" />
                      <span>{locale === 'ar' ? modal.program.durationAr : modal.program.durationEn}</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#F5F8FB] border border-[#E3EAF1] rounded-[10px] p-3 text-[0.82rem] font-bold text-[#12263A]">
                      <BookOpen className="w-4 h-4 text-[#1C5D92] flex-none" aria-hidden="true" />
                      <span>{locale === 'ar' ? modal.program.creditsAr : modal.program.creditsEn}</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#F5F8FB] border border-[#E3EAF1] rounded-[10px] p-3 text-[0.82rem] font-bold text-[#12263A]">
                      <GraduationCap className="w-4 h-4 text-[#1C5D92] flex-none" aria-hidden="true" />
                      <span>
                        {locale === 'ar'
                          ? modal.program.accreditationAr
                          : modal.program.accreditationEn}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#0C3B61] text-[0.95rem] mb-2">
                      {locale === 'ar' ? 'أبرز المحاور التدريبية' : 'Core Curriculum Modules'}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(locale === 'ar' ? modal.program.modulesAr : modal.program.modulesEn).map(
                        (mod) => (
                          <li
                            key={mod}
                            className="flex items-center gap-2 text-[0.86rem] text-[#12263A] bg-[#F5F8FB] rounded-[8px] px-3 py-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#1F8A5B] flex-none" aria-hidden="true" />
                            <span>{mod}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between gap-4 bg-[#F5F8FB] border border-[#E3EAF1] rounded-[12px] p-4 flex-wrap">
                    <div>
                      <div className="num text-[1.4rem] font-bold text-[#0C3B61]">
                        {modal.program.price.toLocaleString('en-US')}{' '}
                        {locale === 'ar' ? modal.program.currencyAr : modal.program.currencyEn}
                      </div>
                      <div className="text-[0.76rem] text-[#5E7489] font-semibold">
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
                      className="rounded-[10px] px-6 py-2.5 bg-[#1C5D92] text-white font-bold text-[0.92rem] hover:bg-[#154A76] cursor-pointer"
                    >
                      {locale === 'ar' ? 'سجّل الآن' : 'Register Now'}
                    </button>
                  </div>
                </div>
              ) : submittedMsg ? (
                <div className="bg-[#E7F5EE] border border-[#1F8A5B]/30 text-[#1F8A5B] rounded-[12px] p-5 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-none mt-0.5" aria-hidden="true" />
                  <p className="text-[0.95rem] font-semibold leading-relaxed">{submittedMsg}</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmit(e, 'program-register')} className="space-y-3.5">
                  {formError && (
                    <p className="text-[#C0392B] text-[0.86rem] font-semibold">{formError}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={locale === 'ar' ? 'الاسم الرباعي' : 'Full Name'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
                    />
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder={locale === 'ar' ? 'رقم الهوية الوطنية / الإقامة' : 'National ID / Iqama'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={locale === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('full')}
                      className={`flex-1 py-2.5 px-3 rounded-[10px] border text-[0.86rem] font-bold cursor-pointer ${
                        paymentPlan === 'full'
                          ? 'border-[#1C5D92] bg-[#E8EEF4] text-[#0C3B61]'
                          : 'border-[#E3EAF1] bg-white text-[#5E7489]'
                      }`}
                    >
                      {locale === 'ar' ? 'سداد كامل (6,500 ر.س)' : 'Full Payment (6,500 SAR)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('installments')}
                      className={`flex-1 py-2.5 px-3 rounded-[10px] border text-[0.86rem] font-bold cursor-pointer ${
                        paymentPlan === 'installments'
                          ? 'border-[#1C5D92] bg-[#E8EEF4] text-[#0C3B61]'
                          : 'border-[#E3EAF1] bg-white text-[#5E7489]'
                      }`}
                    >
                      {locale === 'ar' ? 'نظام التقسيط الشهري' : 'Monthly Installments'}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-[48px] rounded-[10px] bg-[#1C5D92] text-white font-bold text-[0.95rem] hover:bg-[#154A76] cursor-pointer"
                  >
                    {locale === 'ar' ? 'إتمام التسجيل المبدئي' : 'Complete Initial Registration'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {modal.type === 'auth' && (
          <div className="p-6 space-y-5">
            <div>
              <h3 className="text-[1.3rem] font-bold text-[#0C3B61]">
                {modal.mode === 'login'
                  ? locale === 'ar'
                    ? 'تسجيل الدخول إلى المنصة'
                    : 'Sign In to Portal'
                  : locale === 'ar'
                    ? 'إنشاء حساب متدرب جديد'
                    : 'Create Learner Account'}
              </h3>
              <p className="text-[#5E7489] text-[0.9rem] mt-1">
                {locale === 'ar'
                  ? 'بوابة معهد البحوث والاستشارات — جامعة تبوك'
                  : 'Research and Consulting Institute — University of Tabuk'}
              </p>
            </div>

            {submittedMsg ? (
              <div className="bg-[#E7F5EE] border border-[#1F8A5B]/30 text-[#1F8A5B] rounded-[12px] p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-none mt-0.5" aria-hidden="true" />
                <p className="text-[0.92rem] font-semibold">{submittedMsg}</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => handleSubmit(e, modal.mode === 'login' ? 'login' : 'register')}
                className="space-y-3.5"
              >
                {formError && (
                  <p className="text-[#C0392B] text-[0.86rem] font-semibold">{formError}</p>
                )}

                {modal.mode === 'register' && (
                  <>
                    <select
                      value={selectedProgramId}
                      onChange={(e) => setSelectedProgramId(e.target.value)}
                      aria-label={locale === 'ar' ? 'البرنامج المطلوب' : 'Desired Program'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] font-bold text-[#12263A]"
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
                        className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
                      />
                      <input
                        type="text"
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        placeholder={locale === 'ar' ? 'رقم الهوية الوطنية / الإقامة' : 'National ID'}
                        className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
                      />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={locale === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
                      className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
                    />
                  </>
                )}

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
                />

                {modal.mode === 'login' && (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={locale === 'ar' ? 'كلمة المرور' : 'Password'}
                    className="w-full h-[46px] px-4 rounded-[10px] border border-[#E3EAF1] bg-[#F5F8FB] focus:bg-white focus:outline-none focus:border-[#1C5D92]"
                  />
                )}

                <button
                  type="submit"
                  className="w-full h-[48px] rounded-[10px] bg-[#1C5D92] text-white font-bold text-[0.95rem] hover:bg-[#154A76] cursor-pointer"
                >
                  {modal.mode === 'login'
                    ? locale === 'ar'
                      ? 'تسجيل الدخول'
                      : 'Sign In'
                    : locale === 'ar'
                      ? 'إنشاء الحساب والمتابعة'
                      : 'Create Account & Continue'}
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-[#E3EAF1] text-center text-[0.88rem] text-[#5E7489]">
              {modal.mode === 'login' ? (
                <button
                  type="button"
                  onClick={() => onSwitchModal({ type: 'auth', mode: 'register' })}
                  className="text-[#1C5D92] font-bold hover:underline cursor-pointer"
                >
                  {locale === 'ar' ? 'ليس لديك حساب؟ سجّل الآن' : "Don't have an account? Register now"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSwitchModal({ type: 'auth', mode: 'login' })}
                  className="text-[#1C5D92] font-bold hover:underline cursor-pointer"
                >
                  {locale === 'ar' ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Sign in'}
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
