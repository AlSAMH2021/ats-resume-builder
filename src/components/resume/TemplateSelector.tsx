import { cn } from "@/lib/utils";

export type ResumeTemplate = "classic" | "modern" | "minimal" | "executive" | "seeraty" | "starter" | "academic" | "professional";

interface Props {
  value: ResumeTemplate;
  onChange: (t: ResumeTemplate) => void;
  lang: "en" | "ar";
}

const templates: { id: ResumeTemplate; labelEn: string; labelAr: string; desc: string }[] = [
  { id: "starter", labelEn: "Starter", labelAr: "المبتدئ", desc: "Clean · Simple" },
  { id: "academic", labelEn: "Academic", labelAr: "أكاديمي", desc: "Projects · Skills" },
  { id: "professional", labelEn: "Professional", labelAr: "احترافي", desc: "ATS · Polished" },
  { id: "classic", labelEn: "Classic", labelAr: "كلاسيكي", desc: "Serif · Traditional" },
  { id: "modern", labelEn: "Modern", labelAr: "عصري", desc: "Sans-serif · Bold" },
  { id: "minimal", labelEn: "Minimal", labelAr: "بسيط", desc: "Clean · Compact" },
  { id: "executive", labelEn: "Executive", labelAr: "تنفيذي", desc: "Premium · Elegant" },
  { id: "seeraty", labelEn: "Seeraty ✨", labelAr: "سيرتي ✨", desc: "Signature · Branded" },
];

export default function TemplateSelector({ value, onChange, lang }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {templates.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "flex-1 min-w-[80px] rounded-md border px-3 py-2 text-center text-sm transition-all",
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
  );
}
