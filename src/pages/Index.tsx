import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { FileDown, Copy, RotateCcw, Languages, FileType, Share2, Settings2 } from "lucide-react";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import TargetChecklist from "@/components/resume/TargetChecklist";
import type { SectionProgress } from "@/lib/careerTargets";
import type { OnboardingTargets } from "@/components/resume/OnboardingQuiz";
import { resumeSchema, defaultResumeData, type ResumeData } from "@/types/resume";
import { demoDataEn, demoDataAr } from "@/lib/demoData";
import { resumeToPlainText } from "@/lib/atsKeywords";
import { exportToDocx } from "@/lib/exportDocx";
import { encodeResumeToUrl, decodeResumeFromUrl } from "@/lib/shareResume";
import { zodResolver } from "@hookform/resolvers/zod";
import seeratyLogo from "@/assets/seeraty_logo.png";

const STORAGE_KEY = "ats-resume-data";
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
  const [targets, setTargets] = useState<OnboardingTargets | null>(() => {
    try {
      const saved = localStorage.getItem(TARGETS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [showTargets, setShowTargets] = useState(false);
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);
  const [nextPriority, setNextPriority] = useState<{ sectionKey: string; labelEn: string; labelAr: string; gainPercent: number } | null>(null);

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

  // Listen for targets changes (from onboarding in ProtectedLayout)
  useEffect(() => {
    const handler = () => {
      try {
        const saved = localStorage.getItem(TARGETS_KEY);
        setTargets(saved ? JSON.parse(saved) : null);
      } catch {}
    };
    window.addEventListener("storage", handler);
    // Also check on mount
    handler();
    return () => window.removeEventListener("storage", handler);
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
      await exportToDocx(watchedData, lang, []);
      toast.success(lang === 'ar' ? "تم تصدير ملف Word" : "Word file exported");
    } catch {
      toast.error(lang === 'ar' ? "فشل التصدير" : "Export failed");
    }
  }, [watchedData, lang]);

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

  return (
    <div className="min-h-screen bg-background" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Toolbar */}
      <div className="no-print border-b bg-card sticky top-0 z-40">
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
      </div>

      {/* Targets Bar */}
      {showTargets && targets && (
        <div className="no-print border-b bg-primary/5 px-4 py-3">
          <div className="max-w-[1600px] mx-auto flex items-center gap-4 flex-wrap">
            <span className="text-sm font-semibold text-primary">{l("Your Targets:", "مستهدفاتك:")}</span>
            <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.stage}</span>
            <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.industry}</span>
            <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.goal}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <FormProvider {...form}>
        <div className="no-print max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[calc(100vh-57px)]">
          {/* Left: Form */}
          <ScrollArea className="h-[calc(100vh-57px)] border-e" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="p-5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

              <ResumeForm
                lang={lang}
                persona={targets ? { stage: targets.stage, industry: targets.industry, goal: targets.goal, yearCurrent: targets.yearCurrent, yearTotal: targets.yearTotal } : null}
                onProgressUpdate={setSectionProgress}
                onNextPriorityUpdate={setNextPriority}
              />
            </div>
          </ScrollArea>

          {/* Right: Preview */}
          <div className="h-[calc(100vh-57px)] overflow-auto bg-muted/50 p-6 flex justify-center">
            <div className="bg-white shadow-lg border w-full max-w-[210mm] min-h-[297mm] p-[15mm] rounded-sm">
              <ResumePreview data={watchedData} lang={lang} />
            </div>
          </div>
        </div>
      </FormProvider>

      {/* Print-only preview */}
      <div className="hidden print-only">
        <ResumePreview data={watchedData} lang={lang} />
      </div>
    </div>
  );
};

export default Index;
