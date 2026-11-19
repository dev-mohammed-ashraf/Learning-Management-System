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
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, mobileMenuOpen]);

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
    setMobileMenuOpen(false);
    setSearchOpen(next);
    if (next) {
      window.setTimeout(() => searchInputRef.current?.focus(), 20);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full h-[108px] max-[1023px]:h-[96px] max-[720px]:h-[84px] pointer-events-none">
      <div
        className={`w-[calc(100%-48px)] max-[720px]:w-[calc(100%-24px)] max-w-[1280px] mx-auto relative transition-[padding] duration-300 ease-out ${
          scrolled ? 'pt-[12px] max-[720px]:pt-[10px]' : 'pt-[18px] max-[720px]:pt-[14px]'
        }`}
      >
        <div
          className={`pointer-events-auto ut-glass-nav rounded-[20px] max-[720px]:rounded-[18px] transition-all duration-300 ease-out ${
            scrolled ? 'is-scrolled' : ''
          }`}
        >
          <div
            className={`flex items-center gap-[20px] max-[1200px]:gap-[12px] max-[720px]:gap-[8px] px-[22px] max-[1200px]:px-[16px] max-[720px]:px-[12px] transition-[padding] duration-300 ease-out ${
              scrolled
                ? 'py-[8px] max-[720px]:py-[7px]'
                : 'py-[12px] max-[1023px]:py-[10px] max-[720px]:py-[8px]'
            }`}
          >
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              aria-label={
                locale === 'ar'
                  ? 'معهد البحوث والاستشارات — جامعة تبوك'
                  : 'Research and Consulting Institute — University of Tabuk'
              }
              className="flex-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[#176B87] rounded-[10px]"
            >
              <img
                src="/assets/ut/logo-t.png"
                alt={
                  locale === 'ar'
                    ? 'معهد البحوث والاستشارات — جامعة تبوك'
                    : 'Research and Consulting Institute — University of Tabuk'
                }
                className={`object-contain block transition-all duration-300 ease-out ${
                  scrolled
                    ? 'w-[154px] h-[46px] max-[1200px]:w-[138px] max-[1200px]:h-[42px] max-[720px]:w-[118px] max-[720px]:h-[38px]'
                    : 'w-[170px] h-[52px] max-[1200px]:w-[150px] max-[1200px]:h-[46px] max-[720px]:w-[126px] max-[720px]:h-[40px]'
                }`}
              />
            </button>

            <nav
              className="hidden min-[1024px]:flex items-center gap-[2px] max-[1200px]:gap-[0px] mx-auto justify-center flex-nowrap"
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
                    className={`relative px-[12px] max-[1200px]:px-[8px] py-[7px] font-bold text-[0.94rem] max-[1200px]:text-[0.86rem] whitespace-nowrap shrink-0 rounded-[10px] cursor-pointer transition-all duration-200 ${
                      isCurrent
                        ? 'text-[#142D4E] ut-nav-cur'
                        : 'text-[#142D4E]/90 hover:text-[#176B87] hover:bg-[#DDF3F5]/60'
                    }`}
                  >
                    {locale === 'ar' ? item.labelAr : item.labelEn}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-[8px] max-[1023px]:ms-auto shrink-0">
              <button
                type="button"
                onClick={onToggleLocale}
                title={locale === 'ar' ? 'English' : 'العربية'}
                className="hidden max-[720px]:grid place-items-center w-[38px] h-[38px] flex-none border border-[#DCE7ED] rounded-[11px] bg-white/80 text-[#142D4E] font-bold text-[0.78rem] tracking-[0.3px] hover:border-[#28B5C5] hover:text-[#176B87] hover:bg-[#DDF3F5]/75 transition-colors cursor-pointer"
              >
                {locale === 'ar' ? 'EN' : 'AR'}
              </button>

              <button
                type="button"
                onClick={toggleSearch}
                aria-expanded={searchOpen}
                aria-controls="headSearch"
                aria-label={locale === 'ar' ? 'بحث' : 'Search'}
                className={`grid place-items-center w-[40px] h-[40px] max-[720px]:w-[38px] max-[720px]:h-[38px] flex-none border rounded-[12px] cursor-pointer transition-all duration-200 ${
                  searchOpen
                    ? 'border-[#28B5C5] text-[#176B87] bg-[#DDF3F5]/90'
                    : 'border-[#DCE7ED] bg-white/80 text-[#142D4E] hover:border-[#28B5C5] hover:text-[#176B87] hover:bg-[#DDF3F5]/70'
                }`}
              >
                <Search className="w-[18px] h-[18px]" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="hidden min-[768px]:inline-flex items-center justify-center rounded-[12px] px-[15px] max-[1200px]:px-[12px] py-[8px] font-bold text-[0.84rem] max-[1200px]:text-[0.8rem] border border-[#DCE7ED] text-[#142D4E] bg-white/80 hover:border-[#176B87] hover:text-[#176B87] hover:bg-[#EAF3F6]/70 transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
              >
                {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="hidden min-[768px]:inline-flex items-center justify-center rounded-[12px] px-[17px] max-[1200px]:px-[14px] py-[8px] font-bold text-[0.84rem] max-[1200px]:text-[0.8rem] border border-transparent bg-[#176B87] text-white shadow-[0_4px_14px_rgba(23,107,135,0.24)] hover:bg-[#142D4E] hover:shadow-[0_8px_20px_rgba(20,45,78,0.28)] transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
              >
                {locale === 'ar' ? 'سجّل الآن' : 'Register Now'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setMobileMenuOpen((prev) => !prev);
                }}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobNav"
                aria-label={locale === 'ar' ? 'القائمة' : 'Menu'}
                className="hidden max-[1023px]:grid place-items-center w-[40px] h-[40px] max-[720px]:w-[38px] max-[720px]:h-[38px] border border-[#DCE7ED] rounded-[12px] bg-white/80 text-[#142D4E] hover:border-[#176B87] flex-none transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <X className="w-[20px] h-[20px]" aria-hidden="true" />
                ) : (
                  <Menu className="w-[20px] h-[20px]" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div
            id="headSearch"
            className="pointer-events-auto absolute top-full inset-x-0 mt-[10px] ut-glass-panel rounded-[18px] p-[14px]"
          >
            <form
              className="flex gap-[10px]"
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
                className="flex-1 min-w-0 min-h-[44px] px-[16px] border border-[#DCE7ED] rounded-[12px] bg-[#EAF3F6] text-[#183247] placeholder:text-[#64748B] focus:outline-2 focus:outline-[#28B5C5] focus:bg-white"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-[12px] px-[22px] py-[10px] font-bold text-[0.92rem] bg-[#176B87] text-white hover:bg-[#142D4E] transition-colors cursor-pointer whitespace-nowrap"
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
            className="pointer-events-auto min-[1024px]:hidden absolute top-full inset-x-0 mt-[10px] ut-glass-panel rounded-[18px] overflow-hidden max-h-[calc(100vh-110px)] overflow-y-auto"
          >
            {navItems.map((item) => {
              const isCurrent = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-start flex items-center justify-between px-[18px] py-[13px] font-bold text-[0.95rem] border-b border-[#DCE7ED]/80 cursor-pointer transition-colors ${
                    isCurrent
                      ? 'text-[#142D4E] bg-[#DDF3F5]/65'
                      : 'text-[#142D4E] hover:bg-[#EAF3F6]'
                  }`}
                >
                  <span>{locale === 'ar' ? item.labelAr : item.labelEn}</span>
                  {isCurrent && (
                    <span className="w-[18px] h-[3px] rounded-full bg-[#28B5C5]" aria-hidden="true" />
                  )}
                </button>
              );
            })}

            <div className="flex min-[768px]:hidden gap-[10px] p-[14px_18px]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="flex-1 min-h-[44px] rounded-[12px] font-bold text-[0.92rem] border border-[#DCE7ED] text-[#142D4E] bg-white hover:border-[#176B87] hover:text-[#176B87] cursor-pointer"
              >
                {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="flex-1 min-h-[44px] rounded-[12px] font-bold text-[0.92rem] bg-[#176B87] text-white hover:bg-[#142D4E] cursor-pointer"
              >
                {locale === 'ar' ? 'سجّل الآن' : 'Register Now'}
              </button>
            </div>

            <div className="hidden max-[720px]:flex flex-col border-t border-[#DCE7ED] bg-[#EAF3F6]/70 px-[18px] py-[10px]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortalInfo('lms');
                }}
                className="text-start py-[8px] text-[0.86rem] font-semibold text-[#64748B] hover:text-[#176B87] cursor-pointer"
              >
                {locale === 'ar' ? 'بوابة التعلم' : 'Learning Portal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortalInfo('entities');
                }}
                className="text-start py-[8px] text-[0.86rem] font-semibold text-[#64748B] hover:text-[#176B87] cursor-pointer"
              >
                {locale === 'ar' ? 'خدمات الجهات' : 'Corporate Services'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortalInfo('support');
                }}
                className="text-start py-[8px] text-[0.86rem] font-semibold text-[#64748B] hover:text-[#176B87] cursor-pointer"
              >
                {locale === 'ar' ? 'الدعم والاستفسارات' : 'Support & Inquiries'}
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
