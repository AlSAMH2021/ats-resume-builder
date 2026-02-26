import type { ResumeData } from "@/types/resume";

export interface CareerTarget {
  sectionKey: string;
  requirementEn: string;
  requirementAr: string;
  tipEn: string;
  tipAr: string;
  check: (data: ResumeData) => boolean;
}

export interface SectionProgress {
  sectionKey: string;
  labelEn: string;
  labelAr: string;
  percent: number;
  targets: (CareerTarget & { met: boolean })[];
}

type Persona = { stage: string; industry: string; goal: string };

function getSkillsList(data: ResumeData): string[] {
  return (data.skills || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function hasBulletKeyword(data: ResumeData, keywords: string[]): boolean {
  const allText = [
    ...data.experiences.map((e) => `${e.jobTitle} ${e.company} ${e.bullets}`),
  ]
    .join(" ")
    .toLowerCase();
  return keywords.some((k) => allText.includes(k.toLowerCase()));
}

function hasProjectKeyword(data: ResumeData, keywords: string[]): boolean {
  const allText = data.projects
    .map((p) => `${p.name} ${p.description}`)
    .join(" ")
    .toLowerCase();
  return keywords.some((k) => allText.includes(k.toLowerCase()));
}

// ─── Target definitions by persona ───────────────────────────

function getTargets(persona: Persona): CareerTarget[] {
  const { stage, industry, goal } = persona;
  const targets: CareerTarget[] = [];

  // ── Summary ──
  targets.push({
    sectionKey: "summary",
    requirementEn: "Write a professional summary (≥30 characters)",
    requirementAr: "اكتب ملخصاً مهنياً (30 حرف على الأقل)",
    tipEn: "A strong summary increases recruiter interest by 40%. Mention your goal and top skills.",
    tipAr: "الملخص القوي يزيد اهتمام المسؤولين بنسبة 40%. اذكر هدفك وأبرز مهاراتك.",
    check: (d) => (d.summary || "").length >= 30,
  });

  // ── Education ──
  targets.push({
    sectionKey: "education",
    requirementEn: "Add at least 1 education entry",
    requirementAr: "أضف مؤهل تعليمي واحد على الأقل",
    tipEn: "Education is the most important section for students. Include your GPA if above 3.0.",
    tipAr: "التعليم هو أهم قسم للطلاب. أضف معدلك التراكمي إذا كان أعلى من 3.0.",
    check: (d) => d.education.length >= 1 && d.education[0].institution.length > 0,
  });

  if (stage === "student" || stage === "graduate") {
    targets.push({
      sectionKey: "education",
      requirementEn: "Include degree details or GPA",
      requirementAr: "أضف تفاصيل الدرجة أو المعدل التراكمي",
      tipEn: "Adding GPA or honors distinguishes you from other candidates.",
      tipAr: "إضافة المعدل أو مرتبة الشرف يميزك عن المرشحين الآخرين.",
      check: (d) => d.education.some((e) => e.description.length > 5),
    });
  }

  // ── Projects (critical for students) ──
  if (stage === "freshman" || stage === "student") {
    targets.push({
      sectionKey: "projects",
      requirementEn: "Add at least 1 project",
      requirementAr: "أضف مشروع واحد على الأقل",
      tipEn:
        industry === "tech"
          ? "Most IT recruiters look for at least one GitHub project at your level. Click here to add yours."
          : "Academic or personal projects show initiative. Add any class project or personal work.",
      tipAr:
        industry === "tech"
          ? "أغلب مسؤولي التوظيف في التقنية يبحثون عن مشروع واحد على الأقل. أضف مشروعك الآن."
          : "المشاريع الأكاديمية أو الشخصية تُظهر المبادرة. أضف أي مشروع دراسي أو شخصي.",
      check: (d) => d.projects.length >= 1 && d.projects[0].name.length > 0,
    });
  }

  if (stage === "graduate") {
    targets.push({
      sectionKey: "projects",
      requirementEn: "Add your graduation project",
      requirementAr: "أضف مشروع التخرج",
      tipEn: "Your graduation project demonstrates depth of knowledge. Make sure to include it.",
      tipAr: "مشروع التخرج يُظهر عمق معرفتك. تأكد من إضافته.",
      check: (d) => d.projects.length >= 1 && d.projects[0].name.length > 0,
    });
  }

  // ── Skills ──
  const skillMinimum = stage === "freshman" ? 3 : 5;
  targets.push({
    sectionKey: "skills",
    requirementEn: `List at least ${skillMinimum} skills`,
    requirementAr: `أضف ${skillMinimum} مهارات على الأقل`,
    tipEn: "Include a mix of technical and soft skills relevant to your field.",
    tipAr: "أضف مزيجاً من المهارات التقنية والشخصية المتعلقة بتخصصك.",
    check: (d) => getSkillsList(d).length >= skillMinimum,
  });

  // Industry-specific skill targets
  const industrySkillMap: Record<string, { keywords: string[]; en: string; ar: string }> = {
    tech: {
      keywords: ["python", "java", "javascript", "react", "sql", "c++", "html", "css", "git"],
      en: "Include at least 2 programming languages",
      ar: "أضف لغتي برمجة على الأقل",
    },
    engineering: {
      keywords: ["autocad", "matlab", "solidworks", "excel", "project management"],
      en: "Include engineering tools (AutoCAD, MATLAB, etc.)",
      ar: "أضف أدوات هندسية (AutoCAD, MATLAB...)",
    },
    law: {
      keywords: ["legal research", "بحث قانوني", "contract", "عقود", "litigation", "تقاضي"],
      en: "Include 'Legal Research' in skills",
      ar: "أضف 'البحث القانوني' في مهاراتك",
    },
    healthcare: {
      keywords: ["first aid", "إسعافات", "patient care", "clinical", "cpr"],
      en: "Include healthcare-related certifications or skills",
      ar: "أضف شهادات أو مهارات صحية",
    },
    business: {
      keywords: ["excel", "financial analysis", "marketing", "accounting", "تسويق", "محاسبة"],
      en: "Include business tools (Excel, financial analysis)",
      ar: "أضف أدوات الأعمال (Excel، تحليل مالي)",
    },
    creative: {
      keywords: ["photoshop", "figma", "illustrator", "ui/ux", "adobe"],
      en: "Include design tools (Figma, Photoshop, etc.)",
      ar: "أضف أدوات التصميم (Figma, Photoshop...)",
    },
  };

  const industrySkill = industrySkillMap[industry];
  if (industrySkill) {
    const minMatch = industry === "tech" ? 2 : 1;
    targets.push({
      sectionKey: "skills",
      requirementEn: industrySkill.en,
      requirementAr: industrySkill.ar,
      tipEn: `ATS systems scan for industry-specific keywords. Add relevant tools to pass automated screening.`,
      tipAr: `أنظمة ATS تفحص الكلمات المفتاحية المتخصصة. أضف الأدوات المناسبة لتجاوز الفحص التلقائي.`,
      check: (d) => {
        const skills = getSkillsList(d);
        const matches = industrySkill.keywords.filter((k) =>
          skills.some((s) => s.includes(k.toLowerCase()))
        );
        return matches.length >= minMatch;
      },
    });
  }

  // ── Experience ──
  if (stage === "graduate" || goal === "full-time") {
    targets.push({
      sectionKey: "experience",
      requirementEn: "Add at least 1 work experience or internship",
      requirementAr: "أضف خبرة عملية أو تدريب واحد على الأقل",
      tipEn: "Even short internships count. Include co-op training or part-time roles.",
      tipAr: "حتى التدريبات القصيرة مهمة. أضف التدريب التعاوني أو العمل الجزئي.",
      check: (d) => d.experiences.length >= 1 && d.experiences[0].company.length > 0,
    });
  }

  if (goal === "volunteering" || (stage === "freshman" && goal === "part-time")) {
    targets.push({
      sectionKey: "experience",
      requirementEn: "Add volunteer work or club activities",
      requirementAr: "أضف عمل تطوعي أو أنشطة أندية",
      tipEn:
        "Since you don't have formal experience yet, listing 2 volunteer activities will increase your chances by 40%.",
      tipAr:
        "بما أنك لا تملك خبرة رسمية بعد، إضافة نشاطين تطوعيين سيزيد فرصك بنسبة 40%.",
      check: (d) =>
        d.experiences.length >= 1 &&
        hasBulletKeyword(d, ["volunteer", "تطوع", "club", "نادي", "community", "مجتمع"]),
    });
  }

  if (industry === "law" && (goal === "internship" || stage === "graduate")) {
    targets.push({
      sectionKey: "experience",
      requirementEn: "Include Summer Training or Moot Court",
      requirementAr: "أضف التدريب الصيفي أو المحكمة الصورية",
      tipEn: "Law firms highly value moot court and summer training experiences.",
      tipAr: "مكاتب المحاماة تقدر كثيراً تجارب المحكمة الصورية والتدريب الصيفي.",
      check: (d) =>
        hasBulletKeyword(d, [
          "summer training",
          "تدريب صيفي",
          "moot court",
          "محكمة صورية",
          "legal clinic",
          "عيادة قانونية",
        ]),
    });
  }

  // ── Languages ──
  targets.push({
    sectionKey: "languages",
    requirementEn: "Add at least 1 language with proficiency level",
    requirementAr: "أضف لغة واحدة مع مستوى الإتقان",
    tipEn: "Bilingual candidates stand out. Include Arabic and English with IELTS/TOEFL scores if available.",
    tipAr: "المرشحون ثنائيو اللغة يتميزون. أضف العربية والإنجليزية مع درجات IELTS/TOEFL إن وجدت.",
    check: (d) => d.languages.length >= 1 && d.languages[0].name.length > 0,
  });

  // ── Certifications (bonus) ──
  if (stage !== "freshman") {
    targets.push({
      sectionKey: "certifications",
      requirementEn: "Add at least 1 certification (optional but recommended)",
      requirementAr: "أضف شهادة واحدة (اختياري لكن مُوصى به)",
      tipEn: "Online certifications from Coursera, Udemy, or Google show continuous learning.",
      tipAr: "الشهادات من Coursera أو Udemy أو Google تُظهر التعلم المستمر.",
      check: (d) => d.certifications.length >= 1 && d.certifications[0].name.length > 0,
    });
  }

  // ── Personal Info ──
  targets.push({
    sectionKey: "personal",
    requirementEn: "Complete your contact information",
    requirementAr: "أكمل معلومات الاتصال",
    tipEn: "Include name, email, phone, and city at minimum.",
    tipAr: "أضف الاسم والبريد والهاتف والمدينة كحد أدنى.",
    check: (d) =>
      d.fullName.length > 0 && d.email.length > 0 && d.phone.length > 0,
  });

  return targets;
}

// ─── Compute progress per section ────────────────────────────

const sectionLabels: Record<string, { en: string; ar: string }> = {
  personal: { en: "Personal Info", ar: "المعلومات الشخصية" },
  summary: { en: "Summary", ar: "الملخص" },
  education: { en: "Education", ar: "التعليم" },
  experience: { en: "Experience", ar: "الخبرات" },
  skills: { en: "Skills", ar: "المهارات" },
  projects: { en: "Projects", ar: "المشاريع" },
  languages: { en: "Languages", ar: "اللغات" },
  certifications: { en: "Certifications", ar: "الشهادات" },
};

export function computeSectionProgress(
  data: ResumeData,
  persona: Persona
): SectionProgress[] {
  const allTargets = getTargets(persona);

  const grouped: Record<string, CareerTarget[]> = {};
  for (const t of allTargets) {
    if (!grouped[t.sectionKey]) grouped[t.sectionKey] = [];
    grouped[t.sectionKey].push(t);
  }

  return Object.entries(grouped).map(([key, targets]) => {
    const evaluated = targets.map((t) => ({ ...t, met: t.check(data) }));
    const metCount = evaluated.filter((t) => t.met).length;
    const percent = targets.length > 0 ? Math.round((metCount / targets.length) * 100) : 0;

    const labels = sectionLabels[key] || { en: key, ar: key };
    return {
      sectionKey: key,
      labelEn: labels.en,
      labelAr: labels.ar,
      percent,
      targets: evaluated,
    };
  });
}

export function computeOverallProgress(sections: SectionProgress[]): number {
  if (sections.length === 0) return 0;
  const total = sections.reduce((sum, s) => sum + s.percent, 0);
  return Math.round(total / sections.length);
}
