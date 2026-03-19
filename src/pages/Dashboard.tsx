import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Target, TrendingUp, AlertCircle,
  Sparkles, GraduationCap, Wrench, Lightbulb,
  Globe, Award, FolderOpen, User, CalendarCheck,
  ChevronLeft, CheckCircle2, ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { computeSectionProgress, computeWeightedOverall, computeYearSegments, type SectionProgress, type YearSegment } from "@/lib/careerTargets";
import type { ResumeData } from "@/types/resume";
import { defaultResumeData } from "@/types/resume";

const STORAGE_KEY = "ats-resume-data";
const TARGETS_KEY = "seeraty-targets";

/* ── Radial gauge ─────────────────────────────────── */
function RadialGauge({ percent, size = 120, stroke = 10, color, trackColor = "hsl(var(--muted))" }: {
  percent: number; size?: number; stroke?: number; color: string; trackColor?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out" />
    </svg>
  );
}

/* ── Section icon map ────────────────────────────── */
const sectionIcons: Record<string, React.ReactNode> = {
  personal: <User className="h-4 w-4" />,
  summary: <Sparkles className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  experience: <TrendingUp className="h-4 w-4" />,
  skills: <Wrench className="h-4 w-4" />,
  projects: <FolderOpen className="h-4 w-4" />,
  languages: <Globe className="h-4 w-4" />,
  certifications: <Award className="h-4 w-4" />,
};

function getColor(pct: number) {
  if (pct >= 70) return "hsl(142 72% 42%)";
  if (pct >= 40) return "hsl(38 92% 50%)";
  return "hsl(var(--destructive))";
}

function getStatus(pct: number) {
  if (pct >= 90) return { label: "ممتاز", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
  if (pct >= 70) return { label: "قوي", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
  if (pct >= 40) return { label: "متوسط", class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
  return { label: "ضعيف", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
}

/* ── Section card ─────────────────────────────────── */
function SectionCard({ sec }: { sec: SectionProgress }) {
  const pct = sec.percent;
  const status = getStatus(pct);
  const metCount = sec.targets.filter(t => t.met).length;
  const totalCount = sec.targets.length;

  return (
    <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
      <div className="relative shrink-0">
        <RadialGauge percent={pct} size={56} stroke={5} color={getColor(pct)} />
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-foreground">
          {pct}%
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-muted-foreground">{sectionIcons[sec.sectionKey]}</span>
          <span className="font-semibold text-sm truncate">{sec.labelAr}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", status.class)}>
            {status.label}
          </span>
          <span className="text-[10px] text-muted-foreground">{metCount}/{totalCount} مستهدف</span>
        </div>
      </div>
    </Card>
  );
}

/* ── Year progress card ───────────────────────────── */
function YearProgressCard({ yearCurrent, yearTotal, sections, persona }: {
  yearCurrent: number; yearTotal: number; sections: SectionProgress[]; persona: any;
}) {
  const yearData = useMemo(() => {
    const resumeData = getResumeData();
    if (!resumeData) return [];
    const result: { year: number; percent: number }[] = [];
    for (let y = 1; y <= yearTotal; y++) {
      const yearPersona = { ...persona, yearCurrent: y };
      const yearSections = computeSectionProgress(resumeData, yearPersona);
      const overall = computeWeightedOverall(yearSections, yearPersona);
      result.push({ year: y, percent: overall });
    }
    return result;
  }, [yearTotal, persona]);

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <CalendarCheck className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-sm">جاهزية السيرة حسب السنة</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {yearData.map((yd) => {
          const isCurrent = yd.year === yearCurrent;
          return (
            <div
              key={yd.year}
              className={cn(
                "rounded-xl p-3 text-center transition-all",
                isCurrent
                  ? "bg-primary/10 border-2 border-primary ring-2 ring-primary/20"
                  : "bg-muted/40 border border-border"
              )}
            >
              <p className={cn("text-[10px] font-medium mb-1", isCurrent ? "text-primary" : "text-muted-foreground")}>
                السنة {yd.year}
              </p>
              <div className="relative mx-auto w-fit">
                <RadialGauge
                  percent={yd.percent}
                  size={48}
                  stroke={4}
                  color={isCurrent ? "hsl(var(--primary))" : getColor(yd.percent)}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                  {yd.percent}%
                </span>
              </div>
              {isCurrent && (
                <p className="text-[9px] text-primary font-bold mt-1">أنت هنا</p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ── Targets summary card ─────────────────────────── */
function TargetsSummaryCard({ sections }: { sections: SectionProgress[] }) {
  const allTargets = sections.flatMap(s => s.targets);
  const required = allTargets.filter(t => t.category === "required");
  const recommended = allTargets.filter(t => t.category === "recommended");
  const bonus = allTargets.filter(t => t.category === "bonus");

  const reqMet = required.filter(t => t.met).length;
  const recMet = recommended.filter(t => t.met).length;
  const bonMet = bonus.filter(t => t.met).length;

  const categories = [
    { label: "مطلوب", met: reqMet, total: required.length, color: "hsl(var(--destructive))", activeColor: "hsl(142 72% 42%)" },
    { label: "موصى به", met: recMet, total: recommended.length, color: "hsl(38 92% 50%)", activeColor: "hsl(142 72% 42%)" },
    { label: "إضافي", met: bonMet, total: bonus.length, color: "hsl(var(--muted-foreground))", activeColor: "hsl(142 72% 42%)" },
  ];

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-sm">اكتمال المستهدفات</h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((cat) => {
          const pct = cat.total > 0 ? Math.round((cat.met / cat.total) * 100) : 0;
          return (
            <div key={cat.label} className="text-center">
              <div className="relative mx-auto w-fit mb-2">
                <RadialGauge
                  percent={pct}
                  size={56}
                  stroke={5}
                  color={pct >= 70 ? cat.activeColor : cat.color}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                  {pct}%
                </span>
              </div>
              <p className="text-xs font-medium">{cat.label}</p>
              <p className="text-[10px] text-muted-foreground">{cat.met}/{cat.total}</p>
            </div>
          );
        })}
      </div>
      {/* Unmet required targets */}
      {required.filter(t => !t.met).length > 0 && (
        <div className="space-y-1.5 pt-2 border-t">
          <p className="text-[10px] font-medium text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            مستهدفات مطلوبة لم تُكمل:
          </p>
          {required.filter(t => !t.met).slice(0, 4).map((t, i) => (
            <p key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5 ps-4">
              <span className="text-destructive mt-0.5">•</span>
              {t.requirementAr}
            </p>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── Helper ────────────────────────────────────────── */
function getResumeData(): ResumeData | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultResumeData, ...JSON.parse(saved) };
  } catch {}
  return null;
}

function getTargetsData() {
  try {
    const saved = localStorage.getItem(TARGETS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

/* ── Main Dashboard ───────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { overallScore, sections, targets, resumeData, persona } = useMemo(() => {
    const resumeData = getResumeData();
    const targets = getTargetsData();

    if (!resumeData || !targets) {
      return { overallScore: 0, sections: [] as SectionProgress[], targets, resumeData, persona: null };
    }

    const persona = {
      stage: targets.stage || "student",
      industry: targets.industry || "other",
      goal: targets.goal || "part-time",
      yearCurrent: targets.yearCurrent || 1,
      yearTotal: targets.yearTotal || 4,
    };

    const secs = computeSectionProgress(resumeData, persona);
    const overall = computeWeightedOverall(secs, persona);

    return { overallScore: overall, sections: secs, targets, resumeData, persona };
  }, []);

  const overallColor = getColor(overallScore);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground">
          مرحباً {user?.email?.split("@")[0]} — ملخص سيرتك الذاتية
        </p>
      </div>

      {!resumeData || !persona ? (
        <Card className="p-8 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-lg font-semibold">لم تبدأ بعد!</h2>
          <p className="text-muted-foreground">ابدأ ببناء سيرتك الذاتية للحصول على تحليل شامل</p>
          <Button onClick={() => navigate("/builder")} className="gap-2">
            <FileText className="h-4 w-4" />
            ابدأ بناء السيرة
          </Button>
        </Card>
      ) : (
        <>
          {/* Hero: Overall + Year readiness side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Overall Score */}
            <Card className="p-6 flex flex-col items-center gap-3 bg-gradient-to-br from-card to-secondary/30 lg:col-span-1">
              <p className="text-xs font-medium text-muted-foreground">النتيجة الإجمالية</p>
              <div className="relative">
                <RadialGauge percent={overallScore} size={140} stroke={12} color={overallColor} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{overallScore}%</span>
                  <span className={cn("text-[10px] font-medium", getStatus(overallScore).class, "rounded-full px-2 py-0.5 mt-1")}>
                    {getStatus(overallScore).label}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground text-center max-w-[200px]">
                {overallScore >= 70 ? "سيرتك قوية! أضف تفاصيل إضافية للتميز" :
                 overallScore >= 40 ? "جيد، لكن هناك مجال للتحسين" :
                 "سيرتك تحتاج مزيداً من المحتوى"}
              </p>
              <Button size="sm" onClick={() => navigate("/builder")} className="gap-1.5 mt-1">
                <FileText className="h-3.5 w-3.5" />
                تعديل السيرة
              </Button>
            </Card>

            {/* Right column: year + targets */}
            <div className="lg:col-span-2 space-y-4">
              {persona.yearTotal > 1 && (
                <YearProgressCard
                  yearCurrent={persona.yearCurrent}
                  yearTotal={persona.yearTotal}
                  sections={sections}
                  persona={persona}
                />
              )}
              <TargetsSummaryCard sections={sections} />
            </div>
          </div>

          {/* Section-by-section cards */}
          <div>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              اكتمال كل قسم
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sections.map((sec) => (
                <SectionCard key={sec.sectionKey} sec={sec} />
              ))}
            </div>
          </div>

          {/* Smart Tips */}
          {(() => {
            const weakSections = [...sections]
              .filter(s => s.percent < 80)
              .sort((a, b) => a.percent - b.percent)
              .slice(0, 3);

            if (weakSections.length === 0) return null;

            return (
              <Card className="p-5 space-y-3 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  نصائح ذكية لتحسين سيرتك
                </h2>
                <div className="space-y-2">
                  {weakSections.map((sec) => {
                    const unmetTip = sec.targets.find(t => !t.met);
                    if (!unmetTip) return null;
                    return (
                      <div key={sec.sectionKey} className="flex items-start gap-3 p-3 rounded-lg bg-card/60 border border-border/50">
                        <span className="mt-0.5 text-primary shrink-0">{sectionIcons[sec.sectionKey]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-primary">{sec.labelAr}</span>
                            <span className="text-[10px] text-muted-foreground">{sec.percent}%</span>
                          </div>
                          <p className="text-[11px] text-foreground mt-0.5">{unmetTip.tipAr}</p>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      </div>
                    );
                  })}
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/builder")} className="gap-2 w-full sm:w-auto">
                  <FileText className="h-3.5 w-3.5" />
                  تعديل السيرة الآن
                </Button>
              </Card>
            );
          })()}

          {/* Career targets info */}
          {targets && (
            <Card className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">المستهدفات المهنية</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {targets.stage && <span className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5">{targets.stage}</span>}
                    {targets.industry && <span className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5">{targets.industry}</span>}
                    {targets.goal && <span className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5">{targets.goal}</span>}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/targets")} className="gap-1 shrink-0">
                <ChevronLeft className="h-4 w-4" />
                عرض
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
