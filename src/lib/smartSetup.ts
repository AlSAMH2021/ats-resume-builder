import type { OnboardingTargets } from "@/components/resume/OnboardingQuiz";
import type { ResumeData } from "@/types/resume";
import type { ResumeTemplate } from "@/components/resume/TemplateSelector";
import type { ResumeSection } from "@/components/resume/SectionReorder";

export interface SmartSetupResult {
  template: ResumeTemplate;
  templateReasonEn: string;
  templateReasonAr: string;
  strengthsEn: string[];
  strengthsAr: string[];
  sectionOrder: ResumeSection[];
  prefilled: ResumeData;
}

// ── Template selection ──
function pickTemplate(t: OnboardingTargets): { template: ResumeTemplate; reasonEn: string; reasonAr: string } {
  if (t.stage === "graduate") {
    return {
      template: "classic",
      reasonEn: "Classic ATS-friendly template — ideal for professional job applications",
      reasonAr: "القالب الكلاسيكي المتوافق مع ATS — مثالي للتقديم على الوظائف",
    };
  }
  // Students & freshmen → Modern
  return {
    template: "modern",
    reasonEn: "Modern template highlights skills & projects — perfect for students",
    reasonAr: "القالب العصري يبرز المهارات والمشاريع — مثالي للطلاب",
  };
}

// ── Section order ──
function buildSectionOrder(t: OnboardingTargets): ResumeSection[] {
  if (t.stage === "freshman") {
    return ["summary", "education", "skills", "projects", "certifications", "languages", "experience"];
  }
  if (t.stage === "student") {
    return ["summary", "education", "projects", "skills", "experience", "certifications", "languages"];
  }
  // graduate
  return ["summary", "education", "experience", "projects", "skills", "certifications", "languages"];
}

// ── Strengths per tier ──
function buildStrengths(t: OnboardingTargets): { en: string[]; ar: string[] } {
  const stageMap: Record<string, { en: string[]; ar: string[] }> = {
    freshman: {
      en: ["High Potential & Eagerness to Learn", "Fast Learner & Adaptable", "Extracurricular & Leadership Mindset"],
      ar: ["إمكانيات عالية وشغف بالتعلم", "سرعة تعلّم وقدرة على التكيّف", "عقلية قيادية ونشاط لا منهجي"],
    },
    student: {
      en: ["Academic Excellence & Strong GPA", "Project-based Practical Experience", "Solid Technical Foundation"],
      ar: ["تميّز أكاديمي ومعدل تراكمي قوي", "خبرة عملية من خلال المشاريع", "أساس تقني متين"],
    },
    graduate: {
      en: ["Professional Readiness & Confidence", "Specialized Knowledge in Field", "Strong Career Motivation"],
      ar: ["جاهزية مهنية وثقة عالية", "معرفة متخصصة في المجال", "دافع مهني قوي"],
    },
  };

  return stageMap[t.stage] || stageMap.student;
}

// ── Industry-specific skills ──
const industrySkills: Record<string, { en: string; ar: string }> = {
  tech: { en: "Programming, Python, JavaScript, SQL, Git, Data Structures, Web Development, Problem Solving, Cloud Basics, Agile", ar: "برمجة, Python, JavaScript, SQL, Git, هياكل بيانات, تطوير ويب, حل مشكلات, أساسيات سحابية, Agile" },
  business: { en: "Financial Analysis, Excel, Power BI, Market Research, Strategic Planning, Communication, Project Management, Budgeting, Presentation Skills", ar: "تحليل مالي, Excel, Power BI, بحث السوق, تخطيط استراتيجي, تواصل, إدارة مشاريع, إعداد ميزانيات, مهارات عرض" },
  healthcare: { en: "Patient Care, Clinical Research, Medical Terminology, First Aid, Electronic Health Records, Lab Skills, Data Analysis, Health & Safety", ar: "رعاية المرضى, بحث سريري, مصطلحات طبية, إسعافات أولية, سجلات صحية إلكترونية, مهارات مخبرية, تحليل بيانات, صحة وسلامة" },
  engineering: { en: "AutoCAD, SolidWorks, MATLAB, Technical Drawing, Project Management, Quality Control, Process Design, Safety Standards, Problem Solving", ar: "AutoCAD, SolidWorks, MATLAB, رسم تقني, إدارة مشاريع, مراقبة جودة, تصميم عمليات, معايير سلامة, حل مشكلات" },
  creative: { en: "Adobe Creative Suite, Figma, UI/UX Design, Branding, Typography, Photography, Video Editing, Design Thinking, Illustration", ar: "Adobe Creative Suite, Figma, تصميم UI/UX, هوية بصرية, خطوط, تصوير, مونتاج, تفكير تصميمي, رسم توضيحي" },
  law: { en: "Legal Research, Contract Drafting, Case Analysis, Regulatory Compliance, Negotiation, Legal Writing, Critical Thinking, Dispute Resolution", ar: "بحث قانوني, صياغة عقود, تحليل قضايا, الامتثال التنظيمي, تفاوض, كتابة قانونية, تفكير نقدي, حل نزاعات" },
  other: { en: "Communication, Problem Solving, Team Collaboration, Time Management, Critical Thinking, Adaptability, Leadership, Microsoft Office", ar: "تواصل, حل مشكلات, عمل جماعي, إدارة الوقت, تفكير نقدي, تكيّف, قيادة, Microsoft Office" },
};

// ── Summary builder ──
function buildSummary(t: OnboardingTargets): { en: string; ar: string } {
  const fieldEn = fieldLabel(t.industry, "en");
  const fieldAr = fieldLabel(t.industry, "ar");
  const goalEn = goalLabel(t.goal, "en");
  const goalAr = goalLabel(t.goal, "ar");

  if (t.stage === "freshman") {
    return {
      en: `Motivated freshman studying ${fieldEn}, eager to develop skills through ${goalEn}. Quick learner with strong interpersonal skills, active participation in extracurricular activities, and a growth mindset.`,
      ar: `طالب مستجد متحمس يدرس ${fieldAr}، يسعى لتطوير مهاراته من خلال ${goalAr}. سريع التعلم مع مهارات تواصل قوية ومشاركة فعالة في الأنشطة اللامنهجية وعقلية تطوير مستمر.`,
    };
  }
  if (t.stage === "student") {
    return {
      en: `Dedicated university student in ${fieldEn} with strong academic performance and hands-on project experience. Seeking ${goalEn} to apply technical knowledge and contribute to a professional environment. Known for analytical thinking and collaborative teamwork.`,
      ar: `طالب جامعي مجتهد في تخصص ${fieldAr} بأداء أكاديمي متميز وخبرة عملية في المشاريع. يبحث عن ${goalAr} لتطبيق معرفته التقنية والمساهمة في بيئة مهنية. يتميز بالتفكير التحليلي والعمل الجماعي.`,
    };
  }
  // graduate
  return {
    en: `Recent ${fieldEn} graduate with solid academic foundation and practical project experience. Driven to launch a professional career through ${goalEn}. Combines specialized knowledge with strong communication skills and a results-oriented mindset.`,
    ar: `خريج حديث في تخصص ${fieldAr} بأساس أكاديمي متين وخبرة عملية في المشاريع. مدفوع لبدء مسيرته المهنية من خلال ${goalAr}. يجمع بين المعرفة المتخصصة ومهارات التواصل القوية والتوجه نحو النتائج.`,
  };
}

function fieldLabel(industry: string, lang: string): string {
  const map: Record<string, { en: string; ar: string }> = {
    tech: { en: "Information Technology", ar: "تقنية المعلومات" },
    business: { en: "Business Administration", ar: "إدارة الأعمال" },
    engineering: { en: "Engineering", ar: "الهندسة" },
    healthcare: { en: "Health Sciences", ar: "العلوم الصحية" },
    creative: { en: "Design & Creative Arts", ar: "التصميم والفنون الإبداعية" },
    law: { en: "Law", ar: "القانون" },
    other: { en: "the field", ar: "المجال" },
  };
  return lang === "ar" ? (map[industry]?.ar || "المجال") : (map[industry]?.en || "the field");
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
  const skills = industrySkills[t.industry] || industrySkills.other;
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
    skills: isAr ? skills.ar : skills.en,
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
  // student & graduate
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
  const { template, reasonEn, reasonAr } = pickTemplate(targets);
  const strengths = buildStrengths(targets);
  const sectionOrder = buildSectionOrder(targets);
  const prefilled = generatePrefilled(targets);

  return {
    template,
    templateReasonEn: reasonEn,
    templateReasonAr: reasonAr,
    strengthsEn: strengths.en,
    strengthsAr: strengths.ar,
    sectionOrder,
    prefilled,
  };
}
