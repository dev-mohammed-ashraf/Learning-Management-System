import type { Locale } from '../../types/program';

interface ProgramsPaginationProps {
  locale: Locale;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProgramsPagination({
  locale,
  currentPage,
  totalPages,
  onPageChange,
}: ProgramsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <nav
      className="flex gap-[8px] justify-center mt-[30px]"
      aria-label={locale === 'ar' ? 'برامج الدبلومات' : 'Programs pagination'}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label={locale === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
        className={`min-w-[38px] h-[38px] grid place-items-center border border-[#DCE7ED] bg-white text-[#64748B] rounded-[10px] font-bold px-[6px] text-[0.9rem] transition-colors ${
          currentPage <= 1
            ? 'opacity-40 cursor-default'
            : 'hover:text-[#176B87] hover:border-[#28B5C5] cursor-pointer'
        }`}
      >
        ‹
      </button>

      {pages.map((page) => {
        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={isCurrent ? 'page' : undefined}
            className={`num min-w-[38px] h-[38px] grid place-items-center border rounded-[10px] font-bold px-[6px] text-[0.9rem] transition-colors ${
              isCurrent
                ? 'bg-[#176B87] border-[#176B87] text-white cursor-default shadow-[0_4px_12px_rgba(23,107,135,0.22)]'
                : 'border-[#DCE7ED] bg-white text-[#64748B] hover:text-[#176B87] hover:border-[#28B5C5] cursor-pointer'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label={locale === 'ar' ? 'الصفحة التالية' : 'Next page'}
        className={`min-w-[38px] h-[38px] grid place-items-center border border-[#DCE7ED] bg-white text-[#64748B] rounded-[10px] font-bold px-[6px] text-[0.9rem] transition-colors ${
          currentPage >= totalPages
            ? 'opacity-40 cursor-default'
            : 'hover:text-[#176B87] hover:border-[#28B5C5] cursor-pointer'
        }`}
      >
        ›
      </button>
    </nav>
  );
}
