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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionProgress } from "@/lib/careerTargets";
import { computeWeightedOverall } from "@/lib/careerTargets";

interface Props {
  sections: SectionProgress[];
  lang: "en" | "ar";
  persona?: { stage: string; industry: string; goal: string } | null;
}

export default function TargetChecklist({ sections, lang, persona }: Props) {
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
            {metTargets}/{totalTargets} {l("completed", "مكتمل")} · {overall}%
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
        <div className="border-t divide-y">
          {sections.map((sec) => {
            const unmet = sec.targets.filter((t) => !t.met);
            const isOpen = expandedSection === sec.sectionKey;
            const barColor =
              sec.percent === 100
                ? "bg-green-500"
                : sec.percent >= 50
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
                  {sec.percent === 100 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <span className="text-xs font-medium text-foreground flex-1 text-start">
                    {lang === "ar" ? sec.labelAr : sec.labelEn}
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

                {isOpen && unmet.length > 0 && (
                  <div className="px-4 pb-3 space-y-2 animate-in fade-in duration-200">
                    {unmet.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-lg bg-accent/40 p-2.5"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-medium text-foreground">
                            {lang === "ar" ? t.requirementAr : t.requirementEn}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {lang === "ar" ? t.tipAr : t.tipEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
