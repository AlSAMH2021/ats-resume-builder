import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  Circle,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SectionProgress } from "@/lib/careerTargets";

interface Props {
  progress: SectionProgress;
  lang: "en" | "ar";
  feedbackMessage?: { en: string; ar: string };
}

function WeightDots({ weight, className }: { weight: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "w-1 h-1 rounded-full inline-block",
            i < weight ? "bg-current" : "bg-current opacity-20"
          )}
        />
      ))}
    </span>
  );
}

function CategoryBadge({ category, lang }: { category: string; lang: "en" | "ar" }) {
  const config = {
    required: {
      label: lang === "ar" ? "مطلوب" : "Required",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    recommended: {
      label: lang === "ar" ? "موصى به" : "Recommended",
      className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    },
    bonus: {
      label: lang === "ar" ? "إضافي" : "Bonus",
      className: "bg-muted text-muted-foreground border-muted-foreground/20",
    },
  }[category] ?? { label: category, className: "bg-muted text-muted-foreground" };

  return (
    <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

function getTier(percent: number, lang: "en" | "ar") {
  if (percent >= 90)
    return { label: lang === "ar" ? "ممتازة!" : "Excellent!", color: "text-green-600", icon: <Sparkles className="w-3 h-3" /> };
  if (percent >= 70)
    return { label: lang === "ar" ? "قوية" : "Strong", color: "text-green-600", icon: null };
  if (percent >= 40)
    return { label: lang === "ar" ? "في تقدم" : "Getting There", color: "text-yellow-600", icon: null };
  return { label: lang === "ar" ? "يحتاج تحسين" : "Needs Work", color: "text-destructive", icon: null };
}

export default function SectionProgressBar({ progress, lang, feedbackMessage }: Props) {
  const [open, setOpen] = useState(false);
  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const { percent, targets } = progress;

  const barColor =
    percent >= 90
      ? "bg-green-500"
      : percent >= 70
        ? "bg-green-500"
        : percent >= 40
          ? "bg-yellow-500"
          : "bg-destructive";

  const unmet = targets.filter((t) => !t.met);
  const tier = getTier(percent, lang);

  // Feedback rendering
  const renderFeedback = () => {
    if (!feedbackMessage) return null;
    const msg = lang === "ar" ? feedbackMessage.ar : feedbackMessage.en;

    if (percent <= 33) {
      return (
        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
          <Lightbulb className="w-3 h-3 text-yellow-500 shrink-0" />
          {msg}
        </p>
      );
    }
    if (percent <= 66) {
      return (
        <p className="text-[10px] text-primary flex items-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3 shrink-0" />
          {msg}
        </p>
      );
    }
    return (
      <p className="text-[10px] text-green-600 flex items-center gap-1 mt-1">
        <CheckCircle2 className="w-3 h-3 shrink-0" />
        {msg}
      </p>
    );
  };

  return (
    <div className="space-y-1.5">
      {/* Bar row */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 group"
      >
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", barColor)}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={cn("text-[10px] font-bold min-w-[60px] text-end flex items-center justify-end gap-1", tier.color)}>
          {tier.icon}
          {tier.label}
        </span>
        {unmet.length > 0 && (
          open ? (
            <ChevronUp className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )
        )}
      </button>

      {/* Feedback message */}
      {renderFeedback()}

      {/* Expanded checklist with tips */}
      {open && unmet.length > 0 && (
        <div className="rounded-lg border bg-accent/30 p-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {targets.map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              {t.met ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              )}
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <CategoryBadge category={t.category} lang={lang} />
                  <p
                    className={cn(
                      "text-xs",
                      t.met ? "text-muted-foreground line-through" : "text-foreground font-medium"
                    )}
                  >
                    {lang === "ar" ? t.requirementAr : t.requirementEn}
                  </p>
                  <WeightDots
                    weight={t.weight}
                    className={cn(
                      "ms-auto",
                      t.category === "required"
                        ? "text-primary"
                        : t.category === "recommended"
                          ? "text-muted-foreground"
                          : "text-muted-foreground/50"
                    )}
                  />
                </div>
                {!t.met && (
                  <p className="text-[11px] text-muted-foreground flex items-start gap-1">
                    <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 shrink-0" />
                    {lang === "ar" ? t.tipAr : t.tipEn}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
