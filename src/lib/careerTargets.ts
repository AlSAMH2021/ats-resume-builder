import type { ResumeData } from "@/types/resume";
import {
  PERSONA_CONFIG,
  FIELD_CONFIG,
  GOAL_CONFIG,
  getEffectiveWeights,
  type Stage,
  type Goal,
  type Field,
  type SectionKey,
} from "@/lib/personaEngine";

export interface CareerTarget {
  sectionKey: string;
  requirementEn: string;
  requirementAr: string;
  tipEn: string;
  tipAr: string;
  weight: 1 | 2 | 3 | 4 | 5;
  category: "required" | "recommended" | "bonus";
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

// ── Helpers ──

function getSkillsList(data: ResumeData): string[] {
  return (data.skills || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function hasBulletKeyword(data: ResumeData, keywords: string[]): boolean {
  const allText = data.experiences
    .map((e) => `${e.jobTitle} ${e.company} ${e.bullets}`)
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

function isPlaceholder(text: string): boolean {
  return /^\[.*\]$/.test(text.trim()) || text.trim().length === 0;
}

// ── Target definitions ──

function getTargets(persona: Persona): CareerTarget[] {
  const { stage, industry, goal } = persona;
  const targets: CareerTarget[] = [];
  const personaCfg = PERSONA_CONFIG[stage as Stage] ?? PERSONA_CONFIG.student;
  const fieldCfg = FIELD_CONFIG[industry as Field] ?? FIELD_CONFIG.other;
  const goalCfg = GOAL_CONFIG[goal as Goal] ?? GOAL_CONFIG["part-time"];

  // ════════════════════════════════════════
  // UNIVERSAL TARGETS
  // ════════════════════════════════════════

  // Personal — contact info
  targets.push({
    sectionKey: "personal",
    requirementEn: "Complete contact info (name + email + phone)",
    requirementAr: "أكمل معلومات الاتصال (الاسم + الإيميل + الهاتف)",
    tipEn: "Recruiters skip resumes without basic contact info. Include name, email, and phone at minimum.",
    tipAr: "المسؤولون يتجاوزون السير بدون معلومات اتصال. أضف الاسم والبريد والهاتف كحد أدنى.",
    weight: 5,
    category: "required",
    check: (d) =>
      d.fullName.length > 0 &&
      !isPlaceholder(d.fullName) &&
      d.email.length > 0 &&
      !isPlaceholder(d.email) &&
      d.phone.length > 0 &&
      !isPlaceholder(d.phone),
  });

  // Personal — location
  targets.push({
    sectionKey: "personal",
    requirementEn: "Add your location",
    requirementAr: "أضف موقعك (المدينة)",
    tipEn: "Location helps recruiters assess your availability for the role.",
    tipAr: "الموقع يساعد المسؤولين في تقييم ملاءمتك الجغرافية.",
    weight: 3,
    category: "required",
    check: (d) => d.location.length > 0 && !isPlaceholder(d.location),
  });

  // Summary — minimum length
  targets.push({
    sectionKey: "summary",
    requirementEn: "Write a professional summary (40+ characters)",
    requirementAr: "اكتب ملخصاً مهنياً (40 حرف على الأقل)",
    tipEn: "A strong summary increases recruiter interest by 40%. Mention your goal and top skills.",
    tipAr: "الملخص القوي يزيد اهتمام المسؤولين بنسبة 40%. اذكر هدفك وأبرز مهاراتك.",
    weight: 5,
    category: "required",
    check: (d) => {
      const s = (d.summary || "").trim();
      return s.length >= 40 && !isPlaceholder(s);
    },
  });

  // Summary — mentions career goal keyword
  const goalKeywords: Record<string, string[]> = {
    volunteering: ["volunteer", "تطوع", "community", "مجتمع", "club", "نادي"],
    internship: ["internship", "تدريب", "co-op", "تعاوني", "training"],
    "part-time": ["part-time", "جزئي", "flexible", "مرن"],
    "full-time": ["career", "مهنة", "professional", "مهني", "position", "وظيفة"],
  };
  targets.push({
    sectionKey: "summary",
    requirementEn: "Summary mentions your career goal keyword",
    requirementAr: "الملخص يذكر كلمة مفتاحية لهدفك المهني",
    tipEn: `Tailor your summary to your goal. Tone: ${goalCfg.toneEn}`,
    tipAr: `خصص ملخصك لهدفك. النبرة: ${goalCfg.toneAr}`,
    weight: 3,
    category: "recommended",
    check: (d) => {
      const text = (d.summary || "").toLowerCase();
      const kws = goalKeywords[goal] ?? [];
      return kws.some((k) => text.includes(k));
    },
  });

  // Education — at least 1 entry
  targets.push({
    sectionKey: "education",
    requirementEn: "Add at least 1 education entry",
    requirementAr: "أضف مؤهل تعليمي واحد على الأقل",
    tipEn: "Education is crucial for students. Include your GPA if above 3.0.",
    tipAr: "التعليم أساسي للطلاب. أضف معدلك التراكمي إذا كان أعلى من 3.0.",
    weight: 5,
    category: "required",
    check: (d) =>
      d.education.length >= 1 &&
      d.education[0].institution.length > 0 &&
      !isPlaceholder(d.education[0].institution),
  });

  // Languages — at least 1
  targets.push({
    sectionKey: "languages",
    requirementEn: "Add at least 1 language with proficiency level",
    requirementAr: "أضف لغة واحدة مع مستوى الإتقان",
    tipEn: "Bilingual candidates stand out. Include Arabic and English with IELTS/TOEFL scores if available.",
    tipAr: "المرشحون ثنائيو اللغة يتميزون. أضف العربية والإنجليزية مع درجات IELTS/TOEFL إن وجدت.",
    weight: 2,
    category: "recommended",
    check: (d) => d.languages.length >= 1 && d.languages[0].name.length > 0 && !isPlaceholder(d.languages[0].name),
  });

  // Languages — both Arabic + English
  targets.push({
    sectionKey: "languages",
    requirementEn: "List both Arabic and English",
    requirementAr: "أضف العربية والإنجليزية معاً",
    tipEn: "Saudi employers value bilingual professionals. List both languages.",
    tipAr: "أصحاب العمل السعوديون يقدرون ثنائيي اللغة. أضف اللغتين.",
    weight: 2,
    category: "bonus",
    check: (d) => {
      const names = d.languages.map((l) => l.name.toLowerCase());
      const hasAr = names.some((n) => n.includes("عربي") || n.includes("arabic"));
      const hasEn = names.some((n) => n.includes("إنجليزي") || n.includes("english") || n.includes("انجليزي"));
      return hasAr && hasEn;
    },
  });

  // ════════════════════════════════════════
  // PERSONA-SPECIFIC TARGETS
  // ════════════════════════════════════════

  if (stage === "freshman") {
    // 4+ soft skills
    targets.push({
      sectionKey: "skills",
      requirementEn: "List at least 4 soft skills",
      requirementAr: "أضف 4 مهارات شخصية على الأقل",
      tipEn: "As a freshman, soft skills like communication and teamwork are your strongest assets.",
      tipAr: "كمستجد، المهارات الشخصية كالتواصل والعمل الجماعي هي أقوى نقاط قوتك.",
      weight: 4,
      category: "required",
      check: (d) => getSkillsList(d).length >= 4,
    });

    // 1+ volunteering/activity
    targets.push({
      sectionKey: "experience",
      requirementEn: "Add volunteer work or club activities",
      requirementAr: "أضف عمل تطوعي أو أنشطة أندية",
      tipEn: "Since you don't have formal experience yet, listing 2 volunteer activities will increase your chances by 40%.",
      tipAr: "بما أنك لا تملك خبرة رسمية بعد، إضافة نشاطين تطوعيين سيزيد فرصك بنسبة 40%.",
      weight: 4,
      category: "required",
      check: (d) =>
        d.experiences.length >= 1 &&
        hasBulletKeyword(d, ["volunteer", "تطوع", "club", "نادي", "community", "مجتمع"]),
    });

    // Recommend 1 project
    targets.push({
      sectionKey: "projects",
      requirementEn: "Add at least 1 project (school or personal)",
      requirementAr: "أضف مشروع واحد على الأقل (مدرسي أو شخصي)",
      tipEn: "Any project shows initiative. Add a class project or personal hobby project.",
      tipAr: "أي مشروع يُظهر المبادرة. أضف مشروع دراسي أو شخصي.",
      weight: 3,
      category: "recommended",
      check: (d) => d.projects.length >= 1 && d.projects[0].name.length > 0 && !isPlaceholder(d.projects[0].name),
    });
  }

  if (stage === "student") {
    // minSkills from config
    targets.push({
      sectionKey: "skills",
      requirementEn: `List at least ${personaCfg.minSkills} skills`,
      requirementAr: `أضف ${personaCfg.minSkills} مهارات على الأقل`,
      tipEn: "Include a mix of technical and soft skills relevant to your field.",
      tipAr: "أضف مزيجاً من المهارات التقنية والشخصية المتعلقة بتخصصك.",
      weight: 4,
      category: "required",
      check: (d) => getSkillsList(d).length >= personaCfg.minSkills,
    });

    // 1+ project (higher weight for tech)
    targets.push({
      sectionKey: "projects",
      requirementEn: "Add at least 1 project",
      requirementAr: "أضف مشروع واحد على الأقل",
      tipEn: industry === "tech"
        ? "Most IT recruiters look for at least one GitHub project at your level. Click here to add yours."
        : "Academic or personal projects show initiative. Add any class project or personal work.",
      tipAr: industry === "tech"
        ? "أغلب مسؤولي التوظيف في التقنية يبحثون عن مشروع واحد على الأقل. أضف مشروعك الآن."
        : "المشاريع الأكاديمية أو الشخصية تُظهر المبادرة. أضف أي مشروع دراسي أو شخصي.",
      weight: industry === "tech" ? 5 : 4,
      category: "required",
      check: (d) => d.projects.length >= 1 && d.projects[0].name.length > 0 && !isPlaceholder(d.projects[0].name),
    });

    // Recommend GPA
    targets.push({
      sectionKey: "education",
      requirementEn: "Include degree details or GPA",
      requirementAr: "أضف تفاصيل الدرجة أو المعدل التراكمي",
      tipEn: "Adding GPA or honors distinguishes you from other candidates.",
      tipAr: "إضافة المعدل أو مرتبة الشرف يميزك عن المرشحين الآخرين.",
      weight: 3,
      category: "recommended",
      check: (d) => d.education.some((e) => e.description.length > 5 && !isPlaceholder(e.description)),
    });

    // Recommend certification
    targets.push({
      sectionKey: "certifications",
      requirementEn: "Add at least 1 certification",
      requirementAr: "أضف شهادة واحدة على الأقل",
      tipEn: "Online certifications from Coursera, Google, or similar platforms show continuous learning.",
      tipAr: "الشهادات من Coursera أو Google تُظهر التعلم المستمر.",
      weight: 3,
      category: "recommended",
      check: (d) => d.certifications.length >= 1 && d.certifications[0].name.length > 0 && !isPlaceholder(d.certifications[0].name),
    });
  }

  if (stage === "graduate") {
    // 1+ experience
    targets.push({
      sectionKey: "experience",
      requirementEn: "Add at least 1 work experience or internship",
      requirementAr: "أضف خبرة عملية أو تدريب واحد على الأقل",
      tipEn: "Even short internships count. Include co-op training or part-time roles.",
      tipAr: "حتى التدريبات القصيرة مهمة. أضف التدريب التعاوني أو العمل الجزئي.",
      weight: 5,
      category: "required",
      check: (d) =>
        d.experiences.length >= 1 &&
        d.experiences[0].company.length > 0 &&
        !isPlaceholder(d.experiences[0].company),
    });

    // 6+ skills
    targets.push({
      sectionKey: "skills",
      requirementEn: `List at least ${personaCfg.minSkills} skills`,
      requirementAr: `أضف ${personaCfg.minSkills} مهارات على الأقل`,
      tipEn: "Include a strong mix of technical and soft skills. ATS systems scan for specific keywords.",
      tipAr: "أضف مزيجاً قوياً من المهارات التقنية والشخصية. أنظمة ATS تفحص كلمات مفتاحية محددة.",
      weight: 4,
      category: "required",
      check: (d) => getSkillsList(d).length >= personaCfg.minSkills,
    });

    // Graduation project
    targets.push({
      sectionKey: "projects",
      requirementEn: "Add your graduation project",
      requirementAr: "أضف مشروع التخرج",
      tipEn: "Your graduation project demonstrates depth of knowledge. Make sure to include it.",
      tipAr: "مشروع التخرج يُظهر عمق معرفتك. تأكد من إضافته.",
      weight: 3,
      category: "required",
      check: (d) => d.projects.length >= 1 && d.projects[0].name.length > 0 && !isPlaceholder(d.projects[0].name),
    });

    // LinkedIn
    targets.push({
      sectionKey: "personal",
      requirementEn: "Add your LinkedIn profile URL",
      requirementAr: "أضف رابط حسابك في LinkedIn",
      tipEn: "LinkedIn is essential for professional networking. 87% of recruiters use it.",
      tipAr: "LinkedIn أساسي للشبكات المهنية. 87% من المسؤولين يستخدمونه.",
      weight: 3,
      category: "required",
      check: (d) => (d.linkedin || "").length > 5,
    });

    // Summary 60+ chars, no placeholders
    targets.push({
      sectionKey: "summary",
      requirementEn: "Write a detailed summary (60+ characters, no placeholders)",
      requirementAr: "اكتب ملخصاً مفصلاً (60 حرف+ بدون نص افتراضي)",
      tipEn: "Replace all placeholder text with real content. A polished summary sets the tone.",
      tipAr: "استبدل النصوص الافتراضية بمحتوى حقيقي. الملخص المصقول يحدد الانطباع الأول.",
      weight: 3,
      category: "required",
      check: (d) => {
        const s = (d.summary || "").trim();
        return s.length >= 60 && !isPlaceholder(s) && !s.includes("[");
      },
    });
  }

  // ════════════════════════════════════════
  // FIELD-SPECIFIC TARGETS
  // ════════════════════════════════════════

  // Required skill keywords from FIELD_CONFIG
  if (fieldCfg.minRequiredSkillMatches > 0) {
    targets.push({
      sectionKey: "skills",
      requirementEn: `Include ${fieldCfg.minRequiredSkillMatches}+ ${fieldCfg.labelEn}-specific skills`,
      requirementAr: `أضف ${fieldCfg.minRequiredSkillMatches}+ مهارة متخصصة في ${fieldCfg.labelAr}`,
      tipEn: "ATS systems scan for industry-specific keywords. Add relevant tools and technologies.",
      tipAr: "أنظمة ATS تفحص الكلمات المفتاحية المتخصصة. أضف الأدوات والتقنيات المناسبة.",
      weight: 5,
      category: "required",
      check: (d) => {
        const skills = getSkillsList(d);
        const matches = fieldCfg.requiredSkillKeywords.filter((k) =>
          skills.some((s) => s.includes(k.toLowerCase()))
        );
        return matches.length >= fieldCfg.minRequiredSkillMatches;
      },
    });
  }

  // Tech + student/graduate → GitHub URL in projects
  if (industry === "tech" && (stage === "student" || stage === "graduate")) {
    targets.push({
      sectionKey: "projects",
      requirementEn: "Include a GitHub URL in at least one project",
      requirementAr: "أضف رابط GitHub في مشروع واحد على الأقل",
      tipEn: "GitHub portfolios are essential for tech roles. Link your best project's repository.",
      tipAr: "معرض GitHub أساسي لوظائف التقنية. أضف رابط مستودع أفضل مشاريعك.",
      weight: 4,
      category: "required",
      check: (d) => d.projects.some((p) => (p.url || "").toLowerCase().includes("github")),
    });
  }

  // Law + student → moot court or legal training
  if (industry === "law" && stage === "student") {
    targets.push({
      sectionKey: "experience",
      requirementEn: "Include Moot Court or Legal Training",
      requirementAr: "أضف المحكمة الصورية أو التدريب القانوني",
      tipEn: "Law firms highly value moot court and summer training experiences.",
      tipAr: "مكاتب المحاماة تقدر كثيراً تجارب المحكمة الصورية والتدريب الصيفي.",
      weight: 5,
      category: "required",
      check: (d) =>
        hasBulletKeyword(d, [
          "summer training", "تدريب صيفي", "moot court", "محكمة صورية",
          "legal clinic", "عيادة قانونية", "legal training", "تدريب قانوني",
        ]),
    });
  }

  // Healthcare + student → BLS/First Aid
  if (industry === "healthcare" && stage === "student") {
    targets.push({
      sectionKey: "certifications",
      requirementEn: "Add BLS or First Aid certification",
      requirementAr: "أضف شهادة BLS أو إسعافات أولية",
      tipEn: "BLS/First Aid certification is expected for healthcare students. Get certified and list it.",
      tipAr: "شهادة BLS/الإسعافات الأولية متوقعة لطلاب الصحة. احصل عليها وأضفها.",
      weight: 5,
      category: "required",
      check: (d) => {
        const allCerts = d.certifications.map((c) => `${c.name} ${c.issuer}`.toLowerCase()).join(" ");
        return ["bls", "first aid", "إسعاف", "cpr"].some((k) => allCerts.includes(k));
      },
    });
  }

  // Creative → portfolio URL
  if (industry === "creative") {
    targets.push({
      sectionKey: "personal",
      requirementEn: "Add a portfolio website URL",
      requirementAr: "أضف رابط معرض أعمالك",
      tipEn: "Creative roles require a portfolio. Add your Behance, Dribbble, or personal site.",
      tipAr: "الأدوار الإبداعية تتطلب معرض أعمال. أضف Behance أو Dribbble أو موقعك الشخصي.",
      weight: 4,
      category: "required",
      check: (d) => (d.website || "").length > 5,
    });
  }

  return targets;
}

// ── Section labels ──

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

// ── Compute weighted progress per section ──

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

    // Weighted scoring
    const totalWeight = targets.reduce((sum, t) => sum + t.weight, 0);
    const metWeight = evaluated.filter((t) => t.met).reduce((sum, t) => sum + t.weight, 0);
    let percent = totalWeight > 0 ? Math.round((metWeight / totalWeight) * 100) : 0;

    // If any required target is unmet, cap at 69
    const hasUnmetRequired = evaluated.some((t) => !t.met && t.category === "required");
    if (hasUnmetRequired && percent > 69) {
      percent = 69;
    }

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

// ── Compute weighted overall progress ──

export function computeWeightedOverall(
  sections: SectionProgress[],
  persona: Persona
): number {
  if (sections.length === 0) return 0;

  const stage = persona.stage as Stage;
  const goal = persona.goal as Goal;
  const weights = getEffectiveWeights(stage, goal);

  let weightedSum = 0;
  let totalWeight = 0;

  for (const sec of sections) {
    const w = weights[sec.sectionKey as SectionKey] ?? 5;
    weightedSum += sec.percent * w;
    totalWeight += w;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

// Legacy compat
export function computeOverallProgress(sections: SectionProgress[]): number {
  if (sections.length === 0) return 0;
  const total = sections.reduce((sum, s) => sum + s.percent, 0);
  return Math.round(total / sections.length);
}

// ── Next priority section ──

export function getNextPrioritySection(
  sections: SectionProgress[],
  stage: string,
  goal: string
): SectionProgress | null {
  if (sections.length === 0) return null;

  const weights = getEffectiveWeights(stage as Stage, goal as Goal);

  // Sections with unmet required targets always come first
  const withUnmetRequired = sections.filter((s) =>
    s.targets.some((t) => !t.met && t.category === "required")
  );

  if (withUnmetRequired.length > 0) {
    // Sort by highest marginal gain: sectionWeight × (100 - percent) / 100
    return withUnmetRequired.sort((a, b) => {
      const wA = weights[a.sectionKey as SectionKey] ?? 5;
      const wB = weights[b.sectionKey as SectionKey] ?? 5;
      const gainA = wA * (100 - a.percent);
      const gainB = wB * (100 - b.percent);
      return gainB - gainA;
    })[0];
  }

  // Otherwise, sort all incomplete sections by marginal gain
  const incomplete = sections.filter((s) => s.percent < 100);
  if (incomplete.length === 0) return null;

  return incomplete.sort((a, b) => {
    const wA = weights[a.sectionKey as SectionKey] ?? 5;
    const wB = weights[b.sectionKey as SectionKey] ?? 5;
    const gainA = wA * (100 - a.percent);
    const gainB = wB * (100 - b.percent);
    return gainB - gainA;
  })[0];
}
