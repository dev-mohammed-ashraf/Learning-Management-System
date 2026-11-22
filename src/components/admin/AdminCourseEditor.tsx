import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Layers,
  ListVideo,
  ToggleLeft,
} from 'lucide-react';
import type { AdminCourse, AdminCourseLevel, AdminCourseStatus, AdminDataState } from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  formatAdminDate,
  getAdminCourseStats,
  getAdminLevelLabel,
  setCourseStatusState,
  updateCourseState,
} from '../../utils/adminData';
import { ADMIN_COURSE_IMAGE_OPTIONS } from '../../data/adminData';
import { AdminBadge, AdminCard, AdminField, adminBtnClass, adminFieldClass } from './AdminUI';
import { AdminCurriculumEditor } from './AdminCurriculumEditor';

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface AdminCourseEditorProps {
  locale: Locale;
  state: AdminDataState;
  course: AdminCourse;
  update: UpdateFn;
  onClose: () => void;
}

export function AdminCourseEditor({ locale, state, course, update, onClose }: AdminCourseEditorProps) {
  const isAr = locale === 'ar';
  const stats = getAdminCourseStats(course);
  const instructor = state.users.find((user) => user.id === course.instructorId);
  const category = state.categories.find((item) => item.id === course.categoryId);

  const patchCourse = (patch: Partial<Omit<AdminCourse, 'id' | 'createdAt'>>) =>
    update((prev) => updateCourseState(prev, course.id, patch));


  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-5">
      {/* Editor header */}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onClose} className={adminBtnClass('ghost')}>
          <BackArrow className="h-4 w-4" aria-hidden="true" />
          {isAr ? 'عودة للكورسات' : 'Back to Courses'}
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[1.05rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? `تعديل: ${course.titleAr}` : `Editing: ${course.titleEn}`}
          </h2>
          <p className="num text-[0.74rem] text-[#94A3B8] dark:text-[#7E93A9]">
            {isAr
              ? 'التغييرات تُحفظ تلقائيًا في البيانات التجريبية'
              : 'Changes autosave to the demo data instantly'}
          </p>
        </div>
        <div className="flex flex-none items-center gap-2">
          <AdminBadge tone={course.status === 'published' ? 'success' : 'warn'}>
            {course.status === 'published' ? (isAr ? 'منشورة' : 'Published') : isAr ? 'مسودة' : 'Draft'}
          </AdminBadge>
          <button
            type="button"
            onClick={() =>
              update((prev) =>
                setCourseStatusState(prev, course.id, course.status === 'published' ? 'draft' : 'published')
              )
            }
            className={adminBtnClass(course.status === 'published' ? 'ghost' : 'success')}
          >
            <ToggleLeft className="h-4 w-4" aria-hidden="true" />
            {course.status === 'published' ? (isAr ? 'إلغاء النشر' : 'Unpublish') : isAr ? 'نشر الكورس' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        {/* Basics form (autosave) */}
        <div className="space-y-4">
          <AdminCard className="space-y-4 p-5">
            <h3 className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? 'بيانات الكورس' : 'Course Details'}
            </h3>
            <AdminField label={isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}>
              <input
                value={course.titleAr}
                onChange={(event) => patchCourse({ titleAr: event.target.value })}
                className={adminFieldClass}
              />
            </AdminField>
            <AdminField label={isAr ? 'العنوان (إنجليزي)' : 'Title (English)'}>
              <input
                value={course.titleEn}
                onChange={(event) => patchCourse({ titleEn: event.target.value })}
                className={adminFieldClass}
                dir="ltr"
              />
            </AdminField>
            <AdminField label={isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}>
              <textarea
                value={course.descriptionAr}
                onChange={(event) => patchCourse({ descriptionAr: event.target.value })}
                rows={3}
                className={adminFieldClass}
              />
            </AdminField>
            <AdminField label={isAr ? 'الوصف (إنجليزي)' : 'Description (English)'}>
              <textarea
                value={course.descriptionEn}
                onChange={(event) => patchCourse({ descriptionEn: event.target.value })}
                rows={3}
                className={adminFieldClass}
                dir="ltr"
              />
            </AdminField>
          </AdminCard>

          <AdminCard className="space-y-4 p-5">
            <AdminField label={isAr ? 'المدرّب' : 'Instructor'}>
              <select
                value={course.instructorId}
                onChange={(event) => patchCourse({ instructorId: event.target.value })}
                className={adminFieldClass}
              >
                {state.users
                  .filter((user) => user.role === 'instructor' || user.role === 'admin')
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
            </AdminField>
            <AdminField label={isAr ? 'التصنيف' : 'Category'}>
              <select
                value={course.categoryId ?? ''}
                onChange={(event) => patchCourse({ categoryId: event.target.value || null })}
                className={adminFieldClass}
              >
                <option value="">{isAr ? 'بدون تصنيف' : 'Uncategorized'}</option>
                {state.categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {isAr ? item.nameAr : item.nameEn}
                  </option>
                ))}
              </select>
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-3">
              <AdminField label={isAr ? 'السعر (ر.س)' : 'Price (SAR)'}>
                <input
                  type="number"
                  min={0}
                  value={course.price}
                  onChange={(event) =>
                    patchCourse({ price: Math.max(0, Math.round(Number(event.target.value) || 0)) })
                  }
                  className={`${adminFieldClass} num`}
                />
              </AdminField>
              <AdminField label={isAr ? 'المستوى' : 'Level'}>
                <select
                  value={course.level}
                  onChange={(event) => patchCourse({ level: event.target.value as AdminCourseLevel })}
                  className={adminFieldClass}
                >
                  <option value="beginner">{isAr ? 'مبتدئ' : 'Beginner'}</option>
                  <option value="intermediate">{isAr ? 'متوسط' : 'Intermediate'}</option>
                  <option value="advanced">{isAr ? 'متقدم' : 'Advanced'}</option>
                </select>
              </AdminField>
              <AdminField label={isAr ? 'الحالة' : 'Status'}>
                <select
                  value={course.status}
                  onChange={(event) => patchCourse({ status: event.target.value as AdminCourseStatus })}
                  className={adminFieldClass}
                >
                  <option value="published">{isAr ? 'منشورة' : 'Published'}</option>
                  <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
                </select>
              </AdminField>
            </div>
            <AdminField label={isAr ? 'صورة الغلاف' : 'Cover Image'}>
              <input
                value={course.image}
                onChange={(event) => patchCourse({ image: event.target.value })}
                className={adminFieldClass}
                dir="ltr"
              />
            </AdminField>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {ADMIN_COURSE_IMAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => patchCourse({ image: option })}
                  aria-label={option}
                  className={`h-[50px] w-[80px] flex-none overflow-hidden rounded-[10px] border-2 transition-colors cursor-pointer ${
                    course.image === option ? 'border-[#28B5C5]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={option} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </AdminCard>

          {/* Meta card */}
          <AdminCard className="space-y-2.5 p-5 text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
              <span className="num">
                {stats.sections} {isAr ? 'أقسام' : 'sections'} · {stats.lessons} {isAr ? 'دروس' : 'lessons'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListVideo className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
              <span className="num">
                {stats.totalMinutes} {isAr ? 'دقيقة محتوى' : 'minutes of content'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
              <span className="num">
                {isAr ? 'أُنشئ' : 'Created'} {formatAdminDate(course.createdAt, locale)} ·{' '}
                {isAr ? 'آخر تحديث' : 'Updated'} {formatAdminDate(course.updatedAt, locale)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                {isAr ? 'المدرّب:' : 'Instructor:'}{' '}
                <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">{instructor?.name ?? '—'}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                {isAr ? 'التصنيف:' : 'Category:'}{' '}
                <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">
                  {category ? (isAr ? category.nameAr : category.nameEn) : isAr ? 'بدون تصنيف' : 'Uncategorized'}
                </span>
              </span>
              <AdminBadge tone="brand">{getAdminLevelLabel(course.level, locale)}</AdminBadge>
            </div>
          </AdminCard>
        </div>

        {/* Curriculum */}
        <div className="space-y-3">
          <h3 className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? 'إدارة المنهج (الأقسام والدروس)' : 'Curriculum Management (Sections & Lessons)'}
          </h3>
          <p className="text-[0.78rem] text-[#94A3B8] dark:text-[#7E93A9]">
            {isAr
              ? 'اسحب الأقسام أو الدروس وأفلتها لإعادة ترتيبها، أو استخدم زر التعديل لتحرير تفاصيل كل درس.'
              : 'Drag and drop sections or lessons to reorder them, or use the edit button to change lesson details.'}
          </p>
          <AdminCurriculumEditor locale={locale} course={course} update={update} />
        </div>
      </div>
    </div>
  );
}
