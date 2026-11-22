import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { AdminCourse, AdminDataState } from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  createCourseState,
  deleteCourseState,
  formatAdminDate,
  getAdminCourseStats,
  getAdminLevelLabel,
  setCourseStatusState,
  updateCourseState,
} from '../../utils/adminData';
import {
  AdminBadge,
  AdminCard,
  AdminEmptyState,
  AdminModal,
  AdminPageHeader,
  AdminSearchInput,
  AdminTd,
  AdminTh,
  AdminTableWrap,
  adminBtnClass,
  ConfirmDialog,
} from './AdminUI';
import { AdminCourseFormModal } from './AdminCourseFormModal';

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface AdminCoursesPageProps {
  locale: Locale;
  state: AdminDataState;
  update: UpdateFn;
  onEditCourse: (courseId: string) => void;
}

type FormModalState = { mode: 'create' } | { mode: 'edit'; courseId: string } | null;

export function AdminCoursesPage({ locale, state, update, onEditCourse }: AdminCoursesPageProps) {
  const isAr = locale === 'ar';
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formModal, setFormModal] = useState<FormModalState>(null);
  const [previewCourse, setPreviewCourse] = useState<AdminCourse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCourse | null>(null);

  const filtered = state.courses.filter((course) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      course.titleAr.toLowerCase().includes(query) ||
      course.titleEn.toLowerCase().includes(query);
    const matchesCategory = !categoryFilter || course.categoryId === categoryFilter;
    const matchesStatus = !statusFilter || course.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const editingCourse =
    formModal?.mode === 'edit' ? state.courses.find((c) => c.id === formModal.courseId) : undefined;

  const categoryName = (categoryId: string | null) => {
    const category = state.categories.find((item) => item.id === categoryId);
    return category ? (isAr ? category.nameAr : category.nameEn) : isAr ? 'بدون تصنيف' : 'Uncategorized';
  };
  const instructorName = (instructorId: string) =>
    state.users.find((user) => user.id === instructorId)?.name ?? '—';


  return (
    <div>
      <AdminPageHeader
        title={isAr ? 'إدارة الكورسات' : 'Course Management'}
        description={
          isAr
            ? 'إضافة وتعديل وحذف الكورسات التجريبية، وإدارة حالتها ومنهجها الدراسي.'
            : 'Create, edit, and delete demo courses, manage their status and curriculum.'
        }
        action={
          <button type="button" onClick={() => setFormModal({ mode: 'create' })} className={adminBtnClass('primary')}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'إضافة كورس' : 'New Course'}
          </button>
        }
      />

      {/* Filters */}
      <AdminCard className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder={isAr ? 'ابحث بعنوان الكورس…' : 'Search by course title…'}
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-[42px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 text-[0.84rem] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
          >
            <option value="">{isAr ? 'كل التصنيفات' : 'All categories'}</option>
            {state.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {isAr ? category.nameAr : category.nameEn}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-[42px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 text-[0.84rem] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
          >
            <option value="">{isAr ? 'كل الحالات' : 'All statuses'}</option>
            <option value="published">{isAr ? 'منشورة' : 'Published'}</option>
            <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
          </select>
          <span className="num ms-auto text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
            {filtered.length} / {state.courses.length}
          </span>
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<Eye className="h-5 w-5" aria-hidden="true" />}
          title={isAr ? 'لا توجد كورسات مطابقة' : 'No matching courses'}
          description={
            isAr
              ? 'جرّب تعديل عناصر البحث أو الفلاتر، أو أضف كورسًا جديدًا.'
              : 'Try adjusting the search or filters, or create a new course.'
          }
        />
      ) : (
        <AdminCard>
          <AdminTableWrap>
            <thead>
              <tr>
                <AdminTh>{isAr ? 'الكورس' : 'Course'}</AdminTh>
                <AdminTh>{isAr ? 'التصنيف' : 'Category'}</AdminTh>
                <AdminTh>{isAr ? 'السعر' : 'Price'}</AdminTh>
                <AdminTh>{isAr ? 'المنهج' : 'Curriculum'}</AdminTh>
                <AdminTh>{isAr ? 'الحالة' : 'Status'}</AdminTh>
                <AdminTh>{isAr ? 'آخر تحديث' : 'Updated'}</AdminTh>
                <AdminTh>{isAr ? 'إجراءات' : 'Actions'}</AdminTh>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => {
                const stats = getAdminCourseStats(course);
                return (
                  <tr key={course.id} className="transition-colors hover:bg-[#EAF3F6]/40 dark:hover:bg-[#102238]/40">
                    <AdminTd>
                      <div className="flex items-center gap-3">
                        <img src={course.image} alt="" className="h-11 w-16 flex-none rounded-[8px] object-cover" />
                        <div className="min-w-0">
                          <div className="truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                            {isAr ? course.titleAr : course.titleEn}
                          </div>
                          <div className="truncate text-[0.74rem] text-[#64748B] dark:text-[#B8C7D9]">
                            {instructorName(course.instructorId)} · {getAdminLevelLabel(course.level, locale)}
                          </div>
                        </div>
                      </div>
                    </AdminTd>
                    <AdminTd className="text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                      {categoryName(course.categoryId)}
                    </AdminTd>
                    <AdminTd className="num text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                      {course.price} {isAr ? 'ر.س' : 'SAR'}
                    </AdminTd>
                    <AdminTd className="num text-[0.8rem] text-[#64748B] dark:text-[#B8C7D9]">
                      {stats.sections} {isAr ? 'أقسام' : 'sec'} · {stats.lessons} {isAr ? 'دروس' : 'lessons'}
                    </AdminTd>
                    <AdminTd>
                      <button
                        type="button"
                        onClick={() =>
                          update((prev) =>
                            setCourseStatusState(
                              prev,
                              course.id,
                              course.status === 'published' ? 'draft' : 'published'
                            )
                          )
                        }
                        title={isAr ? 'تبديل الحالة' : 'Toggle status'}
                        className="cursor-pointer"
                      >
                        <AdminBadge tone={course.status === 'published' ? 'success' : 'warn'}>
                          {course.status === 'published' ? (isAr ? 'منشورة' : 'Published') : isAr ? 'مسودة' : 'Draft'}
                        </AdminBadge>
                      </button>
                    </AdminTd>
                    <AdminTd className="num text-[0.78rem] text-[#64748B] dark:text-[#B8C7D9]">
                      {formatAdminDate(course.updatedAt, locale)}
                    </AdminTd>
                    <AdminTd>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditCourse(course.id)}
                          aria-label={isAr ? 'تعديل الكورس' : 'Edit course'}
                          title={isAr ? 'تعديل' : 'Edit'}
                          className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewCourse(course)}
                          aria-label={isAr ? 'معاينة الكورس' : 'Preview course'}
                          title={isAr ? 'معاينة' : 'Preview'}
                          className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(course)}
                          aria-label={isAr ? 'حذف الكورس' : 'Delete course'}
                          title={isAr ? 'حذف' : 'Delete'}
                          className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#FCEBE9] hover:text-[#C0392B] dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5] cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </AdminTd>
                  </tr>
                );
              })}
            </tbody>
          </AdminTableWrap>
        </AdminCard>
      )}

      {/* Create / edit form */}
      {formModal && (
        <AdminCourseFormModal
          locale={locale}
          state={state}
          defaultStatus="draft"
          course={editingCourse}
          onClose={() => setFormModal(null)}
          onSubmit={(values) => {
            if (formModal.mode === 'edit') {
              update((prev) => updateCourseState(prev, formModal.courseId, values));
            } else {
              let createdId = '';
              update((prev) => {
                const next = createCourseState(prev, values);
                createdId = next.courses[0].id;
                return next;
              });
              setFormModal(null);
              onEditCourse(createdId);
              return;
            }
            setFormModal(null);
          }}
        />
      )}

      {/* Preview modal */}
      {previewCourse && (
        <CoursePreviewModal locale={locale} course={previewCourse} state={state} onClose={() => setPreviewCourse(null)} />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          locale={locale}
          title={isAr ? 'حذف الكورس' : 'Delete Course'}
          message={
            isAr
              ? `سيتم حذف الكورس «${deleteTarget.titleAr}» وجميع اشتراكاته من البيانات التجريبية نهائيًا. هل تريد المتابعة؟`
              : `The course "${deleteTarget.titleEn}" and all its enrollments will be permanently removed from the demo data. Continue?`
          }
          confirmLabel={isAr ? 'حذف نهائي' : 'Delete Permanently'}
          onConfirm={() => {
            update((prev) => deleteCourseState(prev, deleteTarget.id));
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}


function CoursePreviewModal({
  locale,
  course,
  state,
  onClose,
}: {
  locale: Locale;
  course: AdminCourse;
  state: AdminDataState;
  onClose: () => void;
}) {
  const isAr = locale === 'ar';
  const stats = getAdminCourseStats(course);
  const instructor = state.users.find((user) => user.id === course.instructorId);
  const category = state.categories.find((item) => item.id === course.categoryId);

  return (
    <AdminModal title={isAr ? 'معاينة الكورس' : 'Course Preview'} onClose={onClose} maxWidth="600px">
      <div className="space-y-4">
        <div className="relative h-[170px] overflow-hidden rounded-[14px] border border-[#DCE7ED] dark:border-white/12">
          <img src={course.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-3 start-3 flex items-center gap-2">
            <AdminBadge tone={course.status === 'published' ? 'success' : 'warn'}>
              {course.status === 'published' ? (isAr ? 'منشورة' : 'Published') : isAr ? 'مسودة' : 'Draft'}
            </AdminBadge>
            <AdminBadge tone="brand">{getAdminLevelLabel(course.level, locale)}</AdminBadge>
          </div>
        </div>

        <div>
          <h3 className="text-[1.1rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? course.titleAr : course.titleEn}
          </h3>
          <p className="mt-1.5 text-[0.88rem] leading-[1.85] text-[#64748B] dark:text-[#B8C7D9]">
            {isAr ? course.descriptionAr : course.descriptionEn}
          </p>
        </div>

        <div className="num grid grid-cols-2 gap-2 text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9] sm:grid-cols-4">
          <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 dark:bg-[#102238]">
            {stats.lessons} {isAr ? 'دروس' : 'lessons'}
          </span>
          <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 dark:bg-[#102238]">
            {stats.sections} {isAr ? 'أقسام' : 'sections'}
          </span>
          <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 dark:bg-[#102238]">
            {course.price} {isAr ? 'ر.س' : 'SAR'}
          </span>
          <span className="rounded-[10px] bg-[#EAF3F6] px-3 py-2 dark:bg-[#102238]">
            {formatAdminDate(course.updatedAt, locale)}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
          <span>
            {isAr ? 'المدرّب:' : 'Instructor:'}{' '}
            <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">{instructor?.name ?? '—'}</span>
          </span>
          <span>
            {isAr ? 'التصنيف:' : 'Category:'}{' '}
            <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">
              {category ? (isAr ? category.nameAr : category.nameEn) : isAr ? 'بدون تصنيف' : 'Uncategorized'}
            </span>
          </span>
        </div>

        <div className="space-y-2 border-t border-[#DCE7ED] pt-3 dark:border-white/12">
          <h4 className="text-[0.88rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? 'المنهج' : 'Curriculum'}
          </h4>
          {course.sections.map((section, index) => (
            <div key={section.id} className="rounded-[12px] border border-[#DCE7ED] dark:border-white/12">
              <div className="border-b border-[#DCE7ED] bg-[#EAF3F6]/60 px-3 py-2 text-[0.82rem] font-bold text-[#142D4E] dark:border-white/12 dark:bg-[#102238]/60 dark:text-[#F1F5F9]">
                {isAr ? `القسم ${index + 1}: ` : `Section ${index + 1}: `}
                {isAr ? section.titleAr : section.titleEn}
              </div>
              <ul className="divide-y divide-[#DCE7ED]/60 dark:divide-white/8">
                {section.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center gap-2 px-3 py-2 text-[0.8rem]">
                    <span className="min-w-0 flex-1 truncate font-semibold text-[#183247] dark:text-[#B8C7D9]">
                      {isAr ? lesson.titleAr : lesson.titleEn}
                    </span>
                    {lesson.isPreview && (
                      <AdminBadge tone="success">{isAr ? 'معاينة' : 'Preview'}</AdminBadge>
                    )}
                    <span className="num flex-none text-[0.72rem] text-[#64748B] dark:text-[#7E93A9]">
                      {lesson.durationMinutes} {isAr ? 'د' : 'min'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </AdminModal>
  );
}
