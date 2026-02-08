import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { ResumeData } from "@/types/resume";

interface Props { lang: 'en' | 'ar' }

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

export default function ProjectsSection({ lang }: Props) {
  const { register, control } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({ control, name: "projects" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
          {l(lang, "Projects", "المشاريع")} <span className="text-muted-foreground font-normal normal-case">({l(lang, "optional", "اختياري")})</span>
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => append({ name: "", description: "", url: "" })}
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
              <Label className="text-xs text-muted-foreground">{l(lang, "Project Name", "اسم المشروع")}</Label>
              <Input {...register(`projects.${index}.name`)} className="mt-0.5 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{l(lang, "URL", "الرابط")}</Label>
              <Input {...register(`projects.${index}.url`)} className="mt-0.5 h-8 text-sm" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{l(lang, "Description", "الوصف")}</Label>
            <Textarea {...register(`projects.${index}.description`)} rows={2} className="mt-0.5 text-sm resize-none" />
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-3">
          {l(lang, "No projects added yet", "لم تتم إضافة مشاريع بعد")}
        </p>
      )}
    </div>
  );
}
