import type { ResumeData } from "@/types/resume";

export function encodeResumeToUrl(data: ResumeData): string {
  const json = JSON.stringify(data);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("resume", encoded);
  return url.toString();
}

export function decodeResumeFromUrl(): ResumeData | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("resume");
    if (!encoded) return null;
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
