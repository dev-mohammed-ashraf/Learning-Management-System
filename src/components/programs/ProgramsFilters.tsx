import { RotateCcw, Search } from 'lucide-react';
import type { CourseSortOption, Locale, ProgramKind } from '../../types/program';

interface ProgramsFiltersProps {
  locale: Locale;
  kind: ProgramKind;
  search: string;
  selectedType: string;
  selectedCategory: string;
  selectedSort: CourseSortOption;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onKindChange: (kind: ProgramKind) => void;
  onSortChange: (value: CourseSortOption) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function ProgramsFilters({
  locale,
  kind,
  search,
  selectedType,
  selectedCategory,
  selectedSort,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onKindChange,
  onSortChange,
  onSubmit,
  onReset,
}: ProgramsFiltersProps) {
  const hasActiveFilters =
    search.trim() !== '' ||
    selectedType !== '' ||
    selectedCategory !== '' ||
    selectedSort !== 'default' ||
    kind !== 'diplomas';

  const selectBase =
    'ut-filter-select h-[46px] border rounded-[12px] text-[0.88rem] font-bold cursor-pointer min-w-0 transition-all focus:outline-none focus:border-[#28B5C5] focus:shadow-[0_0_0_3px_rgba(40,181,197,0.16)]';

  return (
    <form
      className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[14px] flex flex-col gap-[12px] mt-[4px] mb-[28px]"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-wrap gap-[12px] items-center max-[760px]:flex-col max-[760px]:items-stretch">
        <div className="relative flex-[1_1_280px] min-w-0 max-[760px]:w-full max-[760px]:flex-auto">
          <Search
            className={`absolute start-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none transition-colors ${
              search.trim() !== '' ? 'text-[#28B5C5]' : 'text-[#176B87] dark:text-[#28B5C5]'
            }`}
            aria-hidden="true"
          />
          <input
            type="search"
            name="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              locale === 'ar'
                ? 'ابحث بعنوان الدورة مثل: إدارة الأعمال أو اللغة الإنجليزية'
                : 'e.g., Business Administration or English'
            }
            aria-label={locale === 'ar' ? 'ابحث باسم الدورة أو البرنامج' : 'Search by course name'}
            className={`w-full h-[46px] border rounded-[12px] bg-white dark:bg-[#142D4E] ps-[46px] pe-[16px] text-[0.94rem] text-[#183247] dark:text-[#F1F5F9] placeholder:text-[#64748B] dark:placeholder:text-[#B8C7D9] transition-all focus:outline-none focus:border-[#28B5C5] focus:shadow-[0_0_0_3px_rgba(40,181,197,0.16)] ${
              search.trim() !== '' ? 'border-[#28B5C5]' : 'border-[#DCE7ED] dark:border-white/12'
            }`}
          />
        </div>

        <button
          type="submit"
          className="h-[46px] flex-none whitespace-nowrap inline-flex items-center justify-center rounded-[12px] px-[24px] font-bold text-[0.92rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] transition-all cursor-pointer max-[760px]:w-full"
        >
          {locale === 'ar' ? 'تصفية الدورات' : 'Apply Filter'}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="h-[46px] flex-none whitespace-nowrap inline-flex items-center justify-center gap-1.5 rounded-[12px] px-[16px] font-bold text-[0.86rem] border border-[#DCE7ED] bg-white text-[#64748B] hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/15 dark:bg-[#142D4E] dark:text-[#B8C7D9] dark:hover:border-[#28B5C5] dark:hover:text-[#28B5C5] transition-colors cursor-pointer max-[760px]:w-full"
          >
            <RotateCcw className="w-[15px] h-[15px]" aria-hidden="true" />
            <span>{locale === 'ar' ? 'مسح التصفية' : 'Clear Filters'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1 gap-[10px]">
        <select
          name="category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label={locale === 'ar' ? 'التصنيف' : 'Category'}
          className={`${selectBase} ${
            selectedCategory !== ''
              ? 'border-[#28B5C5] bg-[#DDF3F5] text-[#142D4E] dark:bg-[#1B3553] dark:text-[#F1F5F9]'
              : 'border-[#DCE7ED] bg-white text-[#183247] dark:border-white/12 dark:bg-[#142D4E] dark:text-[#F1F5F9]'
          }`}
        >
          <option value="">{locale === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
          <option value="business">
            {locale === 'ar' ? 'الإدارة والأعمال والتعاقدات' : 'Business & Contracting'}
          </option>
          <option value="logistics">
            {locale === 'ar' ? 'اللوجستيات وسلاسل الإمداد' : 'Logistics & Supply Chain'}
          </option>
          <option value="service">
            {locale === 'ar' ? 'خدمة المستفيدين والفعاليات' : 'Client Service & Events'}
          </option>
          <option value="security">
            {locale === 'ar' ? 'الأمن والسلامة الميدانية' : 'Security & Facility Safety'}
          </option>
          <option value="language">
            {locale === 'ar' ? 'اللغات والمهارات الأكاديمية' : 'Languages & Academic Skills'}
          </option>
        </select>

        <select
          name="kind"
          value={kind}
          onChange={(e) => onKindChange(e.target.value as ProgramKind)}
          aria-label={locale === 'ar' ? 'المستوى / المسار' : 'Level / Track'}
          className={`${selectBase} border-[#DCE7ED] bg-white text-[#183247] dark:border-white/12 dark:bg-[#142D4E] dark:text-[#F1F5F9]`}
        >
          <option value="diplomas">
            {locale === 'ar' ? 'دبلوم مشارك مهني' : 'Associate Diploma'}
          </option>
          <option value="fellowships">
            {locale === 'ar' ? 'الزمالات التخصصية (قريبًا)' : 'Fellowships (Coming Soon)'}
          </option>
        </select>

        <select
          name="type"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          aria-label={locale === 'ar' ? 'نمط الدراسة' : 'Study Mode'}
          className={`${selectBase} ${
            selectedType !== ''
              ? 'border-[#28B5C5] bg-[#DDF3F5] text-[#142D4E] dark:bg-[#1B3553] dark:text-[#F1F5F9]'
              : 'border-[#DCE7ED] bg-white text-[#183247] dark:border-white/12 dark:bg-[#142D4E] dark:text-[#F1F5F9]'
          }`}
        >
          <option value="">{locale === 'ar' ? 'كل أنماط الدراسة' : 'All Study Modes'}</option>
          <option value="2">{locale === 'ar' ? 'تعلّم عن بُعد' : 'Distance Learning'}</option>
        </select>

        <select
          name="sort"
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value as CourseSortOption)}
          aria-label={locale === 'ar' ? 'ترتيب العرض' : 'Sort By'}
          className={`${selectBase} ${
            selectedSort !== 'default'
              ? 'border-[#28B5C5] bg-[#DDF3F5] text-[#142D4E] dark:bg-[#1B3553] dark:text-[#F1F5F9]'
              : 'border-[#DCE7ED] bg-white text-[#183247] dark:border-white/12 dark:bg-[#142D4E] dark:text-[#F1F5F9]'
          }`}
        >
          <option value="default">{locale === 'ar' ? 'الترتيب الافتراضي' : 'Default Order'}</option>
          <option value="title_asc">{locale === 'ar' ? 'العنوان: أ إلى ي' : 'Title: A to Z'}</option>
          <option value="title_desc">{locale === 'ar' ? 'العنوان: ي إلى أ' : 'Title: Z to A'}</option>
        </select>
      </div>
    </form>
  );
}
