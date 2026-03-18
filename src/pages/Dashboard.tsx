import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Target, TrendingUp, AlertCircle,
  Sparkles, Shield, GraduationCap, Wrench
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const STORAGE_KEY = "ats-resume-data";
const TARGETS_KEY = "seeraty-targets";

interface SectionScore {
  label: string;
  key: string;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
  color: string;
}

/* ── Radial gauge ─────────────────────────────────── */
function RadialGauge({ percent, size = 120, stroke = 10, color }: {
  percent: number; size?: number; stroke?: number; color: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out" />
    </svg>
  );
}

/* ── Section card with mini radial ────────────────── */
function SectionCard({ sec }: { sec: SectionScore }) {
  const pct = Math.round((sec.score / sec.maxScore) * 100);
  const status = pct >= 80 ? "قوي" : pct >= 50 ? "متوسط" : "ضعيف";

  return (
    <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="relative shrink-0">
        <RadialGauge percent={pct} size={64} stroke={6} color={sec.color} />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
          {pct}%
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-muted-foreground">{sec.icon}</span>
          <span className="font-semibold text-sm truncate">{sec.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            pct >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : pct >= 50 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {status}
          </span>
          <span className="text-xs text-muted-foreground">{sec.score}/{sec.maxScore}</span>
        </div>
      </div>
    </Card>
  );
}

/* ── Main Dashboard ───────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { overallScore, sections, targets, resumeExists } = useMemo(() => {
    let resumeData: any = null;
    let targetsData: any = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) resumeData = JSON.parse(saved);
    } catch {}
    try {
      const saved = localStorage.getItem(TARGETS_KEY);
      if (saved) targetsData = JSON.parse(saved);
    } catch {}

    if (!resumeData) {
      return { overallScore: 0, sections: [], targets: targetsData, resumeExists: false };
    }

    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--accent))",
      "hsl(142 72% 42%)",
      "hsl(38 92% 50%)",
      "hsl(199 89% 48%)",
    ];

    const sectionScores: SectionScore[] = [];

    const personalFields = [resumeData.fullName, resumeData.jobTitle, resumeData.email, resumeData.phone, resumeData.city].filter(Boolean).length;
    sectionScores.push({ label: "المعلومات الشخصية", key: "personal", score: personalFields, maxScore: 5, icon: <FileText className="h-4 w-4" />, color: colors[0] });

    const summaryLen = (resumeData.summary || "").trim().length;
    const summaryScore = summaryLen > 100 ? 3 : summaryLen > 30 ? 2 : summaryLen > 0 ? 1 : 0;
    sectionScores.push({ label: "الملخص المهني", key: "summary", score: summaryScore, maxScore: 3, icon: <Sparkles className="h-4 w-4" />, color: colors[1] });

    const expCount = (resumeData.experience || []).length;
    sectionScores.push({ label: "الخبرات", key: "experience", score: Math.min(expCount * 2, 6), maxScore: 6, icon: <TrendingUp className="h-4 w-4" />, color: colors[2] });

    const eduCount = (resumeData.education || []).length;
    sectionScores.push({ label: "التعليم", key: "education", score: Math.min(eduCount * 2, 4), maxScore: 4, icon: <GraduationCap className="h-4 w-4" />, color: colors[3] });

    const skillCount = (resumeData.skills || []).length;
    sectionScores.push({ label: "المهارات", key: "skills", score: Math.min(skillCount, 5), maxScore: 5, icon: <Wrench className="h-4 w-4" />, color: colors[4] });

    const totalScore = sectionScores.reduce((s, sec) => s + sec.score, 0);
    const totalMax = sectionScores.reduce((s, sec) => s + sec.maxScore, 0);
    const overall = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

    return { overallScore: overall, sections: sectionScores, targets: targetsData, resumeExists: true };
  }, []);

  const overallColor = overallScore >= 70
    ? "hsl(142 72% 42%)"
    : overallScore >= 40
      ? "hsl(38 92% 50%)"
      : "hsl(var(--destructive))";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground">
          مرحباً {user?.email?.split("@")[0]} — ملخص سيرتك الذاتية
        </p>
      </div>

      {!resumeExists ? (
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
          {/* Hero score */}
          <Card className="p-8 flex flex-col items-center gap-4 bg-gradient-to-br from-card to-secondary/30">
            <div className="relative">
              <RadialGauge percent={overallScore} size={160} stroke={14} color={overallColor} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{overallScore}%</span>
                <span className="text-[10px] text-muted-foreground">النتيجة الإجمالية</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              {overallScore >= 70 ? "سيرتك قوية! أضف تفاصيل إضافية للتميز" :
               overallScore >= 40 ? "جيد، لكن هناك مجال للتحسين" :
               "سيرتك تحتاج مزيداً من المحتوى"}
            </p>
          </Card>

          {/* Section cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((sec) => (
              <SectionCard key={sec.key} sec={sec} />
            ))}
          </div>

          {/* Targets */}
          {targets && (
            <Card className="p-6 space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                المستهدفات المهنية
              </h2>
              <div className="flex flex-wrap gap-2">
                {targets.stage && <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.stage}</span>}
                {targets.industry && <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.industry}</span>}
                {targets.goal && <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.goal}</span>}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/targets")} className="gap-2">
                تعديل المستهدفات
              </Button>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/builder")} className="gap-2">
              <FileText className="h-4 w-4" />
              تعديل السيرة
            </Button>
            <Button variant="outline" onClick={() => navigate("/targets")} className="gap-2">
              <Target className="h-4 w-4" />
              المستهدفات
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
