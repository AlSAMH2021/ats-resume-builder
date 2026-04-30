import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target, Sparkles, RefreshCw, ArrowLeft,
  CheckCircle2, GraduationCap, ChevronLeft, ChevronRight,
  Circle, Route,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { generateYearPlans, type YearPlan } from "@/lib/yearMilestones";
import { computeSectionProgress, computeWeightedOverall } from "@/lib/careerTargets";
import type { ResumeData } from "@/types/resume";
import { defaultResumeData } from "@/types/resume";
import { useUserData } from "@/hooks/useUserData";

interface TargetsData {
  stage: string;
  industry: string;
  goal: string;
  yearCurrent: number;
  yearTotal: number;
  language?: string;
}

const industryLabels: Record<string, string> = {
  tech: "تقنية المعلومات", business: "إدارة الأعمال",
  engineering: "هندسة", healthcare: "صحة",
  creative: "إبداعي", law: "قانون",
  education: "تعليم", other: "عام",
};
const goalLabels: Record<string, string> = {
  volunteering: "تطوع", internship: "تدريب",
  "part-time": "دوام جزئي", "full-time": "دوام كامل",
};
const stageLabels: Record<string, string> = {
  freshman: "مستجد", student: "طالب", graduate: "خريج",
};

const categoryOrder = ["skills", "certifications", "projects", "experience", "languages", "personal"];
const categoryGroupHeaders: Record<string, string> = {
  skills: "⚡ المهارات",
  certifications: "📜 الشهادات والدورات",
  projects: "🛠️ المشاريع",
  experience: "💼 الخبرة العملية",
  languages: "🌐 اللغات",
  personal: "🔗 الحضور الرقمي",
};

function getColor(pct: number) {
  if (pct >= 70) return "hsl(142 72% 42%)";
  if (pct >= 40) return "hsl(38 92% 50%)";
  return "hsl(var(--destructive))";
}

/* ── Radial gauge (same as Dashboard) ── */
function RadialGauge({ percent, size = 64, stroke = 6, color, trackColor = "hsl(var(--muted))" }: {
  percent: number; size?: number; stroke?: number; color: string; trackColor?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-700 ease-out" />
    </svg>
  );
}

/* ── Timeline node ── */
function TimelineNode({ year, label, yearLabel, isCurrent, isPast, isSelected, onClick }: {
  year: number; label: string; yearLabel: string; isCurrent: boolean; isPast: boolean; isSelected: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group relative">
      {isCurrent && (
        <Badge variant="default" className="absolute -top-4 text-[9px] px-1.5 py-0 z-10">
          أنت هنا
        </Badge>
      )}
      <div className="relative">
        {isCurrent && !isSelected && (
          <span className="absolute inset-0 rounded-full border-2 border-primary animate-pulse scale-125" />
        )}
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 relative z-[1]",
          isSelected
            ? "scale-110 shadow-lg shadow-primary/30 border-primary bg-primary text-primary-foreground"
            : isPast
              ? "border-green-500 bg-green-500 text-white"
              : isCurrent
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30 bg-muted/50 text-muted-foreground"
        )}>
          {isPast && !isSelected ? <CheckCircle2 className="w-5 h-5" /> : <span>{year}</span>}
        </div>
      </div>
      <span className={cn(
        "text-xs font-medium whitespace-nowrap",
        isSelected || isCurrent ? "text-primary" : isPast ? "text-green-600" : "text-muted-foreground"
      )}>
        {label}
      </span>
      <span className="text-[10px] text-muted-foreground">{yearLabel}</span>
    </button>
  );
}

/* ── Milestone card ── */
function MilestoneCard({ icon, label, category, checked }: {
  icon: string; label: string; category: string; checked: boolean;
}) {
  const catColors: Record<string, string> = {
    skills: "bg-blue-500/10 border-blue-500/20",
    projects: "bg-purple-500/10 border-purple-500/20",
    experience: "bg-amber-500/10 border-amber-500/20",
    certifications: "bg-emerald-500/10 border-emerald-500/20",
    languages: "bg-cyan-500/10 border-cyan-500/20",
    personal: "bg-rose-500/10 border-rose-500/20",
  };
  const catBadgeColors: Record<string, string> = {
    skills: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    projects: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    experience: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    certifications: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    languages: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    personal: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  };
  const catLabels: Record<string, string> = {
    skills: "مهارات", projects: "مشاريع", experience: "خبرات",
    certifications: "شهادات", languages: "لغات", personal: "شخصي",
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm",
      catColors[category] ?? "bg-muted/50 border-border"
    )}>
      <span className="text-2xl w-10 text-center shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <span className={cn("text-[10px] rounded-full px-2 py-0.5 inline-block mt-1", catBadgeColors[category] ?? "bg-muted text-muted-foreground")}>
          {catLabels[category] ?? category}
        </span>
      </div>
      {checked ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
      )}
    </div>
  );
}

/* ── Main ── */
const Targets = () => {
  const navigate = useNavigate();

  const targets: TargetsData | null = useMemo(() => {
    try {
      const saved = localStorage.getItem(TARGETS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  }, []);

  const yearPlans = useMemo(() => {
    if (!targets) return [];
    return generateYearPlans(targets.yearTotal || 4, targets.industry || "other");
  }, [targets]);

  const [selectedYear, setSelectedYear] = useState(() => targets?.yearCurrent ?? 1);
  const selectedPlan: YearPlan | undefined = yearPlans.find(p => p.year === selectedYear);

  const resumeData = useMemo(() => getResumeData(), []);

  const persona = useMemo(() => {
    if (!targets) return null;
    return {
      stage: targets.stage || "student",
      industry: targets.industry || "other",
      goal: targets.goal || "part-time",
      yearCurrent: targets.yearCurrent || 1,
      yearTotal: targets.yearTotal || 4,
    };
  }, [targets]);

  // Overall score
  const overallScore = useMemo(() => {
    if (!resumeData || !persona) return null;
    const secs = computeSectionProgress(resumeData, persona);
    return computeWeightedOverall(secs, persona);
  }, [resumeData, persona]);

  // Selected year score
  const yearScore = useMemo(() => {
    if (!resumeData || !persona) return null;
    const yearPersona = { ...persona, yearCurrent: selectedYear };
    const yearSections = computeSectionProgress(resumeData, yearPersona);
    return computeWeightedOverall(yearSections, yearPersona);
  }, [resumeData, persona, selectedYear]);

  // Section readiness for milestone checks
  const yearSectionMap = useMemo(() => {
    if (!resumeData || !persona) return null;
    const yearPersona = { ...persona, yearCurrent: selectedYear };
    const secs = computeSectionProgress(resumeData, yearPersona);
    const map: Record<string, number> = {};
    secs.forEach(s => { map[s.sectionKey] = s.percent; });
    return map;
  }, [resumeData, persona, selectedYear]);

  const handleResetTargets = useCallback(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(ONBOARDING_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    localStorage.removeItem(TARGETS_KEY);
    toast.success("تم إعادة تعيين المستهدفات — سيظهر الاستبيان الآن");
    window.location.href = "/builder";
  }, [navigate]);

  // Map milestone category to section key for checking
  const catToSection: Record<string, string> = {
    skills: "skills", projects: "projects", experience: "experience",
    certifications: "certifications", languages: "languages", personal: "personal",
  };

  function isMilestoneChecked(category: string): boolean {
    if (!yearSectionMap) return false;
    const secKey = catToSection[category];
    if (!secKey) return false;
    return (yearSectionMap[secKey] ?? 0) >= 70;
  }

  // Group milestones by category
  function groupedMilestones(milestones: YearPlan["milestones"]) {
    const groups: { category: string; items: typeof milestones }[] = [];
    const byCategory: Record<string, typeof milestones> = {};
    milestones.forEach(m => {
      if (!byCategory[m.category]) byCategory[m.category] = [];
      byCategory[m.category].push(m);
    });
    categoryOrder.forEach(cat => {
      if (byCategory[cat]?.length) groups.push({ category: cat, items: byCategory[cat] });
    });
    return groups;
  }

  // ── Empty state ──
  if (!targets) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center space-y-5" dir="rtl">
        <Target className="h-16 w-16 text-muted-foreground/50 mx-auto" />
        <h1 className="text-xl font-bold">لم يتم تحديد المستهدفات بعد</h1>
        <p className="text-sm text-muted-foreground">أجب على الاستبيان لتحديد مسارك الأكاديمي والمهني</p>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>✦ خارطة طريق مخصصة لتخصصك وسنتك الدراسية</p>
          <p>✦ مستهدفات قابلة للتتبع لكل مرحلة</p>
        </div>
        <Button onClick={() => {
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key?.startsWith(ONBOARDING_KEY_PREFIX)) localStorage.removeItem(key);
          }
          window.location.href = "/builder";
        }} className="gap-2" size="lg">
          <Sparkles className="h-4 w-4" />
          بدء الاستبيان
        </Button>
      </div>
    );
  }

  const { yearCurrent, yearTotal } = targets;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6" dir="rtl">
      {/* ─── 1. HEADER ─── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            خارطة المستهدفات
          </h1>
          <p className="text-sm text-muted-foreground mt-1">مسيرتك الأكاديمية من السنة الأولى حتى التخرج</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              إعادة تعيين
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
              <AlertDialogDescription>سيتم مسح إعداداتك وستحتاج لإعادة الاستبيان.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row-reverse gap-2">
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetTargets} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                نعم، إعادة التعيين
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* ─── 2. STUDENT PROFILE CARD ─── */}
      <Card className="p-4 bg-gradient-to-l from-primary/5 to-transparent border-primary/20">
        <div className="flex flex-wrap gap-4 items-center">
          <GraduationCap className="h-8 w-8 text-primary shrink-0" />
          <div className="space-y-1.5">
            <p className="font-semibold text-base">السنة {yearCurrent} من {yearTotal}</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="rounded-full text-[11px]">{industryLabels[targets.industry] ?? targets.industry}</Badge>
              <Badge variant="outline" className="rounded-full text-[11px]">{goalLabels[targets.goal] ?? targets.goal}</Badge>
              <Badge variant="outline" className="rounded-full text-[11px]">{stageLabels[targets.stage] ?? targets.stage}</Badge>
            </div>
          </div>
          {overallScore !== null && (
            <div className="ms-auto">
              <span className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-full",
                overallScore >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : overallScore >= 40 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}>
                جاهزية سيرتك: {overallScore}%
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* ─── 3. TIMELINE ─── */}
      <div>
        <h2 className="text-base font-bold mb-3 flex items-center gap-2">
          <Route className="h-4 w-4 text-primary" />
          مراحل مسيرتك
        </h2>
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" disabled={selectedYear <= 1}
              onClick={() => setSelectedYear(y => Math.max(1, y - 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-0 overflow-x-auto px-2 py-4">
              {yearPlans.map((plan, idx) => (
                <div key={plan.year} className="flex items-center">
                  <TimelineNode
                    year={plan.year}
                    label={plan.titleAr}
                    yearLabel={`السنة ${plan.year}`}
                    isCurrent={plan.year === yearCurrent}
                    isPast={plan.year < yearCurrent}
                    isSelected={plan.year === selectedYear}
                    onClick={() => setSelectedYear(plan.year)}
                  />
                  {idx < yearPlans.length - 1 && (
                    <div className={cn(
                      "h-0.5 w-12 md:w-20 mx-1 transition-colors",
                      plan.year < yearCurrent ? "bg-green-500"
                        : plan.year === yearCurrent ? "bg-primary/30"
                        : "bg-muted-foreground/20"
                    )} />
                  )}
                </div>
              ))}
            </div>

            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" disabled={selectedYear >= yearTotal}
              onClick={() => setSelectedYear(y => Math.min(yearTotal, y + 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* ─── 4. SELECTED YEAR DETAILS ─── */}
      {selectedPlan && (
        <div className="space-y-4">
          {/* 4a. Year Header */}
          <Card className="p-5">
            <div className="flex items-center gap-4 flex-wrap">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0",
                selectedYear === yearCurrent ? "bg-primary text-primary-foreground"
                  : selectedYear < yearCurrent ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}>
                {selectedPlan.year}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground">السنة {selectedPlan.year} — {selectedPlan.titleAr}</h2>
                <p className="text-sm text-muted-foreground">{selectedPlan.descriptionAr}</p>
                <div className="mt-1.5">
                  {selectedYear < yearCurrent && (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 me-1" /> مرحلة مكتملة
                    </Badge>
                  )}
                  {selectedYear === yearCurrent && (
                    <Badge className="bg-primary/10 text-primary border-primary/30">مرحلتك الحالية 📍</Badge>
                  )}
                  {selectedYear > yearCurrent && (
                    <Badge variant="secondary">مرحلة قادمة</Badge>
                  )}
                </div>
              </div>
              {/* Mini gauge */}
              <div className="shrink-0 text-center">
                {yearScore !== null ? (
                  <>
                    <div className="relative mx-auto w-fit">
                      <RadialGauge percent={yearScore} size={64} stroke={6} color={getColor(yearScore)} />
                      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold">{yearScore}%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">جاهزية السيرة</p>
                  </>
                ) : (
                  <span className="text-xl text-muted-foreground">—</span>
                )}
              </div>
            </div>
          </Card>

          {/* 4b. Milestones Grid (grouped) */}
          <div>
            <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              مستهدفات هذه المرحلة
            </h3>
            <div className="space-y-3">
              {groupedMilestones(selectedPlan.milestones).map(group => (
                <div key={group.category}>
                  <p className="text-xs font-semibold text-muted-foreground mt-2 mb-1 px-1">
                    {categoryGroupHeaders[group.category] ?? group.category}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.items.map(m => (
                      <MilestoneCard key={m.id} icon={m.icon} label={m.labelAr}
                        category={m.category} checked={isMilestoneChecked(m.category)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4c. CTA (current year only) */}
          {selectedYear === yearCurrent && (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-medium">ابدأ بتحقيق مستهدفات السنة {yearCurrent}</p>
                  <p className="text-xs text-muted-foreground">أضف المحتوى الناقص لسيرتك الآن لتحقيق هذه الأهداف</p>
                </div>
                <Button onClick={() => navigate("/builder")} size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  فتح البيلدر
                </Button>
              </div>
            </Card>
          )}

          {/* 4d. Adjacent years quick nav */}
          <div className="flex gap-2 justify-between">
            {selectedYear > 1 && (() => {
              const prev = yearPlans.find(p => p.year === selectedYear - 1);
              return prev ? (
                <Button variant="ghost" size="sm" className="text-xs gap-1"
                  onClick={() => setSelectedYear(selectedYear - 1)}>
                  <ChevronRight className="h-3 w-3" />
                  السنة {selectedYear - 1}: {prev.titleAr}
                </Button>
              ) : null;
            })()}
            <div className="flex-1" />
            {selectedYear < yearTotal && (() => {
              const next = yearPlans.find(p => p.year === selectedYear + 1);
              return next ? (
                <Button variant="ghost" size="sm" className="text-xs gap-1"
                  onClick={() => setSelectedYear(selectedYear + 1)}>
                  السنة {selectedYear + 1}: {next.titleAr}
                  <ChevronLeft className="h-3 w-3" />
                </Button>
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Targets;
