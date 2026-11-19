import { RotateCcw, Search } from 'lucide-react';
import type { Locale } from '../../types/program';

interface ProgramsFiltersProps {
  locale: Locale;
  search: string;
  selectedType: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function ProgramsFilters({
  locale,
  search,
  selectedType,
  onSearchChange,
  onTypeChange,
  onSubmit,
  onReset,
}: ProgramsFiltersProps) {
  const hasActiveFilters = search.trim() !== '' || selectedType !== '';

  return (
    <form
      className="flex flex-wrap gap-[12px] items-center mt-[4px] mb-[28px] max-[760px]:flex-col max-[760px]:items-stretch"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="relative flex-[1_1_260px] min-w-0 max-[760px]:w-full max-[760px]:flex-auto">
        <Search
          className="absolute start-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#5E7489] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          name="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={locale === 'ar' ? 'مثال: الأمن السيبراني' : 'e.g., Business Administration'}
          aria-label={locale === 'ar' ? 'ابحث باسم البرنامج' : 'Search by program name'}
          className="w-full h-[52px] border border-[#E3EAF1] rounded-[14px] bg-white ps-[46px] pe-[16px] text-[0.95rem] text-[#12263A] placeholder:text-[#5E7489] focus:outline-none focus:border-[#1C5D92] focus:shadow-[0_0_0_3px_rgba(32,116,184,0.14)]"
        />
      </div>

      <select
        name="type"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        aria-label={locale === 'ar' ? 'نوع البرنامج' : 'Program Type'}
        className="ut-filter-select h-[52px] border border-[#E3EAF1] rounded-[14px] bg-white text-[0.95rem] font-bold text-[#12263A] cursor-pointer flex-[0_1_230px] min-w-0 focus:outline-none focus:border-[#1C5D92] focus:shadow-[0_0_0_3px_rgba(32,116,184,0.14)] max-[760px]:w-full max-[760px]:flex-auto"
      >
        <option value="">{locale === 'ar' ? 'نوع البرنامج' : 'Program Type'}</option>
        <option value="2">{locale === 'ar' ? 'عن بعد' : 'Distance Learning'}</option>
      </select>

      <button
        type="submit"
        className="h-[52px] flex-none whitespace-nowrap inline-flex items-center justify-center rounded-[10px] px-[26px] font-bold text-[0.95rem] bg-[#1C5D92] text-white hover:bg-[#154A76] hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(28,93,146,0.3)] transition-all cursor-pointer max-[760px]:w-full max-[760px]:flex-auto"
      >
        {locale === 'ar' ? 'تصفية' : 'Filter'}
      </button>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="h-[52px] flex-none whitespace-nowrap inline-flex items-center justify-center gap-1.5 rounded-[14px] px-[18px] font-bold text-[0.88rem] border border-[#E3EAF1] bg-white text-[#5E7489] hover:border-[#1C5D92] hover:text-[#1C5D92] transition-colors cursor-pointer max-[760px]:w-full max-[760px]:flex-auto"
        >
          <RotateCcw className="w-[15px] h-[15px]" aria-hidden="true" />
          <span>{locale === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
        </button>
      )}
    </form>
  );
}
