import type { Locale } from '../../types/program';

export type BrandSurface = 'light' | 'dark' | 'mono';

interface BrandMarkProps {
  surface?: BrandSurface;
  className?: string;
}

export function BrandMark({ surface = 'light', className = 'w-9 h-9' }: BrandMarkProps) {
  const leftWingFill = surface === 'light' ? '#142D4E' : '#FFFFFF';
  const rightWingFill =
    surface === 'light' ? '#176B87' : surface === 'mono' ? '#FFFFFF' : '#DDF3F5';
  const rightWingOpacity = surface === 'mono' ? 0.82 : 1;
  const accentStroke = surface === 'mono' ? '#FFFFFF' : '#28B5C5';

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M11.5 12.5C14.8 8.6 19.2 6.8 24 6.8C28.8 6.8 33.2 8.6 36.5 12.5"
        stroke={accentStroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="13.5" r="3.2" fill={accentStroke} />
      <path
        d="M8.5 18C8.5 16.7 9.8 15.9 11 16.5L21.6 21.8C22.5 22.2 23 23.1 23 24.1V38.8C23 40.1 21.7 40.9 20.5 40.3L9.9 35C9 34.6 8.5 33.7 8.5 32.7V18Z"
        fill={leftWingFill}
      />
      <path
        d="M39.5 18C39.5 16.7 38.2 15.9 37 16.5L26.4 21.8C25.5 22.2 25 23.1 25 24.1V38.8C25 40.1 26.3 40.9 27.5 40.3L38.1 35C39 34.6 39.5 33.7 39.5 32.7V18Z"
        fill={rightWingFill}
        fillOpacity={rightWingOpacity}
      />
    </svg>
  );
}

interface BrandLogoProps {
  locale: Locale;
  variant?: 'full' | 'compact';
  surface?: BrandSurface;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<
  NonNullable<BrandLogoProps['size']>,
  {
    gap: string;
    mark: string;
    title: string;
    subtitle: string;
  }
> = {
  sm: {
    gap: 'gap-[9px]',
    mark: 'w-[30px] h-[30px]',
    title: 'text-[1.18rem]',
    subtitle: 'text-[0.66rem]',
  },
  md: {
    gap: 'gap-[11px]',
    mark: 'w-[36px] h-[36px] max-[767px]:w-[31px] max-[767px]:h-[31px]',
    title: 'text-[1.35rem] max-[767px]:text-[1.18rem]',
    subtitle: 'text-[0.72rem] max-[767px]:text-[0.65rem]',
  },
  lg: {
    gap: 'gap-[13px]',
    mark: 'w-[44px] h-[44px]',
    title: 'text-[1.6rem]',
    subtitle: 'text-[0.8rem]',
  },
};

export function BrandLogo({
  locale,
  variant = 'full',
  surface = 'light',
  size = 'md',
  className = '',
}: BrandLogoProps) {
  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        aria-label={
          locale === 'ar'
            ? 'مدار — منصة التعلم الرقمي'
            : 'Madar — Digital Learning Platform'
        }
      >
        <BrandMark surface={surface} className="w-[28px] h-[28px]" />
      </span>
    );
  }

  const sizing = SIZE_CLASSES[size];
  const titleColor = surface === 'light' ? 'text-[#142D4E]' : 'text-white';
  const subtitleColor =
    surface === 'light'
      ? 'text-[#176B87]'
      : surface === 'mono'
        ? 'text-white/80'
        : 'text-[#28B5C5]';

  const brandName = locale === 'ar' ? 'مدار' : 'Madar';
  const brandTagline =
    locale === 'ar' ? 'منصة التعلم الرقمي' : 'Digital Learning';

  return (
    <span
      className={`inline-flex items-center ${sizing.gap} select-none ${className}`}
      aria-label={
        locale === 'ar'
          ? 'مدار — منصة التعلم الرقمي'
          : 'Madar — Digital Learning Platform'
      }
    >
      <BrandMark surface={surface} className={`${sizing.mark} flex-none`} />
      <span className="flex flex-col items-start leading-none min-w-0">
        <span
          className={`${sizing.title} ${titleColor} font-extrabold tracking-tight leading-[1.08] whitespace-nowrap`}
        >
          {brandName}
        </span>
        <span
          className={`${sizing.subtitle} ${subtitleColor} font-bold tracking-wide leading-[1.25] mt-[2px] whitespace-nowrap`}
        >
          {brandTagline}
        </span>
      </span>
    </span>
  );
}
