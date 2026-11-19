import { useEffect, useMemo, useState } from 'react';
import { EnrollmentJourney } from './components/enrollment/EnrollmentJourney';
import { FloatingWidgets } from './components/layout/FloatingWidgets';
import { Footer } from './components/layout/Footer';
import { MainNavbar, type NavSection } from './components/layout/MainNavbar';
import { SecondaryBar } from './components/layout/SecondaryBar';
import { TopGovernmentBar } from './components/layout/TopGovernmentBar';
import { PortalModal, type ModalState } from './components/programs/PortalModal';
import { ProgramsFilters } from './components/programs/ProgramsFilters';
import { ProgramsGrid } from './components/programs/ProgramsGrid';
import { ProgramsHero } from './components/programs/ProgramsHero';
import { ProgramsPagination } from './components/programs/ProgramsPagination';
import { PROGRAMS } from './data/programs';
import type { Locale, Program, ProgramKind } from './types/program';
import { filterPrograms, paginatePrograms, PROGRAMS_PER_PAGE } from './utils/programFilter';

export default function App() {
  const [locale, setLocale] = useState<Locale>('ar');
  const [kind, setKind] = useState<ProgramKind>('diplomas');
  const [activeNav, setActiveNav] = useState<NavSection>('diplomas');
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const filteredPrograms = useMemo(
    () => filterPrograms(PROGRAMS, { kind, search, type: selectedType }),
    [kind, search, selectedType]
  );

  const paginated = useMemo(
    () => paginatePrograms(filteredPrograms, currentPage, PROGRAMS_PER_PAGE),
    [filteredPrograms, currentPage]
  );

  const handleSelectNav = (nav: NavSection) => {
    if (nav === 'home' || nav === 'diplomas') {
      setKind('diplomas');
      setActiveNav('diplomas');
      setCurrentPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (nav === 'fellowships') {
      setKind('fellowships');
      setActiveNav('fellowships');
      setCurrentPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setModal({ type: 'info', section: nav });
  };

  const handleToggleLocale = () => {
    setLocale((prev) => (prev === 'ar' ? 'en' : 'ar'));
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

  return (
    <div id="app" className="min-h-screen flex flex-col bg-white text-[#12263A]">
      <header className="contents">
        <TopGovernmentBar locale={locale} />
        <SecondaryBar
          locale={locale}
          onToggleLocale={handleToggleLocale}
          onOpenPortalInfo={(section) => setModal({ type: 'info', section })}
        />
        <div
          className="bg-[#F4F7FA] border-b border-[#E3EAF1] h-[108px] max-[1023px]:h-[96px] max-[720px]:h-[84px] -mb-[108px] max-[1023px]:-mb-[96px] max-[720px]:-mb-[84px]"
          aria-hidden="true"
        />
        <MainNavbar
          locale={locale}
          activeNav={activeNav}
          searchQuery={search}
          onSelectNav={handleSelectNav}
          onSelectKind={(nextKind) => {
            setKind(nextKind);
            setCurrentPage(1);
          }}
          onHeaderSearch={(query) => {
            setKind('diplomas');
            setActiveNav('diplomas');
            setSearch(query);
            setCurrentPage(1);
            document.getElementById('programsCatalog')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onToggleLocale={handleToggleLocale}
          onOpenAuth={(mode) => setModal({ type: 'auth', mode })}
          onOpenPortalInfo={(section) => setModal({ type: 'info', section })}
        />
      </header>

      <main className="flex-1">
        <ProgramsHero
          locale={locale}
          kind={kind}
          onGoHome={() => handleSelectNav('home')}
        />

        <section id="programsCatalog" className="py-[28px_72px] pt-[28px] pb-[72px] max-[720px]:pb-[50px]">
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
