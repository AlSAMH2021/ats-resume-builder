import type { ResumeData } from "@/types/resume";

interface Props {
  data: ResumeData;
  lang: 'en' | 'ar';
}

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

export default function ResumePreview({ data, lang }: Props) {
  const has = (val: string | undefined) => val && val.trim().length > 0;

  const contactParts: string[] = [];
  if (has(data.email)) contactParts.push(data.email!);
  if (has(data.phone)) contactParts.push(data.phone!);
  if (has(data.linkedin)) contactParts.push(data.linkedin!);
  if (has(data.location)) contactParts.push(data.location!);

  return (
    <div
      className="resume-preview font-[Georgia,serif] text-[11pt] leading-[1.5] text-black"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Header: Name + Contact inline */}
      {(has(data.fullName) || contactParts.length > 0) && (
        <header className="text-center mb-4 pb-2 border-b border-black">
          {has(data.fullName) && (
            <h1 className="text-[18pt] font-bold uppercase tracking-wide mb-1">
              {data.fullName}
            </h1>
          )}
          {contactParts.length > 0 && (
            <p className="text-[10pt] text-gray-700">
              {contactParts.join("  |  ")}
            </p>
          )}
        </header>
      )}

      {/* EDUCATION */}
      {data.education?.some(e => has(e.degree) || has(e.institution)) && (
        <section className="mb-3">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-1.5 tracking-wide">
            {l(lang, "EDUCATION", "التعليم")}
          </h2>
          {data.education.filter(e => has(e.degree) || has(e.institution)).map((edu, i) => (
            <div key={i} className="mb-1.5">
              <div className="flex justify-between items-baseline flex-wrap">
                <p className="font-bold text-[11pt]">{edu.degree}</p>
                {(edu.startDate || edu.endDate) && (
                  <span className="text-[10pt] text-gray-600">
                    {edu.startDate}{edu.endDate && ` – ${edu.endDate}`}
                  </span>
                )}
              </div>
              {has(edu.institution) && (
                <p className="text-[10.5pt] italic">{edu.institution}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* PROFESSIONAL EXPERIENCE */}
      {data.experiences?.some(e => has(e.jobTitle) || has(e.company)) && (
        <section className="mb-3">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-1.5 tracking-wide">
            {l(lang, "PROFESSIONAL EXPERIENCE", "الخبرات المهنية")}
          </h2>
          {data.experiences.filter(e => has(e.jobTitle) || has(e.company)).map((exp, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline flex-wrap">
                <p className="font-bold text-[11pt]">{exp.jobTitle}</p>
                <span className="text-[10pt] text-gray-600">
                  {exp.startDate && exp.startDate}
                  {(exp.endDate || exp.current) && ` – ${exp.current ? l(lang, "Present", "حتى الآن") : exp.endDate}`}
                </span>
              </div>
              {has(exp.company) && (
                <p className="text-[10.5pt] italic">{exp.company}{has(exp.location) && `, ${exp.location}`}</p>
              )}
              {has(exp.bullets) && (
                <ul className="mt-0.5 list-disc ms-5 text-[10.5pt]">
                  {exp.bullets!.split("\n").filter(b => b.trim()).map((bullet, j) => (
                    <li key={j}>{bullet.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS & ACHIEVEMENTS */}
      {data.projects?.some(p => has(p.name)) && (
        <section className="mb-3">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-1.5 tracking-wide">
            {l(lang, "PROJECTS", "المشاريع والإنجازات")}
          </h2>
          {data.projects.filter(p => has(p.name)).map((proj, i) => (
            <div key={i} className="mb-1">
              <p className="text-[10.5pt]">
                <span className="font-bold">{proj.name}</span>
                {has(proj.description) && ` — ${proj.description}`}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICATIONS & TRAINING */}
      {(data.certifications?.some(c => has(c.name)) || data.courses?.some(c => has(c.name))) && (
        <section className="mb-3">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-1.5 tracking-wide">
            {l(lang, "CERTIFICATIONS & TRAINING", "الشهادات والتدريب")}
          </h2>
          {data.certifications?.filter(c => has(c.name)).map((cert, i) => (
            <p key={`cert-${i}`} className="text-[10.5pt] mb-0.5">
              <span className="font-bold">{cert.name}</span>
              {has(cert.issuer) && ` — ${cert.issuer}`}
              {has(cert.date) && ` (${cert.date})`}
            </p>
          ))}
          {data.courses?.filter(c => has(c.name)).map((course, i) => (
            <p key={`course-${i}`} className="text-[10.5pt] mb-0.5">
              {course.name}
            </p>
          ))}
        </section>
      )}

      {/* SKILLS */}
      {has(data.skills) && (
        <section className="mb-3">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-1.5 tracking-wide">
            {l(lang, "SKILLS", "المهارات")}
          </h2>
          <p className="text-[10.5pt]">{data.skills}</p>
        </section>
      )}

      {/* LANGUAGES */}
      {data.languages?.some(lg => has(lg.name)) && (
        <section className="mb-3">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 pb-0.5 mb-1.5 tracking-wide">
            {l(lang, "LANGUAGES", "اللغات")}
          </h2>
          <p className="text-[10.5pt]">
            {data.languages.filter(lg => has(lg.name)).map(lg =>
              `${lg.name}${lg.level ? ` (${lg.level})` : ''}`
            ).join("  •  ")}
          </p>
        </section>
      )}
    </div>
  );
}