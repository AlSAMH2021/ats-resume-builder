const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "will", "would", "could", "should", "may", "might", "can",
  "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they",
  "my", "your", "his", "her", "its", "our", "their", "what", "which", "who",
  "from", "as", "not", "all", "each", "every", "both", "few", "more", "most",
  "other", "some", "such", "no", "nor", "too", "very", "just", "about", "above",
  "after", "again", "also", "any", "because", "before", "between", "into", "through",
  "during", "if", "then", "than", "so", "up", "out", "over", "under", "own",
  "same", "how", "when", "where", "why", "while", "within", "without",
  "و", "في", "من", "على", "إلى", "أن", "هو", "هي", "هذا", "هذه", "التي", "الذي",
  "عن", "مع", "أو", "كل", "ذلك", "تلك", "ما", "لا", "بين", "حتى", "بعد", "قبل",
]);

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sأ-ي]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

export function extractKeywords(jobDescription: string): { word: string; count: number }[] {
  const words = extractWords(jobDescription);
  const freq: Record<string, number> = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  
  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .filter(k => k.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

export function calculateATSMatch(resumeText: string, jobDescription: string): {
  score: number;
  matched: string[];
  missing: string[];
} {
  const keywords = extractKeywords(jobDescription);
  if (keywords.length === 0) return { score: 0, matched: [], missing: [] };
  
  const resumeWords = new Set(extractWords(resumeText));
  const matched: string[] = [];
  const missing: string[] = [];
  
  keywords.forEach(({ word }) => {
    if (resumeWords.has(word)) {
      matched.push(word);
    } else {
      missing.push(word);
    }
  });
  
  const score = Math.round((matched.length / keywords.length) * 100);
  return { score, matched, missing };
}

export function resumeToPlainText(data: any, lang: 'en' | 'ar'): string {
  const lines: string[] = [];
  
  if (data.fullName) lines.push(data.fullName);
  if (data.jobTitle) lines.push(data.jobTitle);
  
  const contact = [data.location, data.phone, data.email, data.linkedin, data.website]
    .filter(Boolean).join(" | ");
  if (contact) lines.push(contact);
  
  if (data.summary) {
    lines.push("", lang === 'ar' ? "الملخص المهني" : "PROFESSIONAL SUMMARY", data.summary);
  }
  
  if (data.experiences?.length) {
    lines.push("", lang === 'ar' ? "الخبرات" : "EXPERIENCE");
    data.experiences.forEach((exp: any) => {
      lines.push(`${exp.jobTitle || ""} - ${exp.company || ""}`);
      if (exp.location) lines.push(exp.location);
      const dates = `${exp.startDate || ""} - ${exp.current ? (lang === 'ar' ? 'حتى الآن' : 'Present') : exp.endDate || ""}`;
      if (dates.trim() !== "-") lines.push(dates);
      if (exp.bullets) {
        exp.bullets.split("\n").filter(Boolean).forEach((b: string) => lines.push(`• ${b.trim()}`));
      }
      lines.push("");
    });
  }
  
  if (data.education?.length) {
    lines.push(lang === 'ar' ? "التعليم" : "EDUCATION");
    data.education.forEach((edu: any) => {
      lines.push(`${edu.degree || ""} - ${edu.institution || ""}`);
      if (edu.location) lines.push(edu.location);
      const dates = `${edu.startDate || ""} - ${edu.endDate || ""}`;
      if (dates.trim() !== "-") lines.push(dates);
      if (edu.description) lines.push(edu.description);
      lines.push("");
    });
  }
  
  if (data.certifications?.length) {
    lines.push(lang === 'ar' ? "الشهادات" : "CERTIFICATIONS");
    data.certifications.forEach((c: any) => {
      lines.push(`${c.name || ""} - ${c.issuer || ""} (${c.date || ""})`);
    });
    lines.push("");
  }
  
  if (data.skills) {
    lines.push(lang === 'ar' ? "المهارات" : "SKILLS", data.skills, "");
  }
  
  if (data.languages?.length) {
    lines.push(lang === 'ar' ? "اللغات" : "LANGUAGES");
    data.languages.forEach((l: any) => lines.push(`${l.name || ""} - ${l.level || ""}`));
    lines.push("");
  }
  
  if (data.projects?.length) {
    lines.push(lang === 'ar' ? "المشاريع" : "PROJECTS");
    data.projects.forEach((p: any) => {
      lines.push(p.name || "");
      if (p.description) lines.push(p.description);
      if (p.url) lines.push(p.url);
      lines.push("");
    });
  }
  
  return lines.join("\n");
}
