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
      const accepted = window.localStorage.getItem('tabuk_cookies_ok');
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
      window.localStorage.setItem('tabuk_cookies_ok', '1');
    } catch {
      // ignore storage failure
    }
    setCookieVisible(false);
  };

  const bottomOffset = cookieVisible
    ? 'bottom-[104px] max-[600px]:bottom-[172px]'
    : 'bottom-[22px]';

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
        <svg viewBox="0 0 24 24" className="w-[28px] h-[28px]" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3a9 9 0 0 0-7.8 13.4L3 21l4.7-1.2A9 9 0 1 0 12 3Z"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 8.5c-.4 2.2 1.8 5.4 4.7 6.4.9.3 1.9-.1 2.3-.9l.3-.7-2-1.2-.9.9c-1-.5-2.1-1.6-2.5-2.6l1-.7L10.8 8l-.8.1c-.5.05-.9.4-1 .4Z"
          />
        </svg>
      </a>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title={locale === 'ar' ? 'العودة للأعلى' : 'Back to Top'}
        aria-label={locale === 'ar' ? 'العودة للأعلى' : 'Back to Top'}
        className={`fixed end-[22px] z-[70] w-[46px] h-[46px] rounded-[12px] bg-white border border-[#E3EAF1] text-[#1C5D92] grid place-items-center shadow-[0_8px_26px_rgba(12,59,97,0.06)] hover:-translate-y-[3px] transition-all duration-200 cursor-pointer ${bottomOffset} ${
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
          className="fixed bottom-0 inset-x-0 z-[90] bg-white border-t border-[#E3EAF1] shadow-[0_-8px_24px_rgba(16,24,40,0.08)] py-[16px] px-[24px]"
        >
          <div className="max-w-[1320px] mx-auto flex items-center gap-[20px] flex-wrap justify-center">
            <p className="text-[#5E7489] text-[0.86rem] leading-[1.9] flex-1 min-w-[260px] m-0">
              {locale === 'ar'
                ? 'نستخدم ملفات تعريف الارتباط (الكوكيز) لتحسين تجربتك وتحليل استخدام الموقع. بمواصلتك التصفح فإنك توافق على استخدامها. '
                : 'We use cookies to enhance your experience and analyze site usage. By continuing to browse, you consent to their use. '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-[#1C5D92] font-bold underline underline-offset-[3px] cursor-pointer"
              >
                {locale === 'ar' ? 'اعرف المزيد' : 'Learn more'}
              </button>
            </p>
            <button
              type="button"
              onClick={acceptCookies}
              className="flex-none inline-flex items-center justify-center rounded-[8px] px-[16px] py-[7px] font-bold text-[0.83rem] bg-[#1C5D92] text-white hover:bg-[#154A76] transition-colors cursor-pointer"
            >
              {locale === 'ar' ? 'موافق' : 'Accept'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
