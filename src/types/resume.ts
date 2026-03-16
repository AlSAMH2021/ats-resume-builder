import { z } from "zod";

export const resumeSchema = z.object({
  // القسم الأول: معلومات التواصل
  fullName: z.string().optional().default(""),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),

  // القسم الثاني: التعليم الأكاديمي
  education: z.array(z.object({
    degree: z.string().optional().default(""),       // التخصص
    institution: z.string().optional().default(""),   // الجامعة
    location: z.string().optional().default(""),
    startDate: z.string().optional().default(""),
    endDate: z.string().optional().default(""),
    description: z.string().optional().default(""),
  })).default([]),

  // القسم الثالث: التعليم المهاري
  courses: z.array(z.object({
    name: z.string().optional().default(""),
  })).default([]),
  certifications: z.array(z.object({
    name: z.string().optional().default(""),
    issuer: z.string().optional().default(""),
    date: z.string().optional().default(""),
  })).default([]),

  // القسم الرابع: الخبرات العملية
  experiences: z.array(z.object({
    jobTitle: z.string().optional().default(""),
    company: z.string().optional().default(""),
    location: z.string().optional().default(""),
    startDate: z.string().optional().default(""),
    endDate: z.string().optional().default(""),
    current: z.boolean().optional().default(false),
    bullets: z.string().optional().default(""),
  })).default([]),
  projects: z.array(z.object({
    name: z.string().optional().default(""),
    description: z.string().optional().default(""),
    url: z.string().optional().default(""),
  })).default([]),

  // القسم الخامس: اللغات
  languages: z.array(z.object({
    name: z.string().optional().default(""),
    level: z.string().optional().default(""),
  })).default([]),

  // حقول إضافية (مخفية من القالب الجديد لكن محفوظة)
  jobTitle: z.string().optional().default(""),
  location: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  website: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  skills: z.string().optional().default(""),
});

export type ResumeData = z.infer<typeof resumeSchema>;

export const defaultResumeData: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  education: [],
  courses: [],
  certifications: [],
  experiences: [],
  projects: [],
  languages: [],
  jobTitle: "",
  location: "",
  linkedin: "",
  website: "",
  summary: "",
  skills: "",
};
