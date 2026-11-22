import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Eye,
  GripVertical,
  ListChecks,
  Pencil,
  Plus,
  ToggleLeft,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type {
  AdminDataState,
  AdminExam,
  AdminExamStatus,
  AdminQuestion,
  AdminQuestionType,
} from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  addExamQuestionState,
  createExamState,
  deleteExamQuestionState,
  formatAdminDate,
  getExamPassingMarks,
  getExamTotalMarks,
  reorderExamQuestionsState,
  setExamStatusState,
  updateExamQuestionState,
  updateExamState,
} from '../../utils/adminData';
import {
  AdminBadge,
  AdminCard,
  AdminField,
  AdminModal,
  adminBtnClass,
  adminFieldClass,
  ConfirmDialog,
} from './AdminUI';

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface AdminExamEditorProps {
  locale: Locale;
  state: AdminDataState;
  /** Existing exam to edit — omit to open the same editor in create mode. */
  exam?: AdminExam;
  update: UpdateFn;
  onClose: () => void;
  /** Create mode only — receives the new exam id after a successful save/publish. */
  onCreated?: (examId: string) => void;
}

const QUESTION_TYPE_LABELS: Record<AdminQuestionType, { ar: string; en: string }> = {
  multiple_choice: { ar: 'اختيار من متعدد', en: 'Multiple Choice' },
  true_false: { ar: 'صح أو خطأ', en: 'True or False' },
  short_answer: { ar: 'إجابة قصيرة', en: 'Short Answer' },
};

function makeLocalId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Blank exam seeding the editor in create mode — persisted only on save/publish. */
function createBlankDraftExam(): AdminExam {
  return {
    id: makeLocalId('exam'),
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    courseId: '',
    courseTitleAr: '',
    courseTitleEn: '',
    sectionTitleAr: '',
    sectionTitleEn: '',
    durationMinutes: 20,
    passingPct: 60,
    maxAttempts: 2,
    availableFrom: null,
    availableTo: null,
    showCorrectAnswers: true,
    instructionsAr:
      'أجب عن جميع الأسئلة قبل انتهاء الوقت. يمكنك التنقل بين الأسئلة وتعديل الإجابات قبل التسليم.',
    instructionsEn:
      'Answer all questions before time runs out. You can navigate between questions and change answers before submitting.',
    status: 'draft',
    questions: [],
    createdAt: '',
    updatedAt: '',
  };
}

export function AdminExamEditor({ locale, state, exam, update, onClose, onCreated }: AdminExamEditorProps) {
  const isAr = locale === 'ar';
  // Create mode reuses this exact editor over a local draft; edit mode keeps the store-driven autosave flow.
  const isCreate = !exam;
  const [draft, setDraft] = useState<AdminExam>(createBlankDraftExam);
  const view = isCreate ? draft : exam;
  const totalMarks = getExamTotalMarks(view);
  const passingMarks = getExamPassingMarks(view);
  const [questionModal, setQuestionModal] = useState<{ question?: AdminQuestion } | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [createError, setCreateError] = useState('');

  const BackArrow = isAr ? ArrowRight : ArrowLeft;
  const patchExam = (patch: Partial<Omit<AdminExam, 'id' | 'createdAt'>>) => {
    if (isCreate) {
      setDraft((prev) => ({ ...prev, ...patch }));
      return;
    }
    update((prev) => updateExamState(prev, exam.id, patch));
  };

  // Create mode — validate the draft, persist it once, then hand the new id to the dashboard.
  const handleCreate = (status: AdminExamStatus) => {
    if (!view.titleAr.trim() && !view.titleEn.trim()) {
      setCreateError(isAr ? 'أدخل عنوان الاختبار.' : 'Enter the exam title.');
      return;
    }
    if (!view.courseId) {
      setCreateError(isAr ? 'اختر الكورس المرتبط.' : 'Select the associated course.');
      return;
    }
    if (view.questions.length === 0) {
      setCreateError(isAr ? 'أضف سؤالًا واحدًا على الأقل.' : 'Add at least one question.');
      return;
    }
    setCreateError('');
    const course = state.courses.find((item) => item.id === view.courseId);
    update((prev) =>
      createExamState(prev, {
        id: view.id,
        titleAr: view.titleAr.trim() || view.titleEn.trim(),
        titleEn: view.titleEn.trim() || view.titleAr.trim(),
        descriptionAr: view.descriptionAr,
        descriptionEn: view.descriptionEn,
        courseId: view.courseId,
        courseTitleAr: course?.titleAr ?? view.courseTitleAr,
        courseTitleEn: course?.titleEn ?? view.courseTitleEn,
        sectionTitleAr: view.sectionTitleAr,
        sectionTitleEn: view.sectionTitleEn,
        durationMinutes: view.durationMinutes,
        passingPct: view.passingPct,
        maxAttempts: view.maxAttempts,
        availableFrom: view.availableFrom,
        availableTo: view.availableTo,
        showCorrectAnswers: view.showCorrectAnswers,
        instructionsAr: view.instructionsAr,
        instructionsEn: view.instructionsEn,
        status,
        questions: view.questions,
      })
    );
    onCreated?.(view.id);
  };

  const courseName = (() => {
    const course = state.courses.find((item) => item.id === view.courseId);
    if (course) return isAr ? course.titleAr : course.titleEn;
    return isAr ? view.courseTitleAr : view.courseTitleEn;
  })();

  return (
    <div className="space-y-5">
      {/* Editor header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={onClose} className={adminBtnClass('ghost')}>
            <BackArrow className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'عودة للاختبارات' : 'Back to Exams'}
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[1.05rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isCreate
                ? isAr
                  ? 'إنشاء اختبار جديد'
                  : 'Create New Exam'
                : isAr
                  ? `تعديل: ${exam.titleAr}`
                  : `Editing: ${exam.titleEn}`}
            </h2>
            <p className="num text-[0.74rem] text-[#94A3B8] dark:text-[#7E93A9]">
              {isCreate
                ? isAr
                  ? 'سيُضاف الاختبار إلى الجدول عند الحفظ أو النشر'
                  : 'The exam is added to the table on save or publish'
                : isAr
                  ? 'التغييرات تُحفظ تلقائيًا في البيانات التجريبية'
                  : 'Changes autosave to the demo data instantly'}
            </p>
          </div>
          <div className="flex flex-none items-center gap-2">
            <button type="button" onClick={() => setPreviewOpen(true)} className={adminBtnClass('ghost')}>
              <Eye className="h-4 w-4" aria-hidden="true" />
              {isAr ? 'معاينة' : 'Preview'}
            </button>
            {isCreate ? (
              <>
                <button
                  type="button"
                  onClick={() => handleCreate('draft')}
                  className={adminBtnClass('ghost')}
                >
                  {isAr ? 'حفظ كمسودة' : 'Save as Draft'}
                </button>
                <button
                  type="button"
                  onClick={() => handleCreate('published')}
                  className={adminBtnClass('success')}
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {isAr ? 'نشر الاختبار' : 'Publish Exam'}
                </button>
              </>
            ) : (
              <>
                <AdminBadge tone={exam.status === 'published' ? 'success' : 'warn'}>
                  {exam.status === 'published' ? (isAr ? 'منشور' : 'Published') : isAr ? 'مسودة' : 'Draft'}
                </AdminBadge>
                <button
                  type="button"
                  onClick={() =>
                    update((prev) =>
                      setExamStatusState(prev, exam.id, exam.status === 'published' ? 'draft' : 'published')
                    )
                  }
                  className={adminBtnClass(exam.status === 'published' ? 'ghost' : 'success')}
                >
                  <ToggleLeft className="h-4 w-4" aria-hidden="true" />
                  {exam.status === 'published' ? (isAr ? 'إلغاء النشر' : 'Unpublish') : isAr ? 'نشر الاختبار' : 'Publish'}
                </button>
              </>
            )}
          </div>
        </div>
        {isCreate && createError && (
          <p
            role="alert"
            className="rounded-[12px] border border-[#C0392B]/35 bg-[#FCEBE9] px-4 py-2.5 text-[0.82rem] font-bold text-[#C0392B] dark:border-[#FCA5A5]/30 dark:bg-[#331411] dark:text-[#FCA5A5]"
          >
            {createError}
          </p>
        )}
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        {/* Meta form (autosave) */}
        <div className="space-y-4">
          <AdminCard className="space-y-4 p-5">
            <h3 className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? 'بيانات الاختبار' : 'Exam Details'}
            </h3>
            <AdminField label={isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}>
              <input
                value={view.titleAr}
                onChange={(event) => patchExam({ titleAr: event.target.value })}
                className={adminFieldClass}
              />
            </AdminField>
            <AdminField label={isAr ? 'العنوان (إنجليزي)' : 'Title (English)'}>
              <input
                value={view.titleEn}
                onChange={(event) => patchExam({ titleEn: event.target.value })}
                className={adminFieldClass}
                dir="ltr"
              />
            </AdminField>
            <AdminField label={isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}>
              <textarea
                value={view.descriptionAr}
                onChange={(event) => patchExam({ descriptionAr: event.target.value })}
                rows={2}
                className={adminFieldClass}
              />
            </AdminField>
            <AdminField label={isAr ? 'الوصف (إنجليزي)' : 'Description (English)'}>
              <textarea
                value={view.descriptionEn}
                onChange={(event) => patchExam({ descriptionEn: event.target.value })}
                rows={2}
                className={adminFieldClass}
                dir="ltr"
              />
            </AdminField>
          </AdminCard>

          <AdminCard className="space-y-4 p-5">
            <AdminField label={isAr ? 'الكورس المرتبط' : 'Associated Course'}>
              <select
                value={
                  state.courses.some((course) => course.id === view.courseId)
                    ? view.courseId
                    : `__current__${view.courseId}`
                }
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.startsWith('__current__')) return;
                  const course = state.courses.find((item) => item.id === value);
                  if (course) {
                    patchExam({
                      courseId: course.id,
                      courseTitleAr: course.titleAr,
                      courseTitleEn: course.titleEn,
                    });
                  }
                }}
                className={adminFieldClass}
              >
                {!state.courses.some((course) => course.id === view.courseId) && (
                  <option value={`__current__${view.courseId}`}>
                    {courseName || (isAr ? 'اختر الكورس…' : 'Select a course…')}
                  </option>
                )}
                {state.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {isAr ? course.titleAr : course.titleEn}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField
              label={isAr ? 'القسم أو الدرس المرتبط (اختياري)' : 'Associated Section / Lesson (optional)'}
            >
              <input
                value={isAr ? view.sectionTitleAr : view.sectionTitleEn}
                onChange={(event) =>
                  patchExam(
                    isAr
                      ? { sectionTitleAr: event.target.value }
                      : { sectionTitleEn: event.target.value }
                  )
                }
                className={adminFieldClass}
              />
            </AdminField>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label={isAr ? 'المدة (دقائق)' : 'Duration (minutes)'}>
                <input
                  type="number"
                  min={1}
                  value={view.durationMinutes}
                  onChange={(event) =>
                    patchExam({ durationMinutes: Math.max(1, Math.round(Number(event.target.value) || 1)) })
                  }
                  className={`${adminFieldClass} num`}
                />
              </AdminField>
              <AdminField label={isAr ? 'نسبة النجاح %' : 'Passing %'}>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={view.passingPct}
                  onChange={(event) =>
                    patchExam({
                      passingPct: Math.min(100, Math.max(1, Math.round(Number(event.target.value) || 1))),
                    })
                  }
                  className={`${adminFieldClass} num`}
                />
              </AdminField>
              <AdminField label={isAr ? 'أقصى عدد محاولات' : 'Max Attempts'}>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={view.maxAttempts}
                  onChange={(event) =>
                    patchExam({ maxAttempts: Math.min(10, Math.max(1, Math.round(Number(event.target.value) || 1))) })
                  }
                  className={`${adminFieldClass} num`}
                />
              </AdminField>
              {!isCreate && (
                <AdminField label={isAr ? 'الحالة' : 'Status'}>
                  <select
                    value={view.status}
                    onChange={(event) => patchExam({ status: event.target.value as AdminExamStatus })}
                    className={adminFieldClass}
                  >
                    <option value="published">{isAr ? 'منشور' : 'Published'}</option>
                    <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
                  </select>
                </AdminField>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField
                label={isAr ? 'متاح من (اختياري)' : 'Available From (optional)'}
                hint={isAr ? 'اتركه فارغًا ليكون متاحًا دائمًا' : 'Leave empty for always available'}
              >
                <input
                  type="date"
                  value={view.availableFrom ? view.availableFrom.slice(0, 10) : ''}
                  onChange={(event) =>
                    patchExam({
                      availableFrom: event.target.value
                        ? new Date(`${event.target.value}T00:00:00`).toISOString()
                        : null,
                    })
                  }
                  className={`${adminFieldClass} num`}
                />
              </AdminField>
              <AdminField label={isAr ? 'متاح حتى (اختياري)' : 'Available Until (optional)'}>
                <input
                  type="date"
                  value={view.availableTo ? view.availableTo.slice(0, 10) : ''}
                  onChange={(event) =>
                    patchExam({
                      availableTo: event.target.value
                        ? new Date(`${event.target.value}T23:59:59`).toISOString()
                        : null,
                    })
                  }
                  className={`${adminFieldClass} num`}
                />
              </AdminField>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
              <input
                type="checkbox"
                checked={view.showCorrectAnswers}
                onChange={(event) => patchExam({ showCorrectAnswers: event.target.checked })}
                className="h-4 w-4 accent-[#176B87] dark:accent-[#28B5C5]"
              />
              {isAr
                ? 'عرض الإجابات الصحيحة للطالب بعد التسليم'
                : 'Show correct answers to students after submission'}
            </label>
            <AdminField label={isAr ? 'تعليمات الطلاب (عربي)' : 'Student Instructions (Arabic)'}>
              <textarea
                value={view.instructionsAr}
                onChange={(event) => patchExam({ instructionsAr: event.target.value })}
                rows={3}
                className={adminFieldClass}
              />
            </AdminField>
            <AdminField label={isAr ? 'تعليمات الطلاب (إنجليزي)' : 'Student Instructions (English)'}>
              <textarea
                value={view.instructionsEn}
                onChange={(event) => patchExam({ instructionsEn: event.target.value })}
                rows={3}
                className={adminFieldClass}
                dir="ltr"
              />
            </AdminField>
          </AdminCard>

          {/* Meta summary card */}
          <AdminCard className="space-y-2.5 p-5 text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
              <span className="num">
                {view.questions.length} {isAr ? 'أسئلة' : 'questions'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
              <span className="num">
                {isAr ? 'الدرجة الكلية' : 'Total marks'}:{' '}
                <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">{totalMarks}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
              <span className="num">
                {isAr ? 'درجة النجاح' : 'Passing score'}:{' '}
                <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">
                  {passingMarks} ({view.passingPct}%)
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
              <span className="num">
                {isCreate
                  ? isAr
                    ? 'سيُسجَّل تاريخ الإنشاء عند الحفظ'
                    : 'Creation date is recorded on save'
                  : `${isAr ? 'أُنشئ' : 'Created'} ${formatAdminDate(view.createdAt, locale)} · ${isAr ? 'آخر تحديث' : 'Updated'} ${formatAdminDate(view.updatedAt, locale)}`}
              </span>
            </div>
          </AdminCard>
        </div>

        {/* Question builder */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? 'بنك الأسئلة' : 'Question Builder'}
            </h3>
            <button type="button" onClick={() => setQuestionModal({})} className={adminBtnClass('primary')}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {isAr ? 'إضافة سؤال' : 'Add Question'}
            </button>
          </div>

          <div className="space-y-3" onDragOver={(event) => event.preventDefault()}>
            {view.questions.map((question, index) => (
              <div
                key={question.id}
                onDragOver={() => {
                  if (draggingIndex !== null && draggingIndex !== index) {
                    const from = draggingIndex;
                    setDraggingIndex(index);
                    if (isCreate) {
                      setDraft((prev) => {
                        const questions = [...prev.questions];
                        if (from < 0 || from >= questions.length || index < 0 || index >= questions.length) {
                          return prev;
                        }
                        const [moved] = questions.splice(from, 1);
                        questions.splice(index, 0, moved);
                        return { ...prev, questions };
                      });
                    } else {
                      update((prev) => reorderExamQuestionsState(prev, exam.id, from, index));
                    }
                  }
                }}
              >
                <AdminCard className="p-4">
                  <div className="flex flex-wrap items-start gap-2">
                    <div className="mt-0.5 flex-none cursor-grab text-[#94A3B8]" draggable onDragStart={() => setDraggingIndex(index)} onDragEnd={() => setDraggingIndex(null)}>
                    <GripVertical className="h-4 w-4" aria-hidden="true" />
                  </div>
                    <span className="num mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full bg-[#EAF3F6] text-[0.72rem] font-extrabold text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.88rem] font-bold leading-snug text-[#183247] dark:text-[#F1F5F9]">
                        {isAr ? question.textAr : question.textEn}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <AdminBadge tone="brand">
                          {isAr ? QUESTION_TYPE_LABELS[question.type].ar : QUESTION_TYPE_LABELS[question.type].en}
                        </AdminBadge>
                        <AdminBadge tone="neutral">
                          {question.marks} {isAr ? 'درجة' : 'marks'}
                        </AdminBadge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setQuestionModal({ question })}
                        aria-label={isAr ? 'تعديل السؤال' : 'Edit question'}
                        title={isAr ? 'تعديل' : 'Edit'}
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteQuestionId(question.id)}
                        aria-label={isAr ? 'حذف السؤال' : 'Delete question'}
                        title={isAr ? 'حذف' : 'Delete'}
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#FCEBE9] hover:text-[#C0392B] dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5] cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {question.type === 'multiple_choice' && (
                    <ul className="mt-2.5 space-y-1 ps-9">
                      {question.options.map((option) => (
                        <li
                          key={option.id}
                          className={`rounded-[8px] px-3 py-1.5 text-[0.78rem] font-semibold ${
                            option.id === question.correctOptionId
                              ? 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]'
                              : 'bg-[#EAF3F6] text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]'
                          }`}
                        >
                          {isAr ? option.textAr : option.textEn}
                          {option.id === question.correctOptionId && ' ✓'}
                        </li>
                      ))}
                    </ul>
                  )}
                </AdminCard>
              </div>
            ))}
            {view.questions.length === 0 && (
              <p className="rounded-[14px] border border-dashed border-[#DCE7ED] px-4 py-8 text-center text-[0.82rem] text-[#94A3B8] dark:border-white/15">
                {isAr
                  ? 'لا توجد أسئلة بعد — أضف أول سؤال لبناء الاختبار.'
                  : 'No questions yet — add the first question to build this exam.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Question add/edit modal */}
      {questionModal && (
        <QuestionFormModal
          locale={locale}
          question={questionModal.question}
          onClose={() => setQuestionModal(null)}
          onSubmit={(values) => {
            if (questionModal.question) {
              if (isCreate) {
                setDraft((prev) => ({
                  ...prev,
                  questions: prev.questions.map((question) =>
                    question.id === questionModal.question!.id ? { ...question, ...values } : question
                  ),
                }));
              } else {
                update((prev) =>
                  updateExamQuestionState(prev, exam.id, questionModal.question!.id, values)
                );
              }
            } else if (isCreate) {
              setDraft((prev) => ({
                ...prev,
                questions: [...prev.questions, { ...values, id: makeLocalId('q') }],
              }));
            } else {
              update((prev) => addExamQuestionState(prev, exam.id, values));
            }
            setQuestionModal(null);
          }}
        />
      )}

      {/* Question delete confirmation */}
      {deleteQuestionId && (
        <ConfirmDialog
          locale={locale}
          title={isAr ? 'حذف السؤال' : 'Delete Question'}
          message={
            isAr
              ? 'سيتم حذف هذا السؤال من الاختبار نهائيًا. هل تريد المتابعة؟'
              : 'This question will be permanently removed from the exam. Continue?'
          }
          confirmLabel={isAr ? 'حذف السؤال' : 'Delete Question'}
          onConfirm={() => {
            if (isCreate) {
              setDraft((prev) => ({
                ...prev,
                questions: prev.questions.filter((question) => question.id !== deleteQuestionId),
              }));
            } else {
              update((prev) => deleteExamQuestionState(prev, exam.id, deleteQuestionId));
            }
            setDeleteQuestionId(null);
          }}
          onCancel={() => setDeleteQuestionId(null)}
        />
      )}

      {/* Preview modal */}
      {previewOpen && (
        <AdminModal title={isAr ? 'معاينة الاختبار' : 'Exam Preview'} onClose={() => setPreviewOpen(false)} maxWidth="640px">
          <div className="space-y-4">
            <h3 className="text-[1.05rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? view.titleAr : view.titleEn}
            </h3>
            <p className="text-[0.86rem] leading-[1.85] text-[#64748B] dark:text-[#B8C7D9]">
              {isAr ? view.instructionsAr : view.instructionsEn}
            </p>
            {view.questions.map((question, index) => (
              <div key={question.id} className="rounded-[12px] border border-[#DCE7ED] p-4 dark:border-white/12">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[0.88rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                    {index + 1}. {isAr ? question.textAr : question.textEn}
                  </p>
                  <AdminBadge tone="brand">
                    {question.marks} {isAr ? 'درجة' : 'marks'}
                  </AdminBadge>
                </div>
                {question.type === 'multiple_choice' && (
                  <ul className="mt-2 space-y-1.5">
                    {question.options.map((option) => (
                      <li
                        key={option.id}
                        className={`rounded-[8px] px-3 py-1.5 text-[0.8rem] font-semibold ${
                          option.id === question.correctOptionId
                            ? 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]'
                            : 'bg-[#EAF3F6] text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]'
                        }`}
                      >
                        {isAr ? option.textAr : option.textEn}
                        {option.id === question.correctOptionId && (isAr ? ' ✓ الصحيحة' : ' ✓ Correct')}
                      </li>
                    ))}
                  </ul>
                )}
                {question.type === 'true_false' && (
                  <p className="mt-2 text-[0.8rem] font-semibold text-[#1F8A5B] dark:text-[#6EE7B7]">
                    {isAr
                      ? `الإجابة الصحيحة: ${question.correctTrueFalse ? 'صح' : 'خطأ'}`
                      : `Correct answer: ${question.correctTrueFalse ? 'True' : 'False'}`}
                  </p>
                )}
                {question.type === 'short_answer' && (
                  <p className="mt-2 text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                    {isAr ? 'الإجابة المتوقعة: ' : 'Expected answer: '}
                    <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">
                      {isAr ? question.expectedAnswerAr : question.expectedAnswerEn}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </AdminModal>
      )}
    </div>
  );
}


interface QuestionFormValues {
  type: AdminQuestionType;
  textAr: string;
  textEn: string;
  options: AdminQuestion['options'];
  correctOptionId: string | null;
  correctTrueFalse: boolean;
  expectedAnswerAr: string;
  expectedAnswerEn: string;
  image?: string;
  marks: number;
}

function QuestionFormModal({
  locale,
  question,
  onClose,
  onSubmit,
}: {
  locale: Locale;
  question?: AdminQuestion;
  onClose: () => void;
  onSubmit: (values: QuestionFormValues) => void;
}) {
  const isAr = locale === 'ar';
  const [type, setType] = useState<AdminQuestionType>(question?.type ?? 'multiple_choice');
  const [textAr, setTextAr] = useState(question?.textAr ?? '');
  const [textEn, setTextEn] = useState(question?.textEn ?? '');
  const [options, setOptions] = useState<AdminQuestion['options']>(
    question?.options.length
      ? question.options
      : [
          { id: `opt-${Math.random().toString(36).slice(2, 8)}`, textAr: '', textEn: '' },
          { id: `opt-${Math.random().toString(36).slice(2, 8)}`, textAr: '', textEn: '' },
        ]
  );
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(
    question?.correctOptionId ?? null
  );
  const [correctTrueFalse, setCorrectTrueFalse] = useState(question?.correctTrueFalse ?? true);
  const [expectedAnswerAr, setExpectedAnswerAr] = useState(question?.expectedAnswerAr ?? '');
  const [expectedAnswerEn, setExpectedAnswerEn] = useState(question?.expectedAnswerEn ?? '');
  const [image, setImage] = useState(question?.image ?? '');
  const [marks, setMarks] = useState(String(question?.marks ?? 1));
  const [error, setError] = useState('');

  const addOption = () => {
    const id = `opt-${Math.random().toString(36).slice(2, 8)}`;
    setOptions((prev) => [...prev, { id, textAr: '', textEn: '' }]);
    if (!correctOptionId) setCorrectOptionId(id);
  };

  const removeOption = (optionId: string) => {
    setOptions((prev) => prev.filter((option) => option.id !== optionId));
    if (correctOptionId === optionId) {
      setCorrectOptionId(options.find((option) => option.id !== optionId)?.id ?? null);
    }
  };


  return (
    <AdminModal
      title={question ? (isAr ? 'تعديل السؤال' : 'Edit Question') : isAr ? 'إضافة سؤال' : 'Add Question'}
      onClose={onClose}
      maxWidth="600px"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!textAr.trim() && !textEn.trim()) {
            setError(isAr ? 'أدخل نص السؤال.' : 'Enter the question text.');
            return;
          }
          const filled =
            type === 'multiple_choice'
              ? options.filter((option) => option.textAr.trim() !== '' || option.textEn.trim() !== '')
              : [];
          if (type === 'multiple_choice') {
            if (filled.length < 2) {
              setError(isAr ? 'أضف خيارين صحيحين على الأقل.' : 'Add at least two valid options.');
              return;
            }
            if (!filled.some((option) => option.id === correctOptionId)) {
              setError(isAr ? 'حدد الإجابة الصحيحة.' : 'Select the correct answer.');
              return;
            }
          }
          onSubmit({
            type,
            textAr: textAr.trim() || textEn.trim(),
            textEn: textEn.trim() || textAr.trim(),
            options: filled,
            correctOptionId: type === 'multiple_choice' ? correctOptionId : null,
            correctTrueFalse: type === 'true_false' ? correctTrueFalse : false,
            expectedAnswerAr: type === 'short_answer' ? expectedAnswerAr.trim() : '',
            expectedAnswerEn: type === 'short_answer' ? expectedAnswerEn.trim() : '',
            image: image.trim() ? image.trim() : undefined,
            marks: Math.max(1, Math.round(Number(marks) || 1)),
          });
        }}
      >
        {error && <p className="text-[0.82rem] font-bold text-[#C0392B] dark:text-[#FCA5A5]">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <AdminField label={isAr ? 'نوع السؤال' : 'Question Type'}>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as AdminQuestionType)}
              disabled={Boolean(question)}
              className={`${adminFieldClass} ${question ? 'opacity-60' : ''}`}
            >
              <option value="multiple_choice">{isAr ? 'اختيار من متعدد' : 'Multiple Choice'}</option>
              <option value="true_false">{isAr ? 'صح أو خطأ' : 'True or False'}</option>
              <option value="short_answer">{isAr ? 'إجابة قصيرة' : 'Short Answer'}</option>
            </select>
          </AdminField>
          <AdminField label={isAr ? 'الدرجة' : 'Marks'}>
            <input
              type="number"
              min={1}
              value={marks}
              onChange={(event) => setMarks(event.target.value)}
              className={`${adminFieldClass} num`}
            />
          </AdminField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label={isAr ? 'نص السؤال (عربي)' : 'Question Text (Arabic)'}>
            <textarea
              value={textAr}
              onChange={(event) => setTextAr(event.target.value)}
              rows={2}
              className={adminFieldClass}
            />
          </AdminField>
          <AdminField label={isAr ? 'نص السؤال (إنجليزي)' : 'Question Text (English)'}>
            <textarea
              value={textEn}
              onChange={(event) => setTextEn(event.target.value)}
              rows={2}
              className={adminFieldClass}
              dir="ltr"
            />
          </AdminField>
        </div>

        {type === 'multiple_choice' && (
          <div className="rounded-[12px] border border-[#DCE7ED] p-4 dark:border-white/12">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.8rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                {isAr ? 'الخيارات (حدد الصحيحة)' : 'Options (select the correct one)'}
              </span>
              <button type="button" onClick={addOption} className={adminBtnClass('subtle')}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                {isAr ? 'خيار' : 'Option'}
              </button>
            </div>
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctOptionId === option.id}
                    onChange={() => setCorrectOptionId(option.id)}
                    aria-label={isAr ? 'إجابة صحيحة' : 'Correct answer'}
                    className="h-4 w-4 flex-none accent-[#1F8A5B] dark:accent-[#6EE7B7]"
                  />
                  <input
                    value={isAr ? option.textAr : option.textEn}
                    onChange={(event) =>
                      setOptions((prev) =>
                        prev.map((item) =>
                          item.id === option.id
                            ? isAr
                              ? { ...item, textAr: event.target.value }
                              : { ...item, textEn: event.target.value }
                            : item
                        )
                      )
                    }
                    placeholder={isAr ? 'نص الخيار' : 'Option text'}
                    className={adminFieldClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(option.id)}
                    disabled={options.length <= 2}
                    aria-label={isAr ? 'إزالة الخيار' : 'Remove option'}
                    className="grid h-9 w-9 flex-none place-items-center rounded-[8px] text-[#64748B] hover:bg-[#FCEBE9] hover:text-[#C0392B] dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'true_false' && (
          <div className="flex items-center gap-4 rounded-[12px] border border-[#DCE7ED] p-4 dark:border-white/12">
            <span className="text-[0.82rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
              {isAr ? 'الإجابة الصحيحة:' : 'Correct answer:'}
            </span>
            <label className="flex cursor-pointer items-center gap-1.5 text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
              <input
                type="radio"
                name="correctTF"
                checked={correctTrueFalse}
                onChange={() => setCorrectTrueFalse(true)}
                className="h-4 w-4 accent-[#176B87] dark:accent-[#28B5C5]"
              />
              {isAr ? 'صح' : 'True'}
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
              <input
                type="radio"
                name="correctTF"
                checked={!correctTrueFalse}
                onChange={() => setCorrectTrueFalse(false)}
                className="h-4 w-4 accent-[#176B87] dark:accent-[#28B5C5]"
              />
              {isAr ? 'خطأ' : 'False'}
            </label>
          </div>
        )}

        {type === 'short_answer' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField
              label={isAr ? 'الإجابة المتوقعة (عربي)' : 'Expected Answer (Arabic)'}
              hint={isAr ? 'يُستخدم كدليل تصحيح تجريبي' : 'Used as demo grading guidance'}
            >
              <input
                value={expectedAnswerAr}
                onChange={(event) => setExpectedAnswerAr(event.target.value)}
                className={adminFieldClass}
              />
            </AdminField>
            <AdminField label={isAr ? 'الإجابة المتوقعة (إنجليزي)' : 'Expected Answer (English)'}>
              <input
                value={expectedAnswerEn}
                onChange={(event) => setExpectedAnswerEn(event.target.value)}
                className={adminFieldClass}
                dir="ltr"
              />
            </AdminField>
          </div>
        )}

        <AdminField label={isAr ? 'صورة السؤال (اختياري — رابط)' : 'Question Image (optional — URL)'}>
          <input
            value={image}
            onChange={(event) => setImage(event.target.value)}
            className={adminFieldClass}
            dir="ltr"
            placeholder="https://…"
          />
        </AdminField>
        {image.trim() !== '' && (
          <img
            src={image}
            alt=""
            className="h-[72px] w-[110px] rounded-[8px] border border-[#DCE7ED] object-cover dark:border-white/12"
          />
        )}

        <div className="flex items-center justify-end gap-2 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
          <button type="button" onClick={onClose} className={adminBtnClass('ghost')}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" className={adminBtnClass('primary', 'md')}>
            {question ? (isAr ? 'حفظ السؤال' : 'Save Question') : isAr ? 'إضافة السؤال' : 'Add Question'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
