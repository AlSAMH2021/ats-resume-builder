import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText, Zap, Shield, Languages, Palette, Download,
  Sparkles, ArrowLeft, ArrowRight, CheckCircle2,
  Star, ChevronDown, Mouse
} from "lucide-react";
import seeratyLogo from "@/assets/seeraty_logo.png";
import RotatingText from "@/components/landing/RotatingText";
import ResumeMockup from "@/components/landing/ResumeMockup";
import trustedLogos from "@/components/landing/TrustedLogos";
import CustomCursor from "@/components/landing/CustomCursor";

const premiumEase = [0.22, 1, 0.36, 1] as const;
const smoothDecel = [0.16, 1, 0.3, 1] as const;

const stagger = (i: number, base = 0.1) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: base + i * 0.12, duration: 0.6, ease: premiumEase },
});

const sectionReveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.65, ease: premiumEase },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: premiumEase }
  }),
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
    titleAr: "3 قوالب ذكية",
    titleEn: "3 Smart Templates",
    descAr: "قوالب مصممة بذكاء تناسب مرحلتك المهنية وأهدافك",
    descEn: "Intelligently designed templates that match your career stage and goals",
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
    id: "starter",
    nameAr: "البداية",
    nameEn: "Starter",
    descAr: "مهاراتك أولاً — مثالي لبداية مسيرتك",
    descEn: "Skills-first — perfect for starting your career",
    color: "#2a7a8c",
  },
  {
    id: "academic",
    nameAr: "الأكاديمي",
    nameEn: "Academic",
    descAr: "منظم ومتوازن — مثالي للتدريب التعاوني",
    descEn: "Structured — ideal for COOP applications",
    color: "#1a1a1a",
  },
  {
    id: "professional",
    nameAr: "المهني",
    nameEn: "Professional",
    descAr: "متوافق مع ATS — لوظيفتك الأولى",
    descEn: "ATS-optimized — for your first full-time role",
    color: "#7c3aed",
  },
];

const stats = [
  { valueAr: "3", valueEn: "3", labelAr: "قوالب", labelEn: "Templates" },
  { valueAr: "٢", valueEn: "2", labelAr: "لغات", labelEn: "Languages" },
  { valueAr: "٤", valueEn: "4", labelAr: "صيغ", labelEn: "Formats" },
  { valueAr: "∞", valueEn: "∞", labelAr: "مجاني", labelEn: "Free" },
];

const steps = [
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
];

const Landing = () => {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const l = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const isRTL = lang === "ar";

  const handleStart = () => navigate("/builder");

  // Navbar scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Parallax for hero mockup
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const mockupY = useTransform(heroProgress, [0, 1], [0, 120]);
  const mockupYSmooth = useSpring(mockupY, { stiffness: 80, damping: 20 });

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <CustomCursor />

      {/* ── Navbar ── */}
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "bg-card/90 backdrop-blur-xl border-border/40"
            : "bg-card/60 backdrop-blur-lg border-border/20"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={seeratyLogo} alt="سيرتي Seeraty" className="h-8" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
              <Languages className="w-4 h-4 me-1" />
              {lang === "ar" ? "English" : "عربي"}
            </Button>
            <Button size="sm" onClick={handleStart}>
              {l("Start Free", "ابدأ مجاناً")}
            </Button>
          </div>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] start-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-float-slow" />
          <div className="absolute bottom-[5%] end-[15%] w-[400px] h-[400px] rounded-full bg-accent/8 blur-3xl animate-float-slow-alt" />
          <div className="absolute top-[30%] start-[50%] w-[600px] h-[350px] rounded-full bg-primary/3 blur-3xl animate-float-slow" style={{ animationDelay: "5s" }} />
          <div className="absolute top-[60%] end-[5%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl animate-float-slow-alt" style={{ animationDelay: "10s" }} />
          {/* Dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.04) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-0 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* ── Content ── */}
            <div className="text-center lg:text-start">
              {/* Badge */}
              <motion.div
                {...stagger(0, 0.05)}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-6 cursor-hover"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {l("Powered by Smart AI", "مدعوم بالذكاء الاصطناعي")}
              </motion.div>

              {/* Heading */}
              <motion.h1
                {...stagger(1, 0.05)}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15]"
              >
                {l("Your Resume,", "سيرتك الذاتية،")}
                <span className="block mt-3" />
                <RotatingText
                  words={
                    lang === "ar"
                      ? ["لوظيفة أحلامك", "للتدريب التعاوني", "لترقيتك القادمة", "لمستقبلك المهني"]
                      : ["For Your Dream Job", "For Your COOP", "For Your Next Role", "For Your Future"]
                  }
                />
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                {...stagger(2, 0.05)}
                className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
              >
                {l(
                  "Answer 3 quick questions — we'll pick the right template, structure your sections, and help you write an ATS-ready resume in minutes.",
                  "أجب على ٣ أسئلة سريعة — نختار لك القالب المناسب، نرتّب الأقسام، ونساعدك تكتب سيرة ذاتية جاهزة لأنظمة التوظيف في دقائق."
                )}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                {...stagger(3, 0.05)}
                className="mt-8 flex items-center gap-4 flex-wrap justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="relative overflow-hidden text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/25 cursor-hover"
                >
                  {l("Build My CV Now", "ابنِ سيرتي الآن")}
                  {isRTL ? <ArrowLeft className="w-5 h-5 ms-2" /> : <ArrowRight className="w-5 h-5 ms-2" />}
                  {/* Shimmer */}
                  <span className="absolute inset-0 pointer-events-none">
                    <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6 rounded-xl cursor-hover"
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {l("Explore Features", "اكتشف المميزات")}
                  <ChevronDown className="w-4 h-4 ms-1" />
                </Button>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                {...stagger(4, 0.05)}
                className="mt-10 flex items-center gap-8 flex-wrap justify-center lg:justify-start"
              >
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-extrabold text-primary">{lang === "ar" ? s.valueAr : s.valueEn}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? s.labelAr : s.labelEn}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Visual / Mockup ── */}
            <motion.div
              className="flex justify-center lg:justify-end relative"
              style={{ y: mockupYSmooth }}
            >
              <ResumeMockup />

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5, ease: premiumEase }}
                className="absolute -bottom-2 -start-4 bg-card text-foreground text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-border/50 animate-badge-float"
              >
                PDF + Word
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, duration: 0.5, ease: premiumEase }}
                className="absolute top-1/2 -end-4 bg-card text-foreground text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-border/50 animate-badge-float"
                style={{ animationDelay: "1.5s" }}
              >
                عربي + English
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50"
        >
          <Mouse className="w-5 h-5 animate-scroll-bounce" />
          <ChevronDown className="w-4 h-4 animate-scroll-bounce" style={{ animationDelay: "0.2s" }} />
        </motion.div>
      </section>

      {/* ══════════════ TRUSTED BY ══════════════ */}
      <section className="py-10 border-b bg-card/50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: premiumEase }}
            className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest mb-6 text-center"
          >
            {l("Trusted by professionals at", "يثق بنا محترفون في")}
          </motion.p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 w-20 z-10 pointer-events-none" style={{ background: `linear-gradient(to ${isRTL ? "left" : "right"}, hsl(var(--card) / 0.5), transparent)` }} />
          <div className="absolute inset-y-0 end-0 w-20 z-10 pointer-events-none" style={{ background: `linear-gradient(to ${isRTL ? "right" : "left"}, hsl(var(--card) / 0.5), transparent)` }} />
          <div className="flex animate-marquee gap-16 items-center" style={{ width: "max-content" }}>
            {[...trustedLogos, ...trustedLogos].map((logo, i) => (
              <div key={i} className="flex-shrink-0 opacity-30 hover:opacity-60 transition-opacity duration-500 text-foreground">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES — Stacked Cards ══════════════ */}
      <section id="features" className="py-24" style={{ background: "hsl(var(--muted) / 0.35)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...sectionReveal} className="text-center mb-6">
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

          <div className="relative max-w-2xl mx-auto pt-8" style={{ paddingBottom: "6rem" }}>
            {features.map((f, i) => {
              const topOffset = 120 + i * 28;
              return (
                <div
                  key={i}
                  className="sticky"
                  style={{ top: `${topOffset}px`, zIndex: i + 1, marginBottom: i < features.length - 1 ? "48px" : "0" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: smoothDecel }}
                    className="rounded-[22px] bg-card/90 backdrop-blur-sm border border-border/60 px-7 py-7 sm:px-9 sm:py-8 will-change-transform"
                    style={{
                      boxShadow: `0 ${8 + i * 2}px ${20 + i * 6}px -${4 + i}px hsl(var(--primary) / ${0.06 + i * 0.01}), 0 2px 6px -2px hsl(var(--foreground) / 0.04)`,
                    }}
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className="w-13 h-13 min-w-[3.25rem] rounded-2xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.10))" }}
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

      {/* ══════════════ TEMPLATES ══════════════ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...sectionReveal} className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">
              {l("Smart Templates", "قوالب ذكية")}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              {l(
                "Each template is designed for a specific career stage",
                "كل قالب مصمم لمرحلة مهنية مختلفة"
              )}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t, i) => (
              <motion.div
                key={t.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                className="group relative rounded-2xl border bg-card overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] cursor-hover will-change-transform hover:-translate-y-1"
                onClick={handleStart}
              >
                <div className="aspect-[3/4] relative p-4">
                  <div className="w-full h-full rounded-lg border bg-background p-3 flex flex-col gap-2">
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

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...sectionReveal} className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">
              {l("How It Works", "كيف تعمل؟")}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute start-6 top-0 bottom-0 w-px bg-border/60 hidden sm:block" style={{ transform: "translateX(-50%)" }} />

            <div className="space-y-8">
              {steps.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex items-start gap-5 relative"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/20 relative z-10">
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
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
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
                className="mt-8 text-base px-10 py-6 rounded-xl shadow-lg shadow-primary/25 cursor-hover"
              >
                {l("Start Building — It's Free", "ابدأ الآن — مجاناً")}
                {isRTL ? <ArrowLeft className="w-5 h-5 ms-2" /> : <ArrowRight className="w-5 h-5 ms-2" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="border-t bg-card py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={seeratyLogo} alt="سيرتي" className="h-6" />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {l("Seeraty. All rights reserved.", "سيرتي. جميع الحقوق محفوظة.")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-hover">
              {lang === "ar" ? "English" : "عربي"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
