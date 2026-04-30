import { supabase } from "@/integrations/supabase/client";
import type { ResumeData } from "@/types/resume";
import type { OnboardingTargets } from "@/components/resume/OnboardingQuiz";

// Legacy localStorage keys (used for one-time migration only)
const LEGACY_RESUME_KEY = "ats-resume-data";
const LEGACY_TARGETS_KEY = "seeraty-targets";
const LEGACY_PERSONA_KEY = "seeraty-persona";
const LEGACY_ONBOARDING_PREFIX = "seeraty-onboarding-done-";
const MIGRATION_FLAG_PREFIX = "seeraty-cloud-migrated-";

// ─────────── RESUMES ───────────
export async function fetchResume(userId: string): Promise<{ data: ResumeData | null; lang: 'en' | 'ar' }> {
  const { data, error } = await supabase
    .from("user_resumes")
    .select("resume_data, lang")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return {
    data: (data?.resume_data as ResumeData) ?? null,
    lang: (data?.lang as 'en' | 'ar') ?? 'ar',
  };
}

export async function saveResume(userId: string, resume: ResumeData, lang: 'en' | 'ar') {
  const { error } = await supabase
    .from("user_resumes")
    .upsert({ user_id: userId, resume_data: resume as any, lang }, { onConflict: "user_id" });
  if (error) throw error;
}

export async function deleteResume(userId: string) {
  const { error } = await supabase.from("user_resumes").delete().eq("user_id", userId);
  if (error) throw error;
}

// ─────────── TARGETS ───────────
export interface UserTargetsRow {
  targets: OnboardingTargets | null;
  persona: string | null;
  onboarding_done: boolean;
}

export async function fetchTargets(userId: string): Promise<UserTargetsRow> {
  const { data, error } = await supabase
    .from("user_targets")
    .select("targets, persona, onboarding_done")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return {
    targets: (data?.targets as unknown as OnboardingTargets) ?? null,
    persona: data?.persona ?? null,
    onboarding_done: data?.onboarding_done ?? false,
  };
}

export async function saveTargets(
  userId: string,
  patch: Partial<{ targets: OnboardingTargets | null; persona: string | null; onboarding_done: boolean }>
) {
  const { error } = await supabase
    .from("user_targets")
    .upsert({ user_id: userId, ...patch } as any, { onConflict: "user_id" });
  if (error) throw error;
}

export async function resetTargets(userId: string) {
  const { error } = await supabase.from("user_targets").delete().eq("user_id", userId);
  if (error) throw error;
}

// ─────────── ONE-TIME MIGRATION FROM LOCALSTORAGE ───────────
export async function migrateLocalToCloud(userId: string): Promise<void> {
  const flagKey = `${MIGRATION_FLAG_PREFIX}${userId}`;
  if (localStorage.getItem(flagKey)) return;

  try {
    // Migrate resume
    const rawResume = localStorage.getItem(LEGACY_RESUME_KEY);
    if (rawResume) {
      const existing = await fetchResume(userId);
      if (!existing.data) {
        await saveResume(userId, JSON.parse(rawResume), 'ar');
      }
    }

    // Migrate targets / onboarding
    const rawTargets = localStorage.getItem(LEGACY_TARGETS_KEY);
    const persona = localStorage.getItem(LEGACY_PERSONA_KEY);
    const onboardingDone = !!localStorage.getItem(`${LEGACY_ONBOARDING_PREFIX}${userId}`);

    if (rawTargets || persona || onboardingDone) {
      const existing = await fetchTargets(userId);
      if (!existing.targets && !existing.onboarding_done) {
        await saveTargets(userId, {
          targets: rawTargets ? JSON.parse(rawTargets) : null,
          persona,
          onboarding_done: onboardingDone,
        });
      }
    }

    localStorage.setItem(flagKey, "1");
  } catch (err) {
    console.error("[cloudStorage] migration failed", err);
  }
}
