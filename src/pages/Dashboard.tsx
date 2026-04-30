import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Target, TrendingUp, AlertCircle,
  Sparkles, GraduationCap, Wrench, Lightbulb,
  Globe, Award, FolderOpen, User, CalendarCheck,
  CheckCircle2, ArrowUpRight, ChevronDown, ChevronUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  computeSectionProgress,
  computeWeightedOverall,
  getNextPrioritySection,
  type SectionProgress,
} from "@/lib/careerTargets";
import type { ResumeData } from "@/types/resume";
import { defaultResumeData } from "@/types/resume";
import { useUserData } from "@/hooks/useUserData";

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

/* ── Main Dashboard ───────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showUnmet, setShowUnmet] = useState(false);
  const { loading, resume: cloudResume, targets: cloudTargets } = useUserData();

  const { overallScore, sections, targets, resumeData, persona } = useMemo(() => {
    const resumeData: ResumeData | null = cloudResume ? { ...defaultResumeData, ...cloudResume } : null;
    const targets = cloudTargets;

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
  }, [cloudResume, cloudTargets]);

  const overallColor = getColor(overallScore);

  // Compute target counts
  const allTargets = sections.flatMap(s => s.targets);
  const required = allTargets.filter(t => t.category === "required");
  const recommended = allTargets.filter(t => t.category === "recommended");
  const bonus = allTargets.filter(t => t.category === "bonus");
  const metRequired = required.filter(t => t.met).length;
  const metRecommended = recommended.filter(t => t.met).length;
  const metBonus = bonus.filter(t => t.met).length;

  // Next priority section
  const nextSection = persona
    ? getNextPrioritySection(sections, persona.stage, persona.goal)
    : null;

  // Year data
  const yearData = useMemo(() => {
    if (!persona || persona.yearTotal <= 1 || !resumeData) return [];
    const result: { year: number; percent: number }[] = [];
    for (let y = 1; y <= persona.yearTotal; y++) {
      const yPersona = { ...persona, yearCurrent: y };
      const ySections = computeSectionProgress(resumeData, yPersona);
      const overall = computeWeightedOverall(ySections, yPersona);
      result.push({ year: y, percent: overall });
    }
    return result;
  }, [persona, resumeData]);

  // Weak sections for tips
  const weakSections = [...sections]
    .filter(s => s.percent < 80)
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 3);

  const unmetRequired = required.filter(t => !t.met);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]" dir="rtl">
        <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6" dir="rtl">
      {/* ─── 1. PAGE HEADER ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground">
            مرحباً {user?.email?.split("@")[0]} 👋
          </p>
        </div>
        <Button size="sm" onClick={() => navigate("/builder")} className="gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          تعديل السيرة
        </Button>
      </div>

      {!resumeData || !persona ? (
        /* ─── EMPTY STATE ─── */
        <Card className="p-10 text-center space-y-5">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold">لم تبدأ بعد!</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• تحليل شامل لكل أقسام سيرتك الذاتية</li>
            <li>• نصائح ذكية مخصصة لمجالك وسنتك الدراسية</li>
          </ul>
          <Button onClick={() => navigate("/builder")} className="gap-2" size="lg">
            <FileText className="h-4 w-4" />
            ابدأ بناء سيرتك الآن
          </Button>
        </Card>
      ) : (
        <>
          {/* ─── 2. HERO BANNER ─── */}
          <Card className="p-6 bg-gradient-to-l from-primary/10 to-transparent">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Gauge */}
              <div className="relative shrink-0">
                <RadialGauge percent={overallScore} size={160} stroke={14} color={overallColor} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{overallScore}%</span>
                  <span className={cn("text-[10px] font-medium rounded-full px-2 py-0.5 mt-1", getStatus(overallScore).class)}>
                    {getStatus(overallScore).label}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3 text-center sm:text-start">
                <h2 className="text-lg font-bold text-foreground">جاهزية سيرتك الذاتية</h2>
                <p className="text-sm text-muted-foreground">
                  {overallScore >= 80 ? "سيرتك قوية جداً! أنت جاهز للتقديم." :
                   overallScore >= 60 ? "سيرتك جيدة، بعض التحسينات ستجعلها أقوى." :
                   overallScore >= 40 ? "سيرتك في المنتصف، ركّز على الأقسام الضعيفة." :
                   "سيرتك تحتاج عملاً. ابدأ بالأقسام المطلوبة أولاً."}
                </p>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${overallScore}%`,
                      backgroundColor: overallColor,
                    }}
                  />
                </div>

                {/* Stat chips */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="text-[11px] bg-muted/50 rounded-full px-3 py-1">✅ {metRequired} من {required.length} مطلوب</span>
                  <span className="text-[11px] bg-muted/50 rounded-full px-3 py-1">⭐ {metRecommended} من {recommended.length} موصى به</span>
                  <span className="text-[11px] bg-muted/50 rounded-full px-3 py-1">🎯 {metBonus} من {bonus.length} إضافي</span>
                </div>
              </div>
            </div>
          </Card>

          {/* ─── 3. NEXT ACTION CARD ─── */}
          {nextSection ? (
            <Card className="p-4 border-primary bg-primary/5 flex items-center gap-4">
              <div className="shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {sectionIcons[nextSection.sectionKey] || <Target className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">الخطوة التالية الأهم</p>
                <p className="font-semibold text-sm">{nextSection.labelAr}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {nextSection.targets.find(t => !t.met)?.tipAr}
                </p>
              </div>
              <Button size="sm" onClick={() => navigate("/builder")} className="shrink-0 gap-1">
                أضف الآن ←
              </Button>
            </Card>
          ) : sections.length > 0 ? (
            <Card className="p-4 border-green-500 bg-green-50 dark:bg-green-900/20 text-center">
              <p className="font-semibold text-green-700 dark:text-green-400">🎉 سيرتك مكتملة! أنت جاهز للتقديم.</p>
            </Card>
          ) : null}

          {/* ─── 4. SECTION PROGRESS GRID ─── */}
          <div>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              اكتمال كل قسم
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {sections.map((sec) => {
                const pct = sec.percent;
                const status = getStatus(pct);
                const metCount = sec.targets.filter(t => t.met).length;
                const totalCount = sec.targets.length;
                const hasUnmetRequired = sec.targets.some(t => !t.met && t.category === "required");

                return (
                  <Card
                    key={sec.sectionKey}
                    onClick={() => navigate("/builder")}
                    className="p-4 relative cursor-pointer hover:shadow-md hover:border-primary/40 transition-all space-y-2"
                  >
                    {hasUnmetRequired && (
                      <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-destructive" />
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{sectionIcons[sec.sectionKey]}</span>
                      <span className="font-semibold text-sm truncate">{sec.labelAr}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: getColor(pct) }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold" style={{ color: getColor(pct) }}>{pct}%</span>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", status.class)}>
                          {status.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{metCount}/{totalCount}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* ─── 5. YEAR READINESS ROW ─── */}
          {persona.yearTotal > 1 && yearData.length > 0 && (
            <div>
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-primary" />
                جاهزية السيرة حسب السنة
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {yearData.map((yd) => {
                  const isCurrent = yd.year === persona.yearCurrent;
                  const isPast = yd.year < persona.yearCurrent;
                  return (
                    <Card
                      key={yd.year}
                      className={cn(
                        "min-w-[100px] p-3 text-center shrink-0 transition-all",
                        isCurrent && "border-primary ring-2 ring-primary/20",
                        isPast && "border-green-400 dark:border-green-600"
                      )}
                    >
                      <p className={cn("text-[10px] font-medium mb-1", isCurrent ? "text-primary" : "text-muted-foreground")}>
                        السنة {yd.year}
                      </p>
                      <div className="relative mx-auto w-fit">
                        <RadialGauge
                          percent={yd.percent}
                          size={52}
                          stroke={4}
                          color={isCurrent ? "hsl(var(--primary))" : getColor(yd.percent)}
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          {isPast ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <span className="text-[10px] font-bold">{yd.percent}%</span>
                          )}
                        </span>
                      </div>
                      {isCurrent && (
                        <p className="text-[9px] text-primary font-bold mt-1">أنت هنا</p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── 6. TARGETS SUMMARY ─── */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-sm">اكتمال المستهدفات</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "مطلوب", met: metRequired, total: required.length, color: "hsl(var(--destructive))", activeColor: "hsl(142 72% 42%)" },
                { label: "موصى به", met: metRecommended, total: recommended.length, color: "hsl(38 92% 50%)", activeColor: "hsl(142 72% 42%)" },
                { label: "إضافي", met: metBonus, total: bonus.length, color: "hsl(var(--muted-foreground))", activeColor: "hsl(142 72% 42%)" },
              ].map((cat) => {
                const pct = cat.total > 0 ? Math.round((cat.met / cat.total) * 100) : 0;
                return (
                  <div key={cat.label} className="text-center">
                    <div className="relative mx-auto w-fit mb-2">
                      <RadialGauge size={52} stroke={4} percent={pct} color={pct >= 70 ? cat.activeColor : cat.color} />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{pct}%</span>
                    </div>
                    <p className="text-xs font-medium">{cat.label}</p>
                    <p className="text-[10px] text-muted-foreground">{cat.met}/{cat.total}</p>
                  </div>
                );
              })}
            </div>

            {unmetRequired.length > 0 && (
              <div className="pt-2 border-t space-y-2">
                <button
                  onClick={() => setShowUnmet(!showUnmet)}
                  className="text-[11px] text-destructive font-medium flex items-center gap-1 hover:underline"
                >
                  {showUnmet ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {showUnmet ? "إخفاء" : "عرض المستهدفات الناقصة"}
                </button>
                {showUnmet && (
                  <div className="space-y-1 bg-destructive/5 rounded-lg p-3">
                    {unmetRequired.slice(0, 4).map((t, i) => (
                      <p key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                        <span className="text-destructive mt-0.5">•</span>
                        {t.requirementAr}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* ─── 7. SMART TIPS ─── */}
          {weakSections.length > 0 && (
            <Card className="p-5 space-y-3 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                نصائح لتحسين سيرتك
              </h2>
              <div className="space-y-2">
                {weakSections.map((sec) => {
                  const unmetTip = sec.targets.find(t => !t.met);
                  if (!unmetTip) return null;
                  return (
                    <div
                      key={sec.sectionKey}
                      onClick={() => navigate("/builder")}
                      className="flex items-start gap-3 p-3 rounded-lg bg-card/60 border border-border/50 cursor-pointer hover:bg-card transition-colors"
                    >
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
          )}

          {/* ─── 8. CAREER PROFILE FOOTER ─── */}
          {targets && (
            <Card className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">ملفك المهني</span>
                  <div className="flex flex-wrap gap-1.5">
                    {targets.stage && <Badge variant="secondary" className="text-[10px]">{targets.stage}</Badge>}
                    {targets.industry && <Badge variant="secondary" className="text-[10px]">{targets.industry}</Badge>}
                    {targets.goal && <Badge variant="secondary" className="text-[10px]">{targets.goal}</Badge>}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/targets")} className="gap-1 shrink-0">
                عرض المستهدفات ←
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
