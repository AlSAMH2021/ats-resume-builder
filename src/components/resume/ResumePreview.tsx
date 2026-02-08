import type { ResumeData } from "@/types/resume";
import type { ResumeTemplate } from "./TemplateSelector";
import type { ResumeColors } from "./ColorCustomizer";
import { defaultResumeColors } from "./ColorCustomizer";

interface Props {
  data: ResumeData;
  lang: 'en' | 'ar';
  template?: ResumeTemplate;
  colors?: ResumeColors;
}

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

export default function ResumePreview({ data, lang, template = "classic", colors }: Props) {
  const c = colors || defaultResumeColors;
  const hasContent = (val: string | undefined) => val && val.trim().length > 0;
  const contactParts = [data.location, data.phone, data.email, data.linkedin, data.website].filter(Boolean);

  const h2Style = { color: c.headingColor, borderBottomColor: c.lineColor };

  return (
    <div className={`resume-preview resume-${template}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Name & Title */}
      {hasContent(data.fullName) && <h1>{data.fullName}</h1>}
      {hasContent(data.jobTitle) && <p style={{ fontSize: '12pt', marginBottom: '4pt' }}>{data.jobTitle}</p>}

      {/* Contact Line */}
      {contactParts.length > 0 && (
        <p className="contact-line">{contactParts.join("  |  ")}</p>
      )}

      {/* Summary */}
      {hasContent(data.summary) && (
        <>
          <h2 style={h2Style}>{l(lang, "PROFESSIONAL SUMMARY", "الملخص المهني")}</h2>
          <p>{data.summary}</p>
        </>
      )}

      {/* Experience */}
      {data.experiences && data.experiences.length > 0 && data.experiences.some(e => hasContent(e.jobTitle) || hasContent(e.company)) && (
        <>
          <h2 style={h2Style}>{l(lang, "EXPERIENCE", "الخبرات")}</h2>
          {data.experiences.map((exp, i) => (
            <div key={i} style={{ marginBottom: '8pt' }}>
              <h3>
                {exp.jobTitle}
                {exp.company ? ` — ${exp.company}` : ""}
              </h3>
              <p style={{ fontSize: '10pt', color: '#555' }}>
                {[
                  exp.location,
                  exp.startDate && `${exp.startDate} – ${exp.current ? l(lang, 'Present', 'حتى الآن') : exp.endDate || ''}`
                ].filter(Boolean).join("  |  ")}
              </p>
              {hasContent(exp.bullets) && (
                <ul>
                  {exp.bullets!.split("\n").filter(b => b.trim()).map((bullet, j) => (
                    <li key={j}>{bullet.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && data.education.some(e => hasContent(e.degree) || hasContent(e.institution)) && (
        <>
          <h2 style={h2Style}>{l(lang, "EDUCATION", "التعليم")}</h2>
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '6pt' }}>
              <h3>
                {edu.degree}
                {edu.institution ? ` — ${edu.institution}` : ""}
              </h3>
              <p style={{ fontSize: '10pt', color: '#555' }}>
                {[edu.location, edu.startDate && `${edu.startDate} – ${edu.endDate || ''}`].filter(Boolean).join("  |  ")}
              </p>
              {hasContent(edu.description) && <p style={{ fontSize: '10pt' }}>{edu.description}</p>}
            </div>
          ))}
        </>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && data.certifications.some(c => hasContent(c.name)) && (
        <>
          <h2 style={h2Style}>{l(lang, "CERTIFICATIONS", "الشهادات")}</h2>
          {data.certifications.map((cert, i) => (
            <p key={i}>
              <strong>{cert.name}</strong>
              {cert.issuer ? ` — ${cert.issuer}` : ""}
              {cert.date ? ` (${cert.date})` : ""}
            </p>
          ))}
        </>
      )}

      {/* Skills */}
      {hasContent(data.skills) && (
        <>
          <h2 style={h2Style}>{l(lang, "SKILLS", "المهارات")}</h2>
          <p>{data.skills}</p>
        </>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && data.languages.some(lg => hasContent(lg.name)) && (
        <>
          <h2 style={h2Style}>{l(lang, "LANGUAGES", "اللغات")}</h2>
          <p>{data.languages.filter(lg => lg.name).map(lg => `${lg.name}${lg.level ? ` (${lg.level})` : ""}`).join("  •  ")}</p>
        </>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && data.projects.some(p => hasContent(p.name)) && (
        <>
          <h2 style={h2Style}>{l(lang, "PROJECTS", "المشاريع")}</h2>
          {data.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '6pt' }}>
              <h3>{proj.name}</h3>
              {hasContent(proj.description) && <p style={{ fontSize: '10pt' }}>{proj.description}</p>}
              {hasContent(proj.url) && <p style={{ fontSize: '9pt', color: '#555' }}>{proj.url}</p>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
