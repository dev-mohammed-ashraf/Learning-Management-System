import {
  Activity,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Map,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { Locale, Program } from '../../types/program';
import type { NavSection, StudentPlatformState } from '../../types/student';
import {
  computeCourseProgressPct,
  computeDashboardMetrics,
} from '../../utils/studentPlatform';
import { PageHeroBanner } from '../common/PageHeroBanner';
import { ProgressBar } from '../common/ProgressBar';

interface DashboardPageProps {
  locale: Locale;
  state: StudentPlatformState;
  programs: Program[];
  onGoHome: () => void;
  onNavigate: (nav: NavSection) => void;
  onOpenProgram: (program: Program, tab?: 'details' | 'register') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export function DashboardPage({
  locale,
  state,
  programs,
  onNavigate,
  onOpenProgram,
  onOpenAuth,
}: DashboardPageProps) {
  const metrics = computeDashboardMetrics(state, programs);

  const inProgressCourses = programs.filter(
    (p) => state.enrollments[p.id]?.status === 'in_progress'
  );

  const studentDisplayName =
    state.account.signedIn && state.account.fullName
      ? state.account.fullName
      : locale === 'ar'
        ? 'طالب منصة مدار'
        : 'Madar Learner';

  const statCards = [
    {
      labelAr: 'الدورات المسجل بها',
      labelEn: 'Enrolled Courses',
      value: metrics.enrolledCount,
      icon: BookOpen,
      hintAr: 'من أصل 7 دبلومات متاحة',
      hintEn: 'Out of 7 available diplomas',
    },
    {
      labelAr: 'الدورات المكتملة',
      labelEn: 'Completed Courses',
      value: metrics.completedCount,
      icon: Award,
      hintAr: 'بإتمام جميع المحاور الأربعة',
      hintEn: 'All 4 course modules finished',
    },
    {
      labelAr: 'الساعات المنجزة تقديريًا',
      labelEn: 'Completed Credit Hours',
      value: metrics.creditHoursEnrolled,
      icon: Clock,
      hintAr: 'محسوبة من محاورك المنجزة (30 ساعة/دبلوم)',
      hintEn: 'Derived from finished modules (30h/diploma)',
    },
    {
      labelAr: 'نسبة الإنجاز الإجمالية',
      labelEn: 'Overall Completion Rate',
      value: `${metrics.overallProgressPct}%`,
      icon: TrendingUp,
      hintAr: 'متوسط تقدّم الدورات المسجل بها',
      hintEn: 'Average across enrolled courses',
    },
  ];

  return (
    <div>
      <PageHeroBanner
        locale={locale}
        eyebrowAr="متابعة المسار الشخصي"
        eyebrowEn="Personal Study Overview"
        titleAr={`مرحبًا، ${studentDisplayName} — لوحة الإنجاز`}
        titleEn={`Welcome, ${studentDisplayName} — Dashboard`}
        descriptionAr="اعرض ملخص تقدمك الحقيقي في الدورات، الساعات الدراسية المنجزة، أهدافك التعليمية، وآخر نشاط لك على منصة مدار."
        descriptionEn="Track your real course enrollment progress, completed credit hours, active study goals, and recent activity on Madar."
        actionSlot={
          !state.account.signedIn ? (
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="rounded-[12px] px-[20px] py-[10px] font-bold text-[0.88rem] bg-[#28B5C5] text-[#0B1726] hover:bg-[#DDF3F5] transition-colors cursor-pointer"
            >
              {locale === 'ar' ? 'تسجيل الدخول لحفظ بياناتك باسمك' : 'Sign In to Personalize Your Account'}
            </button>
          ) : undefined
        }
      />

      <section className="py-[32px] pb-[72px]">
        <div className="wrap space-y-8">
          {/* 1. Four Real Metrics Cards */}
          <div className="grid grid-cols-4 max-[1024px]:grid-cols-2 max-[560px]:grid-cols-1 gap-[18px]">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.labelEn}
                  className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[20px] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.86rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                      {locale === 'ar' ? card.labelAr : card.labelEn}
                    </span>
                    <Icon
                      className="w-[34px] h-[34px] p-[7px] rounded-[10px] bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5] flex-none"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="num text-[2rem] font-extrabold leading-none text-[#142D4E] dark:text-[#F1F5F9]">
                    {card.value}
                  </div>
                  <div className="text-[0.78rem] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                    {locale === 'ar' ? card.hintAr : card.hintEn}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="grid grid-cols-12 gap-[22px]">
            {/* 2. Continue Learning Section */}
            <div className="col-span-12 lg:col-span-7 bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[22px] space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-[1.15rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                    {locale === 'ar' ? 'واصل التعلم' : 'Continue Learning'}
                  </h2>
                  <p className="text-[0.84rem] text-[#64748B] dark:text-[#B8C7D9]">
                    {locale === 'ar'
                      ? 'الدورات التي بدأت دراستها وحالتها قيد التعلّم'
                      : 'Courses currently in progress in your library'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('library')}
                  className="text-[0.84rem] font-bold text-[#176B87] dark:text-[#28B5C5] hover:underline cursor-pointer"
                >
                  {locale === 'ar' ? 'فتح مكتبتي التعليمية' : 'Open My Library'}
                </button>
              </div>

              {inProgressCourses.length === 0 ? (
                <div className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[12px] p-6 text-center space-y-3">
                  <GraduationCap
                    className="w-9 h-9 mx-auto text-[#176B87] dark:text-[#28B5C5]"
                    aria-hidden="true"
                  />
                  <h3 className="font-bold text-[#142D4E] dark:text-[#F1F5F9] text-[1rem]">
                    {locale === 'ar'
                      ? 'لم تبدأ أي دورة بعد'
                      : 'You have not started any course yet'}
                  </h3>
                  <p className="text-[0.86rem] text-[#64748B] dark:text-[#B8C7D9] max-w-[46ch] mx-auto">
                    {locale === 'ar'
                      ? 'تصفّح دليل الدورات أو المسارات التعليمية وأضف أول دورة إلى مكتبتك لتظهر هنا نسبة تقدّمك الفعلي.'
                      : 'Browse Courses or Learning Paths and add a course to start tracking real module progress here.'}
                  </p>
                  <div className="flex items-center justify-center gap-2.5 flex-wrap pt-1">
                    <button
                      type="button"
                      onClick={() => onNavigate('diplomas')}
                      className="rounded-[10px] px-4 py-2 text-[0.86rem] font-bold bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                    >
                      {locale === 'ar' ? 'استكشاف الدورات' : 'Browse Courses'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('paths')}
                      className="rounded-[10px] px-4 py-2 text-[0.86rem] font-bold border border-[#DCE7ED] bg-white text-[#142D4E] hover:border-[#28B5C5] dark:bg-[#142D4E] dark:border-white/15 dark:text-[#F1F5F9] cursor-pointer"
                    >
                      {locale === 'ar' ? 'المسارات التعليمية' : 'Learning Paths'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {inProgressCourses.map((course) => {
                    const record = state.enrollments[course.id];
                    const pct = computeCourseProgressPct(course, record);
                    const modules = locale === 'ar' ? course.modulesAr : course.modulesEn;
                    const nextModuleIdx = Math.min(
                      record?.lastModuleIndex ?? 0,
                      modules.length - 1
                    );
                    const currentLesson = modules[nextModuleIdx] ?? '';

                    return (
                      <div
                        key={course.id}
                        className="bg-[#F8FBFD] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[14px] p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0">
                            <div className="text-[0.76rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                              {locale === 'ar' ? course.categoryAr : course.categoryEn}
                            </div>
                            <h3 className="font-bold text-[#142D4E] dark:text-[#F1F5F9] text-[0.98rem]">
                              {locale === 'ar' ? course.titleAr : course.titleEn}
                            </h3>
                            <div className="text-[0.82rem] text-[#64748B] dark:text-[#B8C7D9] mt-0.5">
                              {locale === 'ar' ? 'المحور الحالي: ' : 'Current Module: '}
                              <span className="font-semibold text-[#183247] dark:text-[#E2E8F0]">
                                {currentLesson}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onOpenProgram(course, 'details')}
                            className="rounded-[10px] px-4 py-2 text-[0.84rem] font-bold bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer flex-none"
                          >
                            {locale === 'ar' ? 'متابعة التعلم' : 'Continue'}
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                            <span>
                              {locale === 'ar'
                                ? `${record?.completedModuleIndices.length ?? 0} من ${modules.length} محاور`
                                : `${record?.completedModuleIndices.length ?? 0} of ${modules.length} modules`}
                            </span>
                            <span className="num text-[#142D4E] dark:text-[#F1F5F9]">{pct}%</span>
                          </div>
                          <ProgressBar value={pct} size="sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Goals Summary & Recent Activity */}
            <div className="col-span-12 lg:col-span-5 space-y-5">
              {/* Goals Overview */}
              <div className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[22px] space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                    <h2 className="text-[1.08rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                      {locale === 'ar' ? 'أهدافي الدراسية' : 'Learning Goals Overview'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('goals')}
                    className="text-[0.82rem] font-bold text-[#176B87] dark:text-[#28B5C5] hover:underline cursor-pointer"
                  >
                    {locale === 'ar' ? 'إدارة الأهداف' : 'Manage Goals'}
                  </button>
                </div>

                {state.goals.length === 0 ? (
                  <div className="bg-[#EAF3F6] dark:bg-[#102238] rounded-[12px] p-4 text-[0.86rem] text-[#64748B] dark:text-[#B8C7D9] flex items-center justify-between gap-3 flex-wrap">
                    <span>
                      {locale === 'ar'
                        ? 'لم تضف أهدافًا دراسية بعد.'
                        : 'No study goals added yet.'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('goals')}
                      className="rounded-[8px] px-3 py-1.5 text-[0.8rem] font-bold bg-[#176B87] text-white dark:bg-[#28B5C5] dark:text-[#0B1726] cursor-pointer"
                    >
                      {locale === 'ar' ? 'أضف هدفًا' : 'Create Goal'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.goals.slice(0, 3).map((goal) => (
                      <div
                        key={goal.id}
                        className="bg-[#F8FBFD] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[12px] p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2 text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                          <span className="truncate">{goal.title}</span>
                          <span className="num text-[#176B87] dark:text-[#28B5C5] flex-none">
                            {goal.progress}%
                          </span>
                        </div>
                        <ProgressBar value={goal.progress} size="sm" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Real Activity Feed */}
              <div className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[22px] space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                  <h2 className="text-[1.08rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                    {locale === 'ar' ? 'سجل النشاط الحديث' : 'Recent Activity'}
                  </h2>
                </div>

                {state.activity.length === 0 ? (
                  <p className="text-[0.85rem] text-[#64748B] dark:text-[#B8C7D9] bg-[#EAF3F6] dark:bg-[#102238] rounded-[12px] p-4">
                    {locale === 'ar'
                      ? 'سيظهر هنا سجل نشاطك فور حفظ دورة، أو التسجيل فيها، أو إضافة هدف تعليمي.'
                      : 'Your real activity feed will update automatically as you save courses, enroll, complete modules, or create goals.'}
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {state.activity.slice(0, 5).map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start gap-2.5 text-[0.84rem] pb-2.5 border-b last:border-b-0 last:pb-0 border-[#DCE7ED] dark:border-white/10"
                      >
                        <CheckCircle2
                          className="w-4 h-4 text-[#28B5C5] flex-none mt-1"
                          aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-[#142D4E] dark:text-[#F1F5F9]">
                            {locale === 'ar' ? item.titleAr : item.titleEn}
                          </div>
                          <div className="num text-[0.74rem] text-[#64748B] dark:text-[#94A3B8]">
                            {new Date(item.timestamp).toLocaleDateString(
                              locale === 'ar' ? 'ar-SA' : 'en-US',
                              { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Quick Navigation Shortcut */}
              <div className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Map className="w-5 h-5 text-[#176B87] dark:text-[#28B5C5] flex-none" aria-hidden="true" />
                  <span className="text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                    {locale === 'ar'
                      ? 'استكشف المسارات التعليمية المتكاملة'
                      : 'Explore Structured Learning Paths'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('paths')}
                  className="rounded-[9px] px-3.5 py-1.5 text-[0.8rem] font-bold bg-[#176B87] text-white dark:bg-[#28B5C5] dark:text-[#0B1726] cursor-pointer flex-none"
                >
                  {locale === 'ar' ? 'عرض المسارات' : 'View Paths'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
