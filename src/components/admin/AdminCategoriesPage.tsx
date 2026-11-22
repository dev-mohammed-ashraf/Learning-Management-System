import { Pencil, Plus, Shapes, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { AdminCategory, AdminDataState } from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  addCategoryState,
  deleteCategoryState,
  getCategoryCourseCounts,
  updateCategoryState,
} from '../../utils/adminData';
import {
  AdminCard,
  AdminField,
  AdminModal,
  AdminPageHeader,
  adminBtnClass,
  adminFieldClass,
  ConfirmDialog,
} from './AdminUI';

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface AdminCategoriesPageProps {
  locale: Locale;
  state: AdminDataState;
  update: UpdateFn;
}

export function AdminCategoriesPage({ locale, state, update }: AdminCategoriesPageProps) {
  const isAr = locale === 'ar';
  const courseCounts = getCategoryCourseCounts(state);
  const [formModal, setFormModal] = useState<{ mode: 'create' } | { mode: 'edit'; category: AdminCategory } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  return (
    <div>
      <AdminPageHeader
        title={isAr ? 'تصنيفات الكورسات' : 'Course Categories'}
        description={
          isAr
            ? 'إدارة تصنيفات الكورسات التجريبية: الإضافة والتعديل والحذف مع عدّاد للكورسات.'
            : 'Manage demo course categories: create, edit, and delete with course counters.'
        }
        action={
          <button type="button" onClick={() => setFormModal({ mode: 'create' })} className={adminBtnClass('primary')}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'إضافة تصنيف' : 'New Category'}
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {state.categories.map((category) => (
          <AdminCard key={category.id} className="flex flex-col p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <span
                className="grid h-12 w-12 flex-none place-items-center rounded-[12px] bg-[#EAF3F6] text-[1.5rem] dark:bg-[#102238]"
                aria-hidden="true"
              >
                {category.icon}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFormModal({ mode: 'edit', category })}
                  aria-label={isAr ? 'تعديل التصنيف' : 'Edit category'}
                  title={isAr ? 'تعديل' : 'Edit'}
                  className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(category)}
                  aria-label={isAr ? 'حذف التصنيف' : 'Delete category'}
                  title={isAr ? 'حذف' : 'Delete'}
                  className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#FCEBE9] hover:text-[#C0392B] dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5] cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <h3 className="text-[0.98rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? category.nameAr : category.nameEn}
            </h3>
            <p className="mt-1 flex-1 text-[0.8rem] leading-relaxed text-[#64748B] dark:text-[#B8C7D9]">
              {isAr ? category.descriptionAr : category.descriptionEn}
            </p>
            <div className="num mt-3 border-t border-[#DCE7ED] pt-3 text-[0.78rem] font-bold text-[#176B87] dark:border-white/12 dark:text-[#28B5C5]">
              {courseCounts[category.id] ?? 0} {isAr ? 'كورسات مرتبطة' : 'linked courses'}
            </div>
          </AdminCard>
        ))}
      </div>

      {formModal && (
        <CategoryFormModal
          locale={locale}
          category={formModal.mode === 'edit' ? formModal.category : undefined}
          onClose={() => setFormModal(null)}
          onSubmit={(values) => {
            if (formModal.mode === 'edit') {
              update((prev) => updateCategoryState(prev, formModal.category.id, values));
            } else {
              update((prev) => addCategoryState(prev, values));
            }
            setFormModal(null);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          locale={locale}
          title={isAr ? 'حذف التصنيف' : 'Delete Category'}
          message={
            isAr
              ? `سيتم حذف تصنيف «${deleteTarget.nameAr}» وتصبح الكورسات المرتبطة به «بدون تصنيف». هل تريد المتابعة؟`
              : `The category "${deleteTarget.nameEn}" will be deleted and its courses will become uncategorized. Continue?`
          }
          confirmLabel={isAr ? 'حذف نهائي' : 'Delete Permanently'}
          onConfirm={() => {
            update((prev) => deleteCategoryState(prev, deleteTarget.id));
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}


function CategoryFormModal({
  locale,
  category,
  onClose,
  onSubmit,
}: {
  locale: Locale;
  category?: AdminCategory;
  onClose: () => void;
  onSubmit: (values: {
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    icon: string;
  }) => void;
}) {
  const isAr = locale === 'ar';
  const [nameAr, setNameAr] = useState(category?.nameAr ?? '');
  const [nameEn, setNameEn] = useState(category?.nameEn ?? '');
  const [descriptionAr, setDescriptionAr] = useState(category?.descriptionAr ?? '');
  const [descriptionEn, setDescriptionEn] = useState(category?.descriptionEn ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '📚');
  const [error, setError] = useState('');

  return (
    <AdminModal
      title={category ? (isAr ? 'تعديل التصنيف' : 'Edit Category') : isAr ? 'إضافة تصنيف' : 'New Category'}
      onClose={onClose}
      maxWidth="480px"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!nameAr.trim() && !nameEn.trim()) {
            setError(isAr ? 'أدخل اسم التصنيف.' : 'Enter a category name.');
            return;
          }
          onSubmit({
            nameAr: nameAr.trim() || nameEn.trim(),
            nameEn: nameEn.trim() || nameAr.trim(),
            descriptionAr: descriptionAr.trim(),
            descriptionEn: descriptionEn.trim(),
            icon: icon.trim() || '📚',
          });
        }}
      >
        {error && <p className="text-[0.82rem] font-bold text-[#C0392B] dark:text-[#FCA5A5]">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-[110px_1fr]">
          <AdminField label={isAr ? 'الأيقونة' : 'Icon'} hint={isAr ? 'رمز تعبيري' : 'Emoji'}>
            <input
              value={icon}
              onChange={(event) => setIcon(event.target.value)}
              className={`${adminFieldClass} text-center text-[1.2rem]`}
              maxLength={4}
            />
          </AdminField>
          <div className="grid gap-4">
            <AdminField label={isAr ? 'الاسم (عربي)' : 'Name (Arabic)'}>
              <input value={nameAr} onChange={(event) => setNameAr(event.target.value)} className={adminFieldClass} />
            </AdminField>
            <AdminField label={isAr ? 'الاسم (إنجليزي)' : 'Name (English)'}>
              <input
                value={nameEn}
                onChange={(event) => setNameEn(event.target.value)}
                className={adminFieldClass}
                dir="ltr"
              />
            </AdminField>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label={isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}>
            <textarea
              value={descriptionAr}
              onChange={(event) => setDescriptionAr(event.target.value)}
              rows={3}
              className={adminFieldClass}
            />
          </AdminField>
          <AdminField label={isAr ? 'الوصف (إنجليزي)' : 'Description (English)'}>
            <textarea
              value={descriptionEn}
              onChange={(event) => setDescriptionEn(event.target.value)}
              rows={3}
              className={adminFieldClass}
              dir="ltr"
            />
          </AdminField>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
          <button type="button" onClick={onClose} className={adminBtnClass('ghost')}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" className={adminBtnClass('primary', 'md')}>
            {category ? (isAr ? 'حفظ التغييرات' : 'Save Changes') : isAr ? 'إنشاء التصنيف' : 'Create Category'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
