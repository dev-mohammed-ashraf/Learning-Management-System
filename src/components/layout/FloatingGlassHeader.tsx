import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, BookOpen, GraduationCap, Search, X } from 'lucide-react';
import type { Locale, Program } from '../../types/program';
import {
  searchPortalSuggestions,
  type SearchServiceTarget,
} from '../../utils/headerSearch';

interface FloatingGlassHeaderProps {
  locale: Locale;
  programs: Program[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmitSearch: (query: string) => void;
  onToggleLocale: () => void;
  onGoHome: () => void;
  onSelectProgram: (program: Program) => void;
  onSelectService: (target: SearchServiceTarget) => void;
}

export function FloatingGlassHeader({
  locale,
  programs,
  searchQuery,
  onSearchChange,
  onSubmitSearch,
  onToggleLocale,
  onGoHome,
  onSelectProgram,
  onSelectService,
}: FloatingGlassHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!suggestionsOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [suggestionsOpen]);

  const suggestions = useMemo(
    () => searchPortalSuggestions(searchQuery, programs, locale),
    [searchQuery, programs, locale]
  );

  const hasResults = suggestions.programs.length > 0 || suggestions.services.length > 0;
  const showDropdown = suggestionsOpen && searchQuery.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestionsOpen(false);
    inputRef.current?.blur();
    onSubmitSearch(searchQuery);
  };

  return (
    <header
      aria-label={locale === 'ar' ? 'الشريط العلوي للموقع' : 'Site Utility Header'}
      className={`ut-glass-header ${isScrolled ? 'is-scrolled' : ''} sticky top-[18px] z-[55] mx-auto mt-[18px] -mb-[98px] max-[767px]:top-[14px] max-[767px]:mt-[14px] max-[767px]:-mb-[122px] w-[calc(100%-80px)] max-w-[1440px] max-[767px]:w-[calc(100%-24px)] min-[768px]:h-[80px] rounded-[20px] px-[24px] max-[767px]:px-[14px] max-[767px]:py-[10px] flex items-center justify-between gap-[20px] max-[767px]:flex-wrap max-[767px]:gap-x-[12px] max-[767px]:gap-y-[10px] transition-[background-color,border-color,box-shadow] duration-250 ease-out`}
    >
      {/* 1. Right Side (in RTL): Official Institute Logo */}
      <button
        type="button"
        onClick={onGoHome}
        aria-label={
          locale === 'ar'
            ? 'العودة إلى الرئيسية — معهد البحوث والاستشارات'
            : 'Home — Research and Consulting Institute'
        }
        className="order-1 flex-none flex items-center justify-center rounded-[12px] py-[4px] px-[4px] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[#176B87] transition-opacity cursor-pointer"
      >
        <img
          src="/assets/ut/logo-t.png"
          alt={
            locale === 'ar'
              ? 'معهد البحوث والاستشارات — جامعة تبوك'
              : 'Research and Consulting Institute — University of Tabuk'
          }
          className="max-w-[170px] max-h-[55px] max-[767px]:max-w-[145px] max-[767px]:max-h-[44px] w-auto h-auto object-contain block"
        />
      </button>

      {/* 2. Center: Wide Translucent Search Field */}
      <div
        ref={searchContainerRef}
        className="order-2 max-[767px]:order-3 max-[767px]:basis-full flex-1 flex justify-center min-w-0 relative"
      >
        <form
          role="search"
          onSubmit={handleSubmit}
          className="relative w-[500px] max-w-full max-[1180px]:w-[420px] max-[1023px]:w-[320px] max-[767px]:w-full"
        >
          <Search
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-[14px] w-[18px] h-[18px] text-[#64748B]"
            aria-hidden="true"
          />

          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onFocus={() => setSuggestionsOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setSuggestionsOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSuggestionsOpen(false);
                inputRef.current?.blur();
              }
            }}
            placeholder={
              locale === 'ar'
                ? 'ابحث عن برنامج أو خدمة...'
                : 'Search for a program or service...'
            }
            aria-label={
              locale === 'ar'
                ? 'ابحث عن برنامج أو خدمة'
                : 'Search for a program or service'
            }
            className="w-full h-[46px] max-[767px]:h-[42px] ps-[42px] pe-[38px] rounded-[12px] bg-white/65 border border-[#DCE7ED]/90 text-[#142D4E] text-[0.94rem] font-medium placeholder:text-[#64748B] focus:bg-white/95 focus:border-[#28B5C5] focus:ring-2 focus:ring-[#28B5C5]/20 focus:outline-none transition-all duration-200 [&::-webkit-search-cancel-button]:hidden"
          />

          {searchQuery.trim() !== '' && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              aria-label={locale === 'ar' ? 'مسح البحث' : 'Clear search'}
              className="absolute top-1/2 -translate-y-1/2 end-[10px] w-[26px] h-[26px] rounded-[8px] text-[#64748B] hover:text-[#142D4E] hover:bg-[#EAF3F6] grid place-items-center transition-colors cursor-pointer"
            >
              <X className="w-[15px] h-[15px]" aria-hidden="true" />
            </button>
          )}
        </form>

        {/* Live Search Suggestions Dropdown */}
        {showDropdown && (
          <div
            role="region"
            aria-label={locale === 'ar' ? 'نتائج البحث السريع' : 'Quick search results'}
            className="absolute top-[calc(100%+10px)] w-[500px] max-w-full max-[1180px]:w-[420px] max-[1023px]:w-[340px] max-[767px]:w-full rounded-[16px] bg-white/95 backdrop-blur-xl border border-[#DCE7ED] shadow-[0_18px_42px_rgba(20,45,78,0.16)] p-[10px] z-[75] max-h-[340px] overflow-y-auto"
          >
            {hasResults ? (
              <div className="flex flex-col gap-[6px]">
                {suggestions.programs.length > 0 && (
                  <div>
                    <div className="px-[10px] py-[4px] text-[0.75rem] font-bold text-[#64748B]">
                      {locale === 'ar' ? 'البرامج الأكاديمية' : 'Academic Programs'}
                    </div>
                    {suggestions.programs.map((program) => (
                      <button
                        key={program.id}
                        type="button"
                        onClick={() => {
                          setSuggestionsOpen(false);
                          onSelectProgram(program);
                        }}
                        className="w-full px-[10px] py-[8px] rounded-[10px] flex items-center justify-between gap-[10px] text-start hover:bg-[#EAF3F6] text-[#142D4E] transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-[9px] min-w-0">
                          <GraduationCap
                            className="w-[17px] h-[17px] text-[#176B87] flex-none"
                            aria-hidden="true"
                          />
                          <span className="text-[0.88rem] font-bold truncate">
                            {locale === 'ar' ? program.titleAr : program.titleEn}
                          </span>
                        </span>
                        <span className="text-[0.76rem] font-semibold text-[#176B87] flex-none">
                          {locale === 'ar' ? program.badgeAr : program.badgeEn}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {suggestions.services.length > 0 && (
                  <div className={suggestions.programs.length > 0 ? 'pt-[6px] border-t border-[#DCE7ED]/80' : ''}>
                    <div className="px-[10px] py-[4px] text-[0.75rem] font-bold text-[#64748B]">
                      {locale === 'ar' ? 'خدمات البوابة' : 'Portal Services'}
                    </div>
                    {suggestions.services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          setSuggestionsOpen(false);
                          onSelectService(service.id);
                        }}
                        className="w-full px-[10px] py-[8px] rounded-[10px] flex items-center justify-between gap-[10px] text-start hover:bg-[#EAF3F6] text-[#142D4E] transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-[9px] min-w-0">
                          <BookOpen
                            className="w-[16px] h-[16px] text-[#28B5C5] flex-none"
                            aria-hidden="true"
                          />
                          <span className="text-[0.88rem] font-bold truncate">
                            {locale === 'ar' ? service.titleAr : service.titleEn}
                          </span>
                        </span>
                        {locale === 'ar' ? (
                          <ArrowUpLeft className="w-[15px] h-[15px] text-[#64748B] flex-none" aria-hidden="true" />
                        ) : (
                          <ArrowUpRight className="w-[15px] h-[15px] text-[#64748B] flex-none" aria-hidden="true" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSuggestionsOpen(false);
                    onSubmitSearch(searchQuery);
                  }}
                  className="mt-[4px] w-full py-[8px] px-[12px] rounded-[10px] bg-[#DDF3F5]/75 hover:bg-[#DDF3F5] text-[#142D4E] font-bold text-[0.84rem] flex items-center justify-center gap-[6px] transition-colors cursor-pointer"
                >
                  <Search className="w-[14px] h-[14px] text-[#176B87]" aria-hidden="true" />
                  <span>
                    {locale === 'ar'
                      ? `عرض جميع نتائج "${searchQuery.trim()}" في صفحة البرامج`
                      : `View all results for "${searchQuery.trim()}" in Programs`}
                  </span>
                </button>
              </div>
            ) : (
              <div className="py-[14px] px-[12px] text-center text-[0.86rem] text-[#64748B]">
                {locale === 'ar'
                  ? 'لا توجد نتائج مطابقة مباشرة، اضغط Enter للبحث في صفحة البرامج.'
                  : 'No direct match found. Press Enter to search on the Programs page.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Left Side (in RTL): Compact Language Switcher Button */}
      <button
        type="button"
        onClick={onToggleLocale}
        aria-label={locale === 'ar' ? 'Switch to English (EN)' : 'التبديل إلى العربية (AR)'}
        className="order-3 max-[767px]:order-2 flex-none h-[42px] px-[16px] rounded-[10px] bg-white/65 border border-[#DCE7ED]/90 text-[#142D4E] font-bold text-[0.86rem] tracking-wide hover:border-[#28B5C5] hover:text-[#176B87] hover:bg-[#DDF3F5]/80 focus-visible:outline-2 focus-visible:outline-[#176B87] transition-all duration-200 inline-flex items-center justify-center cursor-pointer"
      >
        {locale === 'ar' ? 'EN' : 'AR'}
      </button>
    </header>
  );
}
