import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ResumeData } from "@/types/resume";

interface Props { lang: 'en' | 'ar' }

export default function SkillsSection({ lang }: Props) {
  const { register } = useFormContext<ResumeData>();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
        {lang === 'ar' ? "المهارات" : "Skills"}
      </h3>
      <Label className="text-xs text-muted-foreground">
        {lang === 'ar' ? "أدخل المهارات مفصولة بفواصل" : "Enter skills separated by commas"}
      </Label>
      <Textarea {...register("skills")} rows={3} className="text-sm resize-none" placeholder="React, TypeScript, Node.js, ..." />
    </div>
  );
}
