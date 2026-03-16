import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target, CheckCircle2, AlertCircle, ArrowLeft,
  Sparkles, TrendingUp, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TARGETS_KEY = "seeraty-targets";
const ONBOARDING_KEY = "seeraty-onboarding-done";
const STORAGE_KEY = "ats-resume-data";

interface TargetItem {
  id: string;
  label: string;
  category: "required" | "recommended" | "bonus";
  met: boolean;
  tip: string;
}

const Targets = () => {
  const navigate = useNavigate();

  const [targets] = useState(() => {
    try {
      const saved = localStorage.getItem(TARGETS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { targetItems, overallPercent } = useMemo(() => {
    let resumeData: any = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) resumeData = JSON.parse(saved);
    } catch {}

    if (!resumeData || !targets) {
      return { targetItems: [], overallPercent: 0 };
    }

    const items: TargetItem[] = [
      {
        id: "name",
        label: "الاسم الكامل",
        category: "required",
        met: !!(resumeData.fullName?.trim()),
        tip: "أضف اسمك الكامل في القسم الشخصي",
      },
      {
        id: "jobTitle",
        label: "المسمى الوظيفي",
        category: "required",
        met: !!(resumeData.jobTitle?.trim()),
        tip: "حدد المسمى الوظيفي المستهدف",
      },
      {
        id: "email",
        label: "البريد الإلكتروني",
        category: "required",
        met: !!(resumeData.email?.trim()),
        tip: "أضف بريدك الإلكتروني",
      },
      {
        id: "phone",
        label: "رقم الهاتف",
        category: "required",
        met: !!(resumeData.phone?.trim()),
        tip: "أضف رقم هاتفك",
      },
      {
        id: "summary",
        label: "الملخص المهني (٥٠+ كلمة)",
        category: "required",
        met: (resumeData.summary || "").trim().split(/\s+/).length >= 50,
        tip: "اكتب ملخصاً مهنياً لا يقل عن 50 كلمة",
      },
      {
        id: "experience",
        label: "خبرة عمل واحدة على الأقل",
        category: "recommended",
        met: (resumeData.experience || []).length >= 1,
        tip: "أضف خبراتك العملية السابقة",
      },
      {
        id: "education",
        label: "مؤهل تعليمي واحد على الأقل",
        category: "recommended",
        met: (resumeData.education || []).length >= 1,
        tip: "أضف مؤهلاتك التعليمية",
      },
      {
        id: "skills3",
        label: "٣ مهارات على الأقل",
        category: "recommended",
        met: (resumeData.skills || []).length >= 3,
        tip: "أضف المهارات المتعلقة بمجالك",
      },
      {
        id: "skills5",
        label: "٥ مهارات أو أكثر",
        category: "bonus",
        met: (resumeData.skills || []).length >= 5,
        tip: "أضف المزيد من المهارات للتميز",
      },
      {
        id: "projects",
        label: "مشروع واحد على الأقل",
        category: "bonus",
        met: (resumeData.projects || []).length >= 1,
        tip: "أضف مشاريعك لإبراز خبراتك العملية",
      },
      {
        id: "certifications",
        label: "شهادة مهنية",
        category: "bonus",
        met: (resumeData.certifications || []).length >= 1,
        tip: "أضف شهاداتك المهنية إن وجدت",
      },
    ];

    const metCount = items.filter(i => i.met).length;
    const percent = Math.round((metCount / items.length) * 100);

    return { targetItems: items, overallPercent: percent };
  }, [targets]);

  const handleResetTargets = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(TARGETS_KEY);
    toast.success("تم إعادة تعيين المستهدفات — سيظهر الاستبيان عند فتح البيلدر");
    navigate("/builder");
  }, [navigate]);

  const categoryLabel = (c: string) =>
    c === "required" ? "مطلوب" : c === "recommended" ? "موصى به" : "إضافي";

  const categoryColor = (c: string) =>
    c === "required" ? "destructive" : c === "recommended" ? "default" : "secondary";

  if (!targets) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center space-y-4" dir="rtl">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
        <h1 className="text-xl font-bold">لم يتم تحديد المستهدفات بعد</h1>
        <p className="text-muted-foreground">ابدأ بالاستبيان لتحديد أهدافك المهنية</p>
        <Button onClick={() => navigate("/builder")} className="gap-2">
          <Sparkles className="h-4 w-4" />
          بدء الاستبيان
        </Button>
      </div>
    );
  }

  const grouped = {
    required: targetItems.filter(i => i.category === "required"),
    recommended: targetItems.filter(i => i.category === "recommended"),
    bonus: targetItems.filter(i => i.category === "bonus"),
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            المستهدفات المهنية
          </h1>
          <p className="text-sm text-muted-foreground mt-1">تتبع تقدمك نحو سيرة ذاتية مثالية</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetTargets} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          إعادة تعيين
        </Button>
      </div>

      {/* Current Targets */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">أهدافك:</span>
          <Badge variant="outline">{targets.stage}</Badge>
          <Badge variant="outline">{targets.industry}</Badge>
          <Badge variant="outline">{targets.goal}</Badge>
        </div>
      </Card>

      {/* Overall Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            نسبة الإنجاز
          </h2>
          <span className={cn(
            "text-2xl font-bold",
            overallPercent >= 70 ? "text-green-600" : overallPercent >= 40 ? "text-yellow-600" : "text-destructive"
          )}>
            {overallPercent}%
          </span>
        </div>
        <Progress value={overallPercent} className="h-3" />
      </Card>

      {/* Target Groups */}
      {(["required", "recommended", "bonus"] as const).map((cat) => (
        <div key={cat} className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Badge variant={categoryColor(cat)}>{categoryLabel(cat)}</Badge>
            <span>{grouped[cat].filter(i => i.met).length}/{grouped[cat].length}</span>
          </h3>
          <div className="grid gap-2">
            {grouped[cat].map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "p-3 flex items-center gap-3 transition-colors",
                  item.met ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900" : ""
                )}
              >
                {item.met ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", item.met && "line-through text-muted-foreground")}>
                    {item.label}
                  </p>
                  {!item.met && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.tip}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <Button onClick={() => navigate("/builder")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          تعديل السيرة لتحسين النتيجة
        </Button>
      </div>
    </div>
  );
};

export default Targets;
