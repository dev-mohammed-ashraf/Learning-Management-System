import { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Globe,
  GraduationCap,
  Home,
  LifeBuoy,
  LogIn,
  Menu,
  PhoneCall,
  UserPlus,
  X,
} from 'lucide-react';
import type { Locale, ProgramKind } from '../../types/program';

export type NavSection = 'home' | 'about' | 'diplomas' | 'fellowships' | 'letters' | 'contact';
export type PortalInfoSection = 'lms' | 'entities' | 'support';

interface FloatingGlassSidebarProps {
  locale: Locale;
  activeNav: NavSection;
  onSelectNav: (nav: NavSection) => void;
  onSelectKind: (kind: ProgramKind) => void;
  onToggleLocale: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenPortalInfo: (section: PortalInfoSection) => void;
}

export function FloatingGlassSidebar({
  locale,
  activeNav,
  onSelectNav,
  onSelectKind,
  onToggleLocale,
  onOpenAuth,
  onOpenPortalInfo,
}: FloatingGlassSidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems: {
    id: NavSection;
    labelAr: string;
    labelEn: string;
    icon: typeof Home;
  }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: Home },
    { id: 'about', labelAr: 'عن المعهد', labelEn: 'About', icon: Building2 },
    { id: 'diplomas', labelAr: 'برامج الدبلومات', labelEn: 'Diplomas', icon: GraduationCap },
    { id: 'fellowships', labelAr: 'برامج الزمالات', labelEn: 'Fellowships', icon: Award },
    { id: 'letters', labelAr: 'إفادة جهة العمل', labelEn: 'Employer Letters', icon: FileCheck2 },
    { id: 'contact', labelAr: 'تواصل معنا', labelEn: 'Contact Us', icon: PhoneCall },
  ];

  const secondaryPortalItems: {
    id: PortalInfoSection;
    labelAr: string;
    labelEn: string;
    icon: typeof BookOpen;
  }[] = [
    { id: 'lms', labelAr: 'بوابة التعلم', labelEn: 'Learning Portal', icon: BookOpen },
    { id: 'entities', labelAr: 'خدمات الجهات', labelEn: 'Corporate Services', icon: Briefcase },
    { id: 'support', labelAr: 'الدعم والاستفسارات', labelEn: 'Support & Inquiries', icon: LifeBuoy },
  ];

  useEffect(() => {
    if (!drawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen]);

  const handleNavClick = (id: NavSection) => {
    setDrawerOpen(false);
    if (id === 'diplomas') {
      onSelectKind('diplomas');
    } else if (id === 'fellowships') {
      onSelectKind('fellowships');
    }
    onSelectNav(id);
  };

  const handlePortalClick = (section: PortalInfoSection) => {
    setDrawerOpen(false);
    onOpenPortalInfo(section);
  };

  const localeTooltip = locale === 'ar' ? 'Switch to English (EN)' : 'التبديل إلى العربية (AR)';

  return (
    <>
      {/* Desktop Floating Vertical Glass Sidebar (Fixed Left, Centered Vertically) */}
      <aside
        aria-label={locale === 'ar' ? 'القائمة الرئيسية الجانبية' : 'Primary Floating Sidebar'}
        data-expanded={expanded ? 'true' : 'false'}
        className={`hidden min-[1024px]:flex flex-col fixed left-[20px] top-1/2 -translate-y-1/2 z-[60] max-h-[85vh] rounded-[24px] p-[14px] ut-glass-sidebar transition-[width] duration-300 ease-out ${
          expanded ? 'w-[260px]' : 'w-[90px]'
        }`}
      >
        {/* Expand / Collapse Dedicated Toggle Button (Vertically Centered on Outer Right Edge) */}
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label={
            expanded
              ? locale === 'ar'
                ? 'طي القائمة الجانبية'
                : 'Collapse sidebar'
              : locale === 'ar'
                ? 'توسيع القائمة الجانبية'
                : 'Expand sidebar'
          }
          title={
            expanded
              ? locale === 'ar'
                ? 'طي القائمة'
                : 'Collapse'
              : locale === 'ar'
                ? 'توسيع القائمة'
                : 'Expand'
          }
          className="absolute -right-[13px] top-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-white border border-[#DCE7ED] text-[#142D4E] shadow-[0_4px_14px_rgba(20,45,78,0.14)] grid place-items-center hover:border-[#28B5C5] hover:text-[#176B87] hover:bg-[#DDF3F5] focus-visible:outline-2 focus-visible:outline-[#176B87] transition-all duration-200 cursor-pointer z-[2]"
        >
          {expanded ? (
            <ChevronLeft className="w-[15px] h-[15px]" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-[15px] h-[15px]" aria-hidden="true" />
          )}
        </button>

        {/* A. Brand Area (Horizontally Centered in Both States) */}
        <div className="flex-none pb-[10px] mb-[8px] border-b border-[#DCE7ED]/80 flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            aria-label={
              locale === 'ar'
                ? 'العودة إلى الرئيسية — معهد البحوث والاستشارات'
                : 'Home — Research and Consulting Institute'
            }
            className="w-full flex items-center justify-center cursor-pointer rounded-[14px] p-[4px] hover:bg-[#DDF3F5]/45 focus-visible:outline-2 focus-visible:outline-[#176B87] transition-colors"
          >
            {expanded ? (
              <img
                src="/assets/ut/logo-t.png"
                alt={
                  locale === 'ar'
                    ? 'معهد البحوث والاستشارات — جامعة تبوك'
                    : 'Research and Consulting Institute — University of Tabuk'
                }
                className="h-[44px] w-auto max-w-full object-contain block mx-auto"
              />
            ) : (
              <span className="w-[42px] h-[42px] rounded-[12px] overflow-hidden bg-white/95 border border-[#DCE7ED]/80 grid place-items-center flex-none p-[4px]">
                <span className="w-[32px] h-[34px] overflow-hidden block">
                  <img
                    src="/assets/ut/favicon.png"
                    alt={
                      locale === 'ar'
                        ? 'معهد البحوث والاستشارات — جامعة تبوك'
                        : 'Research and Consulting Institute — University of Tabuk'
                    }
                    className="w-[37px] max-w-none h-[34px] object-contain object-left block"
                  />
                </span>
              </span>
            )}
          </button>
        </div>

        {/* B. Primary + Secondary Vertical Navigation Links */}
        <nav
          aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main Navigation'}
          className="flex-1 min-h-0 flex flex-col gap-[4px] py-[2px] [@media(max-height:700px)]:overflow-y-auto"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = activeNav === item.id;
            const label = locale === 'ar' ? item.labelAr : item.labelEn;

            return (
              <div key={item.id} className="relative group/nav">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={label}
                  title={!expanded ? label : undefined}
                  className={`relative w-full h-[40px] flex items-center rounded-[13px] cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#176B87] ${
                    expanded ? 'px-[12px] gap-[11px] justify-start' : 'justify-center px-0'
                  } ${
                    isCurrent
                      ? 'bg-[#DDF3F5] text-[#142D4E] shadow-[inset_0_0_0_1px_rgba(40,181,197,0.38)]'
                      : 'text-[#142D4E] hover:bg-[#EAF3F6]/90 hover:text-[#176B87]'
                  }`}
                >
                  {isCurrent && (
                    <span
                      aria-hidden="true"
                      className="w-[3.5px] h-[20px] rounded-full bg-[#28B5C5] flex-none absolute right-[4px] top-1/2 -translate-y-1/2 transition-opacity"
                    />
                  )}

                  <Icon
                    className={`w-[19px] h-[19px] flex-none transition-colors duration-200 ${
                      isCurrent
                        ? 'text-[#28B5C5]'
                        : 'text-[#142D4E] group-hover/nav:text-[#176B87]'
                    }`}
                    aria-hidden="true"
                  />

                  {expanded && (
                    <span className="font-bold text-[0.88rem] whitespace-nowrap truncate leading-none">
                      {label}
                    </span>
                  )}
                </button>

                {!expanded && (
                  <span
                    role="tooltip"
                    className="pointer-events-none opacity-0 -translate-x-[6px] group-hover/nav:opacity-100 group-hover/nav:translate-x-0 group-focus-within/nav:opacity-100 group-focus-within/nav:translate-x-0 transition-all duration-150 absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 ut-glass-tooltip text-[0.82rem] font-bold px-[12px] py-[6px] rounded-[10px] whitespace-nowrap z-[70]"
                  >
                    {label}
                  </span>
                )}
              </div>
            );
          })}

          {/* Subtle Divider between Primary Nav & Portal Links */}
          <div className="my-[6px] border-t border-[#DCE7ED]/85" aria-hidden="true" />

          {/* Secondary Portal Services Group */}
          {secondaryPortalItems.map((item) => {
            const Icon = item.icon;
            const label = locale === 'ar' ? item.labelAr : item.labelEn;

            return (
              <div key={item.id} className="relative group/sec">
                <button
                  type="button"
                  onClick={() => handlePortalClick(item.id)}
                  aria-label={label}
                  title={!expanded ? label : undefined}
                  className={`relative w-full h-[38px] flex items-center rounded-[12px] text-[#142D4E]/90 hover:bg-[#EAF3F6]/90 hover:text-[#176B87] cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#176B87] ${
                    expanded ? 'px-[12px] gap-[11px] justify-start' : 'justify-center px-0'
                  }`}
                >
                  <Icon
                    className="w-[18px] h-[18px] flex-none text-[#176B87] group-hover/sec:text-[#28B5C5] transition-colors duration-200"
                    aria-hidden="true"
                  />

                  {expanded && (
                    <span className="font-bold text-[0.85rem] whitespace-nowrap truncate leading-none">
                      {label}
                    </span>
                  )}
                </button>

                {!expanded && (
                  <span
                    role="tooltip"
                    className="pointer-events-none opacity-0 -translate-x-[6px] group-hover/sec:opacity-100 group-hover/sec:translate-x-0 group-focus-within/sec:opacity-100 group-focus-within/sec:translate-x-0 transition-all duration-150 absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 ut-glass-tooltip text-[0.82rem] font-bold px-[12px] py-[6px] rounded-[10px] whitespace-nowrap z-[70]"
                  >
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* C. Bottom Actions: Compact Language Switch + Login + Register */}
        <div className="flex-none pt-[10px] mt-[8px] border-t border-[#DCE7ED]/80 flex flex-col gap-[6px]">
          <div className="relative group/lang">
            <button
              type="button"
              onClick={onToggleLocale}
              aria-label={localeTooltip}
              title={!expanded ? localeTooltip : undefined}
              className={`w-full h-[36px] flex items-center rounded-[11px] border border-[#28B5C5]/45 bg-white/60 text-[#142D4E] font-bold text-[0.8rem] hover:border-[#176B87] hover:bg-[#DDF3F5]/65 hover:text-[#176B87] focus-visible:outline-2 focus-visible:outline-[#176B87] transition-all duration-200 cursor-pointer ${
                expanded ? 'px-[12px] justify-between' : 'justify-center px-0'
              }`}
            >
              {expanded ? (
                <>
                  <span className="inline-flex items-center gap-[8px]">
                    <Globe className="w-[15px] h-[15px] text-[#176B87] flex-none" aria-hidden="true" />
                    <span className="whitespace-nowrap">
                      {locale === 'ar' ? 'اللغة' : 'Language'}
                    </span>
                  </span>
                  <span className="text-[0.74rem] font-extrabold text-[#176B87] tracking-wide">
                    {locale === 'ar' ? 'EN' : 'AR'}
                  </span>
                </>
              ) : (
                <span className="text-[0.76rem] font-extrabold tracking-wide leading-none">
                  {locale === 'ar' ? 'EN' : 'AR'}
                </span>
              )}
            </button>

            {!expanded && (
              <span
                role="tooltip"
                className="pointer-events-none opacity-0 -translate-x-[6px] group-hover/lang:opacity-100 group-hover/lang:translate-x-0 group-focus-within/lang:opacity-100 group-focus-within/lang:translate-x-0 transition-all duration-150 absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 ut-glass-tooltip text-[0.82rem] font-bold px-[12px] py-[6px] rounded-[10px] whitespace-nowrap z-[70]"
              >
                {localeTooltip}
              </span>
            )}
          </div>

          <div className="relative group/login">
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              aria-label={locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              title={!expanded ? (locale === 'ar' ? 'تسجيل الدخول' : 'Sign In') : undefined}
              className={`w-full h-[38px] flex items-center rounded-[12px] border border-[#DCE7ED] bg-white/75 text-[#142D4E] font-bold text-[0.85rem] hover:border-[#176B87] hover:text-[#176B87] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#176B87] transition-all duration-200 cursor-pointer ${
                expanded ? 'px-[12px] gap-[9px] justify-center' : 'justify-center px-0'
              }`}
            >
              <LogIn className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
              {expanded && (
                <span className="whitespace-nowrap">
                  {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </span>
              )}
            </button>

            {!expanded && (
              <span
                role="tooltip"
                className="pointer-events-none opacity-0 -translate-x-[6px] group-hover/login:opacity-100 group-hover/login:translate-x-0 group-focus-within/login:opacity-100 group-focus-within/login:translate-x-0 transition-all duration-150 absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 ut-glass-tooltip text-[0.82rem] font-bold px-[12px] py-[6px] rounded-[10px] whitespace-nowrap z-[70]"
              >
                {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </span>
            )}
          </div>

          <div className="relative group/reg">
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              aria-label={locale === 'ar' ? 'سجّل الآن' : 'Register Now'}
              title={!expanded ? (locale === 'ar' ? 'سجّل الآن' : 'Register Now') : undefined}
              className={`w-full h-[40px] flex items-center rounded-[12px] bg-[#176B87] text-white font-bold text-[0.86rem] shadow-[0_6px_18px_rgba(23,107,135,0.28)] hover:bg-[#142D4E] hover:shadow-[0_10px_24px_rgba(20,45,78,0.3)] focus-visible:outline-2 focus-visible:outline-[#28B5C5] transition-all duration-200 cursor-pointer ${
                expanded ? 'px-[14px] gap-[9px] justify-center' : 'justify-center px-0'
              }`}
            >
              <UserPlus className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
              {expanded && (
                <span className="whitespace-nowrap">
                  {locale === 'ar' ? 'سجّل الآن' : 'Register Now'}
                </span>
              )}
            </button>

            {!expanded && (
              <span
                role="tooltip"
                className="pointer-events-none opacity-0 -translate-x-[6px] group-hover/reg:opacity-100 group-hover/reg:translate-x-0 group-focus-within/reg:opacity-100 group-focus-within/reg:translate-x-0 transition-all duration-150 absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 ut-glass-tooltip text-[0.82rem] font-bold px-[12px] py-[6px] rounded-[10px] whitespace-nowrap z-[70]"
              >
                {locale === 'ar' ? 'سجّل الآن' : 'Register Now'}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile & Tablet Floating Glass Menu Trigger (Cleanly positioned below Floating Header) */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-expanded={drawerOpen}
        aria-controls="mobileGlassDrawer"
        aria-label={locale === 'ar' ? 'فتح القائمة الرئيسية' : 'Open main navigation menu'}
        className="min-[1024px]:hidden fixed min-[768px]:top-[106px] max-[767px]:top-[150px] right-[40px] max-[767px]:right-[12px] z-[60] h-[40px] px-[14px] rounded-[13px] ut-glass-sidebar text-[#142D4E] inline-flex items-center gap-[8px] hover:border-[#28B5C5] hover:text-[#176B87] focus-visible:outline-2 focus-visible:outline-[#176B87] transition-all duration-200 cursor-pointer"
      >
        <Menu className="w-[18px] h-[18px] flex-none" aria-hidden="true" />
        <span className="font-bold text-[0.84rem]">
          {locale === 'ar' ? 'القائمة' : 'Menu'}
        </span>
      </button>

      {/* Mobile & Tablet Glass Backdrop + Right-Side Drawer */}
      <div
        className={`min-[1024px]:hidden fixed inset-0 z-[95] transition-opacity duration-250 ${
          drawerOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-[#0E223D]/45 backdrop-blur-[3px]"
        />

        <aside
          id="mobileGlassDrawer"
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'ar' ? 'القائمة الجانبية' : 'Mobile Navigation'}
          className={`fixed top-[12px] bottom-[12px] right-[12px] w-[min(300px,calc(100vw-24px))] rounded-[24px] p-[16px] ut-glass-sidebar-drawer flex flex-col transition-transform duration-300 ease-out ${
            drawerOpen ? 'translate-x-0' : 'translate-x-[calc(100%+28px)]'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between gap-[10px] pb-[14px] mb-[12px] border-b border-[#DCE7ED]">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              aria-label={
                locale === 'ar'
                  ? 'معهد البحوث والاستشارات — جامعة تبوك'
                  : 'Research and Consulting Institute — University of Tabuk'
              }
              className="min-w-0 cursor-pointer rounded-[10px] focus-visible:outline-2 focus-visible:outline-[#176B87]"
            >
              <img
                src="/assets/ut/logo-t.png"
                alt={
                  locale === 'ar'
                    ? 'معهد البحوث والاستشارات — جامعة تبوك'
                    : 'Research and Consulting Institute — University of Tabuk'
                }
                className="h-[42px] w-auto object-contain block"
              />
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
              className="w-[38px] h-[38px] rounded-[12px] border border-[#DCE7ED] bg-white text-[#142D4E] grid place-items-center hover:border-[#28B5C5] hover:text-[#176B87] focus-visible:outline-2 focus-visible:outline-[#176B87] cursor-pointer transition-colors flex-none"
            >
              <X className="w-[19px] h-[19px]" aria-hidden="true" />
            </button>
          </div>

          {/* Drawer Nav Links */}
          <nav
            aria-label={locale === 'ar' ? 'التنقل في الجوال' : 'Mobile Navigation Links'}
            className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-[6px]"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`relative w-full min-h-[44px] px-[14px] flex items-center gap-[12px] rounded-[14px] font-bold text-[0.94rem] cursor-pointer transition-all duration-200 text-start ${
                    isCurrent
                      ? 'bg-[#DDF3F5] text-[#142D4E] shadow-[inset_0_0_0_1px_rgba(40,181,197,0.38)]'
                      : 'text-[#142D4E] hover:bg-[#EAF3F6] hover:text-[#176B87]'
                  }`}
                >
                  {isCurrent && (
                    <span
                      aria-hidden="true"
                      className="w-[3.5px] h-[22px] rounded-full bg-[#28B5C5] flex-none absolute right-[4px] top-1/2 -translate-y-1/2"
                    />
                  )}
                  <Icon
                    className={`w-[20px] h-[20px] flex-none ${
                      isCurrent ? 'text-[#28B5C5]' : 'text-[#142D4E]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{locale === 'ar' ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}

            <div className="my-[6px] border-t border-[#DCE7ED]/80" aria-hidden="true" />

            {secondaryPortalItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePortalClick(item.id)}
                  className="w-full min-h-[42px] px-[14px] flex items-center gap-[12px] rounded-[13px] font-bold text-[0.88rem] text-[#142D4E]/90 hover:text-[#176B87] hover:bg-[#EAF3F6] cursor-pointer transition-colors text-start"
                >
                  <Icon className="w-[18px] h-[18px] flex-none text-[#176B87]" aria-hidden="true" />
                  <span>{locale === 'ar' ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Drawer Bottom Actions: Language Switch + Login + Register */}
          <div className="flex-none pt-[12px] mt-[12px] border-t border-[#DCE7ED] flex flex-col gap-[8px]">
            <button
              type="button"
              onClick={onToggleLocale}
              aria-label={localeTooltip}
              className="w-full min-h-[40px] px-[14px] rounded-[12px] border border-[#28B5C5]/45 bg-white text-[#142D4E] font-bold text-[0.86rem] hover:border-[#176B87] hover:bg-[#DDF3F5]/60 inline-flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="inline-flex items-center gap-[8px]">
                <Globe className="w-[17px] h-[17px] text-[#176B87]" aria-hidden="true" />
                <span>{locale === 'ar' ? 'اللغة' : 'Language'}</span>
              </span>
              <span className="text-[0.8rem] font-extrabold text-[#176B87]">
                {locale === 'ar' ? 'EN' : 'AR'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                onOpenAuth('login');
              }}
              className="w-full min-h-[42px] rounded-[13px] font-bold text-[0.92rem] border border-[#DCE7ED] text-[#142D4E] bg-white hover:border-[#176B87] hover:text-[#176B87] inline-flex items-center justify-center gap-[8px] cursor-pointer transition-colors"
            >
              <LogIn className="w-[18px] h-[18px]" aria-hidden="true" />
              <span>{locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                onOpenAuth('register');
              }}
              className="w-full min-h-[44px] rounded-[13px] font-bold text-[0.92rem] bg-[#176B87] text-white shadow-[0_6px_18px_rgba(23,107,135,0.28)] hover:bg-[#142D4E] inline-flex items-center justify-center gap-[8px] cursor-pointer transition-colors"
            >
              <UserPlus className="w-[18px] h-[18px]" aria-hidden="true" />
              <span>{locale === 'ar' ? 'سجّل الآن' : 'Register Now'}</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
