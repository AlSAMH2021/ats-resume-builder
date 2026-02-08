import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ResumeData } from "@/types/resume";

interface Props { lang: 'en' | 'ar' }

export default function SummarySection({ lang }: Props) {
  const { register } = useFormContext<ResumeData>();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
        {lang === 'ar' ? "الملخص المهني" : "Professional Summary"}
      </h3>
      <Label className="text-xs text-muted-foreground">
        {lang === 'ar' ? "اكتب ملخصاً موجزاً عن خبراتك وأهدافك" : "Write a brief summary of your experience and goals"}
      </Label>
      <Textarea {...register("summary")} rows={4} className="text-sm resize-none" />
    </div>
  );
}
