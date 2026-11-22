/**
 * Glass sidebar layout controller.
 *
 * Keeps the floating desktop sidebar clear of the floating header at all times.
 * It measures the real header bounds and writes CSS custom properties that:
 * - cap the sidebar height to the available viewport space below the header
 * - preserve a consistent gap between header and sidebar
 * - vertically center the sidebar within that available space
 *
 * Measurements run in ResizeObserver + rAF and write directly to CSS vars, so
 * no React re-renders are involved and layout stays responsive to header size,
 * viewport changes, and sidebar content/width transitions.
 */
const DESKTOP_MQ = '(min-width: 1024px)';

/** Minimum vertical gap between the header bottom and the sidebar top. */
const GAP_PX = 20;
/** Bottom viewport margin, kept in balance with the sidebar's left offset. */
const BOTTOM_MARGIN_PX = 20;
/** Minimum sidebar height before internal scrolling takes over. */
const MIN_SIDEBAR_HEIGHT_PX = 240;

export function initGlassFusion(): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>('.ut-glass-header');
  const sidebar = document.querySelector<HTMLElement>('aside.ut-glass-sidebar');
  if (!header || !sidebar) return () => undefined;

  const media = window.matchMedia(DESKTOP_MQ);
  let frame = 0;
  const applied = new Map<string, string>();

  const setVar = (name: string, value: string) => {
    if (applied.get(name) === value) return;
    applied.set(name, value);
    root.style.setProperty(name, value);
  };

  const clearLayoutVars = () => {
    setVar('--gf-dock', '0px');
    setVar('--gf-max-h', '88vh');
    setVar('--gf-top-bound', '0px');
  };

  const recalc = () => {
    frame = 0;

    if (!media.matches) {
      root.classList.remove('glass-fused');
      clearLayoutVars();
      return;
    }

    const viewportH = window.innerHeight;
    const headerRect = header.getBoundingClientRect();

    // Keep a visible gap below the real header bounds. The header is sticky, so
    // its bottom edge is the authoritative collision boundary.
    const topBound = Math.max(0, headerRect.bottom + GAP_PX);
    const availableH = Math.max(
      MIN_SIDEBAR_HEIGHT_PX,
      viewportH - topBound - BOTTOM_MARGIN_PX,
    );

    // Center the sidebar inside the available region below the header.
    // Sidebar base CSS uses top:50% + translateY(-50%), so dock is the delta
    // between that viewport center and the available-region center.
    const availableCenter = topBound + availableH / 2;
    const dock = availableCenter - viewportH / 2;

    setVar('--gf-top-bound', `${topBound.toFixed(2)}px`);
    setVar('--gf-max-h', `${availableH.toFixed(2)}px`);
    setVar('--gf-dock', `${dock.toFixed(2)}px`);

    // The new layout keeps a deliberate gap, so the old flush glass-fusion
    // visual should not activate.
    root.classList.remove('glass-fused');
  };

  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(recalc);
  };

  const observer = new ResizeObserver(schedule);
  observer.observe(header);
  observer.observe(sidebar);
  window.addEventListener('resize', schedule);
  window.addEventListener('scroll', schedule, { passive: true });
  media.addEventListener('change', schedule);
  recalc();

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('resize', schedule);
    window.removeEventListener('scroll', schedule);
    media.removeEventListener('change', schedule);
    root.classList.remove('glass-fused');
    for (const name of applied.keys()) root.style.removeProperty(name);
    applied.clear();
  };
}
