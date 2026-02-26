import { useEffect, useRef, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import PersonalInfoSection from "./PersonalInfoSection";
import SummarySection from "./SummarySection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import CertificationsSection from "./CertificationsSection";
import SkillsSection from "./SkillsSection";
import LanguagesSection from "./LanguagesSection";
import ProjectsSection from "./ProjectsSection";
import ATSKeywordsSection from "./ATSKeywordsSection";
import SectionProgressBar from "./SectionProgressBar";
import { Separator } from "@/components/ui/separator";
import { computeSectionProgress, getNextPrioritySection, type SectionProgress } from "@/lib/careerTargets";
import type { ResumeData } from "@/types/resume";

interface NextPriority {
  sectionKey: string;
  labelEn: string;
  labelAr: string;
  gainPercent: number;
}

interface Props {
  lang: "en" | "ar";
  persona?: { stage: string; industry: string; goal: string } | null;
  onProgressUpdate?: (sections: SectionProgress[]) => void;
  onNextPriorityUpdate?: (priority: NextPriority | null) => void;
}

export default function ResumeForm({ lang, persona, onProgressUpdate, onNextPriorityUpdate }: Props) {
  const { watch } = useFormContext<ResumeData>();
  const data = watch();
  const onProgressRef = useRef(onProgressUpdate);
  onProgressRef.current = onProgressUpdate;

  // Stabilise by serialising only the fields that matter
  const dataKey = useMemo(() => {
    if (!persona) return "";
    return JSON.stringify({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      summary: data.summary,
      skills: data.skills,
      educationCount: data.education?.length ?? 0,
      educationDesc: data.education?.map((e) => e.description + e.institution).join("|"),
      expCount: data.experiences?.length ?? 0,
      expText: data.experiences?.map((e) => e.company + e.jobTitle + e.bullets).join("|"),
      projCount: data.projects?.length ?? 0,
      projText: data.projects?.map((p) => p.name + p.description).join("|"),
      langCount: data.languages?.length ?? 0,
      langText: data.languages?.map((l) => l.name).join("|"),
      certCount: data.certifications?.length ?? 0,
      certText: data.certifications?.map((c) => c.name).join("|"),
    });
  }, [data, persona]);

  const sections = useMemo(() => {
    if (!persona || !dataKey) return [];
    return computeSectionProgress(data, persona);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey, persona]);

  const onNextPriorityRef = useRef(onNextPriorityUpdate);
  onNextPriorityRef.current = onNextPriorityUpdate;

  useEffect(() => {
    if (sections.length > 0) {
      onProgressRef.current?.(sections);
      if (persona) {
        const next = getNextPrioritySection(sections, persona.stage, persona.goal);
        if (next) {
          const overall = sections.reduce((s, sec) => s + sec.percent, 0) / sections.length;
          const gain = Math.round(((100 - next.percent) * 100) / (sections.length * 100));
          onNextPriorityRef.current?.({
            sectionKey: next.sectionKey,
            labelEn: next.labelEn,
            labelAr: next.labelAr,
            gainPercent: Math.max(gain, 1),
          });
        } else {
          onNextPriorityRef.current?.(null);
        }
      }
    }
  }, [sections, persona]);

  const getProgress = (key: string) =>
    sections.find((s) => s.sectionKey === key);

  const renderBar = (key: string) => {
    const progress = getProgress(key);
    if (!progress) return null;
    return <SectionProgressBar progress={progress} lang={lang} />;
  };

  return (
    <div className="space-y-5">
      <PersonalInfoSection lang={lang} />
      {renderBar("personal")}
      <Separator />
      <SummarySection lang={lang} />
      {renderBar("summary")}
      <Separator />
      <ExperienceSection lang={lang} />
      {renderBar("experience")}
      <Separator />
      <EducationSection lang={lang} />
      {renderBar("education")}
      <Separator />
      <CertificationsSection lang={lang} />
      {renderBar("certifications")}
      <Separator />
      <SkillsSection lang={lang} />
      {renderBar("skills")}
      <Separator />
      <LanguagesSection lang={lang} />
      {renderBar("languages")}
      <Separator />
      <ProjectsSection lang={lang} />
      {renderBar("projects")}
      <Separator />
      <ATSKeywordsSection lang={lang} />
    </div>
  );
}
