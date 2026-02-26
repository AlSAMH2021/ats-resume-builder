import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Lightbulb, CheckCircle2, Circle } from "lucide-react";
import type { SectionProgress } from "@/lib/careerTargets";

interface Props {
  progress: SectionProgress;
  lang: "en" | "ar";
}

export default function SectionProgressBar({ progress, lang }: Props) {
  const [open, setOpen] = useState(false);
  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const { percent, targets } = progress;

  const barColor =
    percent === 100
      ? "bg-green-500"
      : percent >= 50
        ? "bg-yellow-500"
        : "bg-destructive";

  const unmet = targets.filter((t) => !t.met);

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
        <span
          className={cn(
            "text-[10px] font-bold min-w-[32px] text-end tabular-nums",
            percent === 100 ? "text-green-600" : "text-muted-foreground"
          )}
        >
          {percent}%
        </span>
        {unmet.length > 0 && (
          open ? (
            <ChevronUp className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )
        )}
      </button>

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
              <div className="space-y-0.5">
                <p
                  className={cn(
                    "text-xs",
                    t.met ? "text-muted-foreground line-through" : "text-foreground font-medium"
                  )}
                >
                  {lang === "ar" ? t.requirementAr : t.requirementEn}
                </p>
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
