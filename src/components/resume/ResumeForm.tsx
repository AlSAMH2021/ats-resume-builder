import PersonalInfoSection from "./PersonalInfoSection";
import SummarySection from "./SummarySection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import CertificationsSection from "./CertificationsSection";
import SkillsSection from "./SkillsSection";
import LanguagesSection from "./LanguagesSection";
import ProjectsSection from "./ProjectsSection";
import ATSKeywordsSection from "./ATSKeywordsSection";
import { Separator } from "@/components/ui/separator";

interface Props { lang: 'en' | 'ar' }

export default function ResumeForm({ lang }: Props) {
  return (
    <div className="space-y-5">
      <PersonalInfoSection lang={lang} />
      <Separator />
      <SummarySection lang={lang} />
      <Separator />
      <ExperienceSection lang={lang} />
      <Separator />
      <EducationSection lang={lang} />
      <Separator />
      <CertificationsSection lang={lang} />
      <Separator />
      <SkillsSection lang={lang} />
      <Separator />
      <LanguagesSection lang={lang} />
      <Separator />
      <ProjectsSection lang={lang} />
      <Separator />
      <ATSKeywordsSection lang={lang} />
    </div>
  );
}
