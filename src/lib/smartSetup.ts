import type { OnboardingTargets } from "@/components/resume/OnboardingQuiz";
import type { ResumeData } from "@/types/resume";
import {
  selectTemplate,
  getSectionOrder,
  PERSONA_CONFIG,
  FIELD_CONFIG,
  GOAL_CONFIG,
  type TemplateName,
  type SectionKey,
} from "@/lib/personaEngine";

export interface SmartSetupResult {
  template: TemplateName;
  templateReasonEn: string;
  templateReasonAr: string;
  strengthsEn: string[];
  strengthsAr: string[];
  sectionOrder: SectionKey[];
  prefilled: ResumeData;
}

// ── Template selection ──
function pickTemplate(t: OnboardingTargets) {
  const stage = t.stage as "freshman" | "student" | "graduate";
  const goal = t.goal as "volunteering" | "internship" | "part-time" | "full-time";
  return selectTemplate(stage, goal);
}

// ── Section order ──
function buildSectionOrder(t: OnboardingTargets): SectionKey[] {
  const stage = t.stage as "freshman" | "student" | "graduate";
  const goal = t.goal as "volunteering" | "internship" | "part-time" | "full-time";
  return getSectionOrder(stage, goal);
}

// ── Summary builder ──
function buildSummary(t: OnboardingTargets): { en: string; ar: string } {
  const fieldEn = fieldLabel(t.industry, "en");
  const fieldAr = fieldLabel(t.industry, "ar");
  const goalEn = goalLabel(t.goal, "en");
  const goalAr = goalLabel(t.goal, "ar");
  const goalConfig = GOAL_CONFIG[t.goal as keyof typeof GOAL_CONFIG];
  const toneEn = goalConfig?.toneEn ?? "";
  const toneAr = goalConfig?.toneAr ?? "";

  if (t.stage === "freshman") {
    return {
      en: `Motivated freshman studying ${fieldEn}, eager to develop skills through ${goalEn}. Quick learner with strong interpersonal skills, active participation in extracurricular activities, and a growth mindset. (${toneEn})`,
      ar: `طالب مستجد متحمس يدرس ${fieldAr}، يسعى لتطوير مهاراته من خلال ${goalAr}. سريع التعلم مع مهارات تواصل قوية ومشاركة فعالة في الأنشطة اللامنهجية وعقلية تطوير مستمر. (${toneAr})`,
    };
  }
  if (t.stage === "student") {
    return {
      en: `Dedicated university student in ${fieldEn} with strong academic performance and hands-on project experience. Seeking ${goalEn} to apply technical knowledge and contribute to a professional environment. Known for analytical thinking and collaborative teamwork. (${toneEn})`,
      ar: `طالب جامعي مجتهد في تخصص ${fieldAr} بأداء أكاديمي متميز وخبرة عملية في المشاريع. يبحث عن ${goalAr} لتطبيق معرفته التقنية والمساهمة في بيئة مهنية. يتميز بالتفكير التحليلي والعمل الجماعي. (${toneAr})`,
    };
  }
  // graduate
  return {
    en: `Recent ${fieldEn} graduate with solid academic foundation and practical project experience. Driven to launch a professional career through ${goalEn}. Combines specialized knowledge with strong communication skills and a results-oriented mindset. (${toneEn})`,
    ar: `خريج حديث في تخصص ${fieldAr} بأساس أكاديمي متين وخبرة عملية في المشاريع. مدفوع لبدء مسيرته المهنية من خلال ${goalAr}. يجمع بين المعرفة المتخصصة ومهارات التواصل القوية والتوجه نحو النتائج. (${toneAr})`,
  };
}

function fieldLabel(industry: string, lang: string): string {
  const field = FIELD_CONFIG[industry as keyof typeof FIELD_CONFIG];
  if (!field) return lang === "ar" ? "المجال" : "the field";
  return lang === "ar" ? field.labelAr : field.labelEn;
}

function goalLabel(goal: string, lang: string): string {
  const map: Record<string, { en: string; ar: string }> = {
    volunteering: { en: "volunteering and club activities", ar: "التطوع والأنشطة الطلابية" },
    internship: { en: "a co-op/internship opportunity", ar: "فرصة تدريب تعاوني" },
    "part-time": { en: "a part-time role", ar: "عمل جزئي" },
    "full-time": { en: "a full-time position", ar: "وظيفة بدوام كامل" },
  };
  return lang === "ar" ? (map[goal]?.ar || "فرصة مهنية") : (map[goal]?.en || "a professional opportunity");
}

// ── Prefilled data ──
function generatePrefilled(t: OnboardingTargets): ResumeData {
  const isAr = t.language === "ar";
  const field = FIELD_CONFIG[t.industry as keyof typeof FIELD_CONFIG] ?? FIELD_CONFIG.other;
  const skills = isAr ? field.skillsAr.join(", ") : field.skillsEn.join(", ");
  const summary = buildSummary(t);

  return {
    fullName: isAr ? "[اسمك الكامل]" : "[Your Full Name]",
    jobTitle: isAr ? "[التخصص أو المسمى المستهدف]" : "[Target Title or Major]",
    location: isAr ? "[المدينة، الدولة]" : "[City, Country]",
    phone: isAr ? "[رقم الهاتف]" : "[Phone Number]",
    email: isAr ? "[البريد الإلكتروني]" : "[Email Address]",
    linkedin: "",
    website: "",
    summary: isAr ? summary.ar : summary.en,
    experiences: t.stage === "graduate" ? [
      {
        jobTitle: isAr ? "[المسمى الوظيفي / التدريب]" : "[Job Title / Internship]",
        company: isAr ? "[اسم الجهة]" : "[Organization Name]",
        location: isAr ? "[الموقع]" : "[Location]",
        startDate: "2024-01",
        endDate: "",
        current: false,
        bullets: isAr
          ? "وصف مختصر لمهامك وإنجازاتك في هذا الدور\nاذكر نتائج قابلة للقياس إن أمكن"
          : "Brief description of your tasks and achievements in this role\nMention measurable results where possible",
      },
    ] : [],
    education: [
      {
        degree: isAr
          ? (t.stage === "graduate" ? "[الدرجة العلمية — مثلاً: بكالوريوس]" : "[التخصص الدراسي الحالي]")
          : (t.stage === "graduate" ? "[Degree — e.g. Bachelor's]" : "[Current Major]"),
        institution: isAr ? "[اسم الجامعة]" : "[University Name]",
        location: isAr ? "[المدينة]" : "[City]",
        startDate: "2020",
        endDate: t.stage === "graduate" ? "2024" : "",
        description: isAr
          ? "[المعدل التراكمي، مرتبة الشرف، إنجازات أكاديمية]"
          : "[GPA, Honors, Academic achievements]",
      },
    ],
    certifications: [
      {
        name: isAr ? "[اسم الشهادة أو الدورة]" : "[Certificate or Course Name]",
        issuer: isAr ? "[الجهة المانحة]" : "[Issuing Organization]",
        date: "2024",
      },
    ],
    skills,
    languages: isAr
      ? [{ name: "العربية", level: "اللغة الأم" }, { name: "الإنجليزية", level: "متوسط" }]
      : [{ name: "English", level: "Native" }, { name: "Arabic", level: "Intermediate" }],
    projects: buildProjects(t),
  };
}

function buildProjects(t: OnboardingTargets): ResumeData["projects"] {
  const isAr = t.language === "ar";
  if (t.stage === "freshman") {
    return [
      {
        name: isAr ? "[مشروع مدرسي أو نشاط تطوعي]" : "[School Project or Volunteer Activity]",
        description: isAr
          ? "وصف مختصر يوضح دورك والمهارات التي اكتسبتها من هذا المشروع أو النشاط."
          : "Brief description of your role and the skills you gained from this project or activity.",
        url: "",
      },
    ];
  }
  return [
    {
      name: isAr ? "[اسم المشروع الأكاديمي أو التطبيقي]" : "[Academic or Applied Project Name]",
      description: isAr
        ? "وصف مختصر يوضح المشكلة التي حلّها المشروع والتقنيات المستخدمة والنتائج المحققة."
        : "Brief description explaining the problem solved, technologies used, and results achieved.",
      url: "",
    },
    {
      name: isAr ? "[مشروع تخرج أو مشروع شخصي]" : "[Graduation or Personal Project]",
      description: isAr
        ? "وصف مختصر يوضح دورك في المشروع والأثر الذي حققته."
        : "Brief description highlighting your role and the impact delivered.",
      url: "",
    },
  ];
}

// ── Main export ──
export function generateSmartSetup(targets: OnboardingTargets): SmartSetupResult {
  const stage = targets.stage as "freshman" | "student" | "graduate";
  const { template, reasonEn, reasonAr } = pickTemplate(targets);
  const persona = PERSONA_CONFIG[stage];
  const sectionOrder = buildSectionOrder(targets);
  const prefilled = generatePrefilled(targets);

  return {
    template,
    templateReasonEn: reasonEn,
    templateReasonAr: reasonAr,
    strengthsEn: [...persona.strengthsEn],
    strengthsAr: [...persona.strengthsAr],
    sectionOrder,
    prefilled,
  };
}
