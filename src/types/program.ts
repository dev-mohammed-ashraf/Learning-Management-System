export type Locale = 'ar' | 'en';

export type ProgramKind = 'diplomas' | 'fellowships';

export type ProgramDeliveryMode = 'distance';

export type CourseCategory =
  | 'business'
  | 'logistics'
  | 'service'
  | 'security'
  | 'language';

export type CourseSortOption = 'default' | 'title_asc' | 'title_desc';

export interface Program {
  id: string;
  slug: string;
  kind: ProgramKind;
  deliveryTypeValue: string;
  category: CourseCategory;
  categoryAr: string;
  categoryEn: string;
  levelAr: string;
  levelEn: string;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  image: string;
  durationAr: string;
  durationEn: string;
  creditsAr: string;
  creditsEn: string;
  accreditationAr: string;
  accreditationEn: string;
  price: number;
  currencyAr: string;
  currencyEn: string;
  taxLabelAr: string;
  taxLabelEn: string;
  ctaLabelAr: string;
  ctaLabelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  modulesAr: string[];
  modulesEn: string[];
  targetAudienceAr: string;
  targetAudienceEn: string;
}

export interface ProgramFilterParams {
  kind: ProgramKind;
  search: string;
  type: string;
  category?: string;
  sort?: CourseSortOption;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
