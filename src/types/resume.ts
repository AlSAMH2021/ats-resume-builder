import { z } from "zod";

export const resumeSchema = z.object({
  fullName: z.string().optional().default(""),
  jobTitle: z.string().optional().default(""),
  location: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  website: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  experiences: z.array(z.object({
    jobTitle: z.string().optional().default(""),
    company: z.string().optional().default(""),
    location: z.string().optional().default(""),
    startDate: z.string().optional().default(""),
    endDate: z.string().optional().default(""),
    current: z.boolean().optional().default(false),
    bullets: z.string().optional().default(""),
  })).default([]),
  education: z.array(z.object({
    degree: z.string().optional().default(""),
    institution: z.string().optional().default(""),
    location: z.string().optional().default(""),
    startDate: z.string().optional().default(""),
    endDate: z.string().optional().default(""),
    description: z.string().optional().default(""),
  })).default([]),
  certifications: z.array(z.object({
    name: z.string().optional().default(""),
    issuer: z.string().optional().default(""),
    date: z.string().optional().default(""),
  })).default([]),
  skills: z.string().optional().default(""),
  languages: z.array(z.object({
    name: z.string().optional().default(""),
    level: z.string().optional().default(""),
  })).default([]),
  projects: z.array(z.object({
    name: z.string().optional().default(""),
    description: z.string().optional().default(""),
    url: z.string().optional().default(""),
  })).default([]),
});

export type ResumeData = z.infer<typeof resumeSchema>;

export const defaultResumeData: ResumeData = {
  fullName: "",
  jobTitle: "",
  location: "",
  phone: "",
  email: "",
  linkedin: "",
  website: "",
  summary: "",
  experiences: [],
  education: [],
  certifications: [],
  skills: "",
  languages: [],
  projects: [],
};
