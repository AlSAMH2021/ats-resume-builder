// Year-based milestone definitions for the Targets page
// Progressive targets that scale with each academic year

import type { Field } from "@/lib/personaEngine";
import { FIELD_CONFIG } from "@/lib/personaEngine";

export interface YearMilestone {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  category: "skills" | "projects" | "experience" | "certifications" | "languages" | "personal";
}

export interface YearPlan {
  year: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  milestones: YearMilestone[];
}

export function generateYearPlans(
  yearTotal: number,
  industry: string,
): YearPlan[] {
  const fieldCfg = FIELD_CONFIG[industry as Field] ?? FIELD_CONFIG.other;
  const plans: YearPlan[] = [];

  for (let y = 1; y <= yearTotal; y++) {
    const milestones: YearMilestone[] = [];
    const isFirst = y === 1;
    const isLast = y === yearTotal;
    const isMid = !isFirst && !isLast;

    // ── Skills ──
    const skillCount = isFirst ? 3 : y === 2 ? 4 : y === 3 ? 5 : 6;
    milestones.push({
      id: `y${y}-skills`,
      labelAr: `${skillCount} مهارات على الأقل`,
      labelEn: `At least ${skillCount} skills`,
      icon: "⚡",
      category: "skills",
    });

    if (y >= 2) {
      const fieldSkillCount = isLast ? fieldCfg.minRequiredSkillMatches + 1 : fieldCfg.minRequiredSkillMatches;
      milestones.push({
        id: `y${y}-field-skills`,
        labelAr: `${fieldSkillCount} مهارة متخصصة في ${fieldCfg.labelAr}`,
        labelEn: `${fieldSkillCount} ${fieldCfg.labelEn}-specific skills`,
        icon: "🎯",
        category: "skills",
      });
    }

    // ── Certifications ──
    const certCount = isFirst ? 1 : y === 2 ? 1 : y === 3 ? 2 : 3;
    milestones.push({
      id: `y${y}-certs`,
      labelAr: `${certCount} شهاد${certCount > 1 ? "ات" : "ة"} مهنية`,
      labelEn: `${certCount} certification${certCount > 1 ? "s" : ""}`,
      icon: "📜",
      category: "certifications",
    });

    // ── Courses ──
    if (y >= 2) {
      const courseCount = y === 2 ? 1 : y === 3 ? 2 : 3;
      milestones.push({
        id: `y${y}-courses`,
        labelAr: `${courseCount} دور${courseCount > 1 ? "ات" : "ة"} تدريبية`,
        labelEn: `${courseCount} training course${courseCount > 1 ? "s" : ""}`,
        icon: "📚",
        category: "certifications",
      });
    }

    // ── Projects ──
    if (y >= 2) {
      const projCount = y === 2 ? 1 : y === 3 ? 1 : 2;
      milestones.push({
        id: `y${y}-projects`,
        labelAr: `${projCount} مشروع${projCount > 1 ? "ين" : ""} على الأقل`,
        labelEn: `At least ${projCount} project${projCount > 1 ? "s" : ""}`,
        icon: "🛠️",
        category: "projects",
      });
    }

    // ── Experience ──
    if (isFirst) {
      milestones.push({
        id: `y${y}-volunteer`,
        labelAr: "نشاط تطوعي أو نادي طلابي",
        labelEn: "Volunteer work or student club",
        icon: "🤝",
        category: "experience",
      });
    } else if (y === 2) {
      milestones.push({
        id: `y${y}-volunteer`,
        labelAr: "تطوع أو نشاط طلابي منظم",
        labelEn: "Organized volunteering or student activity",
        icon: "🤝",
        category: "experience",
      });
    } else if (y === 3) {
      milestones.push({
        id: `y${y}-internship`,
        labelAr: "تدريب صيفي أو خبرة عملية",
        labelEn: "Summer internship or work experience",
        icon: "💼",
        category: "experience",
      });
    } else {
      milestones.push({
        id: `y${y}-internship`,
        labelAr: "تدريب تعاوني أو خبرة مهنية",
        labelEn: "Co-op training or professional experience",
        icon: "💼",
        category: "experience",
      });
    }

    // ── Languages ──
    const engLevel = isFirst ? "مبتدئ" : y === 2 ? "متوسط" : y === 3 ? "متوسط-متقدم" : "متقدم";
    const engLevelEn = isFirst ? "Beginner" : y === 2 ? "Intermediate" : y === 3 ? "Upper-intermediate" : "Advanced";
    milestones.push({
      id: `y${y}-english`,
      labelAr: `لغة إنجليزية بمستوى ${engLevel}`,
      labelEn: `English at ${engLevelEn} level`,
      icon: "🌐",
      category: "languages",
    });

    if (isLast) {
      milestones.push({
        id: `y${y}-english-cert`,
        labelAr: "شهادة IELTS أو TOEFL",
        labelEn: "IELTS or TOEFL certificate",
        icon: "🏆",
        category: "languages",
      });
    }

    // ── Personal (later years) ──
    if (y >= 3) {
      milestones.push({
        id: `y${y}-linkedin`,
        labelAr: "حساب LinkedIn مكتمل",
        labelEn: "Complete LinkedIn profile",
        icon: "🔗",
        category: "personal",
      });
    }

    if (industry === "tech" && y >= 2) {
      milestones.push({
        id: `y${y}-github`,
        labelAr: "حساب GitHub فعّال",
        labelEn: "Active GitHub profile",
        icon: "💻",
        category: "personal",
      });
    }

    // ── Year metadata ──
    const titles: Record<number, { ar: string; en: string }> = {
      1: { ar: "التأسيس", en: "Foundation" },
      2: { ar: "البناء", en: "Building" },
      3: { ar: "التطوير", en: "Growth" },
      4: { ar: "الاحتراف", en: "Professional" },
      5: { ar: "التميّز", en: "Excellence" },
    };

    const descs: Record<number, { ar: string; en: string }> = {
      1: { ar: "بناء الأساسيات وتحديد المسار", en: "Build fundamentals and identify your path" },
      2: { ar: "تطوير المهارات والبدء بالمشاريع", en: "Develop skills and start projects" },
      3: { ar: "اكتساب الخبرة العملية", en: "Gain practical experience" },
      4: { ar: "الجاهزية لسوق العمل", en: "Ready for the job market" },
      5: { ar: "التخصص والتميز المهني", en: "Specialization and professional excellence" },
    };

    const t = titles[Math.min(y, 5)] ?? titles[5]!;
    const d = descs[Math.min(y, 5)] ?? descs[5]!;

    plans.push({
      year: y,
      titleAr: t.ar,
      titleEn: t.en,
      descriptionAr: d.ar,
      descriptionEn: d.en,
      milestones,
    });
  }

  return plans;
}
