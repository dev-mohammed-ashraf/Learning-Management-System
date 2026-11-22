import { useEffect, useState, type ReactNode } from 'react';
import {
  BookOpen,
  Building2,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Shapes,
  Sun,
  Users,
  X,
} from 'lucide-react';
import type { AdminSectionId } from '../../types/admin';
import type { Locale } from '../../types/program';
import type { Theme } from '../../utils/theme';
import { BrandLogo } from '../common/BrandLogo';

interface AdminLayoutProps {
  locale: Locale;
  theme: Theme;
  activeSection: AdminSectionId;
  onSectionChange: (section: AdminSectionId) => void;
  onBackToSite: () => void;
  onToggleLocale: () => void;
  onToggleTheme: () => void;
  /** Clears the demo dashboard session and returns to the login page. */
  onLogout: () => void;
  children: ReactNode;
}

const NAV_ITEMS: Array<{
  id: AdminSectionId;
  icon: typeof LayoutDashboard;
  labelAr: string;
  labelEn: string;
}> = [
  { id: 'overview', icon: LayoutDashboard, labelAr: 'نظرة عامة', labelEn: 'Overview' },
  { id: 'courses', icon: BookOpen, labelAr: 'الكورسات', labelEn: 'Courses' },
  { id: 'categories', icon: Shapes, labelAr: 'التصنيفات', labelEn: 'Categories' },
  { id: 'users', icon: Users, labelAr: 'المستخدمون', labelEn: 'Users' },
  { id: 'companies', icon: Building2, labelAr: 'الشركات', labelEn: 'Companies' },
  { id: 'enrollments', icon: GraduationCap, labelAr: 'الاشتراكات', labelEn: 'Enrollments' },
  { id: 'exams', icon: ClipboardList, labelAr: 'الاختبارات', labelEn: 'Exams' },
];

export const ADMIN_SECTION_TITLES: Record<AdminSectionId, { ar: string; en: string }> = {
  overview: { ar: 'نظرة عامة', en: 'Overview' },
  courses: { ar: 'إدارة الكورسات', en: 'Course Management' },
  categories: { ar: 'تصنيفات الكورسات', en: 'Course Categories' },
  users: { ar: 'إدارة المستخدمين', en: 'User Management' },
  companies: { ar: 'إدارة الشركات', en: 'Company Management' },
  enrollments: { ar: 'إدارة الاشتراكات', en: 'Enrollment Management' },
  exams: { ar: 'إدارة الاختبارات', en: 'Exam Management' },
};


export function AdminLayout({
  locale,
  theme,
  activeSection,
  onSectionChange,
  onBackToSite,
  onToggleLocale,
  onToggleTheme,
  onLogout,
  children,
}: AdminLayoutProps) {
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
    <nav className="space-y-[6px]" aria-label={isAr ? 'قائمة الإدارة' : 'Admin navigation'}>
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

  return (
    <div data-admin-root className="min-h-screen bg-[#F4F8FA] dark:bg-[#0B1726]">
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
          <span className="inline-flex items-center rounded-[8px] bg-[#FFF4E0] px-2.5 py-1 text-[0.7rem] font-bold text-[#A05E03] dark:bg-[#33230A] dark:text-[#FCD34D]">
            {collapsed
              ? isAr
                ? 'تجريبي'
                : 'Demo'
              : isAr
                ? 'بيئة تجريبية · بيانات وهمية'
                : 'Demo environment · mock data'}
          </span>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className={`${navButtonClass(false)} ${collapsed ? 'justify-center px-0' : ''}`}
            aria-label={
              isAr ? (collapsed ? 'توسيع القائمة' : 'طي القائمة') : collapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
          >
            {collapsed ? (
              <ChevronsRight className="h-[18px] w-[18px]" aria-hidden="true" />
            ) : (
              <>
                <ChevronsLeft className="h-[18px] w-[18px] flex-none" aria-hidden="true" />
                <span>{isAr ? 'طي القائمة' : 'Collapse'}</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-[#0E223D]/60 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 start-0 flex w-[270px] max-w-[85vw] flex-col bg-white shadow-2xl dark:bg-[#0E223D]">
            <div className="flex items-center justify-between border-b border-[#DCE7ED] px-4 py-3.5 dark:border-white/12">
              <BrandLogo locale={locale} size="sm" />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={isAr ? 'إغلاق' : 'Close'}
                className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#DCE7ED] text-[#183247] dark:border-white/15 dark:text-[#F1F5F9] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">{navList(true)}</div>
          </div>
        </div>
      )}

      {/* Content column */}
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-200 ${
          collapsed ? 'lg:ps-[78px]' : 'lg:ps-[258px]'
        }`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-[#DCE7ED] bg-white/85 backdrop-blur-md dark:border-white/12 dark:bg-[#0E223D]/85">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-7">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={isAr ? 'فتح القائمة' : 'Open menu'}
              className="grid h-10 w-10 flex-none place-items-center rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[#183247] lg:hidden dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9] cursor-pointer"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <h1 className="min-w-0 truncate text-[1.02rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
              {isAr ? ADMIN_SECTION_TITLES[activeSection].ar : ADMIN_SECTION_TITLES[activeSection].en}
            </h1>

            <div className="ms-auto flex flex-none items-center gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={isAr ? 'تبديل الوضع الليلي' : 'Toggle dark mode'}
                className="grid h-10 w-10 place-items-center rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[#176B87] hover:bg-[#DDF3F5] dark:border-white/12 dark:bg-[#102238] dark:text-[#28B5C5] dark:hover:bg-[#1B3553] cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={onToggleLocale}
                className="grid h-10 w-10 place-items-center rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] text-[0.78rem] font-extrabold text-[#176B87] hover:bg-[#DDF3F5] dark:border-white/12 dark:bg-[#102238] dark:text-[#28B5C5] dark:hover:bg-[#1B3553] cursor-pointer"
                aria-label={isAr ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
              >
                {isAr ? 'EN' : 'ع'}
              </button>
              <button
                type="button"
                onClick={onBackToSite}
                className="inline-flex items-center gap-[7px] rounded-[10px] bg-[#176B87] px-[14px] py-[10px] text-[0.8rem] font-bold text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{isAr ? 'عرض الموقع' : 'View Site'}</span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                title={isAr ? 'تسجيل الخروج' : 'Sign out'}
                className="inline-flex items-center gap-[7px] rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-[14px] py-[10px] text-[0.8rem] font-bold text-[#64748B] hover:border-[#C0392B]/40 hover:text-[#C0392B] dark:border-white/12 dark:bg-[#102238] dark:text-[#B8C7D9] dark:hover:text-[#FCA5A5] cursor-pointer"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">{children}</main>

        <footer className="border-t border-[#DCE7ED] px-4 py-4 text-center text-[0.74rem] font-semibold text-[#94A3B8] lg:px-7 dark:border-white/12 dark:text-[#7E93A9]">
          {isAr
            ? 'لوحة إدارة تجريبية تعمل ببيانات وهمية محفوظة محليًا — غير مرتبطة بأي قاعدة بيانات حقيقية.'
            : 'Demo admin dashboard running on locally-stored mock data — not connected to any real database.'}
        </footer>
      </div>
    </div>
  );
}
