import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Packer,
  type IParagraphOptions,
  type IBorderOptions,
} from "docx";
import { saveAs } from "file-saver";
import type { ResumeData } from "@/types/resume";
import type { ResumeSection } from "@/components/resume/SectionReorder";
import { defaultSectionOrder } from "@/components/resume/SectionReorder";

const l = (lang: string, en: string, ar: string) =>
  lang === "ar" ? ar : en;

const hasContent = (val: string | undefined) => val && val.trim().length > 0;

const bottomBorder: IBorderOptions = {
  color: "333333",
  space: 1,
  style: BorderStyle.SINGLE,
  size: 6,
};

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    border: { bottom: bottomBorder },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: "Calibri" }),
    ],
  });
}

function buildSections(data: ResumeData, lang: string, order: ResumeSection[]): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  const sectionBuilders: Record<ResumeSection, () => void> = {
    personal: () => {}, // rendered separately as header
    summary: () => {
      if (!hasContent(data.summary)) return;
      paragraphs.push(sectionHeading(l(lang, "Professional Summary", "الملخص المهني")));
      paragraphs.push(new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: data.summary, size: 22, font: "Calibri" })],
      }));
    },

    experience: () => {
      if (!data.experiences?.some(e => hasContent(e.jobTitle) || hasContent(e.company))) return;
      paragraphs.push(sectionHeading(l(lang, "Experience", "الخبرات")));
      data.experiences.forEach((exp) => {
        if (!hasContent(exp.jobTitle) && !hasContent(exp.company)) return;
        paragraphs.push(new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: exp.jobTitle || "", bold: true, size: 22, font: "Calibri" }),
            ...(exp.company ? [new TextRun({ text: ` — ${exp.company}`, size: 22, font: "Calibri" })] : []),
          ],
        }));
        const meta = [exp.location, exp.startDate && `${exp.startDate} – ${exp.current ? l(lang, "Present", "حتى الآن") : exp.endDate || ""}`].filter(Boolean).join("  |  ");
        if (meta) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: meta, size: 20, color: "555555", font: "Calibri" })],
          }));
        }
        if (hasContent(exp.bullets)) {
          exp.bullets!.split("\n").filter(b => b.trim()).forEach((bullet) => {
            paragraphs.push(new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 40 },
              children: [new TextRun({ text: bullet.trim(), size: 22, font: "Calibri" })],
            }));
          });
        }
      });
    },

    education: () => {
      if (!data.education?.some(e => hasContent(e.degree) || hasContent(e.institution))) return;
      paragraphs.push(sectionHeading(l(lang, "Education", "التعليم")));
      data.education.forEach((edu) => {
        if (!hasContent(edu.degree) && !hasContent(edu.institution)) return;
        paragraphs.push(new Paragraph({
          spacing: { before: 80 },
          children: [
            new TextRun({ text: edu.degree || "", bold: true, size: 22, font: "Calibri" }),
            ...(edu.institution ? [new TextRun({ text: ` — ${edu.institution}`, size: 22, font: "Calibri" })] : []),
          ],
        }));
        const meta = [edu.location, edu.startDate && `${edu.startDate} – ${edu.endDate || ""}`].filter(Boolean).join("  |  ");
        if (meta) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: meta, size: 20, color: "555555", font: "Calibri" })],
          }));
        }
        if (hasContent(edu.description)) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: edu.description!, size: 20, font: "Calibri" })],
          }));
        }
      });
    },

    certifications: () => {
      if (!data.certifications?.some(c => hasContent(c.name))) return;
      paragraphs.push(sectionHeading(l(lang, "Certifications", "الشهادات")));
      data.certifications.forEach((cert) => {
        if (!hasContent(cert.name)) return;
        paragraphs.push(new Paragraph({
          spacing: { before: 40 },
          children: [
            new TextRun({ text: cert.name, bold: true, size: 22, font: "Calibri" }),
            ...(cert.issuer ? [new TextRun({ text: ` — ${cert.issuer}`, size: 22, font: "Calibri" })] : []),
            ...(cert.date ? [new TextRun({ text: ` (${cert.date})`, size: 20, color: "555555", font: "Calibri" })] : []),
          ],
        }));
      });
    },

    skills: () => {
      if (!hasContent(data.skills)) return;
      paragraphs.push(sectionHeading(l(lang, "Skills", "المهارات")));
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: data.skills, size: 22, font: "Calibri" })],
      }));
    },

    languages: () => {
      if (!data.languages?.some(lg => hasContent(lg.name))) return;
      paragraphs.push(sectionHeading(l(lang, "Languages", "اللغات")));
      const text = data.languages.filter(lg => lg.name).map(lg => `${lg.name}${lg.level ? ` (${lg.level})` : ""}`).join("  •  ");
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text, size: 22, font: "Calibri" })],
      }));
    },

    projects: () => {
      if (!data.projects?.some(p => hasContent(p.name))) return;
      paragraphs.push(sectionHeading(l(lang, "Projects", "المشاريع")));
      data.projects.forEach((proj) => {
        if (!hasContent(proj.name)) return;
        paragraphs.push(new Paragraph({
          spacing: { before: 80 },
          children: [new TextRun({ text: proj.name, bold: true, size: 22, font: "Calibri" })],
        }));
        if (hasContent(proj.description)) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: proj.description!, size: 20, font: "Calibri" })],
          }));
        }
        if (hasContent(proj.url)) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: proj.url!, size: 18, color: "555555", font: "Calibri" })],
          }));
        }
      });
    },
  };

  order.forEach((s) => sectionBuilders[s]());
  return paragraphs;
}

export async function exportToDocx(
  data: ResumeData,
  lang: string,
  sectionOrder: ResumeSection[] = defaultSectionOrder
) {
  const contactParts = [data.location, data.phone, data.email, data.linkedin, data.website].filter(Boolean);

  const headerParagraphs: Paragraph[] = [];

  if (hasContent(data.fullName)) {
    headerParagraphs.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: data.fullName, bold: true, size: 40, font: "Calibri" })],
    }));
  }

  if (hasContent(data.jobTitle)) {
    headerParagraphs.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: data.jobTitle, size: 24, font: "Calibri" })],
    }));
  }

  if (contactParts.length > 0) {
    headerParagraphs.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: contactParts.join("  |  "), size: 20, color: "444444", font: "Calibri" })],
    }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: [...headerParagraphs, ...buildSections(data, lang, sectionOrder)],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = data.fullName?.trim()
    ? `${data.fullName.trim().replace(/\s+/g, "_")}_Resume.docx`
    : "Resume.docx";
  saveAs(blob, fileName);
}
