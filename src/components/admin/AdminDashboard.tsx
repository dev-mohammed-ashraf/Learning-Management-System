import { useEffect, useMemo, useState } from 'react';
import type { AdminDataState, AdminExamAttempt, AdminSectionId } from '../../types/admin';
import type { Locale } from '../../types/program';
import type { Theme } from '../../utils/theme';
import { AdminLayout } from './AdminLayout';
import { AdminOverview } from './AdminOverview';
import { AdminCoursesPage } from './AdminCoursesPage';
import { AdminCourseEditor } from './AdminCourseEditor';
import { AdminCategoriesPage } from './AdminCategoriesPage';
import { AdminUsersPage } from './AdminUsersPage';
import { AdminEnrollmentsPage } from './AdminEnrollmentsPage';
import { AdminExamsPage } from './AdminExamsPage';
import { AdminExamEditor } from './AdminExamEditor';
import { AdminCompaniesPage } from './AdminCompaniesPage';

type UpdateFn = (updater: (prev: AdminDataState) => AdminDataState) => void;

interface AdminDashboardProps {
  locale: Locale;
  theme: Theme;
  activeSection: AdminSectionId;
  onSectionChange: (section: AdminSectionId) => void;
  onBackToSite: () => void;
  onToggleLocale: () => void;
  onToggleTheme: () => void;
  /** Clears the demo dashboard session and returns to the login page. */
  onLogout: () => void;
  /** Demo admin data is owned by App (shared with student exam views). */
  state: AdminDataState;
  update: UpdateFn;
  /** Demo exam attempts (used by the companies section for student progress). */
  attempts?: AdminExamAttempt[];
}

/**
 * Demo admin dashboard shell + section router. All data is mock data held in
 * App-level state and mirrored to localStorage — never a real backend.
 */
export function AdminDashboard({
  locale,
  theme,
  activeSection,
  onSectionChange,
  onBackToSite,
  onToggleLocale,
  onToggleTheme,
  onLogout,
  state,
  update,
  attempts = [],
}: AdminDashboardProps) {
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [creatingExam, setCreatingExam] = useState(false);

  const editingCourse = useMemo(
    () => (editingCourseId ? state.courses.find((course) => course.id === editingCourseId) ?? null : null),
    [state, editingCourseId]
  );

  const editingExam = useMemo(
    () => (editingExamId ? state.exams.find((exam) => exam.id === editingExamId) ?? null : null),
    [state, editingExamId]
  );

  // If the edited course/exam disappears (deleted), fall back to the list.
  useEffect(() => {
    if (editingCourseId && !editingCourse) {
      setEditingCourseId(null);
    }
  }, [editingCourseId, editingCourse]);

  useEffect(() => {
    if (editingExamId && !editingExam) {
      setEditingExamId(null);
    }
  }, [editingExamId, editingExam]);

  return (
    <AdminLayout
      locale={locale}
      theme={theme}
      activeSection={activeSection}
            onSectionChange={(section) => {
        setEditingCourseId(null);
        setEditingExamId(null);
        setCreatingExam(false);
        onSectionChange(section);
      }}
      onBackToSite={onBackToSite}
      onToggleLocale={onToggleLocale}
      onToggleTheme={onToggleTheme}
      onLogout={onLogout}
    >
      {activeSection === 'overview' && (
        <AdminOverview
          locale={locale}
          state={state}
          onOpenCourses={() => {
            setEditingCourseId(null);
            onSectionChange('courses');
          }}
        />
      )}

      {activeSection === 'courses' &&
        (editingCourse ? (
          <AdminCourseEditor
            locale={locale}
            state={state}
            course={editingCourse}
            update={update}
            onClose={() => setEditingCourseId(null)}
          />
        ) : (
          <AdminCoursesPage
            locale={locale}
            state={state}
            update={update}
            onEditCourse={(courseId) => setEditingCourseId(courseId)}
          />
        ))}

      {activeSection === 'categories' && <AdminCategoriesPage locale={locale} state={state} update={update} />}

      {activeSection === 'users' && <AdminUsersPage locale={locale} state={state} update={update} />}

      {activeSection === 'companies' && (
        <AdminCompaniesPage locale={locale} state={state} update={update} attempts={attempts} />
      )}

      {activeSection === 'enrollments' && <AdminEnrollmentsPage locale={locale} state={state} update={update} />}

      {activeSection === 'exams' &&
        (editingExam ? (
          <AdminExamEditor
            locale={locale}
            state={state}
            exam={editingExam}
            update={update}
            onClose={() => setEditingExamId(null)}
          />
        ) : creatingExam ? (
          <AdminExamEditor
            locale={locale}
            state={state}
            update={update}
            onClose={() => setCreatingExam(false)}
            onCreated={(examId) => {
              setCreatingExam(false);
              setEditingExamId(examId);
            }}
          />
        ) : (
          <AdminExamsPage
            locale={locale}
            state={state}
            update={update}
            onEditExam={(examId) => setEditingExamId(examId)}
            onCreateExam={() => setCreatingExam(true)}
          />
        ))}
    </AdminLayout>
  );
}
