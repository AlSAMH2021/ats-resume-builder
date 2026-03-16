import { useState, useCallback } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import OnboardingQuiz, { type OnboardingTargets } from "@/components/resume/OnboardingQuiz";
import SetupReadyScreen from "@/components/resume/SetupReadyScreen";
import { generateSmartSetup, type SmartSetupResult } from "@/lib/smartSetup";

const ONBOARDING_KEY_PREFIX = "seeraty-onboarding-done-";
const TARGETS_KEY = "seeraty-targets";

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  const getOnboardingKey = () => user ? `${ONBOARDING_KEY_PREFIX}${user.id}` : "";

  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (!user) return false;
    return !localStorage.getItem(`${ONBOARDING_KEY_PREFIX}${user.id}`);
  });

  const [smartSetup, setSmartSetup] = useState<SmartSetupResult | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('ar');

  const handleOnboardingComplete = useCallback((t: OnboardingTargets) => {
    setLang(t.language as 'en' | 'ar');
    localStorage.setItem(getOnboardingKey(), "true");
    localStorage.setItem(TARGETS_KEY, JSON.stringify(t));
    localStorage.setItem("seeraty-persona", t.stage);
    setShowOnboarding(false);
    const setup = generateSmartSetup(t);
    setSmartSetup(setup);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleOnboardingSkip = useCallback(() => {
    localStorage.setItem(getOnboardingKey(), "true");
    setShowOnboarding(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSetupOpen = useCallback(() => {
    setSmartSetup(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (showOnboarding) {
    return <OnboardingQuiz lang={lang} onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />;
  }

  if (smartSetup) {
    return <SetupReadyScreen setup={smartSetup} lang={lang} onOpen={handleSetupOpen} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" dir="rtl">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b bg-card px-3 no-print">
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
