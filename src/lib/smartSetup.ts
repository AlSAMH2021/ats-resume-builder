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

// ── Template selection logic ──
function pickTemplate(t: OnboardingTargets): { template: ResumeTemplate; reasonEn: string; reasonAr: string } {
  if (t.goal === "first-job" || t.experienceLevel === "fresh") {
    return { template: "modern", reasonEn: "Modern template highlights skills & projects — perfect for fresh graduates", reasonAr: "القالب العصري يبرز المهارات والمشاريع — مثالي للخريجين الجدد" };
  }
  if (t.experienceLevel === "senior" || t.goal === "promotion") {
    return { template: "executive", reasonEn: "Executive template conveys authority & leadership presence", reasonAr: "القالب التنفيذي يعكس القيادة والحضور المهني" };
  }
  if (t.goal === "career-change") {
    return { template: "minimal", reasonEn: "Minimal template focuses attention on transferable skills", reasonAr: "القالب البسيط يركز الانتباه على المهارات القابلة للنقل" };
  }
  return { template: "classic", reasonEn: "Classic ATS-friendly template maximizes recruiter compatibility", reasonAr: "القالب الكلاسيكي المتوافق مع ATS يضمن أعلى توافق مع أنظمة التوظيف" };
}

// ── Section order logic ──
function buildSectionOrder(t: OnboardingTargets): ResumeSection[] {
  if (t.experienceLevel === "fresh") {
    return ["summary", "education", "projects", "skills", "certifications", "languages", "experience"];
  }
  if (t.goal === "career-change") {
    return ["summary", "skills", "projects", "experience", "education", "certifications", "languages"];
  }
  if (t.experienceLevel === "senior" || t.goal === "promotion") {
    return ["summary", "experience", "skills", "certifications", "education", "projects", "languages"];
  }
  // Default mid / junior / freelance
  return ["summary", "experience", "education", "skills", "certifications", "projects", "languages"];
}

// ── Strengths based on profile ──
function buildStrengths(t: OnboardingTargets): { en: string[]; ar: string[] } {
  const en: string[] = [];
  const ar: string[] = [];

  const expMap: Record<string, { en: string; ar: string }> = {
    fresh: { en: "Fresh perspective & eagerness to learn", ar: "منظور جديد وشغف بالتعلم" },
    junior: { en: "Growing practical experience", ar: "خبرة عملية متنامية" },
    mid: { en: "Solid professional track record", ar: "سجل مهني متين" },
    senior: { en: "Strategic leadership & deep expertise", ar: "قيادة استراتيجية وخبرة عميقة" },
  };
  if (expMap[t.experienceLevel]) {
    en.push(expMap[t.experienceLevel].en);
    ar.push(expMap[t.experienceLevel].ar);
  }

  const goalMap: Record<string, { en: string; ar: string }> = {
    "first-job": { en: "High motivation & adaptability", ar: "دافعية عالية وقدرة على التكيف" },
    "career-change": { en: "Diverse transferable skills", ar: "مهارات متنوعة قابلة للنقل" },
    promotion: { en: "Proven impact & leadership readiness", ar: "تأثير مثبت واستعداد للقيادة" },
    freelance: { en: "Self-driven & results-oriented", ar: "ذاتي الدافع وموجه للنتائج" },
  };
  if (goalMap[t.goal]) {
    en.push(goalMap[t.goal].en);
    ar.push(goalMap[t.goal].ar);
  }

  const industryMap: Record<string, { en: string; ar: string }> = {
    tech: { en: "Technical problem-solving mindset", ar: "عقلية حل المشكلات التقنية" },
    business: { en: "Analytical & strategic thinking", ar: "تفكير تحليلي واستراتيجي" },
    healthcare: { en: "Precision & patient-centered focus", ar: "دقة وتركيز على المريض" },
    engineering: { en: "Systematic & detail-oriented approach", ar: "منهجية ودقة في التفاصيل" },
    education: { en: "Communication & mentoring ability", ar: "قدرة على التواصل والتوجيه" },
    creative: { en: "Creative vision & design thinking", ar: "رؤية إبداعية وتفكير تصميمي" },
    other: { en: "Versatile & cross-functional skills", ar: "مهارات متعددة التخصصات" },
  };
  if (industryMap[t.industry]) {
    en.push(industryMap[t.industry].en);
    ar.push(industryMap[t.industry].ar);
  }

  return { en, ar };
}

// ── Industry-specific skills ──
const industrySkills: Record<string, { en: string; ar: string }> = {
  tech: { en: "JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Cloud Services, REST APIs, Agile/Scrum", ar: "JavaScript, TypeScript, React, Node.js, Python, SQL, Git, خدمات سحابية, REST APIs, Agile/Scrum" },
  business: { en: "Financial Analysis, Strategic Planning, Project Management, Excel, Power BI, CRM, Market Research, Budgeting, Negotiation, Risk Management", ar: "تحليل مالي, تخطيط استراتيجي, إدارة مشاريع, Excel, Power BI, CRM, بحث السوق, إعداد الميزانيات, تفاوض, إدارة المخاطر" },
  healthcare: { en: "Patient Care, Clinical Research, HIPAA Compliance, Electronic Health Records (EHR), Medical Terminology, Data Analysis, Quality Assurance", ar: "رعاية المرضى, بحث سريري, الامتثال الصحي, السجلات الصحية الإلكترونية, المصطلحات الطبية, تحليل البيانات, ضمان الجودة" },
  engineering: { en: "AutoCAD, SolidWorks, MATLAB, Project Management, Technical Drawing, Quality Control, Process Optimization, Safety Standards", ar: "AutoCAD, SolidWorks, MATLAB, إدارة المشاريع, الرسم التقني, مراقبة الجودة, تحسين العمليات, معايير السلامة" },
  education: { en: "Curriculum Design, Classroom Management, E-Learning, Assessment Design, Student Engagement, Educational Technology, Differentiated Instruction", ar: "تصميم المناهج, إدارة الفصول, التعليم الإلكتروني, تصميم التقييمات, تفاعل الطلاب, تقنيات التعليم, التعليم المتمايز" },
  creative: { en: "Adobe Creative Suite, Figma, UI/UX Design, Branding, Typography, Motion Graphics, Photography, Video Editing, Design Thinking", ar: "Adobe Creative Suite, Figma, تصميم UI/UX, هوية بصرية, خطوط, رسوم متحركة, تصوير, مونتاج, تفكير تصميمي" },
  other: { en: "Communication, Problem Solving, Team Collaboration, Time Management, Critical Thinking, Adaptability, Leadership, Microsoft Office", ar: "تواصل, حل المشكلات, العمل الجماعي, إدارة الوقت, التفكير النقدي, التكيف, القيادة, Microsoft Office" },
};

// ── Pre-filled content generators ──
function generatePrefilled(t: OnboardingTargets): ResumeData {
  const isAr = t.language === "ar";
  const skills = industrySkills[t.industry] || industrySkills.other;

  // Summaries per profile
  const summaries = buildSummary(t);

  // Experience bullets per profile
  const bullets = buildBullets(t);

  // Projects
  const projects = buildProjects(t);

  return {
    fullName: isAr ? "[اسمك الكامل]" : "[Your Full Name]",
    jobTitle: isAr ? "[المسمى الوظيفي المستهدف]" : "[Target Job Title]",
    location: isAr ? "[المدينة، الدولة]" : "[City, Country]",
    phone: isAr ? "[رقم الهاتف]" : "[Phone Number]",
    email: isAr ? "[البريد الإلكتروني]" : "[Email Address]",
    linkedin: "",
    website: "",
    summary: isAr ? summaries.ar : summaries.en,
    experiences: t.experienceLevel === "fresh" ? [] : [
      {
        jobTitle: isAr ? "[المسمى الوظيفي]" : "[Job Title]",
        company: isAr ? "[اسم الشركة]" : "[Company Name]",
        location: isAr ? "[الموقع]" : "[Location]",
        startDate: "2022-01",
        endDate: "",
        current: true,
        bullets: isAr ? bullets.ar : bullets.en,
      },
    ],
    education: [
      {
        degree: isAr ? "[الدرجة العلمية]" : "[Degree]",
        institution: isAr ? "[اسم الجامعة]" : "[University Name]",
        location: isAr ? "[الموقع]" : "[Location]",
        startDate: "2018",
        endDate: "2022",
        description: isAr ? "[معدل تراكمي، مرتبة الشرف، إنجازات أكاديمية]" : "[GPA, Honors, Academic achievements]",
      },
    ],
    certifications: [
      {
        name: isAr ? "[اسم الشهادة المهنية]" : "[Certification Name]",
        issuer: isAr ? "[الجهة المانحة]" : "[Issuing Organization]",
        date: "2024",
      },
    ],
    skills: isAr ? skills.ar : skills.en,
    languages: isAr
      ? [{ name: "العربية", level: "اللغة الأم" }, { name: "الإنجليزية", level: "متقدم" }]
      : [{ name: "English", level: "Native" }, { name: "Arabic", level: "Intermediate" }],
    projects: projects,
  };
}

function buildSummary(t: OnboardingTargets): { en: string; ar: string } {
  if (t.experienceLevel === "fresh") {
    if (t.goal === "first-job") {
      return {
        en: `Ambitious recent graduate with a strong foundation in ${t.industry === "tech" ? "software development and computer science" : t.industry === "business" ? "business administration and analytics" : "the field"}. Eager to apply academic knowledge and internship experience to deliver measurable results. Known for quick learning, analytical thinking, and collaborative teamwork.`,
        ar: `خريج طموح بأساس متين في ${t.industry === "tech" ? "تطوير البرمجيات وعلوم الحاسب" : t.industry === "business" ? "إدارة الأعمال والتحليلات" : "المجال"}. متحمس لتطبيق المعرفة الأكاديمية وخبرة التدريب لتحقيق نتائج قابلة للقياس. معروف بسرعة التعلم والتفكير التحليلي والعمل الجماعي.`,
      };
    }
    return {
      en: `Motivated graduate seeking to leverage academic excellence and project experience in a dynamic environment. Strong analytical and communication skills with a passion for continuous professional development.`,
      ar: `خريج محفّز يسعى لتوظيف التميز الأكاديمي وخبرة المشاريع في بيئة ديناميكية. مهارات تحليلية وتواصلية قوية مع شغف بالتطوير المهني المستمر.`,
    };
  }

  if (t.experienceLevel === "senior" || t.goal === "promotion") {
    return {
      en: `Strategic professional with 7+ years of progressive experience driving organizational growth and operational excellence. Proven leader with a track record of building high-performing teams, optimizing processes, and delivering projects that exceed business objectives. Adept at stakeholder management and data-driven decision making.`,
      ar: `محترف استراتيجي بخبرة تتجاوز 7 سنوات في قيادة النمو المؤسسي والتميز التشغيلي. قائد مثبت بسجل حافل في بناء فرق عالية الأداء وتحسين العمليات وتسليم مشاريع تتجاوز الأهداف. متمكن من إدارة أصحاب المصلحة واتخاذ القرارات المبنية على البيانات.`,
    };
  }

  if (t.goal === "career-change") {
    return {
      en: `Versatile professional transitioning into ${t.industry === "tech" ? "the technology sector" : t.industry === "business" ? "business and finance" : "a new field"} with a unique blend of transferable skills. Brings fresh perspective, proven problem-solving abilities, and a strong commitment to mastering new domains quickly.`,
      ar: `محترف متعدد المهارات ينتقل إلى ${t.industry === "tech" ? "قطاع التقنية" : t.industry === "business" ? "الأعمال والمالية" : "مجال جديد"} بمزيج فريد من المهارات القابلة للنقل. يجلب منظوراً جديداً وقدرات مثبتة في حل المشكلات والتزاماً قوياً بإتقان المجالات الجديدة بسرعة.`,
    };
  }

  // Default mid/junior/freelance
  return {
    en: `Results-oriented professional with 3+ years of hands-on experience delivering impactful solutions. Strong technical skills combined with excellent communication and a proactive approach to problem-solving. Committed to continuous improvement and driving team success.`,
    ar: `محترف موجه بالنتائج بخبرة عملية تتجاوز 3 سنوات في تقديم حلول مؤثرة. مهارات تقنية قوية مع تواصل ممتاز ونهج استباقي في حل المشكلات. ملتزم بالتحسين المستمر وقيادة نجاح الفريق.`,
  };
}

function buildBullets(t: OnboardingTargets): { en: string; ar: string } {
  if (t.experienceLevel === "senior" || t.goal === "promotion") {
    return {
      en: "Led cross-functional team of 8+ members, delivering 3 major projects ahead of schedule\nIncreased department efficiency by 35% through process automation and workflow optimization\nManaged $500K+ annual budget while reducing operational costs by 20%",
      ar: "قيادة فريق متعدد التخصصات من 8+ أعضاء وتسليم 3 مشاريع رئيسية قبل الموعد\nزيادة كفاءة القسم بنسبة 35% من خلال أتمتة العمليات وتحسين سير العمل\nإدارة ميزانية سنوية تتجاوز 500 ألف ريال مع خفض التكاليف التشغيلية بنسبة 20%",
    };
  }
  if (t.goal === "career-change") {
    return {
      en: "Applied transferable analytical skills to improve team workflows by 25%\nCollaborated with cross-departmental stakeholders to deliver key initiatives\nSelf-taught industry tools and technologies, achieving proficiency within 3 months",
      ar: "تطبيق المهارات التحليلية القابلة للنقل لتحسين سير عمل الفريق بنسبة 25%\nالتعاون مع أصحاب المصلحة عبر الأقسام لتنفيذ مبادرات رئيسية\nتعلم ذاتي لأدوات وتقنيات المجال وتحقيق الكفاءة خلال 3 أشهر",
    };
  }
  return {
    en: "Contributed to the development and launch of key product features, impacting 10K+ users\nOptimized existing processes resulting in 30% improvement in delivery timelines\nCollaborated with senior team members to implement best practices and quality standards",
    ar: "المساهمة في تطوير وإطلاق ميزات رئيسية للمنتج أثرت على أكثر من 10 آلاف مستخدم\nتحسين العمليات القائمة مما أدى إلى تحسن بنسبة 30% في مواعيد التسليم\nالتعاون مع أعضاء الفريق لتطبيق أفضل الممارسات ومعايير الجودة",
  };
}

function buildProjects(t: OnboardingTargets): ResumeData["projects"] {
  const isAr = t.language === "ar";
  if (t.experienceLevel === "fresh" || t.goal === "career-change" || t.industry === "creative") {
    return [
      {
        name: isAr ? "[اسم المشروع الأول]" : "[Project Name 1]",
        description: isAr
          ? "وصف مختصر للمشروع يوضح المشكلة التي حلّها والتقنيات المستخدمة والنتائج المحققة."
          : "Brief description of the project explaining the problem solved, technologies used, and measurable outcomes achieved.",
        url: "",
      },
      {
        name: isAr ? "[اسم المشروع الثاني]" : "[Project Name 2]",
        description: isAr
          ? "وصف مختصر يوضح دورك في المشروع والأثر الذي حققته."
          : "Brief description highlighting your role and the impact delivered.",
        url: "",
      },
    ];
  }
  return [];
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
