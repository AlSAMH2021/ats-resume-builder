import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ResumeData } from "@/types/resume";

interface Props { lang: 'en' | 'ar' }

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

export default function PersonalInfoSection({ lang }: Props) {
  const { register } = useFormContext<ResumeData>();

  const fields = [
    { name: "fullName" as const, en: "Name", ar: "الاسم" },
    { name: "email" as const, en: "Email", ar: "الايميل" },
    { name: "phone" as const, en: "Phone", ar: "رقم التواصل" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
        {l(lang, "Section 1: Contact Information", "القسم الأول : معلومات التواصل")}
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {fields.map((f) => (
          <div key={f.name}>
            <Label className="text-xs text-muted-foreground">{l(lang, f.en, f.ar)}</Label>
            <Input {...register(f.name)} className="mt-1 h-9 text-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
