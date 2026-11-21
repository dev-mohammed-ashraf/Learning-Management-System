export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'ut_theme';

export function resolveInitialTheme(storedValue: string | null | undefined): Theme {
  return storedValue === 'dark' ? 'dark' : 'light';
}

export function toggleThemeValue(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}

export function readStoredTheme(storage?: Pick<Storage, 'getItem'> | null): Theme {
  const target =
    storage !== undefined ? storage : typeof window !== 'undefined' ? window.localStorage : null;
  if (!target) {
    return 'light';
  }
  try {
    return resolveInitialTheme(target.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'light';
  }
}

export function persistTheme(theme: Theme, storage?: Pick<Storage, 'setItem'> | null): void {
  const target =
    storage !== undefined ? storage : typeof window !== 'undefined' ? window.localStorage : null;
  if (!target) {
    return;
  }
  try {
    target.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage quota or privacy restrictions
  }
}

export function applyThemeToDocument(theme: Theme, doc?: Document | null): void {
  const targetDoc = doc !== undefined ? doc : typeof document !== 'undefined' ? document : null;
  if (!targetDoc?.documentElement) {
    return;
  }
  const root = targetDoc.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
}
