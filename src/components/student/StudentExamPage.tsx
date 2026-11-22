import { useEffect, useMemo, useState } from 'react';
import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  ListChecks,
  Lock,
  Target,
  X,
} from 'lucide-react';
import type { AdminExam, AdminExamAttempt, AdminQuestion } from '../../types/admin';
import type { DemoCourse, DemoLearningState } from '../../types/coursePlayer';
import type { Locale } from '../../types/program';
import {
  canStartExam,
  countSubmittedAttempts,
  formatCountdown,
  getActiveAttempt,
  getAttemptsForExam,
  getExamPassingMarks,
  getExamTotalMarks,
  isExamEnrollmentLocked,
  isQuestionCorrect,
} from '../../utils/studentExam';

type AnswerMap = Record<string, string | boolean>;

interface StudentExamPageProps {
  locale: Locale;
  exam: AdminExam;
  attempts: AdminExamAttempt[];
  demoLearning: DemoLearningState;
  demoCourses: DemoCourse[];
  /** Demo student id attributed to new attempts (null = unattributed local student). */
  viewerStudentId?: string | null;
  onBack: () => void;
  /** Creates a new demo attempt and returns its id. */
  onStartAttempt: (examId: string) => string;
  /** Grades + persists the demo attempt. */
  onSubmitAttempt: (attemptId: string, answers: AnswerMap) => void;
}

type Phase = 'details' | 'running' | 'result';

const QUESTION_TYPE_STUDENT: Record<AdminQuestion['type'], { ar: string; en: string }> = {
  multiple_choice: { ar: 'اختيار من متعدد', en: 'Multiple Choice' },
  true_false: { ar: 'صح أو خطأ', en: 'True or False' },
  short_answer: { ar: 'إجابة قصيرة', en: 'Short Answer' },
};

export function StudentExamPage({
  locale,
  exam,
  attempts,
  demoLearning,
  demoCourses,
  viewerStudentId,
  onBack,
  onStartAttempt,
  onSubmitAttempt,
}: StudentExamPageProps) {
  const isAr = locale === 'ar';
  const totalMarks = getExamTotalMarks(exam);
  const passingMarks = getExamPassingMarks(exam);
  const usedAttempts = countSubmittedAttempts(attempts, exam.id);
  const attemptsLeft = Math.max(0, exam.maxAttempts - usedAttempts);
  const enrollmentLocked = isExamEnrollmentLocked(exam, demoLearning, demoCourses);
  const startBlock = canStartExam(exam, attempts, undefined, viewerStudentId);
  const myAttempts = getAttemptsForExam(attempts, exam.id, viewerStudentId);

  const [phase, setPhase] = useState<Phase>('details');
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [resultAttemptId, setResultAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const activeAttempt = useMemo(
    () => (activeAttemptId ? attempts.find((attempt) => attempt.id === activeAttemptId) ?? null : null),
    [attempts, activeAttemptId]
  );
  const resultAttempt = useMemo(
    () =>
      resultAttemptId
        ? getAttemptsForExam(attempts, exam.id, viewerStudentId).find(
            (attempt) => attempt.id === resultAttemptId
          ) ?? null
        : null,
    [attempts, exam.id, resultAttemptId, viewerStudentId]
  );

  // Countdown ticker while the exam is running.
  useEffect(() => {
    if (phase !== 'running') return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const BackArrow = isAr ? ArrowRight : ArrowLeft;
  const NextArrow = isAr ? ChevronLeft : ChevronRight;
  const PrevArrow = isAr ? ChevronRight : ChevronLeft;


  const deadline = activeAttempt
    ? new Date(activeAttempt.startedAt).getTime() + exam.durationMinutes * 60_000
    : 0;
  const msRemaining = phase === 'running' ? deadline - now : 0;

  // Auto-submit when the countdown reaches zero.
  useEffect(() => {
    if (phase !== 'running' || !activeAttemptId) return;
    if (msRemaining <= 0) {
      onSubmitAttempt(activeAttemptId, answers);
      setPhase('result');
      setResultAttemptId(activeAttemptId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msRemaining, phase, activeAttemptId]);

  const startExam = () => {
    const attemptId = onStartAttempt(exam.id);
    setActiveAttemptId(attemptId);
    setAnswers({});
    setCurrentQuestion(0);
    setPhase('running');
  };

  const submitExam = () => {
    if (!activeAttemptId) return;
    onSubmitAttempt(activeAttemptId, answers);
    setResultAttemptId(activeAttemptId);
    setActiveAttemptId(null);
    setConfirmOpen(false);
    setPhase('result');
  };

  const currentQ = exam.questions[currentQuestion];
  const answeredCount = exam.questions.filter((question) => {
    const answer = answers[question.id];
    return !(answer === undefined || answer === '' );
  }).length;

  const courseTitle = isAr ? exam.courseTitleAr : exam.courseTitleEn;


  return (
    <div>
      {/* Header */}
      <div className="border-b border-[#DCE7ED] bg-[#EAF3F6]/70 backdrop-blur-sm dark:border-white/12 dark:bg-[#102238]/70">
        <div className="wrap pt-[122px] max-[1023px]:pt-[160px] max-[767px]:pt-[202px] pb-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
            <button
              type="button"
              onClick={onBack}
              className="group inline-flex items-center gap-2 rounded-[10px] border border-[#DCE7ED] bg-white px-3.5 py-2 text-[0.85rem] font-bold text-[#183247] transition-colors hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/12 dark:bg-[#142D4E] dark:text-[#F1F5F9] dark:hover:border-[#28B5C5] dark:hover:text-[#28B5C5] cursor-pointer"
            >
              <BackArrow className="w-4 h-4" aria-hidden="true" />
              {isAr ? 'عودة' : 'Back'}
            </button>
            <div className="min-w-0">
              <div className="text-[0.72rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                {isAr ? 'اختبار الكورس · تجريبي' : 'Course Exam · Demo'}
              </div>
              <h1 className="max-w-[520px] truncate text-[1.05rem] font-extrabold text-[#142D4E] sm:text-[1.2rem] dark:text-[#F1F5F9]">
                {isAr ? exam.titleAr : exam.titleEn}
              </h1>
              <div className="truncate text-[0.78rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                {courseTitle}
                {exam.sectionTitleAr ? ` · ${isAr ? exam.sectionTitleAr : exam.sectionTitleEn}` : ''}
              </div>
            </div>
            {phase === 'running' && (
              <div
                className={`ms-auto flex items-center gap-2 rounded-[12px] border px-4 py-2.5 ${
                  msRemaining < 60_000
                    ? 'border-[#C0392B]/40 bg-[#FCEBE9] dark:border-[#FCA5A5]/40 dark:bg-[#331411]'
                    : 'border-[#DCE7ED] bg-white dark:border-white/12 dark:bg-[#142D4E]'
                }`}
              >
                <AlarmClock
                  className={`h-5 w-5 ${
                    msRemaining < 60_000
                      ? 'text-[#C0392B] dark:text-[#FCA5A5]'
                      : 'text-[#176B87] dark:text-[#28B5C5]'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`num text-[1.05rem] font-extrabold ${
                    msRemaining < 60_000
                      ? 'text-[#C0392B] dark:text-[#FCA5A5]'
                      : 'text-[#142D4E] dark:text-[#F1F5F9]'
                  }`}
                >
                  {formatCountdown(msRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="wrap pt-6 pb-[72px] max-[767px]:pb-[48px]">
        {phase === 'details' && (
          /* Exam details + instructions + gating */
          <div className="mx-auto max-w-[760px] space-y-5">
            <div className="space-y-4 rounded-[16px] border border-[#DCE7ED] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8 dark:border-white/12 dark:bg-[#142D4E]">
              <p className="text-[0.92rem] leading-[1.9] text-[#64748B] dark:text-[#B8C7D9]">
                {isAr ? exam.descriptionAr : exam.descriptionEn}
              </p>

              <div className="num grid grid-cols-2 gap-2 sm:grid-cols-4">
                <span className="flex items-center gap-1.5 rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[0.78rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                  <ClipboardList className="h-4 w-4 flex-none text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                  {exam.questions.length} {isAr ? 'أسئلة' : 'questions'}
                </span>
                <span className="flex items-center gap-1.5 rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[0.78rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                  <Clock className="h-4 w-4 flex-none text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                  {exam.durationMinutes} {isAr ? 'دقيقة' : 'min'}
                </span>
                <span className="flex items-center gap-1.5 rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[0.78rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                  <ListChecks className="h-4 w-4 flex-none text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                  {totalMarks} {isAr ? 'درجة' : 'marks'}
                </span>
                <span className="flex items-center gap-1.5 rounded-[10px] bg-[#EAF3F6] px-3 py-2 text-[0.78rem] font-bold text-[#183247] dark:bg-[#102238] dark:text-[#B8C7D9]">
                  <Target className="h-4 w-4 flex-none text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                  {isAr ? 'النجاح' : 'Pass'} {exam.passingPct}% ({passingMarks})
                </span>
              </div>

              <div className="rounded-[12px] bg-[#DDF3F5] px-4 py-3 dark:bg-[#1B3553]">
                <div className="mb-1 text-[0.78rem] font-extrabold text-[#176B87] dark:text-[#28B5C5]">
                  {isAr ? 'تعليمات الاختبار' : 'Exam Instructions'}
                </div>
                <p className="text-[0.86rem] leading-[1.9] text-[#183247] dark:text-[#B8C7D9]">
                  {isAr ? exam.instructionsAr : exam.instructionsEn}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
                <div className="num text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                  {isAr
                    ? `المحاولات المستخدمة: ${usedAttempts} من ${exam.maxAttempts}`
                    : `Attempts used: ${usedAttempts} of ${exam.maxAttempts}`}
                </div>

                {enrollmentLocked ? (
                  <span className="inline-flex items-center gap-2 rounded-[10px] border border-[#C0392B]/30 bg-[#FCEBE9] px-4 py-2.5 text-[0.84rem] font-bold text-[#C0392B] dark:border-[#FCA5A5]/30 dark:bg-[#331411] dark:text-[#FCA5A5]">
                    <Lock className="h-4 w-4" aria-hidden="true" />
                    {isAr ? 'يتطلب الاشتراك في الكورس' : 'Course enrollment required'}
                  </span>
                ) : startBlock === 'max_attempts' ? (
                  <span className="inline-flex items-center gap-2 rounded-[10px] border border-[#C0392B]/30 bg-[#FCEBE9] px-4 py-2.5 text-[0.84rem] font-bold text-[#C0392B] dark:border-[#FCA5A5]/30 dark:bg-[#331411] dark:text-[#FCA5A5]">
                    {isAr ? 'استُهلكت جميع المحاولات' : 'All attempts used'}
                  </span>
                ) : startBlock === 'not_available' ? (
                  <span className="inline-flex items-center gap-2 rounded-[10px] border border-[#C0392B]/30 bg-[#FCEBE9] px-4 py-2.5 text-[0.84rem] font-bold text-[#C0392B] dark:border-[#FCA5A5]/30 dark:bg-[#331411] dark:text-[#FCA5A5]">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {isAr ? 'الاختبار غير متاح حاليًا' : 'Exam is not available now'}
                  </span>
                ) : startBlock === 'not_published' ? (
                  <span className="inline-flex items-center gap-2 rounded-[10px] border border-[#C0392B]/30 bg-[#FCEBE9] px-4 py-2.5 text-[0.84rem] font-bold text-[#C0392B] dark:border-[#FCA5A5]/30 dark:bg-[#331411] dark:text-[#FCA5A5]">
                    {isAr ? 'هذا الاختبار مسودة' : 'This exam is a draft'}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={startExam}
                    className="inline-flex items-center gap-2 rounded-[10px] bg-[#176B87] px-6 py-2.5 text-[0.9rem] font-bold text-white transition-colors hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {isAr ? 'ابدأ الاختبار' : 'Start Exam'}
                  </button>
                )}
              </div>
            </div>

            {/* Previous attempts */}
            {myAttempts.length > 0 && (
              <div className="rounded-[16px] border border-[#DCE7ED] bg-white p-5 dark:border-white/12 dark:bg-[#142D4E]">
                <h3 className="mb-3 text-[0.92rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                  {isAr ? 'محاولاتي السابقة' : 'My Previous Attempts'}
                </h3>
                <ul className="space-y-2">
                  {myAttempts.map((attempt) => (
                    <li
                      key={attempt.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-[#EAF3F6] px-4 py-2.5 dark:bg-[#102238]"
                    >
                      <span className="num text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                        {attempt.submittedAt
                          ? isAr
                            ? 'مكتملة'
                            : 'Submitted'
                          : isAr
                            ? 'قيد التنفيذ'
                            : 'In progress'}
                    </span>
                      {attempt.submittedAt ? (
                        <span
                          className={`num rounded-[8px] px-3 py-1 text-[0.78rem] font-extrabold ${
                            attempt.passed
                              ? 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]'
                              : 'bg-[#FCEBE9] text-[#C0392B] dark:bg-[#331411] dark:text-[#FCA5A5]'
                          }`}
                        >
                          {attempt.scorePct}%
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveAttemptId(attempt.id);
                            setAnswers(attempt.answers);
                            setPhase('running');
                          }}
                          className="rounded-[8px] bg-[#176B87] px-4 py-1.5 text-[0.78rem] font-bold text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                        >
                          {isAr ? 'استئناف' : 'Resume'}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {phase === 'running' && currentQ && (
          /* Running exam: question card + navigation */
          <div className="mx-auto max-w-[820px] space-y-5">
            <div className="rounded-[16px] border border-[#DCE7ED] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8 dark:border-white/12 dark:bg-[#142D4E]">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="num rounded-[8px] bg-[#DDF3F5] px-3 py-1.5 text-[0.76rem] font-bold text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]">
                  {isAr
                    ? `السؤال ${currentQuestion + 1} من ${exam.questions.length}`
                    : `Question ${currentQuestion + 1} of ${exam.questions.length}`}
                </span>
                <span className="num text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                  {currentQ.marks} {isAr ? 'درجة' : 'marks'} ·{' '}
                  {isAr ? QUESTION_TYPE_STUDENT[currentQ.type].ar : QUESTION_TYPE_STUDENT[currentQ.type].en}
                </span>
              </div>

              <p className="mb-5 text-[1.05rem] font-bold leading-relaxed text-[#142D4E] dark:text-[#F1F5F9]">
                {isAr ? currentQ.textAr : currentQ.textEn}
              </p>

              {currentQ.image && currentQ.image.trim() !== '' && (
                <img
                  src={currentQ.image}
                  alt=""
                  className="mb-5 max-h-[240px] w-full rounded-[12px] border border-[#DCE7ED] object-cover dark:border-white/12"
                />
              )}

              {currentQ.type === 'multiple_choice' && (
                <div className="space-y-2.5">
                  {currentQ.options.map((option) => {
                    const selected = answers[currentQ.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: option.id }))}
                        aria-pressed={selected}
                        className={`flex w-full items-center gap-3 rounded-[12px] border px-4 py-3 text-start text-[0.9rem] font-semibold transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#28B5C5] bg-[#DDF3F5] text-[#142D4E] dark:border-[#28B5C5]/60 dark:bg-[#1B3553] dark:text-[#F1F5F9]'
                            : 'border-[#DCE7ED] bg-[#EAF3F6] text-[#183247] hover:border-[#28B5C5]/60 dark:border-white/12 dark:bg-[#102238] dark:text-[#B8C7D9] dark:hover:border-[#28B5C5]/50'
                        }`}
                      >
                        <span
                          className={`grid h-5 w-5 flex-none place-items-center rounded-full border-2 ${
                            selected ? 'border-[#176B87] dark:border-[#28B5C5]' : 'border-[#B7C6D3] dark:border-[#55697F]'
                          }`}
                        >
                          {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#176B87] dark:bg-[#28B5C5]" />}
                        </span>
                        {isAr ? option.textAr : option.textEn}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.type === 'true_false' && (
                <div className="flex gap-3">
                  {[
                    { value: true, labelAr: 'صح', labelEn: 'True' },
                    { value: false, labelAr: 'خطأ', labelEn: 'False' },
                  ].map((option) => {
                    const selected = answers[currentQ.id] === option.value;
                    return (
                      <button
                        key={String(option.value)}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: option.value }))}
                        aria-pressed={selected}
                        className={`flex-1 rounded-[12px] border px-4 py-3 text-[0.92rem] font-bold transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#28B5C5] bg-[#DDF3F5] text-[#142D4E] dark:border-[#28B5C5]/60 dark:bg-[#1B3553] dark:text-[#F1F5F9]'
                            : 'border-[#DCE7ED] bg-[#EAF3F6] text-[#183247] hover:border-[#28B5C5]/60 dark:border-white/12 dark:bg-[#102238] dark:text-[#B8C7D9]'
                        }`}
                      >
                        {isAr ? option.labelAr : option.labelEn}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.type === 'short_answer' && (
                <textarea
                  value={typeof answers[currentQ.id] === 'string' ? (answers[currentQ.id] as string) : ''}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, [currentQ.id]: event.target.value }))}
                  rows={3}
                  placeholder={isAr ? 'اكتب إجابتك هنا…' : 'Type your answer here…'}
                  className="w-full rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-4 py-3 text-[0.9rem] font-semibold text-[#183247] outline-none transition-colors focus:border-[#176B87] focus:bg-white dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#7E93A9] dark:focus:border-[#28B5C5] dark:focus:bg-[#102238]"
                />
              )}

              {/* Question navigation dots */}
              <div className="mt-6 flex flex-wrap gap-1.5 border-t border-[#DCE7ED] pt-4 dark:border-white/12">
                {exam.questions.map((question, index) => {
                  const answered = !(answers[question.id] === undefined || answers[question.id] === '');
                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setCurrentQuestion(index)}
                      aria-label={isAr ? `السؤال ${index + 1}` : `Question ${index + 1}`}
                      className={`num grid h-8 w-8 place-items-center rounded-[8px] text-[0.74rem] font-extrabold transition-colors cursor-pointer ${
                        index === currentQuestion
                          ? 'bg-[#176B87] text-white dark:bg-[#28B5C5] dark:text-[#0B1726]'
                          : answered
                            ? 'bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]'
                            : 'bg-[#EAF3F6] text-[#94A3B8] dark:bg-[#102238] dark:text-[#7E93A9]'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prev / Next / Submit */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((index) => Math.max(0, index - 1))}
                className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-4 py-2.5 text-[0.86rem] font-bold text-[#183247] transition-colors hover:bg-[#DDF3F5] disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9] dark:hover:bg-[#1B3553] cursor-pointer"
              >
                <PrevArrow className="h-4 w-4" aria-hidden="true" />
                {isAr ? 'السابق' : 'Previous'}
              </button>

              <span className="num text-[0.8rem] font-semibold text-[#64748B] dark:text-[#B8C7D9]">
                {isAr
                  ? `تمت الإجابة على ${answeredCount} من ${exam.questions.length}`
                  : `${answeredCount} of ${exam.questions.length} answered`}
              </span>

              {currentQuestion < exam.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestion((index) => Math.min(exam.questions.length - 1, index + 1))}
                  className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#176B87] px-5 py-2.5 text-[0.86rem] font-bold text-white transition-colors hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                >
                  {isAr ? 'التالي' : 'Next'}
                  <NextArrow className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  className="rounded-[10px] bg-[#1F8A5B] px-6 py-2.5 text-[0.86rem] font-bold text-white transition-colors hover:bg-[#14643f] dark:bg-[#2ECC71] dark:text-[#0B1726] dark:hover:bg-[#6EE7B7] cursor-pointer"
                >
                  {isAr ? 'تسليم الاختبار' : 'Submit Exam'}
                </button>
              )}
            </div>
          </div>
        )}
        {phase === 'result' && resultAttempt && resultAttempt.submittedAt && (
          /* Demo results page */
          <div className="mx-auto max-w-[820px] space-y-5">
            <div
              className={`rounded-[16px] border p-6 text-center sm:p-8 ${
                resultAttempt.passed
                  ? 'border-[#1F8A5B]/35 bg-[#E7F5EE] dark:border-[#2ECC71]/35 dark:bg-[#102E24]'
                  : 'border-[#C0392B]/35 bg-[#FCEBE9] dark:border-[#FCA5A5]/30 dark:bg-[#331411]'
              }`}
            >
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-white dark:bg-[#142D4E]">
                {resultAttempt.passed ? (
                  <CheckCircle2 className="h-7 w-7 text-[#1F8A5B] dark:text-[#6EE7B7]" aria-hidden="true" />
                ) : (
                  <X className="h-7 w-7 text-[#C0392B] dark:text-[#FCA5A5]" aria-hidden="true" />
                )}
              </div>
              <div
                className={`text-[1.3rem] font-extrabold ${
                  resultAttempt.passed ? 'text-[#1F8A5B] dark:text-[#6EE7B7]' : 'text-[#C0392B] dark:text-[#FCA5A5]'
                }`}
              >
                {resultAttempt.passed
                  ? isAr
                    ? 'مبروك، لقد نجحت!'
                    : 'Congratulations, you passed!'
                  : isAr
                    ? 'لم تحقق درجة النجاح هذه المرة'
                    : 'You did not reach the passing score this time'}
              </div>
              <div className="num mt-3 flex flex-wrap items-center justify-center gap-3 text-[0.9rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                <span className="rounded-[10px] bg-white px-4 py-2 dark:bg-[#0B1726]">
                  {isAr ? 'الدرجة' : 'Score'}: {resultAttempt.earnedMarks}/{resultAttempt.totalMarks}
                </span>
                <span className="rounded-[10px] bg-white px-4 py-2 dark:bg-[#0B1726]">
                  {isAr ? 'النسبة' : 'Percentage'}: {resultAttempt.scorePct}%
                </span>
                <span className="rounded-[10px] bg-white px-4 py-2 dark:bg-[#0B1726]">
                  {isAr ? 'النجاح عند' : 'Pass at'}: {exam.passingPct}%
                </span>
              </div>
            </div>

            {/* Per-question review */}
            <div className="rounded-[16px] border border-[#DCE7ED] bg-white p-6 dark:border-white/12 dark:bg-[#142D4E]">
              <h3 className="mb-4 text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                {exam.showCorrectAnswers
                  ? isAr
                    ? 'مراجعة الإجابات'
                    : 'Answer Review'
                  : isAr
                    ? 'الإجابات الصحيحة غير معروضة لهذا الاختبار'
                    : 'Correct answers are hidden for this exam'}
              </h3>

              {exam.showCorrectAnswers && (
                <div className="space-y-3">
                  {exam.questions.map((question, index) => {
                    const answer = resultAttempt.answers[question.id];
                    const correct = isQuestionCorrect(question, answer);
                    return (
                      <div key={question.id} className="rounded-[12px] border border-[#DCE7ED] p-4 dark:border-white/12">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[0.88rem] font-bold text-[#183247] dark:text-[#F1F5F9]">
                            {index + 1}. {isAr ? question.textAr : question.textEn}
                          </p>
                          <span
                            className={`flex-none rounded-[8px] px-2.5 py-1 text-[0.74rem] font-extrabold ${
                              correct
                                ? 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]'
                                : 'bg-[#FCEBE9] text-[#C0392B] dark:bg-[#331411] dark:text-[#FCA5A5]'
                            }`}
                          >
                            {correct ? (isAr ? 'صحيحة' : 'Correct') : isAr ? 'خاطئة' : 'Incorrect'}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1.5 text-[0.8rem] font-semibold">
                          {question.type === 'multiple_choice' && (
                            <ul className="space-y-1.5">
                              {question.options.map((option) => {
                                const chosen = answer === option.id;
                                const isCorrect = option.id === question.correctOptionId;
                                return (
                                  <li
                                    key={option.id}
                                    className={`rounded-[8px] px-3 py-1.5 ${
                                      isCorrect
                                        ? 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]'
                                        : chosen
                                          ? 'bg-[#FCEBE9] text-[#C0392B] dark:bg-[#331411] dark:text-[#FCA5A5]'
                                          : 'bg-[#EAF3F6] text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]'
                                    }`}
                                  >
                                    {isAr ? option.textAr : option.textEn}
                                    {chosen && (isAr ? ' — إجابتك' : ' — your answer')}
                                    {isCorrect && (isAr ? ' — الصحيحة' : ' — correct')}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                          {question.type === 'true_false' && (
                            <p className="text-[#64748B] dark:text-[#B8C7D9]">
                              {isAr ? 'إجابتك: ' : 'Your answer: '}
                              <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">
                                {typeof answer === 'boolean'
                                  ? answer
                                    ? isAr
                                      ? 'صح'
                                      : 'True'
                                    : isAr
                                      ? 'خطأ'
                                      : 'False'
                                  : '—'}
                              </span>
                              {' · '}
                              {isAr ? 'الصحيحة: ' : 'Correct: '}
                              <span className="font-bold text-[#1F8A5B] dark:text-[#6EE7B7]">
                                {question.correctTrueFalse ? (isAr ? 'صح' : 'True') : isAr ? 'خطأ' : 'False'}
                              </span>
                            </p>
                          )}
                          {question.type === 'short_answer' && (
                            <p className="text-[#64748B] dark:text-[#B8C7D9]">
                              {isAr ? 'إجابتك: ' : 'Your answer: '}
                              <span className="font-bold text-[#183247] dark:text-[#F1F5F9]">
                                {typeof answer === 'string' && answer ? answer : '—'}
                              </span>
                              {' · '}
                              {isAr ? 'المتوقعة: ' : 'Expected: '}
                              <span className="font-bold text-[#1F8A5B] dark:text-[#6EE7B7]">
                                {isAr ? question.expectedAnswerAr : question.expectedAnswerEn}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {attemptsLeft > 0 && (
                <button
                  type="button"
                  onClick={startExam}
                  className="rounded-[10px] bg-[#176B87] px-6 py-2.5 text-[0.9rem] font-bold text-white transition-colors hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                >
                  {isAr ? 'إعادة المحاولة' : 'Retake Exam'}
                </button>
              )}
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-6 py-2.5 text-[0.9rem] font-bold text-[#183247] transition-colors hover:bg-[#DDF3F5] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9] dark:hover:bg-[#1B3553] cursor-pointer"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {isAr ? 'العودة للكورس' : 'Back to Course'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submit confirmation */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0E223D]/65 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) setConfirmOpen(false);
          }}
        >
          <div className="w-full max-w-[420px] rounded-[18px] border border-[#DCE7ED] bg-white p-6 shadow-[0_22px_54px_rgba(20,45,78,0.25)] dark:border-white/12 dark:bg-[#142D4E]">
            <h3 className="text-[1.05rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? 'تأكيد تسليم الاختبار' : 'Confirm Submission'}
            </h3>
            <p className="mt-2 text-[0.88rem] leading-[1.85] text-[#64748B] dark:text-[#B8C7D9]">
              {answeredCount < exam.questions.length
                ? isAr
                  ? `لم يتم الإجابة على ${exam.questions.length - answeredCount} سؤالًا. ستُحسب الأسئلة غير المجابة خاطئة. هل تريد التسليم؟`
                  : `${exam.questions.length - answeredCount} question(s) are unanswered and will count as incorrect. Submit anyway?`
                : isAr
                  ? 'تمت الإجابة على جميع الأسئلة. هل تريد تسليم الاختبار الآن؟'
                  : 'All questions answered. Submit the exam now?'}
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-4 py-2 text-[0.84rem] font-bold text-[#183247] hover:bg-[#DDF3F5] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9] dark:hover:bg-[#1B3553] cursor-pointer"
              >
                {isAr ? 'متابعة الحل' : 'Keep Working'}
              </button>
              <button
                type="button"
                onClick={submitExam}
                className="rounded-[10px] bg-[#1F8A5B] px-5 py-2 text-[0.84rem] font-bold text-white hover:bg-[#14643f] dark:bg-[#2ECC71] dark:text-[#0B1726] dark:hover:bg-[#6EE7B7] cursor-pointer"
              >
                {isAr ? 'تسليم الآن' : 'Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
