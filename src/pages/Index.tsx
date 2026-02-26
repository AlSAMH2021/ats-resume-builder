import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { FileDown, Copy, RotateCcw, FileText, Languages, FileType, Share2, Settings2 } from "lucide-react";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import TargetChecklist from "@/components/resume/TargetChecklist";
import type { SectionProgress } from "@/lib/careerTargets";
import TemplateSelector, { type ResumeTemplate } from "@/components/resume/TemplateSelector";
import ColorCustomizer, { type ResumeColors, templateDefaultColors } from "@/components/resume/ColorCustomizer";
import SectionReorder, { type ResumeSection, defaultSectionOrder } from "@/components/resume/SectionReorder";
import OnboardingQuiz, { type OnboardingTargets } from "@/components/resume/OnboardingQuiz";
import SetupReadyScreen from "@/components/resume/SetupReadyScreen";
import { resumeSchema, defaultResumeData, type ResumeData } from "@/types/resume";
import { demoDataEn, demoDataAr } from "@/lib/demoData";
import { resumeToPlainText } from "@/lib/atsKeywords";
import { exportToDocx } from "@/lib/exportDocx";
import { encodeResumeToUrl, decodeResumeFromUrl } from "@/lib/shareResume";
import { generateSmartSetup, type SmartSetupResult } from "@/lib/smartSetup";
import seeratyLogo from "@/assets/seeraty_logo.png";

const STORAGE_KEY = "ats-resume-data";
const ONBOARDING_KEY = "seeraty-onboarding-done";
const TARGETS_KEY = "seeraty-targets";

function loadSavedData(): ResumeData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultResumeData;
}

const Index = () => {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [template, setTemplate] = useState<ResumeTemplate>('classic');
  const [colors, setColors] = useState<ResumeColors>(templateDefaultColors.classic);
  const [sectionOrder, setSectionOrder] = useState<ResumeSection[]>(defaultSectionOrder);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem(ONBOARDING_KEY);
  });
  const [smartSetup, setSmartSetup] = useState<SmartSetupResult | null>(null);
  const [targets, setTargets] = useState<OnboardingTargets | null>(() => {
    try {
      const saved = localStorage.getItem(TARGETS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [showTargets, setShowTargets] = useState(false);
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);

  const handleTemplateChange = useCallback((t: ResumeTemplate) => {
    setTemplate(t);
    setColors(templateDefaultColors[t]);
  }, []);

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: loadSavedData(),
    mode: "onChange",
  });

  const watchedData = form.watch();

  // Load from shared URL on mount
  useEffect(() => {
    const shared = decodeResumeFromUrl();
    if (shared) {
      form.reset(shared);
      window.history.replaceState({}, "", window.location.pathname);
      toast.success(lang === 'ar' ? "تم تحميل السيرة من الرابط" : "Resume loaded from shared link");
      setShowOnboarding(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save
  useEffect(() => {
    const sub = form.watch((data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {}
    });
    return () => sub.unsubscribe();
  }, [form]);

  const handleOnboardingComplete = useCallback((t: OnboardingTargets) => {
    setTargets(t);
    setLang(t.language as 'en' | 'ar');
    localStorage.setItem(ONBOARDING_KEY, "true");
    localStorage.setItem(TARGETS_KEY, JSON.stringify(t));
    // Save persona/stage for downstream use
    localStorage.setItem("seeraty-persona", t.stage);
    setShowOnboarding(false);
    const setup = generateSmartSetup(t);
    setSmartSetup(setup);
  }, []);

  const handleSetupOpen = useCallback(() => {
    if (!smartSetup) return;
    // Apply template, section order, colors, and pre-filled data
    setTemplate(smartSetup.template);
    setColors(templateDefaultColors[smartSetup.template]);
    setSectionOrder(smartSetup.sectionOrder);
    form.reset(smartSetup.prefilled);
    setSmartSetup(null);
    toast.success(lang === 'ar' ? "تم إعداد سيرتك الذاتية — ابدأ التعديل!" : "Your CV is ready — start editing!");
  }, [smartSetup, form, lang]);

  const handleOnboardingSkip = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  }, []);

  const handleDemoData = useCallback(() => {
    const data = lang === 'ar' ? demoDataAr : demoDataEn;
    form.reset(data);
    toast.success(lang === 'ar' ? "تم تحميل البيانات التجريبية" : "Demo data loaded");
  }, [form, lang]);

  const handleReset = useCallback(() => {
    form.reset(defaultResumeData);
    localStorage.removeItem(STORAGE_KEY);
    toast.success(lang === 'ar' ? "تم مسح جميع البيانات" : "All data cleared");
  }, [form, lang]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleExportDocx = useCallback(async () => {
    try {
      await exportToDocx(watchedData, lang, sectionOrder);
      toast.success(lang === 'ar' ? "تم تصدير ملف Word" : "Word file exported");
    } catch {
      toast.error(lang === 'ar' ? "فشل التصدير" : "Export failed");
    }
  }, [watchedData, lang, sectionOrder]);

  const handleCopyText = useCallback(async () => {
    const text = resumeToPlainText(watchedData, lang);
    try {
      await navigator.clipboard.writeText(text);
      toast.success(lang === 'ar' ? "تم نسخ السيرة كنص" : "Resume copied as text");
    } catch {
      toast.error(lang === 'ar' ? "فشل النسخ" : "Copy failed");
    }
  }, [watchedData, lang]);

  const handleShare = useCallback(async () => {
    const url = encodeResumeToUrl(watchedData);
    try {
      await navigator.clipboard.writeText(url);
      toast.success(lang === 'ar' ? "تم نسخ رابط المشاركة" : "Share link copied to clipboard");
    } catch {
      toast.error(lang === 'ar' ? "فشل النسخ" : "Copy failed");
    }
  }, [watchedData, lang]);

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  }, []);

  const l = (en: string, ar: string) => lang === 'ar' ? ar : en;

  if (showOnboarding) {
    return <OnboardingQuiz lang={lang} onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />;
  }

  if (smartSetup) {
    return <SetupReadyScreen setup={smartSetup} lang={lang} onOpen={handleSetupOpen} />;
  }


  return (
    <div className="min-h-screen bg-background" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="no-print border-b bg-card sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={seeratyLogo} alt="سيرتي Seeraty" className="h-8" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button type="button" variant="outline" size="sm" onClick={toggleLang} className="gap-1.5">
              <Languages className="w-4 h-4" />
              {lang === 'ar' ? 'English' : 'عربي'}
            </Button>
            {targets && (
              <Button type="button" variant="outline" size="sm" onClick={() => setShowTargets(!showTargets)}>
                <Settings2 className="w-3.5 h-3.5 me-1" />
                {l("Targets", "المستهدفات")}
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={handleDemoData}>
              {l("Load Demo", "تحميل مثال")}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleReset} className="text-destructive">
              <RotateCcw className="w-3.5 h-3.5 me-1" />
              {l("Reset", "مسح")}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleCopyText}>
              <Copy className="w-3.5 h-3.5 me-1" />
              {l("Copy Text", "نسخ النص")}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-3.5 h-3.5 me-1" />
              {l("Share Link", "مشاركة")}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleExportDocx}>
              <FileType className="w-3.5 h-3.5 me-1" />
              {l("Word", "Word")}
            </Button>
            <Button type="button" size="sm" onClick={handlePrint} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <FileDown className="w-3.5 h-3.5 me-1" />
              {l("Download PDF", "تحميل PDF")}
            </Button>
          </div>
        </div>
      </header>

      {/* Targets Bar */}
      {showTargets && targets && (
        <div className="no-print border-b bg-primary/5 px-4 py-3">
          <div className="max-w-[1600px] mx-auto flex items-center gap-4 flex-wrap">
            <span className="text-sm font-semibold text-primary">{l("Your Targets:", "مستهدفاتك:")}</span>
            <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.stage}</span>
            <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.industry}</span>
            <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.goal}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => {
                localStorage.removeItem(ONBOARDING_KEY);
                setShowOnboarding(true);
              }}
            >
              {l("Edit Targets", "تعديل المستهدفات")}
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <FormProvider {...form}>
        <div className="no-print max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[calc(100vh-57px)]">
          {/* Left: Form */}
          <ScrollArea className="h-[calc(100vh-57px)] border-e" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="p-5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <TemplateSelector value={template} onChange={handleTemplateChange} lang={lang} />
              <div className="mt-3">
                <ColorCustomizer value={colors} onChange={setColors} lang={lang} />
              </div>
              <div className="mt-3">
                <SectionReorder order={sectionOrder} onChange={setSectionOrder} lang={lang} />
              </div>
              {/* Target Checklist Widget */}
              {targets && sectionProgress.length > 0 && (
                <div className="mt-4">
                  <TargetChecklist sections={sectionProgress} lang={lang} />
                </div>
              )}
              <div className="mt-4">
                <ResumeForm
                  lang={lang}
                  persona={targets ? { stage: targets.stage, industry: targets.industry, goal: targets.goal } : null}
                  onProgressUpdate={setSectionProgress}
                />
              </div>
            </div>
          </ScrollArea>

          {/* Right: Preview */}
          <div className="h-[calc(100vh-57px)] overflow-auto bg-muted/50 p-6 flex justify-center">
            <div className="bg-white shadow-lg border w-full max-w-[210mm] min-h-[297mm] p-[15mm] rounded-sm">
              <ResumePreview data={watchedData} lang={lang} template={template} colors={colors} sectionOrder={sectionOrder} />
            </div>
          </div>
        </div>
      </FormProvider>

      {/* Print-only preview */}
      <div className="hidden print-only">
        <ResumePreview data={watchedData} lang={lang} template={template} colors={colors} sectionOrder={sectionOrder} />
      </div>
    </div>
  );
};

export default Index;
