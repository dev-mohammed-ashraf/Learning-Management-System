import { useEffect, useRef, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import type { Locale, ProgramKind } from '../../types/program';

export type NavSection = 'home' | 'about' | 'diplomas' | 'fellowships' | 'letters' | 'contact';

interface MainNavbarProps {
  locale: Locale;
  activeNav: NavSection;
  searchQuery: string;
  onSelectNav: (nav: NavSection) => void;
  onSelectKind: (kind: ProgramKind) => void;
  onHeaderSearch: (query: string) => void;
  onToggleLocale: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenPortalInfo: (section: 'lms' | 'entities' | 'support') => void;
}

export function MainNavbar({
  locale,
  activeNav,
  searchQuery,
  onSelectNav,
  onSelectKind,
  onHeaderSearch,
  onToggleLocale,
  onOpenAuth,
  onOpenPortalInfo,
}: MainNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerInput, setHeaderInput] = useState(searchQuery);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHeaderInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [searchOpen]);

  const navItems: { id: NavSection; labelAr: string; labelEn: string }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { id: 'about', labelAr: 'عن المعهد', labelEn: 'About' },
    { id: 'diplomas', labelAr: 'برامج الدبلومات', labelEn: 'Diplomas' },
    { id: 'fellowships', labelAr: 'برامج الزمالات', labelEn: 'Fellowships' },
    { id: 'letters', labelAr: 'إفادة جهة العمل', labelEn: 'Employer Letters' },
    { id: 'contact', labelAr: 'تواصل معنا', labelEn: 'Contact Us' },
  ];

  const handleNavClick = (id: NavSection) => {
    setMobileMenuOpen(false);
    if (id === 'diplomas') {
      onSelectKind('diplomas');
    } else if (id === 'fellowships') {
      onSelectKind('fellowships');
    }
    onSelectNav(id);
  };

  const toggleSearch = () => {
    const next = !searchOpen;
    setSearchOpen(next);
    if (next) {
      window.setTimeout(() => searchInputRef.current?.focus(), 20);
    }
  };

  return (
    <div
      className={`bg-white border-b border-[#E3EAF1] sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_8px_28px_rgba(12,59,97,0.09)]' : ''
      }`}
    >
      <div className="wrap flex items-center gap-[28px] py-[18px] max-[1020px]:gap-[16px] max-[1020px]:py-[14px] max-[720px]:gap-[10px] max-[720px]:py-[10px]">
        <button
          type="button"
          onClick={() => handleNavClick('diplomas')}
          aria-label={
            locale === 'ar'
              ? 'معهد البحوث والاستشارات — جامعة تبوك'
              : 'Research and Consulting Institute — University of Tabuk'
          }
          className="flex-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1C5D92] rounded-[8px]"
        >
          <img
            src="/assets/ut/logo.jpg"
            alt={
              locale === 'ar'
                ? 'معهد البحوث والاستشارات — جامعة تبوك'
                : 'Research and Consulting Institute — University of Tabuk'
            }
            className="w-[196px] h-[62px] max-[720px]:w-[136px] max-[720px]:h-[44px] object-contain block"
          />
        </button>

        <nav
          className="hidden min-[1201px]:flex gap-[2px] mx-auto justify-center flex-nowrap"
          aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main Navigation'}
        >
          {navItems.map((item) => {
            const isCurrent = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`relative px-[13px] py-[8px] font-bold text-[1rem] whitespace-nowrap shrink-0 rounded-[10px] cursor-pointer transition-colors duration-200 ${
                  isCurrent
                    ? 'text-[#0C3B61] ut-nav-cur'
                    : 'text-[#0C3B61] hover:text-[#1C5D92] hover:bg-[#E8EEF4]'
                }`}
              >
                {locale === 'ar' ? item.labelAr : item.labelEn}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-[10px] max-[1200px]:ms-auto max-[720px]:gap-[8px] shrink-0">
          <button
            type="button"
            onClick={onToggleLocale}
            title={locale === 'ar' ? 'English' : 'العربية'}
            className="hidden max-[720px]:grid place-items-center w-[42px] h-[42px] flex-none border border-[#E3EAF1] rounded-[10px] bg-white text-[#0C3B61] font-bold text-[0.82rem] tracking-[0.3px] hover:border-[#C99B3F] hover:text-[#A87E2B] hover:bg-[#F7EFDD] cursor-pointer"
          >
            {locale === 'ar' ? 'EN' : 'AR'}
          </button>

          <button
            type="button"
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            aria-controls="headSearch"
            aria-label={locale === 'ar' ? 'بحث' : 'Search'}
            className={`grid place-items-center w-[42px] h-[42px] flex-none border rounded-[10px] cursor-pointer transition-colors duration-200 ${
              searchOpen
                ? 'border-[#C99B3F] text-[#A87E2B] bg-[#F7EFDD]'
                : 'border-[#E3EAF1] bg-white text-[#0C3B61] hover:border-[#C99B3F] hover:text-[#A87E2B] hover:bg-[#F7EFDD]'
            }`}
          >
            <Search className="w-[19px] h-[19px]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onOpenAuth('login')}
            className="hidden min-[1021px]:inline-flex items-center justify-center rounded-[8px] px-[16px] py-[7px] font-bold text-[0.83rem] border border-[#E3EAF1] text-[#12263A] bg-white hover:border-[#1C5D92] hover:text-[#1C5D92] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => onOpenAuth('register')}
            className="hidden min-[1021px]:inline-flex items-center justify-center rounded-[8px] px-[16px] py-[7px] font-bold text-[0.83rem] border border-transparent bg-[#1C5D92] text-white hover:bg-[#154A76] hover:shadow-[0_10px_24px_rgba(28,93,146,0.3)] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            {locale === 'ar' ? 'سجّل الآن' : 'Register Now'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobNav"
            aria-label={locale === 'ar' ? 'القائمة' : 'Menu'}
            className="hidden max-[1200px]:grid place-items-center w-[42px] h-[42px] border border-[#E3EAF1] rounded-[10px] bg-white text-[#12263A] flex-none cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-[22px] h-[22px]" aria-hidden="true" />
            ) : (
              <Menu className="w-[22px] h-[22px]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div id="headSearch" className="border-t border-[#E3EAF1] bg-white">
          <form
            className="wrap flex gap-[10px] py-[14px]"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              onHeaderSearch(headerInput);
              setSearchOpen(false);
            }}
          >
            <label className="sr-only" htmlFor="headSearchInput">
              {locale === 'ar' ? 'بحث' : 'Search'}
            </label>
            <input
              ref={searchInputRef}
              id="headSearchInput"
              type="search"
              value={headerInput}
              onChange={(e) => setHeaderInput(e.target.value)}
              placeholder={
                locale === 'ar'
                  ? 'ابحث عن برنامج أو دبلوم…'
                  : 'Search for a program or diploma…'
              }
              autoComplete="off"
              className="flex-1 min-w-0 min-h-[46px] px-[16px] border border-[#E3EAF1] rounded-[10px] bg-[#F5F8FB] text-[#12263A] focus:outline-2 focus:outline-[#C99B3F] focus:bg-white"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-[10px] px-[26px] py-[11px] font-bold text-[0.95rem] bg-[#1C5D92] text-white hover:bg-[#154A76] cursor-pointer whitespace-nowrap"
            >
              {locale === 'ar' ? 'بحث' : 'Search'}
            </button>
          </form>
        </div>
      )}

      {mobileMenuOpen && (
        <nav
          id="mobNav"
          aria-label={locale === 'ar' ? 'القائمة الجانبية' : 'Mobile Navigation'}
          className="min-[1201px]:hidden bg-white border-t border-[#E3EAF1] shadow-[0_22px_54px_rgba(12,59,97,0.11)] max-h-[calc(100vh-110px)] overflow-y-auto"
        >
          {navItems.map((item) => {
            const isCurrent = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-start flex items-center justify-between px-[18px] py-[14px] font-bold text-[0.98rem] border-b border-[#E3EAF1] cursor-pointer ${
                  isCurrent
                    ? 'text-[#0C3B61] bg-[#F5F8FB] shadow-[inset_-4px_0_0_#C99B3F]'
                    : 'text-[#0C3B61] hover:bg-[#F5F8FB]'
                }`}
              >
                <span>{locale === 'ar' ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}

          <div className="flex gap-[10px] p-[16px_18px]">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth('login');
              }}
              className="flex-1 min-h-[48px] rounded-[10px] font-bold text-[0.95rem] border border-[#E3EAF1] text-[#12263A] bg-white cursor-pointer"
            >
              {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth('register');
              }}
              className="flex-1 min-h-[48px] rounded-[10px] font-bold text-[0.95rem] bg-[#1C5D92] text-white cursor-pointer"
            >
              {locale === 'ar' ? 'سجّل الآن' : 'Register Now'}
            </button>
          </div>

          <div className="hidden max-[720px]:flex flex-col border-t border-[#E3EAF1] bg-[#F5F8FB] px-[18px] py-[10px]">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortalInfo('lms');
              }}
              className="text-start py-[9px] text-[0.88rem] font-semibold text-[#5E7489] cursor-pointer"
            >
              {locale === 'ar' ? 'بوابة التعلم' : 'Learning Portal'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortalInfo('entities');
              }}
              className="text-start py-[9px] text-[0.88rem] font-semibold text-[#5E7489] cursor-pointer"
            >
              {locale === 'ar' ? 'خدمات الجهات' : 'Corporate Services'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortalInfo('support');
              }}
              className="text-start py-[9px] text-[0.88rem] font-semibold text-[#5E7489] cursor-pointer"
            >
              {locale === 'ar' ? 'الدعم والاستفسارات' : 'Support & Inquiries'}
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
