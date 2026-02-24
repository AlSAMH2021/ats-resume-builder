import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface ResumeColors {
  headingColor: string;
  lineColor: string;
}

export const defaultResumeColors: ResumeColors = {
  headingColor: "#1a1a1a",
  lineColor: "#1a1a1a",
};

export const templateDefaultColors: Record<string, ResumeColors> = {
  classic: { headingColor: "#1a1a1a", lineColor: "#1a1a1a" },
  modern: { headingColor: "#2a7a8c", lineColor: "#2a7a8c" },
  minimal: { headingColor: "#555555", lineColor: "#999999" },
  executive: { headingColor: "#6d28d9", lineColor: "#8b5cf6" },
  seeraty: { headingColor: "#7c3aed", lineColor: "#a78bfa" },
};

const presets = [
  { label: "Dark", headingColor: "#1a1a1a", lineColor: "#1a1a1a" },
  { label: "Teal", headingColor: "#2a7a8c", lineColor: "#2a7a8c" },
  { label: "Navy", headingColor: "#1e3a5f", lineColor: "#1e3a5f" },
  { label: "Burgundy", headingColor: "#6b2737", lineColor: "#6b2737" },
  { label: "Forest", headingColor: "#2d5016", lineColor: "#2d5016" },
  { label: "Slate", headingColor: "#475569", lineColor: "#64748b" },
];

interface Props {
  value: ResumeColors;
  onChange: (colors: ResumeColors) => void;
  lang: "en" | "ar";
}

export default function ColorCustomizer({ value, onChange, lang }: Props) {
  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground">
        {l("Color Theme", "نظام الألوان")}
      </p>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange({ headingColor: p.headingColor, lineColor: p.lineColor })}
            className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-all hover:border-accent hover:bg-accent/5"
            style={{
              borderColor:
                value.headingColor === p.headingColor && value.lineColor === p.lineColor
                  ? "hsl(var(--accent))"
                  : undefined,
              background:
                value.headingColor === p.headingColor && value.lineColor === p.lineColor
                  ? "hsl(var(--accent) / 0.1)"
                  : undefined,
            }}
          >
            <span
              className="inline-block h-3 w-3 rounded-full border"
              style={{ backgroundColor: p.headingColor }}
            />
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom pickers */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">
            {l("Headings", "العناوين")}
          </Label>
          <Input
            type="color"
            value={value.headingColor}
            onChange={(e) => onChange({ ...value, headingColor: e.target.value })}
            className="h-7 w-10 cursor-pointer border p-0.5"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">
            {l("Lines", "الخطوط")}
          </Label>
          <Input
            type="color"
            value={value.lineColor}
            onChange={(e) => onChange({ ...value, lineColor: e.target.value })}
            className="h-7 w-10 cursor-pointer border p-0.5"
          />
        </div>
      </div>
    </div>
  );
}
