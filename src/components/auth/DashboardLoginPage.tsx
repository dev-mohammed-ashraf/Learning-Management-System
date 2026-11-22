import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Info,
  ShieldCheck,
} from 'lucide-react';
import type { Locale } from '../../types/program';
import { DEMO_ADMIN_ACCOUNT, DEMO_COMPANY_ACCOUNT } from '../../data/adminData';
import type { DashboardRole } from '../../utils/dashboardAuth';
import { adminBtnClass, adminFieldClass } from '../admin/AdminUI';
import { BrandLogo } from '../common/BrandLogo';

interface DashboardLoginPageProps {
  locale: Locale;
  /** Verifies the demo credentials, starts the session, and navigates. Returns false on failure. */
  onAuthenticate: (role: DashboardRole, email: string, password: string) => boolean;
  onBackToSite: () => void;
}

interface AccountTypeInfo {
  id: DashboardRole;
  labelAr: string;
  labelEn: string;
  hintAr: string;
  hintEn: string;
  email: string;
  password: string;
}

/** Demo credentials per account type — auto-filled and swapped on selection.
 * Both entries read from the shared demo-account constants (single source of
 * truth), so the form always matches what the auth layer validates against. */
const ACCOUNT_TYPES: AccountTypeInfo[] = [
  {
    id: 'admin',
    labelAr: 'أدمن',
    labelEn: 'Admin',
    hintAr: 'إدارة المنصة بالكامل',
    hintEn: 'Full platform management',
    email: DEMO_ADMIN_ACCOUNT.email,
    password: DEMO_ADMIN_ACCOUNT.password,
  },
  {
    id: 'company',
    labelAr: 'صاحب شركة',
    labelEn: 'Company Owner',
    hintAr: 'متابعة طلاب الشركة',
    hintEn: 'Manage company students',
    email: DEMO_COMPANY_ACCOUNT.email,
    password: DEMO_COMPANY_ACCOUNT.password,
  },
];

/**
 * Dedicated dashboard login page (/dashboard/login) — the single entry point
 * for Admin and Company accounts. Students keep using the existing portal
 * sign-in and are intentionally not offered here.
 */
export function DashboardLoginPage({
  locale,
  onAuthenticate,
  onBackToSite,
}: DashboardLoginPageProps) {
  const isAr = locale === 'ar';
  const [role, setRole] = useState<DashboardRole>('admin');
  const [email, setEmail] = useState(ACCOUNT_TYPES[0].email);
  const [password, setPassword] = useState(ACCOUNT_TYPES[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  const selectRole = (next: DashboardRole) => {
    setRole(next);
    setError('');
    // Auto-fill the matching demo credentials when switching account types.
    const info = ACCOUNT_TYPES.find((item) => item.id === next);
    if (info) {
      setEmail(info.email);
      setPassword(info.password);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(
        isAr
          ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور.'
          : 'Please enter your email and password.'
      );
      return;
    }
    const ok = onAuthenticate(role, email, password);
    if (!ok) {
      setError(
        isAr
          ? 'بيانات الدخول غير صحيحة لهذا النوع من الحسابات. تحقق من البيانات التجريبية وحاول مجددًا.'
          : 'Invalid credentials for the selected account type. Check the demo credentials and try again.'
      );
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F4F8FA] px-4 py-10 dark:bg-[#0B1726]">
      {/* Brand backdrop accents (subtle, matches the Madaar identity) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[180px] start-[-140px] h-[380px] w-[380px] rounded-full bg-[#28B5C5]/10 blur-[90px] dark:bg-[#28B5C5]/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[200px] end-[-160px] h-[420px] w-[420px] rounded-full bg-[#176B87]/10 blur-[100px] dark:bg-[#176B87]/20"
      />

      <div className="relative z-10 w-full max-w-[460px]">
        <div className="mb-5 flex flex-col items-center gap-2">
          <BrandLogo locale={locale} variant="full" size="md" />
          <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#DDF3F5] px-2.5 py-1 text-[0.7rem] font-bold text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {isAr ? 'بوابة لوحات التحكم' : 'Dashboard Gateway'}
          </span>
        </div>

        <div className="rounded-[18px] border border-[#DCE7ED] bg-white p-6 shadow-[0_22px_54px_rgba(20,45,78,0.18)] sm:p-7 dark:border-white/12 dark:bg-[#142D4E] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
          <h1 className="text-center text-[1.2rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? 'دخول لوحة التحكم' : 'Dashboard Sign In'}
          </h1>
          <p className="mt-1 text-center text-[0.82rem] text-[#64748B] dark:text-[#B8C7D9]">
            {isAr
              ? 'اختر نوع الحساب ثم استخدم بيانات الدخول التجريبية.'
              : 'Choose your account type, then use the demo credentials.'}
          </p>

          {/* Account type selector — Admin / Company (students use the portal sign-in) */}
          <div
            role="radiogroup"
            aria-label={isAr ? 'نوع الحساب' : 'Account type'}
            className="mt-5 grid grid-cols-2 gap-2"
          >
            {ACCOUNT_TYPES.map((info) => {
              const selected = role === info.id;
              return (
                <button
                  key={info.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selectRole(info.id)}
                  className={`flex cursor-pointer flex-col items-center gap-1 rounded-[12px] border px-3 py-3 text-center transition-all ${
                    selected
                      ? 'border-[#176B87] bg-[#DDF3F5] shadow-[0_6px_18px_rgba(23,107,135,0.22)] dark:border-[#28B5C5] dark:bg-[#1B3553]'
                      : 'border-[#DCE7ED] bg-[#EAF3F6] hover:border-[#28B5C5] dark:border-white/12 dark:bg-[#102238] dark:hover:border-[#28B5C5]'
                  }`}
                >
                  {info.id === 'admin' ? (
                    <ShieldCheck
                      className={`h-5 w-5 ${selected ? 'text-[#176B87] dark:text-[#28B5C5]' : 'text-[#94A3B8]'}`}
                      aria-hidden="true"
                    />
                  ) : (
                    <Building2
                      className={`h-5 w-5 ${selected ? 'text-[#176B87] dark:text-[#28B5C5]' : 'text-[#94A3B8]'}`}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`text-[0.88rem] font-extrabold ${
                      selected
                        ? 'text-[#142D4E] dark:text-[#F1F5F9]'
                        : 'text-[#64748B] dark:text-[#B8C7D9]'
                    }`}
                  >
                    {isAr ? info.labelAr : info.labelEn}
                  </span>
                  <span className="text-[0.68rem] font-semibold text-[#94A3B8] dark:text-[#7E93A9]">
                    {isAr ? info.hintAr : info.hintEn}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            {error && (
              <p
                role="alert"
                className="rounded-[10px] border border-[#C0392B]/35 bg-[#FCEBE9] px-3 py-2 text-[0.8rem] font-bold text-[#C0392B] dark:border-[#FCA5A5]/30 dark:bg-[#331411] dark:text-[#FCA5A5]"
              >
                {error}
              </p>
            )}

            <label className="block space-y-[6px]">
              <span className="block text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={adminFieldClass}
                dir="ltr"
                autoComplete="username"
              />
            </label>

            <label className="block space-y-[6px]">
              <span className="block text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                {isAr ? 'كلمة المرور' : 'Password'}
              </span>
              {/* LTR wrapper: the password field is Latin text, so the eye toggle
                  and its reserved padding must both anchor to the physical right
                  side in both locales (an inherited RTL would mirror `end-2`
                  onto the typed text). */}
              <span className="relative block" dir="ltr">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={`${adminFieldClass} pe-10`}
                  dir="ltr"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={isAr ? 'إظهار كلمة المرور' : 'Show password'}
                  className="absolute top-1/2 end-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-[8px] text-[#94A3B8] hover:text-[#176B87] dark:hover:text-[#28B5C5] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </span>
            </label>

            <button type="submit" className={`${adminBtnClass('primary', 'md')} w-full`}>
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          </form>

          {/* Demo notice */}
          <p className="mt-4 flex items-start gap-2 rounded-[10px] bg-[#EAF3F6] px-3 py-2.5 text-[0.74rem] font-semibold leading-relaxed text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
            <Info
              className="mt-0.5 h-3.5 w-3.5 flex-none text-[#176B87] dark:text-[#28B5C5]"
              aria-hidden="true"
            />
            {isAr
              ? 'بيئة تجريبية: الحسابات مؤقتة ببيانات معبأة مسبقًا لأغراض العرض فقط — لا توجد قاعدة بيانات حقيقية.'
              : 'Demo environment: these are temporary demo accounts pre-filled for presentation only — no real database.'}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-[#64748B] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:text-[#28B5C5] cursor-pointer"
          >
            <BackArrow className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'العودة إلى الموقع' : 'Back to Site'}
          </button>
        </div>
      </div>
    </div>
  );
}
