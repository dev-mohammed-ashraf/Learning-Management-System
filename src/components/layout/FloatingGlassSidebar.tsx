import { useEffect, useState } from 'react';
import {
  BookOpen,
  Brain,
  ChartNoAxesColumn,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Folder,
  GraduationCap,
  Home,
  LogIn,
  LogOut,
  Map,
  Menu,
  Target,
  UserPlus,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import type { Locale, ProgramKind } from '../../types/program';
import type { NavSection, StudentAccount } from '../../types/student';
import type { Theme } from '../../utils/theme';
import { BrandLogo } from '../common/BrandLogo';

export type { NavSection };
export type PortalInfoSection = 'lms' | 'entities' | 'support';

interface SidebarNavItem {
  id: NavSection;
  labelAr: string;
  labelEn: string;
  icon: typeof Home;
}

interface SidebarGroup {
  id: string;
  groupLabelAr: string;
  groupLabelEn: string;
  items: SidebarNavItem[];
}

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    id: 'main',
    groupLabelAr: 'التنقل الرئيسي',
    groupLabelEn: 'Main Navigation',
    items: [
      { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: Home },
      { id: 'library', labelAr: 'مكتبتي التعليمية', labelEn: 'My Library', icon: BookOpen },
      { id: 'diplomas', labelAr: 'الدورات', labelEn: 'Courses', icon: GraduationCap },
      { id: 'paths', labelAr: 'المسارات التعليمية', labelEn: 'Learning Paths', icon: Map },
    ],
  },
  {
    id: 'learning',
    groupLabelAr: 'التعلم والتقدم',
    groupLabelEn: 'Learning & Progress',
    items: [
      { id: 'goals', labelAr: 'أهدافي', labelEn: 'My Goals', icon: Target },
      { id: 'assessments', labelAr: 'الاختبارات', labelEn: 'Assessments', icon: ClipboardCheck },
      { id: 'projects', labelAr: 'المشاريع', labelEn: 'Projects', icon: Folder },
    ],
  },
  {
    id: 'community',
    groupLabelAr: 'المجتمع',
    groupLabelEn: 'Community',
    items: [
      { id: 'groups', labelAr: 'مجموعات الدراسة', labelEn: 'Study Groups', icon: Users },
    ],
  },
  {
    id: 'tools',
    groupLabelAr: 'أدوات التعلم',
    groupLabelEn: 'Learning Tools',
    items: [
      { id: 'ai-tools', labelAr: 'أدوات الذكاء الاصطناعي', labelEn: 'AI Tools', icon: Brain },
      { id: 'dashboard', labelAr: 'لوحة الإنجاز', labelEn: 'Dashboard', icon: ChartNoAxesColumn },
      { id: 'profile', labelAr: 'الملف الشخصي', labelEn: 'Profile', icon: UserRound },
    ],
  },
];

interface FloatingGlassSidebarProps {
  locale: Locale;
  theme?: Theme;
  activeNav: NavSection;
  account?: StudentAccount;
  onSelectNav: (nav: NavSection) => void;
  onSelectKind: (kind: ProgramKind) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSignOut?: () => void;
}

export function FloatingGlassSidebar({
  locale,
  theme = 'light',
  activeNav,
  account,
  onSelectNav,
  onSelectKind,
  onOpenAuth,
  onSignOut,
}: FloatingGlassSidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const isNavItemActive = (itemId: NavSection): boolean => {
    if (itemId === 'diplomas') {
      return activeNav === 'diplomas' || activeNav === 'fellowships';
    }
    return activeNav === itemId;
  };

  return (
    <>
      {/* Desktop Floating Vertical Glass Sidebar (Fixed Left, Centered Vertically) */}
      <aside
        aria-label={locale === 'ar' ? 'القائمة الرئيسية الجانبية' : 'Primary Floating Sidebar'}
        data-expanded={expanded ? 'true' : 'false'}
        className={`hidden min-[1024px]:flex flex-col fixed left-[20px] top-1/2 -translate-y-1/2 z-[60] max-h-[88vh] rounded-[24px] p-[12px] ut-glass-sidebar transition-[width] duration-300 ease-out ${
          expanded ? 'w-[264px]' : 'w-[86px]'
        }`}
      >
        {/* Expand / Collapse Dedicated Toggle Button */}
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
          className="absolute -right-[13px] top-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-white border border-[#DCE7ED] text-[#142D4E] shadow-[0_4px_14px_rgba(20,45,78,0.14)] grid place-items-center hover:border-[#28B5C5] hover:text-[#176B87] hover:bg-[#DDF3F5] dark:bg-[#142D4E] dark:border-white/15 dark:text-[#F1F5F9] dark:hover:border-[#28B5C5] dark:hover:text-[#28B5C5] dark:hover:bg-[#1B3553] focus-visible:outline-2 focus-visible:outline-[#176B87] transition-all duration-200 cursor-pointer z-[2]"
        >
          {expanded ? (
            <ChevronLeft className="w-[15px] h-[15px]" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-[15px] h-[15px]" aria-hidden="true" />
          )}
        </button>

        {/* A. Brand Area */}
        <div className="flex-none pb-[8px] mb-[6px] border-b border-[#DCE7ED]/80 dark:border-white/12 flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            aria-label={
              locale === 'ar'
                ? 'العودة إلى الرئيسية — منصة مدار للتعلّم الرقمي'
                : 'Home — Madar Digital Learning Platform'
            }
            className="w-full flex items-center justify-center cursor-pointer rounded-[14px] p-[4px] hover:bg-[#DDF3F5]/45 dark:hover:bg-[#1B3553]/70 focus-visible:outline-2 focus-visible:outline-[#176B87] transition-colors"
          >
            {expanded ? (
              <BrandLogo
                locale={locale}
                variant="full"
                surface={theme === 'dark' ? 'dark' : 'light'}
                size="sm"
                className="mx-auto"
              />
            ) : (
              <span className="w-[40px] h-[40px] rounded-[12px] overflow-hidden bg-white/95 border border-[#DCE7ED]/85 dark:bg-[#1B3553]/85 dark:border-white/18 grid place-items-center flex-none shadow-[0_4px_12px_rgba(20,45,78,0.06)]">
                <BrandLogo
                  locale={locale}
                  variant="compact"
                  surface={theme === 'dark' ? 'dark' : 'light'}
                />
              </span>
            )}
          </button>
        </div>

        {/* B. 4 Grouped Student Navigation Sections (11 items) */}
        <nav
          aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main Navigation'}
          className="flex-1 min-h-0 flex flex-col gap-[2px] py-[2px] overflow-y-auto [&::-webkit-scrollbar]:hidden"
        >
          {SIDEBAR_GROUPS.map((group, groupIndex) => (
            <div key={group.id} className="flex flex-col gap-[2px]">
              {groupIndex > 0 && (
                <div
                  className="my-[4px] border-t border-[#DCE7ED]/80 dark:border-white/12"
                  aria-hidden="true"
                />
              )}

              {expanded && (
                <div className="px-[10px] pt-[2px] pb-[2px] text-[0.68rem] font-bold tracking-wide text-[#64748B] dark:text-[#94A3B8]">
                  {locale === 'ar' ? group.groupLabelAr : group.groupLabelEn}
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isCurrent = isNavItemActive(item.id);
                const label = locale === 'ar' ? item.labelAr : item.labelEn;

                return (
                  <div key={item.id} className="relative group/nav">
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      aria-current={isCurrent ? 'page' : undefined}
                      aria-label={label}
                      title={!expanded ? label : undefined}
                      className={`relative w-full h-[36px] flex items-center rounded-[12px] cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#176B87] ${
                        expanded ? 'px-[12px] gap-[10px] justify-start' : 'justify-center px-0'
                      } ${
                        isCurrent
                          ? 'bg-[#DDF3F5] text-[#142D4E] shadow-[inset_0_0_0_1px_rgba(40,181,197,0.38)] dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:shadow-[inset_0_0_0_1px_rgba(40,181,197,0.45)]'
                          : 'text-[#142D4E] hover:bg-[#EAF3F6]/90 hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#142D4E]/80 dark:hover:text-[#F1F5F9]'
                      }`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] flex-none transition-colors duration-200 ${
                          isCurrent
                            ? 'text-[#28B5C5]'
                            : 'text-[#142D4E] group-hover/nav:text-[#176B87] dark:text-[#B8C7D9] dark:group-hover/nav:text-[#28B5C5]'
                        }`}
                        aria-hidden="true"
                      />

                      {expanded && (
                        <span className="font-bold text-[0.84rem] whitespace-nowrap truncate leading-none">
                          {label}
                        </span>
                      )}
                    </button>

                    {!expanded && (
                      <span
                        role="tooltip"
                        className="pointer-events-none opacity-0 -translate-x-[6px] group-hover/nav:opacity-100 group-hover/nav:translate-x-0 group-focus-within/nav:opacity-100 group-focus-within/nav:translate-x-0 transition-all duration-150 absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 ut-glass-tooltip text-[0.8rem] font-bold px-[12px] py-[6px] rounded-[10px] whitespace-nowrap z-[70]"
                      >
                        {label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* C. Bottom Actions: Login + Register (or Signed-In Profile/Sign Out) */}
        <div className="flex-none pt-[10px] mt-[6px] border-t border-[#DCE7ED]/80 dark:border-white/12 flex flex-col gap-[6px]">
          {account?.signedIn ? (
            <>
              <div className="relative group/account">
                <button
                  type="button"
                  onClick={() => handleNavClick('profile')}
                  aria-label={account.fullName || (locale === 'ar' ? 'حساب الطالب' : 'Student Account')}
                  title={
                    !expanded
                      ? account.fullName || (locale === 'ar' ? 'حساب الطالب' : 'Student Account')
                      : undefined
                  }
                  className={`w-full h-[36px] flex items-center rounded-[12px] border border-[#28B5C5]/35 bg-[#DDF3F5]/65 text-[#142D4E] font-bold text-[0.82rem] hover:bg-[#DDF3F5] dark:bg-[#1B3553] dark:border-[#28B5C5]/35 dark:text-[#F1F5F9] transition-all duration-200 cursor-pointer ${
                    expanded ? 'px-[12px] gap-[8px] justify-start' : 'justify-center px-0'
                  }`}
                >
                  <UserRound className="w-[16px] h-[16px] text-[#176B87] dark:text-[#28B5C5] flex-none" aria-hidden="true" />
                  {expanded && (
                    <span className="truncate">
                      {account.fullName || account.email || (locale === 'ar' ? 'حسابي' : 'My Account')}
                    </span>
                  )}
                </button>
              </div>

              {onSignOut && (
                <div className="relative group/logout">
                  <button
                    type="button"
                    onClick={onSignOut}
                    aria-label={locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                    title={!expanded ? (locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out') : undefined}
                    className={`w-full h-[34px] flex items-center rounded-[12px] border border-[#DCE7ED] bg-white/75 text-[#64748B] font-bold text-[0.8rem] hover:border-[#C0392B]/40 hover:text-[#C0392B] dark:bg-[#142D4E]/80 dark:border-white/15 dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5] transition-all duration-200 cursor-pointer ${
                      expanded ? 'px-[12px] gap-[8px] justify-center' : 'justify-center px-0'
                    }`}
                  >
                    <LogOut className="w-[15px] h-[15px] flex-none" aria-hidden="true" />
                    {expanded && (
                      <span className="whitespace-nowrap">
                        {locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="relative group/login">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  aria-label={locale === 'ar' ? 'دخول الطلاب' : 'Student Sign In'}
                  title={!expanded ? (locale === 'ar' ? 'دخول الطلاب' : 'Student Sign In') : undefined}
                  className={`w-full h-[36px] flex items-center rounded-[12px] border border-[#DCE7ED] bg-white/75 text-[#142D4E] font-bold text-[0.84rem] hover:border-[#176B87] hover:text-[#176B87] hover:bg-white dark:bg-[#142D4E]/80 dark:border-white/15 dark:text-[#F1F5F9] dark:hover:border-[#28B5C5] dark:hover:text-[#28B5C5] dark:hover:bg-[#1B3553] focus-visible:outline-2 focus-visible:outline-[#176B87] transition-all duration-200 cursor-pointer ${
                    expanded ? 'px-[12px] gap-[9px] justify-center' : 'justify-center px-0'
                  }`}
                >
                  <LogIn className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
                  {expanded && (
                    <span className="whitespace-nowrap">
                      {locale === 'ar' ? 'دخول الطلاب' : 'Student Sign In'}
                    </span>
                  )}
                </button>

                {!expanded && (
                  <span
                    role="tooltip"
                    className="pointer-events-none opacity-0 -translate-x-[6px] group-hover/login:opacity-100 group-hover/login:translate-x-0 group-focus-within/login:opacity-100 group-focus-within/login:translate-x-0 transition-all duration-150 absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 ut-glass-tooltip text-[0.8rem] font-bold px-[12px] py-[6px] rounded-[10px] whitespace-nowrap z-[70]"
                  >
                    {locale === 'ar' ? 'دخول الطلاب' : 'Student Sign In'}
                  </span>
                )}
              </div>

              <div className="relative group/reg">
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  aria-label={locale === 'ar' ? 'ابدأ التعلم' : 'Enroll Now'}
                  title={!expanded ? (locale === 'ar' ? 'ابدأ التعلم' : 'Enroll Now') : undefined}
                  className={`w-full h-[38px] flex items-center rounded-[12px] bg-[#176B87] text-white font-bold text-[0.84rem] shadow-[0_6px_18px_rgba(23,107,135,0.28)] hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] focus-visible:outline-2 focus-visible:outline-[#28B5C5] transition-all duration-200 cursor-pointer ${
                    expanded ? 'px-[14px] gap-[9px] justify-center' : 'justify-center px-0'
                  }`}
                >
                  <UserPlus className="w-[16px] h-[16px] flex-none" aria-hidden="true" />
                  {expanded && (
                    <span className="whitespace-nowrap">
                      {locale === 'ar' ? 'ابدأ التعلم' : 'Enroll Now'}
                    </span>
                  )}
                </button>

                {!expanded && (
                  <span
                    role="tooltip"
                    className="pointer-events-none opacity-0 -translate-x-[6px] group-hover/reg:opacity-100 group-hover/reg:translate-x-0 group-focus-within/reg:opacity-100 group-focus-within/reg:translate-x-0 transition-all duration-150 absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 ut-glass-tooltip text-[0.8rem] font-bold px-[12px] py-[6px] rounded-[10px] whitespace-nowrap z-[70]"
                  >
                    {locale === 'ar' ? 'ابدأ التعلم' : 'Enroll Now'}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Mobile & Tablet Floating Glass Menu Trigger */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-expanded={drawerOpen}
        aria-controls="mobileGlassDrawer"
        aria-label={locale === 'ar' ? 'فتح القائمة الرئيسية' : 'Open main navigation menu'}
        className="min-[1024px]:hidden fixed min-[768px]:top-[106px] max-[767px]:top-[150px] right-[40px] max-[767px]:right-[12px] z-[60] h-[40px] px-[14px] rounded-[13px] ut-glass-sidebar text-[#142D4E] dark:text-[#F1F5F9] inline-flex items-center gap-[8px] hover:border-[#28B5C5] hover:text-[#176B87] dark:hover:text-[#28B5C5] focus-visible:outline-2 focus-visible:outline-[#176B87] transition-all duration-200 cursor-pointer"
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
          className={`fixed top-[12px] bottom-[12px] right-[12px] w-[min(310px,calc(100vw-24px))] rounded-[24px] p-[16px] ut-glass-sidebar-drawer flex flex-col transition-transform duration-300 ease-out ${
            drawerOpen ? 'translate-x-0' : 'translate-x-[calc(100%+28px)]'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between gap-[10px] pb-[12px] mb-[10px] border-b border-[#DCE7ED] dark:border-white/12">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              aria-label={
                locale === 'ar'
                  ? 'مدار — منصة التعلّم الرقمي'
                  : 'Madar — Digital Learning Platform'
              }
              className="min-w-0 cursor-pointer rounded-[10px] py-[2px] focus-visible:outline-2 focus-visible:outline-[#176B87]"
            >
              <BrandLogo
                locale={locale}
                variant="full"
                surface={theme === 'dark' ? 'dark' : 'light'}
                size="sm"
              />
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
              className="w-[38px] h-[38px] rounded-[12px] border border-[#DCE7ED] bg-white text-[#142D4E] dark:border-white/15 dark:bg-[#142D4E] dark:text-[#F1F5F9] grid place-items-center hover:border-[#28B5C5] hover:text-[#176B87] dark:hover:text-[#28B5C5] focus-visible:outline-2 focus-visible:outline-[#176B87] cursor-pointer transition-colors flex-none"
            >
              <X className="w-[19px] h-[19px]" aria-hidden="true" />
            </button>
          </div>

          {/* Drawer Nav Links (Grouped identically to Desktop Sidebar) */}
          <nav
            aria-label={locale === 'ar' ? 'التنقل في الجوال' : 'Mobile Navigation Links'}
            className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-[2px]"
          >
            {SIDEBAR_GROUPS.map((group, groupIndex) => (
              <div key={group.id} className="flex flex-col gap-[2px]">
                {groupIndex > 0 && (
                  <div
                    className="my-[4px] border-t border-[#DCE7ED]/80 dark:border-white/12"
                    aria-hidden="true"
                  />
                )}
                <div className="px-[12px] py-[1px] text-[0.7rem] font-bold text-[#64748B] dark:text-[#94A3B8]">
                  {locale === 'ar' ? group.groupLabelAr : group.groupLabelEn}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = isNavItemActive(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`relative w-full min-h-[34px] py-[5px] px-[12px] flex items-center gap-[10px] rounded-[12px] font-bold text-[0.86rem] cursor-pointer transition-all duration-200 text-start ${
                        isCurrent
                          ? 'bg-[#DDF3F5] text-[#142D4E] shadow-[inset_0_0_0_1px_rgba(40,181,197,0.38)] dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:shadow-[inset_0_0_0_1px_rgba(40,181,197,0.45)]'
                          : 'text-[#142D4E] hover:bg-[#EAF3F6] hover:text-[#176B87] dark:text-[#B8C7D9] dark:hover:bg-[#142D4E] dark:hover:text-[#F1F5F9]'
                      }`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] flex-none ${
                          isCurrent ? 'text-[#28B5C5]' : 'text-[#142D4E] dark:text-[#B8C7D9]'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{locale === 'ar' ? item.labelAr : item.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Drawer Bottom Actions */}
          <div className="flex-none pt-[12px] mt-[10px] border-t border-[#DCE7ED] dark:border-white/12 flex flex-col gap-[8px]">
            {account?.signedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile')}
                  className="w-full min-h-[42px] rounded-[13px] font-bold text-[0.9rem] border border-[#28B5C5]/40 text-[#142D4E] bg-[#DDF3F5]/60 dark:bg-[#1B3553] dark:text-[#F1F5F9] inline-flex items-center justify-center gap-[8px] cursor-pointer"
                >
                  <UserRound className="w-[17px] h-[17px] text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                  <span className="truncate px-2">
                    {account.fullName || account.email || (locale === 'ar' ? 'الملف الشخصي' : 'Profile')}
                  </span>
                </button>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      onSignOut();
                    }}
                    className="w-full min-h-[40px] rounded-[13px] font-bold text-[0.86rem] border border-[#DCE7ED] text-[#64748B] bg-white dark:bg-[#142D4E] dark:border-white/15 dark:text-[#B8C7D9] inline-flex items-center justify-center gap-[8px] cursor-pointer"
                  >
                    <LogOut className="w-[16px] h-[16px]" aria-hidden="true" />
                    <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full min-h-[42px] rounded-[13px] font-bold text-[0.92rem] border border-[#DCE7ED] text-[#142D4E] bg-white hover:border-[#176B87] hover:text-[#176B87] dark:bg-[#142D4E] dark:border-white/15 dark:text-[#F1F5F9] dark:hover:border-[#28B5C5] dark:hover:text-[#28B5C5] inline-flex items-center justify-center gap-[8px] cursor-pointer transition-colors"
                >
                  <LogIn className="w-[18px] h-[18px]" aria-hidden="true" />
                  <span>{locale === 'ar' ? 'دخول الطلاب' : 'Student Sign In'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenAuth('register');
                  }}
                  className="w-full min-h-[44px] rounded-[13px] font-bold text-[0.92rem] bg-[#176B87] text-white shadow-[0_6px_18px_rgba(23,107,135,0.28)] hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] inline-flex items-center justify-center gap-[8px] cursor-pointer transition-colors"
                >
                  <UserPlus className="w-[18px] h-[18px]" aria-hidden="true" />
                  <span>{locale === 'ar' ? 'ابدأ التعلم' : 'Enroll Now'}</span>
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
