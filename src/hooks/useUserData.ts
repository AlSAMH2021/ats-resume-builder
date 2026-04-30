import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchResume, saveResume, deleteResume,
  fetchTargets, saveTargets, resetTargets,
  migrateLocalToCloud,
  type UserTargetsRow,
} from "@/lib/cloudStorage";
import type { ResumeData } from "@/types/resume";
import { defaultResumeData } from "@/types/resume";
import type { OnboardingTargets } from "@/components/resume/OnboardingQuiz";

interface UserDataState {
  loading: boolean;
  resume: ResumeData | null;
  lang: 'en' | 'ar';
  targets: OnboardingTargets | null;
  persona: string | null;
  onboardingDone: boolean;
}

interface UserDataApi extends UserDataState {
  saveResumeData: (data: ResumeData, lang?: 'en' | 'ar') => Promise<void>;
  saveResumeDataDebounced: (data: ResumeData, lang?: 'en' | 'ar') => void;
  clearResume: () => Promise<void>;
  saveTargetsData: (patch: Partial<UserTargetsRow>) => Promise<void>;
  resetAllTargets: () => Promise<void>;
  setLang: (l: 'en' | 'ar') => void;
  refresh: () => Promise<void>;
}

export function useUserData(): UserDataApi {
  const { user } = useAuth();
  const [state, setState] = useState<UserDataState>({
    loading: true,
    resume: null,
    lang: 'ar',
    targets: null,
    persona: null,
    onboardingDone: false,
  });

  const debounceRef = useRef<number | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setState(s => ({ ...s, loading: true }));
    try {
      await migrateLocalToCloud(user.id);
      const [r, t] = await Promise.all([fetchResume(user.id), fetchTargets(user.id)]);
      setState({
        loading: false,
        resume: r.data,
        lang: r.lang,
        targets: t.targets,
        persona: t.persona,
        onboardingDone: t.onboarding_done,
      });
    } catch (err) {
      console.error("[useUserData] load failed", err);
      setState(s => ({ ...s, loading: false }));
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const saveResumeData = useCallback(async (data: ResumeData, lang?: 'en' | 'ar') => {
    if (!user) return;
    const useLang = lang ?? state.lang;
    setState(s => ({ ...s, resume: data, lang: useLang }));
    await saveResume(user.id, data, useLang);
  }, [user, state.lang]);

  const saveResumeDataDebounced = useCallback((data: ResumeData, lang?: 'en' | 'ar') => {
    if (!user) return;
    const useLang = lang ?? state.lang;
    setState(s => ({ ...s, resume: data, lang: useLang }));
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      saveResume(user.id, data, useLang).catch(err => console.error("[useUserData] save failed", err));
    }, 800);
  }, [user, state.lang]);

  const clearResume = useCallback(async () => {
    if (!user) return;
    setState(s => ({ ...s, resume: defaultResumeData }));
    await deleteResume(user.id);
  }, [user]);

  const saveTargetsData = useCallback(async (patch: Partial<UserTargetsRow>) => {
    if (!user) return;
    setState(s => ({
      ...s,
      targets: patch.targets !== undefined ? patch.targets : s.targets,
      persona: patch.persona !== undefined ? patch.persona : s.persona,
      onboardingDone: patch.onboarding_done !== undefined ? patch.onboarding_done : s.onboardingDone,
    }));
    await saveTargets(user.id, patch);
  }, [user]);

  const resetAllTargets = useCallback(async () => {
    if (!user) return;
    setState(s => ({ ...s, targets: null, persona: null, onboardingDone: false }));
    await resetTargets(user.id);
  }, [user]);

  const setLang = useCallback((l: 'en' | 'ar') => {
    setState(s => ({ ...s, lang: l }));
    if (user && state.resume) {
      saveResume(user.id, state.resume, l).catch(() => {});
    }
  }, [user, state.resume]);

  return {
    ...state,
    saveResumeData,
    saveResumeDataDebounced,
    clearResume,
    saveTargetsData,
    resetAllTargets,
    setLang,
    refresh: load,
  };
}
