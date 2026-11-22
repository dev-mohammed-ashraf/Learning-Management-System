import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ListChecks,
  ShoppingCart,
  Target,
} from 'lucide-react';
import type { AdminDataState, AdminExamAttempt } from '../../types/admin';
import type { Locale } from '../../types/program';
import { formatAdminDate } from '../../utils/adminData';
import { getCompanyStudentSummary } from '../../utils/companyData';
import { AdminAvatar, AdminBadge, AdminCard, AdminEmptyState, adminBtnClass } from '../admin/AdminUI';

interface CompanyStudentProfileProps {
  locale: Locale;
  state: AdminDataState;
  attempts: AdminExamAttempt[];
  studentId: string;
  onBack: () => void;
  onAssignCourse: () => void;
}

/**
 * Detailed company-student profile: account info, per-course progress with
 * completed/remaining lessons, exam attempts and results, and the last
 * learning activity. All data is scoped by the caller (companyId-verified).
 */
export function CompanyStudentProfile({
  locale,
  state,
  attempts,
  studentId,
  onBack,
  onAssignCourse,
}: CompanyStudentProfileProps) {
  const isAr = locale === 'ar';
  const summary = getCompanyStudentSummary(state, studentId, attempts);
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  if (!summary.student.name) {
    return (
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 rounded-[10px] border border-[#DCE7ED] bg-white px-3 py-2 text-[0.8rem] font-bold text-[#64748B] dark:border-white/15 dark:bg-[#102238] dark:text-[#B8C7D9] cursor-pointer"
        >
          <BackArrow className="h-4 w-4" aria-hidden="true" />
          {isAr ? 'عودة لطلاب الشركة' : 'Back to Students'}
        </button>
        <AdminEmptyState
          icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
          title={isAr ? 'الطالب غير متاح' : 'Student unavailable'}
          description={
            isAr
              ? 'لم يتم العثور على هذا الطالب ضمن طلاب شركتك.'
              : 'This student does not belong to your company.'
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#DCE7ED] bg-white px-3 py-2 text-[0.8rem] font-bold text-[#64748B] hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/15 dark:bg-[#102238] dark:text-[#B8C7D9] cursor-pointer"
        >
          <BackArrow className="h-4 w-4" aria-hidden="true" />
          {isAr ? 'عودة لطلاب الشركة' : 'Back to Students'}
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[1.15rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {summary.student.name}
          </h1>
          <p className="num truncate text-[0.76rem] text-[#64748B] dark:text-[#B8C7D9]" dir="ltr">
            {summary.student.email}
          </p>
        </div>
        <button type="button" onClick={onAssignCourse} className={adminBtnClass('primary')}>
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          {isAr ? 'إضافة كورس' : 'Assign Course'}
        </button>
        <AdminBadge tone={summary.student.status === 'active' ? 'success' : 'danger'}>
          {summary.student.status === 'active'
            ? isAr ? 'نشط' : 'Active'
            : isAr ? 'موقوف' : 'Inactive'}
        </AdminBadge>
      </div>

      {/* Student info */}
      <AdminCard className="p-5">
        <div className="flex flex-wrap items-center gap-4">
          <AdminAvatar name={summary.student.name} seed={summary.student.id} size="lg" />
          <div className="grid flex-1 grid-cols-2 gap-2 text-[0.8rem] font-semibold sm:grid-cols-4">
            <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
              {isAr ? 'الكورسات:' : 'Courses:'}{' '}
              <span className="num font-bold text-[#183247] dark:text-[#F1F5F9]">
                {summary.enrolledCourses}
              </span>
            </span>
            <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
              {isAr ? 'التقدم الكلي:' : 'Overall progress:'}{' '}
              <span className="num font-bold text-[#176B87] dark:text-[#28B5C5]">
                {summary.overallProgressPct}%
              </span>
            </span>
            <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
              {isAr ? 'كورسات مكتملة:' : 'Completed:'}{' '}
              <span className="num font-bold text-[#1F8A5B] dark:text-[#6EE7B7]">
                {summary.completedCourses}
              </span>
            </span>
            <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
              {isAr ? 'الجوال:' : 'Phone:'}{' '}
              <span className="num font-bold text-[#183247] dark:text-[#F1F5F9]" dir="ltr">
                {summary.student.phone || '—'}
              </span>
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-[#DCE7ED] pt-3 text-[0.76rem] text-[#64748B] dark:border-white/12 dark:text-[#B8C7D9]">
          <CalendarDays className="h-3.5 w-3.5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
          <span className="num">
            {isAr ? 'آخر نشاط تعليمي:' : 'Last learning activity:'}{' '}
            <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">
              {summary.lastActivityAt
                ? formatAdminDate(summary.lastActivityAt, locale)
                : isAr ? 'لا يوجد بعد' : 'None yet'}
            </span>
          </span>
        </div>
      </AdminCard>

      {/* Per-course progress */}
      <div className="space-y-3">
        <h2 className="text-[0.98rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
          {isAr ? 'الكورسات والتقدم' : 'Courses & Progress'}
        </h2>
        {summary.courses.length === 0 ? (
          <AdminEmptyState
            icon={<ListChecks className="h-5 w-5" aria-hidden="true" />}
            title={isAr ? 'لا توجد اشتراكات' : 'No enrollments'}
            description={
              isAr
                ? 'لم يشترك هذا الطالب في أي كورس بعد.'
                : 'This student has not enrolled in any course yet.'
            }
          />
        ) : (
          summary.courses.map((entry) => (
            <AdminCard key={entry.enrollment.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-[0.88rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                    {isAr ? entry.course.titleAr : entry.course.titleEn}
                  </div>
                  <div className="text-[0.72rem] text-[#64748B] dark:text-[#B8C7D9]">
                    {isAr ? 'تاريخ الاشتراك:' : 'Enrolled:'}{' '}
                    <span className="num">{formatAdminDate(entry.enrollment.enrolledAt, locale)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AdminBadge tone={entry.completed ? 'success' : 'warn'}>
                    {entry.completed ? (isAr ? 'مكتمل' : 'Completed') : isAr ? 'جاري' : 'In Progress'}
                  </AdminBadge>
                  <span className="num text-[0.86rem] font-extrabold text-[#176B87] dark:text-[#28B5C5]">
                    {entry.progressPct}%
                  </span>
                </div>
              </div>
              <div className="mt-2.5">
                <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#EAF3F6] dark:bg-[#102238]">
                  <div
                    className={`h-full rounded-full transition-all ${
                      entry.completed
                        ? 'bg-[#1F8A5B] dark:bg-[#2ECC71]'
                        : 'bg-[#176B87] dark:bg-[#28B5C5]'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, entry.progressPct))}%` }}
                  />
                </div>
                <div className="num mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.72rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                  <span>
                    {isAr ? 'دروس مكتملة:' : 'Completed lessons:'}{' '}
                    <span className="text-[#1F8A5B] dark:text-[#6EE7B7]">
                      {entry.completedLessons}/{entry.totalLessons}
                    </span>
                  </span>
                  <span>
                    {isAr ? 'دروس متبقية:' : 'Remaining lessons:'}{' '}
                    <span className="text-[#C0392B] dark:text-[#FCA5A5]">
                      {entry.remainingLessons}
                    </span>
                  </span>
                </div>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      {/* Exam attempts & results */}
      <div className="space-y-3">
        <h2 className="text-[0.98rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
          {isAr ? 'محاولات الاختبارات والنتائج' : 'Exam Attempts & Results'}
        </h2>
        {summary.attempts.length === 0 ? (
          <AdminEmptyState
            icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
            title={isAr ? 'لا توجد محاولات اختبار' : 'No exam attempts'}
            description={
              isAr
                ? 'لم يخض هذا الطالب أي اختبار بعد.'
                : 'This student has not attempted any exam yet.'
            }
          />
        ) : (
          <AdminCard>
            <div className="divide-y divide-[#DCE7ED]/70 dark:divide-white/8">
              {summary.attempts.map((attempt) => {
                const exam = state.exams.find((item) => item.id === attempt.examId);
                return (
                  <div key={attempt.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                        {exam ? (isAr ? exam.titleAr : exam.titleEn) : attempt.examId}
                      </div>
                      <div className="num text-[0.72rem] text-[#64748B] dark:text-[#B8C7D9]">
                        {isAr ? 'بدأ:' : 'Started:'} {formatAdminDate(attempt.startedAt, locale)}
                        {attempt.submittedAt
                          ? ` · ${isAr ? 'سُلّم:' : 'Submitted:'} ${formatAdminDate(attempt.submittedAt, locale)}`
                          : ` · ${isAr ? 'قيد التنفيذ' : 'In progress'}`}
                      </div>
                    </div>
                    {attempt.submittedAt ? (
                      <>
                        <span className="num text-[0.8rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                          {attempt.earnedMarks}/{attempt.totalMarks}
                        </span>
                        <AdminBadge tone={attempt.passed ? 'success' : 'danger'}>
                          {`${attempt.scorePct}% · ${
                            attempt.passed ? (isAr ? 'ناجح' : 'Passed') : isAr ? 'راسب' : 'Failed'
                          }`}
                        </AdminBadge>
                      </>
                    ) : (
                      <AdminBadge tone="warn">{isAr ? 'لم يُسلَّم' : 'Not submitted'}</AdminBadge>
                    )}
                  </div>
                );
              })}
            </div>
          </AdminCard>
        )}
        {summary.attempts.length > 0 && (
          <p className="num flex flex-wrap items-center gap-2 text-[0.76rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#1F8A5B] dark:text-[#6EE7B7]" aria-hidden="true" />
            {isAr ? `اختبارات ناجحة: ${summary.passedExams}` : `Passed exams: ${summary.passedExams}`}
            <Target className="ms-2 h-3.5 w-3.5 text-[#C0392B] dark:text-[#FCA5A5]" aria-hidden="true" />
            {isAr
              ? `اختبارات غير ناجحة: ${summary.failedExams}`
              : `Failed exams: ${summary.failedExams}`}
          </p>
        )}
      </div>
    </div>
  );
}
