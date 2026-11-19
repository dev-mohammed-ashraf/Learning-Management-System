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
      className="bg-[#EAF3F6] border border-[#DCE7ED] rounded-[16px] p-[12px] flex flex-wrap gap-[12px] items-center mt-[4px] mb-[28px] max-[760px]:flex-col max-[760px]:items-stretch"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="relative flex-[1_1_260px] min-w-0 max-[760px]:w-full max-[760px]:flex-auto">
        <Search
          className={`absolute start-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none transition-colors ${
            search.trim() !== '' ? 'text-[#28B5C5]' : 'text-[#176B87]'
          }`}
          aria-hidden="true"
        />
        <input
          type="search"
          name="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={locale === 'ar' ? 'مثال: الأمن السيبراني' : 'e.g., Business Administration'}
          aria-label={locale === 'ar' ? 'ابحث باسم البرنامج' : 'Search by program name'}
          className={`w-full h-[50px] border rounded-[12px] bg-white ps-[46px] pe-[16px] text-[0.95rem] text-[#183247] placeholder:text-[#64748B] transition-all focus:outline-none focus:border-[#28B5C5] focus:shadow-[0_0_0_3px_rgba(40,181,197,0.16)] ${
            search.trim() !== '' ? 'border-[#28B5C5]' : 'border-[#DCE7ED]'
          }`}
        />
      </div>

      <select
        name="type"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        aria-label={locale === 'ar' ? 'نوع البرنامج' : 'Program Type'}
        className={`ut-filter-select h-[50px] border rounded-[12px] text-[0.95rem] font-bold cursor-pointer flex-[0_1_230px] min-w-0 transition-all focus:outline-none focus:border-[#28B5C5] focus:shadow-[0_0_0_3px_rgba(40,181,197,0.16)] max-[760px]:w-full max-[760px]:flex-auto ${
          selectedType !== ''
            ? 'border-[#28B5C5] bg-[#DDF3F5] text-[#142D4E]'
            : 'border-[#DCE7ED] bg-white text-[#183247]'
        }`}
      >
        <option value="">{locale === 'ar' ? 'نوع البرنامج' : 'Program Type'}</option>
        <option value="2">{locale === 'ar' ? 'عن بعد' : 'Distance Learning'}</option>
      </select>

      <button
        type="submit"
        className="h-[50px] flex-none whitespace-nowrap inline-flex items-center justify-center rounded-[12px] px-[26px] font-bold text-[0.95rem] bg-[#176B87] text-white hover:bg-[#142D4E] hover:shadow-[0_8px_20px_rgba(20,45,78,0.2)] transition-all cursor-pointer max-[760px]:w-full max-[760px]:flex-auto"
      >
        {locale === 'ar' ? 'تصفية' : 'Filter'}
      </button>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="h-[50px] flex-none whitespace-nowrap inline-flex items-center justify-center gap-1.5 rounded-[12px] px-[18px] font-bold text-[0.88rem] border border-[#DCE7ED] bg-white text-[#64748B] hover:border-[#28B5C5] hover:text-[#176B87] transition-colors cursor-pointer max-[760px]:w-full max-[760px]:flex-auto"
        >
          <RotateCcw className="w-[15px] h-[15px]" aria-hidden="true" />
          <span>{locale === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
        </button>
      )}
    </form>
  );
}
