import { useState } from 'react';
import { CheckCircle2, FileText, Folder, Info } from 'lucide-react';
import { APPLIED_PROJECTS } from '../../data/learningPlatform';
import type { Locale, Program } from '../../types/program';
import type { ProjectStatus, StudentPlatformState } from '../../types/student';
import { PageHeroBanner } from '../common/PageHeroBanner';

interface ProjectsPageProps {
  locale: Locale;
  state: StudentPlatformState;
  programs: Program[];
  onGoHome: () => void;
  onUpdateProject: (
    projectId: string,
    titleAr: string,
    titleEn: string,
    status: ProjectStatus,
    submissionNote: string
  ) => void;
}

export function ProjectsPage({
  locale,
  state,
  programs,
  onGoHome,
  onUpdateProject,
}: ProjectsPageProps) {
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

  const statusMeta: Record<
    ProjectStatus,
    { labelAr: string; labelEn: string; toneClass: string }
  > = {
    not_started: {
      labelAr: 'لم يبدأ',
      labelEn: 'Not Started',
      toneClass: 'bg-[#EAF3F6] text-[#64748B] dark:bg-[#102238] dark:text-[#94A3B8]',
    },
    in_progress: {
      labelAr: 'قيد التنفيذ',
      labelEn: 'In Progress',
      toneClass: 'bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]',
    },
    submitted: {
      labelAr: 'تم التسليم محليًا',
      labelEn: 'Draft Submitted',
      toneClass: 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]',
    },
    reviewed: {
      labelAr: 'بانتظار المراجعة الأكاديمية',
      labelEn: 'Pending Official Review',
      toneClass: 'bg-[#FEF3C7] text-[#92400E] dark:bg-[#3B2F13] dark:text-[#FDE68A]',
    },
  };

  return (
    <div>
      <PageHeroBanner
        locale={locale}
        eyebrowAr="التطبيق العملي للمهارات"
        eyebrowEn="Applied Practice Deliverables"
        titleAr="المشاريع التطبيقية"
        titleEn="Applied Projects"
        descriptionAr="اعمل على المشاريع المرتبطة بدوراتك لتطبيق المهارات عمليًا، وسجّل حالة التقدم وملاحظات التسليم محليًا في مساحة عملك."
        descriptionEn="Work through applied projects tied to your diploma courses, organize deliverables, and track status locally."
        onGoHome={onGoHome}
      />

      <section className="py-[32px] pb-[72px]">
        <div className="wrap space-y-6">
          <div className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#28B5C5]/35 rounded-[16px] p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#176B87] dark:text-[#28B5C5] flex-none mt-0.5" aria-hidden="true" />
            <p className="text-[0.88rem] text-[#183247] dark:text-[#CBD8E6] leading-relaxed">
              <strong className="text-[#142D4E] dark:text-[#F1F5F9]">
                {locale === 'ar'
                  ? 'حالة المراجعة والتقييم: '
                  : 'Project Review Integration: '}
              </strong>
              {locale === 'ar'
                ? 'يمكنك تجهيز ملاحظات التسليم وتحديث مراحل العمل محليًا. تُعتمد المراجعات والتقييمات الرسمية من أعضاء هيئة التدريس عند ربط بوابة تسليم الجامعة.'
                : 'You can save deliverable notes and update your project workflow locally. Official instructor feedback and grading require connection to the university submission server.'}
            </p>
          </div>

          <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-[22px]">
            {APPLIED_PROJECTS.map((project) => {
              const course = programs.find((p) => p.id === project.programId);
              const record = state.projectProgress[project.id];
              const currentStatus: ProjectStatus = record?.status ?? 'not_started';
              const meta = statusMeta[currentStatus];
              const deliverables =
                locale === 'ar' ? project.deliverablesAr : project.deliverablesEn;
              const noteValue = draftNotes[project.id] ?? record?.submissionNote ?? '';

              return (
                <article
                  key={project.id}
                  className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[22px] flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {course && (
                        <div className="text-[0.76rem] font-bold text-[#176B87] dark:text-[#28B5C5] mb-1">
                          {locale === 'ar' ? course.titleAr : course.titleEn}
                        </div>
                      )}
                      <h2 className="text-[1.08rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9] flex items-center gap-2">
                        <Folder className="w-5 h-5 text-[#176B87] dark:text-[#28B5C5] flex-none" aria-hidden="true" />
                        <span>{locale === 'ar' ? project.titleAr : project.titleEn}</span>
                      </h2>
                    </div>

                    <span
                      className={`text-[0.74rem] font-bold px-2.5 py-1 rounded-[8px] flex-none ${meta.toneClass}`}
                    >
                      {locale === 'ar' ? meta.labelAr : meta.labelEn}
                    </span>
                  </div>

                  <p className="text-[0.87rem] text-[#64748B] dark:text-[#B8C7D9] leading-relaxed">
                    {locale === 'ar' ? project.summaryAr : project.summaryEn}
                  </p>

                  <div className="bg-[#F8FBFD] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/10 rounded-[12px] p-3.5 space-y-1.5">
                    <div className="text-[0.78rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                      {locale === 'ar' ? 'المخرجات المطلوبة:' : 'Expected Deliverables:'}
                    </div>
                    {deliverables.map((item) => (
                      <div
                        key={item}
                        className="text-[0.81rem] text-[#183247] dark:text-[#E2E8F0] flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#28B5C5] flex-none" aria-hidden="true" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-auto pt-1">
                    <label className="flex items-center gap-1.5 text-[0.78rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                      <FileText className="w-3.5 h-3.5 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                      <span>
                        {locale === 'ar'
                          ? 'ملاحظات أو رابط مسودة المشروع'
                          : 'Deliverable Notes or Draft Link'}
                      </span>
                    </label>
                    <textarea
                      rows={2}
                      value={noteValue}
                      onChange={(e) =>
                        setDraftNotes((prev) => ({ ...prev, [project.id]: e.target.value }))
                      }
                      placeholder={
                        locale === 'ar'
                          ? 'دوّن ملخص ما أنجزته أو رابط الملف قبل تغيير الحالة...'
                          : 'Note what you completed or paste a draft link...'
                      }
                      className="w-full p-2.5 rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#28B5C5] text-[0.84rem] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateProject(
                            project.id,
                            project.titleAr,
                            project.titleEn,
                            'in_progress',
                            noteValue
                          )
                        }
                        className={`rounded-[9px] px-3 py-1.5 text-[0.8rem] font-bold border cursor-pointer transition-colors ${
                          currentStatus === 'in_progress'
                            ? 'bg-[#DDF3F5] border-[#28B5C5] text-[#142D4E] dark:bg-[#1B3553] dark:text-[#28B5C5]'
                            : 'bg-white border-[#DCE7ED] text-[#142D4E] hover:border-[#28B5C5] dark:bg-[#102238] dark:border-white/15 dark:text-[#F1F5F9]'
                        }`}
                      >
                        {locale === 'ar' ? 'قيد التنفيذ' : 'Mark In Progress'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateProject(
                            project.id,
                            project.titleAr,
                            project.titleEn,
                            'submitted',
                            noteValue
                          )
                        }
                        className="rounded-[9px] px-3.5 py-1.5 text-[0.8rem] font-bold bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                      >
                        {locale === 'ar' ? 'حفظ التسليم محليًا' : 'Save Submission Draft'}
                      </button>
                    </div>
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
