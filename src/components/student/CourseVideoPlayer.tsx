import { useState } from 'react';
import { AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import type { DemoLesson } from '../../types/coursePlayer';
import type { Locale } from '../../types/program';

type PlayerStatus = 'loading' | 'ready' | 'error';

interface CourseVideoPlayerProps {
  locale: Locale;
  lesson: DemoLesson;
  poster: string;
}

/**
 * Responsive 16:9 HTML5 video player for demo lessons.
 * Uses native controls (play/pause, volume, progress, fullscreen) with a
 * loading state and a friendly fallback when the sample video fails to load.
 */
export function CourseVideoPlayer({ locale, lesson, poster }: CourseVideoPlayerProps) {
  const [status, setStatus] = useState<PlayerStatus>('loading');
  const [reloadKey, setReloadKey] = useState(0);

  const isAr = locale === 'ar';

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-[14px] border border-[#0E223D]/20 bg-black shadow-[0_18px_40px_rgba(20,45,78,0.18)] dark:border-white/10">
      <video
        key={`${lesson.id}-${reloadKey}`}
        src={lesson.videoUrl}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full"
        onLoadedMetadata={() => setStatus((prev) => (prev === 'error' ? prev : 'ready'))}
        onCanPlay={() => setStatus((prev) => (prev === 'error' ? prev : 'ready'))}
        onPlaying={() => setStatus((prev) => (prev === 'error' ? prev : 'ready'))}
        onError={() => setStatus('error')}
      >
        <track kind="captions" />
      </video>

      {status === 'loading' && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[#0B1726]/80 backdrop-blur-[2px] pointer-events-none">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <Loader2 className="w-9 h-9 text-[#28B5C5] animate-spin" aria-hidden="true" />
            <p className="text-[0.9rem] font-semibold text-[#DDF3F5]">
              {isAr ? 'جارٍ تحميل الدرس…' : 'Loading lesson…'}
            </p>
            <p className="num text-[0.76rem] text-[#B8C7D9]">
              {isAr ? lesson.titleAr : lesson.titleEn}
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[#0B1726]/92 px-6">
          <div className="flex flex-col items-center gap-3 text-center max-w-[420px]">
            <div className="w-12 h-12 rounded-full bg-[#C0392B]/15 grid place-items-center">
              <AlertTriangle className="w-6 h-6 text-[#FCA5A5]" aria-hidden="true" />
            </div>
            <p className="text-[0.95rem] font-bold text-[#F1F5F9]">
              {isAr ? 'تعذّر تشغيل الفيديو التجريبي' : 'The demo video could not be played'}
            </p>
            <p className="text-[0.82rem] text-[#B8C7D9] leading-relaxed">
              {isAr
                ? 'تحقق من اتصالك بالإنترنت ثم أعد المحاولة، أو انتقل إلى الدرس التالي ومتابعة التعلم.'
                : 'Check your internet connection and try again, or continue to the next lesson.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setReloadKey((k) => k + 1);
                setStatus('loading');
              }}
              className="mt-1 inline-flex items-center gap-2 rounded-[10px] bg-[#28B5C5] px-4 py-2 text-[0.85rem] font-bold text-[#0B1726] hover:bg-[#DDF3F5] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
