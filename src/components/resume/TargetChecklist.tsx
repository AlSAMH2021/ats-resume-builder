import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Target,
  CheckCircle2,
  Circle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Trophy,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SectionProgress } from "@/lib/careerTargets";
import { computeWeightedOverall } from "@/lib/careerTargets";

interface NextPriority {
  sectionKey: string;
  labelEn: string;
  labelAr: string;
  gainPercent: number;
}

interface Props {
  sections: SectionProgress[];
  lang: "en" | "ar";
  persona?: { stage: string; industry: string; goal: string } | null;
  nextPriority?: NextPriority | null;
}

function WeightDots({ weight, className }: { weight: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full inline-block",
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
    <Badge variant="outline" className={cn("text-[8px] px-1 py-0 h-3.5 font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

function getTierLabel(percent: number, lang: "en" | "ar") {
  if (percent >= 90) return lang === "ar" ? "ممتازة! ✨" : "Excellent! ✨";
  if (percent >= 70) return lang === "ar" ? "قوية" : "Strong";
  if (percent >= 40) return lang === "ar" ? "في تقدم" : "Getting There";
  return lang === "ar" ? "يحتاج تحسين" : "Needs Work";
}

export default function TargetChecklist({ sections, lang, persona, nextPriority }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const overall = persona
    ? computeWeightedOverall(sections, persona)
    : (sections.length > 0 ? Math.round(sections.reduce((s, sec) => s + sec.percent, 0) / sections.length) : 0);
  const allDone = overall === 100;

  const totalTargets = sections.reduce((s, sec) => s + sec.targets.length, 0);
  const metTargets = sections.reduce(
    (s, sec) => s + sec.targets.filter((t) => t.met).length,
    0
  );

  // Check if any required targets are unmet across all sections
  const hasUnmetRequired = sections.some((sec) =>
    sec.targets.some((t) => !t.met && t.category === "required")
  );

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-card shadow-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors"
      >
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            allDone ? "bg-green-500/10" : "bg-primary/10"
          )}
        >
          {allDone ? (
            <Trophy className="w-5 h-5 text-green-500" />
          ) : (
            <Target className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1 text-start">
          <p className="text-sm font-bold text-foreground">
            {allDone
              ? l("All targets met! 🎉", "تم تحقيق جميع المستهدفات! 🎉")
              : l("Career Targets", "المستهدفات المهنية")}
          </p>
          <p className="text-xs text-muted-foreground">
            {metTargets}/{totalTargets} {l("completed", "مكتمل")} · {getTierLabel(overall, lang)}
          </p>
        </div>
        {/* Overall ring */}
        <div className="relative w-10 h-10 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-muted"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className={allDone ? "stroke-green-500" : "stroke-primary"}
              strokeWidth="3"
              strokeDasharray={`${overall} ${100 - overall}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">
            {overall}%
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Body */}
      {expanded && (
        <div className="border-t">
          {/* Next Priority Banner */}
          {nextPriority && !allDone && (
            <div className="bg-primary/10 border-b px-4 py-2.5 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-primary shrink-0" />
              <p className="text-xs text-primary flex-1">
                {lang === "ar" ? (
                  <>التالي: أكمل قسم <strong>{nextPriority.labelAr}</strong> (+{nextPriority.gainPercent}% للنتيجة الإجمالية)</>
                ) : (
                  <>Next: Complete your <strong>{nextPriority.labelEn}</strong> section (+{nextPriority.gainPercent}% to overall score)</>
                )}
              </p>
            </div>
          )}

          <div className="divide-y">
            {sections.map((sec) => {
              const isOpen = expandedSection === sec.sectionKey;
              const secTier = getTierLabel(sec.percent, lang);
              const barColor =
                sec.percent >= 90
                  ? "bg-green-500"
                  : sec.percent >= 70
                    ? "bg-green-500"
                    : sec.percent >= 40
                      ? "bg-yellow-500"
                      : "bg-destructive";

              return (
                <div key={sec.sectionKey}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSection(isOpen ? null : sec.sectionKey)
                    }
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/30 transition-colors"
                  >
                    {sec.percent >= 90 ? (
                      <Sparkles className="w-4 h-4 text-green-500 shrink-0" />
                    ) : sec.percent === 100 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-xs font-medium text-foreground flex-1 text-start">
                      {lang === "ar" ? sec.labelAr : sec.labelEn}
                    </span>
                    <span className="text-[9px] text-muted-foreground hidden sm:inline">
                      {secTier}
                    </span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          barColor
                        )}
                        style={{ width: `${sec.percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground min-w-[28px] text-end">
                      {sec.percent}%
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-3 space-y-2 animate-in fade-in duration-200">
                      {sec.targets.map((t, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-start gap-2 rounded-lg p-2.5",
                            t.met ? "bg-green-500/5" : "bg-accent/40"
                          )}
                        >
                          {t.met ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                          ) : (
                            <Lightbulb className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <CategoryBadge category={t.category} lang={lang} />
                              <p className={cn(
                                "text-xs",
                                t.met ? "text-muted-foreground line-through" : "font-medium text-foreground"
                              )}>
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
                              <p className="text-[11px] text-muted-foreground">
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
            })}
          </div>

          {/* Required gate warning */}
          {hasUnmetRequired && !allDone && (
            <div className="border-t bg-yellow-500/5 px-4 py-2.5 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
              <p className="text-[11px] text-yellow-700 dark:text-yellow-400">
                {l(
                  "Complete all required targets to reach 'Strong' tier",
                  "أكمل جميع المستهدفات المطلوبة للوصول لمستوى 'قوية'"
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
