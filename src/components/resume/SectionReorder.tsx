import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";

export type ResumeSection =
  | "summary"
  | "experience"
  | "education"
  | "certifications"
  | "skills"
  | "languages"
  | "projects";

export const defaultSectionOrder: ResumeSection[] = [
  "summary",
  "experience",
  "education",
  "certifications",
  "skills",
  "languages",
  "projects",
];

const sectionLabels: Record<ResumeSection, { en: string; ar: string }> = {
  summary: { en: "Summary", ar: "الملخص المهني" },
  experience: { en: "Experience", ar: "الخبرات" },
  education: { en: "Education", ar: "التعليم" },
  certifications: { en: "Certifications", ar: "الشهادات" },
  skills: { en: "Skills", ar: "المهارات" },
  languages: { en: "Languages", ar: "اللغات" },
  projects: { en: "Projects", ar: "المشاريع" },
};

interface Props {
  order: ResumeSection[];
  onChange: (order: ResumeSection[]) => void;
  lang: "en" | "ar";
}

export default function SectionReorder({ order, onChange, lang }: Props) {
  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const move = useCallback(
    (index: number, direction: -1 | 1) => {
      const newOrder = [...order];
      const target = index + direction;
      if (target < 0 || target >= newOrder.length) return;
      [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
      onChange(newOrder);
    },
    [order, onChange]
  );

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">
        {l("Section Order", "ترتيب الأقسام")}
      </p>
      <div className="space-y-1">
        {order.map((section, i) => (
          <div
            key={section}
            className="flex items-center gap-1.5 rounded-md border bg-card px-2 py-1.5 text-sm"
          >
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="flex-1">
              {lang === "ar"
                ? sectionLabels[section].ar
                : sectionLabels[section].en}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={i === 0}
              onClick={() => move(i, -1)}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={i === order.length - 1}
              onClick={() => move(i, 1)}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
