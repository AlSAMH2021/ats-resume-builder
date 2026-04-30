import { useCallback } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import OnboardingQuiz, { type OnboardingTargets } from "@/components/resume/OnboardingQuiz";
import SetupReadyScreen from "@/components/resume/SetupReadyScreen";
import { generateSmartSetup, type SmartSetupResult } from "@/lib/smartSetup";
import { useState } from "react";

const ProtectedLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading, targets, onboardingDone, lang, saveTargetsData, setLang } = useUserData();

  const [smartSetup, setSmartSetup] = useState<SmartSetupResult | null>(null);

  const handleOnboardingComplete = useCallback(async (t: OnboardingTargets) => {
    setLang(t.language as 'en' | 'ar');
    await saveTargetsData({ targets: t, persona: t.stage, onboarding_done: true });
    const setup = generateSmartSetup(t);
    setSmartSetup(setup);
  }, [saveTargetsData, setLang]);

  const handleOnboardingSkip = useCallback(async () => {
    await saveTargetsData({ onboarding_done: true });
  }, [saveTargetsData]);

  const handleSetupOpen = useCallback(() => {
    setSmartSetup(null);
  }, []);

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!onboardingDone) {
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
