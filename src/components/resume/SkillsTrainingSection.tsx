import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ResumeData } from "@/types/resume";

interface Props { lang: 'en' | 'ar' }

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

export default function SkillsTrainingSection({ lang }: Props) {
  const { register, control } = useFormContext<ResumeData>();
  const courses = useFieldArray({ control, name: "courses" });
  const certs = useFieldArray({ control, name: "certifications" });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
        {l(lang, "Section 3: Skills Training", "القسم الثالث: التعليم المهاري")}
      </h3>

      {/* الدورات التدريبية */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-foreground">
            {l(lang, "Training Courses", "الدورات التدريبية")}
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => courses.append({ name: "" })}
          >
            <Plus className="w-3 h-3 mr-1" /> {l(lang, "Add", "إضافة")}
          </Button>
        </div>
        {courses.fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">
                {l(lang, `Course ${index + 1}`, `دورة ${index + 1}`)}
              </Label>
              <Input {...register(`courses.${index}.name`)} className="mt-0.5 h-8 text-sm" />
            </div>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => courses.remove(index)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
        {courses.fields.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            {l(lang, "No courses added yet", "لم تتم إضافة دورات بعد")}
          </p>
        )}
      </div>

      <Separator />

      {/* الشهادات المهنية */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-foreground">
            {l(lang, "Professional Certifications", "الشهادات المهنية")}
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => certs.append({ name: "", issuer: "", date: "" })}
          >
            <Plus className="w-3 h-3 mr-1" /> {l(lang, "Add", "إضافة")}
          </Button>
        </div>
        {certs.fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">
                {l(lang, `Certificate ${index + 1}`, `شهادة ${index + 1}`)}
              </Label>
              <Input {...register(`certifications.${index}.name`)} className="mt-0.5 h-8 text-sm" />
            </div>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => certs.remove(index)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
        {certs.fields.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            {l(lang, "No certifications added yet", "لم تتم إضافة شهادات بعد")}
          </p>
        )}
      </div>
    </div>
  );
}
