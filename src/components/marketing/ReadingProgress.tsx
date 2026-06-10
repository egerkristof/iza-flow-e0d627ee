import { useEffect, useRef } from "react";

/*
 * Top reading progress bar.
 * Writes the width directly to the DOM inside a rAF tick to avoid
 * triggering a React re-render on every scroll event.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = barRef.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      el.style.width = pct + "%";
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
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
        ref={barRef}
        className="h-full"
        style={{
          width: "0%",
          background: "var(--gradient-brand-btn, hsl(var(--primary)))",
          boxShadow: "0 0 12px hsl(var(--primary) / 0.6)",
        }}
      />
    </div>
  );
}