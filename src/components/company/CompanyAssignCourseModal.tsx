import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AdminDataState } from '../../types/admin';
import type { Locale } from '../../types/program';
import {
  getCompanyStudentEnrollment,
  getCompanyStudents,
  type CompanyPurchaseErrorCode,
  type CompanyPurchaseResult,
} from '../../utils/companyData';
import {
  AdminAvatar,
  AdminBadge,
  AdminModal,
  adminBtnClass,
  adminFieldClass,
} from '../admin/AdminUI';

type ConfirmPurchaseFn = (studentId: string, courseId: string) => CompanyPurchaseResult;

interface CompanyAssignCourseModalProps {
  locale: Locale;
  state: AdminDataState;
  companyId: string;
  /** Pre-selected student (e.g. when opened from a student profile page). */
  initialStudentId?: string | null;
  onClose: () => void;
  onConfirm: ConfirmPurchaseFn;
}

const PURCHASE_ERROR_MESSAGES: Record<CompanyPurchaseErrorCode, { ar: string; en: string }> = {
  'already-enrolled': {
    ar: 'الطالب لديه وصول بالفعل إلى هذا الكورس — لا يمكن تكرار الاشتراك.',
    en: 'This student already has access to this course — duplicate enrollment is not allowed.',
  },
  'student-not-yours': {
    ar: 'لا يمكن شراء كورس لطالب لا ينتمي إلى شركتك.',
    en: 'You can only assign courses to students belonging to your company.',
  },
  'student-inactive': {
    ar: 'حساب الطالب موقوف — نشّط الحساب أولًا ثم أعد المحاولة.',
    en: 'The student account is deactivated — activate it first and try again.',
  },
  'student-not-found': {
    ar: 'الطالب غير موجود في البيانات التجريبية.',
    en: 'The student was not found in the demo data.',
  },
  'company-inactive': {
    ar: 'حساب الشركة موقوف — لا يمكن إتمام الشراء.',
    en: 'The company account is deactivated — purchases are unavailable.',
  },
  'company-missing': {
    ar: 'حساب الشركة غير متاح.',
    en: 'The company account is unavailable.',
  },
  'course-not-found': {
    ar: 'الكورس غير موجود في البيانات التجريبية.',
    en: 'The course was not found in the demo data.',
  },
  'course-unpublished': {
    ar: 'هذا الكورس غير منشور حاليًا — لا يمكن شراؤه.',
    en: 'This course is not published yet — it cannot be purchased.',
  },
};

const STEPS = [
  { id: 1, labelAr: 'اختيار الطالب', labelEn: 'Select Student' },
  { id: 2, labelAr: 'اختيار الكورس', labelEn: 'Select Course' },
  { id: 3, labelAr: 'التأكيد', labelEn: 'Confirm' },
] as const;

/**
 * Three-step demo purchase flow for company accounts:
 * 1) pick one of the company's own students (searchable),
 * 2) pick a published course (searchable, price + already-enrolled state),
 * 3) review the confirmation summary and confirm the demo purchase.
 */
export function CompanyAssignCourseModal({
  locale,
  state,
  companyId,
  initialStudentId,
  onClose,
  onConfirm,
}: CompanyAssignCourseModalProps) {
  const isAr = locale === 'ar';
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  const students = useMemo(() => getCompanyStudents(state, companyId), [state, companyId]);
  const publishedCourses = useMemo(
    () => state.courses.filter((course) => course.status === 'published'),
    [state]
  );

  const [step, setStep] = useState<1 | 2 | 3>(initialStudentId ? 2 : 1);
  const [studentId, setStudentId] = useState<string>(initialStudentId ?? '');
  const [courseId, setCourseId] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [courseQuery, setCourseQuery] = useState('');
  const [error, setError] = useState('');

  const selectedStudent = students.find((student) => student.id === studentId) ?? null;
  const selectedCourse = publishedCourses.find((course) => course.id === courseId) ?? null;

  const filteredStudents = useMemo(() => {
    const query = studentQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    );
  }, [students, studentQuery]);

  const filteredCourses = useMemo(() => {
    const query = courseQuery.trim().toLowerCase();
    if (!query) return publishedCourses;
    return publishedCourses.filter(
      (course) =>
        course.titleAr.toLowerCase().includes(query) ||
        course.titleEn.toLowerCase().includes(query)
    );
  }, [publishedCourses, courseQuery]);

  const goBack = () => {
    setError('');
    setStep((prev) => (prev === 3 ? 2 : 1));
  };

  const handleConfirm = () => {
    if (!selectedStudent || !selectedCourse) return;
    setError('');
    const result = onConfirm(selectedStudent.id, selectedCourse.id);
    if (!result.ok) {
      setError(PURCHASE_ERROR_MESSAGES[result.reason][isAr ? 'ar' : 'en']);
      return;
    }
    onClose();
  };

  return (
    <AdminModal
      title={isAr ? 'إضافة كورس لطالب' : 'Assign Course to Student'}
      onClose={onClose}
      maxWidth="600px"
    >
      {/* Step indicator */}
      <ol className="mb-4 flex items-center gap-2">
        {STEPS.map((item, index) => {
          const isActive = step === item.id;
          const isDone = step > item.id;
          return (
            <li key={item.id} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={`grid h-7 w-7 flex-none place-items-center rounded-full text-[0.74rem] font-extrabold ${
                  isActive
                    ? 'bg-[#176B87] text-white dark:bg-[#28B5C5] dark:text-[#0B1726]'
                    : isDone
                      ? 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]'
                      : 'bg-[#EAF3F6] text-[#94A3B8] dark:bg-[#102238] dark:text-[#7E93A9]'
                }`}
              >
                {isDone ? <BadgeCheck className="h-4 w-4" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={`truncate text-[0.76rem] font-bold ${
                  isActive
                    ? 'text-[#142D4E] dark:text-[#F1F5F9]'
                    : 'text-[#94A3B8] dark:text-[#7E93A9]'
                }`}
              >
                {isAr ? item.labelAr : item.labelEn}
              </span>
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="h-px flex-none flex-1 bg-[#DCE7ED] dark:bg-white/12"
                />
              )}
            </li>
          );
        })}
      </ol>

      {error && (
        <p
          role="alert"
          className="mb-3 rounded-[10px] border border-[#C0392B]/35 bg-[#FCEBE9] px-3 py-2 text-[0.8rem] font-bold text-[#C0392B] dark:border-[#FCA5A5]/30 dark:bg-[#331411] dark:text-[#FCA5A5]"
        >
          {error}
        </p>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={studentQuery}
              onChange={(event) => setStudentQuery(event.target.value)}
              placeholder={isAr ? 'ابحث باسم الطالب أو البريد…' : 'Search by student name or email…'}
              className={`${adminFieldClass} ps-9`}
            />
          </div>
          {filteredStudents.length === 0 ? (
            <p className="rounded-[10px] border border-dashed border-[#DCE7ED] px-4 py-6 text-center text-[0.82rem] text-[#94A3B8] dark:border-white/15">
              {isAr
                ? 'لا يوجد طلاب مطابقون — أضف طلابك من قسم «طلاب الشركة».'
                : 'No matching students — add them from the Company Students section.'}
            </p>
          ) : (
            <ul className="max-h-[300px] space-y-2 overflow-y-auto pe-1">
              {filteredStudents.map((student) => {
                const disabled = student.status !== 'active';
                return (
                  <li key={student.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        setStudentId(student.id);
                        setError('');
                        setStep(2);
                      }}
                      className={`flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-start transition-colors ${
                        disabled
                          ? 'cursor-not-allowed border-[#DCE7ED] bg-[#EAF3F6]/60 opacity-60 dark:border-white/12 dark:bg-[#102238]/60'
                          : 'cursor-pointer border-[#DCE7ED] bg-[#EAF3F6] hover:border-[#28B5C5] dark:border-white/12 dark:bg-[#102238] dark:hover:border-[#28B5C5]'
                      }`}
                    >
                      <AdminAvatar name={student.name} seed={student.id} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                          {student.name}
                        </span>
                        <span
                          className="block truncate text-[0.74rem] text-[#64748B] dark:text-[#B8C7D9]"
                          dir="ltr"
                        >
                          {student.email}
                        </span>
                      </span>
                      <AdminBadge tone={disabled ? 'danger' : 'success'}>
                        {disabled ? (isAr ? 'موقوف' : 'Inactive') : isAr ? 'نشط' : 'Active'}
                      </AdminBadge>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate text-[0.8rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
              {isAr ? 'الطالب:' : 'Student:'}{' '}
              <span className="text-[#142D4E] dark:text-[#F1F5F9]">
                {selectedStudent?.name ?? '—'}
              </span>
            </p>
            <button type="button" onClick={goBack} className={adminBtnClass('subtle')}>
              <BackArrow className="h-4 w-4" aria-hidden="true" />
              {isAr ? 'تغيير الطالب' : 'Change student'}
            </button>
          </div>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={courseQuery}
              onChange={(event) => setCourseQuery(event.target.value)}
              placeholder={isAr ? 'ابحث بعنوان الكورس…' : 'Search by course title…'}
              className={`${adminFieldClass} ps-9`}
            />
          </div>
          {filteredCourses.length === 0 ? (
            <p className="rounded-[10px] border border-dashed border-[#DCE7ED] px-4 py-6 text-center text-[0.82rem] text-[#94A3B8] dark:border-white/15">
              {isAr ? 'لا توجد كورسات منشورة مطابقة.' : 'No matching published courses.'}
            </p>
          ) : (
            <ul className="max-h-[320px] space-y-2 overflow-y-auto pe-1">
              {filteredCourses.map((course) => {
                const alreadyEnrolled = selectedStudent
                  ? Boolean(
                      getCompanyStudentEnrollment(
                        state,
                        companyId,
                        selectedStudent.id,
                        course.id
                      )
                    )
                  : false;
                return (
                  <li key={course.id}>
                    <button
                      type="button"
                      disabled={alreadyEnrolled}
                      onClick={() => {
                        setCourseId(course.id);
                        setError('');
                        setStep(3);
                      }}
                      className={`flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-start transition-colors ${
                        alreadyEnrolled
                          ? 'cursor-not-allowed border-[#DCE7ED] bg-[#EAF3F6]/60 opacity-70 dark:border-white/12 dark:bg-[#102238]/60'
                          : 'cursor-pointer border-[#DCE7ED] bg-[#EAF3F6] hover:border-[#28B5C5] dark:border-white/12 dark:bg-[#102238] dark:hover:border-[#28B5C5]'
                      }`}
                    >
                      <img
                        src={course.image}
                        alt=""
                        className="h-[56px] w-[84px] flex-none rounded-[8px] object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                          {isAr ? course.titleAr : course.titleEn}
                        </span>
                        <span className="num block text-[0.74rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                          {course.price.toLocaleString('en-US')} {isAr ? 'ر.س' : 'SAR'}
                        </span>
                      </span>
                      {alreadyEnrolled && (
                        <AdminBadge tone="warn">
                          {isAr ? 'مسجَّل بالفعل' : 'Already enrolled'}
                        </AdminBadge>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-[0.74rem] text-[#94A3B8] dark:text-[#7E93A9]">
            {isAr
              ? 'الكورسات التي يشترك بها الطالب بالفعل معطّلة لمنع تكرار الاشتراك.'
              : 'Courses the student is already enrolled in are disabled to prevent duplicates.'}
          </p>
        </div>
      )}

      {step === 3 && selectedStudent && selectedCourse && (
        <div className="space-y-4">
          <div className="space-y-3 rounded-[14px] border border-[#DCE7ED] bg-[#EAF3F6]/60 p-4 dark:border-white/12 dark:bg-[#102238]/60">
            <div className="flex items-center gap-3">
              <AdminAvatar name={selectedStudent.name} seed={selectedStudent.id} size="sm" />
              <div className="min-w-0">
                <p className="text-[0.72rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                  {isAr ? 'الطالب' : 'Student'}
                </p>
                <p className="truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                  {selectedStudent.name}
                </p>
                <p
                  className="truncate text-[0.72rem] text-[#64748B] dark:text-[#B8C7D9]"
                  dir="ltr"
                >
                  {selectedStudent.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-[#DCE7ED] pt-3 dark:border-white/12">
              <img
                src={selectedCourse.image}
                alt=""
                className="h-[56px] w-[84px] flex-none rounded-[8px] object-cover"
              />
              <div className="min-w-0">
                <p className="text-[0.72rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
                  {isAr ? 'الكورس' : 'Course'}
                </p>
                <p className="truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                  {isAr ? selectedCourse.titleAr : selectedCourse.titleEn}
                </p>
              </div>
            </div>
            <dl className="grid gap-2 border-t border-[#DCE7ED] pt-3 text-[0.8rem] dark:border-white/12 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2 dark:bg-[#0E223D]">
                <dt className="font-bold text-[#64748B] dark:text-[#B8C7D9]">
                  {isAr ? 'السعر' : 'Price'}
                </dt>
                <dd className="num font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                  {selectedCourse.price.toLocaleString('en-US')} {isAr ? 'ر.س' : 'SAR'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2 dark:bg-[#0E223D]">
                <dt className="font-bold text-[#64748B] dark:text-[#B8C7D9]">
                  {isAr ? 'حالة الدفع' : 'Payment'}
                </dt>
                <dd>
                  <AdminBadge tone="cyan">{isAr ? 'مدفوع (تجريبي)' : 'Paid (demo)'}</AdminBadge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2 dark:bg-[#0E223D]">
                <dt className="font-bold text-[#64748B] dark:text-[#B8C7D9]">
                  {isAr ? 'حالة الاشتراك' : 'Enrollment'}
                </dt>
                <dd>
                  <AdminBadge tone="success">{isAr ? 'نشط' : 'Active'}</AdminBadge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-3 py-2 dark:bg-[#0E223D]">
                <dt className="font-bold text-[#64748B] dark:text-[#B8C7D9]">
                  {isAr ? 'التقدم الابتدائي' : 'Initial progress'}
                </dt>
                <dd className="num font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">0%</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={goBack} className={adminBtnClass('ghost')}>
              <BackArrow className="h-4 w-4" aria-hidden="true" />
              {isAr ? 'رجوع' : 'Back'}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`${adminBtnClass('primary', 'md')} flex-1 sm:flex-none`}
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              {isAr ? 'تأكيد شراء الكورس' : 'Confirm Course Purchase'}
            </button>
          </div>
          <p className="text-[0.74rem] leading-relaxed text-[#94A3B8] dark:text-[#7E93A9]">
            {isAr
              ? 'شراء تجريبي — لن يتم تنفيذ أي دفع حقيقي، ويُضاف الكورس فورًا إلى حساب الطالب.'
              : 'Demo purchase — no real payment is processed; the course is added to the student instantly.'}
          </p>
        </div>
      )}
    </AdminModal>
  );
}