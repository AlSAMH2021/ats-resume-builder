import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText, Target, TrendingUp, AlertCircle, CheckCircle2,
  ArrowLeft, Sparkles, Shield
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
  status: "strong" | "moderate" | "weak";
}

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

    const sectionScores: SectionScore[] = [];

    // Personal Info
    const personalFields = [resumeData.fullName, resumeData.jobTitle, resumeData.email, resumeData.phone, resumeData.city].filter(Boolean).length;
    const personalMax = 5;
    sectionScores.push({
      label: "المعلومات الشخصية",
      key: "personal",
      score: personalFields,
      maxScore: personalMax,
      icon: <FileText className="h-4 w-4" />,
      status: personalFields >= 4 ? "strong" : personalFields >= 2 ? "moderate" : "weak",
    });

    // Summary
    const summaryLen = (resumeData.summary || "").trim().length;
    const summaryScore = summaryLen > 100 ? 3 : summaryLen > 30 ? 2 : summaryLen > 0 ? 1 : 0;
    sectionScores.push({
      label: "الملخص المهني",
      key: "summary",
      score: summaryScore,
      maxScore: 3,
      icon: <Sparkles className="h-4 w-4" />,
      status: summaryScore >= 3 ? "strong" : summaryScore >= 2 ? "moderate" : "weak",
    });

    // Experience
    const expCount = (resumeData.experience || []).length;
    const expScore = Math.min(expCount * 2, 6);
    sectionScores.push({
      label: "الخبرات",
      key: "experience",
      score: expScore,
      maxScore: 6,
      icon: <TrendingUp className="h-4 w-4" />,
      status: expScore >= 4 ? "strong" : expScore >= 2 ? "moderate" : "weak",
    });

    // Education
    const eduCount = (resumeData.education || []).length;
    const eduScore = Math.min(eduCount * 2, 4);
    sectionScores.push({
      label: "التعليم",
      key: "education",
      score: eduScore,
      maxScore: 4,
      icon: <Shield className="h-4 w-4" />,
      status: eduScore >= 3 ? "strong" : eduScore >= 1 ? "moderate" : "weak",
    });

    // Skills
    const skillCount = (resumeData.skills || []).length;
    const skillScore = Math.min(skillCount, 5);
    sectionScores.push({
      label: "المهارات",
      key: "skills",
      score: skillScore,
      maxScore: 5,
      icon: <Target className="h-4 w-4" />,
      status: skillScore >= 4 ? "strong" : skillScore >= 2 ? "moderate" : "weak",
    });

    const totalScore = sectionScores.reduce((s, sec) => s + sec.score, 0);
    const totalMax = sectionScores.reduce((s, sec) => s + sec.maxScore, 0);
    const overall = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

    return { overallScore: overall, sections: sectionScores, targets: targetsData, resumeExists: true };
  }, []);

  const statusColor = (s: string) =>
    s === "strong" ? "text-green-600" : s === "moderate" ? "text-yellow-600" : "text-destructive";

  const statusLabel = (s: string) =>
    s === "strong" ? "قوي" : s === "moderate" ? "متوسط" : "ضعيف";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground">
            مرحباً {user?.email?.split("@")[0]} — هذا ملخص سيرتك الذاتية
          </p>
        </div>
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
          {/* Overall Score */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">النتيجة الإجمالية</h2>
              <span className={`text-3xl font-bold ${overallScore >= 70 ? "text-green-600" : overallScore >= 40 ? "text-yellow-600" : "text-destructive"}`}>
                {overallScore}%
              </span>
            </div>
            <Progress value={overallScore} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {overallScore >= 70 ? "سيرتك قوية! أضف تفاصيل إضافية للتميز" :
               overallScore >= 40 ? "جيد، لكن هناك مجال للتحسين" :
               "سيرتك تحتاج مزيداً من المحتوى"}
            </p>
          </Card>

          {/* Section Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((sec) => (
              <Card key={sec.key} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {sec.icon}
                    <span className="font-medium text-sm">{sec.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${statusColor(sec.status)}`}>
                    {statusLabel(sec.status)}
                  </span>
                </div>
                <Progress value={(sec.score / sec.maxScore) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {sec.score}/{sec.maxScore} نقاط
                </p>
              </Card>
            ))}
          </div>

          {/* Targets Summary */}
          {targets && (
            <Card className="p-6 space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                المستهدفات المهنية
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.stage}</span>
                <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.industry}</span>
                <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1">{targets.goal}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/targets")} className="gap-2">
                <ArrowLeft className="h-3.5 w-3.5" />
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
