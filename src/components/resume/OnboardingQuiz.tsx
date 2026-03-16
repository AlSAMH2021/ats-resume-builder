import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2, Pencil, Sparkles, AlertTriangle, Ban, Home, GraduationCap } from "lucide-react";
import { validateSurveySelection, type Stage, type Goal } from "@/lib/personaEngine";
import seeratyLogo from "@/assets/seeraty_logo.png";

export interface OnboardingTargets {
  stage: string;         // mapped internally: freshman | student | graduate
  yearTotal: number;     // عدد سنوات الدراسة الكلية
  yearCurrent: number;   // السنة الدراسية الحالية
  industry: string;
  goal: string;
  language: string;
}

const defaultTargets: OnboardingTargets = {
  stage: "",
  yearTotal: 4,
  yearCurrent: 1,
  industry: "",
  goal: "",
  language: "ar",
};

// Map year to internal stage for persona engine
export function yearToStage(yearCurrent: number, yearTotal: number): Stage {
  if (yearCurrent >= yearTotal) return "graduate";
  if (yearCurrent <= 1) return "freshman";
  return "student";
}

interface Props {
  lang: "en" | "ar";
  onComplete: (targets: OnboardingTargets) => void;
  onSkip: () => void;
}

interface QuestionOption {
  value: string;
  labelEn: string;
  labelAr: string;
  icon: string;
}

interface QuestionConfig {
  key: "industry" | "goal" | "language";
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  dependsOn?: "industry" | "goal" | "language";
  options: QuestionOption[];
}

const questions: QuestionConfig[] = [
  {
    key: "industry",
    titleEn: "What is your field of study?",
    titleAr: "ما تخصصك الدراسي؟",
    subtitleEn: "We'll suggest skills, keywords, and certifications for your industry.",
    subtitleAr: "سنقترح مهارات وكلمات مفتاحية وشهادات مناسبة لتخصصك.",
    options: [
      { value: "tech", labelEn: "IT & Computing", labelAr: "تقنية معلومات", icon: "💻" },
      { value: "business", labelEn: "Business & Finance", labelAr: "أعمال ومالية", icon: "📊" },
      { value: "engineering", labelEn: "Engineering", labelAr: "هندسة", icon: "⚙️" },
      { value: "healthcare", labelEn: "Health Sciences", labelAr: "علوم صحية", icon: "🏥" },
      { value: "creative", labelEn: "Design & Arts", labelAr: "تصميم وفنون", icon: "🎨" },
      { value: "law", labelEn: "Law", labelAr: "قانون", icon: "⚖️" },
      { value: "education", labelEn: "Education & Teaching", labelAr: "تعليم وتدريس", icon: "📚" },
      { value: "other", labelEn: "Other", labelAr: "أخرى", icon: "🌍" },
    ],
  },
  {
    key: "goal",
    titleEn: "What is your main goal?",
    titleAr: "ما هدفك الرئيسي؟",
    subtitleEn: "This affects tone, density, and ATS optimization level.",
    subtitleAr: "هذا يؤثر على الأسلوب والكثافة ومستوى التوافق مع أنظمة التوظيف.",
    options: [
      { value: "volunteering", labelEn: "Volunteering / Clubs", labelAr: "تطوع / أندية", icon: "🤝" },
      { value: "internship", labelEn: "Internship (Co-op)", labelAr: "تدريب تعاوني", icon: "🏢" },
      { value: "part-time", labelEn: "Part-time Job", labelAr: "عمل جزئي", icon: "⏰" },
      { value: "full-time", labelEn: "First Full-time Job", labelAr: "وظيفتي الأولى", icon: "🚀" },
    ],
  },
  {
    key: "language",
    titleEn: "Resume language?",
    titleAr: "لغة السيرة الذاتية؟",
    subtitleEn: "Choose the language your target employer expects.",
    subtitleAr: "اختر اللغة التي يتوقعها صاحب العمل المستهدف.",
    options: [
      { value: "ar", labelEn: "Arabic", labelAr: "عربي", icon: "🇸🇦" },
      { value: "en", labelEn: "English", labelAr: "إنجليزي", icon: "🇺🇸" },
    ],
  },
];

export default function OnboardingQuiz({ lang, onComplete, onSkip }: Props) {
  const navigate = useNavigate();
  // step 0 = year inputs, step 1+ = questions
  const [step, setStep] = useState(0);
  const [targets, setTargets] = useState<OnboardingTargets>(defaultTargets);
  const [showSummary, setShowSummary] = useState(false);
  const [hoveredWarn, setHoveredWarn] = useState<string | null>(null);

  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const totalSteps = questions.length + 1; // +1 for year step

  // Current question (for step > 0)
  const currentQ = step > 0 ? questions[step - 1] : null;

  // Compute stage from year
  const computedStage = yearToStage(targets.yearCurrent, targets.yearTotal);

  // Goal validations
  const goalValidations = useMemo(() => {
    if (!currentQ || currentQ.key !== "goal") return {};
    const results: Record<string, ReturnType<typeof validateSurveySelection>> = {};
    for (const opt of currentQ.options) {
      results[opt.value] = validateSurveySelection(computedStage, opt.value as Goal);
    }
    return results;
  }, [currentQ, computedStage]);

  const handleYearNext = () => {
    if (targets.yearTotal < 1 || targets.yearCurrent < 1) return;
    setStep(1);
  };

  const handleSelect = (value: string) => {
    if (!currentQ) return;
    if (currentQ.key === "goal" && goalValidations[value]?.action === "block") return;

    setTargets((prev) => ({ ...prev, [currentQ.key]: value }));
    if (step < totalSteps - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setTimeout(() => setShowSummary(true), 200);
    }
  };

  const getLabel = (key: string, value: string) => {
    const q = questions.find((q) => q.key === key);
    const opt = q?.options.find((o) => o.value === value);
    return opt ? (lang === "ar" ? opt.labelAr : opt.labelEn) : value;
  };

  const stageLabel = () => {
    if (targets.yearCurrent >= targets.yearTotal) return l("Graduated / Final year", "خريج / سنة أخيرة");
    if (targets.yearCurrent <= 1) return l("Freshman (Year 1)", "مستجد (سنة أولى)");
    return l(`Year ${targets.yearCurrent} student`, `طالب سنة ${targets.yearCurrent}`);
  };

  const handleComplete = () => {
    onComplete({
      ...targets,
      stage: computedStage,
    });
  };

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--primary)/0.05)] via-background to-[hsl(var(--accent)/0.08)] flex items-center justify-center p-4" dir={lang === "ar" ? "rtl" : "ltr"}>
        <Card className="w-full max-w-lg p-8 space-y-6 shadow-2xl border-primary/20">
          <div className="text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 mx-auto text-primary" />
            <h2 className="text-2xl font-bold text-foreground">{l("Your Targets", "مستهدفاتك")}</h2>
            <p className="text-sm text-muted-foreground">{l("You can edit these anytime", "يمكنك تعديلها في أي وقت")}</p>
          </div>

          <div className="space-y-3">
            {/* Year info */}
            <div className="flex items-center justify-between rounded-lg border bg-card p-3">
              <div>
                <p className="text-xs text-muted-foreground">{l("Academic Year", "السنة الدراسية")}</p>
                <p className="font-medium text-foreground">
                  {l(`Year ${targets.yearCurrent} of ${targets.yearTotal}`, `السنة ${targets.yearCurrent} من ${targets.yearTotal}`)}
                  {" — "}
                  <span className="text-primary text-sm">{stageLabel()}</span>
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setShowSummary(false); setStep(0); }}>
                <Pencil className="w-4 h-4" />
              </Button>
            </div>

            {/* Other answers */}
            {questions.map((q, i) => (
              <div key={q.key} className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div>
                  <p className="text-xs text-muted-foreground">{l(q.titleEn, q.titleAr)}</p>
                  <p className="font-medium text-foreground">{getLabel(q.key, targets[q.key])}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setShowSummary(false); setStep(i + 1); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg" onClick={handleComplete}>
            <Sparkles className="w-4 h-4 me-2" />
            {l("Start Building", "ابدأ الآن")}
          </Button>
        </Card>
      </div>
    );
  }

  // Step 0: Year inputs
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--primary)/0.05)] via-background to-[hsl(var(--accent)/0.08)] flex items-center justify-center p-4" dir={lang === "ar" ? "rtl" : "ltr"}>
        <Card className="w-full max-w-lg p-8 space-y-6 shadow-2xl border-primary/20 relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 start-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            {lang === "ar" ? "الرئيسية" : "Home"}
          </button>

          <div className="text-center">
            <img src={seeratyLogo} alt="Seeraty سيرتي" className="h-16 mx-auto mb-4" />
          </div>

          {/* Progress */}
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= step ? "bg-primary" : "bg-muted")} />
            ))}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">1 / {totalSteps}</p>
            <h2 className="text-xl font-bold text-foreground">
              {l("Tell us about your academic journey", "أخبرنا عن مسيرتك الأكاديمية")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {l("This determines what targets and recommendations we set for you.", "هذا يحدد المستهدفات والتوصيات المناسبة لك.")}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">
                {l("Total years of your program", "عدد سنوات البرنامج الدراسي")}
              </Label>
              <Input
                type="number"
                min={1}
                max={8}
                value={targets.yearTotal}
                onChange={(e) => setTargets(prev => ({ ...prev, yearTotal: parseInt(e.target.value) || 1 }))}
                className="mt-1 h-11 text-lg text-center"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                {l("Which year are you currently in?", "في أي سنة دراسية أنت الآن؟")}
              </Label>
              <Input
                type="number"
                min={1}
                max={targets.yearTotal + 1}
                value={targets.yearCurrent}
                onChange={(e) => setTargets(prev => ({ ...prev, yearCurrent: parseInt(e.target.value) || 1 }))}
                className="mt-1 h-11 text-lg text-center"
              />
              {targets.yearCurrent > targets.yearTotal && (
                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {l("You'll be treated as a graduate!", "ستُعامل كخريج!")}
                </p>
              )}
            </div>

            {/* Stage preview */}
            <div className="rounded-lg border bg-primary/5 p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">{l("Your level", "مستواك")}</p>
              <p className="font-semibold text-primary">{stageLabel()}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div />
            <Button onClick={handleYearNext} className="bg-primary text-primary-foreground">
              {l("Next", "التالي")}
              {lang === "ar" ? <ArrowLeft className="w-4 h-4 ms-1" /> : <ArrowRight className="w-4 h-4 ms-1" />}
            </Button>
          </div>

          <div className="text-center">
            <Button variant="link" size="sm" onClick={onSkip} className="text-muted-foreground">
              {l("Skip", "تخطي")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Steps 1+: questions
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--primary)/0.05)] via-background to-[hsl(var(--accent)/0.08)] flex items-center justify-center p-4" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Card className="w-full max-w-lg p-8 space-y-6 shadow-2xl border-primary/20 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 start-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Home className="w-4 h-4" />
          {lang === "ar" ? "الرئيسية" : "Home"}
        </button>

        <div className="text-center">
          <img src={seeratyLogo} alt="Seeraty سيرتي" className="h-16 mx-auto mb-4" />
        </div>

        {/* Progress */}
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">{step + 1} / {totalSteps}</p>
          <h2 className="text-xl font-bold text-foreground">{l(currentQ!.titleEn, currentQ!.titleAr)}</h2>
          <p className="text-sm text-muted-foreground">{l(currentQ!.subtitleEn, currentQ!.subtitleAr)}</p>
        </div>

        {/* Options */}
        <div className={cn("grid gap-3", currentQ!.options.length <= 3 ? "grid-cols-1" : "grid-cols-2")}>
          {currentQ!.options.map((opt) => {
            const validation = goalValidations[opt.value];
            const isBlocked = validation?.action === "block";
            const isWarned = validation?.action === "warn";
            const isSelected = targets[currentQ!.key] === opt.value;
            const showWarnText = isWarned && (isSelected || hoveredWarn === opt.value);

            return (
              <div key={opt.value} className="relative">
                <button
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => isWarned && setHoveredWarn(opt.value)}
                  onMouseLeave={() => setHoveredWarn(null)}
                  disabled={isBlocked}
                  className={cn(
                    "w-full rounded-xl border-2 p-4 text-center transition-all",
                    isBlocked
                      ? "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                      : "hover:border-primary hover:bg-primary/5",
                    isSelected && !isBlocked
                      ? "border-primary bg-primary/10 shadow-md"
                      : !isBlocked && "border-border bg-card"
                  )}
                >
                  <span className="text-2xl block mb-1">{opt.icon}</span>
                  <span className={cn("text-sm font-medium", isBlocked ? "text-muted-foreground" : "text-foreground")}>
                    {lang === "ar" ? opt.labelAr : opt.labelEn}
                  </span>
                  {isBlocked && (
                    <span className="flex items-center justify-center gap-1 mt-1.5 text-[10px] text-destructive">
                      <Ban className="w-3 h-3" /> {l("Not available", "غير متاح")}
                    </span>
                  )}
                  {isWarned && !isBlocked && (
                    <span className="flex items-center justify-center gap-1 mt-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">{l("See note", "ملاحظة")}</span>
                    </span>
                  )}
                </button>
                {isBlocked && validation?.messageEn && (
                  <p className="mt-1 text-[10px] text-destructive/80 text-center px-1 leading-tight">
                    {l(validation.messageEn!, validation.messageAr!)}
                  </p>
                )}
                {showWarnText && validation?.messageEn && (
                  <div className="mt-1.5 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 p-2 text-[11px] text-amber-700 dark:text-amber-300 leading-snug animate-in fade-in duration-200">
                    <div className="flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                      <span>{l(validation.messageEn!, validation.messageAr!)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
            {lang === "ar" ? <ArrowRight className="w-4 h-4 me-1" /> : <ArrowLeft className="w-4 h-4 me-1" />}
            {l("Back", "رجوع")}
          </Button>
          <Button variant="link" size="sm" onClick={onSkip} className="text-muted-foreground">
            {l("Skip", "تخطي")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
