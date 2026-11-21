import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import type { Locale } from '../../types/program';

interface FloatingWidgetsProps {
  locale: Locale;
  onOpenPrivacy: () => void;
}

export function FloatingWidgets({ locale, onOpenPrivacy }: FloatingWidgetsProps) {
  const [showTop, setShowTop] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = window.localStorage.getItem('madar_cookies_ok');
      if (!accepted) {
        setCookieVisible(true);
      }
    } catch {
      setCookieVisible(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const acceptCookies = () => {
    try {
      window.localStorage.setItem('madar_cookies_ok', '1');
    } catch {
      // ignore storage failure
    }
    setCookieVisible(false);
  };

  const bottomOffset = cookieVisible
    ? 'bottom-[104px] max-[600px]:bottom-[calc(168px_+_env(safe-area-inset-bottom))]'
    : 'bottom-[20px] max-[600px]:bottom-[calc(16px_+_env(safe-area-inset-bottom))]';

  return (
    <>
      <a
        href="https://wa.me/966546505679"
        target="_blank"
        rel="noopener noreferrer"
        title={locale === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact us via WhatsApp'}
        aria-label={locale === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact us via WhatsApp'}
        className={`fixed start-[22px] z-[70] w-[54px] h-[54px] rounded-full bg-[#25D366] text-white grid place-items-center shadow-[0_12px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-200 ${bottomOffset}`}
      >
        {/* Official WhatsApp brand glyph — Simple Icons (CC0), rendered white via currentColor */}
        <svg viewBox="0 0 24 24" className="w-[28px] h-[28px]" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title={locale === 'ar' ? 'العودة للأعلى' : 'Back to Top'}
        aria-label={locale === 'ar' ? 'العودة للأعلى' : 'Back to Top'}
        className={`fixed end-[22px] z-[70] w-[46px] h-[46px] rounded-[12px] bg-white border border-[#DCE7ED] text-[#176B87] dark:bg-[#142D4E] dark:border-white/12 dark:text-[#28B5C5] grid place-items-center shadow-[0_8px_26px_rgba(20,45,78,0.08)] dark:shadow-[0_8px_26px_rgba(0,0,0,0.4)] hover:border-[#28B5C5] hover:-translate-y-[3px] transition-all duration-200 cursor-pointer ${bottomOffset} ${
          showTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-[20px] h-[20px]" aria-hidden="true" />
      </button>

      {cookieVisible && (
        <div
          id="cookieBar"
          role="dialog"
          aria-live="polite"
          aria-label={locale === 'ar' ? 'إشعار ملفات الارتباط' : 'Cookie Consent Notice'}
          className="fixed bottom-0 inset-x-0 z-[90] bg-white border-t border-[#DCE7ED] dark:bg-[#102238] dark:border-white/12 shadow-[0_-8px_24px_rgba(20,45,78,0.08)] dark:shadow-[0_-8px_28px_rgba(0,0,0,0.45)] py-[16px] px-[24px]"
        >
          <div className="max-w-[1320px] mx-auto flex items-center gap-[20px] flex-wrap justify-center">
            <p className="text-[#64748B] dark:text-[#B8C7D9] text-[0.86rem] leading-[1.9] flex-1 min-w-[260px] m-0">
              {locale === 'ar'
                ? 'نستخدم ملفات تعريف الارتباط لحفظ تفضيلات اللغة وتحسين تجربتك الدراسية عبر المنصة. بمواصلتك التصفح فإنك توافق على استخدامها. '
                : 'We use cookies to preserve language settings and enhance your learning experience on the platform. By continuing to browse, you consent to their use. '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-[#176B87] dark:text-[#28B5C5] font-bold underline underline-offset-[3px] hover:text-[#142D4E] dark:hover:text-[#F1F5F9] cursor-pointer"
              >
                {locale === 'ar' ? 'اطّلع على السياسات' : 'Learn more'}
              </button>
            </p>
            <button
              type="button"
              onClick={acceptCookies}
              className="flex-none inline-flex items-center justify-center rounded-[10px] px-[18px] py-[8px] font-bold text-[0.84rem] bg-[#176B87] text-white hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] transition-colors cursor-pointer"
            >
              {locale === 'ar' ? 'موافق' : 'Accept'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
