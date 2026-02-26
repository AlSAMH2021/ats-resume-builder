import { useMemo } from "react";
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
import { computeSectionProgress, type SectionProgress } from "@/lib/careerTargets";
import type { ResumeData } from "@/types/resume";

interface Props {
  lang: "en" | "ar";
  persona?: { stage: string; industry: string; goal: string } | null;
  onProgressUpdate?: (sections: SectionProgress[]) => void;
}

const sectionKeyMap: Record<string, string> = {
  PersonalInfoSection: "personal",
  SummarySection: "summary",
  ExperienceSection: "experience",
  EducationSection: "education",
  CertificationsSection: "certifications",
  SkillsSection: "skills",
  LanguagesSection: "languages",
  ProjectsSection: "projects",
};

export default function ResumeForm({ lang, persona, onProgressUpdate }: Props) {
  const { watch } = useFormContext<ResumeData>();
  const data = watch();

  const sections = useMemo(() => {
    if (!persona) return [];
    const result = computeSectionProgress(data, persona);
    onProgressUpdate?.(result);
    return result;
  }, [data, persona]);

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
