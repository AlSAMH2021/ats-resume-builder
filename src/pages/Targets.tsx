import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target, AlertCircle, Sparkles, RefreshCw, ArrowLeft,
  CheckCircle2, GraduationCap, ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { generateYearPlans, type YearPlan } from "@/lib/yearMilestones";

const TARGETS_KEY = "seeraty-targets";
const ONBOARDING_KEY_PREFIX = "seeraty-onboarding-done-";
const STORAGE_KEY = "ats-resume-data";

interface TargetsData {
  stage: string;
  industry: string;
  goal: string;
  yearCurrent: number;
  yearTotal: number;
  language?: string;
}

// ── Year node on the timeline ──
function TimelineNode({
  year,
  label,
  isCurrent,
  isPast,
  isSelected,
  onClick,
}: {
  year: number;
  label: string;
  isCurrent: boolean;
  isPast: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group relative"
    >
      {/* Circle */}
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
          isSelected
            ? "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30"
            : isCurrent
              ? "border-primary bg-primary/10 text-primary"
              : isPast
                ? "border-green-500 bg-green-500/10 text-green-600"
                : "border-muted-foreground/30 bg-muted/50 text-muted-foreground"
        )}
      >
        {isPast && !isSelected ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <span>{year}</span>
        )}
      </div>
      {/* Label */}
      <span
        className={cn(
          "text-xs font-medium transition-colors whitespace-nowrap",
          isSelected ? "text-primary" : isCurrent ? "text-primary" : isPast ? "text-green-600" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      {/* Current badge */}
      {isCurrent && (
        <Badge variant="default" className="absolute -top-3 text-[10px] px-1.5 py-0">
          أنت هنا
        </Badge>
      )}
    </button>
  );
}

// ── Milestone card ──
function MilestoneCard({ icon, label, category }: { icon: string; label: string; category: string }) {
  const catColors: Record<string, string> = {
    skills: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300",
    projects: "bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300",
    experience: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
    certifications: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    languages: "bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-300",
    personal: "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300",
  };

  const catLabels: Record<string, string> = {
    skills: "مهارات",
    projects: "مشاريع",
    experience: "خبرات",
    certifications: "شهادات",
    languages: "لغات",
    personal: "شخصي",
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm",
      catColors[category] ?? "bg-muted/50 border-border"
    )}>
      <span className="text-xl shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
      </div>
      <Badge variant="outline" className="text-[10px] shrink-0">
        {catLabels[category] ?? category}
      </Badge>
    </div>
  );
}

const Targets = () => {
  const navigate = useNavigate();

  const targets: TargetsData | null = useMemo(() => {
    try {
      const saved = localStorage.getItem(TARGETS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const yearPlans = useMemo(() => {
    if (!targets) return [];
    return generateYearPlans(targets.yearTotal || 4, targets.industry || "other");
  }, [targets]);

  const [selectedYear, setSelectedYear] = useState(() => targets?.yearCurrent ?? 1);

  const selectedPlan: YearPlan | undefined = yearPlans.find(p => p.year === selectedYear);

  const handleResetTargets = useCallback(() => {
    // Clear all onboarding keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(ONBOARDING_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    localStorage.removeItem(TARGETS_KEY);
    toast.success("تم إعادة تعيين المستهدفات — سيظهر الاستبيان عند فتح البيلدر");
    navigate("/builder");
  }, [navigate]);

  // ── No targets yet ──
  if (!targets) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center space-y-4" dir="rtl">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
        <h1 className="text-xl font-bold">لم يتم تحديد المستهدفات بعد</h1>
        <p className="text-muted-foreground">ابدأ بالاستبيان لتحديد أهدافك المهنية</p>
        <Button onClick={() => {
          // Clear all onboarding keys so the quiz re-appears
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key?.startsWith(ONBOARDING_KEY_PREFIX)) {
              localStorage.removeItem(key);
            }
          }
          // Force reload to remount ProtectedLayout
          window.location.href = "/builder";
        }} className="gap-2">
          <Sparkles className="h-4 w-4" />
          بدء الاستبيان
        </Button>
      </div>
    );
  }

  const { yearCurrent, yearTotal } = targets;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            خارطة المستهدفات
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            مسيرتك الأكاديمية من السنة ١ إلى التخرج
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetTargets} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          إعادة تعيين
        </Button>
      </div>

      {/* Current status card */}
      <Card className="p-4 bg-gradient-to-l from-primary/5 to-transparent border-primary/20">
        <div className="flex flex-wrap gap-3 items-center">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">السنة {yearCurrent} من {yearTotal}</span>
          <Badge variant="outline">{targets.industry}</Badge>
          <Badge variant="outline">{targets.goal}</Badge>
        </div>
      </Card>

      {/* ── Timeline ── */}
      <div className="relative">
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={selectedYear <= 1}
              onClick={() => setSelectedYear(y => Math.max(1, y - 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-0 overflow-x-auto px-2 py-4">
              {yearPlans.map((plan, idx) => (
                <div key={plan.year} className="flex items-center">
                  <TimelineNode
                    year={plan.year}
                    label={plan.titleAr}
                    isCurrent={plan.year === yearCurrent}
                    isPast={plan.year < yearCurrent}
                    isSelected={plan.year === selectedYear}
                    onClick={() => setSelectedYear(plan.year)}
                  />
                  {idx < yearPlans.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-8 md:w-16 mx-1 transition-colors",
                        plan.year < yearCurrent ? "bg-green-500" : "bg-muted-foreground/20"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={selectedYear >= yearTotal}
              onClick={() => setSelectedYear(y => Math.min(yearTotal, y + 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* ── Selected Year Details ── */}
      {selectedPlan && (
        <div className="space-y-4">
          {/* Year header */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold",
              selectedYear === yearCurrent
                ? "bg-primary text-primary-foreground"
                : selectedYear < yearCurrent
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
            )}>
              {selectedPlan.year}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                السنة {selectedPlan.year} — {selectedPlan.titleAr}
              </h2>
              <p className="text-sm text-muted-foreground">{selectedPlan.descriptionAr}</p>
            </div>
            {selectedYear < yearCurrent && (
              <Badge className="bg-green-500/10 text-green-600 border-green-500/30 ms-auto">
                <CheckCircle2 className="w-3 h-3 me-1" />
                مرحلة سابقة
              </Badge>
            )}
            {selectedYear === yearCurrent && (
              <Badge className="bg-primary/10 text-primary border-primary/30 ms-auto">
                المرحلة الحالية
              </Badge>
            )}
            {selectedYear > yearCurrent && (
              <Badge variant="secondary" className="ms-auto">
                مرحلة قادمة
              </Badge>
            )}
          </div>

          {/* Milestones grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedPlan.milestones.map((m) => (
              <MilestoneCard
                key={m.id}
                icon={m.icon}
                label={m.labelAr}
                category={m.category}
              />
            ))}
          </div>

          {/* CTA */}
          {selectedYear === yearCurrent && (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm font-medium text-foreground">
                  ابدأ بتحقيق مستهدفات السنة {yearCurrent} الآن
                </p>
                <Button onClick={() => navigate("/builder")} className="gap-2" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  فتح البيلدر
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Targets;
