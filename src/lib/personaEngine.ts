// ─────────────────────────────────────────────────────────────
// personaEngine.ts — Standalone persona configuration engine
// ZERO imports from existing project files
// ─────────────────────────────────────────────────────────────

// ── Types ──

export type Stage = "freshman" | "student" | "graduate";
export type Field = "tech" | "business" | "engineering" | "healthcare" | "creative" | "law" | "education" | "other";
export type Goal = "volunteering" | "internship" | "part-time" | "full-time";
export type TemplateName = "starter" | "academic" | "professional";
export type SectionKey = "personal" | "summary" | "education" | "skills" | "projects" | "experience" | "certifications" | "languages";
export type ATSPriority = "low" | "medium" | "high" | "critical";

export interface SectionWeights {
  personal: number;
  summary: number;
  education: number;
  skills: number;
  projects: number;
  experience: number;
  certifications: number;
  languages: number;
}

export interface PersonaDefinition {
  id: Stage;
  labelEn: string;
  labelAr: string;
  allowedGoals: Goal[];
  defaultTemplate: TemplateName;
  sectionWeights: SectionWeights;
  strengthsEn: [string, string, string];
  strengthsAr: [string, string, string];
  summaryToneEn: string;
  summaryToneAr: string;
  minSkills: number;
  experienceRequired: boolean;
  projectsRequired: boolean;
}

export interface FieldDefinition {
  id: Field;
  labelEn: string;
  labelAr: string;
  skillsEn: string[];
  skillsAr: string[];
  atsKeywords: string[];
  certSuggestionsEn: string[];
  certSuggestionsAr: string[];
  requiredSkillKeywords: string[];
  minRequiredSkillMatches: number;
  projectExpectation: {
    freshmanEn: string;
    freshmanAr: string;
    studentEn: string;
    studentAr: string;
    graduateEn: string;
    graduateAr: string;
  };
}

export interface GoalDefinition {
  id: Goal;
  labelEn: string;
  labelAr: string;
  atsPriority: ATSPriority;
  summaryLengthMin: number;
  summaryLengthIdeal: number;
  experienceExpected: boolean;
  toneEn: string;
  toneAr: string;
  sectionWeightModifiers: Partial<SectionWeights>;
}

export interface TemplateDecision {
  template: TemplateName;
  reasonEn: string;
  reasonAr: string;
}

export interface EdgeCaseRule {
  condition: { stage: Stage; goal: Goal };
  action: "block" | "warn";
  messageEn: string;
  messageAr: string;
}

// ── 1. PERSONA_CONFIG ──

export const PERSONA_CONFIG: Record<Stage, PersonaDefinition> = {
  freshman: {
    id: "freshman",
    labelEn: "Freshman",
    labelAr: "مستجد",
    allowedGoals: ["volunteering", "part-time"],
    defaultTemplate: "starter",
    sectionWeights: {
      personal: 10,
      summary: 10,
      education: 25,
      skills: 25,
      projects: 10,
      experience: 5,
      certifications: 10,
      languages: 5,
    },
    strengthsEn: [
      "High Potential & Eagerness to Learn",
      "Fast Learner & Adaptable",
      "Extracurricular & Leadership Mindset",
    ],
    strengthsAr: [
      "إمكانيات عالية وشغف بالتعلم",
      "سرعة تعلّم وقدرة على التكيّف",
      "عقلية قيادية ونشاط لا منهجي",
    ],
    summaryToneEn: "Enthusiastic and eager; highlight potential and willingness to learn",
    summaryToneAr: "متحمس وشغوف؛ أبرز الإمكانيات والرغبة في التعلم",
    minSkills: 3,
    experienceRequired: false,
    projectsRequired: false,
  },

  student: {
    id: "student",
    labelEn: "University Student",
    labelAr: "طالب جامعي",
    allowedGoals: ["volunteering", "internship", "part-time", "full-time"],
    defaultTemplate: "academic",
    sectionWeights: {
      personal: 10,
      summary: 10,
      education: 20,
      skills: 20,
      projects: 15,
      experience: 10,
      certifications: 10,
      languages: 5,
    },
    strengthsEn: [
      "Academic Excellence & Strong GPA",
      "Project-based Practical Experience",
      "Solid Technical Foundation",
    ],
    strengthsAr: [
      "تميّز أكاديمي ومعدل تراكمي قوي",
      "خبرة عملية من خلال المشاريع",
      "أساس تقني متين",
    ],
    summaryToneEn: "Confident and academic; emphasize projects and technical skills",
    summaryToneAr: "واثق وأكاديمي؛ أبرز المشاريع والمهارات التقنية",
    minSkills: 5,
    experienceRequired: false,
    projectsRequired: true,
  },

  graduate: {
    id: "graduate",
    labelEn: "Fresh Graduate",
    labelAr: "خريج حديث",
    allowedGoals: ["volunteering", "internship", "part-time", "full-time"],
    defaultTemplate: "professional",
    sectionWeights: {
      personal: 10,
      summary: 15,
      education: 10,
      skills: 15,
      projects: 10,
      experience: 25,
      certifications: 10,
      languages: 5,
    },
    strengthsEn: [
      "Professional Readiness & Confidence",
      "Specialized Knowledge in Field",
      "Strong Career Motivation",
    ],
    strengthsAr: [
      "جاهزية مهنية وثقة عالية",
      "معرفة متخصصة في المجال",
      "دافع مهني قوي",
    ],
    summaryToneEn: "Professional and results-oriented; highlight specialization and career drive",
    summaryToneAr: "مهني وموجه نحو النتائج؛ أبرز التخصص والدافع المهني",
    minSkills: 6,
    experienceRequired: true,
    projectsRequired: true,
  },
};

// ── 2. FIELD_CONFIG ──

export const FIELD_CONFIG: Record<Field, FieldDefinition> = {
  tech: {
    id: "tech",
    labelEn: "Information Technology",
    labelAr: "تقنية المعلومات",
    skillsEn: ["Programming", "Python", "JavaScript", "TypeScript", "SQL", "Git", "Data Structures", "Web Development", "Problem Solving", "Cloud Basics", "Agile/Scrum", "REST APIs"],
    skillsAr: ["برمجة", "Python", "JavaScript", "TypeScript", "SQL", "Git", "هياكل بيانات", "تطوير ويب", "حل مشكلات", "أساسيات سحابية", "Agile/Scrum", "REST APIs"],
    atsKeywords: ["programming", "python", "javascript", "typescript", "sql", "git", "data structures", "web development", "cloud", "agile", "scrum", "rest api", "software", "algorithm", "database"],
    certSuggestionsEn: ["AWS Cloud Practitioner", "Google IT Support Professional", "CompTIA A+", "Meta Front-End Developer", "IBM Data Science"],
    certSuggestionsAr: ["AWS Cloud Practitioner", "شهادة دعم تقنية المعلومات من Google", "CompTIA A+", "مطور واجهات أمامية من Meta", "علوم البيانات من IBM"],
    requiredSkillKeywords: ["programming", "python", "javascript", "sql", "git", "web development"],
    minRequiredSkillMatches: 2,
    projectExpectation: {
      freshmanEn: "A simple personal project or class assignment (e.g., a calculator app or personal website)",
      freshmanAr: "مشروع شخصي بسيط أو واجب دراسي (مثلاً: آلة حاسبة أو موقع شخصي)",
      studentEn: "A technical project with real-world application (e.g., a web app, mobile app, or data analysis project)",
      studentAr: "مشروع تقني بتطبيق واقعي (مثلاً: تطبيق ويب، تطبيق جوال، أو مشروع تحليل بيانات)",
      graduateEn: "A capstone or graduation project demonstrating full-stack capability or specialized expertise",
      graduateAr: "مشروع تخرج يُظهر قدرة متكاملة في التطوير أو خبرة متخصصة",
    },
  },

  business: {
    id: "business",
    labelEn: "Business Administration",
    labelAr: "إدارة الأعمال",
    skillsEn: ["Financial Analysis", "Excel", "Power BI", "Market Research", "Strategic Planning", "Communication", "Project Management", "Budgeting", "Presentation Skills", "Business Writing", "CRM Systems"],
    skillsAr: ["تحليل مالي", "Excel", "Power BI", "بحث السوق", "تخطيط استراتيجي", "تواصل", "إدارة مشاريع", "إعداد ميزانيات", "مهارات عرض", "كتابة تجارية", "أنظمة CRM"],
    atsKeywords: ["financial analysis", "excel", "power bi", "market research", "strategic planning", "project management", "budgeting", "business development", "crm", "kpi"],
    certSuggestionsEn: ["SOCPA (Saudi Organization for Certified Public Accountants)", "PMP — Project Management Professional", "CFA Level I", "Google Data Analytics", "HubSpot Marketing"],
    certSuggestionsAr: ["الهيئة السعودية للمحاسبين القانونيين (SOCPA)", "PMP — إدارة مشاريع احترافية", "CFA المستوى الأول", "تحليل بيانات من Google", "تسويق HubSpot"],
    requiredSkillKeywords: ["excel", "financial analysis", "market research", "project management"],
    minRequiredSkillMatches: 1,
    projectExpectation: {
      freshmanEn: "A group class project or case study analysis",
      freshmanAr: "مشروع جماعي دراسي أو تحليل دراسة حالة",
      studentEn: "A market research report, business plan, or data-driven analysis project",
      studentAr: "تقرير بحث سوقي، خطة عمل، أو مشروع تحليل مبني على البيانات",
      graduateEn: "A comprehensive capstone project such as a feasibility study or strategic business plan",
      graduateAr: "مشروع تخرج شامل مثل دراسة جدوى أو خطة عمل استراتيجية",
    },
  },

  engineering: {
    id: "engineering",
    labelEn: "Engineering",
    labelAr: "الهندسة",
    skillsEn: ["AutoCAD", "SolidWorks", "MATLAB", "Technical Drawing", "Project Management", "Quality Control", "Process Design", "Safety Standards", "Problem Solving", "3D Modeling", "Simulation"],
    skillsAr: ["AutoCAD", "SolidWorks", "MATLAB", "رسم تقني", "إدارة مشاريع", "مراقبة جودة", "تصميم عمليات", "معايير سلامة", "حل مشكلات", "نمذجة ثلاثية الأبعاد", "محاكاة"],
    atsKeywords: ["autocad", "solidworks", "matlab", "technical drawing", "quality control", "process design", "safety", "simulation", "project management", "3d modeling"],
    certSuggestionsEn: ["Saudi Council of Engineers Membership", "PMP — Project Management Professional", "Six Sigma Green Belt", "OSHA Safety Certification", "AutoCAD Certified Professional"],
    certSuggestionsAr: ["عضوية الهيئة السعودية للمهندسين", "PMP — إدارة مشاريع احترافية", "Six Sigma الحزام الأخضر", "شهادة سلامة OSHA", "AutoCAD معتمد"],
    requiredSkillKeywords: ["autocad", "solidworks", "matlab", "technical drawing", "safety", "quality control"],
    minRequiredSkillMatches: 2,
    projectExpectation: {
      freshmanEn: "A basic engineering design assignment or lab project",
      freshmanAr: "واجب تصميم هندسي أساسي أو مشروع مختبر",
      studentEn: "A hands-on design or simulation project (e.g., bridge model, circuit design, process optimization)",
      studentAr: "مشروع تصميم أو محاكاة عملي (مثلاً: نموذج جسر، تصميم دائرة، تحسين عمليات)",
      graduateEn: "A senior design project or capstone demonstrating engineering judgment and professional standards",
      graduateAr: "مشروع تخرج يُظهر الحكم الهندسي والالتزام بالمعايير المهنية",
    },
  },

  healthcare: {
    id: "healthcare",
    labelEn: "Health Sciences",
    labelAr: "العلوم الصحية",
    skillsEn: ["Patient Care", "Clinical Research", "BLS/CPR", "Medical Terminology", "Electronic Health Records", "Lab Skills", "Data Analysis", "Health & Safety", "First Aid", "Infection Control", "HIPAA Compliance"],
    skillsAr: ["رعاية المرضى", "بحث سريري", "BLS/CPR", "مصطلحات طبية", "سجلات صحية إلكترونية", "مهارات مخبرية", "تحليل بيانات", "صحة وسلامة", "إسعافات أولية", "مكافحة العدوى", "الامتثال لـ HIPAA"],
    atsKeywords: ["patient care", "clinical research", "bls", "cpr", "medical terminology", "ehr", "electronic health records", "lab", "infection control", "first aid", "healthcare"],
    certSuggestionsEn: ["SCFHS Registration (Saudi Commission for Health Specialties)", "BLS — Basic Life Support", "ACLS — Advanced Cardiac Life Support", "Clinical Research Certification", "Infection Control Certificate"],
    certSuggestionsAr: ["تسجيل الهيئة السعودية للتخصصات الصحية (SCFHS)", "BLS — إنعاش القلب الأساسي", "ACLS — إنعاش القلب المتقدم", "شهادة بحث سريري", "شهادة مكافحة عدوى"],
    requiredSkillKeywords: ["patient care", "clinical research", "medical terminology", "bls", "first aid"],
    minRequiredSkillMatches: 2,
    projectExpectation: {
      freshmanEn: "A health awareness campaign or basic lab report",
      freshmanAr: "حملة توعية صحية أو تقرير مختبر أساسي",
      studentEn: "A clinical case study, community health project, or research poster",
      studentAr: "دراسة حالة سريرية، مشروع صحة مجتمعية، أو ملصق بحثي",
      graduateEn: "A clinical rotation summary, published research, or capstone health project",
      graduateAr: "ملخص تدريب سريري، بحث منشور، أو مشروع تخرج صحي",
    },
  },

  creative: {
    id: "creative",
    labelEn: "Design & Creative Arts",
    labelAr: "التصميم والفنون الإبداعية",
    skillsEn: ["Adobe Creative Suite", "Figma", "UI/UX Design", "Branding", "Typography", "Photography", "Video Editing", "Design Thinking", "Illustration", "Motion Graphics", "Prototyping"],
    skillsAr: ["Adobe Creative Suite", "Figma", "تصميم UI/UX", "هوية بصرية", "خطوط", "تصوير", "مونتاج", "تفكير تصميمي", "رسم توضيحي", "موشن جرافيك", "نماذج أولية"],
    atsKeywords: ["adobe", "figma", "ui/ux", "branding", "typography", "photography", "video editing", "design thinking", "illustration", "motion graphics", "prototyping"],
    certSuggestionsEn: ["Google UX Design Professional Certificate", "Adobe Certified Professional", "Interaction Design Foundation (IxDF)", "HubSpot Content Marketing", "Coursera Graphic Design Specialization"],
    certSuggestionsAr: ["شهادة تصميم UX من Google", "Adobe معتمد احترافي", "مؤسسة تصميم التفاعل (IxDF)", "تسويق محتوى HubSpot", "تخصص تصميم جرافيك من Coursera"],
    requiredSkillKeywords: ["adobe", "figma", "ui/ux", "design thinking", "branding"],
    minRequiredSkillMatches: 2,
    projectExpectation: {
      freshmanEn: "A personal design piece, poster, or social media campaign mockup",
      freshmanAr: "تصميم شخصي، ملصق، أو نموذج حملة لوسائل التواصل",
      studentEn: "A portfolio-worthy design project (e.g., app redesign, brand identity, video production)",
      studentAr: "مشروع تصميم يستحق الإضافة للمعرض (مثلاً: إعادة تصميم تطبيق، هوية بصرية، إنتاج فيديو)",
      graduateEn: "A comprehensive portfolio piece or client project demonstrating end-to-end design process",
      graduateAr: "عمل شامل في المعرض أو مشروع لعميل يُظهر عملية التصميم من البداية للنهاية",
    },
  },

  law: {
    id: "law",
    labelEn: "Law",
    labelAr: "القانون",
    skillsEn: ["Legal Research", "Contract Drafting", "Case Analysis", "Saudi Labor Law", "Regulatory Compliance", "Negotiation", "Legal Writing", "Critical Thinking", "Dispute Resolution", "Corporate Governance", "Sharia Law Basics"],
    skillsAr: ["بحث قانوني", "صياغة عقود", "تحليل قضايا", "نظام العمل السعودي", "الامتثال التنظيمي", "تفاوض", "كتابة قانونية", "تفكير نقدي", "حل نزاعات", "حوكمة الشركات", "أساسيات الشريعة"],
    atsKeywords: ["legal research", "contract drafting", "case analysis", "saudi labor law", "regulatory compliance", "negotiation", "legal writing", "dispute resolution", "corporate governance", "sharia"],
    certSuggestionsEn: ["Saudi Bar Association License", "Certified Legal Professional (CLP)", "Contract Management Certificate", "Arbitration & Mediation Training", "Compliance Officer Certification"],
    certSuggestionsAr: ["رخصة الهيئة السعودية للمحامين", "محترف قانوني معتمد (CLP)", "شهادة إدارة العقود", "تدريب تحكيم ووساطة", "شهادة مسؤول امتثال"],
    requiredSkillKeywords: ["legal research", "contract drafting", "case analysis", "saudi labor law"],
    minRequiredSkillMatches: 1,
    projectExpectation: {
      freshmanEn: "A legal essay, moot court brief, or case summary assignment",
      freshmanAr: "مقال قانوني، مذكرة محكمة صورية، أو ملخص قضية دراسي",
      studentEn: "A moot court competition, legal clinic participation, or research paper",
      studentAr: "مسابقة محكمة صورية، مشاركة في عيادة قانونية، أو ورقة بحثية",
      graduateEn: "A published legal analysis, internship at a law firm, or graduation thesis on a legal topic",
      graduateAr: "تحليل قانوني منشور، تدريب في مكتب محاماة، أو رسالة تخرج في موضوع قانوني",
    },
  },

  education: {
    id: "education",
    labelEn: "Education",
    labelAr: "التعليم",
    skillsEn: ["Classroom Management", "Curriculum Design", "Lesson Planning", "Student Assessment", "Educational Technology", "Differentiated Instruction", "Communication", "Mentoring", "Special Education Basics", "Presentation Skills", "E-Learning Platforms"],
    skillsAr: ["إدارة الصف", "تصميم المناهج", "تخطيط الدروس", "تقييم الطلاب", "تقنيات التعليم", "التعليم المتمايز", "تواصل", "إرشاد", "أساسيات التربية الخاصة", "مهارات عرض", "منصات التعليم الإلكتروني"],
    atsKeywords: ["classroom management", "curriculum design", "lesson planning", "student assessment", "educational technology", "differentiated instruction", "mentoring", "e-learning", "special education"],
    certSuggestionsEn: ["Teaching License (Saudi Ministry of Education)", "TESOL/TEFL Certification", "Google Certified Educator", "Microsoft Innovative Educator", "Montessori Teaching Certificate"],
    certSuggestionsAr: ["رخصة التدريس (وزارة التعليم السعودية)", "شهادة TESOL/TEFL", "معلم معتمد من Google", "معلم مبتكر من Microsoft", "شهادة تدريس مونتيسوري"],
    requiredSkillKeywords: ["classroom management", "lesson planning", "curriculum design", "student assessment"],
    minRequiredSkillMatches: 1,
    projectExpectation: {
      freshmanEn: "A tutoring experience, peer mentoring activity, or teaching demo",
      freshmanAr: "تجربة تدريس خصوصي، نشاط إرشاد أقران، أو عرض تدريسي",
      studentEn: "A practicum lesson plan, educational workshop, or student teaching portfolio",
      studentAr: "خطة درس تطبيقية، ورشة عمل تعليمية، أو ملف تدريس ميداني",
      graduateEn: "A student teaching capstone, curriculum development project, or classroom research study",
      graduateAr: "مشروع تخرج تدريس ميداني، مشروع تطوير منهج، أو دراسة بحثية صفية",
    },
  },

  other: {
    id: "other",
    labelEn: "Other",
    labelAr: "أخرى",
    skillsEn: ["Communication", "Problem Solving", "Team Collaboration", "Time Management", "Critical Thinking", "Adaptability", "Leadership", "Microsoft Office", "Organizational Skills", "Customer Service"],
    skillsAr: ["تواصل", "حل مشكلات", "عمل جماعي", "إدارة الوقت", "تفكير نقدي", "تكيّف", "قيادة", "Microsoft Office", "مهارات تنظيمية", "خدمة عملاء"],
    atsKeywords: ["communication", "problem solving", "teamwork", "time management", "critical thinking", "leadership", "microsoft office", "customer service"],
    certSuggestionsEn: ["Google Project Management", "LinkedIn Learning Certificates", "Coursera Professional Certificates", "First Aid & CPR", "Customer Service Excellence"],
    certSuggestionsAr: ["إدارة مشاريع من Google", "شهادات LinkedIn Learning", "شهادات Coursera المهنية", "إسعافات أولية و CPR", "التميز في خدمة العملاء"],
    requiredSkillKeywords: [],
    minRequiredSkillMatches: 0,
    projectExpectation: {
      freshmanEn: "Any personal initiative, volunteer project, or class assignment",
      freshmanAr: "أي مبادرة شخصية، مشروع تطوعي، أو واجب دراسي",
      studentEn: "A meaningful academic or personal project demonstrating initiative",
      studentAr: "مشروع أكاديمي أو شخصي يُظهر روح المبادرة",
      graduateEn: "A capstone project, portfolio piece, or professional initiative",
      graduateAr: "مشروع تخرج، عمل في المعرض، أو مبادرة مهنية",
    },
  },
};

// ── 3. GOAL_CONFIG ──

export const GOAL_CONFIG: Record<Goal, GoalDefinition> = {
  volunteering: {
    id: "volunteering",
    labelEn: "Volunteering & Clubs",
    labelAr: "تطوع وأنشطة طلابية",
    atsPriority: "low",
    summaryLengthMin: 80,
    summaryLengthIdeal: 150,
    experienceExpected: false,
    toneEn: "Enthusiastic and community-oriented; emphasize soft skills and initiative",
    toneAr: "متحمس وموجه للمجتمع؛ أبرز المهارات الشخصية وروح المبادرة",
    sectionWeightModifiers: {
      experience: -3,
      projects: 2,
      skills: 2,
    },
  },

  internship: {
    id: "internship",
    labelEn: "Co-op / Internship",
    labelAr: "تدريب تعاوني",
    atsPriority: "high",
    summaryLengthMin: 120,
    summaryLengthIdeal: 200,
    experienceExpected: false,
    toneEn: "Professional yet learning-focused; highlight academic achievements and technical readiness",
    toneAr: "مهني مع تركيز على التعلم؛ أبرز الإنجازات الأكاديمية والجاهزية التقنية",
    sectionWeightModifiers: {
      experience: 3,
      projects: 3,
      skills: 2,
    },
  },

  "part-time": {
    id: "part-time",
    labelEn: "Part-time Job",
    labelAr: "عمل جزئي",
    atsPriority: "medium",
    summaryLengthMin: 100,
    summaryLengthIdeal: 180,
    experienceExpected: false,
    toneEn: "Flexible and reliable; emphasize availability, time management, and relevant skills",
    toneAr: "مرن وموثوق؛ أبرز المرونة في الوقت وإدارة المهام والمهارات ذات الصلة",
    sectionWeightModifiers: {
      experience: 1,
      skills: 2,
    },
  },

  "full-time": {
    id: "full-time",
    labelEn: "Full-time Position",
    labelAr: "وظيفة بدوام كامل",
    atsPriority: "critical",
    summaryLengthMin: 150,
    summaryLengthIdeal: 250,
    experienceExpected: true,
    toneEn: "Confident and results-driven; demonstrate impact, specialization, and career commitment",
    toneAr: "واثق وموجه نحو النتائج؛ أظهر الأثر والتخصص والالتزام المهني",
    sectionWeightModifiers: {
      experience: 5,
      summary: 3,
      education: -3,
      languages: -2,
    },
  },
};

// ── 4. TEMPLATE_MATRIX ──

export const TEMPLATE_MATRIX: Record<Stage, Record<Goal, TemplateDecision>> = {
  freshman: {
    volunteering: {
      template: "starter",
      reasonEn: "Starter template — clean and simple, ideal for building your first resume",
      reasonAr: "قالب المبتدئ — نظيف وبسيط، مثالي لبناء أول سيرة ذاتية",
    },
    internship: {
      template: "starter",
      reasonEn: "Starter template — focus on potential and eagerness to learn",
      reasonAr: "قالب المبتدئ — يركّز على الإمكانيات والشغف بالتعلم",
    },
    "part-time": {
      template: "starter",
      reasonEn: "Starter template — highlights skills and availability for part-time roles",
      reasonAr: "قالب المبتدئ — يبرز المهارات والمرونة للعمل الجزئي",
    },
    "full-time": {
      template: "starter",
      reasonEn: "Starter template — builds a strong foundation for your career start",
      reasonAr: "قالب المبتدئ — يبني أساساً قوياً لبداية مسيرتك المهنية",
    },
  },

  student: {
    volunteering: {
      template: "starter",
      reasonEn: "Starter template — perfect for showcasing volunteer work and extracurriculars",
      reasonAr: "قالب المبتدئ — مثالي لعرض العمل التطوعي والأنشطة",
    },
    internship: {
      template: "academic",
      reasonEn: "Academic template — highlights projects and technical skills for internship applications",
      reasonAr: "القالب الأكاديمي — يبرز المشاريع والمهارات التقنية لطلبات التدريب",
    },
    "part-time": {
      template: "starter",
      reasonEn: "Starter template — emphasizes skills and flexibility for part-time opportunities",
      reasonAr: "قالب المبتدئ — يبرز المهارات والمرونة للفرص الجزئية",
    },
    "full-time": {
      template: "academic",
      reasonEn: "Academic template — professional format that showcases academic excellence and projects",
      reasonAr: "القالب الأكاديمي — تنسيق مهني يعرض التميز الأكاديمي والمشاريع",
    },
  },

  graduate: {
    volunteering: {
      template: "starter",
      reasonEn: "Starter template — clean format for community-focused roles",
      reasonAr: "قالب المبتدئ — تنسيق نظيف للأدوار المجتمعية",
    },
    internship: {
      template: "academic",
      reasonEn: "Academic template — balances education and experience for competitive internships",
      reasonAr: "القالب الأكاديمي — يوازن بين التعليم والخبرة للتدريب التنافسي",
    },
    "part-time": {
      template: "academic",
      reasonEn: "Academic template — professional presentation for part-time professional roles",
      reasonAr: "القالب الأكاديمي — عرض مهني للأدوار الجزئية المتخصصة",
    },
    "full-time": {
      template: "professional",
      reasonEn: "Professional template — ATS-optimized format for full-time job applications",
      reasonAr: "القالب الاحترافي — تنسيق متوافق مع ATS لطلبات التوظيف",
    },
  },
};

// ── 5. SECTION_ORDER_MATRIX ──

export const SECTION_ORDER_MATRIX: Record<Stage, Record<Goal, SectionKey[]>> = {
  freshman: {
    volunteering: ["personal", "summary", "education", "skills", "projects", "certifications", "languages", "experience"],
    internship: ["personal", "summary", "education", "skills", "projects", "certifications", "languages", "experience"],
    "part-time": ["personal", "summary", "education", "skills", "projects", "certifications", "languages", "experience"],
    "full-time": ["personal", "summary", "education", "skills", "projects", "experience", "certifications", "languages"],
  },

  student: {
    volunteering: ["personal", "summary", "education", "projects", "skills", "certifications", "languages", "experience"],
    internship: ["personal", "summary", "education", "projects", "skills", "experience", "certifications", "languages"],
    "part-time": ["personal", "summary", "education", "projects", "skills", "certifications", "languages", "experience"],
    "full-time": ["personal", "summary", "experience", "education", "projects", "skills", "certifications", "languages"],
  },

  graduate: {
    volunteering: ["personal", "summary", "education", "projects", "skills", "certifications", "languages", "experience"],
    internship: ["personal", "summary", "experience", "education", "projects", "skills", "certifications", "languages"],
    "part-time": ["personal", "summary", "experience", "education", "projects", "skills", "certifications", "languages"],
    "full-time": ["personal", "summary", "experience", "education", "projects", "skills", "certifications", "languages"],
  },
};

// ── 6. EDGE_CASE_RULES ──

export const EDGE_CASE_RULES: EdgeCaseRule[] = [
  {
    condition: { stage: "freshman", goal: "internship" },
    action: "block",
    messageEn: "Internships typically require students in their 3rd year or above. Consider volunteering or part-time work to build experience first.",
    messageAr: "التدريب التعاوني عادةً يتطلب طلاب السنة الثالثة فأعلى. ننصحك بالتطوع أو العمل الجزئي لبناء خبرتك أولاً.",
  },
  {
    condition: { stage: "freshman", goal: "full-time" },
    action: "block",
    messageEn: "Full-time positions require a completed degree. Focus on building skills through volunteering and part-time roles.",
    messageAr: "الوظائف بدوام كامل تتطلب إكمال الدرجة العلمية. ركّز على بناء مهاراتك من خلال التطوع والعمل الجزئي.",
  },
  {
    condition: { stage: "graduate", goal: "volunteering" },
    action: "warn",
    messageEn: "As a graduate, you're qualified for professional roles. Volunteering is great, but consider also targeting internships or full-time positions.",
    messageAr: "كخريج، أنت مؤهل للأدوار المهنية. التطوع رائع، لكن فكّر أيضاً في استهداف التدريب أو الوظائف بدوام كامل.",
  },
  {
    condition: { stage: "student", goal: "full-time" },
    action: "warn",
    messageEn: "Full-time roles are usually for graduates. If you're close to graduating, this could work — otherwise consider an internship.",
    messageAr: "الوظائف بدوام كامل عادةً للخريجين. إذا كنت قريباً من التخرج فقد يناسبك — وإلا ننصح بالتدريب التعاوني.",
  },
];

// ── 7. Helper Functions ──

export function selectTemplate(stage: Stage, goal: Goal): TemplateDecision {
  return TEMPLATE_MATRIX[stage]?.[goal] ?? TEMPLATE_MATRIX[stage]?.["part-time"] ?? {
    template: "starter",
    reasonEn: "Default starter template",
    reasonAr: "قالب المبتدئ الافتراضي",
  };
}

export function getSectionOrder(stage: Stage, goal: Goal): SectionKey[] {
  return SECTION_ORDER_MATRIX[stage]?.[goal] ?? SECTION_ORDER_MATRIX[stage]?.["part-time"] ?? [
    "personal", "summary", "education", "skills", "projects", "experience", "certifications", "languages",
  ];
}

export function getEffectiveWeights(stage: Stage, goal: Goal): SectionWeights {
  const base = { ...PERSONA_CONFIG[stage]?.sectionWeights ?? PERSONA_CONFIG.student.sectionWeights };
  const modifiers = GOAL_CONFIG[goal]?.sectionWeightModifiers ?? {};

  for (const key of Object.keys(modifiers) as SectionKey[]) {
    base[key] = Math.max(0, (base[key] ?? 0) + (modifiers[key] ?? 0));
  }

  return base;
}

export function validateSurveySelection(stage: Stage, goal: Goal): {
  valid: boolean;
  action?: "block" | "warn";
  messageEn?: string;
  messageAr?: string;
} {
  const rule = EDGE_CASE_RULES.find(
    (r) => r.condition.stage === stage && r.condition.goal === goal
  );

  if (!rule) return { valid: true };

  return {
    valid: rule.action !== "block",
    action: rule.action,
    messageEn: rule.messageEn,
    messageAr: rule.messageAr,
  };
}
