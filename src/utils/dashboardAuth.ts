import type { AdminDataState } from '../types/admin';
import { DEMO_ADMIN_ACCOUNT } from '../data/adminData';
import { findCompanyForSignIn } from './companyData';
import type { DashboardSession } from '../services/dashboardSessionStore';

/**
 * Demo dashboard authentication (mock only — no real backend).
 *
 * The dashboard login page (/dashboard/login) is the single entry point:
 * - `admin`   → verified against the fixed demo admin credentials.
 * - `company` → verified against the admin-managed demo company accounts
 *               (active accounts only, via the existing company data layer).
 */
export type DashboardRole = 'admin' | 'company';

export function authenticateDashboard(
  role: DashboardRole,
  email: string,
  password: string,
  state: AdminDataState
): DashboardSession | null {
  const normalizedEmail = email.trim().toLowerCase();
  if (role === 'admin') {
    return normalizedEmail === DEMO_ADMIN_ACCOUNT.email && password === DEMO_ADMIN_ACCOUNT.password
      ? { role: 'admin' }
      : null;
  }
  const company = findCompanyForSignIn(state, normalizedEmail, password);
  return company ? { role: 'company', companyId: company.id } : null;
}
