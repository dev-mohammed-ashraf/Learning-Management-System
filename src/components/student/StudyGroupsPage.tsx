import { CheckCircle2, Info, LogOut, UserPlus, Users } from 'lucide-react';
import { STUDY_GROUPS } from '../../data/learningPlatform';
import type { Locale, Program } from '../../types/program';
import type { StudentPlatformState } from '../../types/student';
import { PageHeroBanner } from '../common/PageHeroBanner';

interface StudyGroupsPageProps {
  locale: Locale;
  state: StudentPlatformState;
  programs: Program[];
  onGoHome: () => void;
  onToggleGroup: (groupId: string, titleAr: string, titleEn: string) => void;
}

export function StudyGroupsPage({
  locale,
  state,
  programs,
  onGoHome,
  onToggleGroup,
}: StudyGroupsPageProps) {
  const joinedGroups = STUDY_GROUPS.filter((g) => state.joinedGroupIds.includes(g.id));
  const availableGroups = STUDY_GROUPS.filter((g) => !state.joinedGroupIds.includes(g.id));

  return (
    <div>
      <PageHeroBanner
        locale={locale}
        eyebrowAr="التعلّم التعاوني بين الطلبة"
        eyebrowEn="Peer Learning Circles"
        titleAr="مجموعات الدراسة"
        titleEn="Study Groups"
        descriptionAr="انضم إلى حلقات الدراسة التخصصية المرتبطة بمسارك الأكاديمي لتنظيم المذاكرة الجماعية وتنسيق المراجعات."
        descriptionEn="Join subject-focused study circles linked to your diploma track to organize group revision."
        onGoHome={onGoHome}
      />

      <section className="py-[32px] pb-[72px]">
        <div className="wrap space-y-8">
          <div className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#28B5C5]/35 rounded-[16px] p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#176B87] dark:text-[#28B5C5] flex-none mt-0.5" aria-hidden="true" />
            <p className="text-[0.88rem] text-[#183247] dark:text-[#CBD8E6] leading-relaxed">
              <strong className="text-[#142D4E] dark:text-[#F1F5F9]">
                {locale === 'ar'
                  ? 'تكامل المحادثة المباشرة (Messaging Service): '
                  : 'Live Peer Messaging Integration: '}
              </strong>
              {locale === 'ar'
                ? 'تُحفظ عضويتك في المجموعات محليًا دون عرض محادثات وهمية أو أعداد طلبة مصطنعة؛ ستتفعّل ساحات النقاش المباشرة عند ربط خادم المراسلة الفورية.'
                : 'Group memberships are persisted locally with zero synthetic chat logs or fake member counts. Live group chat channels will activate when the real-time messaging backend is connected.'}
            </p>
          </div>

          {/* Joined Groups */}
          <div className="space-y-4">
            <h2 className="text-[1.18rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {locale === 'ar' ? 'مجموعاتي الدراسية' : 'My Study Groups'}
            </h2>

            {joinedGroups.length === 0 ? (
              <div className="bg-[#EAF3F6] dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-6 text-center space-y-2">
                <Users className="w-8 h-8 mx-auto text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                <p className="font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                  {locale === 'ar'
                    ? 'لم تنضم إلى أي مجموعة دراسية بعد'
                    : 'You have not joined any study group yet'}
                </p>
                <p className="text-[0.86rem] text-[#64748B] dark:text-[#B8C7D9]">
                  {locale === 'ar'
                    ? 'اختر من الحلقات التخصصية المتاحة أدناه للانضمام إليها.'
                    : 'Choose from the available subject circles below to join.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-[18px]">
                {joinedGroups.map((group) => {
                  const linkedCourse = programs.find((p) => p.id === group.programId);
                  return (
                    <article
                      key={group.id}
                      className="bg-white dark:bg-[#142D4E] border border-[#28B5C5]/45 rounded-[16px] p-[20px] flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="inline-flex items-center gap-1.5 text-[0.76rem] font-bold text-[#1F8A5B] dark:text-[#6EE7B7] mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{locale === 'ar' ? 'عضو مسجّل' : 'Joined Member'}</span>
                          </div>
                          <h3 className="text-[1.04rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                            {locale === 'ar' ? group.titleAr : group.titleEn}
                          </h3>
                        </div>
                      </div>

                      <p className="text-[0.86rem] text-[#64748B] dark:text-[#B8C7D9] leading-relaxed">
                        {locale === 'ar' ? group.descriptionAr : group.descriptionEn}
                      </p>

                      <div className="text-[0.78rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                        {locale === 'ar' ? group.focusAr : group.focusEn}
                      </div>

                      {linkedCourse && (
                        <div className="text-[0.78rem] text-[#64748B] dark:text-[#B8C7D9]">
                          {locale === 'ar' ? 'الدورة المرتبطة: ' : 'Linked Course: '}
                          <span className="font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                            {locale === 'ar' ? linkedCourse.titleAr : linkedCourse.titleEn}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            onToggleGroup(group.id, group.titleAr, group.titleEn)
                          }
                          className="rounded-[10px] px-4 py-2 text-[0.82rem] font-bold border border-[#DCE7ED] text-[#64748B] hover:border-[#C0392B]/40 hover:text-[#C0392B] dark:border-white/15 dark:text-[#B8C7D9] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{locale === 'ar' ? 'مغادرة المجموعة' : 'Leave Group'}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Available Groups */}
          <div className="space-y-4">
            <h2 className="text-[1.18rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {locale === 'ar' ? 'المجموعات المتاحة للانضمام' : 'Available Study Groups'}
            </h2>

            {availableGroups.length === 0 ? (
              <p className="text-[0.9rem] text-[#64748B] dark:text-[#B8C7D9]">
                {locale === 'ar'
                  ? 'انضممت إلى جميع الحلقات الدراسية المتاحة حاليًا.'
                  : 'You have joined all currently available study groups.'}
              </p>
            ) : (
              <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-[18px]">
                {availableGroups.map((group) => {
                  const linkedCourse = programs.find((p) => p.id === group.programId);
                  return (
                    <article
                      key={group.id}
                      className="bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[20px] flex flex-col gap-3"
                    >
                      <h3 className="text-[1.04rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                        {locale === 'ar' ? group.titleAr : group.titleEn}
                      </h3>

                      <p className="text-[0.86rem] text-[#64748B] dark:text-[#B8C7D9] leading-relaxed">
                        {locale === 'ar' ? group.descriptionAr : group.descriptionEn}
                      </p>

                      <div className="text-[0.78rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                        {locale === 'ar' ? group.focusAr : group.focusEn}
                      </div>

                      {linkedCourse && (
                        <div className="text-[0.78rem] text-[#64748B] dark:text-[#B8C7D9]">
                          {locale === 'ar' ? 'الدورة المرتبطة: ' : 'Linked Course: '}
                          <span className="font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                            {locale === 'ar' ? linkedCourse.titleAr : linkedCourse.titleEn}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            onToggleGroup(group.id, group.titleAr, group.titleEn)
                          }
                          className="rounded-[10px] px-4 py-2 text-[0.84rem] font-bold bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4" aria-hidden="true" />
                          <span>{locale === 'ar' ? 'انضمام للمجموعة' : 'Join Group'}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
