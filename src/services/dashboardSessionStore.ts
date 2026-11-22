/**
 * Demo dashboard session (localStorage only — no real auth).
 *
 * One unified session store for both dashboard account types:
 * - `admin`   → grants access to the Admin Dashboard (platform-wide data).
 * - `company` → grants access to the Company Dashboard (own students only).
 *
 * Sessions are created exclusively through the dashboard login page
 * (/dashboard/login) and are re-validated against the demo data on use.
 */

export type DashboardSession =
  | { role: 'admin' }
  | { role: 'company'; companyId: string };

const STORAGE_KEY = 'madar_demo_dashboard_session_v1';

export function loadDashboardSession(): DashboardSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DashboardSession>;
    if (parsed && parsed.role === 'admin') return { role: 'admin' };
    if (
      parsed &&
      parsed.role === 'company' &&
      typeof parsed.companyId === 'string' &&
      parsed.companyId
    ) {
      return { role: 'company', companyId: parsed.companyId };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveDashboardSession(session: DashboardSession): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage quota / privacy mode failures
  }
}

export function clearDashboardSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures
  }
}
