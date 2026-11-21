import { useState } from 'react';
import {
  BookOpen,
  Brain,
  Calendar,
  Check,
  Copy,
  FileText,
  HelpCircle,
  Info,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { AI_LEARNING_TOOLS } from '../../data/learningPlatform';
import type { Locale, Program } from '../../types/program';
import type { AiToolId } from '../../types/student';
import { PageHeroBanner } from '../common/PageHeroBanner';

interface AiToolsPageProps {
  locale: Locale;
  programs: Program[];
  onGoHome: () => void;
}

const TOOL_ICONS: Record<AiToolId, typeof Brain> = {
  'concept-explainer': Sparkles,
  'content-summarizer': FileText,
  'review-questions': HelpCircle,
  'study-planner': Calendar,
  'idea-organizer': Lightbulb,
};

export function AiToolsPage({ locale, programs, onGoHome }: AiToolsPageProps) {
  const [activeToolId, setActiveToolId] = useState<AiToolId>('concept-explainer');
  const [selectedProgramId, setSelectedProgramId] = useState<string>(programs[0]?.id ?? '');
  const [topicInput, setTopicInput] = useState('');
  const [builtPrompt, setBuiltPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const activeTool =
    AI_LEARNING_TOOLS.find((t) => t.id === activeToolId) ?? AI_LEARNING_TOOLS[0];
  const selectedProgram = programs.find((p) => p.id === selectedProgramId) ?? programs[0];

  const handleComposePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    const courseTitle = selectedProgram
      ? locale === 'ar'
        ? selectedProgram.titleAr
        : selectedProgram.titleEn
      : '';
    const cleanInput =
      topicInput.trim() ||
      (locale === 'ar' ? activeTool.exampleTopicAr : activeTool.exampleTopicEn);

    const promptText =
      locale === 'ar'
        ? `[أداة التعلم]: ${activeTool.titleAr}\n[الدورة المرتبطة]: ${courseTitle}\n[الطلب الدراسي]: ${cleanInput}\n[التوجيه المطلوب]: قدّم مخرجات واضحة ومنظمة تناسب مستوى الدبلوم المشارك المهني باللغة العربية الفصحى.`
        : `[Learning Tool]: ${activeTool.titleEn}\n[Course Context]: ${courseTitle}\n[Study Request]: ${cleanInput}\n[Guidance]: Provide a clear, structured academic output aligned with associate diploma coursework.`;

    setBuiltPrompt(promptText);
    setCopied(false);
  };

  const handleCopyPrompt = async () => {
    if (!builtPrompt) return;
    try {
      await navigator.clipboard.writeText(builtPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <PageHeroBanner
        locale={locale}
        eyebrowAr="مساندة التعلم الذكية"
        eyebrowEn="Guided Study Workspace"
        titleAr="أدوات الذكاء الاصطناعي للتعلم"
        titleEn="AI Learning Tools"
        descriptionAr="مساحة عمل تفاعلية لاختيار أداة المذاكرة المناسبة، وتحديد سياق الدورة الدراسية، وإعداد طلبات تعليمية دقيقة قبل إرسالها لمحرك الذكاء الاصطناعي."
        descriptionEn="Select a specialized learning tool, pair it with your course context, and compose structured study requests ready for the AI service endpoint."
        onGoHome={onGoHome}
      />

      <section className="py-[32px] pb-[72px]">
        <div className="wrap space-y-6">
          {/* Honest AI Backend Notice */}
          <div className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#28B5C5]/35 rounded-[16px] p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#176B87] dark:text-[#28B5C5] flex-none mt-0.5" aria-hidden="true" />
            <p className="text-[0.88rem] text-[#183247] dark:text-[#CBD8E6] leading-relaxed">
              <strong className="text-[#142D4E] dark:text-[#F1F5F9]">
                {locale === 'ar'
                  ? 'نقطة تكامل خدمة الذكاء الاصطناعي (/api/ai): '
                  : 'AI Backend Integration Point (/api/ai): '}
              </strong>
              {locale === 'ar'
                ? 'لا تولّد هذه الواجهة إجابات نصية مزيفة ولا تستخدم مفاتيح API في المتصفح؛ يمكنك تجهيز ونسخ قالب الطلب التعليمي المرتبط بمحاور دورتك هنا ريثما يتم ربط خادم الذكاء الاصطناعي من جهة الخادم.'
                : 'This workspace does not fabricate simulated LLM answers or expose API keys on the client. Build and copy course-contextualized prompts here; live responses connect once a server-side /api/ai endpoint is enabled.'}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-[22px]">
            {/* 5 Structured AI Tools List */}
            <div className="col-span-12 lg:col-span-5 space-y-3">
              {AI_LEARNING_TOOLS.map((tool) => {
                const Icon = TOOL_ICONS[tool.id];
                const isSelected = tool.id === activeToolId;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      setActiveToolId(tool.id);
                      setBuiltPrompt('');
                      setCopied(false);
                    }}
                    className={`w-full text-start rounded-[16px] p-[18px] border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#DDF3F5]/80 border-[#28B5C5] dark:bg-[#1B3553] dark:border-[#28B5C5]'
                        : 'bg-white border-[#DCE7ED] hover:border-[#28B5C5]/60 dark:bg-[#142D4E] dark:border-white/12'
                    }`}
                  >
                    <span
                      className={`w-[40px] h-[40px] rounded-[11px] grid place-items-center flex-none ${
                        isSelected
                          ? 'bg-[#176B87] text-white dark:bg-[#28B5C5] dark:text-[#0B1726]'
                          : 'bg-[#EAF3F6] text-[#176B87] dark:bg-[#102238] dark:text-[#28B5C5]'
                      }`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-extrabold text-[0.98rem] text-[#142D4E] dark:text-[#F1F5F9]">
                        {locale === 'ar' ? tool.titleAr : tool.titleEn}
                      </h2>
                      <p className="text-[0.82rem] text-[#64748B] dark:text-[#B8C7D9] mt-1 leading-relaxed">
                        {locale === 'ar' ? tool.descriptionAr : tool.descriptionEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Tool Workspace */}
            <div className="col-span-12 lg:col-span-7 bg-white dark:bg-[#142D4E] border border-[#DCE7ED] dark:border-white/12 rounded-[16px] p-[24px] flex flex-col gap-5">
              <div className="flex items-center gap-3 pb-4 border-b border-[#DCE7ED] dark:border-white/12">
                <Brain className="w-6 h-6 text-[#176B87] dark:text-[#28B5C5]" aria-hidden="true" />
                <div>
                  <h3 className="text-[1.15rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                    {locale === 'ar' ? activeTool.titleAr : activeTool.titleEn}
                  </h3>
                  <p className="text-[0.84rem] text-[#64748B] dark:text-[#B8C7D9]">
                    {locale === 'ar' ? activeTool.descriptionAr : activeTool.descriptionEn}
                  </p>
                </div>
              </div>

              <form onSubmit={handleComposePrompt} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[0.84rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                    {locale === 'ar' ? 'اختر الدورة المرتبطة' : 'Select Course Context'}
                  </label>
                  <select
                    value={selectedProgramId}
                    onChange={(e) => setSelectedProgramId(e.target.value)}
                    className="ut-filter-select w-full h-[46px] rounded-[12px] border border-[#DCE7ED] bg-[#EAF3F6] text-[0.9rem] font-bold text-[#142D4E] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                  >
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {locale === 'ar' ? program.titleAr : program.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProgram && (
                  <div className="bg-[#F8FBFD] dark:bg-[#102238] border border-[#DCE7ED] dark:border-white/10 rounded-[12px] p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[0.78rem] font-bold text-[#176B87] dark:text-[#28B5C5]">
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>
                        {locale === 'ar'
                          ? 'انقر لإدراج محور من الدورة في موضوع الطلب:'
                          : 'Click a module to pre-fill your study prompt:'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(locale === 'ar'
                        ? selectedProgram.modulesAr
                        : selectedProgram.modulesEn
                      ).map((mod) => (
                        <button
                          key={mod}
                          type="button"
                          onClick={() => setTopicInput(mod)}
                          className="text-[0.78rem] font-semibold px-2.5 py-1 rounded-[8px] border border-[#DCE7ED] bg-white text-[#142D4E] hover:border-[#28B5C5] dark:bg-[#142D4E] dark:border-white/15 dark:text-[#F1F5F9] cursor-pointer"
                        >
                          {mod}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[0.84rem] font-bold text-[#142D4E] dark:text-[#F1F5F9]">
                    {locale === 'ar' ? 'الموضوع أو المحتوى الدراسي' : 'Study Topic or Content'}
                  </label>
                  <textarea
                    rows={4}
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder={
                      locale === 'ar'
                        ? activeTool.promptPlaceholderAr
                        : activeTool.promptPlaceholderEn
                    }
                    className="w-full p-3.5 rounded-[12px] border border-[#DCE7ED] bg-[#EAF3F6] focus:bg-white focus:outline-none focus:border-[#28B5C5] text-[0.9rem] dark:border-white/12 dark:bg-[#102238] dark:text-[#F1F5F9]"
                  />
                </div>

                <button
                  type="submit"
                  className="h-[46px] px-6 rounded-[12px] bg-[#176B87] text-white font-bold text-[0.9rem] hover:bg-[#142D4E] dark:bg-[#28B5C5] dark:text-[#0B1726] dark:hover:bg-[#DDF3F5] cursor-pointer"
                >
                  {locale === 'ar' ? 'تجهيز الطلب المنظم' : 'Compose Structured Study Prompt'}
                </button>
              </form>

              {builtPrompt && (
                <div className="bg-[#EAF3F6] dark:bg-[#102238] border border-[#28B5C5]/40 rounded-[14px] p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.82rem] font-extrabold text-[#142D4E] dark:text-[#F1F5F9]">
                      {locale === 'ar'
                        ? 'الطلب الجاهز للإرسال إلى خدمة الذكاء الاصطناعي:'
                        : 'Structured Prompt Ready for AI Endpoint:'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1 text-[0.78rem] font-bold bg-white border border-[#DCE7ED] text-[#142D4E] hover:border-[#28B5C5] dark:bg-[#142D4E] dark:border-white/15 dark:text-[#F1F5F9] cursor-pointer"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-[#1F8A5B]" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>
                        {copied
                          ? locale === 'ar'
                            ? 'تم النسخ'
                            : 'Copied'
                          : locale === 'ar'
                            ? 'نسخ النص'
                            : 'Copy'}
                      </span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-[0.84rem] leading-relaxed font-sans text-[#183247] dark:text-[#E2E8F0]">
                    {builtPrompt}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
