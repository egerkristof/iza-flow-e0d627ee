import { useEffect, useState } from "react";

/* Top reading progress bar. Lightweight, no deps. */
export function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return setPct(0);
      setPct(Math.min(100, Math.max(0, (window.scrollY / max) * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${pct}%`,
          background: "var(--gradient-brand-btn, hsl(var(--primary)))",
          boxShadow: "0 0 12px hsl(var(--primary) / 0.6)",
        }}
      />
    </div>
  );
}