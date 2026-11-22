import { BookPlus, Eye, Pencil, Plus, Search, UserRound, UserRoundCheck, UserRoundX } from 'lucide-react';
import { useState } from 'react';
import type {
  AdminDataState,
  AdminExamAttempt,
  AdminUser,
} from '../../types/admin';
import type { Locale } from '../../types/program';
import { formatAdminDate } from '../../utils/adminData';
import {
  createCompanyStudentState,
  getCompanyStudentSummary,
  getCompanyStudents,
  setCompanyStudentStatusState,
  updateCompanyStudentState,
  type CompanyStudentPatch,
} from '../../utils/companyData';
import {
  AdminAvatar,
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminField,
  AdminModal,
  adminBtnClass,
  adminFieldClass,
  ConfirmDialog,
} from '../admin/AdminUI';

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface CompanyStudentsPageProps {
  locale: Locale;
  state: AdminDataState;
  companyId: string;
  attempts: AdminExamAttempt[];
  update: UpdateFn;
  onOpenStudent: (studentId: string) => void;
  onAssignCourse: () => void;
}

type FormModalState = { student?: AdminUser } | null;

function generateDemoPassword(): string {
  return `madar-${Math.random().toString(36).slice(2, 8)}${Math.floor(Math.random() * 90 + 10)}`;
}

export function CompanyStudentsPage({
  locale,
  state,
  companyId,
  attempts,
  update,
  onOpenStudent,
  onAssignCourse,
}: CompanyStudentsPageProps) {
  const isAr = locale === 'ar';
  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState<FormModalState>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(null);

  // Core access-control rule: only students where companyId matches the
  // authenticated company are ever loaded into this view.
  const students = getCompanyStudents(state, companyId);
  const summaries = students.map((student) =>
    getCompanyStudentSummary(state, student.id, attempts)
  );

  const filtered = summaries.filter((summary) => {
    const query = search.trim().toLowerCase();
    return (
      !query ||
      summary.student.name.toLowerCase().includes(query) ||
      summary.student.email.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[1.25rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? 'طلاب الشركة' : 'Company Students'}
          </h1>
          <p className="mt-1 text-[0.84rem] text-[#64748B] dark:text-[#B8C7D9]">
            {isAr
              ? 'إدارة طلاب شركتك فقط — إضافة حسابات، متابعة التقدم، وإيقاف الحسابات عند الحاجة.'
              : 'Manage only your own students — create accounts, follow progress, and deactivate when needed.'}
          </p>
        </div>
        <div className="flex flex-none flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAssignCourse}
            className={adminBtnClass('ghost', 'md')}
          >
            <BookPlus className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'إضافة كورس لطالب' : 'Assign Course to Student'}
          </button>
          <button
            type="button"
            onClick={() => setFormModal({})}
            className={adminBtnClass('primary', 'md')}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'إضافة طالب' : 'Add Student'}
          </button>
        </div>
      </div>

      <AdminCard className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={isAr ? 'ابحث بالاسم أو البريد…' : 'Search by name or email…'}
              className={`${adminFieldClass} ps-9`}
            />
          </div>
          <span className="num ms-auto text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
            {filtered.length} / {students.length}
          </span>
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<UserRound className="h-5 w-5" aria-hidden="true" />}
          title={isAr ? 'لا يوجد طلاب مطابقون' : 'No matching students'}
          description={
            isAr
              ? students.length === 0
                ? 'أضف أول طالب لشركتك للبدء.'
                : 'جرّب تعديل عناصر البحث.'
              : students.length === 0
                ? 'Add your first company student to get started.'
                : 'Try adjusting the search.'
          }
        />
      ) : (
        <AdminCard>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-start">
              <thead>
                <tr>
                  {[
                    isAr ? 'الطالب' : 'Student',
                    isAr ? 'الكورسات' : 'Courses',
                    isAr ? 'التقدم الكلي' : 'Overall Progress',
                    isAr ? 'كورسات مكتملة' : 'Completed',
                    isAr ? 'الحالة' : 'Status',
                    isAr ? 'آخر نشاط' : 'Last Activity',
                    isAr ? 'إجراءات' : 'Actions',
                  ].map((label) => (
                    <th
                      key={label}
                      className="whitespace-nowrap border-b border-[#DCE7ED] bg-[#EAF3F6]/60 px-4 py-3 text-start text-[0.74rem] font-extrabold uppercase tracking-wide text-[#64748B] dark:border-white/12 dark:bg-[#102238]/60 dark:text-[#B8C7D9]"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((summary) => (
                  <tr
                    key={summary.student.id}
                    className="transition-colors hover:bg-[#EAF3F6]/40 dark:hover:bg-[#102238]/40"
                  >
                    <td className="border-b border-[#DCE7ED]/70 px-4 py-3 align-middle dark:border-white/8">
                      <div className="flex items-center gap-3">
                        <AdminAvatar name={summary.student.name} seed={summary.student.id} />
                        <div className="min-w-0">
                          <div className="truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                            {summary.student.name}
                          </div>
                          <div className="truncate text-[0.74rem] text-[#64748B] dark:text-[#B8C7D9]" dir="ltr">
                            {summary.student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="num border-b border-[#DCE7ED]/70 px-4 py-3 align-middle text-[0.84rem] font-bold text-[#183247] dark:border-white/8 dark:text-[#F1F5F9]">
                      {summary.enrolledCourses}
                    </td>
                    <td className="border-b border-[#DCE7ED]/70 px-4 py-3 align-middle dark:border-white/8">
                      <div className="flex items-center gap-2">
                        <span className="num text-[0.8rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                          {summary.overallProgressPct}%
                        </span>
                        <div className="h-[6px] w-[64px] overflow-hidden rounded-full bg-[#EAF3F6] dark:bg-[#102238]">
                          <div
                            className="h-full rounded-full bg-[#176B87] dark:bg-[#28B5C5]"
                            style={{
                              width: `${Math.max(0, Math.min(100, summary.overallProgressPct))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="num border-b border-[#DCE7ED]/70 px-4 py-3 align-middle text-[0.84rem] font-bold text-[#1F8A5B] dark:border-white/8 dark:text-[#6EE7B7]">
                      {summary.completedCourses}
                    </td>
                    <td className="border-b border-[#DCE7ED]/70 px-4 py-3 align-middle dark:border-white/8">
                      <AdminBadge tone={summary.student.status === 'active' ? 'success' : 'danger'}>
                        {summary.student.status === 'active'
                          ? isAr ? 'نشط' : 'Active'
                          : isAr ? 'موقوف' : 'Inactive'}
                      </AdminBadge>
                    </td>
                    <td className="num border-b border-[#DCE7ED]/70 px-4 py-3 align-middle text-[0.78rem] text-[#64748B] dark:border-white/8 dark:text-[#B8C7D9]">
                      {summary.lastActivityAt ? formatAdminDate(summary.lastActivityAt, locale) : '—'}
                    </td>
                    <td className="border-b border-[#DCE7ED]/70 px-4 py-3 align-middle dark:border-white/8">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenStudent(summary.student.id)}
                          aria-label={isAr ? 'عرض الطالب' : 'View student'}
                          title={isAr ? 'التفاصيل والتقدم' : 'Details & progress'}
                          className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormModal({ student: summary.student })}
                          aria-label={isAr ? 'تعديل الطالب' : 'Edit student'}
                          title={isAr ? 'تعديل' : 'Edit'}
                          className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeactivateTarget(summary.student)}
                          aria-label={
                            summary.student.status === 'active'
                              ? isAr ? 'إيقاف الحساب' : 'Deactivate account'
                              : isAr ? 'تنشيط الحساب' : 'Activate account'
                          }
                          title={
                            summary.student.status === 'active'
                              ? isAr ? 'إيقاف' : 'Deactivate'
                              : isAr ? 'تنشيط' : 'Activate'
                          }
                          className={`grid h-8 w-8 place-items-center rounded-[8px] ${
                            summary.student.status === 'active'
                              ? 'text-[#64748B] hover:bg-[#FCEBE9] hover:text-[#C0392B] dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5]'
                              : 'text-[#1F8A5B] hover:bg-[#E7F5EE] dark:text-[#6EE7B7]'
                          } cursor-pointer`}
                        >
                          {summary.student.status === 'active' ? (
                            <UserRoundX className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <UserRoundCheck className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {/* Add / edit student modal */}
      {formModal && (
        <CompanyStudentFormModal
          locale={locale}
          state={state}
          companyId={companyId}
          student={formModal.student}
          onClose={() => setFormModal(null)}
          onSubmit={(patch) => {
            const { name, email, password, phone } = patch;
            if (formModal.student) {
              update((prev) =>
                updateCompanyStudentState(prev, companyId, formModal.student!.id, {
                  name,
                  email,
                  phone,
                  password,
                })
              );
            } else if (name && email && password) {
              update((prev) =>
                createCompanyStudentState(prev, companyId, {
                  name,
                  email,
                  password,
                  phone,
                })
              );
            }
            setFormModal(null);
          }}
        />
      )}

      {/* Deactivate / activate confirmation */}
      {deactivateTarget && (
        <ConfirmDialog
          locale={locale}
          title={
            deactivateTarget.status === 'active'
              ? isAr ? 'إيقاف حساب الطالب' : 'Deactivate Student'
              : isAr ? 'تنشيط حساب الطالب' : 'Activate Student'
          }
          message={
            deactivateTarget.status === 'active'
              ? isAr
                ? `سيتم إيقاف حساب «${deactivateTarget.name}» ولن يتمكن من الدخول حتى إعادة تنشيطه. هل تريد المتابعة؟`
                : `The account "${deactivateTarget.name}" will be deactivated and cannot sign in until reactivated. Continue?`
              : isAr
                ? `سيتم تنشيط حساب «${deactivateTarget.name}» من جديد. هل تريد المتابعة؟`
                : `The account "${deactivateTarget.name}" will be reactivated. Continue?`
          }
          confirmLabel={
            deactivateTarget.status === 'active'
              ? isAr ? 'إيقاف الحساب' : 'Deactivate'
              : isAr ? 'تنشيط' : 'Activate'
          }
          onConfirm={() => {
            update((prev) =>
              setCompanyStudentStatusState(
                prev,
                companyId,
                deactivateTarget.id,
                deactivateTarget.status === 'active' ? 'inactive' : 'active'
              )
            );
            setDeactivateTarget(null);
          }}
          onCancel={() => setDeactivateTarget(null)}
        />
      )}
    </div>
  );
}


interface CompanyStudentFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
}

function CompanyStudentFormModal({
  locale,
  state,
  companyId,
  student,
  onClose,
  onSubmit,
}: {
  locale: Locale;
  state: AdminDataState;
  companyId: string;
  student?: AdminUser;
  onClose: () => void;
  onSubmit: (values: Partial<CompanyStudentFormValues> & CompanyStudentPatch) => void;
}) {
  const isAr = locale === 'ar';
  const [name, setName] = useState(student?.name ?? '');
  const [email, setEmail] = useState(student?.email ?? '');
  const [phone, setPhone] = useState(student?.phone ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const company = state.companies.find((item) => item.id === companyId);
  const companyNameLabel = company ? (isAr ? company.nameAr : company.nameEn) : '';

  const submit = () => {
    if (!name.trim()) {
      setError(isAr ? 'أدخل اسم الطالب الكامل.' : 'Enter the student full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(isAr ? 'أدخل بريدًا إلكترونيًا صحيحًا.' : 'Enter a valid email address.');
      return;
    }
    if (!student && password.trim().length < 4) {
      setError(
        isAr
          ? 'أدخل كلمة مرور مؤقتة (4 أحرف على الأقل) أو ولّد واحدة.'
          : 'Enter a temporary password (4+ characters) or generate one.'
      );
      return;
    }
    if (student && password.trim() && password.trim().length < 4) {
      setError(
        isAr
          ? 'كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل.'
          : 'New password must be at least 4 characters.'
      );
      return;
    }
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim() || undefined,
    });
  };

  return (
    <AdminModal
      title={
        student
          ? isAr ? 'تعديل بيانات الطالب' : 'Edit Student'
          : isAr ? 'إضافة طالب جديد' : 'Add New Student'
      }
      onClose={onClose}
      maxWidth="560px"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {error && (
          <p className="text-[0.82rem] font-bold text-[#C0392B] dark:text-[#FCA5A5]">{error}</p>
        )}
        <AdminField label={isAr ? 'اسم الطالب الكامل' : 'Student Full Name'}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={adminFieldClass}
          />
        </AdminField>
        <AdminField label={isAr ? 'البريد الإلكتروني' : 'Email Address'}>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={adminFieldClass}
            dir="ltr"
          />
        </AdminField>
        <AdminField label={isAr ? 'رقم الجوال (اختياري)' : 'Phone Number (optional)'}>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={adminFieldClass}
            dir="ltr"
          />
        </AdminField>
        <AdminField
          label={
            student
              ? isAr ? 'كلمة مرور جديدة (اختياري)' : 'New Password (optional)'
              : isAr ? 'كلمة المرور المؤقتة' : 'Temporary Password'
          }
          hint={
            student
              ? isAr ? 'اتركها فارغة للإبقاء على كلمة المرور الحالية' : 'Leave empty to keep the current password'
              : isAr ? 'شاركها مع الطالب لأول دخول' : 'Share it with the student for the first sign-in'
          }
        >
          <div className="flex gap-2">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={adminFieldClass}
              dir="ltr"
              placeholder={student ? '••••••' : ''}
            />
            <button
              type="button"
              onClick={() => setPassword(generateDemoPassword())}
              title={isAr ? 'توليد كلمة مرور مؤقتة' : 'Generate temporary password'}
              className="grid h-[42px] w-[42px] flex-none place-items-center rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[#176B87] hover:bg-[#DDF3F5] dark:border-white/12 dark:bg-[#102238] dark:text-[#28B5C5] cursor-pointer"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </AdminField>
        <p className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[0.78rem] font-semibold text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
          {isAr
            ? `الشركة المرتبطة: ${companyNameLabel} — تُسند تلقائيًا لحسابك ولا يمكن تغييرها.`
            : `Associated company: ${companyNameLabel} — assigned automatically to your account and cannot be changed.`}
        </p>
        <div className="flex items-center justify-end gap-2 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
          <button type="button" onClick={onClose} className={adminBtnClass('ghost')}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" className={adminBtnClass('primary', 'md')}>
            {student
              ? isAr ? 'حفظ التعديلات' : 'Save Changes'
              : isAr ? 'إنشاء الحساب' : 'Create Account'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
