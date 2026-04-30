import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, LogIn, UserPlus, ArrowRight } from "lucide-react";
import seeratyLogo from "@/assets/seeraty_logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب — تحقق من بريدك الإلكتروني");
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center gap-3">
          <img src={seeratyLogo} alt="سيرتي" className="h-12" />
          <h1 className="text-2xl font-bold text-foreground">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? "أدخل بياناتك للمتابعة" : "أنشئ حسابك لبدء بناء سيرتك الذاتية"}
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                minLength={6}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full gap-2 h-11" disabled={loading}>
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                إنشاء حساب
              </>
            )}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin ? "ليس لديك حساب؟ أنشئ حساباً جديداً" : "لديك حساب؟ سجّل الدخول"}
          </button>
          <div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"
            >
              <ArrowRight className="w-3 h-3" />
              العودة للرئيسية
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
