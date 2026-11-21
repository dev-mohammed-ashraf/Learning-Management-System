import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { DashboardPage } from './components/student/DashboardPage';
import { GoalsPage } from './components/student/GoalsPage';
import { LearningPathsPage } from './components/student/LearningPathsPage';
import { LibraryPage } from './components/student/LibraryPage';
import { ProfilePage } from './components/student/ProfilePage';
import { ProjectsPage } from './components/student/ProjectsPage';
import { StudyGroupsPage } from './components/student/StudyGroupsPage';
import { PROGRAMS } from './data/programs';
import {
  loadStudentPlatformState,
  saveStudentPlatformState,
} from './services/studentPlatformStore';
import { initGlassFusion } from './utils/glassFusion';
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
};

function getInitialRoute(): { page: PageRoute; kind: ProgramKind } {
  if (typeof window === 'undefined') {
    return { page: 'home', kind: 'diplomas' };
  }
  const path = window.location.pathname;
  if (path.includes('/programs')) {
    const params = new URLSearchParams(window.location.search);
    const kindParam = params.get('kind') === 'fellowships' ? 'fellowships' : 'diplomas';
    return { page: 'programs', kind: kindParam };
  }
  if (path.startsWith('/library')) return { page: 'library', kind: 'diplomas' };
  if (path.startsWith('/paths')) return { page: 'paths', kind: 'diplomas' };
  if (path.startsWith('/goals')) return { page: 'goals', kind: 'diplomas' };
  if (path.startsWith('/assessments')) return { page: 'assessments', kind: 'diplomas' };
  if (path.startsWith('/projects')) return { page: 'projects', kind: 'diplomas' };
  if (path.startsWith('/groups')) return { page: 'groups', kind: 'diplomas' };
  if (path.startsWith('/ai-tools')) return { page: 'ai-tools', kind: 'diplomas' };
  if (path.startsWith('/dashboard')) return { page: 'dashboard', kind: 'diplomas' };
  if (path.startsWith('/profile')) return { page: 'profile', kind: 'diplomas' };
  return { page: 'home', kind: 'diplomas' };
}

function routeToNav(page: PageRoute, kind: ProgramKind): NavSection {
  if (page === 'programs') return kind;
  return page;
}

export default function App() {
  const initialRoute = useMemo(() => getInitialRoute(), []);
  const [locale, setLocale] = useState<Locale>('ar');
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme());
  const [activePage, setActivePage] = useState<PageRoute>(initialRoute.page);
  const [kind, setKind] = useState<ProgramKind>(initialRoute.kind);
  const [activeNav, setActiveNav] = useState<NavSection>(() =>
    routeToNav(initialRoute.page, initialRoute.kind)
  );
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState<CourseSortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [studentState, setStudentState] = useState<StudentPlatformState>(() =>
    loadStudentPlatformState()
  );

  useEffect(() => {
    saveStudentPlatformState(studentState);
  }, [studentState]);

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

  useEffect(() => {
    const onPopState = () => {
      const next = getInitialRoute();
      setActivePage(next.page);
      setKind(next.kind);
      setActiveNav(routeToNav(next.page, next.kind));
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
      if (page === 'programs') {
        setKind(nextKind);
        setActiveNav(nextKind);
        setCurrentPage(1);
      } else {
        setActiveNav(page);
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

  const handleSaveProfile = (
    accountPatch: Partial<Pick<StudentAccount, 'fullName' | 'email' | 'phone' | 'avatarId'>>,
    preferencesPatch: Partial<StudentPreferences>
  ) => {
    setStudentState((prev) => updateStudentProfileState(prev, accountPatch, preferencesPatch));
  };

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
      />

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
      />

      <main className="flex-1">
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

      <Footer
        locale={locale}
        onSelectNav={handleSelectNav}
        onOpenProgram={(program) => handleOpenProgram(program, 'details')}
        onOpenPolicy={() => setModal({ type: 'info', section: 'policy' })}
      />

      <FloatingWidgets
        locale={locale}
        onOpenPrivacy={() => setModal({ type: 'info', section: 'policy' })}
      />

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
