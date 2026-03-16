import type { ResumeData } from "@/types/resume";

interface Props {
  data: ResumeData;
  lang: 'en' | 'ar';
}

const l = (lang: string, en: string, ar: string) => lang === 'ar' ? ar : en;

// Progress dots component (green circles on a line)
function ProgressDots({ count, max }: { count: number; max: number }) {
  const total = Math.max(max, count, 1);
  return (
    <div className="progress-dots">
      <div className="progress-dots-line" />
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`progress-dot ${i < count ? 'progress-dot-filled' : 'progress-dot-empty'}`}
        />
      ))}
    </div>
  );
}

// Level bar component for languages
function LevelBar({ level }: { level: string }) {
  const levelMap: Record<string, number> = {
    'مبتدئ': 1, 'beginner': 1,
    'متوسط': 2, 'intermediate': 2,
    'جيد': 3, 'good': 3,
    'متقدم': 3, 'advanced': 3,
    'ممتاز': 4, 'fluent': 4, 'native': 4,
    'اللغة الأم': 4, 'mother tongue': 4,
  };
  const val = levelMap[level.toLowerCase()] || 2;
  const max = 4;
  const percent = (val / max) * 100;

  return (
    <div className="level-bar-container">
      <div className="level-bar-track">
        <div className="level-bar-fill" style={{ width: `${percent}%` }} />
        <span className="level-bar-label-start">{val} Level</span>
        <span className="level-bar-label-end">{max} Level</span>
      </div>
    </div>
  );
}

export default function ResumePreview({ data, lang }: Props) {
  const hasContent = (val: string | undefined) => val && val.trim().length > 0;
  const sectionNum = (n: number) => {
    const labels: Record<number, { en: string; ar: string }> = {
      1: { en: "Section One: Contact Information", ar: "القسم الأول : معلومات التواصل" },
      2: { en: "Section Two: Academic Education", ar: "القسم الثاني: التعليم الأكاديمي" },
      3: { en: "Section Three: Skills Training", ar: "القسم الثالث: التعليم المهاري" },
      4: { en: "Section Four: Work Experience", ar: "القسم الرابع: الخبرات العملية" },
      5: { en: "Section Five: Languages", ar: "القسم الخامس: اللغات" },
    };
    return l(lang, labels[n].en, labels[n].ar);
  };

  return (
    <div className="resume-preview resume-seeraty-v2" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* Section 1: Contact Info */}
      <div className="rv2-section">
        <h2 className="rv2-heading">{sectionNum(1)}</h2>
        <div className="rv2-field">
          <span className="rv2-label">{l(lang, "Name", "الاسم")}</span>
          <span className="rv2-colon"> : </span>
          <span className="rv2-value">{data.fullName || "—"}</span>
        </div>
        <div className="rv2-field">
          <span className="rv2-label">{l(lang, "Email", "الايميل")}</span>
          <span className="rv2-colon"> : </span>
          <span className="rv2-value">{data.email || "—"}</span>
        </div>
        <div className="rv2-field">
          <span className="rv2-label">{l(lang, "Phone", "رقم التواصل")}</span>
          <span className="rv2-colon"> : </span>
          <span className="rv2-value">{data.phone || "—"}</span>
        </div>
      </div>

      {/* Section 2: Academic Education */}
      <div className="rv2-section">
        <h2 className="rv2-heading">{sectionNum(2)}</h2>
        {data.education?.length > 0 ? data.education.map((edu, i) => (
          <div key={i}>
            <div className="rv2-field">
              <span className="rv2-label">{l(lang, "Specialization", "التخصص")}</span>
              <span className="rv2-colon"> : </span>
              <span className="rv2-value">{edu.degree || "—"}</span>
            </div>
            <div className="rv2-field">
              <span className="rv2-label">{l(lang, "University", "الجامعة")}</span>
              <span className="rv2-colon"> : </span>
              <span className="rv2-value">{edu.institution || "—"}</span>
            </div>
          </div>
        )) : (
          <div className="rv2-field">
            <span className="rv2-label">{l(lang, "Specialization", "التخصص")}</span>
            <span className="rv2-colon"> : </span>
            <span className="rv2-value">—</span>
          </div>
        )}
      </div>

      {/* Section 3: Skills Training */}
      <div className="rv2-section">
        <h2 className="rv2-heading">{sectionNum(3)}</h2>

        {/* Courses */}
        <div className="rv2-subsection">
          <div className="rv2-sub-header">
            <ProgressDots count={data.certifications?.length || 0} max={4} />
            <span className="rv2-sub-label">{l(lang, "Training Courses :", "الدورات التدريبية :")}</span>
          </div>
          {data.certifications?.length > 0 ? data.certifications.map((cert, i) => (
            <div key={i} className="rv2-list-item">
              <span>{l(lang, `Course ${i + 1}`, `دورة ${i + 1}`)}: {cert.name || "....................."}
              </span>
            </div>
          )) : (
            <>
              <div className="rv2-list-item">{l(lang, "Course 1", "دورة 1")}: .....................</div>
              <div className="rv2-list-item">{l(lang, "Course 2", "دورة 2")}: .....................</div>
            </>
          )}
        </div>

        <div className="rv2-divider" />

        {/* Professional Certifications */}
        <div className="rv2-subsection">
          <div className="rv2-sub-header">
            <ProgressDots count={data.certifications?.filter(c => c.issuer).length || 0} max={3} />
            <span className="rv2-sub-label">{l(lang, "Professional Certifications :", "الشهادات المهنية :")}</span>
          </div>
          {hasContent(data.skills) ? (
            data.skills!.split(/[,،\n]/).filter(s => s.trim()).map((skill, i) => (
              <div key={i} className="rv2-list-item">
                {l(lang, `Certificate ${i + 1}`, `شهادة ${i + 1}`)}: {skill.trim()}
              </div>
            ))
          ) : (
            <>
              <div className="rv2-list-item">{l(lang, "Certificate 1", "شهادة 1")}: .....................</div>
              <div className="rv2-list-item">{l(lang, "Certificate 2", "شهادة 2")}: .....................</div>
            </>
          )}
        </div>
      </div>

      {/* Section 4: Work Experience */}
      <div className="rv2-section">
        <h2 className="rv2-heading">{sectionNum(4)}</h2>

        {/* Volunteer Work / Experience */}
        {data.experiences?.length > 0 ? data.experiences.map((exp, i) => (
          <div key={i} className="rv2-experience-block">
            <div className="rv2-exp-header">
              <span className="rv2-exp-title">{exp.jobTitle || l(lang, "Job Title", "المسمى الوظيفي")}</span>
              {exp.company && <span className="rv2-exp-org"> {exp.company}{exp.startDate ? ` / ${exp.startDate}` : ""}</span>}
            </div>
            {hasContent(exp.bullets) && (
              <div className="rv2-exp-tasks">
                {exp.bullets!.split("\n").filter(b => b.trim()).map((bullet, j) => (
                  <div key={j} className="rv2-list-item">{bullet.trim()}</div>
                ))}
              </div>
            )}
          </div>
        )) : (
          <div className="rv2-exp-placeholder">
            <div className="rv2-list-item">{l(lang, "Job Title", "المسمى الوظيفي")}: .....................</div>
          </div>
        )}

        <div className="rv2-divider" />

        {/* Achievements / Projects */}
        <div className="rv2-subsection">
          <div className="rv2-sub-header">
            <ProgressDots count={data.projects?.length || 0} max={3} />
            <span className="rv2-sub-label">{l(lang, "Works / Achievements:", "أعمال / إنجازات:")}</span>
          </div>
          {data.projects?.length > 0 ? data.projects.map((proj, i) => (
            <div key={i} className="rv2-list-item">
              {l(lang, `Work ${i + 1}`, `عمل ${i + 1}`)} : {proj.name}{proj.description ? ` — ${proj.description}` : ""}
            </div>
          )) : (
            <>
              <div className="rv2-list-item">{l(lang, "Work 1", "عمل 1")} : .....................</div>
              <div className="rv2-list-item">{l(lang, "Work 2", "عمل 2")} : .....................</div>
            </>
          )}
        </div>
      </div>

      {/* Section 5: Languages */}
      <div className="rv2-section">
        <h2 className="rv2-heading">{sectionNum(5)}</h2>
        {data.languages?.length > 0 ? data.languages.filter(lg => lg.name).map((lg, i) => (
          <div key={i} className="rv2-lang-item">
            <div className="rv2-field">
              <span className="rv2-label">{i === 0 ? l(lang, "Mother Tongue", "اللغة الأم") : lg.name}</span>
              <span className="rv2-colon"> : </span>
              <span className="rv2-value">{i === 0 ? lg.name : ""}</span>
            </div>
            {i > 0 && lg.level && <LevelBar level={lg.level} />}
          </div>
        )) : (
          <div className="rv2-field">
            <span className="rv2-label">{l(lang, "Mother Tongue", "اللغة الأم")}</span>
            <span className="rv2-colon"> : </span>
            <span className="rv2-value">—</span>
          </div>
        )}
      </div>
    </div>
  );
}
