import { Building2, Eye, KeyRound, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import type {
  AdminCompany,
  AdminDataState,
  AdminExamAttempt,
  AdminUser,
} from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  createCompanyState,
  deleteCompanyState,
  formatAdminDate,
  getCompanyStudentCount,
  setCompanyStatusState,
  updateCompanyState,
} from '../../utils/adminData';
import type { AdminAccountStatus } from '../../types/admin';
import {
  computeCompanyStats,
  getCompanyStudentSummary,
  getCompanyStudents,
} from '../../utils/companyData';
import {
  AdminAvatar,
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminField,
  AdminModal,
  AdminPageHeader,
  AdminSearchInput,
  AdminTableWrap,
  AdminTd,
  AdminTh,
  adminBtnClass,
  adminFieldClass,
  ConfirmDialog,
} from './AdminUI';

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface AdminCompaniesPageProps {
  locale: Locale;
  state: AdminDataState;
  update: UpdateFn;
  /** Exam attempts (owned by App) — used to show company student progress. */
  attempts?: AdminExamAttempt[];
}

type EditModalState = { company?: AdminCompany } | null;

function companyName(company: AdminCompany, isAr: boolean): string {
  return isAr ? company.nameAr : company.nameEn;
}

function generateDemoPassword(): string {
  return `madar-${Math.random().toString(36).slice(2, 8)}${Math.floor(Math.random() * 90 + 10)}`;
}

export function AdminCompaniesPage({
  locale,
  state,
  update,
  attempts = [],
}: AdminCompaniesPageProps) {
  const isAr = locale === 'ar';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editModal, setEditModal] = useState<EditModalState>(null);
  const [studentsCompany, setStudentsCompany] = useState<AdminCompany | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCompany | null>(null);

  const filtered = state.companies.filter((company) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      company.nameAr.toLowerCase().includes(query) ||
      company.nameEn.toLowerCase().includes(query) ||
      company.email.toLowerCase().includes(query);
    const matchesStatus = !statusFilter || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <AdminPageHeader
        title={isAr ? 'إدارة الشركات' : 'Company Management'}
        description={
          isAr
            ? 'إنشاء حسابات الشركات وإدارتها — تُنشأ الحسابات من هنا فقط، وتدير كل شركة طلابها من لوحتها الخاصة.'
            : 'Create and manage company accounts — accounts are created here only; each company manages its own students from its dashboard.'
        }
        action={
          <button
            type="button"
            onClick={() => setEditModal({})}
            className={adminBtnClass('primary', 'md')}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'إضافة شركة' : 'New Company'}
          </button>
        }
      />

      <AdminCard className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder={isAr ? 'ابحث بالاسم أو البريد…' : 'Search by name or email…'}
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-[42px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 text-[0.84rem] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
          >
            <option value="">{isAr ? 'كل الحالات' : 'All statuses'}</option>
            <option value="active">{isAr ? 'نشط' : 'Active'}</option>
            <option value="inactive">{isAr ? 'موقوف' : 'Inactive'}</option>
          </select>
          <span className="num ms-auto text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
            {filtered.length} / {state.companies.length}
          </span>
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<Building2 className="h-5 w-5" aria-hidden="true" />}
          title={isAr ? 'لا توجد شركات مطابقة' : 'No matching companies'}
          description={
            isAr
              ? 'أنشئ حساب شركة جديد أو عدّل عناصر البحث.'
              : 'Create a new company account or adjust the search.'
          }
        />
      ) : (
        <AdminCard>
          <AdminTableWrap>
            <thead>
              <tr>
                <AdminTh>{isAr ? 'الشركة' : 'Company'}</AdminTh>
                <AdminTh>{isAr ? 'الطلاب' : 'Students'}</AdminTh>
                <AdminTh>{isAr ? 'الحالة' : 'Status'}</AdminTh>
                <AdminTh>{isAr ? 'تاريخ الإنشاء' : 'Created'}</AdminTh>
                <AdminTh>{isAr ? 'إجراءات' : 'Actions'}</AdminTh>
              </tr>
            </thead>
            <tbody>
              {filtered.map((company) => (
                <tr
                  key={company.id}
                  className="transition-colors hover:bg-[#EAF3F6]/40 dark:hover:bg-[#102238]/40"
                >
                  <AdminTd>
                    <div className="flex items-center gap-3">
                      <AdminAvatar name={companyName(company, true)} seed={company.id} />
                      <div className="min-w-0">
                        <div className="truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                          {companyName(company, isAr)}
                        </div>
                        <div className="truncate text-[0.74rem] text-[#64748B] dark:text-[#B8C7D9]" dir="ltr">
                          {company.email}
                        </div>
                      </div>
                    </div>
                  </AdminTd>
                  <AdminTd className="num text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                    {getCompanyStudentCount(state, company.id)}
                  </AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      onClick={() =>
                        update((prev) =>
                          setCompanyStatusState(
                            prev,
                            company.id,
                            company.status === 'active' ? 'inactive' : 'active'
                          )
                        )
                      }
                      title={isAr ? 'تبديل حالة الحساب' : 'Toggle account status'}
                      className="cursor-pointer"
                    >
                      <AdminBadge tone={company.status === 'active' ? 'success' : 'danger'}>
                        {company.status === 'active'
                          ? isAr ? 'نشط' : 'Active'
                          : isAr ? 'موقوف' : 'Inactive'}
                      </AdminBadge>
                    </button>
                  </AdminTd>
                  <AdminTd className="num text-[0.78rem] text-[#64748B] dark:text-[#B8C7D9]">
                    {formatAdminDate(company.createdAt, locale)}
                  </AdminTd>
                  <AdminTd>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setStudentsCompany(company)}
                        aria-label={isAr ? 'طلاب الشركة' : 'Company students'}
                        title={isAr ? 'الطلاب والإحصائيات' : 'Students & stats'}
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditModal({ company })}
                        aria-label={isAr ? 'تعديل الشركة' : 'Edit company'}
                        title={isAr ? 'تعديل' : 'Edit'}
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(company)}
                        aria-label={isAr ? 'حذف الشركة' : 'Delete company'}
                        title={isAr ? 'حذف' : 'Delete'}
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#FCEBE9] hover:text-[#C0392B] dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5] cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTableWrap>
        </AdminCard>
      )}

      {/* Create / edit modal */}
      {editModal && (
        <CompanyFormModal
          locale={locale}
          state={state}
          company={editModal.company}
          onClose={() => setEditModal(null)}
          onSubmit={(input: {
            nameAr: string;
            nameEn: string;
            email: string;
            password: string;
            status: AdminAccountStatus;
          }) => {
            if (editModal.company) {
              update((prev) => updateCompanyState(prev, editModal.company!.id, input));
            } else {
              update((prev) => createCompanyState(prev, input));
            }
            setEditModal(null);
          }}
        />
      )}

      {/* Company students + stats modal */}
      {studentsCompany && (
        <CompanyStudentsModal
          locale={locale}
          state={state}
          company={studentsCompany}
          attempts={attempts}
          onClose={() => setStudentsCompany(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          locale={locale}
          title={isAr ? 'حذف حساب الشركة' : 'Delete Company Account'}
          message={
            isAr
              ? `سيتم حذف حساب «${companyName(deleteTarget, true)}» نهائيًا، وسيتحول طلابه إلى طلاب مستقلين دون فقدان اشتراكاتهم. هل تريد المتابعة؟`
              : `The company "${companyName(deleteTarget, false)}" will be permanently deleted, and its students will become independent (enrollments are kept). Continue?`
          }
          confirmLabel={isAr ? 'حذف نهائي' : 'Delete Permanently'}
          onConfirm={() => {
            update((prev) => deleteCompanyState(prev, deleteTarget.id));
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}


interface CompanyFormInput {
  nameAr: string;
  nameEn: string;
  email: string;
  password: string;
  status: 'active' | 'inactive';
}

function CompanyFormModal({
  locale,
  state,
  company,
  onClose,
  onSubmit,
}: {
  locale: Locale;
  state: AdminDataState;
  company?: AdminCompany;
  onClose: () => void;
  onSubmit: (input: CompanyFormInput) => void;
}) {
  const isAr = locale === 'ar';
  const [nameAr, setNameAr] = useState(company?.nameAr ?? '');
  const [nameEn, setNameEn] = useState(company?.nameEn ?? '');
  const [email, setEmail] = useState(company?.email ?? '');
  const [password, setPassword] = useState(company?.password ?? '');
  const [error, setError] = useState('');

  const submit = () => {
    if (!nameAr.trim() && !nameEn.trim()) {
      setError(isAr ? 'أدخل اسم الشركة.' : 'Enter the company name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(isAr ? 'أدخل بريدًا إلكترونيًا صحيحًا للشركة.' : 'Enter a valid company email.');
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const emailTaken = state.companies.some(
      (item) =>
        item.id !== company?.id && item.email.trim().toLowerCase() === normalizedEmail
    );
    if (emailTaken) {
      setError(isAr ? 'هذا البريد مستخدم لحساب شركة آخر.' : 'This email is used by another company.');
      return;
    }
    if (password.trim().length < 4) {
      setError(isAr ? 'كلمة المرور يجب أن تكون 4 أحرف على الأقل.' : 'Password must be at least 4 characters.');
      return;
    }
    onSubmit({
      nameAr: nameAr.trim() || nameEn.trim(),
      nameEn: nameEn.trim() || nameAr.trim(),
      email: email.trim(),
      password: password.trim(),
      status: company?.status ?? 'active',
    });
  };

  return (
    <AdminModal
      title={
        company
          ? isAr ? 'تعديل بيانات الشركة' : 'Edit Company'
          : isAr ? 'إضافة شركة جديدة' : 'New Company'
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
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label={isAr ? 'اسم الشركة (عربي)' : 'Company Name (Arabic)'}>
            <input
              value={nameAr}
              onChange={(event) => setNameAr(event.target.value)}
              className={adminFieldClass}
            />
          </AdminField>
          <AdminField label={isAr ? 'اسم الشركة (إنجليزي)' : 'Company Name (English)'}>
            <input
              value={nameEn}
              onChange={(event) => setNameEn(event.target.value)}
              className={adminFieldClass}
              dir="ltr"
            />
          </AdminField>
        </div>
        <AdminField
          label={isAr ? 'البريد الإلكتروني للشركة' : 'Company Email'}
          hint={isAr ? 'يُستخدم لتسجيل الدخول إلى لوحة الشركة' : 'Used to sign in to the company dashboard'}
        >
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={adminFieldClass}
            dir="ltr"
          />
        </AdminField>
        <AdminField
          label={isAr ? 'كلمة المرور' : 'Password'}
          hint={isAr ? 'كلمة مرور تجريبية تُسند للشركة عند الإنشاء' : 'Demo credentials assigned to the company'}
        >
          <div className="flex gap-2">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={adminFieldClass}
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setPassword(generateDemoPassword())}
              title={isAr ? 'توليد كلمة مرور' : 'Generate password'}
              className="grid h-[42px] w-[42px] flex-none place-items-center rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[#176B87] hover:bg-[#DDF3F5] dark:border-white/12 dark:bg-[#102238] dark:text-[#28B5C5] cursor-pointer"
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </AdminField>
        {!company && (
          <p className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[0.78rem] font-semibold text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
            {isAr
              ? 'تُنشأ حسابات الشركات من لوحة الإدارة فقط — لا يوجد تسجيل عام للشركات.'
              : 'Company accounts are created from the admin dashboard only — there is no public company registration.'}
          </p>
        )}
        <div className="flex items-center justify-end gap-2 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
          <button type="button" onClick={onClose} className={adminBtnClass('ghost')}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" className={adminBtnClass('primary', 'md')}>
            {company
              ? isAr ? 'حفظ التعديلات' : 'Save Changes'
              : isAr ? 'إنشاء الحساب' : 'Create Account'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}


function CompanyStudentsModal({
  locale,
  state,
  company,
  attempts,
  onClose,
}: {
  locale: Locale;
  state: AdminDataState;
  company: AdminCompany;
  attempts: AdminExamAttempt[];
  onClose: () => void;
}) {
  const isAr = locale === 'ar';
  const stats = computeCompanyStats(state, company.id, attempts);
  const students = getCompanyStudents(state, company.id);
  const summaries = useMemo(
    () => students.map((student) => getCompanyStudentSummary(state, student.id, attempts)),
    [state, company.id, attempts, students]
  );

  const statCards = [
    { labelAr: 'إجمالي الطلاب', labelEn: 'Total Students', value: String(stats.totalStudents) },
    { labelAr: 'الاشتراكات', labelEn: 'Enrollments', value: String(stats.totalEnrollments) },
    { labelAr: 'متوسط التقدم', labelEn: 'Avg Progress', value: `${stats.avgProgressPct}%` },
    { labelAr: 'كورسات مكتملة', labelEn: 'Completed Courses', value: String(stats.completedCourses) },
  ];

  return (
    <AdminModal
      title={`${isAr ? 'طلاب —' : 'Students —'} ${companyName(company, isAr)}`}
      onClose={onClose}
      maxWidth="780px"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.labelEn}
              className="rounded-[12px] border border-[#DCE7ED] bg-[#EAF3F6] p-3 dark:border-white/12 dark:bg-[#102238]"
            >
              <div className="num text-[1.15rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                {card.value}
              </div>
              <div className="text-[0.72rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                {isAr ? card.labelAr : card.labelEn}
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 ? (
          <p className="rounded-[12px] border border-dashed border-[#DCE7ED] px-4 py-6 text-center text-[0.82rem] text-[#94A3B8] dark:border-white/15">
            {isAr
              ? 'لا يوجد طلاب مرتبطون بهذه الشركة بعد.'
              : 'No students are associated with this company yet.'}
          </p>
        ) : (
          <AdminCard>
            <AdminTableWrap>
              <thead>
                <tr>
                  <AdminTh>{isAr ? 'الطالب' : 'Student'}</AdminTh>
                  <AdminTh>{isAr ? 'الحالة' : 'Status'}</AdminTh>
                  <AdminTh>{isAr ? 'الكورسات' : 'Courses'}</AdminTh>
                  <AdminTh>{isAr ? 'التقدم' : 'Progress'}</AdminTh>
                  <AdminTh>{isAr ? 'مكتملة' : 'Completed'}</AdminTh>
                  <AdminTh>{isAr ? 'اختبارات' : 'Exams'}</AdminTh>
                </tr>
              </thead>
              <tbody>
                {summaries.map((summary) => (
                  <tr key={summary.student.id}>
                    <AdminTd>
                      <div className="flex items-center gap-2.5">
                        <AdminAvatar name={summary.student.name} seed={summary.student.id} size="sm" />
                        <div className="min-w-0">
                          <div className="truncate text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                            {summary.student.name}
                          </div>
                          <div className="truncate text-[0.7rem] text-[#64748B] dark:text-[#B8C7D9]" dir="ltr">
                            {summary.student.email}
                          </div>
                        </div>
                      </div>
                    </AdminTd>
                    <AdminTd>
                      <AdminBadge tone={summary.student.status === 'active' ? 'success' : 'danger'}>
                        {summary.student.status === 'active'
                          ? isAr ? 'نشط' : 'Active'
                          : isAr ? 'موقوف' : 'Inactive'}
                      </AdminBadge>
                    </AdminTd>
                    <AdminTd className="num text-[0.82rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                      {summary.enrolledCourses}
                    </AdminTd>
                    <AdminTd className="num text-[0.82rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                      {summary.overallProgressPct}%
                    </AdminTd>
                    <AdminTd className="num text-[0.82rem] font-bold text-[#1F8A5B] dark:text-[#6EE7B7]">
                      {summary.completedCourses}
                    </AdminTd>
                    <AdminTd className="num text-[0.82rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                      {summary.passedExams + summary.failedExams}
                    </AdminTd>
                  </tr>
                ))}
              </tbody>
            </AdminTableWrap>
          </AdminCard>
        )}

        <p className="flex items-center gap-2 text-[0.76rem] text-[#94A3B8] dark:text-[#7E93A9]">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {isAr
            ? 'يمكن للإدارة إدارة طلاب الشركة من قسم المستخدمين مع فلترة حسب الشركة.'
            : 'Admins can manage company students from the Users section using the company filter.'}
        </p>
      </div>
    </AdminModal>
  );
}
