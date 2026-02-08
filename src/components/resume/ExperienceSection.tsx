import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import type { ResumeData } from "@/types/resume";

interface Props { lang: 'en' | 'ar' }

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

export default function ExperienceSection({ lang }: Props) {
  const { register, control, watch, setValue } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({ control, name: "experiences" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
          {l(lang, "Experience", "الخبرات")}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => append({ jobTitle: "", company: "", location: "", startDate: "", endDate: "", current: false, bullets: "" })}
        >
          <Plus className="w-3 h-3 mr-1" /> {l(lang, "Add", "إضافة")}
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-lg p-3 space-y-2 bg-card">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
            <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => remove(index)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">{l(lang, "Job Title", "المسمى الوظيفي")}</Label>
              <Input {...register(`experiences.${index}.jobTitle`)} className="mt-0.5 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{l(lang, "Company", "الشركة")}</Label>
              <Input {...register(`experiences.${index}.company`)} className="mt-0.5 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{l(lang, "Location", "المدينة/الدولة")}</Label>
              <Input {...register(`experiences.${index}.location`)} className="mt-0.5 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{l(lang, "Start Date", "تاريخ البداية")}</Label>
              <Input {...register(`experiences.${index}.startDate`)} placeholder="YYYY-MM" className="mt-0.5 h-8 text-sm" />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">{l(lang, "End Date", "تاريخ النهاية")}</Label>
                <Input
                  {...register(`experiences.${index}.endDate`)}
                  placeholder="YYYY-MM"
                  className="mt-0.5 h-8 text-sm"
                  disabled={watch(`experiences.${index}.current`)}
                />
              </div>
              <div className="flex items-center gap-1.5 pb-1.5">
                <Checkbox
                  checked={watch(`experiences.${index}.current`) || false}
                  onCheckedChange={(checked) => setValue(`experiences.${index}.current`, !!checked)}
                />
                <Label className="text-xs text-muted-foreground whitespace-nowrap">
                  {l(lang, "Present", "حتى الآن")}
                </Label>
              </div>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">
              {l(lang, "Achievements (one per line)", "الإنجازات (سطر لكل نقطة)")}
            </Label>
            <Textarea {...register(`experiences.${index}.bullets`)} rows={3} className="mt-0.5 text-sm resize-none" />
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          {l(lang, "No experiences added yet", "لم تتم إضافة خبرات بعد")}
        </p>
      )}
    </div>
  );
}
