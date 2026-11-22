import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Circle,
  Play,
} from 'lucide-react';
import type { DemoCourse } from '../../types/coursePlayer';
import type { Locale } from '../../types/program';
import { formatDemoLessonDuration } from '../../utils/demoLearning';

interface CourseLessonSidebarProps {
  locale: Locale;
  course: DemoCourse;
  activeLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (lessonId: string) => void;
  /** Full-bleed variant used inside the mobile drawer. */
  variant?: 'panel' | 'drawer';
  /** Extra sizing classes for the root (e.g. max-height on desktop). */
  className?: string;
}

/**
 * Scrollable course curriculum sidebar: grouped sections, lesson durations,
 * completion indicators, active-lesson highlight, and collapse/expand controls.
 */
export function CourseLessonSidebar({
  locale,
  course,
  activeLessonId,
  completedLessonIds,
  onSelectLesson,
  variant = 'panel',
  className = '',
}: CourseLessonSidebarProps) {
  const isAr = locale === 'ar';
  const [collapsedSectionIds, setCollapsedSectionIds] = useState<string[]>([]);
  const activeLessonButtonRef = useRef<HTMLButtonElement | null>(null);

  const allCollapsed = collapsedSectionIds.length === course.sections.length;

  const toggleSection = (sectionId: string) => {
    setCollapsedSectionIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const toggleAllSections = () => {
    setCollapsedSectionIds(allCollapsed ? [] : course.sections.map((section) => section.id));
  };

  // Keep the active lesson visible inside the scrollable list.
  useEffect(() => {
    activeLessonButtonRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeLessonId]);

  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-[#DCE7ED] bg-white dark:border-white/12 dark:bg-[#142D4E] ${
        variant === 'panel' ? 'shadow-[var(--shadow-sm)]' : ''
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#DCE7ED] px-4 py-3 dark:border-white/12">
        <div className="flex items-center gap-2 min-w-0">
          <Play
            className="w-4 h-4 flex-none text-[#176B87] dark:text-[#28B5C5]"
            aria-hidden="true"
          />
          <h2 className="truncate text-[0.95rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {isAr ? 'محتوى الكورس' : 'Course Content'}
          </h2>
        </div>
        <button
          type="button"
          onClick={toggleAllSections}
          aria-label={
            isAr
              ? allCollapsed
                ? 'توسيع جميع الأقسام'
                : 'طي جميع الأقسام'
              : allCollapsed
                ? 'Expand all sections'
                : 'Collapse all sections'
          }
          title={
            isAr ? (allCollapsed ? 'توسيع الكل' : 'طي الكل') : allCollapsed ? 'Expand all' : 'Collapse all'
          }
          className="grid h-8 w-8 flex-none place-items-center rounded-[8px] border border-[#DCE7ED] bg-[#EAF3F6] text-[#176B87] transition-colors hover:bg-[#DDF3F5] dark:border-white/12 dark:bg-[#102238] dark:text-[#28B5C5] dark:hover:bg-[#1B3553] cursor-pointer"
        >
          {allCollapsed ? (
            <ChevronsUpDown className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronsDownUp className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Scrollable sections */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-3">
        {course.sections.map((section) => {
          const isCollapsed = collapsedSectionIds.includes(section.id);
          const sectionCompleted = section.lessons.filter((lesson) =>
            completedLessonIds.includes(lesson.id)
          ).length;

          return (
            <section key={section.id} className="mb-2 last:mb-0">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={!isCollapsed}
                className="flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-start transition-colors hover:bg-[#EAF3F6] dark:hover:bg-[#102238] cursor-pointer"
              >
                <ChevronDown
                  className={`w-4 h-4 flex-none text-[#64748B] transition-transform duration-200 dark:text-[#B8C7D9] ${
                    isCollapsed ? 'rotate-90' : ''
                  }`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-[0.86rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                  {isAr ? section.titleAr : section.titleEn}
                </span>
                <span className="num flex-none rounded-[6px] bg-[#EAF3F6] px-1.5 py-0.5 text-[0.72rem] font-bold text-[#176B87] dark:bg-[#102238] dark:text-[#28B5C5]">
                  {sectionCompleted}/{section.lessons.length}
                </span>
              </button>

              {!isCollapsed && (
                <ul className="mt-1 space-y-1">
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = completedLessonIds.includes(lesson.id);

                    return (
                      <li key={lesson.id}>
                        <button
                          ref={isActive ? activeLessonButtonRef : undefined}
                          type="button"
                          onClick={() => onSelectLesson(lesson.id)}
                          aria-current={isActive ? 'true' : undefined}
                          className={`flex w-full items-start gap-2.5 rounded-[10px] border px-2.5 py-2 text-start transition-colors cursor-pointer ${
                            isActive
                              ? 'border-[#28B5C5]/60 bg-[#DDF3F5] dark:border-[#28B5C5]/50 dark:bg-[#1B3553]'
                              : 'border-transparent hover:bg-[#EAF3F6] dark:hover:bg-[#102238]'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2
                              className="mt-0.5 h-[18px] w-[18px] flex-none text-[#1F8A5B] dark:text-[#6EE7B7]"
                              aria-hidden="true"
                            />
                          ) : (
                            <Circle
                              className={`mt-0.5 h-[18px] w-[18px] flex-none ${
                                isActive
                                  ? 'text-[#176B87] dark:text-[#28B5C5]'
                                  : 'text-[#B7C6D3] dark:text-[#55697F]'
                              }`}
                              aria-hidden="true"
                            />
                          )}
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-[0.85rem] font-semibold ${
                                isActive
                                  ? 'text-[#142D4E] dark:text-[#F1F5F9]'
                                  : 'text-[#183247] dark:text-[#B8C7D9]'
                              }`}
                            >
                              {isAr ? lesson.titleAr : lesson.titleEn}
                            </span>
                            <span
                              className={`num mt-0.5 block text-[0.72rem] font-semibold ${
                                isActive
                                  ? 'text-[#176B87] dark:text-[#28B5C5]'
                                  : 'text-[#64748B] dark:text-[#7E93A9]'
                              }`}
                            >
                              {isAr ? 'فيديو · ' : 'Video · '}
                              {formatDemoLessonDuration(lesson.durationMinutes, locale)}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
