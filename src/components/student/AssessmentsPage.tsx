import { CheckCircle2, ClipboardCheck, Clock, Info } from 'lucide-react';
import { COURSE_ASSESSMENTS } from '../../data/learningPlatform';
import type { Locale, Program } from '../../types/program';
import type { StudentPlatformState } from '../../types/student';
import { PageHeroBanner } from '../common/PageHeroBanner';

interface AssessmentsPageProps {
  locale: Locale;
  state: StudentPlatformState;
  programs: Program[];
  onGoHome: () => void;
  onToggleSelfCheck: (assessmentId: string, titleAr: string, titleEn: string) => void;
  onOpenProgram: (program: Program, tab?: 'details' | 'register') => void;
}

export function AssessmentsPage({
  locale,
  state,
  programs,
  onToggleSelfCheck,
  onOpenProgram,
}: AssessmentsPageProps) {
  return (
    <div>
      <PageHeroBanner
        locale={locale}
        eyebrowAr="التحقق من الجاهزية الأكاديمية"
        eyebrowEn="Academic Readiness & Verification"
        titleAr="الاختبارات والتقييمات"
        titleEn="Assessments & Readiness"
        descriptionAr="استعرض قوائم التحقق والمراجعة الذاتية المرتبطة بمحاور كل دبلوم. تُعقد الاختبارات الرسمية وتُعتمد درجاتها حصريًا عبر بوابة التعلّم الرسمية."
        descriptionEn="Review syllabus-aligned readiness checklists for each diploma. Official graded exams and transcripts are hosted exclusively on the connected LMS backend."
      />

      <section className="py-[32px] pb-[72px]">
        <div className="wrap space-y-6">
          {/* Honest Backend Integration Notice */}
          <div className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#28B5C5]/35 rounded-[16px] p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#176B87] dark:text-[#28B5C5] flex-none mt-0.5" aria-hidden="true" />
            <div className="text-[0.88rem] text-[#183247] dark:text-[#CBD8E6] leading-relaxed">
              <strong className="text-[#142D4E] dark:text-[#F1F5F9]">
                {locale === 'ar'
                  ? 'تكامل نظام الاختبارات الرسمية (LMS Backend): '
                  : 'Official Exam Grading Notice: '}
              </strong>
              {locale === 'ar'
                ? 'لا تُعرض درجات اختبارية افتراضية أو نتائج مُختلقة هنا؛ بمجرد الربط مع خادم الاختبارات الرسمي تظهر الجلسات المجدولة والدرجات المعتمدة تلقائيًا، ويمكنك حاليًا تحديد جاهزيتك الذاتية لكل محور.'
                : 'No fabricated grades or synthetic exam scores are generated here. Scheduled official exams and verified grades appear once connected to the official LMS API; below you can track your self-readiness per course.'}
            </div>
          </div>

          <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-[20px]">
            {COURSE_ASSESSMENTS.map((assessment) => {
              const course = programs.find((p) => p.id === assessment.programId);
              if (!course) return null;
              const isEnrolled = Boolean(state.enrollments[course.id]);
              const isSelfChecked = state.selfCheckDoneIds.includes(assessment.id);
              const topics =
                locale === 'ar' ? assessment.sampleTopicsAr : assessment.sampleTopicsEn;

              return (
                <article
                  key={assessment.id}
                  className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[20px] flex flex-col gap-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[0.76rem] font-bold text-[#176B87] dark:text-[#28B5C5] mb-1">
                        {locale === 'ar' ? course.titleAr : course.titleEn}
                      </div>
                      <h2 className="text-[1.06rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                        {locale === 'ar' ? assessment.titleAr : assessment.titleEn}
                      </h2>
                    </div>

                    <span
                      className={`text-[0.74rem] font-bold px-2.5 py-1 rounded-[8px] flex-none ${
                        isSelfChecked
                          ? 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]'
                          : isEnrolled
                            ? 'bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]'
                            : 'bg-[#EAF3F6] text-[#64748B] dark:bg-[#102238] dark:text-[#94A3B8]'
                      }`}
                    >
                      {isSelfChecked
                        ? locale === 'ar'
                          ? 'جاهز للاختبار'
                          : 'Readiness Checked'
                        : isEnrolled
                          ? locale === 'ar'
                            ? 'متاح للمراجعة'
                            : 'Available'
                          : locale === 'ar'
                            ? 'يتطلب التسجيل بالدورة'
                            : 'Requires Enrollment'}
                    </span>
                  </div>

                  <p className="text-[0.86rem] text-[#64748B] dark:text-[#B8C7D9] leading-relaxed">
                    {locale === 'ar' ? assessment.descriptionAr : assessment.descriptionEn}
                  </p>

                  <div className="flex items-center gap-4 text-[0.78rem] font-bold text-[#183247] dark:text-[#CBD8E6]">
                    <span className="num inline-flex items-center gap-1.5">
                      <ClipboardCheck className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                      {locale === 'ar'
                        ? `${assessment.questionCount} محاور مراجعة`
                        : `${assessment.questionCount} Review Topics`}
                    </span>
                    <span className="num inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                      {locale === 'ar'
                        ? `الوقت المقدر: ${assessment.durationMinutes} دقيقة`
                        : `Est. ${assessment.durationMinutes} min`}
                    </span>
                  </div>

                  <ul className="space-y-1.5 bg-[#F8FBFD] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/10 rounded-[12px] p-3">
                    {topics.map((topic) => (
                      <li
                        key={topic}
                        className="text-[0.81rem] text-[#183247] dark:text-[#E2E8F0] flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#28B5C5] flex-none" aria-hidden="true" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-1 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onOpenProgram(course, isEnrolled ? 'details' : 'register')}
                      className="text-[0.84rem] font-bold text-[#176B87] dark:text-[#28B5C5] hover:underline cursor-pointer"
                    >
                      {isEnrolled
                        ? locale === 'ar'
                          ? 'مراجعة محاور الدورة'
                          : 'Review Course Modules'
                        : locale === 'ar'
                          ? 'التسجيل في الدورة'
                          : 'Enroll in Course'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleSelfCheck(
                          assessment.id,
                          assessment.titleAr,
                          assessment.titleEn
                        )
                      }
                      className={`rounded-[10px] px-4 py-2 text-[0.84rem] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                        isSelfChecked
                          ? 'bg-[#E7F5EE] text-[#1F8A5B] border border-[#1F8A5B]/30 dark:bg-[#102E24] dark:text-[#6EE7B7]'
                          : 'bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {isSelfChecked
                          ? locale === 'ar'
                            ? 'تم التحقق من الجاهزية'
                            : 'Readiness Confirmed'
                          : locale === 'ar'
                            ? 'تأكيد الجاهزية الذاتية'
                            : 'Confirm Readiness'}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
