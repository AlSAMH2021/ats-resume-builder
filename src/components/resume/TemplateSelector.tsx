import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

export type ResumeTemplate = "starter" | "academic" | "professional";

interface Props {
  value: ResumeTemplate;
  onChange: (t: ResumeTemplate) => void;
  lang: "en" | "ar";
  seeratyOverlay: boolean;
  onSeeratyOverlayChange: (v: boolean) => void;
}

const templates: { id: ResumeTemplate; labelEn: string; labelAr: string; desc: string }[] = [
  { id: "starter", labelEn: "Starter", labelAr: "البداية", desc: "Skills-first · Visual" },
  { id: "academic", labelEn: "Academic", labelAr: "الأكاديمي", desc: "Structured · Balanced" },
  { id: "professional", labelEn: "Professional", labelAr: "المهني", desc: "ATS-Optimized · Dense" },
];

export default function TemplateSelector({ value, onChange, lang, seeratyOverlay, onSeeratyOverlayChange }: Props) {
  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "flex-1 rounded-md border px-3 py-2 text-center text-sm transition-all",
              "hover:border-accent hover:bg-accent/5",
              value === t.id
                ? "border-accent bg-accent/10 text-accent-foreground ring-1 ring-accent"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <span className="font-semibold block">{lang === "ar" ? t.labelAr : t.labelEn}</span>
            <span className="text-[10px] opacity-60">{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Seeraty overlay toggle */}
      <div className={cn(
        "flex items-center justify-between rounded-lg border px-3 py-2 transition-all",
        seeratyOverlay
          ? "border-purple-400 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-700"
          : "border-border bg-card"
      )}>
        <div className="flex items-center gap-2">
          <Sparkles className={cn("w-4 h-4", seeratyOverlay ? "text-purple-500" : "text-muted-foreground")} />
          <Label htmlFor="seeraty-toggle" className={cn(
            "text-sm font-medium cursor-pointer",
            seeratyOverlay ? "text-purple-700 dark:text-purple-300" : "text-foreground"
          )}>
            {l("Seeraty Style ✨", "نمط سيرتي ✨")}
          </Label>
        </div>
        <Switch
          id="seeraty-toggle"
          checked={seeratyOverlay}
          onCheckedChange={onSeeratyOverlayChange}
        />
      </div>
    </div>
  );
}
