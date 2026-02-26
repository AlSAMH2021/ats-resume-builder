import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2, Pencil, Sparkles } from "lucide-react";
import seeratyLogo from "@/assets/seeraty_logo.png";

export interface OnboardingTargets {
  stage: string;       // freshman | student | graduate
  industry: string;
  goal: string;
  language: string;
}

const defaultTargets: OnboardingTargets = {
  stage: "",
  industry: "",
  goal: "",
  language: "ar",
};

interface Props {
  lang: "en" | "ar";
  onComplete: (targets: OnboardingTargets) => void;
  onSkip: () => void;
}

const questions = [
  {
    key: "stage" as const,
    titleEn: "What stage are you at?",
    titleAr: "في أي مرحلة أنت؟",
    options: [
      { value: "freshman", labelEn: "Freshman", labelAr: "طالب مستجد", icon: "🎒" },
      { value: "student", labelEn: "University Student", labelAr: "طالب جامعي", icon: "🎓" },
      { value: "graduate", labelEn: "Recent Graduate", labelAr: "خريج حديث", icon: "🚀" },
    ],
  },
  {
    key: "industry" as const,
    titleEn: "What is your field of study?",
    titleAr: "ما تخصصك الدراسي؟",
    options: [
      { value: "tech", labelEn: "IT & Computing", labelAr: "تقنية معلومات", icon: "💻" },
      { value: "business", labelEn: "Business & Finance", labelAr: "أعمال ومالية", icon: "📊" },
      { value: "engineering", labelEn: "Engineering", labelAr: "هندسة", icon: "⚙️" },
      { value: "healthcare", labelEn: "Health Sciences", labelAr: "علوم صحية", icon: "🏥" },
      { value: "creative", labelEn: "Design & Arts", labelAr: "تصميم وفنون", icon: "🎨" },
      { value: "law", labelEn: "Law", labelAr: "قانون", icon: "⚖️" },
      { value: "other", labelEn: "Other", labelAr: "أخرى", icon: "🌍" },
    ],
  },
  {
    key: "goal" as const,
    titleEn: "What is your main goal?",
    titleAr: "ما هدفك الرئيسي؟",
    options: [
      { value: "volunteering", labelEn: "Volunteering / Clubs", labelAr: "تطوع / أندية", icon: "🤝" },
      { value: "internship", labelEn: "Internship (Co-op)", labelAr: "تدريب تعاوني", icon: "🏢" },
      { value: "part-time", labelEn: "Part-time Job", labelAr: "عمل جزئي", icon: "⏰" },
      { value: "full-time", labelEn: "First Full-time Job", labelAr: "وظيفتي الأولى", icon: "🚀" },
    ],
  },
  {
    key: "language" as const,
    titleEn: "Resume language?",
    titleAr: "لغة السيرة الذاتية؟",
    options: [
      { value: "ar", labelEn: "Arabic", labelAr: "عربي", icon: "🇸🇦" },
      { value: "en", labelEn: "English", labelAr: "إنجليزي", icon: "🇺🇸" },
    ],
  },
];

export default function OnboardingQuiz({ lang, onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [targets, setTargets] = useState<OnboardingTargets>(defaultTargets);
  const [showSummary, setShowSummary] = useState(false);

  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const currentQ = questions[step];

  const handleSelect = (value: string) => {
    setTargets((prev) => ({ ...prev, [currentQ.key]: value }));
    if (step < questions.length - 1) {
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
            {Object.entries(targets).map(([key, value]) => {
              const q = questions.find((q) => q.key === key);
              return (
                <div key={key} className="flex items-center justify-between rounded-lg border bg-card p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{q ? l(q.titleEn, q.titleAr) : key}</p>
                    <p className="font-medium text-foreground">{getLabel(key, value)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowSummary(false);
                      setStep(questions.findIndex((q) => q.key === key));
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg" onClick={() => onComplete(targets)}>
            <Sparkles className="w-4 h-4 me-2" />
            {l("Start Building", "ابدأ الآن")}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--primary)/0.05)] via-background to-[hsl(var(--accent)/0.08)] flex items-center justify-center p-4" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Card className="w-full max-w-lg p-8 space-y-6 shadow-2xl border-primary/20">
        {/* Logo */}
        <div className="text-center">
          <img src={seeratyLogo} alt="Seeraty سيرتي" className="h-16 mx-auto mb-4" />
        </div>

        {/* Progress */}
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                i <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Question */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {step + 1} / {questions.length}
          </p>
          <h2 className="text-xl font-bold text-foreground">
            {l(currentQ.titleEn, currentQ.titleAr)}
          </h2>
        </div>

        {/* Options */}
        <div className={cn("grid gap-3", currentQ.options.length <= 3 ? "grid-cols-1" : "grid-cols-2")}>
          {currentQ.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "rounded-xl border-2 p-4 text-center transition-all hover:border-primary hover:bg-primary/5",
                targets[currentQ.key] === opt.value
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border bg-card"
              )}
            >
              <span className="text-2xl block mb-1">{opt.icon}</span>
              <span className="text-sm font-medium text-foreground">{lang === "ar" ? opt.labelAr : opt.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
          >
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
