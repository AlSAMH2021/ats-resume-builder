import type { ResumeData } from "@/types/resume";

interface Props {
  data: ResumeData;
  lang: 'en' | 'ar';
}

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

export default function ResumePreview({ data, lang }: Props) {
  const hasContent = (val: string | undefined) => val && val.trim().length > 0;

  return (
    <div className="resume-preview" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* القسم الأول: معلومات التواصل */}
      <section className="rv2-section">
        <h2 className="rv2-heading">
          {l(lang, "Contact Information", "معلومات التواصل")}
        </h2>
        {hasContent(data.fullName) && (
          <p className="rv2-field-line">
            <strong>{l(lang, "Name", "الاسم")}</strong>: {data.fullName}
          </p>
        )}
        {hasContent(data.email) && (
          <p className="rv2-field-line">
            <strong>{l(lang, "Email", "الايميل")}</strong>: {data.email}
          </p>
        )}
        {hasContent(data.phone) && (
          <p className="rv2-field-line">
            <strong>{l(lang, "Phone", "رقم التواصل")}</strong>: {data.phone}
          </p>
        )}
      </section>

      {/* القسم الثاني: التعليم الأكاديمي */}
      {data.education?.some(e => hasContent(e.degree) || hasContent(e.institution)) && (
        <section className="rv2-section">
          <h2 className="rv2-heading">
            {l(lang, "Academic Education", "التعليم الأكاديمي")}
          </h2>
          {data.education.filter(e => hasContent(e.degree) || hasContent(e.institution)).map((edu, i) => (
            <div key={i} className="rv2-block">
              {hasContent(edu.degree) && (
                <p className="rv2-field-line">
                  <strong>{l(lang, "Specialization", "التخصص")}</strong>: {edu.degree}
                </p>
              )}
              {hasContent(edu.institution) && (
                <p className="rv2-field-line">
                  <strong>{l(lang, "University", "الجامعة")}</strong>: {edu.institution}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* القسم الثالث: التعليم المهاري */}
      {(data.courses?.some(c => hasContent(c.name)) || data.certifications?.some(c => hasContent(c.name))) && (
        <section className="rv2-section">
          <h2 className="rv2-heading">
            {l(lang, "Skills Training", "التعليم المهاري")}
          </h2>

          {/* الدورات */}
          {data.courses?.some(c => hasContent(c.name)) && (
            <div className="rv2-block">
              <p className="rv2-sub-title">
                <strong>{l(lang, "Training Courses", "الدورات التدريبية")}</strong>
              </p>
              {data.courses.filter(c => hasContent(c.name)).map((course, i) => (
                <p key={i} className="rv2-list-line">
                  {l(lang, `Course ${i + 1}`, `دورة ${i + 1}`)}: {course.name}
                </p>
              ))}
            </div>
          )}

          {/* الشهادات */}
          {data.certifications?.some(c => hasContent(c.name)) && (
            <div className="rv2-block">
              <p className="rv2-sub-title">
                <strong>{l(lang, "Professional Certifications", "الشهادات المهنية")}</strong>
              </p>
              {data.certifications.filter(c => hasContent(c.name)).map((cert, i) => (
                <p key={i} className="rv2-list-line">
                  {l(lang, `Certificate ${i + 1}`, `شهادة ${i + 1}`)}: {cert.name}
                  {hasContent(cert.issuer) && ` — ${cert.issuer}`}
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      {/* القسم الرابع: الخبرات العملية */}
      {(data.experiences?.some(e => hasContent(e.jobTitle) || hasContent(e.company)) || data.projects?.some(p => hasContent(p.name))) && (
        <section className="rv2-section">
          <h2 className="rv2-heading">
            {l(lang, "Work Experience", "الخبرات العملية")}
          </h2>

          {data.experiences?.filter(e => hasContent(e.jobTitle) || hasContent(e.company)).map((exp, i) => (
            <div key={i} className="rv2-block">
              <p className="rv2-exp-title-line">
                <strong>{exp.jobTitle}</strong>
                {exp.company && ` — ${exp.company}`}
                {exp.startDate && ` / ${exp.startDate}`}
                {exp.endDate && ` - ${exp.endDate}`}
                {exp.current && ` - ${l(lang, "Present", "حتى الآن")}`}
              </p>
              {hasContent(exp.bullets) && (
                <div className="rv2-bullets">
                  {exp.bullets!.split("\n").filter(b => b.trim()).map((bullet, j) => (
                    <p key={j} className="rv2-list-line">• {bullet.trim()}</p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* الإنجازات */}
          {data.projects?.some(p => hasContent(p.name)) && (
            <div className="rv2-block">
              <p className="rv2-sub-title">
                <strong>{l(lang, "Achievements", "أعمال / إنجازات")}</strong>
              </p>
              {data.projects.filter(p => hasContent(p.name)).map((proj, i) => (
                <p key={i} className="rv2-list-line">
                  {l(lang, `${i + 1}.`, `${i + 1}.`)} {proj.name}
                  {hasContent(proj.description) && ` — ${proj.description}`}
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      {/* القسم الخامس: اللغات */}
      {data.languages?.some(lg => hasContent(lg.name)) && (
        <section className="rv2-section">
          <h2 className="rv2-heading">
            {l(lang, "Languages", "اللغات")}
          </h2>
          {data.languages.filter(lg => hasContent(lg.name)).map((lg, i) => (
            <p key={i} className="rv2-field-line">
              <strong>{lg.name}</strong>
              {lg.level && ` — ${lg.level}`}
            </p>
          ))}
        </section>
      )}
    </div>
  );
}
