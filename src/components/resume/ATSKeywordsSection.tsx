import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { extractKeywords, calculateATSMatch, resumeToPlainText } from "@/lib/atsKeywords";
import type { ResumeData } from "@/types/resume";

interface Props { lang: 'en' | 'ar' }

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

export default function ATSKeywordsSection({ lang }: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const { watch } = useFormContext<ResumeData>();
  const data = watch();

  const analysis = useMemo(() => {
    if (!jobDescription.trim()) return null;
    const resumeText = resumeToPlainText(data, lang);
    return calculateATSMatch(resumeText, jobDescription);
  }, [jobDescription, data, lang]);

  const keywords = useMemo(() => {
    if (!jobDescription.trim()) return [];
    return extractKeywords(jobDescription);
  }, [jobDescription]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
        {l(lang, "ATS Keywords Analysis", "تحليل الكلمات المفتاحية ATS")}
      </h3>
      <div>
        <Label className="text-xs text-muted-foreground">
          {l(lang, "Paste the job description here", "الصق وصف الوظيفة هنا")}
        </Label>
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={4}
          className="mt-1 text-sm resize-none"
          placeholder={l(lang, "Paste job description to analyze keyword match...", "الصق وصف الوظيفة لتحليل تطابق الكلمات...")}
        />
      </div>

      {analysis && (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{l(lang, "ATS Match Score", "نسبة التطابق")}</span>
              <span className="font-semibold">{analysis.score}%</span>
            </div>
            <Progress value={analysis.score} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {l(lang, "This is an approximate indicator based on keyword matching only.", "هذا مؤشر تقريبي مبني على تطابق الكلمات فقط.")}
            </p>
          </div>

          {analysis.matched.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground">{l(lang, "Matched Keywords", "كلمات متطابقة")}</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.matched.map((w) => (
                  <Badge key={w} variant="secondary" className="text-xs bg-green-100 text-green-800">{w}</Badge>
                ))}
              </div>
            </div>
          )}

          {analysis.missing.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground">{l(lang, "Missing Keywords — consider adding", "كلمات مفقودة — يُنصح بإضافتها")}</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.missing.map((w) => (
                  <Badge key={w} variant="outline" className="text-xs border-amber-300 text-amber-700">{w}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
