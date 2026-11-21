/**
 * Glass Fusion controller.
 *
 * Detects when the Floating Glass Sidebar approaches or touches the Floating
 * Glass Header (both are viewport-anchored, so proximity only changes on
 * viewport resizes, sidebar width transitions, or content reflows) and drives
 * a single `glass-fused` class on <html> plus a few CSS custom properties.
 *
 * - Zero React re-renders: measurement happens in a ResizeObserver + rAF and
 *   is written straight to CSS custom properties.
 * - The fused geometry assumes a butt joint (sidebar top edge == header bottom
 *   edge); the sidebar glides into that position via a `translate` offset
 *   (`--gf-dock`) so no layout property of the page ever changes.
 * - `--gf-seam-end` / `--gf-left-fade` position the header's masked border
 *   lines; `--gf-fa-r` / `--gf-fb-r` size the two concave fillets.
 */
const DESKTOP_MQ = '(min-width: 1024px)';

/** Gap (px) between the sidebar top and the header bottom that starts the fusion. */
const ENGAGE_GAP_PX = 28;
/** Gap (px) that must be exceeded before the fusion releases (hysteresis). */
const RELEASE_GAP_PX = 36;
/** Radius of the concave fillet where the sidebar's right edge meets the header. */
const FILLET_B_RADIUS = 16;

export function initGlassFusion(): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>('.ut-glass-header');
  const sidebar = document.querySelector<HTMLElement>('aside.ut-glass-sidebar');
  if (!header || !sidebar) return () => undefined;

  const media = window.matchMedia(DESKTOP_MQ);
  let fused = false;
  let frame = 0;
  const applied = new Map<string, string>();

  const setVar = (name: string, value: string) => {
    if (applied.get(name) === value) return;
    applied.set(name, value);
    root.style.setProperty(name, value);
  };

  const setFused = (next: boolean) => {
    if (next === fused) return;
    fused = next;
    root.classList.toggle('glass-fused', fused);
  };

  const recalc = () => {
    frame = 0;

    if (!media.matches) {
      // Fusion is a laptop/desktop effect only; the mobile layouts differ.
      setFused(false);
      setVar('--gf-dock', '0px');
      setVar('--gf-seam-end', '0px');
      setVar('--gf-left-fade', '0px');
      return;
    }

    const viewportH = window.innerHeight;
    const headerRect = header.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();
    const joinBottom = headerRect.bottom;

    // Height the sidebar would have in the separate, vertically centered
    // state (scrollHeight reports the full content height even while the
    // fused max-height cap shrinks the rendered box -> no feedback loop).
    const separateHeight = Math.min(sidebar.scrollHeight, viewportH * 0.88);
    const gap = (viewportH - separateHeight) / 2 - joinBottom;

    const overlapLeft = headerRect.left - sidebarRect.left; // normally 20px
    const seamWidth = sidebarRect.right - headerRect.left; // 66px collapsed / 244px expanded
    const geometryOk = overlapLeft >= 0 && overlapLeft <= 26 && seamWidth >= 40;

    const threshold = fused ? RELEASE_GAP_PX : ENGAGE_GAP_PX;
    setFused(geometryOk && gap <= threshold);

    // Fillet radii adapt to the measured contact geometry.
    setVar('--gf-fa-r', `${Math.min(20, Math.max(8, overlapLeft))}px`);
    setVar('--gf-fb-r', `${FILLET_B_RADIUS}px`);

    if (!fused) {
      setVar('--gf-dock', '0px');
      setVar('--gf-seam-end', '0px');
      setVar('--gf-left-fade', '0px');
      return;
    }

    // Dock: shift the sidebar's translate so its top edge lands exactly on the
    // header's bottom edge (top:50% + translate -50% + dock == joinBottom).
    const dock = joinBottom - viewportH / 2 + sidebarRect.height / 2;
    setVar('--gf-dock', `${dock.toFixed(2)}px`);
    // Header bottom border fades from its left edge to the right fillet tangent.
    setVar(
      '--gf-seam-end',
      `${(sidebarRect.right + FILLET_B_RADIUS - headerRect.left).toFixed(2)}px`,
    );
    // Header left border fades below the left fillet tangent.
    setVar(
      '--gf-left-fade',
      `${(joinBottom - Math.min(20, Math.max(8, overlapLeft)) - headerRect.top).toFixed(2)}px`,
    );
  };

  const schedule = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(recalc);
  };

  const observer = new ResizeObserver(schedule);
  observer.observe(header);
  observer.observe(sidebar);
  window.addEventListener('resize', schedule);
  media.addEventListener('change', schedule);
  recalc();

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('resize', schedule);
    media.removeEventListener('change', schedule);
    root.classList.remove('glass-fused');
    for (const name of applied.keys()) root.style.removeProperty(name);
    applied.clear();
  };
}
