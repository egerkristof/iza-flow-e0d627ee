import { useEffect, useState, useCallback } from "react";

/* Sticky industry context. Pick once, every page reflects it.
   Stored in both URL (?industry=banking) and localStorage. */

const STORAGE_KEY = "liza.industryContext.v1";
const PARAM = "industry";

export function getStoredIndustry(): string | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const fromUrl = url.searchParams.get(PARAM);
  if (fromUrl) return fromUrl;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredIndustry(key: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (key && key !== "generic") localStorage.setItem(STORAGE_KEY, key);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
  // Also reflect in URL without re-routing.
  try {
    const url = new URL(window.location.href);
    if (key && key !== "generic") url.searchParams.set(PARAM, key);
    else url.searchParams.delete(PARAM);
    window.history.replaceState({}, "", url.toString());
  } catch {}
}

export function useIndustryContext(initial?: string | null) {
  const [industry, setIndustryState] = useState<string | null>(
    () => initial ?? getStoredIndustry(),
  );

  // Listen for cross-component updates via storage events (other tabs) and a
  // custom event (same tab).
  useEffect(() => {
    const onStorage = () => setIndustryState(getStoredIndustry());
    window.addEventListener("storage", onStorage);
    window.addEventListener("liza:industry-context", onStorage as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("liza:industry-context", onStorage as EventListener);
    };
  }, []);

  const setIndustry = useCallback((key: string | null) => {
    setStoredIndustry(key);
    setIndustryState(key);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("liza:industry-context"));
    }
  }, []);

  return { industry, setIndustry } as const;
}