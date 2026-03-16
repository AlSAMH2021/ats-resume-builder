import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import type { ResumeData } from "@/types/resume";

interface Props { lang: 'en' | 'ar' }

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

export default function ExperienceSection({ lang }: Props) {
  const { register, control, watch, setValue } = useFormContext<ResumeData>();
  const experiences = useFieldArray({ control, name: "experiences" });
  const projects = useFieldArray({ control, name: "projects" });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
        {l(lang, "Section 4: Work Experience", "القسم الرابع: الخبرات العملية")}
      </h3>

      {/* الخبرات */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-foreground">
            {l(lang, "Work / Volunteering", "العمل / التطوع")}
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => experiences.append({ jobTitle: "", company: "", location: "", startDate: "", endDate: "", current: false, bullets: "" })}
          >
            <Plus className="w-3 h-3 mr-1" /> {l(lang, "Add", "إضافة")}
          </Button>
        </div>

        {experiences.fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-3 space-y-2 bg-card">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
              <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => experiences.remove(index)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">{l(lang, "Job Title", "المسمى الوظيفي")}</Label>
                <Input {...register(`experiences.${index}.jobTitle`)} className="mt-0.5 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{l(lang, "Organization", "الجهة")}</Label>
                <Input {...register(`experiences.${index}.company`)} className="mt-0.5 h-8 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{l(lang, "Start", "البداية")}</Label>
                <Input {...register(`experiences.${index}.startDate`)} placeholder="YYYY" className="mt-0.5 h-8 text-sm" />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">{l(lang, "End", "النهاية")}</Label>
                  <Input
                    {...register(`experiences.${index}.endDate`)}
                    placeholder="YYYY"
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
                {l(lang, "Tasks & Details (one per line)", "المهام والتفاصيل (سطر لكل نقطة)")}
              </Label>
              <Textarea {...register(`experiences.${index}.bullets`)} rows={3} className="mt-0.5 text-sm resize-none" />
            </div>
          </div>
        ))}

        {experiences.fields.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3">
            {l(lang, "No experiences added yet", "لم تتم إضافة خبرات بعد")}
          </p>
        )}
      </div>

      <Separator />

      {/* أعمال / إنجازات */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-foreground">
            {l(lang, "Works / Achievements", "أعمال / إنجازات")}
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => projects.append({ name: "", description: "", url: "" })}
          >
            <Plus className="w-3 h-3 mr-1" /> {l(lang, "Add", "إضافة")}
          </Button>
        </div>

        {projects.fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-3 space-y-2 bg-card">
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
              <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => projects.remove(index)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{l(lang, "Achievement Title", "عنوان العمل / الإنجاز")}</Label>
              <Input {...register(`projects.${index}.name`)} className="mt-0.5 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{l(lang, "Description", "الوصف")}</Label>
              <Textarea {...register(`projects.${index}.description`)} rows={2} className="mt-0.5 text-sm resize-none" />
            </div>
          </div>
        ))}

        {projects.fields.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3">
            {l(lang, "No achievements added yet", "لم تتم إضافة إنجازات بعد")}
          </p>
        )}
      </div>
    </div>
  );
}
