import { Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import type { AdminDataState } from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  enrollStudentInCourseState,
  formatAdminDate,
  removeEnrollmentState,
} from '../../utils/adminData';
import {
  AdminAvatar,
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminField,
  AdminModal,
  AdminPageHeader,
  AdminSearchInput,
  AdminTd,
  AdminTh,
  AdminTableWrap,
  adminBtnClass,
  adminFieldClass,
  ConfirmDialog,
} from './AdminUI';

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface AdminEnrollmentsPageProps {
  locale: Locale;
  state: AdminDataState;
  update: UpdateFn;
}

export function AdminEnrollmentsPage({ locale, state, update }: AdminEnrollmentsPageProps) {
  const isAr = locale === 'ar';
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const filtered = state.enrollments.filter((enrollment) => {
    const student = state.users.find((user) => user.id === enrollment.studentId);
    const course = state.courses.find((item) => item.id === enrollment.courseId);
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (student?.name ?? '').toLowerCase().includes(query) ||
      (course?.titleAr ?? '').toLowerCase().includes(query) ||
      (course?.titleEn ?? '').toLowerCase().includes(query);
    const matchesCourse = !courseFilter || enrollment.courseId === courseFilter;
    const matchesStatus = !statusFilter || enrollment.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });


  return (
    <div>
      <AdminPageHeader
        title={isAr ? 'إدارة الاشتراكات' : 'Enrollment Management'}
        description={
          isAr
            ? 'عرض اشتراكات الطلبة التجريبية ومحاكاة تسجيل أو إزالة الطلبة من الكورسات.'
            : 'View demo enrollments and simulate enrolling or removing students.'
        }
        action={
          <button type="button" onClick={() => setAddModalOpen(true)} className={adminBtnClass('primary')}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'تسجيل طالب' : 'Enroll Student'}
          </button>
        }
      />

      <AdminCard className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder={isAr ? 'ابحث باسم الطالب أو الكورس…' : 'Search by student or course…'}
          />
          <select
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
            className="h-[42px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 text-[0.84rem] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
          >
            <option value="">{isAr ? 'كل الكورسات' : 'All courses'}</option>
            {state.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {isAr ? course.titleAr : course.titleEn}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-[42px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 text-[0.84rem] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
          >
            <option value="">{isAr ? 'كل الحالات' : 'All statuses'}</option>
            <option value="active">{isAr ? 'نشط' : 'Active'}</option>
            <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
          </select>
          <span className="num ms-auto text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
            {filtered.length} / {state.enrollments.length}
          </span>
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<UserPlus className="h-5 w-5" aria-hidden="true" />}
          title={isAr ? 'لا توجد اشتراكات مطابقة' : 'No matching enrollments'}
          description={
            isAr
              ? 'جرّب تعديل عناصر البحث أو الفلاتر، أو سجّل طالبًا في كورس.'
              : 'Try adjusting the search or filters, or enroll a student in a course.'
          }
        />
      ) : (
        <AdminCard>
          <AdminTableWrap>
            <thead>
              <tr>
                <AdminTh>{isAr ? 'الطالب' : 'Student'}</AdminTh>
                <AdminTh>{isAr ? 'الكورس' : 'Course'}</AdminTh>
                <AdminTh>{isAr ? 'تاريخ الاشتراك' : 'Enrolled'}</AdminTh>
                <AdminTh>{isAr ? 'التقدم' : 'Progress'}</AdminTh>
                <AdminTh>{isAr ? 'الحالة' : 'Status'}</AdminTh>
                <AdminTh>{isAr ? 'إجراءات' : 'Actions'}</AdminTh>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enrollment) => {
                const student = state.users.find((user) => user.id === enrollment.studentId);
                const course = state.courses.find((item) => item.id === enrollment.courseId);
                return (
                  <tr key={enrollment.id} className="transition-colors hover:bg-[#EAF3F6]/40 dark:hover:bg-[#102238]/40">
                    <AdminTd>
                      <div className="flex items-center gap-3">
                        <AdminAvatar name={student?.name ?? '؟'} seed={enrollment.studentId} size="sm" />
                        <span className="truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                          {student?.name ?? enrollment.studentId}
                        </span>
                      </div>
                    </AdminTd>
                    <AdminTd className="max-w-[260px] truncate text-[0.84rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                      {course ? (isAr ? course.titleAr : course.titleEn) : enrollment.courseId}
                    </AdminTd>
                    <AdminTd className="num text-[0.78rem] text-[#64748B] dark:text-[#B8C7D9]">
                      {formatAdminDate(enrollment.enrolledAt, locale)}
                    </AdminTd>
                    <AdminTd>
                      <div className="flex items-center gap-2">
                        <div className="h-[8px] w-[90px] overflow-hidden rounded-full bg-[#EAF3F6] dark:bg-[#0B1726]">
                          <div
                            className="h-full rounded-full bg-gradient-to-l from-[#28B5C5] to-[#176B87]"
                            style={{ width: `${enrollment.progressPct}%` }}
                          />
                        </div>
                        <span className="num text-[0.76rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                          {enrollment.progressPct}%
                        </span>
                      </div>
                    </AdminTd>
                    <AdminTd>
                      <AdminBadge tone={enrollment.status === 'completed' ? 'success' : 'cyan'}>
                        {enrollment.status === 'completed' ? (isAr ? 'مكتمل' : 'Completed') : isAr ? 'نشط' : 'Active'}
                      </AdminBadge>
                    </AdminTd>
                    <AdminTd>
                      <button
                        type="button"
                        onClick={() => setRemoveTarget(enrollment.id)}
                        aria-label={isAr ? 'إزالة الاشتراك' : 'Remove enrollment'}
                        title={isAr ? 'إزالة' : 'Remove'}
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#FCEBE9] hover:text-[#C0392B] dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5] cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </AdminTd>
                  </tr>
                );
              })}
            </tbody>
          </AdminTableWrap>
        </AdminCard>
      )}

      {/* Enroll student modal */}
      {addModalOpen && (
        <EnrollStudentModal
          locale={locale}
          state={state}
          onClose={() => setAddModalOpen(false)}
          onSubmit={(studentId, courseId) => {
            update((prev) => enrollStudentInCourseState(prev, studentId, courseId));
            setAddModalOpen(false);
          }}
        />
      )}

      {/* Remove confirmation */}
      {removeTarget && (
        <ConfirmDialog
          locale={locale}
          title={isAr ? 'إزالة الاشتراك' : 'Remove Enrollment'}
          message={
            isAr
              ? 'سيتم إزالة اشتراك الطالب من هذا الكورس من البيانات التجريبية. هل تريد المتابعة؟'
              : 'The student enrollment will be removed from this course in the demo data. Continue?'
          }
          confirmLabel={isAr ? 'إزالة' : 'Remove'}
          onConfirm={() => {
            update((prev) => removeEnrollmentState(prev, removeTarget));
            setRemoveTarget(null);
          }}
          onCancel={() => setRemoveTarget(null)}
        />
      )}
    </div>
  );
}

function EnrollStudentModal({
  locale,
  state,
  onClose,
  onSubmit,
}: {
  locale: Locale;
  state: AdminDataState;
  onClose: () => void;
  onSubmit: (studentId: string, courseId: string) => void;
}) {
  const isAr = locale === 'ar';
  const activeStudents = state.users.filter((user) => user.role === 'student' && user.status === 'active');
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');

  return (
    <AdminModal title={isAr ? 'تسجيل طالب في كورس' : 'Enroll Student in Course'} onClose={onClose} maxWidth="480px">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!studentId || !courseId) {
            setError(isAr ? 'اختر الطالب والكورس.' : 'Select a student and a course.');
            return;
          }
          const duplicate = state.enrollments.some(
            (enrollment) => enrollment.studentId === studentId && enrollment.courseId === courseId
          );
          if (duplicate) {
            setError(isAr ? 'هذا الطالب مسجَّل بالفعل في هذا الكورس.' : 'This student is already enrolled in this course.');
            return;
          }
          onSubmit(studentId, courseId);
        }}
      >
        {error && <p className="text-[0.82rem] font-bold text-[#C0392B] dark:text-[#FCA5A5]">{error}</p>}
        <AdminField label={isAr ? 'الطالب' : 'Student'}>
          <select
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            className={adminFieldClass}
          >
            <option value="">{isAr ? 'اختر الطالب' : 'Select student'}</option>
            {activeStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label={isAr ? 'الكورس' : 'Course'}>
          <select
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            className={adminFieldClass}
          >
            <option value="">{isAr ? 'اختر الكورس' : 'Select course'}</option>
            {state.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {isAr ? course.titleAr : course.titleEn}
                {course.status === 'draft' ? (isAr ? ' (مسودة)' : ' (Draft)') : ''}
              </option>
            ))}
          </select>
        </AdminField>
        <p className="text-[0.76rem] text-[#94A3B8] dark:text-[#7E93A9]">
          {isAr
            ? 'محاكاة تسجيل تجريبي — لن يُنشأ أي اشتراك حقيقي أو عملية دفع.'
            : 'Simulated demo enrollment — no real subscription or payment is created.'}
        </p>
        <div className="flex items-center justify-end gap-2 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
          <button type="button" onClick={onClose} className={adminBtnClass('ghost')}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" className={adminBtnClass('primary', 'md')}>
            {isAr ? 'تسجيل' : 'Enroll'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
