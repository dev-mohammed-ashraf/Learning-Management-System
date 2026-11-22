import { ClipboardList, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { AdminDataState, AdminExam } from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  deleteExamState,
  formatAdminDate,
  getExamPassingMarks,
  getExamTotalMarks,
  setExamStatusState,
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

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface AdminExamsPageProps {
  locale: Locale;
  state: AdminDataState;
  update: UpdateFn;
  onEditExam: (examId: string) => void;
  onCreateExam: () => void;
}

export function AdminExamsPage({
  locale,
  state,
  update,
  onEditExam,
  onCreateExam,
}: AdminExamsPageProps) {
  const isAr = locale === 'ar';
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [previewExam, setPreviewExam] = useState<AdminExam | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminExam | null>(null);

  // Course display name: catalog lookup first, denormalized title fallback.
  const courseName = (exam: AdminExam): string => {
    const course = state.courses.find((item) => item.id === exam.courseId);
    if (course) return isAr ? course.titleAr : course.titleEn;
    return isAr ? exam.courseTitleAr : exam.courseTitleEn;
  };

  const courseOptions = Array.from(
    new Map(
      state.exams.map((exam) => [exam.courseId, exam.courseTitleAr]),
    ).entries(),
  );

  const filtered = state.exams.filter((exam) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      exam.titleAr.toLowerCase().includes(query) ||
      exam.titleEn.toLowerCase().includes(query);
    const matchesCourse = !courseFilter || exam.courseId === courseFilter;
    const matchesStatus = !statusFilter || exam.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });


  return (
    <div>
      <AdminPageHeader
        title={isAr ? 'إدارة الاختبارات' : 'Exam Management'}
        description={
          isAr
            ? 'إنشاء الاختبارات التجريبية وإدارتها: بنك الأسئلة، الدرجات، والحالة مع معاينة قبل النشر.'
            : 'Create and manage demo exams: question bank, marks, and status with pre-publish preview.'
        }
        action={
          <button type="button" onClick={onCreateExam} className={adminBtnClass('primary')}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isAr ? 'إضافة اختبار' : 'New Exam'}
          </button>
        }
      />

      <AdminCard className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder={isAr ? 'ابحث بعنوان الاختبار…' : 'Search by exam title…'}
          />
          <select
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
            className="h-[42px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 text-[0.84rem] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
          >
            <option value="">{isAr ? 'كل الكورسات' : 'All courses'}</option>
            {courseOptions.map(([courseId]) => {
              const firstExam = state.exams.find((item) => item.courseId === courseId);
              return (
                <option key={courseId} value={courseId}>
                  {firstExam ? courseName(firstExam) : courseId}
                </option>
              );
            })}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-[42px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 text-[0.84rem] font-bold text-[#183247] dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9]"
          >
            <option value="">{isAr ? 'كل الحالات' : 'All statuses'}</option>
            <option value="published">{isAr ? 'منشور' : 'Published'}</option>
            <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
          </select>
          <span className="num ms-auto text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
            {filtered.length} / {state.exams.length}
          </span>
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
          title={isAr ? 'لا توجد اختبارات مطابقة' : 'No matching exams'}
          description={
            isAr
              ? 'جرّب تعديل عناصر البحث أو الفلاتر، أو أنشئ اختبارًا جديدًا.'
              : 'Try adjusting the search or filters, or create a new exam.'
          }
        />
      ) : (
        <AdminCard>
          <AdminTableWrap>
            <thead>
              <tr>
                <AdminTh>{isAr ? 'الاختبار' : 'Exam'}</AdminTh>
                <AdminTh>{isAr ? 'الكورس' : 'Course'}</AdminTh>
                <AdminTh>{isAr ? 'الأسئلة' : 'Questions'}</AdminTh>
                <AdminTh>{isAr ? 'المدة' : 'Duration'}</AdminTh>
                <AdminTh>{isAr ? 'الدرجة الكلية' : 'Total Marks'}</AdminTh>
                <AdminTh>{isAr ? 'درجة النجاح' : 'Passing Score'}</AdminTh>
                <AdminTh>{isAr ? 'الحالة' : 'Status'}</AdminTh>
                <AdminTh>{isAr ? 'تاريخ الإنشاء' : 'Created'}</AdminTh>
                <AdminTh>{isAr ? 'إجراءات' : 'Actions'}</AdminTh>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exam) => (
                <tr key={exam.id} className="transition-colors hover:bg-[#EAF3F6]/40 dark:hover:bg-[#102238]/40">
                  <AdminTd>
                    <div className="min-w-0">
                      <div className="truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                        {isAr ? exam.titleAr : exam.titleEn}
                      </div>
                      <div className="truncate text-[0.74rem] text-[#64748B] dark:text-[#B8C7D9]">
                        {exam.sectionTitleAr
                          ? isAr
                            ? exam.sectionTitleAr
                            : exam.sectionTitleEn
                          : isAr
                            ? 'لكل الكورس'
                            : 'Whole course'}
                      </div>
                    </div>
                  </AdminTd>
                  <AdminTd className="max-w-[200px] truncate text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                    {courseName(exam)}
                  </AdminTd>
                  <AdminTd className="num text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                    {exam.questions.length}
                  </AdminTd>
                  <AdminTd className="num text-[0.8rem] text-[#64748B] dark:text-[#B8C7D9]">
                    {exam.durationMinutes} {isAr ? 'دقيقة' : 'min'}
                  </AdminTd>
                  <AdminTd className="num text-[0.8rem] text-[#64748B] dark:text-[#B8C7D9]">
                    {getExamTotalMarks(exam)}
                  </AdminTd>
                  <AdminTd className="num text-[0.8rem] text-[#64748B] dark:text-[#B8C7D9]">
                    {getExamPassingMarks(exam)} ({exam.passingPct}%)
                  </AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      onClick={() =>
                        update((prev) =>
                          setExamStatusState(
                            prev,
                            exam.id,
                            exam.status === 'published' ? 'draft' : 'published'
                          )
                        )
                      }
                      title={isAr ? 'تبديل الحالة' : 'Toggle status'}
                      className="cursor-pointer"
                    >
                      <AdminBadge tone={exam.status === 'published' ? 'success' : 'warn'}>
                        {exam.status === 'published' ? (isAr ? 'منشور' : 'Published') : isAr ? 'مسودة' : 'Draft'}
                      </AdminBadge>
                    </button>
                  </AdminTd>
                  <AdminTd className="num text-[0.78rem] text-[#64748B] dark:text-[#B8C7D9]">
                    {formatAdminDate(exam.createdAt, locale)}
                  </AdminTd>
                  <AdminTd>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditExam(exam.id)}
                        aria-label={isAr ? 'تعديل الاختبار' : 'Edit exam'}
                        title={isAr ? 'تعديل' : 'Edit'}
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewExam(exam)}
                        aria-label={isAr ? 'معاينة الاختبار' : 'Preview exam'}
                        title={isAr ? 'معاينة' : 'Preview'}
                        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#1B3553] dark:hover:text-[#28B5C5] cursor-pointer"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(exam)}
                        aria-label={isAr ? 'حذف الاختبار' : 'Delete exam'}
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

      {/* Preview */}
      {previewExam && (
        <AdminModal title={isAr ? 'معاينة الاختبار' : 'Exam Preview'} onClose={() => setPreviewExam(null)} maxWidth="640px">
          <div className="space-y-4">
            <div>
              <h3 className="text-[1.05rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                {isAr ? previewExam.titleAr : previewExam.titleEn}
              </h3>
              <p className="mt-1 text-[0.86rem] leading-[1.85] text-[#64748B] dark:text-[#B8C7D9]">
                {isAr ? previewExam.descriptionAr : previewExam.descriptionEn}
              </p>
            </div>
            <div className="num flex flex-wrap gap-2 text-[0.76rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
              <span className="rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 dark:bg-[#102238]">
                {previewExam.questions.length} {isAr ? 'أسئلة' : 'questions'}
              </span>
              <span className="rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 dark:bg-[#102238]">
                {previewExam.durationMinutes} {isAr ? 'دقيقة' : 'min'}
              </span>
              <span className="rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 dark:bg-[#102238]">
                {getExamTotalMarks(previewExam)} {isAr ? 'درجة' : 'marks'}
              </span>
              <span className="rounded-[8px] bg-[#EAF3F6] px-3 py-1.5 dark:bg-[#102238]">
                {isAr ? 'النجاح' : 'Pass'} {previewExam.passingPct}%
              </span>
            </div>
            {previewExam.questions.map((question, index) => (
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

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          locale={locale}
          title={isAr ? 'حذف الاختبار' : 'Delete Exam'}
          message={
            isAr
              ? `سيتم حذف اختبار «${deleteTarget.titleAr}» وبنك أسئلته من البيانات التجريبية نهائيًا. هل تريد المتابعة؟`
              : `The exam "${deleteTarget.titleEn}" and its question bank will be permanently removed from the demo data. Continue?`
          }
          confirmLabel={isAr ? 'حذف نهائي' : 'Delete Permanently'}
          onConfirm={() => {
            update((prev) => deleteExamState(prev, deleteTarget.id));
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
