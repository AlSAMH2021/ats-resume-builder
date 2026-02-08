import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { ResumeData } from "@/types/resume";

interface Props { lang: 'en' | 'ar' }

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

const levels = {
  en: ["Native", "Fluent", "Advanced", "Intermediate", "Beginner"],
  ar: ["اللغة الأم", "طلاقة", "متقدم", "متوسط", "مبتدئ"],
};

export default function LanguagesSection({ lang }: Props) {
  const { register, control } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({ control, name: "languages" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
          {l(lang, "Languages", "اللغات")}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => append({ name: "", level: "" })}
        >
          <Plus className="w-3 h-3 mr-1" /> {l(lang, "Add", "إضافة")}
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">{l(lang, "Language", "اللغة")}</Label>
            <Input {...register(`languages.${index}.name`)} className="mt-0.5 h-8 text-sm" />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">{l(lang, "Level", "المستوى")}</Label>
            <select
              {...register(`languages.${index}.level`)}
              className="mt-0.5 h-8 w-full text-sm rounded-md border border-input bg-background px-3"
            >
              <option value="">{l(lang, "Select...", "اختر...")}</option>
              {levels[lang].map((lv) => (
                <option key={lv} value={lv}>{lv}</option>
              ))}
            </select>
          </div>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => remove(index)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-3">
          {l(lang, "No languages added yet", "لم تتم إضافة لغات بعد")}
        </p>
      )}
    </div>
  );
}
