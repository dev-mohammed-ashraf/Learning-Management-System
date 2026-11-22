import { useEffect, type ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import type { Locale } from '../../types/program';

/* ---------- Class helpers ---------- */

export function adminBtnClass(
  variant: 'primary' | 'ghost' | 'danger' | 'success' | 'subtle',
  size: 'sm' | 'md' = 'sm'
): string {
  const base =
    'inline-flex items-center justify-center gap-[6px] rounded-[10px] font-bold transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap';
  const sizing =
    size === 'sm' ? 'px-[12px] py-[8px] text-[0.8rem]' : 'px-[20px] py-[11px] text-[0.9rem]';
  const variants: Record<string, string> = {
    primary:
      'bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5]',
    ghost:
      'border border-[#DCE7ED] bg-[#EAF3F6] text-[#183247] hover:bg-[#DDF3F5] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9] dark:hover:bg-[#1B3553]',
    danger:
      'border border-[#C0392B]/35 bg-[#C0392B]/10 text-[#C0392B] hover:bg-[#C0392B] hover:text-white dark:border-[#FCA5A5]/30 dark:bg-[#FCA5A5]/10 dark:text-[#FCA5A5] dark:hover:bg-[#C0392B] dark:hover:text-white',
    success:
      'bg-[#1F8A5B] text-white hover:bg-[#14643f] dark:bg-[#2ECC71] dark:text-[#0B1726] dark:hover:bg-[#6EE7B7]',
    subtle: 'text-[#176B87] hover:bg-[#DDF3F5] dark:text-[#28B5C5] dark:hover:bg-[#1B3553]',
  };
  return `${base} ${sizing} ${variants[variant]}`;
}

export function initialsOf(name: string): string {
  const parts = name.replace(/^(د\.|أ\.|م\.|Dr\.|Mr\.|Ms\.)\s*/u, '').trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '؟';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
}

const AVATAR_TONES = [
  'bg-[#176B87]',
  'bg-[#142D4E]',
  'bg-[#1F8A5B]',
  'bg-[#7C5CBF]',
  'bg-[#B96A2B]',
  'bg-[#28B5C5]',
];

export function avatarTone(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

export function AdminAvatar({
  name,
  seed,
  size = 'md',
}: {
  name: string;
  seed: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizing =
    size === 'sm'
      ? 'w-8 h-8 text-[0.72rem]'
      : size === 'lg'
        ? 'w-14 h-14 text-[1.05rem]'
        : 'w-10 h-10 text-[0.85rem]';
  return (
    <span
      aria-hidden="true"
      className={`${sizing} ${avatarTone(seed)} grid flex-none place-items-center rounded-full font-extrabold text-white`}
    >
      {initialsOf(name)}
    </span>
  );
}

/* ---------- Badge ---------- */

export type AdminBadgeTone = 'brand' | 'success' | 'warn' | 'danger' | 'neutral' | 'cyan';

export function AdminBadge({
  tone = 'neutral',
  children,
}: {
  tone?: AdminBadgeTone;
  children: ReactNode;
}) {
  const tones: Record<AdminBadgeTone, string> = {
    brand: 'bg-[#EAF3F6] text-[#176B87] dark:bg-[#102238] dark:text-[#28B5C5]',
    cyan: 'bg-[#DDF3F5] text-[#176B87] dark:bg-[#1B3553] dark:text-[#28B5C5]',
    success: 'bg-[#E7F5EE] text-[#1F8A5B] dark:bg-[#102E24] dark:text-[#6EE7B7]',
    warn: 'bg-[#FFF4E0] text-[#A05E03] dark:bg-[#33230A] dark:text-[#FCD34D]',
    danger: 'bg-[#FCEBE9] text-[#C0392B] dark:bg-[#331411] dark:text-[#FCA5A5]',
    neutral: 'bg-[#EAF3F6] text-[#64748B] dark:bg-[#102238] dark:text-[#B8C7D9]',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[8px] px-[10px] py-[4px] text-[0.74rem] font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------- Cards / headers ---------- */

export function AdminCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[16px] border border-[#DCE7ED] bg-white shadow-[var(--shadow-sm)] dark:border-white/12 dark:bg-[#142D4E] ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[1.25rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">{title}</h1>
        <p className="mt-1 text-[0.84rem] text-[#64748B] dark:text-[#B8C7D9]">{description}</p>
      </div>
      {action && <div className="flex flex-none items-center gap-2">{action}</div>}
    </div>
  );
}

export function AdminEmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[16px] border border-dashed border-[#DCE7ED] bg-[#EAF3F6]/50 px-6 py-12 text-center dark:border-white/15 dark:bg-[#102238]/50">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-white text-[#176B87] dark:bg-[#142D4E] dark:text-[#28B5C5]">
        {icon}
      </div>
      <h3 className="text-[0.95rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">{title}</h3>
      <p className="mx-auto mt-1 max-w-[46ch] text-[0.82rem] text-[#64748B] dark:text-[#B8C7D9]">
        {description}
      </p>
    </div>
  );
}


/* ---------- Inputs ---------- */

export const adminFieldClass =
  'w-full rounded-[10px] border border-[#DCE7ED] bg-[#EAF3F6] px-3 py-[10px] text-[0.86rem] font-semibold text-[#183247] outline-none transition-colors focus:border-[#176B87] focus:bg-white dark:border-white/12 dark:bg-[#1B3553] dark:text-[#F1F5F9] dark:placeholder:text-[#B8C7D9] dark:focus:border-[#28B5C5] dark:focus:bg-[#102238]';

export function AdminField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-[6px]">
      <span className="block text-[0.78rem] font-bold text-[#64748B] dark:text-[#B8C7D9]">{label}</span>
      {children}
      {hint && <span className="block text-[0.72rem] text-[#94A3B8] dark:text-[#7E93A9]">{hint}</span>}
    </label>
  );
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative min-w-[200px] flex-1">
      <Search
        className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${adminFieldClass} ps-9`}
      />
    </div>
  );
}


/* ---------- Toggle ---------- */

export function AdminToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex cursor-pointer items-center gap-[10px]"
    >
      <span
        className={`relative h-[22px] w-[40px] flex-none rounded-full transition-colors ${
          checked ? 'bg-[#176B87] dark:bg-[#28B5C5]' : 'bg-[#C7D6DE] dark:bg-[#1B3553]'
        }`}
      >
        <span
          className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white shadow transition-all ${
            checked ? 'start-[21px]' : 'start-[3px]'
          }`}
        />
      </span>
      <span className="text-[0.84rem] font-bold text-[#183247] dark:text-[#F1F5F9]">{label}</span>
    </button>
  );
}


/* ---------- Modal & Confirm ---------- */

export function AdminModal({
  title,
  onClose,
  children,
  maxWidth = '560px',
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0E223D]/65 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        style={{ maxWidth }}
        className="relative max-h-[90vh] w-full overflow-y-auto overflow-hidden rounded-[18px] border border-[#DCE7ED] bg-white shadow-[0_22px_54px_rgba(20,45,78,0.25)] dark:border-white/12 dark:bg-[#142D4E] dark:shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#DCE7ED] bg-white/95 px-5 py-3.5 backdrop-blur dark:border-white/12 dark:bg-[#142D4E]/95">
          <h2 className="truncate text-[1rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-[10px] border border-[#DCE7ED] bg-white text-[#183247] hover:border-[#28B5C5] hover:text-[#176B87] dark:border-white/15 dark:bg-[#102238] dark:text-[#F1F5F9] dark:hover:text-[#28B5C5]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  locale,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  locale: Locale;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AdminModal title={title} onClose={onCancel} maxWidth="440px">
      <p className="text-[0.9rem] leading-[1.85] text-[#64748B] dark:text-[#B8C7D9]">{message}</p>
      <div className="mt-5 flex items-center justify-end gap-2">
        <button type="button" onClick={onCancel} className={adminBtnClass('ghost')}>
          {locale === 'ar' ? 'إلغاء' : 'Cancel'}
        </button>
        <button type="button" onClick={onConfirm} className={adminBtnClass('danger')}>
          {confirmLabel}
        </button>
      </div>
    </AdminModal>
  );
}

/* ---------- Table ---------- */

export function AdminTableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-start">{children}</table>
    </div>
  );
}

export function AdminTh({ children }: { children: ReactNode }) {
  return (
    <th className="whitespace-nowrap border-b border-[#DCE7ED] bg-[#EAF3F6]/60 px-4 py-3 text-start text-[0.74rem] font-extrabold uppercase tracking-wide text-[#64748B] dark:border-white/12 dark:bg-[#102238]/60 dark:text-[#B8C7D9]">
      {children}
    </th>
  );
}

export function AdminTd({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={`border-b border-[#DCE7ED]/70 px-4 py-3 align-middle dark:border-white/8 ${className}`}>
      {children}
    </td>
  );
}
