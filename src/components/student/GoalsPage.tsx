import { useState } from 'react';
import { Calendar, CheckCircle2, Pencil, Plus, Target, Trash2 } from 'lucide-react';
import type { Locale, Program } from '../../types/program';
import type { LearningGoal, StudentPlatformState } from '../../types/student';
import { PageHeroBanner } from '../common/PageHeroBanner';
import { ProgressBar } from '../common/ProgressBar';

interface GoalsPageProps {
  locale: Locale;
  state: StudentPlatformState;
  programs: Program[];
  onGoHome: () => void;
  onCreateGoal: (input: {
    title: string;
    targetDate: string;
    progress: number;
    relatedProgramId?: string;
  }) => void;
  onUpdateGoal: (
    goalId: string,
    patch: Partial<Pick<LearningGoal, 'title' | 'targetDate' | 'progress' | 'status' | 'relatedProgramId'>>
  ) => void;
  onDeleteGoal: (goalId: string) => void;
}

export function GoalsPage({
  locale,
  state,
  programs,
  onGoHome,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
}: GoalsPageProps) {
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [relatedProgramId, setRelatedProgramId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError(
        locale === 'ar' ? 'يرجى كتابة عنوان الهدف التعليمي.' : 'Please enter a goal title.'
      );
      return;
    }
    setFormError('');

    if (editingId) {
      onUpdateGoal(editingId, {
        title: title.trim(),
        targetDate,
        progress,
        relatedProgramId: relatedProgramId || undefined,
      });
      setEditingId(null);
    } else {
      onCreateGoal({
        title: title.trim(),
        targetDate,
        progress,
        relatedProgramId: relatedProgramId || undefined,
      });
    }

    setTitle('');
    setTargetDate('');
    setProgress(0);
    setRelatedProgramId('');
  };

  const startEdit = (goal: LearningGoal) => {
    setEditingId(goal.id);
    setTitle(goal.title);
    setTargetDate(goal.targetDate);
    setProgress(goal.progress);
    setRelatedProgramId(goal.relatedProgramId ?? '');
    setFormError('');
  };

  return (
    <div>
      <PageHeroBanner
        locale={locale}
        eyebrowAr="التخطيط الدراسي الشخصي"
        eyebrowEn="Personal Study Planning"
        titleAr="أهدافي التعليمية"
        titleEn="My Learning Goals"
        descriptionAr="أنشئ أهدافك الدراسية وحدّد مواعيدها المستهدفة وتابع نسبة إنجازها لحظة بلحظة بالتزامن مع لوحة الإنجاز."
        descriptionEn="Create study goals, set target dates, and track real progress updates synced with your Dashboard."
        onGoHome={onGoHome}
      />

      <section className="py-[32px] pb-[72px]">
        <div className="wrap grid grid-cols-12 gap-[24px]">
          {/* Create / Edit Goal Form */}
          <div className="col-span-12 lg:col-span-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[22px] space-y-4 sticky top-[112px]"
            >
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                <h2 className="text-[1.08rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                  {editingId
                    ? locale === 'ar'
                      ? 'تعديل الهدف التعليمي'
                      : 'Edit Learning Goal'
                    : locale === 'ar'
                      ? 'إضافة هدف جديد'
                      : 'Add New Goal'}
                </h2>
              </div>

              {formError && (
                <p className="text-[0.84rem] font-bold text-[#C0392B] dark:text-[#FCA5A5]">
                  {formError}
                </p>
              )}

              <div className="space-y-1.5">
                <label className="block text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                  {locale === 'ar' ? 'عنوان الهدف' : 'Goal Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    locale === 'ar'
                      ? 'مثال: إتمام محور المحاسبة قبل نهاية الشهر'
                      : 'e.g., Finish Accounting module this month'
                  }
                  className="w-full h-[44px] px-3.5 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#28B5C5] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                  {locale === 'ar' ? 'الدورة المرتبطة (اختياري)' : 'Linked Course (Optional)'}
                </label>
                <select
                  value={relatedProgramId}
                  onChange={(e) => setRelatedProgramId(e.target.value)}
                  className="ut-filter-select w-full h-[44px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[0.86rem] font-bold text-[#142D4E] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                >
                  <option value="">{locale === 'ar' ? 'هدف عام غير مرتبط' : 'General Study Goal'}</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {locale === 'ar' ? p.titleAr : p.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                    {locale === 'ar' ? 'التاريخ المستهدف' : 'Target Date'}
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full h-[44px] px-3 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[0.85rem] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[0.82rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                    {locale === 'ar' ? `التقدّم (${progress}%)` : `Progress (${progress}%)`}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full h-[44px] accent-[#176B87] dark:accent-[#28B5C5] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 h-[44px] rounded-[10px] bg-[#176B87] text-white font-bold text-[0.9rem] hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {editingId
                      ? locale === 'ar'
                        ? 'حفظ التعديلات'
                        : 'Save Changes'
                      : locale === 'ar'
                        ? 'إضافة الهدف'
                        : 'Add Goal'}
                  </span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setTitle('');
                      setTargetDate('');
                      setProgress(0);
                      setRelatedProgramId('');
                    }}
                    className="h-[44px] px-4 rounded-[10px] border border-[#DCE7ED] font-bold text-[0.86rem] text-[#64748B] dark:border-white/15 dark:text-[#B8C7D9] cursor-pointer"
                  >
                    {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Goals List */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {state.goals.length === 0 ? (
              <div className="bg-[#EAF3F6] dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] py-[48px] px-[24px] text-center space-y-2.5">
                <Target
                  className="w-10 h-10 mx-auto text-[#176B87] dark:text-[#28B5C5]"
                  aria-hidden="true"
                />
                <h2 className="text-[1.12rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                  {locale === 'ar' ? 'قائمة أهدافك فارغة حاليًا' : 'No study goals yet'}
                </h2>
                <p className="text-[0.9rem] text-[#64748B] dark:text-[#B8C7D9] max-w-[44ch] mx-auto">
                  {locale === 'ar'
                    ? 'استخدم النموذج المجاور لتحديد أول هدف دراسي وربطه بأحد دبلوماتك.'
                    : 'Use the form to set your first learning target and link it to a diploma course.'}
                </p>
              </div>
            ) : (
              state.goals.map((goal) => {
                const linkedProgram = programs.find((p) => p.id === goal.relatedProgramId);
                const isDone = goal.status === 'completed';

                return (
                  <article
                    key={goal.id}
                    className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[20px] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[0.74rem] font-bold px-2.5 py-0.5 rounded-[6px] ${
                              isDone
                                ? 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]'
                                : 'bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]'
                            }`}
                          >
                            {isDone
                              ? locale === 'ar'
                                ? 'مكتمل'
                                : 'Completed'
                              : locale === 'ar'
                                ? 'قيد التنفيذ'
                                : 'Active'}
                          </span>

                          {goal.targetDate && (
                            <span className="num inline-flex items-center gap-1 text-[0.78rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                              {goal.targetDate}
                            </span>
                          )}
                        </div>

                        <h3 className="text-[1.06rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                          {goal.title}
                        </h3>

                        {linkedProgram && (
                          <div className="text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                            {locale === 'ar' ? linkedProgram.titleAr : linkedProgram.titleEn}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-none">
                        {!isDone && (
                          <button
                            type="button"
                            onClick={() => onUpdateGoal(goal.id, { status: 'completed', progress: 100 })}
                            className="h-[34px] px-3 rounded-[9px] bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7] font-bold text-[0.78rem] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{locale === 'ar' ? 'إتمام' : 'Complete'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => startEdit(goal)}
                          aria-label={locale === 'ar' ? 'تعديل الهدف' : 'Edit goal'}
                          className="w-[34px] h-[34px] rounded-[9px] border border-[#DCE7ED] dark:border-white/15 grid place-items-center text-[#142D4E] dark:text-[#F1F5F9] hover:border-[#28B5C5] cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteGoal(goal.id)}
                          aria-label={locale === 'ar' ? 'حذف الهدف' : 'Delete goal'}
                          className="w-[34px] h-[34px] rounded-[9px] border border-[#DCE7ED] dark:border-white/15 grid place-items-center text-[#C0392B] dark:text-[#FCA5A5] hover:border-[#C0392B] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                        <span>{locale === 'ar' ? 'نسبة الإنجاز' : 'Progress'}</span>
                        <span className="num text-[#142D4E] dark:text-[#F1F5F9]">
                          {goal.progress}%
                        </span>
                      </div>
                      <ProgressBar value={goal.progress} size="sm" />
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
