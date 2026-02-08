import { ResumeData } from "@/types/resume";

export const demoDataEn: ResumeData = {
  fullName: "Sarah Johnson",
  jobTitle: "Senior Software Engineer",
  location: "San Francisco, CA",
  phone: "+1 (555) 123-4567",
  email: "sarah.johnson@email.com",
  linkedin: "linkedin.com/in/sarahjohnson",
  website: "sarahjohnson.dev",
  summary: "Results-driven Senior Software Engineer with 7+ years of experience designing, developing, and deploying scalable web applications. Proficient in React, TypeScript, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-impact projects on time.",
  experiences: [
    {
      jobTitle: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2021-01",
      endDate: "",
      current: true,
      bullets: "Led a team of 5 engineers to redesign the core platform, improving performance by 40%\nArchitected microservices infrastructure handling 10M+ daily requests\nImplemented CI/CD pipelines reducing deployment time by 60%\nMentored 3 junior developers, all promoted within 18 months",
    },
    {
      jobTitle: "Software Engineer",
      company: "StartupXYZ",
      location: "Austin, TX",
      startDate: "2018-03",
      endDate: "2020-12",
      current: false,
      bullets: "Developed real-time data dashboard using React and D3.js serving 50K+ users\nOptimized database queries reducing response time by 70%\nCollaborated with product team to define and ship 15+ features per quarter",
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2013",
      endDate: "2017",
      description: "GPA: 3.8/4.0, Dean's List, ACM Programming Contest Finalist",
    },
  ],
  certifications: [
    { name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services", date: "2023" },
    { name: "Google Cloud Professional Developer", issuer: "Google", date: "2022" },
  ],
  skills: "React, TypeScript, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker, Kubernetes, GraphQL, REST APIs, CI/CD, Agile/Scrum, Git, Redis, Terraform",
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Intermediate" },
  ],
  projects: [
    {
      name: "Open Source Contribution - ReactQuery Toolkit",
      description: "Created a utility library for React Query with 2K+ GitHub stars, providing simplified patterns for common data fetching scenarios.",
      url: "github.com/sarahjohnson/rq-toolkit",
    },
  ],
};

export const demoDataAr: ResumeData = {
  fullName: "أحمد محمد العلي",
  jobTitle: "مهندس برمجيات أول",
  location: "الرياض، المملكة العربية السعودية",
  phone: "+966 50 123 4567",
  email: "ahmed.alali@email.com",
  linkedin: "linkedin.com/in/ahmedalali",
  website: "ahmedalali.dev",
  summary: "مهندس برمجيات أول بخبرة تزيد عن 7 سنوات في تصميم وتطوير ونشر تطبيقات الويب القابلة للتوسع. متمكن من React وTypeScript وNode.js وتقنيات الحوسبة السحابية. سجل حافل في قيادة الفرق متعددة التخصصات وتسليم المشاريع عالية التأثير في الوقت المحدد.",
  experiences: [
    {
      jobTitle: "مهندس برمجيات أول",
      company: "شركة تقنية المستقبل",
      location: "الرياض، السعودية",
      startDate: "2021-01",
      endDate: "",
      current: true,
      bullets: "قيادة فريق من 5 مهندسين لإعادة تصميم المنصة الأساسية مع تحسين الأداء بنسبة 40%\nتصميم بنية خدمات مصغرة تعالج أكثر من 10 ملايين طلب يومياً\nتطبيق أنابيب CI/CD مما قلل وقت النشر بنسبة 60%",
    },
  ],
  education: [
    {
      degree: "بكالوريوس علوم الحاسب",
      institution: "جامعة الملك سعود",
      location: "الرياض، السعودية",
      startDate: "2013",
      endDate: "2017",
      description: "معدل تراكمي: 4.5/5.0، مرتبة الشرف الأولى",
    },
  ],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2023" },
  ],
  skills: "React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes, GraphQL, REST APIs, CI/CD, Agile/Scrum",
  languages: [
    { name: "العربية", level: "اللغة الأم" },
    { name: "الإنجليزية", level: "متقدم" },
  ],
  projects: [],
};
