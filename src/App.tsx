import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AOS from 'aos';
import { EnrollmentJourney } from './components/enrollment/EnrollmentJourney';
import { AboutInstitute } from './components/home/AboutInstitute';
import { EnrollmentSteps } from './components/home/EnrollmentSteps';
import { FeaturedPrograms } from './components/home/FeaturedPrograms';
import { HomeCallToAction } from './components/home/HomeCallToAction';
import { HomeHero } from './components/home/HomeHero';
import { LearningExperience } from './components/home/LearningExperience';
import { TrustIndicators } from './components/home/TrustIndicators';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { FloatingGlassHeader } from './components/layout/FloatingGlassHeader';
import { FloatingGlassSidebar, type NavSection } from './components/layout/FloatingGlassSidebar';
import { FloatingWidgets } from './components/layout/FloatingWidgets';
import { Footer } from './components/layout/Footer';
import { PortalModal, type ModalState } from './components/programs/PortalModal';
import { ProgramsFilters } from './components/programs/ProgramsFilters';
import { ProgramsGrid } from './components/programs/ProgramsGrid';
import { ProgramsHero } from './components/programs/ProgramsHero';
import { ProgramsPagination } from './components/programs/ProgramsPagination';
import { AiToolsPage } from './components/student/AiToolsPage';
import { AssessmentsPage } from './components/student/AssessmentsPage';
import { CourseLearningPage } from './components/student/CourseLearningPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { DashboardLoginPage } from './components/auth/DashboardLoginPage';
import { StudentExamPage } from './components/student/StudentExamPage';
import { DashboardPage } from './components/student/DashboardPage';
import { GoalsPage } from './components/student/GoalsPage';
import { LearningPathsPage } from './components/student/LearningPathsPage';
import { LibraryPage } from './components/student/LibraryPage';
import { ProfilePage } from './components/student/ProfilePage';
import { ProjectsPage } from './components/student/ProjectsPage';
import { StudyGroupsPage } from './components/student/StudyGroupsPage';
import { DEMO_COURSES } from './data/demoCourses';
import { PROGRAMS } from './data/programs';
import { loadDemoLearningState, saveDemoLearningState } from './services/demoLearningStore';
import { loadAdminDataState, saveAdminDataState } from './services/adminStore';
import {
  loadStudentExamAttempts,
  saveStudentExamAttempts,
} from './services/studentExamStore';
import {
  clearDashboardSession,
  loadDashboardSession,
  saveDashboardSession,
  type DashboardSession,
} from './services/dashboardSessionStore';
import { authenticateDashboard, type DashboardRole } from './utils/dashboardAuth';
import {
  loadStudentPlatformState,
  saveStudentPlatformState,
} from './services/studentPlatformStore';
import { initGlassFusion } from './utils/glassFusion';
import {
  enrollDemoCourseState,
  setDemoLastLessonState,
  toggleDemoLessonState,
} from './utils/demoLearning';
import {
  adminCourseToDemoCourse,
  getStudentCompanyPurchasedCourses,
  mergeDemoLearningWithPurchases,
} from './utils/demoCourseBridge';
import { syncCompanyPurchaseProgress } from './utils/companyData';
import { gradeAttempt } from './utils/studentExam';
import type {
  CourseSortOption,
  Locale,
  Program,
  ProgramKind,
} from './types/program';
import type {
  LearningGoal,
  PageRoute,
  ProjectStatus,
  StudentAccount,
  StudentPlatformState,
  StudentPreferences,
} from './types/student';
import type { SearchServiceTarget } from './utils/headerSearch';
import type { DemoLearningState } from './types/coursePlayer';
import type { AdminDataState, AdminExamAttempt, AdminSectionId } from './types/admin';
import { filterPrograms, paginatePrograms, PROGRAMS_PER_PAGE } from './utils/programFilter';
import {
  createGoalState,
  deleteGoalState,
  enrollInProgramState,
  signInStudentState,
  signOutStudentState,
  toggleAssessmentSelfCheckState,
  toggleCourseModuleState,
  toggleGroupMembershipState,
  toggleSavedProgramState,
  updateGoalState,
  updateProjectStatusState,
  updateStudentProfileState,
} from './utils/studentPlatform';
import {
  applyThemeToDocument,
  persistTheme,
  readStoredTheme,
  toggleThemeValue,
  type Theme,
} from './utils/theme';

const ROUTE_PATHS: Record<PageRoute, string> = {
  home: '/',
  library: '/library',
  programs: '/programs',
  paths: '/paths',
  goals: '/goals',
  assessments: '/assessments',
  projects: '/projects',
  groups: '/groups',
  'ai-tools': '/ai-tools',
  dashboard: '/dashboard',
  profile: '/profile',
  learn: '/learn',
  admin: '/admin',
  company: '/company',
  exam: '/exam',
  'dashboard-login': '/dashboard/login',
};

function getInitialRoute(): {
  page: PageRoute;
  kind: ProgramKind;
  learnCourseId: string | null;
  adminSection?: AdminSectionId;
  examId?: string | null;
} {
  if (typeof window === 'undefined') {
    return { page: 'home', kind: 'diplomas', learnCourseId: null };
  }
  const path = window.location.pathname;
  if (path.startsWith('/exam')) {
    const params = new URLSearchParams(window.location.search);
    return {
      page: 'exam',
      kind: 'diplomas',
      learnCourseId: null,
      examId: params.get('id'),
    };
  }
  if (path.startsWith('/admin')) {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    const adminSection: AdminSectionId | null =
      section === 'courses' ||
      section === 'categories' ||
      section === 'users' ||
      section === 'companies' ||
      section === 'enrollments' ||
      section === 'exams'
        ? (section as AdminSectionId)
        : section === 'overview'
          ? 'overview'
          : null;
    return { page: 'admin', kind: 'diplomas', learnCourseId: null, adminSection: adminSection ?? 'overview' };
  }
  if (path.startsWith('/company')) {
    return { page: 'company', kind: 'diplomas', learnCourseId: null };
  }
  if (path.startsWith('/learn')) {
    const params = new URLSearchParams(window.location.search);
    return { page: 'learn', kind: 'diplomas', learnCourseId: params.get('course') };
  }
  if (path.includes('/programs')) {
    const params = new URLSearchParams(window.location.search);
    const kindParam = params.get('kind') === 'fellowships' ? 'fellowships' : 'diplomas';
    return { page: 'programs', kind: kindParam, learnCourseId: null };
  }
  if (path.startsWith('/library')) return { page: 'library', kind: 'diplomas', learnCourseId: null };
  if (path.startsWith('/paths')) return { page: 'paths', kind: 'diplomas', learnCourseId: null };
  if (path.startsWith('/goals')) return { page: 'goals', kind: 'diplomas', learnCourseId: null };
  if (path.startsWith('/assessments')) return { page: 'assessments', kind: 'diplomas', learnCourseId: null };
  if (path.startsWith('/projects')) return { page: 'projects', kind: 'diplomas', learnCourseId: null };
  if (path.startsWith('/groups')) return { page: 'groups', kind: 'diplomas', learnCourseId: null };
  if (path.startsWith('/ai-tools')) return { page: 'ai-tools', kind: 'diplomas', learnCourseId: null };
  if (path.startsWith('/dashboard/login')) {
    return { page: 'dashboard-login', kind: 'diplomas', learnCourseId: null };
  }
  if (path.startsWith('/dashboard')) return { page: 'dashboard', kind: 'diplomas', learnCourseId: null };
  if (path.startsWith('/profile')) return { page: 'profile', kind: 'diplomas', learnCourseId: null };
  return { page: 'home', kind: 'diplomas', learnCourseId: null };
}

function routeToNav(page: PageRoute, kind: ProgramKind): NavSection {
  if (page === 'programs') return kind;
  if (page === 'learn' || page === 'exam') return 'library';
  if (page === 'admin' || page === 'company' || page === 'dashboard-login') return 'home';
  return page;
}

export default function App() {
  const initialRoute = useMemo(() => getInitialRoute(), []);
  const [locale, setLocale] = useState<Locale>('ar');
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme());
  const [activePage, setActivePage] = useState<PageRoute>(initialRoute.page);
  const [kind, setKind] = useState<ProgramKind>(initialRoute.kind);
  const [activeNav, setActiveNav] = useState<NavSection>(() =>
    initialRoute.page === 'learn'
      ? 'library'
      : routeToNav(initialRoute.page, initialRoute.kind)
  );
  const [learningCourseId, setLearningCourseId] = useState<string | null>(
    initialRoute.learnCourseId
  );
  const [adminSection, setAdminSection] = useState<AdminSectionId>(
    initialRoute.adminSection ?? 'overview'
  );
  const [activeExamId, setActiveExamId] = useState<string | null>(initialRoute.examId ?? null);
  const [adminState, setAdminState] = useState<AdminDataState>(() => loadAdminDataState());
  const [examAttempts, setExamAttempts] = useState<AdminExamAttempt[]>(() =>
    loadStudentExamAttempts()
  );

  useEffect(() => {
    saveAdminDataState(adminState);
  }, [adminState]);

  useEffect(() => {
    saveStudentExamAttempts(examAttempts);
  }, [examAttempts]);

  const updateAdminState = (updater: (prev: AdminDataState) => AdminDataState) =>
    setAdminState(updater);
  const [demoLearning, setDemoLearning] = useState<DemoLearningState>(() =>
    loadDemoLearningState()
  );
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState<CourseSortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const aosInitialized = useRef(false);
  const [studentState, setStudentState] = useState<StudentPlatformState>(() =>
    loadStudentPlatformState()
  );

  useEffect(() => {
    saveStudentPlatformState(studentState);
  }, [studentState]);

  /** Unified demo dashboard session (admin | company) — re-validated on use. */
  const [dashboardSession, setDashboardSession] = useState<DashboardSession | null>(() =>
    loadDashboardSession()
  );

  useEffect(() => {
    if (dashboardSession) {
      saveDashboardSession(dashboardSession);
    }
  }, [dashboardSession]);

  useEffect(() => {
    saveDemoLearningState(demoLearning);
  }, [demoLearning]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.title =
      locale === 'ar'
        ? 'مدار | منصة التعلم الرقمي والبرامج المعتمدة'
        : 'Madar | Digital Learning Platform';
  }, [locale]);

  useEffect(() => {
    applyThemeToDocument(theme);
    persistTheme(theme);
  }, [theme]);

  // Glass Fusion: merges the Floating Glass Header & Sidebar into one
  // continuous surface whenever they touch or come close (no React re-renders).
  useEffect(() => initGlassFusion(), []);

  // AOS: centralized, user-facing only. Admin dashboard is explicitly excluded.
  useEffect(() => {
    if (activePage === 'admin' || activePage === 'company' || activePage === 'dashboard-login') return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const root = document.body;
    const isRTL = () => document.documentElement.dir === 'rtl';

    const setAos = (el: Element | null, anim: string, delay?: number) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.closest('[data-admin-root]')) return;
      if (el.hasAttribute('data-aos')) return;
      el.setAttribute('data-aos', anim);
      if (delay) el.setAttribute('data-aos-delay', String(delay));
    };

    const tagCards = (container: Element) => {
      const cards = Array.from(container.children).filter(
        (c): c is HTMLElement => c instanceof HTMLElement && !c.hasAttribute('data-aos')
      );
      if (cards.length < 2) return;
      const rtl = isRTL();
      const anims = rtl
        ? ['fade-left', 'fade-up', 'fade-right']
        : ['fade-right', 'fade-up', 'fade-left'];
      cards.forEach((card, i) => {
        card.setAttribute('data-aos', anims[i % anims.length]);
        card.setAttribute('data-aos-delay', String(Math.min(i, 4) * 80));
      });
    };

    const tagTwoColumn = (grid: Element) => {
      const cols = Array.from(grid.children).filter(
        (c): c is HTMLElement => c instanceof HTMLElement
      );
      if (cols.length !== 2) return false;
      const [first, second] = cols;
      const rtl = isRTL();
      // Visual position: in LTR first=left, second=right; in RTL first=right, second=left.
      const firstFrom = rtl ? 'fade-left' : 'fade-right'; // enters from its outer edge
      const secondFrom = rtl ? 'fade-right' : 'fade-left';
      setAos(first, firstFrom);
      setAos(second, secondFrom);
      return true;
    };

    const tagSections = () => {
      const sections = Array.from(
        root.querySelectorAll<HTMLElement>('section:not([data-aos-managed])')
      ).filter((el) => !el.closest('[data-admin-root]'));

      let alt = 0;
      sections.forEach((section) => {
        section.setAttribute('data-aos-managed', 'true');

        // Skip hero: has its own bespoke entrance.
        if (section.classList.contains('ut-page-hero')) return;

        // Two-column grids (text + image).
        const grids = Array.from(section.querySelectorAll(':scope .grid, :scope [class*="grid-cols"]'));
        let handledTwoCol = false;
        for (const grid of grids) {
          const cls = grid.className || '';
          const isCardGrid = /grid-cols-3|grid-cols-4|lg:grid-cols-3|md:grid-cols-3/.test(cls);
          if (isCardGrid) {
            tagCards(grid);
            continue;
          }
          const cols = grid.children.length;
          if (cols === 2) {
            handledTwoCol = tagTwoColumn(grid) || handledTwoCol;
          } else if (cols > 2) {
            tagCards(grid);
          }
        }

        // If no two-column layout was found, animate the section header/content subtly.
        if (!handledTwoCol) {
          const header = section.querySelector(':scope .wrap > div:first-child, :scope > .wrap > div:first-child');
          if (header instanceof HTMLElement && !header.querySelector('[data-aos]')) {
            const rtl = isRTL();
            const dir = alt % 2 === 0 ? (rtl ? 'fade-right' : 'fade-left') : 'fade-up';
            if (!header.hasAttribute('data-aos')) header.setAttribute('data-aos', dir);
          } else if (!section.hasAttribute('data-aos')) {
            section.setAttribute('data-aos', alt % 2 === 0 ? 'fade-up' : 'fade-up');
          }
        }

        alt += 1;
      });

      // Any remaining untagged sections (edge cases) get a mild fade-up.
      root.querySelectorAll<HTMLElement>('section:not([data-aos]):not([data-aos-managed])').forEach((el) => {
        if (el.closest('[data-admin-root]') || el.classList.contains('ut-page-hero')) return;
        el.setAttribute('data-aos', 'fade-up');
      });
    };

    let frame = 0;
    const refresh = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        tagSections();
        if (!aosInitialized.current) {
          AOS.init({
            duration: 650,
            once: true,
            offset: 48,
            easing: 'ease-out-cubic',
          });
          aosInitialized.current = true;
        } else {
          AOS.refresh();
        }
      });
    };

    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activePage]);

  useEffect(() => {
    const onPopState = () => {
      const next = getInitialRoute();
      setActivePage(next.page);
      setKind(next.kind);
      setLearningCourseId(next.learnCourseId);
      setAdminSection(next.adminSection ?? 'overview');
      setActiveExamId(next.examId ?? null);
      setActiveNav(
        next.page === 'learn' || next.page === 'exam'
          ? 'library'
          : next.page === 'admin' || next.page === 'company' || next.page === 'dashboard-login'
            ? 'home'
            : routeToNav(next.page, next.kind)
      );
      setCurrentPage(1);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const syncHistory = useCallback((page: PageRoute, nextKind: ProgramKind = 'diplomas') => {
    try {
      const targetUrl =
        page === 'programs'
          ? nextKind === 'fellowships'
            ? '/programs?kind=fellowships'
            : '/programs'
          : ROUTE_PATHS[page];
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ page, kind: nextKind }, '', targetUrl);
      }
    } catch {
      // Ignore history errors in restricted preview frames
    }
  }, []);

  const navigateToPage = useCallback(
    (page: PageRoute, nextKind: ProgramKind = 'diplomas', scrollTargetId?: string) => {
      setActivePage(page);
      setLearningCourseId(null);
      setAdminSection('overview');
      setActiveExamId(null);
      if (page === 'programs') {
        setKind(nextKind);
        setActiveNav(nextKind);
        setCurrentPage(1);
      } else {
        // 'learn' / 'exam' / 'admin' / 'company' / 'dashboard-login' have no dedicated nav entries on the public site.
        setActiveNav(
          page === 'learn' || page === 'exam'
            ? 'library'
            : page === 'admin' || page === 'company' || page === 'dashboard-login'
              ? 'home'
              : page
        );
      }
      syncHistory(page, nextKind);
      if (scrollTargetId) {
        window.setTimeout(() => {
          document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [syncHistory]
  );

  const navigateToHome = useCallback(() => {
    navigateToPage('home');
  }, [navigateToPage]);

  const navigateToPrograms = useCallback(
    (nextKind: ProgramKind = 'diplomas', scrollTargetId?: string) => {
      navigateToPage('programs', nextKind, scrollTargetId);
    },
    [navigateToPage]
  );

  const navigateToAdmin = useCallback((section: AdminSectionId = 'overview') => {
    setAdminSection(section);
    setActivePage('admin');
    setActiveNav('home');
    try {
      const targetUrl = section === 'overview' ? '/admin' : `/admin?section=${section}`;
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ page: 'admin' }, '', targetUrl);
      }
    } catch {
      // Ignore history errors in restricted preview frames
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAdminSectionChange = useCallback((section: AdminSectionId) => {
    setAdminSection(section);
    try {
      const targetUrl = section === 'overview' ? '/admin' : `/admin?section=${section}`;
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.replaceState({ page: 'admin' }, '', targetUrl);
      }
    } catch {
      // Ignore history errors in restricted preview frames
    }
  }, []);

  /** Dedicated company dashboard route (guarded by a verified company session). */
  const navigateToCompany = useCallback(() => {
    setActivePage('company');
    setActiveNav('home');
    try {
      if (window.location.pathname !== '/company') {
        window.history.pushState({ page: 'company' }, '', '/company');
      }
    } catch {
      // Ignore history errors in restricted preview frames
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** Dashboard login page — the single entry point for admin/company sessions. */
  const navigateToDashboardLogin = useCallback(() => {
    setActivePage('dashboard-login');
    setActiveNav('home');
    try {
      if (window.location.pathname !== '/dashboard/login') {
        window.history.pushState({ page: 'dashboard-login' }, '', '/dashboard/login');
      }
    } catch {
      // Ignore history errors in restricted preview frames
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToExam = useCallback((examId: string) => {
    setActiveExamId(examId);
    setActivePage('exam');
    setActiveNav('library');
    try {
      const targetUrl = `/exam?id=${encodeURIComponent(examId)}`;
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ page: 'exam' }, '', targetUrl);
      }
    } catch {
      // Ignore history errors in restricted preview frames
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Resolve the local student to a demo admin user (by email) so exam attempts
  // and company dashboards can attribute data to the right demo student.
  const viewerStudentId = useMemo<string | null>(() => {
    if (!studentState.account.signedIn) return null;
    const email = studentState.account.email.trim().toLowerCase();
    if (!email) return null;
    const user = adminState.users.find(
      (item) => item.role === 'student' && item.email.trim().toLowerCase() === email
    );
    return user?.id ?? null;
  }, [studentState.account.signedIn, studentState.account.email, adminState.users]);

  // Courses purchased/assigned to the signed-in student by their company —
  // bridged into the demo course-player model so they open with the existing
  // learning experience.
  const studentPurchasedCourses = useMemo(
    () => getStudentCompanyPurchasedCourses(adminState, viewerStudentId),
    [adminState, viewerStudentId]
  );

  const purchasedCourseIds = useMemo(
    () => studentPurchasedCourses.map((course) => course.id),
    [studentPurchasedCourses]
  );

  /** Demo learning view enriched with company-purchased course access. */
  const effectiveDemoLearning = useMemo(
    () => mergeDemoLearningWithPurchases(demoLearning, purchasedCourseIds),
    [demoLearning, purchasedCourseIds]
  );

  // Mirror demo lesson progress into company-purchase enrollments so the
  // company dashboard reflects the student's live course progress. Seeded and
  // admin-created enrollments keep their manual progress values untouched.
  useEffect(() => {
    if (!viewerStudentId) return;
    setAdminState((prev) => syncCompanyPurchaseProgress(prev, viewerStudentId, demoLearning));
  }, [demoLearning, viewerStudentId]);

  const handleStartExamAttempt = useCallback((examId: string): string => {
    const attemptId = `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const exam = adminState.exams.find((item) => item.id === examId);
    const attempt: AdminExamAttempt = {
      id: attemptId,
      examId,
      courseId: exam?.courseId ?? '',
      // Attribute the attempt to the signed-in demo student when the email
      // matches an admin user (enables company dashboard visibility).
      studentId: viewerStudentId ?? undefined,
      startedAt: new Date().toISOString(),
      submittedAt: null,
      answers: {},
      earnedMarks: null,
      totalMarks: null,
      scorePct: null,
      passed: null,
    };
    setExamAttempts((prev) => [attempt, ...prev]);
    return attemptId;
  }, [adminState.exams, viewerStudentId]);

  const handleSubmitExamAttempt = useCallback(
    (attemptId: string, answers: Record<string, string | boolean>) => {
      setExamAttempts((prev) =>
        prev.map((attempt) => {
          if (attempt.id !== attemptId) return attempt;
          const exam = adminState.exams.find((item) => item.id === attempt.examId);
          if (!exam) return attempt;
          const grade = gradeAttempt(exam, answers);
          return {
            ...attempt,
            submittedAt: new Date().toISOString(),
            answers,
            earnedMarks: grade.earnedMarks,
            totalMarks: grade.totalMarks,
            scorePct: grade.scorePct,
            passed: grade.passed,
          };
        })
      );
    },
    [adminState.exams]
  );

  const navigateToLearn = useCallback((courseId: string) => {
    setLearningCourseId(courseId);
    setActivePage('learn');
    setActiveNav('library');
    try {
      const targetUrl = `/learn?course=${encodeURIComponent(courseId)}`;
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ page: 'learn' }, '', targetUrl);
      }
    } catch {
      // Ignore history errors in restricted preview frames
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredPrograms = useMemo(
    () =>
      filterPrograms(PROGRAMS, {
        kind,
        search,
        type: selectedType,
        category: selectedCategory,
        sort: selectedSort,
      }),
    [kind, search, selectedType, selectedCategory, selectedSort]
  );

  const paginated = useMemo(
    () => paginatePrograms(filteredPrograms, currentPage, PROGRAMS_PER_PAGE),
    [filteredPrograms, currentPage]
  );

  const handleSelectNav = (nav: NavSection) => {
    if (nav === 'home') {
      navigateToHome();
      return;
    }
    if (nav === 'diplomas' || nav === 'fellowships') {
      navigateToPrograms(nav);
      return;
    }
    if (nav === 'about' || nav === 'letters' || nav === 'contact') {
      setModal({ type: 'info', section: nav });
      return;
    }
    navigateToPage(nav);
  };

  const handleToggleLocale = () => {
    setLocale((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => toggleThemeValue(prev));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('');
    setSelectedCategory('');
    setSelectedSort('default');
    setKind('diplomas');
    setCurrentPage(1);
  };

  const handleOpenProgram = (program: Program, tab: 'details' | 'register' = 'details') => {
    setModal({ type: 'program', program, tab });
  };

  const handleHeaderSearchSubmit = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
    navigateToPrograms('diplomas', 'programsCatalog');
  };

  const handleSelectSearchService = (target: SearchServiceTarget) => {
    if (target === 'diplomas' || target === 'fellowships') {
      navigateToPrograms(target);
      return;
    }
    if (
      target === 'dashboard' ||
      target === 'library' ||
      target === 'paths' ||
      target === 'goals' ||
      target === 'assessments' ||
      target === 'projects' ||
      target === 'groups' ||
      target === 'ai-tools' ||
      target === 'profile'
    ) {
      navigateToPage(target);
      return;
    }
    setModal({ type: 'info', section: target });
  };

  // Student Platform State Actions
  const handleEnrollProgram = (program: Program) => {
    setStudentState((prev) => enrollInProgramState(prev, program));
  };

  const handleToggleSaveProgram = (program: Program) => {
    setStudentState((prev) => toggleSavedProgramState(prev, program));
  };

  const handleToggleCourseModule = (program: Program, moduleIndex: number) => {
    setStudentState((prev) => toggleCourseModuleState(prev, program, moduleIndex));
  };

  // Demo Course Learning state actions (mock data only — no real backend)
  const handleEnrollDemoCourse = useCallback((courseId: string) => {
    setDemoLearning((prev) => enrollDemoCourseState(prev, courseId));
  }, []);

  const handleToggleDemoLesson = useCallback((courseId: string, lessonId: string) => {
    setDemoLearning((prev) => toggleDemoLessonState(prev, courseId, lessonId));
  }, []);

  const handleSelectDemoLesson = useCallback((courseId: string, lessonId: string) => {
    setDemoLearning((prev) => setDemoLastLessonState(prev, courseId, lessonId));
  }, []);

  const handleCreateGoal = (input: {
    title: string;
    targetDate: string;
    progress: number;
    relatedProgramId?: string;
  }) => {
    setStudentState((prev) => createGoalState(prev, input));
  };

  const handleUpdateGoal = (
    goalId: string,
    patch: Partial<
      Pick<LearningGoal, 'title' | 'targetDate' | 'progress' | 'status' | 'relatedProgramId'>
    >
  ) => {
    setStudentState((prev) => updateGoalState(prev, goalId, patch));
  };

  const handleDeleteGoal = (goalId: string) => {
    setStudentState((prev) => deleteGoalState(prev, goalId));
  };

  const handleUpdateProject = (
    projectId: string,
    titleAr: string,
    titleEn: string,
    status: ProjectStatus,
    submissionNote: string
  ) => {
    setStudentState((prev) =>
      updateProjectStatusState(prev, projectId, titleAr, titleEn, status, submissionNote)
    );
  };

  const handleToggleGroup = (groupId: string, titleAr: string, titleEn: string) => {
    setStudentState((prev) => toggleGroupMembershipState(prev, groupId, titleAr, titleEn));
  };

  const handleToggleSelfCheck = (assessmentId: string, titleAr: string, titleEn: string) => {
    setStudentState((prev) =>
      toggleAssessmentSelfCheckState(prev, assessmentId, titleAr, titleEn)
    );
  };

  const handleStudentSignIn = (
    accountPatch: Partial<Omit<StudentAccount, 'signedIn' | 'avatarId'>>
  ) => {
    setStudentState((prev) => signInStudentState(prev, accountPatch));
  };

  const handleStudentSignOut = () => {
    setStudentState((prev) => signOutStudentState(prev));
  };

  /** Demo dashboard login — the single entry point for admin/company sessions. */
  const handleDashboardLogin = useCallback(
    (role: DashboardRole, email: string, password: string): boolean => {
      const session = authenticateDashboard(role, email, password, adminState);
      if (!session) return false;
      setDashboardSession(session);
      if (session.role === 'admin') {
        navigateToAdmin();
      } else {
        navigateToCompany();
      }
      return true;
    },
    [adminState, navigateToAdmin, navigateToCompany]
  );

  /** Logout always returns the user to the dashboard login page. */
  const handleDashboardLogout = useCallback(() => {
    clearDashboardSession();
    setDashboardSession(null);
    navigateToDashboardLogin();
  }, [navigateToDashboardLogin]);

  const handleCompanySignOut = handleDashboardLogout;

  // Admin sessions grant platform-wide access; company sessions stay company-scoped.
  const isAdminSession = dashboardSession?.role === 'admin';

  // The company dashboard is only reachable with an active company session.
  const activeCompany = useMemo(() => {
    if (dashboardSession?.role !== 'company') return null;
    const company = adminState.companies.find(
      (item) => item.id === dashboardSession.companyId
    );
    return company && company.status === 'active' ? company : null;
  }, [dashboardSession, adminState.companies]);

  // Route protection: unauthenticated users and cross-role access are
  // redirected to the dashboard login page.
  useEffect(() => {
    if (activePage === 'admin' && !isAdminSession) {
      navigateToDashboardLogin();
      return;
    }
    if (activePage === 'company' && !activeCompany) {
      navigateToDashboardLogin();
    }
  }, [activePage, isAdminSession, activeCompany, navigateToDashboardLogin]);

  const handleSaveProfile = (
    accountPatch: Partial<Pick<StudentAccount, 'fullName' | 'email' | 'phone' | 'avatarId'>>,
    preferencesPatch: Partial<StudentPreferences>
  ) => {
    setStudentState((prev) => updateStudentProfileState(prev, accountPatch, preferencesPatch));
  };

  // The learning route resolves demo courses first, then any admin-managed
  // course (company purchases) through the demo bridge — one shared
  // course-player experience for both worlds.
  const activeDemoCourse = useMemo(() => {
    if (activePage !== 'learn' || !learningCourseId) return null;
    const demoCourse = DEMO_COURSES.find((course) => course.id === learningCourseId);
    if (demoCourse) return demoCourse;
    const adminCourse = adminState.courses.find((course) => course.id === learningCourseId);
    if (!adminCourse) return null;
    return adminCourseToDemoCourse(
      adminCourse,
      adminState.users.find((user) => user.id === adminCourse.instructorId)
    );
  }, [activePage, learningCourseId, adminState]);

  const activeExam = useMemo(
    () =>
      activePage === 'exam'
        ? (adminState.exams.find((exam) => exam.id === activeExamId) ?? null)
        : null,
    [activePage, adminState.exams, activeExamId]
  );

  // Invalid or missing demo course id → gracefully fall back to the library.
  useEffect(() => {
    if (activePage === 'learn' && !activeDemoCourse) {
      navigateToPage('library');
    }
  }, [activePage, activeDemoCourse, navigateToPage]);

  // Invalid or missing exam id → gracefully fall back to the library.
  useEffect(() => {
    if (activePage === 'exam' && !activeExam) {
      navigateToPage('library');
    }
  }, [activePage, activeExam, navigateToPage]);

  const hasActiveCourseFilters =
    search.trim() !== '' ||
    selectedType !== '' ||
    selectedCategory !== '' ||
    selectedSort !== 'default';

  return (
    <div
      id="app"
      className="min-h-screen flex flex-col bg-white text-[#183247] dark:bg-[#0B1726] dark:text-[#F1F5F9] transition-colors duration-200"
    >
      {activePage !== 'admin' && activePage !== 'company' && activePage !== 'dashboard-login' && (
        <FloatingGlassHeader
          locale={locale}
          theme={theme}
          programs={PROGRAMS}
          searchQuery={search}
          onSearchChange={handleSearchChange}
          onSubmitSearch={handleHeaderSearchSubmit}
          onToggleLocale={handleToggleLocale}
          onToggleTheme={handleToggleTheme}
          onGoHome={navigateToHome}
          onSelectProgram={(program) => handleOpenProgram(program, 'details')}
          onSelectService={handleSelectSearchService}
          mobileMenuOpen={mobileMenuOpen}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
      )}

      {activePage !== 'admin' && activePage !== 'company' && activePage !== 'dashboard-login' && (
        <FloatingGlassSidebar
          locale={locale}
          theme={theme}
          activeNav={activeNav}
          account={studentState.account}
          onSelectNav={handleSelectNav}
          onSelectKind={(nextKind) => {
            setKind(nextKind);
            setCurrentPage(1);
          }}
          onOpenAuth={(mode) => setModal({ type: 'auth', mode })}
          onSignOut={handleStudentSignOut}
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuOpenChange={setMobileMenuOpen}
        />
      )}

      <main className="flex-1">
        {activePage === 'dashboard-login' && (
          <DashboardLoginPage
            locale={locale}
            onAuthenticate={handleDashboardLogin}
            onBackToSite={() => navigateToPage('home')}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboard
            locale={locale}
            theme={theme}
            activeSection={adminSection}
            onSectionChange={handleAdminSectionChange}
            onBackToSite={() => navigateToPage('home')}
            onToggleLocale={handleToggleLocale}
            onToggleTheme={handleToggleTheme}
            onLogout={handleDashboardLogout}
            state={adminState}
            update={updateAdminState}
            attempts={examAttempts}
          />
        )}

        {activePage === 'company' && activeCompany && (
          <CompanyDashboard
            locale={locale}
            theme={theme}
            state={adminState}
            attempts={examAttempts}
            companyId={activeCompany.id}
            update={updateAdminState}
            onBackToSite={() => navigateToPage('home')}
            onToggleLocale={handleToggleLocale}
            onToggleTheme={handleToggleTheme}
            onSignOut={handleCompanySignOut}
          />
        )}

        {activePage === 'home' && (
          <>
            <HomeHero
              locale={locale}
              onExplorePrograms={() => navigateToPrograms('diplomas')}
              onLearnAbout={() =>
                document.getElementById('aboutInstitute')?.scrollIntoView({ behavior: 'smooth' })
              }
              onOpenProgram={(program) => handleOpenProgram(program, 'details')}
              onNavigateToPaths={() => navigateToPage('paths')}
            />
            <TrustIndicators locale={locale} />
            <AboutInstitute
              locale={locale}
              onDiscoverMore={() => setModal({ type: 'info', section: 'about' })}
            />
            <FeaturedPrograms
              locale={locale}
              savedCourseIds={studentState.savedCourseIds}
              enrollments={studentState.enrollments}
              onToggleSave={handleToggleSaveProgram}
              onOpenProgram={handleOpenProgram}
              onViewAllPrograms={() => navigateToPrograms('diplomas')}
            />
            <WhyChooseUs locale={locale} />
            <LearningExperience
              locale={locale}
              onExplorePrograms={() => navigateToPrograms('diplomas')}
            />
            <EnrollmentSteps
              locale={locale}
              onStartRegistration={() => setModal({ type: 'auth', mode: 'register' })}
            />
            <HomeCallToAction
              locale={locale}
              onBrowsePrograms={() => navigateToPrograms('diplomas')}
              onContactUs={() => setModal({ type: 'info', section: 'contact' })}
            />
          </>
        )}

        {activePage === 'programs' && (
          <>
            <ProgramsHero locale={locale} kind={kind} />

            <section
              id="programsCatalog"
              className="py-[28px_72px] pt-[28px] pb-[72px] max-[720px]:pb-[50px]"
            >
              <div className="wrap">
                <ProgramsFilters
                  locale={locale}
                  kind={kind}
                  search={search}
                  selectedType={selectedType}
                  selectedCategory={selectedCategory}
                  selectedSort={selectedSort}
                  onSearchChange={handleSearchChange}
                  onTypeChange={(val) => {
                    setSelectedType(val);
                    setCurrentPage(1);
                  }}
                  onCategoryChange={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  onKindChange={(nextKind) => {
                    setKind(nextKind);
                    setActiveNav(nextKind);
                    setCurrentPage(1);
                    syncHistory('programs', nextKind);
                  }}
                  onSortChange={(val) => {
                    setSelectedSort(val);
                    setCurrentPage(1);
                  }}
                  onSubmit={() => setCurrentPage(1)}
                  onReset={handleResetFilters}
                />

                <ProgramsGrid
                  locale={locale}
                  kind={kind}
                  programs={paginated.items}
                  hasActiveFilters={hasActiveCourseFilters}
                  savedCourseIds={studentState.savedCourseIds}
                  enrollments={studentState.enrollments}
                  onToggleSave={handleToggleSaveProgram}
                  onOpenDetails={handleOpenProgram}
                  onResetFilters={handleResetFilters}
                  onOpenContact={() => setModal({ type: 'info', section: 'contact' })}
                />

                <ProgramsPagination
                  locale={locale}
                  currentPage={paginated.currentPage}
                  totalPages={paginated.totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    document.getElementById('programsCatalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </div>
            </section>

            <EnrollmentJourney
              locale={locale}
              onStartRegistration={() => setModal({ type: 'auth', mode: 'register' })}
            />
          </>
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            locale={locale}
            state={studentState}
            programs={PROGRAMS}
            onGoHome={navigateToHome}
            onNavigate={handleSelectNav}
            onOpenProgram={handleOpenProgram}
            onOpenAuth={(mode) => setModal({ type: 'auth', mode })}
          />
        )}

        {activePage === 'learn' && activeDemoCourse && (
          <CourseLearningPage
            locale={locale}
            course={activeDemoCourse}
            learning={effectiveDemoLearning}
            onBackToLibrary={() => navigateToPage('library')}
            onEnroll={handleEnrollDemoCourse}
            onToggleLesson={handleToggleDemoLesson}
            onSelectLesson={handleSelectDemoLesson}
            exams={adminState.exams.filter(
              (exam) => exam.courseId === activeDemoCourse.id && exam.status === 'published'
            )}
            examAttempts={examAttempts}
            onOpenExam={navigateToExam}
          />
        )}

        {activePage === 'exam' && activeExam && (
          <StudentExamPage
            locale={locale}
            exam={activeExam}
            attempts={examAttempts}
            demoLearning={demoLearning}
            demoCourses={DEMO_COURSES}
            viewerStudentId={viewerStudentId}
            onBack={() => {
              const demoCourse = DEMO_COURSES.find((course) => course.id === activeExam.courseId);
              if (demoCourse) {
                navigateToLearn(demoCourse.id);
                return;
              }
              const adminCourse = adminState.courses.find(
                (course) => course.id === activeExam.courseId
              );
              if (adminCourse) {
                navigateToLearn(adminCourse.id);
                return;
              }
              navigateToPage('library');
            }}
            onStartAttempt={handleStartExamAttempt}
            onSubmitAttempt={handleSubmitExamAttempt}
          />
        )}

        {activePage === 'library' && (
          <LibraryPage
            locale={locale}
            state={studentState}
            programs={PROGRAMS}
            onGoHome={navigateToHome}
            onBrowseCourses={() => navigateToPrograms('diplomas')}
            onOpenProgram={handleOpenProgram}
            onToggleSave={handleToggleSaveProgram}
            onToggleModule={handleToggleCourseModule}
            demoCourses={[...DEMO_COURSES, ...studentPurchasedCourses]}
            demoLearning={effectiveDemoLearning}
            onEnrollDemoCourse={handleEnrollDemoCourse}
            onStartDemoLearning={navigateToLearn}
          />
        )}

        {activePage === 'paths' && (
          <LearningPathsPage
            locale={locale}
            state={studentState}
            programs={PROGRAMS}
            onGoHome={navigateToHome}
            onOpenProgram={handleOpenProgram}
          />
        )}

        {activePage === 'goals' && (
          <GoalsPage
            locale={locale}
            state={studentState}
            programs={PROGRAMS}
            onGoHome={navigateToHome}
            onCreateGoal={handleCreateGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activePage === 'assessments' && (
          <AssessmentsPage
            locale={locale}
            state={studentState}
            programs={PROGRAMS}
            onGoHome={navigateToHome}
            onToggleSelfCheck={handleToggleSelfCheck}
            onOpenProgram={handleOpenProgram}
          />
        )}

        {activePage === 'projects' && (
          <ProjectsPage
            locale={locale}
            state={studentState}
            programs={PROGRAMS}
            onGoHome={navigateToHome}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activePage === 'groups' && (
          <StudyGroupsPage
            locale={locale}
            state={studentState}
            programs={PROGRAMS}
            onGoHome={navigateToHome}
            onToggleGroup={handleToggleGroup}
          />
        )}

        {activePage === 'ai-tools' && (
          <AiToolsPage locale={locale} programs={PROGRAMS} onGoHome={navigateToHome} />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            locale={locale}
            theme={theme}
            state={studentState}
            programs={PROGRAMS}
            onGoHome={navigateToHome}
            onToggleLocale={handleToggleLocale}
            onToggleTheme={handleToggleTheme}
            onSaveProfile={handleSaveProfile}
            onOpenAuth={(mode) => setModal({ type: 'auth', mode })}
            onSignOut={handleStudentSignOut}
            onOpenProgram={handleOpenProgram}
          />
        )}
      </main>

      {activePage !== 'admin' && activePage !== 'company' && activePage !== 'dashboard-login' && (
        <>
          <Footer
            locale={locale}
            onSelectNav={handleSelectNav}
            onOpenProgram={(program) => handleOpenProgram(program, 'details')}
            onOpenPolicy={() => setModal({ type: 'info', section: 'policy' })}
          />

          <FloatingWidgets locale={locale} />
        </>
      )}

      <PortalModal
        locale={locale}
        modal={modal}
        savedCourseIds={studentState.savedCourseIds}
        enrollments={studentState.enrollments}
        onToggleSaveProgram={handleToggleSaveProgram}
        onEnrollProgram={handleEnrollProgram}
        onToggleCourseModule={handleToggleCourseModule}
        onStudentSignIn={handleStudentSignIn}
        onNavigateToLibrary={() => navigateToPage('library')}
        onClose={() => setModal({ type: 'closed' })}
        onSwitchModal={(next) => setModal(next)}
      />
    </div>
  );
}
