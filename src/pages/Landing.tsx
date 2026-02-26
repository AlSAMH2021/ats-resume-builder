import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText, Zap, Shield, Languages, Palette, Download,
  Share2, Sparkles, ArrowLeft, ArrowRight, CheckCircle2,
  Star, ChevronDown
} from "lucide-react";
import seeratyLogo from "@/assets/seeraty_logo.png";
import RotatingText from "@/components/landing/RotatingText";
import ResumeMockup from "@/components/landing/ResumeMockup";

// Premium easing curves — landing page only
const premiumEase = [0.22, 1, 0.36, 1] as const;
const smoothDecel = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: premiumEase }
  }),
};

const heroReveal = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: premiumEase },
});

const sectionReveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.65, ease: premiumEase },
};

const features = [
  {
    icon: Zap,
    titleAr: "إعداد ذكي تلقائي",
    titleEn: "Smart Auto-Setup",
    descAr: "استبيان سريع يحدد أهدافك ويبني سيرتك الذاتية تلقائياً",
    descEn: "Quick survey that identifies your goals and auto-builds your CV",
  },
  {
    icon: Shield,
    titleAr: "متوافق مع أنظمة ATS",
    titleEn: "ATS-Optimized",
    descAr: "كلمات مفتاحية ذكية تضمن تجاوز فلاتر التوظيف الآلية",
    descEn: "Smart keywords ensure your CV passes automated screening",
  },
  {
    icon: Palette,
    titleAr: "قوالب احترافية متعددة",
    titleEn: "Multiple Pro Templates",
    descAr: "5 قوالب مصممة باحترافية بما فيها قالب سيرتي المميز",
    descEn: "5 professionally designed templates including our signature Seeraty template",
  },
  {
    icon: Languages,
    titleAr: "دعم عربي وإنجليزي",
    titleEn: "Arabic & English",
    descAr: "اكتب سيرتك بالعربية أو الإنجليزية مع دعم RTL كامل",
    descEn: "Write your CV in Arabic or English with full RTL support",
  },
  {
    icon: Download,
    titleAr: "تصدير متعدد الصيغ",
    titleEn: "Multi-Format Export",
    descAr: "حمّل سيرتك PDF أو Word أو انسخها كنص أو شاركها برابط",
    descEn: "Download as PDF, Word, copy as text, or share via link",
  },
  {
    icon: Sparkles,
    titleAr: "محتوى مولّد تلقائياً",
    titleEn: "Auto-Generated Content",
    descAr: "ملخص مهني وإنجازات ومهارات مقترحة حسب تخصصك",
    descEn: "Professional summary, achievements, and skills tailored to you",
  },
];

const templates = [
  {
    id: "classic",
    nameAr: "كلاسيكي",
    nameEn: "Classic",
    descAr: "تصميم تقليدي أنيق يناسب جميع المجالات",
    descEn: "Timeless elegant design for all fields",
    color: "#7c3aed",
  },
  {
    id: "modern",
    nameAr: "عصري",
    nameEn: "Modern",
    descAr: "تصميم حديث بألوان جريئة للمبدعين",
    descEn: "Bold modern design for creatives",
    color: "#2563eb",
  },
  {
    id: "minimal",
    nameAr: "بسيط",
    nameEn: "Minimal",
    descAr: "نظيف ومركّز على المحتوى",
    descEn: "Clean and content-focused",
    color: "#475569",
  },
  {
    id: "executive",
    nameAr: "تنفيذي",
    nameEn: "Executive",
    descAr: "فخم ومهيب للمناصب القيادية",
    descEn: "Premium look for leadership roles",
    color: "#1e293b",
  },
  {
    id: "seeraty",
    nameAr: "سيرتي ✨",
    nameEn: "Seeraty ✨",
    descAr: "قالبنا المميز — تصميم فريد لا يُنسى",
    descEn: "Our signature template — unique and unforgettable",
    color: "#7c3aed",
  },
];

const stats = [
  { valueAr: "5+", valueEn: "5+", labelAr: "قوالب احترافية", labelEn: "Pro Templates" },
  { valueAr: "٢", valueEn: "2", labelAr: "لغات مدعومة", labelEn: "Languages" },
  { valueAr: "٤", valueEn: "4", labelAr: "صيغ تصدير", labelEn: "Export Formats" },
  { valueAr: "∞", valueEn: "∞", labelAr: "سير ذاتية مجانية", labelEn: "Free CVs" },
];

const Landing = () => {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const navigate = useNavigate();
  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const isRTL = lang === "ar";

  const handleStart = () => navigate("/builder");

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={seeratyLogo} alt="سيرتي Seeraty" className="h-8" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
              <Languages className="w-4 h-4 me-1" />
              {lang === "ar" ? "English" : "عربي"}
            </Button>
            <Button size="sm" onClick={handleStart} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {l("Start Free", "ابدأ مجاناً")}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 start-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 end-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/3 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-16 pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text Side */}
            <div className={`text-center lg:text-start ${isRTL ? "lg:order-1" : ""}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: premiumEase }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-6"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {l("AI-Powered Resume Builder", "منشئ سير ذاتية بالذكاء الاصطناعي")}
              </motion.div>

              <motion.h1
                {...heroReveal(0.15)}
                className="text-4xl sm:text-5xl md:text-[3.4rem] font-extrabold tracking-tight text-foreground leading-[1.15]"
              >
                {l("Build Your CV for", "ابنِ سيرتك لـ")}
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  <RotatingText
                    words={lang === "ar"
                      ? ["وظيفة أحلامك", "منحتك الدراسية", "ترقيتك القادمة", "مشروعك الخاص"]
                      : ["Your Dream Job", "A Scholarship", "Your Promotion", "A Career Shift"]
                    }
                  />
                </span>
              </motion.h1>

              <motion.p
                {...heroReveal(0.25)}
                className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
              >
                {l(
                  "Seeraty analyzes your goals, selects the best template, and generates a professional ATS-optimized resume — ready in minutes.",
                  "سيرتي تحلل أهدافك، تختار القالب الأنسب، وتُنشئ سيرة ذاتية احترافية متوافقة مع أنظمة التوظيف — جاهزة في دقائق."
                )}
              </motion.p>

              <motion.div
                {...heroReveal(0.35)}
                className="mt-8 flex items-center gap-4 flex-wrap justify-center lg:justify-start"
              >
                <Button size="lg" onClick={handleStart} className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/25">
                  {l("Build My CV Now", "ابنِ سيرتي الآن")}
                  {isRTL ? <ArrowLeft className="w-5 h-5 ms-2" /> : <ArrowRight className="w-5 h-5 ms-2" />}
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                  {l("Explore Features", "اكتشف المميزات")}
                  <ChevronDown className="w-4 h-4 ms-1" />
                </Button>
              </motion.div>

              {/* Stats inline */}
              <motion.div
                {...heroReveal(0.5)}
                className="mt-10 flex items-center gap-6 flex-wrap justify-center lg:justify-start"
              >
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-extrabold text-primary">{lang === "ar" ? s.valueAr : s.valueEn}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? s.labelAr : s.labelEn}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Mockup Side */}
            <div className="flex justify-center lg:justify-end">
              <ResumeMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features — Scroll Stack */}
      <section id="features" className="py-24" style={{ background: "hsl(var(--muted) / 0.35)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            {...sectionReveal}
            className="text-center mb-6"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {l("Everything You Need", "كل ما تحتاجه")}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-base">
              {l(
                "Professional tools to create standout resumes that get you hired",
                "أدوات احترافية لإنشاء سير ذاتية مميزة تحقق لك الوظيفة"
              )}
            </p>
          </motion.div>

          {/* Stacked Cards Container */}
          <div className="relative max-w-2xl mx-auto pt-8" style={{ paddingBottom: "6rem" }}>
            {features.map((f, i) => {
              const topOffset = 120 + i * 28;
              return (
                <div
                  key={i}
                  className="sticky"
                  style={{
                    top: `${topOffset}px`,
                    zIndex: i + 1,
                    marginBottom: i < features.length - 1 ? "48px" : "0",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: smoothDecel }}
                    className="rounded-[22px] bg-card border border-border/60 px-7 py-7 sm:px-9 sm:py-8 will-change-transform"
                    style={{
                      boxShadow: `0 ${8 + i * 2}px ${20 + i * 6}px -${4 + i}px hsl(var(--primary) / ${0.06 + i * 0.01}), 0 2px 6px -2px hsl(var(--foreground) / 0.04)`,
                    }}
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className="w-13 h-13 min-w-[3.25rem] rounded-2xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.10))`,
                        }}
                      >
                        <f.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground leading-snug">
                          {lang === "ar" ? f.titleAr : f.titleEn}
                        </h3>
                        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                          {lang === "ar" ? f.descAr : f.descEn}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-primary/30 tabular-nums flex-shrink-0 pt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">
              {l("Premium Templates", "قوالب احترافية")}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              {l(
                "Choose from our collection of professionally designed templates",
                "اختر من مجموعتنا من القوالب المصممة باحترافية"
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {templates.map((t, i) => (
              <motion.div
                key={t.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                className="group relative rounded-2xl border bg-card overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer will-change-transform hover:-translate-y-1"
                onClick={handleStart}
              >
                {/* Template preview mock */}
                <div className="aspect-[3/4] relative p-4">
                  <div className="w-full h-full rounded-lg border bg-background p-3 flex flex-col gap-2">
                    {/* Header bar */}
                    <div className="h-3 rounded-full w-2/3" style={{ backgroundColor: t.color }} />
                    <div className="h-2 rounded-full bg-muted w-1/2" />
                    <div className="mt-2 h-1.5 rounded-full bg-muted/60 w-full" />
                    <div className="h-1.5 rounded-full bg-muted/60 w-5/6" />
                    <div className="h-1.5 rounded-full bg-muted/60 w-4/6" />
                    <div className="mt-2 h-2 rounded-full w-1/3" style={{ backgroundColor: t.color, opacity: 0.6 }} />
                    <div className="h-1.5 rounded-full bg-muted/60 w-full" />
                    <div className="h-1.5 rounded-full bg-muted/60 w-5/6" />
                    <div className="mt-2 h-2 rounded-full w-1/3" style={{ backgroundColor: t.color, opacity: 0.6 }} />
                    <div className="h-1.5 rounded-full bg-muted/60 w-full" />
                    <div className="h-1.5 rounded-full bg-muted/60 w-3/4" />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors rounded-2xl flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                      {l("Use Template", "استخدم القالب")}
                    </span>
                  </div>
                </div>
                <div className="p-4 pt-0 text-center">
                  <h3 className="font-semibold text-foreground">{lang === "ar" ? t.nameAr : t.nameEn}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{lang === "ar" ? t.descAr : t.descEn}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">
              {l("How It Works", "كيف تعمل؟")}
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                titleAr: "أجب على الاستبيان",
                titleEn: "Answer the Survey",
                descAr: "حدد خبرتك وتخصصك وهدفك الوظيفي في ٣٠ ثانية",
                descEn: "Define your experience, field, and career goal in 30 seconds",
              },
              {
                step: "2",
                titleAr: "نُعد سيرتك تلقائياً",
                titleEn: "We Auto-Setup Your CV",
                descAr: "نختار القالب الأنسب ونرتب الأقسام ونملأ المحتوى المبدئي",
                descEn: "We pick the best template, arrange sections, and fill initial content",
              },
              {
                step: "3",
                titleAr: "عدّل وحمّل",
                titleEn: "Edit & Download",
                descAr: "خصّص سيرتك بالتعديل المباشر ثم حمّلها PDF أو Word",
                descEn: "Customize with live editing, then download as PDF or Word",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-start gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/20">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {lang === "ar" ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {lang === "ar" ? item.descAr : item.descEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: premiumEase }}
          >
            <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/10 p-12">
              <Star className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground">
                {l("Ready to Build Your CV?", "مستعد لبناء سيرتك؟")}
              </h2>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
                {l(
                  "Join thousands who built professional resumes with Seeraty. It's free, fast, and smart.",
                  "انضم لآلاف المستخدمين الذين بنوا سيرهم الذاتية مع سيرتي. مجاني، سريع، وذكي."
                )}
              </p>
              <Button
                size="lg"
                onClick={handleStart}
                className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base px-10 py-6 rounded-xl shadow-lg shadow-primary/25"
              >
                {l("Start Building — It's Free", "ابدأ الآن — مجاناً")}
                {isRTL ? <ArrowLeft className="w-5 h-5 ms-2" /> : <ArrowRight className="w-5 h-5 ms-2" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={seeratyLogo} alt="سيرتي" className="h-6" />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {l("Seeraty. All rights reserved.", "سيرتي. جميع الحقوق محفوظة.")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {lang === "ar" ? "English" : "عربي"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
