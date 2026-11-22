import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AdminDataState, AdminExamAttempt } from '../../types/admin';
import type { Locale } from '../../types/program';
import type { Theme } from '../../utils/theme';
import { formatAdminDate } from '../../utils/adminData';
import {
  computeCompanyStats,
  getCompanyStudentSummary,
  getCompanyStudents,
  isCompanyStudent,
  purchaseCourseForStudentState,
  type CompanyPurchaseResult,
} from '../../utils/companyData';
import { AdminAvatar, AdminBadge, AdminCard, AdminEmptyState, adminBtnClass } from '../admin/AdminUI';
import { CompanyAssignCourseModal } from './CompanyAssignCourseModal';
import { CompanyLayout, type CompanySectionId } from './CompanyLayout';
import { CompanyPurchasesPage } from './CompanyPurchasesPage';
import { CompanyStudentProfile } from './CompanyStudentProfile';
import { CompanyStudentsPage } from './CompanyStudentsPage';

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface CompanyDashboardProps {
  locale: Locale;
  theme: Theme;
  state: AdminDataState;
  attempts: AdminExamAttempt[];
  companyId: string;
  update: UpdateFn;
  onBackToSite: () => void;
  onToggleLocale: () => void;
  onToggleTheme: () => void;
  onSignOut: () => void;
}

/**
 * Dedicated dashboard for authenticated company accounts. The companyId comes
 * from the verified session (never user input), and every nested view re-checks
 * ownership before rendering data.
 */
export function CompanyDashboard({
  locale,
  theme,
  state,
  attempts,
  companyId,
  update,
  onBackToSite,
  onToggleLocale,
  onToggleTheme,
  onSignOut,
}: CompanyDashboardProps) {
  const isAr = locale === 'ar';
  const [section, setSection] = useState<CompanySectionId>('overview');
  const [profileStudentId, setProfileStudentId] = useState<string | null>(null);
  /** Demo purchase flow (opened from any company section, optional preset student). */
  const [assignModal, setAssignModal] = useState<{ studentId?: string } | null>(null);
  const [notice, setNotice] = useState<{ ar: string; en: string } | null>(null);

  // Auto-dismiss the demo purchase success notification.
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const openAssignModal = (studentId?: string) => setAssignModal({ studentId });

  const handleConfirmPurchase = useCallback(
    (studentId: string, courseId: string): CompanyPurchaseResult => {
      const result = purchaseCourseForStudentState(state, companyId, studentId, courseId);
      if (result.ok) {
        update(() => result.state);
        const course = state.courses.find((item) => item.id === courseId);
        const student = state.users.find((user) => user.id === studentId);
        setNotice({
          ar: `تم شراء الكورس «${course?.titleAr ?? courseId}» بنجاح للطالب ${student?.name ?? ''} — أصبح متاحًا في مكتبته الآن.`,
          en: `“${course?.titleEn ?? courseId}” was purchased successfully for ${student?.name ?? ''} — it is now available in their library.`,
        });
      }
      return result;
    },
    [state, companyId, update]
  );

  const company = state.companies.find((item) => item.id === companyId);
  const companyName = company ? (isAr ? company.nameAr : company.nameEn) : '';
  const stats = useMemo(
    () => computeCompanyStats(state, companyId, attempts),
    [state, companyId, attempts]
  );

  const students = useMemo(() => getCompanyStudents(state, companyId), [state, companyId]);
  const summaries = useMemo(
    () =>
      students
        .map((student) => getCompanyStudentSummary(state, student.id, attempts))
        .sort((a, b) => b.overallProgressPct - a.overallProgressPct),
    [state, students, attempts]
  );

  const recentAttempts = useMemo(
    () =>
      attempts
        .filter((attempt) => attempt.studentId && isCompanyStudent(state, companyId, attempt.studentId))
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
        .slice(0, 5),
    [attempts, state, companyId]
  );

  const handleOpenStudent = (studentId: string) => {
    // Ownership guard before opening the profile view.
    if (!isCompanyStudent(state, companyId, studentId)) return;
    setProfileStudentId(studentId);
  };

  const statCards = [
    {
      labelAr: 'إجمالي الطلاب',
      labelEn: 'Total Students',
      value: String(stats.totalStudents),
      icon: Users,
      tone: 'text-[#176B87] dark:text-[#28B5C5]',
    },
    {
      labelAr: 'الطلاب النشطون',
      labelEn: 'Active Students',
      value: String(stats.activeStudents),
      icon: UserCheck,
      tone: 'text-[#1F8A5B] dark:text-[#6EE7B7]',
    },
    {
      labelAr: 'إجمالي الاشتراكات',
      labelEn: 'Total Enrollments',
      value: String(stats.totalEnrollments),
      icon: BookOpen,
      tone: 'text-[#28B5C5] dark:text-[#DDF3F5]',
    },
    {
      labelAr: 'متوسط التقدم',
      labelEn: 'Average Progress',
      value: `${stats.avgProgressPct}%`,
      icon: TrendingUp,
      tone: 'text-[#7C5CBF] dark:text-[#C4B5FD]',
    },
    {
      labelAr: 'كورسات مكتملة',
      labelEn: 'Completed Courses',
      value: String(stats.completedCourses),
      icon: Award,
      tone: 'text-[#B96A2B] dark:text-[#FCD34D]',
    },
  ];

  return (
    <CompanyLayout
      locale={locale}
      theme={theme}
      companyName={companyName}
      activeSection={profileStudentId ? 'students' : section}
      onSectionChange={(next) => {
        setProfileStudentId(null);
        setSection(next);
      }}
      onBackToSite={onBackToSite}
      onToggleLocale={onToggleLocale}
      onToggleTheme={onToggleTheme}
      onSignOut={onSignOut}
    >
      {notice && (
        <div
          role="status"
          className="mb-4 flex items-start gap-2 rounded-[12px] border border-[#1F8A5B]/35 bg-[#E7F5EE] px-4 py-3 text-[0.84rem] font-bold text-[#1F8A5B] dark:border-[#2ECC71]/35 dark:bg-[#102E24] dark:text-[#6EE7B7]"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          <span className="min-w-0 flex-1">{isAr ? notice.ar : notice.en}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label={isAr ? 'إخفاء الإشعار' : 'Dismiss notification'}
            className="grid h-6 w-6 flex-none place-items-center rounded-[8px] hover:bg-[#1F8A5B]/10 dark:hover:bg-[#6EE7B7]/10 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {profileStudentId ? (
        <CompanyStudentProfile
          locale={locale}
          state={state}
          attempts={attempts}
          studentId={profileStudentId}
          onBack={() => setProfileStudentId(null)}
          onAssignCourse={() => openAssignModal(profileStudentId)}
        />
      ) : section === 'purchases' ? (
        <CompanyPurchasesPage
          locale={locale}
          state={state}
          companyId={companyId}
          onOpenStudent={handleOpenStudent}
          onAssignCourse={() => openAssignModal()}
        />
      ) : section === 'students' ? (
        <CompanyStudentsPage
          locale={locale}
          state={state}
          companyId={companyId}
          attempts={attempts}
          update={update}
          onOpenStudent={handleOpenStudent}
          onAssignCourse={() => openAssignModal()}
        />
      ) : (
        <CompanyOverview
          locale={locale}
          state={state}
          companyId={companyId}
          attempts={attempts}
          stats={stats}
          summaries={summaries}
          recentAttempts={recentAttempts}
          companyName={companyName}
          onOpenStudent={handleOpenStudent}
          onOpenStudents={() => setSection('students')}
          onAssignCourse={() => openAssignModal()}
        />
      )}

      {assignModal && (
        <CompanyAssignCourseModal
          locale={locale}
          state={state}
          companyId={companyId}
          initialStudentId={assignModal.studentId ?? null}
          onClose={() => setAssignModal(null)}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </CompanyLayout>
  );
}


interface CompanyOverviewProps {
  locale: Locale;
  state: AdminDataState;
  companyId: string;
  attempts: AdminExamAttempt[];
  stats: ReturnType<typeof computeCompanyStats>;
  summaries: ReturnType<typeof getCompanyStudentSummary>[];
  recentAttempts: AdminExamAttempt[];
  companyName: string;
  onOpenStudent: (studentId: string) => void;
  onOpenStudents: () => void;
  onAssignCourse: () => void;
}

function CompanyOverview({
  locale,
  state,
  attempts,
  stats,
  summaries,
  recentAttempts,
  companyName,
  onOpenStudent,
  onOpenStudents,
  onAssignCourse,
}: CompanyOverviewProps) {
  const isAr = locale === 'ar';

  const statCards = [
    {
      labelAr: 'إجمالي الطلاب',
      labelEn: 'Total Students',
      value: String(stats.totalStudents),
      icon: Users,
      tone: 'text-[#176B87] dark:text-[#28B5C5]',
    },
    {
      labelAr: 'الطلاب النشطون',
      labelEn: 'Active Students',
      value: String(stats.activeStudents),
      icon: UserCheck,
      tone: 'text-[#1F8A5B] dark:text-[#6EE7B7]',
    },
    {
      labelAr: 'إجمالي الاشتراكات',
      labelEn: 'Total Enrollments',
      value: String(stats.totalEnrollments),
      icon: BookOpen,
      tone: 'text-[#28B5C5] dark:text-[#DDF3F5]',
    },
    {
      labelAr: 'متوسط التقدم',
      labelEn: 'Average Progress',
      value: `${stats.avgProgressPct}%`,
      icon: TrendingUp,
      tone: 'text-[#7C5CBF] dark:text-[#C4B5FD]',
    },
    {
      labelAr: 'كورسات مكتملة',
      labelEn: 'Completed Courses',
      value: String(stats.completedCourses),
      icon: Award,
      tone: 'text-[#B96A2B] dark:text-[#FCD34D]',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[1.25rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? 'لوحة الشركة' : 'Company Dashboard'}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-[0.84rem] text-[#64748B] dark:text-[#B8C7D9]">
            <Building2 className="h-3.5 w-3.5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
            {isAr
              ? 'متابعة تقدم طلاب شركتك ونتائجهم في الاختبارات'
              : 'Track your company students’ progress and exam results'}
          </p>
        </div>
        <div className="flex flex-none flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAssignCourse}
            className={adminBtnClass('primary', 'md')}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'إضافة كورس لطالب' : 'Assign Course to Student'}
          </button>
          <AdminBadge tone="cyan">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            {companyName}
          </AdminBadge>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard key={card.labelEn} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="num text-[1.3rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                    {card.value}
                  </div>
                  <div className="truncate text-[0.72rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                    {isAr ? card.labelAr : card.labelEn}
                  </div>
                </div>
                <Icon className={`h-6 w-6 flex-none ${card.tone}`} aria-hidden="true" />
              </div>
            </AdminCard>
          );
        })}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        {/* Top students by progress */}
        <AdminCard className="p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              <GraduationCap className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
              {isAr ? 'الأعلى تقدمًا' : 'Top Students by Progress'}
            </h2>
            <button
              type="button"
              onClick={onOpenStudents}
              className={adminBtnClass('subtle')}
            >
              {isAr ? 'كل الطلاب' : 'View all'}
            </button>
          </div>
          {summaries.length === 0 ? (
            <p className="rounded-[12px] border border-dashed border-[#DCE7ED] px-4 py-6 text-center text-[0.82rem] text-[#94A3B8] dark:border-white/15">
              {isAr
                ? 'لا يوجد طلاب بعد — أضف طلابك من قسم «طلاب الشركة».'
                : 'No students yet — add them from the “Company Students” section.'}
            </p>
          ) : (
            <ul className="space-y-2">
              {summaries.slice(0, 5).map((summary) => (
                <li
                  key={summary.student.id}
                  className="flex items-center gap-3 rounded-[10px] bg-[#EAF3F6] px-3 py-2 dark:bg-[#102238]"
                >
                  <AdminAvatar name={summary.student.name} seed={summary.student.id} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.82rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                      {summary.student.name}
                    </div>
                    <div className="num text-[0.7rem] text-[#64748B] dark:text-[#B8C7D9]">
                      {isAr
                        ? `${summary.enrolledCourses} كورسات · ${summary.completedCourses} مكتملة`
                        : `${summary.enrolledCourses} courses · ${summary.completedCourses} completed`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenStudent(summary.student.id)}
                    className="num text-[0.84rem] font-extrabold text-[#176B87] hover:underline dark:text-[#28B5C5] cursor-pointer"
                  >
                    {summary.overallProgressPct}%
                  </button>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        {/* Recent exam activity */}
        <AdminCard className="p-5">
          <h2 className="mb-3 flex items-center gap-2 text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            <ClipboardList className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
            {isAr ? 'آخر نشاط الاختبارات' : 'Recent Exam Activity'}
          </h2>
          {recentAttempts.length === 0 ? (
            <AdminEmptyState
              icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
              title={isAr ? 'لا توجد محاولات بعد' : 'No attempts yet'}
              description={
                isAr
                  ? 'ستظهر هنا نتائج اختبارات طلاب شركتك.'
                  : 'Your company students’ exam results will appear here.'
              }
            />
          ) : (
            <ul className="space-y-2">
              {recentAttempts.map((attempt) => {
                const student = state.users.find((user) => user.id === attempt.studentId);
                const exam = state.exams.find((item) => item.id === attempt.examId);
                return (
                  <li
                    key={attempt.id}
                    className="flex flex-wrap items-center gap-2 rounded-[10px] bg-[#EAF3F6] px-3 py-2 dark:bg-[#102238]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[0.8rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                        {student?.name ?? attempt.studentId}
                        <span className="font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                          {' · '}
                          {exam ? (isAr ? exam.titleAr : exam.titleEn) : attempt.examId}
                        </span>
                      </div>
                      <div className="num text-[0.7rem] text-[#64748B] dark:text-[#B8C7D9]">
                        {attempt.submittedAt
                          ? formatAdminDate(attempt.submittedAt, locale)
                          : isAr ? 'قيد التنفيذ' : 'In progress'}
                      </div>
                    </div>
                    {attempt.submittedAt ? (
                      <AdminBadge tone={attempt.passed ? 'success' : 'danger'}>
                        {`${attempt.scorePct}%`}
                      </AdminBadge>
                    ) : (
                      <AdminBadge tone="warn">{isAr ? 'جارية' : 'Running'}</AdminBadge>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
