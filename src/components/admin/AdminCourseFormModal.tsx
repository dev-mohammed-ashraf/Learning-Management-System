import { useState } from 'react';
import type { AdminCourse, AdminCourseLevel, AdminCourseStatus, AdminDataState } from '../../types/admin';
import type { Locale } from '../../types/program';
import { ADMIN_COURSE_IMAGE_OPTIONS } from '../../data/adminData';
import { ADMIN_LEVEL_LABELS } from '../../utils/adminData';
import { AdminField, AdminModal, adminBtnClass, adminFieldClass } from './AdminUI';

export interface AdminCourseFormValues {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  instructorId: string;
  categoryId: string | null;
  price: number;
  level: AdminCourseLevel;
  status: AdminCourseStatus;
}

interface AdminCourseFormModalProps {
  locale: Locale;
  state: AdminDataState;
  defaultStatus: AdminCourseStatus;
  /** Present when editing an existing course. */
  course?: AdminCourse;
  onClose: () => void;
  onSubmit: (values: AdminCourseFormValues) => void;
}

export function AdminCourseFormModal({
  locale,
  state,
  defaultStatus,
  course,
  onClose,
  onSubmit,
}: AdminCourseFormModalProps) {
  const isAr = locale === 'ar';
  const instructors = state.users.filter((user) => user.role === 'instructor' || user.role === 'admin');

  const [titleAr, setTitleAr] = useState(course?.titleAr ?? '');
  const [titleEn, setTitleEn] = useState(course?.titleEn ?? '');
  const [descriptionAr, setDescriptionAr] = useState(course?.descriptionAr ?? '');
  const [descriptionEn, setDescriptionEn] = useState(course?.descriptionEn ?? '');
  const [image, setImage] = useState(course?.image ?? ADMIN_COURSE_IMAGE_OPTIONS[0]);
  const [instructorId, setInstructorId] = useState(course?.instructorId ?? '');
  const [categoryId, setCategoryId] = useState<string>(course?.categoryId ?? '');
  const [price, setPrice] = useState(String(course?.price ?? 0));
  const [level, setLevel] = useState<AdminCourseLevel>(course?.level ?? 'beginner');
  const [status, setStatus] = useState<AdminCourseStatus>(course?.status ?? defaultStatus);
  const [error, setError] = useState('');


  return (
    <AdminModal
      title={course ? (isAr ? 'تعديل الكورس' : 'Edit Course') : isAr ? 'إضافة كورس جديد' : 'New Course'}
      onClose={onClose}
      maxWidth="640px"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!titleAr.trim() && !titleEn.trim()) {
            setError(
              isAr ? 'أدخل عنوان الكورس بالعربية أو الإنجليزية.' : 'Enter a course title in Arabic or English.'
            );
            return;
          }
          if (!instructorId) {
            setError(isAr ? 'اختر مدرّب الكورس.' : 'Select a course instructor.');
            return;
          }
          onSubmit({
            titleAr: titleAr.trim() || titleEn.trim(),
            titleEn: titleEn.trim() || titleAr.trim(),
            descriptionAr: descriptionAr.trim(),
            descriptionEn: descriptionEn.trim(),
            image,
            instructorId,
            categoryId: categoryId || null,
            price: Math.max(0, Math.round(Number(price) || 0)),
            level,
            status,
          });
        }}
      >
        {error && <p className="text-[0.82rem] font-bold text-[#C0392B] dark:text-[#FCA5A5]">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label={isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}>
            <input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className={adminFieldClass} />
          </AdminField>
          <AdminField label={isAr ? 'العنوان (إنجليزي)' : 'Title (English)'}>
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className={adminFieldClass}
              dir="ltr"
            />
          </AdminField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label={isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}>
            <textarea
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              rows={3}
              className={adminFieldClass}
            />
          </AdminField>
          <AdminField label={isAr ? 'الوصف (إنجليزي)' : 'Description (English)'}>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={3}
              className={adminFieldClass}
              dir="ltr"
            />
          </AdminField>
        </div>


        <div>
          <AdminField
            label={isAr ? 'صورة الغلاف (رابط أو اختر من المكتبة)' : 'Cover Image (URL or pick below)'}
          >
            <input value={image} onChange={(e) => setImage(e.target.value)} className={adminFieldClass} dir="ltr" />
          </AdminField>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {ADMIN_COURSE_IMAGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setImage(option)}
                aria-label={option}
                className={`h-[54px] w-[86px] flex-none overflow-hidden rounded-[10px] border-2 transition-colors cursor-pointer ${
                  image === option ? 'border-[#28B5C5]' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={option} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label={isAr ? 'المدرّب' : 'Instructor'}>
            <select
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
              className={adminFieldClass}
            >
              <option value="">{isAr ? 'اختر المدرّب' : 'Select instructor'}</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label={isAr ? 'التصنيف' : 'Category'}>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={adminFieldClass}
            >
              <option value="">{isAr ? 'بدون تصنيف' : 'Uncategorized'}</option>
              {state.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {isAr ? category.nameAr : category.nameEn}
                </option>
              ))}
            </select>
          </AdminField>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <AdminField label={isAr ? 'السعر التجريبي (ر.س)' : 'Demo Price (SAR)'}>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`${adminFieldClass} num`}
            />
          </AdminField>
          <AdminField label={isAr ? 'المستوى' : 'Level'}>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as AdminCourseLevel)}
              className={adminFieldClass}
            >
              {(Object.keys(ADMIN_LEVEL_LABELS) as AdminCourseLevel[]).map((key) => (
                <option key={key} value={key}>
                  {isAr ? ADMIN_LEVEL_LABELS[key].ar : ADMIN_LEVEL_LABELS[key].en}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label={isAr ? 'الحالة' : 'Status'}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AdminCourseStatus)}
              className={adminFieldClass}
            >
              <option value="published">{isAr ? 'منشورة' : 'Published'}</option>
              <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
            </select>
          </AdminField>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
          <button type="button" onClick={onClose} className={adminBtnClass('ghost')}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" className={adminBtnClass('primary', 'md')}>
            {course ? (isAr ? 'حفظ التغييرات' : 'Save Changes') : isAr ? 'إنشاء الكورس' : 'Create Course'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
