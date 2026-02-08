import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ResumeData } from "@/types/resume";

interface Props { lang: 'en' | 'ar' }

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

export default function PersonalInfoSection({ lang }: Props) {
  const { register } = useFormContext<ResumeData>();

  const fields = [
    { name: "fullName" as const, en: "Full Name", ar: "الاسم الكامل" },
    { name: "jobTitle" as const, en: "Job Title", ar: "المسمى الوظيفي" },
    { name: "location" as const, en: "City / Country", ar: "المدينة / الدولة" },
    { name: "phone" as const, en: "Phone", ar: "رقم الجوال" },
    { name: "email" as const, en: "Email", ar: "البريد الإلكتروني" },
    { name: "linkedin" as const, en: "LinkedIn", ar: "LinkedIn" },
    { name: "website" as const, en: "Website / Portfolio", ar: "الموقع / البورتفوليو" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
        {l(lang, "Personal Information", "المعلومات الشخصية")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.name} className={f.name === "fullName" ? "sm:col-span-2" : ""}>
            <Label className="text-xs text-muted-foreground">{l(lang, f.en, f.ar)}</Label>
            <Input {...register(f.name)} className="mt-1 h-9 text-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
