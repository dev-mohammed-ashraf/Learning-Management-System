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
import { FloatingWidgets } from './components/layout/FloatingWidgets';
import { FloatingGlassHeader } from './components/layout/FloatingGlassHeader';
import { FloatingGlassSidebar, type NavSection } from './components/layout/FloatingGlassSidebar';
import { Footer } from './components/layout/Footer';
import { PortalModal, type ModalState } from './components/programs/PortalModal';
import { ProgramsFilters } from './components/programs/ProgramsFilters';
import { ProgramsGrid } from './components/programs/ProgramsGrid';
import { ProgramsHero } from './components/programs/ProgramsHero';
import { ProgramsPagination } from './components/programs/ProgramsPagination';
import { PROGRAMS } from './data/programs';
import type { Locale, Program, ProgramKind } from './types/program';
import type { SearchServiceTarget } from './utils/headerSearch';
import { filterPrograms, paginatePrograms, PROGRAMS_PER_PAGE } from './utils/programFilter';
import {
  applyThemeToDocument,
  persistTheme,
  readStoredTheme,
  toggleThemeValue,
  type Theme,
} from './utils/theme';

type PageRoute = 'home' | 'programs';

function getInitialRoute(): { page: PageRoute; kind: ProgramKind } {
  if (typeof window !== 'undefined' && window.location.pathname.includes('/programs')) {
    const params = new URLSearchParams(window.location.search);
    const kindParam = params.get('kind') === 'fellowships' ? 'fellowships' : 'diplomas';
    return { page: 'programs', kind: kindParam };
  }
  return { page: 'home', kind: 'diplomas' };
}

export default function App() {
  const initialRoute = useMemo(() => getInitialRoute(), []);
  const [locale, setLocale] = useState<Locale>('ar');
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme());
  const [activePage, setActivePage] = useState<PageRoute>(initialRoute.page);
  const [kind, setKind] = useState<ProgramKind>(initialRoute.kind);
  const [activeNav, setActiveNav] = useState<NavSection>(
    initialRoute.page === 'home' ? 'home' : initialRoute.kind
  );
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  useEffect(() => {
    applyThemeToDocument(theme);
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    const onPopState = () => {
      const next = getInitialRoute();
      setActivePage(next.page);
      setKind(next.kind);
      setActiveNav(next.page === 'home' ? 'home' : next.kind);
      setCurrentPage(1);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const syncHistory = useCallback((page: PageRoute, nextKind: ProgramKind) => {
    try {
      const targetUrl =
        page === 'home'
          ? '/'
          : nextKind === 'fellowships'
            ? '/programs?kind=fellowships'
            : '/programs';
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ page, kind: nextKind }, '', targetUrl);
      }
    } catch {
      // Ignore history errors in restricted preview frames
    }
  }, []);

  const navigateToHome = useCallback(() => {
    setActivePage('home');
    setActiveNav('home');
    syncHistory('home', 'diplomas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [syncHistory]);

  const navigateToPrograms = useCallback(
    (nextKind: ProgramKind = 'diplomas', scrollTargetId?: string) => {
      setActivePage('programs');
      setKind(nextKind);
      setActiveNav(nextKind);
      setCurrentPage(1);
      syncHistory('programs', nextKind);
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

  const filteredPrograms = useMemo(
    () => filterPrograms(PROGRAMS, { kind, search, type: selectedType }),
    [kind, search, selectedType]
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
    setModal({ type: 'info', section: nav });
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

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('');
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
    setModal({ type: 'info', section: target });
  };

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
        onSelectNav={handleSelectNav}
        onSelectKind={(nextKind) => {
          setKind(nextKind);
          setCurrentPage(1);
        }}
        onToggleLocale={handleToggleLocale}
        onOpenAuth={(mode) => setModal({ type: 'auth', mode })}
        onOpenPortalInfo={(section) => setModal({ type: 'info', section })}
      />

      <main className="flex-1">
        {activePage === 'home' ? (
          <>
            <HomeHero
              locale={locale}
              onExplorePrograms={() => navigateToPrograms('diplomas')}
              onLearnAbout={() =>
                document.getElementById('aboutInstitute')?.scrollIntoView({ behavior: 'smooth' })
              }
            />
            <TrustIndicators locale={locale} />
            <AboutInstitute
              locale={locale}
              onDiscoverMore={() => setModal({ type: 'info', section: 'about' })}
            />
            <FeaturedPrograms
              locale={locale}
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
        ) : (
          <>
            <ProgramsHero locale={locale} kind={kind} onGoHome={navigateToHome} />

            <section
              id="programsCatalog"
              className="py-[28px_72px] pt-[28px] pb-[72px] max-[720px]:pb-[50px]"
            >
              <div className="wrap">
                <ProgramsFilters
                  locale={locale}
                  search={search}
                  selectedType={selectedType}
                  onSearchChange={handleSearchChange}
                  onTypeChange={handleTypeChange}
                  onSubmit={() => setCurrentPage(1)}
                  onReset={handleResetFilters}
                />

                <ProgramsGrid
                  locale={locale}
                  kind={kind}
                  programs={paginated.items}
                  hasActiveFilters={search.trim() !== '' || selectedType !== ''}
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
        onClose={() => setModal({ type: 'closed' })}
        onSwitchModal={(next) => setModal(next)}
      />
    </div>
  );
}
