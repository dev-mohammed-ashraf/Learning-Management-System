import { Eye, Search, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AdminDataState } from '../../types/admin';
import type { Locale } from '../../types/program';
import { formatAdminDate } from '../../utils/adminData';
import { getCompanyPurchaseHistory } from '../../utils/companyData';
import {
  AdminAvatar,
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminTableWrap,
  AdminTd,
  AdminTh,
  adminBtnClass,
  adminFieldClass,
} from '../admin/AdminUI';

interface CompanyPurchasesPageProps {
  locale: Locale;
  state: AdminDataState;
  companyId: string;
  onOpenStudent: (studentId: string) => void;
  onAssignCourse: () => void;
}

/**
 * Company-scoped course purchase history. Data comes from
 * `getCompanyPurchaseHistory`, which only ever returns enrollments belonging
 * to the authenticated company's own students.
 */
export function CompanyPurchasesPage({
  locale,
  state,
  companyId,
  onOpenStudent,
  onAssignCourse,
}: CompanyPurchasesPageProps) {
  const isAr = locale === 'ar';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const history = useMemo(
    () => getCompanyPurchaseHistory(state, companyId),
    [state, companyId]
  );

  const totalSpent = history.reduce(
    (sum, record) =>
      sum + (record.enrollment.source === 'company-purchase' ? record.price ?? 0 : 0),
    0
  );

  const filtered = history.filter((record) => {
    const query = search.trim().toLowerCase();
    const studentName = (record.student?.name ?? '').toLowerCase();
    const studentEmail = (record.student?.email ?? '').toLowerCase();
    const courseTitle = record.course
      ? `${record.course.titleAr} ${record.course.titleEn}`.toLowerCase()
      : '';
    const matchesSearch =
      !query ||
      studentName.includes(query) ||
      studentEmail.includes(query) ||
      courseTitle.includes(query);
    const matchesStatus = !statusFilter || record.enrollment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[1.25rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? 'سجل شراء الكورسات' : 'Course Purchase History'}
          </h1>
          <p className="mt-1 text-[0.84rem] text-[#64748B] dark:text-[#B8C7D9]">
            {isAr
              ? 'الكورسات التي اشترتها شركتك لطلابها، مع السعر وتاريخ الشراء وحالة الاشتراك.'
              : 'Courses your company purchased for its students, with price, purchase date, and enrollment status.'}
          </p>
        </div>
        <button type="button" onClick={onAssignCourse} className={adminBtnClass('primary', 'md')}>
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          {isAr ? 'إضافة كورس لطالب' : 'Assign Course to Student'}
        </button>
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
              placeholder={isAr ? 'ابحث باسم الطالب أو الكورس…' : 'Search by student or course…'}
              className={`${adminFieldClass} ps-9`}
            />
          </div>
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
            {filtered.length} / {history.length}
            {totalSpent > 0 &&
              ` · ${isAr ? 'إجمالي الشراء' : 'total spent'} ${totalSpent.toLocaleString('en-US')} ${
                isAr ? 'ر.س' : 'SAR'
              }`}
          </span>
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<ShoppingBag className="h-5 w-5" aria-hidden="true" />}
          title={
            history.length === 0
              ? isAr
                ? 'لا توجد مشتريات بعد'
                : 'No purchases yet'
              : isAr
                ? 'لا توجد مشتريات مطابقة'
                : 'No matching purchases'
          }
          description={
            history.length === 0
              ? isAr
                ? 'استخدم زر «إضافة كورس لطالب» لشراء أول كورس لأحد طلاب شركتك.'
                : 'Use the “Assign Course to Student” button to purchase the first course for one of your students.'
              : isAr
                ? 'جرّب تعديل عناصر البحث أو الفلاتر.'
                : 'Try adjusting the search or filters.'
          }
        />
      ) : (
        <AdminCard>
          <AdminTableWrap>
            <thead>
              <tr>
                <AdminTh>{isAr ? 'الطالب' : 'Student'}</AdminTh>
                <AdminTh>{isAr ? 'الكورس' : 'Course'}</AdminTh>
                <AdminTh>{isAr ? 'السعر' : 'Price'}</AdminTh>
                <AdminTh>{isAr ? 'تاريخ الشراء' : 'Purchase Date'}</AdminTh>
                <AdminTh>{isAr ? 'الحالة' : 'Status'}</AdminTh>
                <AdminTh>{isAr ? 'إجراءات' : 'Actions'}</AdminTh>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr
                  key={record.enrollment.id}
                  className="transition-colors hover:bg-[#EAF3F6]/40 dark:hover:bg-[#102238]/40"
                >
                  <AdminTd>
                    <div className="flex items-center gap-3">
                      <AdminAvatar
                        name={record.student?.name ?? '؟'}
                        seed={record.enrollment.studentId}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                          {record.student?.name ?? record.enrollment.studentId}
                        </div>
                        <div
                          className="truncate text-[0.74rem] text-[#64748B] dark:text-[#B8C7D9]"
                          dir="ltr"
                        >
                          {record.student?.email ?? '—'}
                        </div>
                      </div>
                    </div>
                  </AdminTd>
                  <AdminTd className="max-w-[260px] truncate text-[0.84rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                    {record.course
                      ? isAr
                        ? record.course.titleAr
                        : record.course.titleEn
                      : record.enrollment.courseId}
                  </AdminTd>
                  <AdminTd className="num text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                    {record.price !== null
                      ? `${record.price.toLocaleString('en-US')} ${isAr ? 'ر.س' : 'SAR'}`
                      : '—'}
                  </AdminTd>
                  <AdminTd className="num text-[0.78rem] text-[#64748B] dark:text-[#B8C7D9]">
                    {formatAdminDate(
                      record.enrollment.purchasedAt ?? record.enrollment.enrolledAt,
                      locale
                    )}
                  </AdminTd>
                  <AdminTd>
                    <AdminBadge
                      tone={record.enrollment.status === 'completed' ? 'success' : 'cyan'}
                    >
                      {record.enrollment.status === 'completed'
                        ? isAr
                          ? 'مكتمل'
                          : 'Completed'
                        : isAr
                          ? 'نشط'
                          : 'Active'}
                    </AdminBadge>
                  </AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      onClick={() => onOpenStudent(record.enrollment.studentId)}
                      aria-label={isAr ? 'عرض الطالب' : 'View student'}
                      title={isAr ? 'ملف الطالب والتقدم' : 'Student profile & progress'}
                      className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTableWrap>
        </AdminCard>
      )}
    </div>
  );
}