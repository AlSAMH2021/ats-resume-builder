import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  FileDown, Copy, RotateCcw, Languages, FileType, Share2,
  Target, ArrowLeft, X, Check, AlertTriangle
} from "lucide-react";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import TargetChecklist from "@/components/resume/TargetChecklist";
import type { SectionProgress } from "@/lib/careerTargets";
import { computeWeightedOverall, getNextPrioritySection } from "@/lib/careerTargets";
import type { OnboardingTargets } from "@/components/resume/OnboardingQuiz";
import { resumeSchema, defaultResumeData, type ResumeData } from "@/types/resume";
import { demoDataEn, demoDataAr } from "@/lib/demoData";
import { resumeToPlainText } from "@/lib/atsKeywords";
import { exportToDocx } from "@/lib/exportDocx";
import { encodeResumeToUrl, decodeResumeFromUrl } from "@/lib/shareResume";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import seeratyLogo from "@/assets/seeraty_logo.png";
import { useUserData } from "@/hooks/useUserData";

const Index = () => {
  const {
    loading: dataLoading,
    resume: cloudResume,
    targets,
    lang,
    setLang,
    saveResumeDataDebounced,
    clearResume,
  } = useUserData();

  const [showChecklist, setShowChecklist] = useState(true);
  const [sectionProgress, setSectionProgress] = useState<SectionProgress[]>([]);
  const [nextPriority, setNextPriority] = useState<{ sectionKey: string; labelEn: string; labelAr: string; gainPercent: number } | null>(null);

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResumeData,
    mode: "onChange",
  });

  const watchedData = form.watch();

  // Load cloud resume into the form once it arrives
  useEffect(() => {
    if (cloudResume) {
      form.reset(cloudResume);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudResume]);

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

  // Auto-save (debounced) to cloud
  useEffect(() => {
    if (dataLoading) return;
    const sub = form.watch((data) => {
      saveResumeDataDebounced(data as ResumeData, lang);
    });
    return () => sub.unsubscribe();
  }, [form, saveResumeDataDebounced, lang, dataLoading]);

  // Compute overall score
  const persona = useMemo(() => {
    if (!targets) return null;
    return { stage: targets.stage, industry: targets.industry, goal: targets.goal, yearCurrent: targets.yearCurrent, yearTotal: targets.yearTotal };
  }, [targets]);

  const overallScore = useMemo(() => {
    if (!persona || sectionProgress.length === 0) return 0;
    return computeWeightedOverall(sectionProgress, persona);
  }, [sectionProgress, persona]);

  // Count unmet required targets
  const unmetRequiredCount = useMemo(() => {
    return sectionProgress.reduce((count, sec) =>
      count + sec.targets.filter(t => !t.met && t.category === "required").length, 0);
  }, [sectionProgress]);

  const handleDemoData = useCallback(() => {
    const data = lang === 'ar' ? demoDataAr : demoDataEn;
    form.reset(data);
    toast.success(lang === 'ar' ? "تم تحميل البيانات التجريبية" : "Demo data loaded");
  }, [form, lang]);

  const handleReset = useCallback(async () => {
    form.reset(defaultResumeData);
    await clearResume();
    toast.success(lang === 'ar' ? "تم مسح جميع البيانات" : "All data cleared");
  }, [form, lang, clearResume]);

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
    setLang(lang === 'en' ? 'ar' : 'en');
  }, [lang, setLang]);

  const l = (en: string, ar: string) => lang === 'ar' ? ar : en;

  const scoreColor = overallScore >= 70
    ? "text-green-700 bg-green-500/10"
    : overallScore >= 40
      ? "text-yellow-700 bg-yellow-500/10"
      : "text-destructive bg-destructive/10";

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* ═══ TOP TOOLBAR ═══ */}
      <div className="no-print h-[52px] border-b bg-card shadow-sm sticky top-0 z-50 flex items-center px-4 gap-2 shrink-0">
        {/* GROUP RIGHT (RTL → visually right) */}
        <div className="flex items-center gap-2 shrink-0">
          <img src={seeratyLogo} alt="سيرتي" className="h-7" />
          <Separator orientation="vertical" className="h-5 mx-1" />
          {/* Score pill */}
          {persona && sectionProgress.length > 0 && (
            <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", scoreColor)}>
              <div className="w-12 h-1.5 bg-current/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-current transition-all duration-700"
                  style={{ width: `${overallScore}%` }}
                />
              </div>
              <span>{overallScore}% {l("ready", "جاهزية")}</span>
            </div>
          )}
          {/* Saved indicator */}
          <span className="text-[10px] text-green-600 flex items-center gap-0.5">
            <Check className="w-3 h-3" />
            {l("Saved", "محفوظ")}
          </span>
        </div>

        {/* GROUP CENTER */}
        <div className="flex items-center gap-1.5 mx-auto">
          <Button type="button" variant="outline" size="sm" onClick={toggleLang} className="gap-1 text-xs h-8">
            <Languages className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'English' : 'عربي'}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleDemoData} className="text-xs h-8">
            {l("Demo", "مثال توضيحي")}
          </Button>
        </div>

        {/* GROUP LEFT (RTL → visually left) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="text-destructive text-xs h-8 gap-1">
            <RotateCcw className="w-3.5 h-3.5" />
            {l("Clear", "مسح")}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleShare} className="text-xs h-8 gap-1">
            <Share2 className="w-3.5 h-3.5" />
            {l("Share", "مشاركة")}
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button type="button" variant="outline" size="sm" onClick={handleCopyText} className="text-xs h-8 gap-1">
            <Copy className="w-3.5 h-3.5" />
            {l("Copy", "نسخ")}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleExportDocx} className="text-xs h-8 gap-1">
            <FileType className="w-3.5 h-3.5" />
            Word
          </Button>
          <Button type="button" size="sm" onClick={handlePrint} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8 gap-1">
            <FileDown className="w-3.5 h-3.5" />
            {l("PDF", "تحميل PDF")}
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowChecklist(!showChecklist)}
            className={cn(
              "text-xs h-8 gap-1",
              showChecklist && "border-primary text-primary bg-primary/5",
              unmetRequiredCount > 0 && !showChecklist && "border-destructive/50 text-destructive"
            )}
          >
            <Target className="w-3.5 h-3.5" />
            {l("Targets", "المستهدفات")}
            {unmetRequiredCount > 0 && (
              <Badge variant="destructive" className="h-4 min-w-[16px] px-1 text-[9px] rounded-full ms-0.5">
                {unmetRequiredCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* ═══ SECONDARY BAR ═══ */}
      {nextPriority && persona && (
        <div className="no-print h-10 bg-primary/5 border-b flex items-center px-4 gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <ArrowLeft className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm text-primary">
              {l("Next step:", "الخطوة التالية:")} {l(`Complete ${nextPriority.labelEn} section`, `أكمل قسم ${nextPriority.labelAr} لرفع نتيجتك`)}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {targets && (
              <>
                <Badge variant="secondary" className="text-[10px] h-5 rounded-full bg-muted/50">
                  {targets.stage === 'student' ? 'طالب' : targets.stage === 'freshman' ? 'مستجد' : 'خريج'}
                </Badge>
                <Badge variant="secondary" className="text-[10px] h-5 rounded-full bg-muted/50">
                  {targets.industry === 'tech' ? 'تقنية المعلومات' : targets.industry === 'business' ? 'إدارة الأعمال' : targets.industry === 'engineering' ? 'هندسة' : targets.industry}
                </Badge>
                <Badge variant="secondary" className="text-[10px] h-5 rounded-full bg-muted/50">
                  {targets.goal === 'internship' ? 'تدريب' : targets.goal === 'volunteering' ? 'تطوع' : targets.goal === 'part-time' ? 'دوام جزئي' : 'دوام كامل'}
                </Badge>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ THREE-PANEL BODY ═══ */}
      <FormProvider {...form}>
        <div className="no-print flex-1 flex overflow-hidden">
          {/* ── LEFT PANEL: FORM (420px) ── */}
          <div className="w-[420px] shrink-0 border-s bg-card flex flex-col overflow-hidden">
            <ScrollArea className="flex-1" dir="rtl">
              <div className="p-5">
                <ResumeForm
                  lang={lang}
                  persona={persona}
                  onProgressUpdate={setSectionProgress}
                  onNextPriorityUpdate={setNextPriority}
                />
              </div>
            </ScrollArea>
          </div>

          {/* ── CENTER PANEL: PREVIEW (flex-1) ── */}
          <div className="flex-1 overflow-auto bg-muted/40 flex flex-col items-center py-6 px-4">
            <p className="text-[10px] text-muted-foreground mb-2">A4 {l("preview", "معاينة")}</p>
            <div className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)] w-full max-w-[210mm] min-h-[297mm] p-[15mm] rounded-sm">
              <ResumePreview data={watchedData} lang={lang} />
            </div>
          </div>

          {/* ── RIGHT PANEL: CHECKLIST (300px) ── */}
          {showChecklist && sectionProgress.length > 0 && (
            <div className="w-[300px] shrink-0 border-e bg-card flex flex-col overflow-hidden">
              {/* Panel header */}
              <div className="px-4 py-3 border-b flex items-center gap-2 shrink-0">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold flex-1">{l("Career Targets", "المستهدفات المهنية")}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={() => setShowChecklist(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Checklist content */}
              <ScrollArea className="flex-1" dir="rtl">
                <div className="p-0">
                  <TargetChecklist
                    sections={sectionProgress}
                    lang={lang}
                    persona={persona}
                    nextPriority={nextPriority}
                  />
                </div>
              </ScrollArea>
            </div>
          )}
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
