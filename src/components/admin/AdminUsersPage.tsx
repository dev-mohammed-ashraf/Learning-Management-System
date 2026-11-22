import { Pencil, Trash2, UserRound, Eye } from 'lucide-react';
import { useState } from 'react';
import type { AdminDataState, AdminUser, AdminUserRole } from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  countUserEnrollments,
  deleteUserState,
  formatAdminDate,
  updateUserState,
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

interface AdminUsersPageProps {
  locale: Locale;
  state: AdminDataState;
  update: UpdateFn;
}

type EditModalState = { user: AdminUser } | null;

export function AdminUsersPage({ locale, state, update }: AdminUsersPageProps) {
  const isAr = locale === 'ar';
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [detailsUser, setDetailsUser] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<EditModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const filtered = state.users.filter((user) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesCompany =
      !companyFilter ||
      (companyFilter === '__independent__' ? !user.companyId : user.companyId === companyFilter);
    return matchesSearch && matchesRole && matchesStatus && matchesCompany;
  });

  const companyById = (companyId?: string) =>
    companyId ? state.companies.find((company) => company.id === companyId) ?? null : null;


  return (
    <div>
      <AdminPageHeader
        title={isAr ? 'إدارة المستخدمين' : 'User Management'}
        description={
          isAr
            ? 'عرض حسابات المستخدمين التجريبية وتعديل أدوارها وحالاتها.'
            : 'View demo user accounts and manage their roles and status.'
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
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="h-[42px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 text-[0.84rem] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
          >
            <option value="">{isAr ? 'كل الأدوار' : 'All roles'}</option>
            <option value="admin">{isAr ? 'مدير' : 'Admin'}</option>
            <option value="instructor">{isAr ? 'مدرّب' : 'Instructor'}</option>
            <option value="student">{isAr ? 'طالب' : 'Student'}</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-[42px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 text-[0.84rem] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
          >
            <option value="">{isAr ? 'كل الحالات' : 'All statuses'}</option>
            <option value="active">{isAr ? 'نشط' : 'Active'}</option>
            <option value="inactive">{isAr ? 'موقوف' : 'Inactive'}</option>
          </select>
          <select
            value={companyFilter}
            onChange={(event) => setCompanyFilter(event.target.value)}
            className="h-[42px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 text-[0.84rem] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
            aria-label={isAr ? 'فلترة حسب الشركة' : 'Filter by company'}
          >
            <option value="">{isAr ? 'كل الشركات' : 'All companies'}</option>
            <option value="__independent__">
              {isAr ? 'طلاب مستقلون (بدون شركة)' : 'Independent (no company)'}
            </option>
            {state.companies.map((company) => (
              <option key={company.id} value={company.id}>
                {isAr ? company.nameAr : company.nameEn}
              </option>
            ))}
          </select>
          <span className="num ms-auto text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
            {filtered.length} / {state.users.length}
          </span>
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<UserRound className="h-5 w-5" aria-hidden="true" />}
          title={isAr ? 'لا يوجد مستخدمون مطابقون' : 'No matching users'}
          description={isAr ? 'جرّب تعديل عناصر البحث أو الفلاتر.' : 'Try adjusting the search or filters.'}
        />
      ) : (
        <AdminCard>
          <AdminTableWrap>
            <thead>
              <tr>
                <AdminTh>{isAr ? 'المستخدم' : 'User'}</AdminTh>
                <AdminTh>{isAr ? 'الدور' : 'Role'}</AdminTh>
                <AdminTh>{isAr ? 'الشركة' : 'Company'}</AdminTh>
                <AdminTh>{isAr ? 'الحالة' : 'Status'}</AdminTh>
                <AdminTh>{isAr ? 'الاشتراكات' : 'Enrollments'}</AdminTh>
                <AdminTh>{isAr ? 'تاريخ التسجيل' : 'Registered'}</AdminTh>
                <AdminTh>{isAr ? 'إجراءات' : 'Actions'}</AdminTh>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-[#EAF3F6]/40 dark:hover:bg-[#102238]/40">
                  <AdminTd>
                    <div className="flex items-center gap-3">
                      <AdminAvatar name={user.name} seed={user.id} />
                      <div className="min-w-0">
                        <div className="truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                          {user.name}
                        </div>
                        <div className="truncate text-[0.74rem] text-[#64748B] dark:text-[#B8C7D9]" dir="ltr">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </AdminTd>
                  <AdminTd>
                    <AdminBadge
                      tone={user.role === 'admin' ? 'cyan' : user.role === 'instructor' ? 'brand' : 'neutral'}
                    >
                      {user.role === 'admin'
                        ? isAr
                          ? 'مدير'
                          : 'Admin'
                        : user.role === 'instructor'
                          ? isAr
                            ? 'مدرّب'
                            : 'Instructor'
                          : isAr
                            ? 'طالب'
                            : 'Student'}
                    </AdminBadge>
                  </AdminTd>
                  <AdminTd>
                    {user.companyId ? (
                      <AdminBadge tone="cyan">
                        {(() => {
                          const company = companyById(user.companyId);
                          return company
                            ? isAr ? company.nameAr : company.nameEn
                            : isAr ? 'شركة محذوفة' : 'Removed company';
                        })()}
                      </AdminBadge>
                    ) : (
                      <span className="text-[0.78rem] font-semibold text-[#94A3B8]">
                        {isAr ? 'مستقل' : 'Independent'}
                      </span>
                    )}
                  </AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      onClick={() =>
                        update((prev) =>
                          updateUserState(prev, user.id, {
                            status: user.status === 'active' ? 'inactive' : 'active',
                          })
                        )
                      }
                      title={isAr ? 'تبديل حالة الحساب' : 'Toggle account status'}
                      className="cursor-pointer"
                    >
                      <AdminBadge tone={user.status === 'active' ? 'success' : 'danger'}>
                        {user.status === 'active' ? (isAr ? 'نشط' : 'Active') : isAr ? 'موقوف' : 'Inactive'}
                      </AdminBadge>
                    </button>
                  </AdminTd>
                  <AdminTd className="num text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                    {countUserEnrollments(state, user.id)}
                  </AdminTd>
                  <AdminTd className="num text-[0.78rem] text-[#64748B] dark:text-[#B8C7D9]">
                    {formatAdminDate(user.registeredAt, locale)}
                  </AdminTd>
                  <AdminTd>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDetailsUser(user)}
                        aria-label={isAr ? 'تفاصيل المستخدم' : 'View user details'}
                        title={isAr ? 'تفاصيل' : 'Details'}
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditUser({ user })}
                        aria-label={isAr ? 'تعديل المستخدم' : 'Edit user'}
                        title={isAr ? 'تعديل' : 'Edit'}
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(user)}
                        aria-label={isAr ? 'حذف المستخدم' : 'Delete user'}
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

      {/* Details modal */}
      {detailsUser && (
        <AdminModal
          title={isAr ? 'تفاصيل المستخدم' : 'User Details'}
          onClose={() => setDetailsUser(null)}
          maxWidth="480px"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <AdminAvatar name={detailsUser.name} seed={detailsUser.id} size="lg" />
              <div className="min-w-0">
                <div className="truncate text-[1.05rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                  {detailsUser.name}
                </div>
                <div className="truncate text-[0.82rem] text-[#64748B] dark:text-[#B8C7D9]" dir="ltr">
                  {detailsUser.email}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[0.82rem] font-semibold">
              <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
                {isAr ? 'الدور:' : 'Role:'}{' '}
                <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">
                  {detailsUser.role === 'admin'
                    ? isAr
                      ? 'مدير'
                      : 'Admin'
                    : detailsUser.role === 'instructor'
                      ? isAr
                        ? 'مدرّب'
                        : 'Instructor'
                      : isAr
                        ? 'طالب'
                        : 'Student'}
                </span>
              </span>
              <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
                {isAr ? 'الحالة:' : 'Status:'}{' '}
                <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">
                  {detailsUser.status === 'active' ? (isAr ? 'نشط' : 'Active') : isAr ? 'موقوف' : 'Inactive'}
                </span>
              </span>
              <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
                {isAr ? 'الشركة:' : 'Company:'}{' '}
                <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">
                  {(() => {
                    if (!detailsUser.companyId) return isAr ? 'مستقل' : 'Independent';
                    const company = companyById(detailsUser.companyId);
                    return company
                      ? isAr ? company.nameAr : company.nameEn
                      : isAr ? 'شركة محذوفة' : 'Removed company';
                  })()}
                </span>
              </span>
              <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
                {isAr ? 'التسجيل:' : 'Registered:'}{' '}
                <span className="num font-bold text-[#183247] dark:text-[#F1F5F9]">
                  {formatAdminDate(detailsUser.registeredAt, locale)}
                </span>
              </span>
              <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]">
                {isAr ? 'الاشتراكات:' : 'Enrollments:'}{' '}
                <span className="num font-bold text-[#183247] dark:text-[#F1F5F9]">
                  {countUserEnrollments(state, detailsUser.id)}
                </span>
              </span>
            </div>
            <div className="border-t border-[#DCE7ED] pt-3 dark:border-white/12">
              <h4 className="mb-2 text-[0.86rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                {isAr ? 'الكورسات المسجَّل بها' : 'Enrolled Courses'}
              </h4>
              {state.enrollments.filter((e) => e.studentId === detailsUser.id).length === 0 ? (
                <p className="text-[0.8rem] text-[#94A3B8]">
                  {isAr ? 'لا توجد اشتراكات.' : 'No enrollments.'}
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {state.enrollments
                    .filter((e) => e.studentId === detailsUser.id)
                    .map((enrollment) => {
                      const course = state.courses.find((item) => item.id === enrollment.courseId);
                      return (
                        <li
                          key={enrollment.id}
                          className="flex items-center justify-between gap-2 rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[0.8rem] dark:bg-[#102238]"
                        >
                          <span className="min-w-0 truncate font-bold text-[#183247] dark:text-[#F1F5F9]">
                            {course ? (isAr ? course.titleAr : course.titleEn) : enrollment.courseId}
                          </span>
                          <span className="num flex-none text-[0.74rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                            {enrollment.progressPct}%
                          </span>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          </div>
        </AdminModal>
      )}

      {/* Edit modal */}
      {editUser && (
        <UserEditModal
          locale={locale}
          user={editUser.user}
          onClose={() => setEditUser(null)}
          onSubmit={(patch) => {
            update((prev) => updateUserState(prev, editUser.user.id, patch));
            setEditUser(null);
          }}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          locale={locale}
          title={isAr ? 'حذف الحساب' : 'Delete Account'}
          message={
            isAr
              ? `سيتم حذف حساب «${deleteTarget.name}» وجميع اشتراكاته من البيانات التجريبية نهائيًا. هل تريد المتابعة؟`
              : `The account "${deleteTarget.name}" and all its enrollments will be permanently removed from the demo data. Continue?`
          }
          confirmLabel={isAr ? 'حذف نهائي' : 'Delete Permanently'}
          onConfirm={() => {
            update((prev) => deleteUserState(prev, deleteTarget.id));
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}


function UserEditModal({
  locale,
  user,
  onClose,
  onSubmit,
}: {
  locale: Locale;
  user: AdminUser;
  onClose: () => void;
  onSubmit: (patch: { name: string; email: string; role: AdminUserRole; status: 'active' | 'inactive' }) => void;
}) {
  const isAr = locale === 'ar';
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<AdminUserRole>(user.role);
  const [status, setStatus] = useState<'active' | 'inactive'>(user.status);
  const [error, setError] = useState('');

  return (
    <AdminModal title={isAr ? 'تعديل بيانات المستخدم' : 'Edit User'} onClose={onClose} maxWidth="480px">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim() || !email.trim()) {
            setError(isAr ? 'الاسم والبريد مطلوبان.' : 'Name and email are required.');
            return;
          }
          onSubmit({ name: name.trim(), email: email.trim(), role, status });
        }}
      >
        {error && <p className="text-[0.82rem] font-bold text-[#C0392B] dark:text-[#FCA5A5]">{error}</p>}
        <AdminField label={isAr ? 'الاسم' : 'Name'}>
          <input value={name} onChange={(event) => setName(event.target.value)} className={adminFieldClass} />
        </AdminField>
        <AdminField label={isAr ? 'البريد الإلكتروني' : 'Email'}>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={adminFieldClass}
            dir="ltr"
            type="email"
          />
        </AdminField>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label={isAr ? 'الدور' : 'Role'}>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AdminUserRole)}
              className={adminFieldClass}
            >
              <option value="admin">{isAr ? 'مدير' : 'Admin'}</option>
              <option value="instructor">{isAr ? 'مدرّب' : 'Instructor'}</option>
              <option value="student">{isAr ? 'طالب' : 'Student'}</option>
            </select>
          </AdminField>
          <AdminField label={isAr ? 'حالة الحساب' : 'Account Status'}>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as 'active' | 'inactive')}
              className={adminFieldClass}
            >
              <option value="active">{isAr ? 'نشط' : 'Active'}</option>
              <option value="inactive">{isAr ? 'موقوف' : 'Inactive'}</option>
            </select>
          </AdminField>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
          <button type="button" onClick={onClose} className={adminBtnClass('ghost')}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" className={adminBtnClass('primary', 'md')}>
            {isAr ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
