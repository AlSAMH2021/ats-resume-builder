import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { FileDown, Copy, RotateCcw, FileText, Languages } from "lucide-react";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import TemplateSelector, { type ResumeTemplate } from "@/components/resume/TemplateSelector";
import ColorCustomizer, { type ResumeColors, templateDefaultColors } from "@/components/resume/ColorCustomizer";
import SectionReorder, { type ResumeSection, defaultSectionOrder } from "@/components/resume/SectionReorder";
import { resumeSchema, defaultResumeData, type ResumeData } from "@/types/resume";
import { demoDataEn, demoDataAr } from "@/lib/demoData";
import { resumeToPlainText } from "@/lib/atsKeywords";

const STORAGE_KEY = "ats-resume-data";

function loadSavedData(): ResumeData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultResumeData;
}

const Index = () => {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [template, setTemplate] = useState<ResumeTemplate>('classic');
  const [colors, setColors] = useState<ResumeColors>(templateDefaultColors.classic);
  const [sectionOrder, setSectionOrder] = useState<ResumeSection[]>(defaultSectionOrder);

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

  // Auto-save
  useEffect(() => {
    const sub = form.watch((data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {}
    });
    return () => sub.unsubscribe();
  }, [form]);

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

  const handleCopyText = useCallback(async () => {
    const text = resumeToPlainText(watchedData, lang);
    try {
      await navigator.clipboard.writeText(text);
      toast.success(lang === 'ar' ? "تم نسخ السيرة كنص" : "Resume copied as text");
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
      {/* Header */}
      <header className="no-print border-b bg-card sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            <h1 className="text-lg font-bold text-primary">{l("ATS Resume Builder", "منشئ السيرة الذاتية ATS")}</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button type="button" variant="outline" size="sm" onClick={toggleLang} className="gap-1.5">
              <Languages className="w-4 h-4" />
              {lang === 'ar' ? 'English' : 'عربي'}
            </Button>
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
            <Button type="button" size="sm" onClick={handlePrint} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <FileDown className="w-3.5 h-3.5 me-1" />
              {l("Download PDF", "تحميل PDF")}
            </Button>
          </div>
        </div>
      </header>

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
              <div className="mt-4">
                <ResumeForm lang={lang} />
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
