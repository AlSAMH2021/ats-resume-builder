import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Sparkles, Zap, ArrowRight, Loader2, FileText, BarChart3, Target } from "lucide-react";
import type { SmartSetupResult } from "@/lib/smartSetup";
import seeratyLogo from "@/assets/seeraty_logo.png";

interface Props {
  setup: SmartSetupResult;
  lang: "en" | "ar";
  onOpen: () => void;
}

export default function SetupReadyScreen({ setup, lang, onOpen }: Props) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);

  useEffect(() => {
    const steps = [20, 45, 70, 90, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 400);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const strengths = lang === "ar" ? setup.strengthsAr : setup.strengthsEn;

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-[hsl(var(--primary)/0.08)] via-background to-[hsl(var(--accent)/0.1)] flex items-center justify-center p-4"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <Card className="w-full max-w-md p-10 text-center space-y-6 shadow-2xl border-primary/20">
          <img src={seeratyLogo} alt="Seeraty" className="h-14 mx-auto" />
          <div className="space-y-2">
            <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
            <h2 className="text-lg font-bold text-foreground">
              {l("Building your personalized CV...", "جاري إعداد سيرتك الذاتية المخصصة...")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {l("Analyzing your profile & selecting the best setup", "نحلل ملفك الشخصي ونختار أفضل إعداد")}
            </p>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {progress < 50
              ? l("Analyzing your profile...", "تحليل ملفك الشخصي...")
              : progress < 80
                ? l("Arranging sections...", "ترتيب الأقسام...")
                : l("Generating content...", "إنشاء المحتوى...")}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[hsl(var(--primary)/0.08)] via-background to-[hsl(var(--accent)/0.1)] flex items-center justify-center p-4"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <Card className="w-full max-w-lg p-8 space-y-6 shadow-2xl border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {l("Your CV is Ready!", "سيرتك الذاتية جاهزة!")}
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {l(
              "We've built a personalized CV based on your goals and academic stage",
              "أعددنا لك سيرة ذاتية مخصصة بناءً على أهدافك ومرحلتك الأكاديمية"
            )}
          </p>
        </div>

        {/* Strengths */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">
              {l("Your Highlighted Strengths", "نقاط قوتك المميزة")}
            </span>
          </div>
          <div className="space-y-2">
            {strengths.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-card border p-3">
                <Zap className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What was set up */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {l("What we prepared for you", "ما تم إعداده لك")}
          </p>
          <ul className="space-y-1.5 text-sm text-foreground">
            <li className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
              {l("A draft CV with placeholder sections ready to fill", "مسودة سيرة ذاتية بأقسام جاهزة للتعبئة")}
            </li>
            <li className="flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-primary shrink-0" />
              {l("Section order optimized for your academic stage", "ترتيب أقسام مُحسّن لمرحلتك الأكاديمية")}
            </li>
            <li className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-primary shrink-0" />
              {l("Career targets & checklist to track your progress", "مستهدفات مهنية وقائمة تتبّع لمتابعة تقدمك")}
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold"
          onClick={onOpen}
        >
          {l("Open My CV", "افتح سيرتي الذاتية")}
          <ArrowRight className="w-5 h-5 ms-2" />
        </Button>
      </Card>
    </div>
  );
}
