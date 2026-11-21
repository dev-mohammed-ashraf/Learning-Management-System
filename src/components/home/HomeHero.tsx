import { useState, type MouseEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  GitBranch,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { LEARNING_PATHS } from '../../data/learningPlatform';
import { PROGRAMS } from '../../data/programs';
import type { Locale, Program } from '../../types/program';

interface HomeHeroProps {
  locale: Locale;
  onExplorePrograms: () => void;
  onLearnAbout: () => void;
  onOpenProgram?: (program: Program) => void;
  onNavigateToPaths?: () => void;
}

export function HomeHero({
  locale,
  onExplorePrograms,
  onLearnAbout,
  onOpenProgram,
  onNavigateToPaths,
}: HomeHeroProps) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const featuredCourse = PROGRAMS.find((p) => p.id === '5') ?? PROGRAMS[0];
  const featuredPath = LEARNING_PATHS[0];
  const totalDiplomas = PROGRAMS.length;

  const handlePointerMove = (e: MouseEvent<HTMLElement>) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({
      x: Math.round(nx * 12 * 10) / 10,
      y: Math.round(ny * 8 * 10) / 10,
    });
  };

  const handlePointerLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  const isRtl = locale === 'ar';

  return (
    <section
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="ut-page-hero relative overflow-hidden pt-[122px] pb-[64px] max-[1023px]:pt-[162px] max-[1023px]:pb-[50px] max-[767px]:pt-[204px] max-[767px]:pb-[40px] border-b border-white/10"
    >
      {/* Atmospheric Deep Navy Orbital Geometry & Controlled Radial Depth */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-[-8%] end-[2%] w-[720px] h-[580px] rounded-full opacity-[0.26]"
          style={{
            background:
              'radial-gradient(circle at center, rgba(40, 181, 197, 0.22) 0%, rgba(23, 107, 135, 0.08) 46%, transparent 72%)',
          }}
        />

        {/* Delicate Madar orbital trajectory lines */}
        <svg
          className="absolute top-[6%] end-[-2%] w-[760px] h-[620px] opacity-[0.15] text-[#28B5C5] max-[767px]:w-[420px] max-[767px]:h-[380px]"
          viewBox="0 0 760 620"
          fill="none"
        >
          <circle cx="430" cy="300" r="245" stroke="currentColor" strokeWidth="1" />
          <circle
            cx="430"
            cy="300"
            r="178"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 8"
          />
          <ellipse
            cx="420"
            cy="305"
            rx="315"
            ry="136"
            transform="rotate(-14 420 305)"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeOpacity="0.6"
          />
          <path
            d="M40 500 L250 300 L590 300"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      {/* Main Asymmetric Editorial Composition */}
      <div className="wrap relative">
        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,5.2fr)_minmax(0,6.8fr)] items-center gap-y-8 lg:gap-x-6 lg:min-h-[540px]">
          {/* Editorial Typography Column */}
          <div className="relative z-20 flex flex-col items-start madar-hero-enter">
            <div className="ut-eyebrow inline-flex items-center gap-[10px] text-[0.84rem] sm:text-[0.86rem] font-bold text-[#DDF3F5] mb-[14px]">
              <span>
                {isRtl
                  ? 'منصة مدار للتعلم الرقمي'
                  : 'Madar Digital Learning Platform'}
              </span>
            </div>

            <h1 className="text-[clamp(1.95rem,3.3vw,3.15rem)] font-extrabold leading-[1.22] text-white text-balance">
              {isRtl ? (
                <>
                  <span className="block">بوابتك الرقمية</span>
                  <span className="block mt-1">لصناعة مسارك التعليمي</span>
                  <span className="block mt-1 text-[#28B5C5]">بمعايير أكاديمية معتمدة</span>
                </>
              ) : (
                <>
                  <span className="block">Your Digital Orbit</span>
                  <span className="block mt-1">for Accredited Study</span>
                  <span className="block mt-1 text-[#28B5C5]">With Academic Depth</span>
                </>
              )}
            </h1>

            <div
              className="w-[56px] h-[2.5px] rounded-full bg-[#28B5C5] my-[16px] sm:my-[20px]"
              aria-hidden="true"
            />

            <p className="text-[#DDF3F5]/88 text-[1.02rem] max-[720px]:text-[0.94rem] leading-[1.8] max-w-[31rem]">
              {isRtl
                ? 'بيئة تعلّم إلكترونية متكاملة تتيح لك دراسة برامج الدبلوم المهني المعتمدة عن بُعد، وفق جدول مسائي مرن يربط التأصيل العلمي بالتطبيق العملي.'
                : 'A structured online learning environment offering accredited professional associate diplomas with flexible evening instruction uniting foundational clarity and applied practice.'}
            </p>

            {/* Primary & Secondary CTA Buttons (Flat primary button, zero glow shadow) */}
            <div className="flex flex-wrap items-center gap-[12px] mt-[22px] sm:mt-[26px] max-[520px]:w-full">
              <button
                type="button"
                onClick={onExplorePrograms}
                className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[26px] py-[13px] font-bold text-[0.96rem] bg-[#28B5C5] text-[#142D4E] hover:bg-[#DDF3F5] transition-colors duration-200 cursor-pointer max-[520px]:flex-1 whitespace-nowrap"
              >
                <span>{isRtl ? 'اكتشف الدورات' : 'Explore Courses'}</span>
                {isRtl ? (
                  <ArrowLeft className="w-[18px] h-[18px] flex-none" aria-hidden="true" />
                ) : (
                  <ArrowRight className="w-[18px] h-[18px] flex-none" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={onLearnAbout}
                className="inline-flex items-center justify-center gap-[8px] rounded-[12px] px-[24px] py-[13px] font-bold text-[0.96rem] border border-[#DDF3F5]/30 bg-white/[0.06] text-white hover:border-[#28B5C5] hover:text-[#28B5C5] hover:bg-white/[0.1] transition-colors duration-200 cursor-pointer max-[520px]:flex-1 whitespace-nowrap"
              >
                <Compass className="w-[17px] h-[17px] flex-none" aria-hidden="true" />
                <span>{isRtl ? 'تعرّف على المنصة' : 'About the Platform'}</span>
              </button>
            </div>

            {/* Clean Unboxed Structural Metadata Strip (zero pill capsules) */}
            <div className="mt-[22px] sm:mt-[26px] pt-[16px] border-t border-white/12 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] font-medium text-[#DDF3F5]/80">
              <span className="num font-bold text-white">
                {isRtl ? `${totalDiplomas} دبلومات معتمدة` : `${totalDiplomas} Accredited Diplomas`}
              </span>
              <span className="text-[#28B5C5]" aria-hidden="true">·</span>
              <span className="num">
                {isRtl ? '30 ساعة معتمدة لكل مسار' : '30 Credit Hours / Track'}
              </span>
              <span className="text-[#28B5C5]" aria-hidden="true">·</span>
              <span>
                {isRtl ? 'دراسة مسائية عن بُعد' : 'Live Evening Online Study'}
              </span>
            </div>
          </div>

          {/* Immersive Blended 3D Educational Scene + Floating Platform Cards */}
          <div className="relative z-10 flex flex-col items-center justify-center madar-hero-enter-delayed">
            <div
              className="relative w-full max-w-[740px] lg:ms-auto"
              style={{
                transform: `translate3d(${parallax.x * 0.45}px, ${parallax.y * 0.45}px, 0)`,
                transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Soft radial backdrop light integrated with canvas */}
              <div
                className="pointer-events-none absolute inset-[6%] rounded-full opacity-55"
                style={{
                  background:
                    'radial-gradient(circle at 52% 48%, rgba(40, 181, 197, 0.22) 0%, rgba(23, 107, 135, 0.08) 50%, transparent 72%)',
                }}
                aria-hidden="true"
              />

              {/* Seamless 3D Educational Centerpiece Artwork (lighten-blended + tight edge-mask, zero dark box seam) */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full flex items-center justify-center">
                <img
                  src="/src/assets/images/madar_hero_scene_1795286864733.jpg"
                  alt={
                    isRtl
                      ? 'مشهد تعليمي رقمي ثلاثي الأبعاد يضم كتابًا أكاديميًا مفتوحًا وجهازًا لوحيًا لعرض الوحدات الدراسية وأشكالًا هندسية مضيئة'
                      : 'Art-directed 3D digital learning scene featuring an open academic book, tablet course interface, and frosted orbital geometry'
                  }
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain sm:object-cover object-center select-none mix-blend-lighten"
                  style={{
                    WebkitMaskImage:
                      'radial-gradient(ellipse 68% 66% at 50% 50%, #000 38%, rgba(0,0,0,0.48) 62%, transparent 88%)',
                    maskImage:
                      'radial-gradient(ellipse 68% 66% at 50% 50%, #000 38%, rgba(0,0,0,0.48) 62%, transparent 88%)',
                  }}
                />
              </div>

              {/* Floating Card 1: Real Featured Course Syllabus Card (Desktop, Tablet, Mobile) */}
              <button
                type="button"
                onClick={() => onOpenProgram?.(featuredCourse)}
                style={{
                  transform: `translate3d(${parallax.x * -0.45}px, ${parallax.y * -0.45}px, 0)`,
                  transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group text-start w-full max-w-[320px] sm:w-[276px] sm:absolute sm:top-[4%] sm:start-[0%] mt-2 sm:mt-0 mx-auto rounded-[16px] p-[14px] backdrop-blur-xl bg-[#0D213B]/84 border border-[#28B5C5]/30 hover:border-[#28B5C5]/75 hover:bg-[#112A4A]/92 shadow-[0_14px_34px_rgba(6,16,32,0.4)] cursor-pointer transition-colors duration-200 madar-float-slow"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0">
                    <div className="text-[0.72rem] font-semibold text-[#28B5C5] flex items-center gap-1.5">
                      <span>{isRtl ? 'دبلوم مشارك مهني' : 'Associate Diploma'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="num">{isRtl ? '30 ساعة معتمدة' : '30 Credit Hrs'}</span>
                    </div>
                    <div className="text-[0.92rem] font-bold text-white leading-[1.35] mt-1">
                      {isRtl ? 'دبلوم إدارة الأعمال' : 'Business Administration'}
                    </div>
                  </div>
                  <span className="w-[34px] h-[34px] rounded-[10px] bg-[#28B5C5]/15 border border-[#28B5C5]/30 grid place-items-center text-[#28B5C5] flex-none group-hover:bg-[#28B5C5] group-hover:text-[#0B1726] transition-colors">
                    <BookOpen className="w-[16px] h-[16px]" aria-hidden="true" />
                  </span>
                </div>

                {/* Structural 4-module syllabus sequence indicator */}
                <div className="mt-3 pt-2.5 border-t border-white/10">
                  <div className="flex items-center justify-between text-[0.72rem] text-[#DDF3F5]/80 mb-1.5">
                    <span>
                      {isRtl ? 'هيكل المقرر التطبيقي' : 'Applied Curriculum Structure'}
                    </span>
                    <span className="num font-bold text-[#28B5C5]">
                      {isRtl
                        ? `${featuredCourse.modulesAr.length} وحدات`
                        : `${featuredCourse.modulesEn.length} Modules`}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {featuredCourse.modulesAr.map((_, idx) => (
                      <span
                        key={idx}
                        className="h-[4px] rounded-full bg-[#28B5C5]/80 group-hover:bg-[#28B5C5] transition-colors"
                      />
                    ))}
                  </div>
                </div>
              </button>

              {/* Floating Card 2: Real Learning Path Preview Card (Desktop & Tablet) */}
              <button
                type="button"
                onClick={() => onNavigateToPaths?.()}
                style={{
                  transform: `translate3d(${parallax.x * 0.38}px, ${parallax.y * 0.38}px, 0)`,
                  transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="hidden sm:block group text-start w-[268px] absolute bottom-[9%] end-[1%] lg:end-[2%] rounded-[16px] p-[14px] backdrop-blur-xl bg-[#0D213B]/84 border border-white/18 hover:border-[#28B5C5]/70 hover:bg-[#112A4A]/92 shadow-[0_14px_34px_rgba(6,16,32,0.4)] cursor-pointer transition-colors duration-200 madar-float-alt"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[0.72rem] font-semibold text-[#DDF3F5]/78">
                    {isRtl ? 'مسار تعليمي متسلسل' : 'Structured Learning Path'}
                  </span>
                  <GitBranch
                    className="w-[15px] h-[15px] text-[#28B5C5] flex-none"
                    aria-hidden="true"
                  />
                </div>
                <div className="text-[0.86rem] font-bold text-white leading-[1.4]">
                  {isRtl ? featuredPath.titleAr : featuredPath.titleEn}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[0.72rem] text-[#DDF3F5]/85">
                  <span className="font-medium">
                    {isRtl ? 'إدارة الأعمال' : 'Business Admin'}
                  </span>
                  <span className="text-[#28B5C5] flex-none" aria-hidden="true">
                    {isRtl ? '←' : '→'}
                  </span>
                  <span className="font-medium">
                    {isRtl ? 'المشتريات والعقود' : 'Procurement'}
                  </span>
                </div>
              </button>

              {/* Floating Card 3: Neutral Academic Catalog Structure Card (Desktop only) */}
              <button
                type="button"
                onClick={onExplorePrograms}
                style={{
                  transform: `translate3d(${parallax.x * -0.28}px, ${parallax.y * 0.3}px, 0)`,
                  transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="hidden lg:flex items-center gap-3 text-start absolute top-[8%] end-[2%] rounded-[15px] px-[14px] py-[11px] backdrop-blur-xl bg-[#0D213B]/82 border border-white/16 hover:border-[#28B5C5]/65 hover:bg-[#112A4A]/92 shadow-[0_12px_28px_rgba(6,16,32,0.38)] cursor-pointer transition-colors duration-200"
              >
                <span className="w-[36px] h-[36px] rounded-[10px] bg-[#28B5C5]/14 border border-[#28B5C5]/28 grid place-items-center text-[#28B5C5] flex-none">
                  <GraduationCap className="w-[18px] h-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <div className="num text-[0.95rem] font-extrabold text-white leading-[1.2]">
                    {isRtl
                      ? `${totalDiplomas} دبلومات مهنية`
                      : `${totalDiplomas} Professional Diplomas`}
                  </div>
                  <div className="text-[0.72rem] text-[#DDF3F5]/78 mt-0.5 flex items-center gap-1">
                    <Layers className="w-[12px] h-[12px] text-[#28B5C5] flex-none" aria-hidden="true" />
                    <span>{isRtl ? 'تدريب مهني معتمد' : 'Accredited Professional Training'}</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
