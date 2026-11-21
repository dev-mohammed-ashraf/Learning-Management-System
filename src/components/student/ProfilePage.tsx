import { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Info,
  LogOut,
  Moon,
  Orbit,
  Settings,
  Sun,
  UserRound,
} from 'lucide-react';
import type { Locale, Program } from '../../types/program';
import type {
  StudentAccount,
  StudentPlatformState,
  StudentPreferences,
} from '../../types/student';
import { computeCourseProgressPct } from '../../utils/studentPlatform';
import type { Theme } from '../../utils/theme';
import { PageHeroBanner } from '../common/PageHeroBanner';

interface ProfilePageProps {
  locale: Locale;
  theme: Theme;
  state: StudentPlatformState;
  programs: Program[];
  onGoHome: () => void;
  onToggleLocale: () => void;
  onToggleTheme: () => void;
  onSaveProfile: (
    accountPatch: Partial<Pick<StudentAccount, 'fullName' | 'email' | 'phone' | 'avatarId'>>,
    preferencesPatch: Partial<StudentPreferences>
  ) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSignOut: () => void;
  onOpenProgram: (program: Program, tab?: 'details' | 'register') => void;
}

const AVATAR_OPTIONS: {
  id: StudentAccount['avatarId'];
  labelAr: string;
  labelEn: string;
  icon: typeof Orbit;
}[] = [
  { id: 'orbit', labelAr: 'مدار', labelEn: 'Orbit', icon: Orbit },
  { id: 'compass', labelAr: 'بوصلة', labelEn: 'Compass', icon: Compass },
  { id: 'book', labelAr: 'كتاب', labelEn: 'Book', icon: BookOpen },
  { id: 'award', labelAr: 'إنجاز', labelEn: 'Achievement', icon: Award },
];

export function ProfilePage({
  locale,
  theme,
  state,
  programs,
  onToggleLocale,
  onToggleTheme,
  onSaveProfile,
  onOpenAuth,
  onSignOut,
  onOpenProgram,
}: ProfilePageProps) {
  const [fullName, setFullName] = useState(state.account.fullName);
  const [email, setEmail] = useState(state.account.email);
  const [phone, setPhone] = useState(state.account.phone);
  const [avatarId, setAvatarId] = useState<StudentAccount['avatarId']>(state.account.avatarId);
  const [reminderCadence, setReminderCadence] = useState(state.preferences.reminderCadence);
  const [preferredStudyTime, setPreferredStudyTime] = useState(
    state.preferences.preferredStudyTime
  );
  const [savedNotice, setSavedNotice] = useState(false);

  const enrolledPrograms = programs.filter((p) => Boolean(state.enrollments[p.id]));
  const completedPrograms = enrolledPrograms.filter(
    (p) => state.enrollments[p.id]?.status === 'completed'
  );

  const ActiveAvatar =
    AVATAR_OPTIONS.find((a) => a.id === avatarId)?.icon ?? UserRound;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(
      { fullName, email, phone, avatarId },
      { reminderCadence, preferredStudyTime }
    );
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div>
      <PageHeroBanner
        locale={locale}
        eyebrowAr="إعدادات الحساب والتعلّم"
        eyebrowEn="Account & Study Preferences"
        titleAr="الملف الشخصي للطالب"
        titleEn="Student Profile"
        descriptionAr="إدارة معلوماتك الشخصية وتفضيلات المذاكرة واللغة والوضع الليلي، ومتابعة سجل دوراتك المسجلة والمكتملة."
        descriptionEn="Manage your student details, study preferences, language, theme, and review your enrolled and completed courses."
      />

      <section className="py-[32px] pb-[72px]">
        <div className="wrap grid grid-cols-12 gap-[24px]">
          {/* Account & Settings Form */}
          <div className="col-span-12 lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[22px] space-y-5">
              <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#DCE7ED] dark:border-white/12">
                <div className="flex items-center gap-3.5">
                  <span className="w-[56px] h-[56px] rounded-[16px] bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5] grid place-items-center flex-none">
                    <ActiveAvatar className="w-7 h-7" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-[1.12rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                      {state.account.fullName ||
                        (locale === 'ar' ? 'حساب طالب زائر' : 'Guest Learner Workspace')}
                    </h2>
                    <p className="text-[0.82rem] text-[#64748B] dark:text-[#B8C7D9]">
                      {state.account.signedIn
                        ? state.account.email || (locale === 'ar' ? 'مسجل الدخول محليًا' : 'Signed In Locally')
                        : locale === 'ar'
                          ? 'سجّل الدخول لربط بياناتك بجلسة الطالب'
                          : 'Sign in to bind your session details'}
                    </p>
                  </div>
                </div>

                {state.account.signedIn ? (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="rounded-[10px] px-4 py-2 text-[0.82rem] font-bold border border-[#DCE7ED] text-[#64748B] hover:border-[#C0392B]/40 hover:text-[#C0392B] dark:border-white/15 dark:text-[#B8C7D9] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    className="rounded-[10px] px-4 py-2 text-[0.84rem] font-bold bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                  >
                    {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <span className="block text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                    {locale === 'ar' ? 'اختر أيقونة الملف الشخصي' : 'Profile Emblem'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = avatarId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setAvatarId(opt.id)}
                          className={`px-3.5 py-2 rounded-[10px] border text-[0.82rem] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                            isActive
                              ? 'bg-[#DDF3F5] border-[#28B5C5] text-[#142D4E] dark:bg-[#1B3553] dark:text-[#28B5C5]'
                              : 'bg-[#EAF3F6] border-[#DCE7ED] text-[#64748B] dark:bg-[#102238] dark:border-white/12 dark:text-[#B8C7D9]'
                          }`}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          <span>{locale === 'ar' ? opt.labelAr : opt.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                      {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={locale === 'ar' ? 'اكتب اسمك الكامل' : 'Enter your full name'}
                      className="w-full h-[44px] px-3.5 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#28B5C5] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full h-[44px] px-3.5 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#28B5C5] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                      {locale === 'ar' ? 'رقم الجوال' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XXXXXXXX"
                      className="w-full h-[44px] px-3.5 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#28B5C5] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                      {locale === 'ar' ? 'تذكير المذاكرة' : 'Study Reminders'}
                    </label>
                    <select
                      value={reminderCadence}
                      onChange={(e) =>
                        setReminderCadence(e.target.value as StudentPreferences['reminderCadence'])
                      }
                      className="ut-filter-select w-full h-[44px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[0.86rem] font-bold dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                    >
                      <option value="daily">{locale === 'ar' ? 'يومي' : 'Daily'}</option>
                      <option value="weekly">{locale === 'ar' ? 'أسبوعي' : 'Weekly'}</option>
                      <option value="off">{locale === 'ar' ? 'متوقف' : 'Off'}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                      {locale === 'ar' ? 'وقت التعلم المفضل' : 'Study Schedule'}
                    </label>
                    <select
                      value={preferredStudyTime}
                      onChange={(e) =>
                        setPreferredStudyTime(
                          e.target.value as StudentPreferences['preferredStudyTime']
                        )
                      }
                      className="ut-filter-select w-full h-[44px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[0.86rem] font-bold dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                    >
                      <option value="evening">{locale === 'ar' ? 'مسائي' : 'Evening'}</option>
                      <option value="morning">{locale === 'ar' ? 'صباحي' : 'Morning'}</option>
                      <option value="flexible">{locale === 'ar' ? 'مرن' : 'Flexible'}</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={onToggleTheme}
                      className="h-[40px] px-3.5 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[#142D4E] text-[0.82rem] font-bold inline-flex items-center gap-1.5 dark:bg-[#102238] dark:border-white/15 dark:text-[#F1F5F9] cursor-pointer"
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-[#28B5C5]" aria-hidden="true" />
                      ) : (
                        <Moon className="w-4 h-4 text-[#176B87]" aria-hidden="true" />
                      )}
                      <span>
                        {theme === 'dark'
                          ? locale === 'ar'
                            ? 'الوضع الفاتح'
                            : 'Light Mode'
                          : locale === 'ar'
                            ? 'الوضع الداكن'
                            : 'Dark Mode'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={onToggleLocale}
                      className="h-[40px] px-3.5 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[#142D4E] text-[0.82rem] font-bold inline-flex items-center gap-1.5 dark:bg-[#102238] dark:border-white/15 dark:text-[#F1F5F9] cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                      <span>{locale === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="h-[42px] px-6 rounded-[10px] bg-[#176B87] text-white font-bold text-[0.9rem] hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                  >
                    {locale === 'ar' ? 'حفظ التغييرات' : 'Save Preferences'}
                  </button>
                </div>

                {savedNotice && (
                  <div className="bg-[#E7F5EE] dark:bg-[#102E24] border border-[#1F8A5B]/30 text-[#1F8A5B] dark:text-[#6EE7B7] rounded-[10px] p-3 text-[0.86rem] font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {locale === 'ar'
                        ? 'تم حفظ إعدادات ملفك الشخصي بنجاح.'
                        : 'Profile preferences saved successfully.'}
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Courses & Official Certificates Status */}
          <div className="col-span-12 lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[22px] space-y-4">
              <h2 className="text-[1.08rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                {locale === 'ar'
                  ? `الدورات المسجلة (${enrolledPrograms.length})`
                  : `Enrolled Courses (${enrolledPrograms.length})`}
              </h2>

              {enrolledPrograms.length === 0 ? (
                <p className="text-[0.86rem] text-[#64748B] dark:text-[#B8C7D9] bg-[#EAF3F6] dark:bg-[#102238] rounded-[12px] p-4">
                  {locale === 'ar'
                    ? 'لم تسجّل في أي دورة بعد. اختر دورة من دليل الدورات لإضافتها إلى سجلك الدراسي.'
                    : 'No enrolled courses yet. Select any diploma in Courses to add it to your record.'}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {enrolledPrograms.map((course) => {
                    const pct = computeCourseProgressPct(course, state.enrollments[course.id]);
                    return (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => onOpenProgram(course, 'details')}
                        className="w-full text-start bg-[#F8FBFD] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 hover:border-[#28B5C5] rounded-[12px] p-3 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span className="font-bold text-[0.88rem] text-[#142D4E] dark:text-[#F1F5F9] truncate">
                          {locale === 'ar' ? course.titleAr : course.titleEn}
                        </span>
                        <span className="num text-[0.82rem] font-extrabold text-[#176B87] dark:text-[#28B5C5] flex-none">
                          {pct}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[22px] space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                <h2 className="text-[1.08rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                  {locale === 'ar' ? 'الشهادات والإنجازات المعتمدة' : 'Certificates & Achievements'}
                </h2>
              </div>

              <div className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[12px] p-4 space-y-2">
                <div className="flex items-start gap-2 text-[0.84rem] text-[#183247] dark:text-[#CBD8E6]">
                  <Info className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5] flex-none mt-0.5" aria-hidden="true" />
                  <span>
                    {completedPrograms.length > 0
                      ? locale === 'ar'
                        ? `أتممت محاور ${completedPrograms.length} دورة محليًا؛ تصدر الشهادة الرسمية المعتمدة (30 ساعة معتمدة) بعد استكمال متطلبات القبول والاختبارات عبر بوابة التعلّم.`
                        : `You completed ${completedPrograms.length} course syllabus locally. Accredited certificates (30 credit hours) are officially issued through the learning portal upon exam verification.`
                      : locale === 'ar'
                        ? 'تصدر الشهادات المعتمدة فور استكمال متطلبات الدبلوم (30 ساعة معتمدة) واجتياز الاختبارات الرسمية عبر بوابة التعلّم.'
                        : 'Accredited diploma certificates appear once official admission, 30 credit hours, and official assessment verification are completed.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
