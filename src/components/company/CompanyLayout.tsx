import { useEffect, useState, type ReactNode } from 'react';
import {
  Building2,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShoppingCart,
  Sun,
  Users,
  X,
} from 'lucide-react';
import type { Locale } from '../../types/program';
import type { Theme } from '../../utils/theme';
import { BrandLogo } from '../common/BrandLogo';

export type CompanySectionId = 'overview' | 'students' | 'purchases';

interface CompanyLayoutProps {
  locale: Locale;
  theme: Theme;
  companyName: string;
  activeSection: CompanySectionId;
  onSectionChange: (section: CompanySectionId) => void;
  onBackToSite: () => void;
  onToggleLocale: () => void;
  onToggleTheme: () => void;
  onSignOut: () => void;
  children: ReactNode;
}

const NAV_ITEMS: Array<{
  id: CompanySectionId;
  icon: typeof LayoutDashboard;
  labelAr: string;
  labelEn: string;
}> = [
  { id: 'overview', icon: LayoutDashboard, labelAr: 'نظرة عامة', labelEn: 'Overview' },
  { id: 'students', icon: Users, labelAr: 'طلاب الشركة', labelEn: 'Company Students' },
  {
    id: 'purchases',
    icon: ShoppingCart,
    labelAr: 'سجل شراء الكورسات',
    labelEn: 'Course Purchase History',
  },
];

/**
 * Dedicated company dashboard shell — mirrors the admin dashboard's layout,
 * spacing, and Deep Navy / Cyan identity while exposing only company-scoped
 * navigation (no admin sections are reachable from here).
 */
export function CompanyLayout({
  locale,
  theme,
  companyName,
  activeSection,
  onSectionChange,
  onBackToSite,
  onToggleLocale,
  onToggleTheme,
  onSignOut,
  children,
}: CompanyLayoutProps) {
  const isAr = locale === 'ar';
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const navButtonClass = (isActive: boolean) =>
    `flex w-full items-center gap-[12px] rounded-[12px] px-[12px] py-[10px] text-[0.88rem] font-bold transition-colors cursor-pointer ${
      isActive
        ? 'bg-[#176B87] text-white shadow-[0_6px_18px_rgba(23,107,135,0.35)] dark:bg-[#28B5C5] dark:text-[#0B1726]'
        : 'text-[#64748B] hover:bg-[#EAF3F6] hover:text-[#142D4E] dark:text-[#B8C7D9] dark:hover:bg-[#102238] dark:hover:text-[#F1F5F9]'
    }`;

  const navList = (isDrawer: boolean) => (
    <nav className="space-y-[6px]" aria-label={isAr ? 'قائمة الشركة' : 'Company navigation'}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onSectionChange(item.id);
              if (isDrawer) setDrawerOpen(false);
            }}
            aria-current={isActive ? 'page' : undefined}
            title={isAr ? item.labelAr : item.labelEn}
            className={`${navButtonClass(isActive)} ${!isDrawer && collapsed ? 'justify-center px-0' : ''}`}
          >
            <Icon className="h-[18px] w-[18px] flex-none" aria-hidden="true" />
            {(!isDrawer && collapsed) || (
              <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
            )}
          </button>
        );
      })}
    </nav>
  );

  const headerActions = (
    <>
      <button
        type="button"
        onClick={onToggleLocale}
        title={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
        className="grid h-[38px] w-[38px] place-items-center rounded-[10px] border border-[#DCE7ED] bg-white text-[0.78rem] font-extrabold text-[#64748B] hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/15 dark:bg-[#102238] dark:text-[#B8C7D9] cursor-pointer"
      >
        {isAr ? 'EN' : 'ع'}
      </button>
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={isAr ? 'تبديل المظهر' : 'Toggle theme'}
        title={isAr ? 'تبديل المظهر' : 'Toggle theme'}
        className="grid h-[38px] w-[38px] place-items-center rounded-[10px] border border-[#DCE7ED] bg-white text-[#64748B] hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/15 dark:bg-[#102238] dark:text-[#B8C7D9] cursor-pointer"
      >
        {theme === 'light' ? (
          <Moon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Sun className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        onClick={onBackToSite}
        className="inline-flex h-[38px] items-center gap-2 rounded-[10px] border border-[#DCE7ED] bg-white px-3 text-[0.8rem] font-bold text-[#64748B] hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/15 dark:bg-[#102238] dark:text-[#B8C7D9] cursor-pointer"
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{isAr ? 'العودة للموقع' : 'Back to Site'}</span>
      </button>
      <button
        type="button"
        onClick={onSignOut}
        className="inline-flex h-[38px] items-center gap-2 rounded-[10px] border border-[#DCE7ED] bg-white px-3 text-[0.8rem] font-bold text-[#64748B] hover:border-[#C0392B]/40 hover:text-[#C0392B] dark:border-white/15 dark:bg-[#102238] dark:text-[#B8C7D9] cursor-pointer"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{isAr ? 'خروج' : 'Sign Out'}</span>
      </button>
    </>
  );

  return (
    <div data-company-root className="min-h-screen bg-[#F4F8FA] dark:bg-[#0B1726]">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 start-0 z-40 hidden flex-col border-e border-[#DCE7ED] bg-white transition-[width] duration-200 lg:flex dark:border-white/12 dark:bg-[#0E223D] ${
          collapsed ? 'w-[78px]' : 'w-[258px]'
        }`}
      >
        <div className={`flex flex-none items-center px-4 py-4 ${collapsed ? 'justify-center' : ''}`}>
          <BrandLogo locale={locale} variant={collapsed ? 'compact' : 'full'} size="sm" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">{navList(false)}</div>

        <div className="flex-none space-y-2 border-t border-[#DCE7ED] p-3 dark:border-white/12">
          <span
            className={`inline-flex items-center rounded-[8px] bg-[#DDF3F5] px-2.5 py-1 text-[0.7rem] font-bold text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5] ${
              collapsed ? 'mx-auto' : ''
            }`}
          >
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            {!collapsed && <span className="ms-1.5">{isAr ? 'حساب شركة' : 'Company Account'}</span>}
          </span>
          {!collapsed && (
            <p className="truncate px-1 text-[0.74rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
              {companyName}
            </p>
          )}
          <button
            type="button"
            onClick={onSignOut}
            className={`${navButtonClass(false)} ${collapsed ? 'justify-center px-0' : ''}`}
          >
            <LogOut className="h-[18px] w-[18px] flex-none" aria-hidden="true" />
            {!collapsed && <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex w-full items-center justify-center gap-1 rounded-[10px] py-2 text-[0.74rem] font-bold text-[#94A3B8] hover:text-[#176B87] dark:hover:text-[#28B5C5] cursor-pointer"
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            ) : (
              <ChevronsLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            )}
            {!collapsed && <span>{isAr ? 'تصغير القائمة' : 'Collapse'}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden ${drawerOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-[#0E223D]/55 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute inset-y-0 start-0 flex w-[262px] flex-col border-e border-[#DCE7ED] bg-white p-3 transition-transform dark:border-white/12 dark:bg-[#0E223D] ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-1 pb-2">
            <BrandLogo locale={locale} variant="full" size="sm" />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
              className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#DCE7ED] text-[#64748B] dark:border-white/15 dark:text-[#B8C7D9] cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto py-2">{navList(true)}</div>
          <div className="flex-none space-y-2 border-t border-[#DCE7ED] pt-3 dark:border-white/12">
            <p className="truncate px-1 text-[0.74rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">
              {companyName}
            </p>
            <button
              type="button"
              onClick={onSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#DCE7ED] py-2.5 text-[0.86rem] font-bold text-[#64748B] dark:border-white/15 dark:text-[#B8C7D9] cursor-pointer"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {isAr ? 'تسجيل الخروج' : 'Sign Out'}
            </button>
          </div>
        </aside>
      </div>

      {/* Top bar + content */}
      <div className="flex min-h-screen flex-col lg:ps-[258px]">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#DCE7ED] bg-white/90 px-4 py-3 backdrop-blur dark:border-white/12 dark:bg-[#0E223D]/90">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={isAr ? 'فتح القائمة' : 'Open menu'}
              className="grid h-[38px] w-[38px] flex-none place-items-center rounded-[10px] border border-[#DCE7ED] text-[#64748B] lg:hidden dark:border-white/15 dark:text-[#B8C7D9] cursor-pointer"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <div className="truncate text-[0.92rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                {isAr ? 'لوحة الشركة' : 'Company Dashboard'}
              </div>
              <div className="truncate text-[0.72rem] text-[#64748B] dark:text-[#B8C7D9]">
                {companyName}
              </div>
            </div>
          </div>
          <div className="flex flex-none items-center gap-2">{headerActions}</div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
