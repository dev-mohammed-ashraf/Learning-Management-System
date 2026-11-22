import { useState } from 'react';
import {
  Eye,
  GripVertical,
  Layers,
  ListVideo,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import type { AdminCourse, AdminDataState, AdminLesson } from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  addLessonState,
  addSectionState,
  deleteLessonState,
  deleteSectionState,
  reorderLessonsState,
  reorderSectionsState,
  updateLessonState,
  updateSectionState,
} from '../../utils/adminData';
import {
  AdminBadge,
  AdminField,
  AdminModal,
  adminBtnClass,
  adminFieldClass,
  ConfirmDialog,
} from './AdminUI';

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface AdminCurriculumEditorProps {
  locale: Locale;
  course: AdminCourse;
  update: UpdateFn;
}

interface LessonModalState {
  sectionId: string;
  lesson?: AdminLesson;
}

const SAMPLE_VIDEO_HINT = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export function AdminCurriculumEditor({ locale, course, update }: AdminCurriculumEditorProps) {
  const isAr = locale === 'ar';
  const [sectionTitleAr, setSectionTitleAr] = useState('');
  const [sectionTitleEn, setSectionTitleEn] = useState('');
  const [renamingSectionId, setRenamingSectionId] = useState<string | null>(null);
  const [lessonModal, setLessonModal] = useState<LessonModalState | null>(null);
  const [deleteSectionTarget, setDeleteSectionTarget] = useState<string | null>(null);
  const [deleteLessonTarget, setDeleteLessonTarget] = useState<{ sectionId: string; lessonId: string } | null>(null);
  const [dragging, setDragging] = useState<{ type: 'section' | 'lesson'; id: string; sectionId?: string } | null>(null);


  const addSection = () => {
    const ar = sectionTitleAr.trim();
    const en = sectionTitleEn.trim();
    if (!ar && !en) return;
    update((prev) => addSectionState(prev, course.id, ar || en, en || ar));
    setSectionTitleAr('');
    setSectionTitleEn('');
  };

  const handleSectionDrop = (targetIndex: number) => {
    if (!dragging || dragging.type !== 'section') return;
    const fromIndex = course.sections.findIndex((section) => section.id === dragging.id);
    if (fromIndex >= 0 && fromIndex !== targetIndex) {
      update((prev) => reorderSectionsState(prev, course.id, fromIndex, targetIndex));
    }
    setDragging(null);
  };

  const handleLessonDrop = (sectionId: string, targetIndex: number) => {
    if (!dragging || dragging.type !== 'lesson' || dragging.sectionId !== sectionId) return;
    const section = course.sections.find((item) => item.id === sectionId);
    if (!section) return;
    const fromIndex = section.lessons.findIndex((lesson) => lesson.id === dragging.id);
    if (fromIndex >= 0 && fromIndex !== targetIndex) {
      update((prev) => reorderLessonsState(prev, course.id, sectionId, fromIndex, targetIndex));
    }
    setDragging(null);
  };


  return (
    <div className="space-y-4">
      {/* Add section */}
      <div className="rounded-[14px] border border-dashed border-[#C7D6DE] bg-[#EAF3F6]/50 p-3 dark:border-white/15 dark:bg-[#102238]/50">
        <div className="mb-2 flex items-center gap-2 text-[0.84rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
          <Layers className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
          {isAr ? 'إضافة قسم جديد' : 'Add New Section'}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={sectionTitleAr}
            onChange={(event) => setSectionTitleAr(event.target.value)}
            placeholder={isAr ? 'اسم القسم (عربي)' : 'Section title (Arabic)'}
            className={adminFieldClass}
          />
          <input
            value={sectionTitleEn}
            onChange={(event) => setSectionTitleEn(event.target.value)}
            placeholder={isAr ? 'اسم القسم (إنجليزي)' : 'Section title (English)'}
            className={adminFieldClass}
            dir="ltr"
          />
          <button type="button" onClick={addSection} className={`${adminBtnClass('primary')} flex-none`}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'إضافة' : 'Add'}
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3" onDragOver={(event) => event.preventDefault()}>
        {course.sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            onDragOver={(event) => {
              event.preventDefault();
              handleSectionDrop(sectionIndex);
            }}
            className="rounded-[14px] border border-[#DCE7ED] bg-white dark:border-white/12 dark:bg-[#102238]"
          >
            {/* Section header */}
            <div
              draggable
              onDragStart={() => setDragging({ type: 'section', id: section.id })}
              onDragEnd={() => setDragging(null)}
              className="flex flex-wrap items-center gap-2 border-b border-[#DCE7ED] px-3 py-2.5 dark:border-white/12"
            >
              <GripVertical
                className="h-4 w-4 flex-none cursor-grab text-[#94A3B8]"
                aria-hidden="true"
              />
              {renamingSectionId === section.id ? (
                <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                  <input
                    autoFocus
                    value={section.titleAr}
                    onChange={(event) =>
                      update((prev) =>
                        updateSectionState(prev, course.id, section.id, { titleAr: event.target.value })
                      )
                    }
                    className={`${adminFieldClass} min-w-[140px] flex-1`}
                  />
                  <input
                    value={section.titleEn}
                    onChange={(event) =>
                      update((prev) =>
                        updateSectionState(prev, course.id, section.id, { titleEn: event.target.value })
                      )
                    }
                    className={`${adminFieldClass} min-w-[140px] flex-1`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setRenamingSectionId(null)}
                    className={adminBtnClass('primary')}
                  >
                    {isAr ? 'تم' : 'Done'}
                  </button>
                </div>
              ) : (
                <>
                  <span className="num text-[0.76rem] font-extrabold text-[#176B87] dark:text-[#28B5C5]">
                    {isAr ? `القسم ${sectionIndex + 1}` : `Section ${sectionIndex + 1}`}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[0.88rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                    {isAr ? section.titleAr : section.titleEn}
                  </span>
                  <span className="num text-[0.72rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                    {section.lessons.length} {isAr ? 'دروس' : 'lessons'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setRenamingSectionId(section.id)}
                      aria-label={isAr ? 'إعادة تسمية القسم' : 'Rename section'}
                      className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteSectionTarget(section.id)}
                      aria-label={isAr ? 'حذف القسم' : 'Delete section'}
                      className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#FCEBE9] hover:text-[#C0392B] dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5] cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Lessons */}
            <ul
              className="divide-y divide-[#DCE7ED]/70 dark:divide-white/8"
              onDragOver={(event) => event.preventDefault()}
            >
              {section.lessons.map((lesson, lessonIndex) => (
                <li
                  key={lesson.id}
                  draggable
                  onDragStart={() => setDragging({ type: 'lesson', id: lesson.id, sectionId: section.id })}
                  onDragEnd={() => setDragging(null)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    handleLessonDrop(section.id, lessonIndex);
                  }}
                  className="flex flex-wrap items-center gap-2 px-3 py-2.5"
                >
                  <GripVertical className="h-4 w-4 flex-none cursor-grab text-[#94A3B8]" aria-hidden="true" />
                  <span className="num grid h-7 w-7 flex-none place-items-center rounded-full bg-[#EAF3F6] text-[0.72rem] font-extrabold text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]">
                    {lessonIndex + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.85rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                      {isAr ? lesson.titleAr : lesson.titleEn}
                    </span>
                    <span className="num block text-[0.72rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                      {lesson.durationMinutes} {isAr ? 'دقيقة' : 'min'} · {lesson.videoUrl.slice(0, 46)}…
                    </span>
                  </span>
                  {lesson.isPreview && (
                    <AdminBadge tone="success">
                      <Eye className="h-3 w-3" aria-hidden="true" />
                      {isAr ? 'معاينة' : 'Preview'}
                    </AdminBadge>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setLessonModal({ sectionId: section.id, lesson })}
                      aria-label={isAr ? 'تعديل الدرس' : 'Edit lesson'}
                      className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteLessonTarget({ sectionId: section.id, lessonId: lesson.id })}
                      aria-label={isAr ? 'حذف الدرس' : 'Delete lesson'}
                      className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#FCEBE9] hover:text-[#C0392B] dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5] cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
              {section.lessons.length === 0 && (
                <li className="px-3 py-3 text-center text-[0.78rem] text-[#94A3B8]">
                  {isAr ? 'لا توجد دروس في هذا القسم بعد' : 'No lessons in this section yet'}
                </li>
              )}
            </ul>

            <div className="px-3 py-2.5">
              <button
                type="button"
                onClick={() => setLessonModal({ sectionId: section.id })}
                className={adminBtnClass('ghost')}
              >
                <ListVideo className="h-4 w-4" aria-hidden="true" />
                {isAr ? 'إضافة درس' : 'Add Lesson'}
              </button>
            </div>
          </div>
        ))}

        {course.sections.length === 0 && (
          <p className="rounded-[14px] border border-dashed border-[#DCE7ED] px-4 py-8 text-center text-[0.82rem] text-[#94A3B8] dark:border-white/15">
            {isAr ? 'ابدأ بإضافة أول قسم للمنهج.' : 'Start by adding the first curriculum section.'}
          </p>
        )}
      </div>

      {/* Lesson modal */}
      {lessonModal && (
        <LessonFormModal
          locale={locale}
          sectionTitle={
            (() => {
              const section = course.sections.find((item) => item.id === lessonModal.sectionId);
              return section ? (isAr ? section.titleAr : section.titleEn) : '';
            })()
          }
          lesson={lessonModal.lesson}
          onClose={() => setLessonModal(null)}
          onSubmit={(values) => {
            if (lessonModal.lesson) {
              update((prev) =>
                updateLessonState(prev, course.id, lessonModal.sectionId, lessonModal.lesson!.id, values)
              );
            } else {
              update((prev) => addLessonState(prev, course.id, lessonModal.sectionId, values));
            }
            setLessonModal(null);
          }}
        />
      )}

      {/* Delete section confirmation */}
      {deleteSectionTarget && (
        <ConfirmDialog
          locale={locale}
          title={isAr ? 'حذف القسم' : 'Delete Section'}
          message={
            isAr
              ? 'سيتم حذف القسم وجميع دروسه نهائيًا من هذا الكورس التجريبي. هل تريد المتابعة؟'
              : 'This section and all its lessons will be permanently removed from this demo course. Continue?'
          }
          confirmLabel={isAr ? 'حذف القسم' : 'Delete Section'}
          onConfirm={() => {
            update((prev) => deleteSectionState(prev, course.id, deleteSectionTarget));
            setDeleteSectionTarget(null);
          }}
          onCancel={() => setDeleteSectionTarget(null)}
        />
      )}

      {/* Delete lesson confirmation */}
      {deleteLessonTarget && (
        <ConfirmDialog
          locale={locale}
          title={isAr ? 'حذف الدرس' : 'Delete Lesson'}
          message={
            isAr
              ? 'سيتم حذف هذا الدرس من القسم نهائيًا. هل تريد المتابعة؟'
              : 'This lesson will be permanently removed from the section. Continue?'
          }
          confirmLabel={isAr ? 'حذف الدرس' : 'Delete Lesson'}
          onConfirm={() => {
            update((prev) =>
              deleteLessonState(prev, course.id, deleteLessonTarget.sectionId, deleteLessonTarget.lessonId)
            );
            setDeleteLessonTarget(null);
          }}
          onCancel={() => setDeleteLessonTarget(null)}
        />
      )}
    </div>
  );
}


interface LessonFormValues {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  durationMinutes: number;
  videoUrl: string;
  isPreview: boolean;
}

function LessonFormModal({
  locale,
  sectionTitle,
  lesson,
  onClose,
  onSubmit,
}: {
  locale: Locale;
  sectionTitle: string;
  lesson?: AdminLesson;
  onClose: () => void;
  onSubmit: (values: LessonFormValues) => void;
}) {
  const isAr = locale === 'ar';
  const [titleAr, setTitleAr] = useState(lesson?.titleAr ?? '');
  const [titleEn, setTitleEn] = useState(lesson?.titleEn ?? '');
  const [descriptionAr, setDescriptionAr] = useState(lesson?.descriptionAr ?? '');
  const [descriptionEn, setDescriptionEn] = useState(lesson?.descriptionEn ?? '');
  const [duration, setDuration] = useState(String(lesson?.durationMinutes ?? 5));
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl ?? SAMPLE_VIDEO_HINT);
  const [isPreview, setIsPreview] = useState(lesson?.isPreview ?? false);
  const [error, setError] = useState('');

  return (
    <AdminModal
      title={
        lesson
          ? isAr
            ? `تعديل الدرس · ${sectionTitle}`
            : `Edit Lesson · ${sectionTitle}`
          : isAr
            ? `إضافة درس · ${sectionTitle}`
            : `Add Lesson · ${sectionTitle}`
      }
      onClose={onClose}
      maxWidth="560px"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!titleAr.trim() && !titleEn.trim()) {
            setError(isAr ? 'أدخل عنوان الدرس.' : 'Enter a lesson title.');
            return;
          }
          onSubmit({
            titleAr: titleAr.trim() || titleEn.trim(),
            titleEn: titleEn.trim() || titleAr.trim(),
            descriptionAr: descriptionAr.trim(),
            descriptionEn: descriptionEn.trim(),
            durationMinutes: Math.max(1, Math.round(Number(duration) || 1)),
            videoUrl: videoUrl.trim(),
            isPreview,
          });
        }}
      >
        {error && <p className="text-[0.82rem] font-bold text-[#C0392B] dark:text-[#FCA5A5]">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label={isAr ? 'عنوان الدرس (عربي)' : 'Lesson Title (Arabic)'}>
            <input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className={adminFieldClass} />
          </AdminField>
          <AdminField label={isAr ? 'عنوان الدرس (إنجليزي)' : 'Lesson Title (English)'}>
            <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={adminFieldClass} dir="ltr" />
          </AdminField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label={isAr ? 'وصف الدرس (عربي)' : 'Description (Arabic)'}>
            <textarea
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              rows={3}
              className={adminFieldClass}
            />
          </AdminField>
          <AdminField label={isAr ? 'وصف الدرس (إنجليزي)' : 'Description (English)'}>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={3}
              className={adminFieldClass}
              dir="ltr"
            />
          </AdminField>
        </div>

        <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <AdminField label={isAr ? 'المدة (دقائق)' : 'Duration (minutes)'}>
            <input
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={`${adminFieldClass} num`}
            />
          </AdminField>
          <AdminField label={isAr ? 'رابط الفيديو' : 'Video URL'}>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={adminFieldClass} dir="ltr" />
          </AdminField>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
          <input
            type="checkbox"
            checked={isPreview}
            onChange={(event) => setIsPreview(event.target.checked)}
            className="h-4 w-4 accent-[#176B87] dark:accent-[#28B5C5]"
          />
          {isAr ? 'درس معاينة مجاني (مشاهدة قبل الاشتراك)' : 'Free preview lesson (watchable before enrollment)'}
        </label>

        <div className="flex items-center justify-end gap-2 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
          <button type="button" onClick={onClose} className={adminBtnClass('ghost')}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" className={adminBtnClass('primary', 'md')}>
            {lesson ? (isAr ? 'حفظ الدرس' : 'Save Lesson') : isAr ? 'إضافة الدرس' : 'Add Lesson'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
