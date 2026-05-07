import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Maximize2, Minimize2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/* Wrap any embedded "screen" component (the product film, the homepage stories
   player, etc.) so it can be popped out into a large modal viewer or true
   fullscreen. Same chrome on both pages — visitors get a consistent way to
   "watch it bigger". */

type Mode = "inline" | "modal" | "fullscreen";

export function ExpandableViewer({
  children,
  label = "Expand",
}: {
  children: ReactNode;
  label?: string;
}) {
  const [mode, setMode] = useState<Mode>("inline");

  // Esc closes the modal
  useEffect(() => {
    if (mode === "inline") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMode("inline");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  // Lock body scroll while expanded
  useEffect(() => {
    if (mode === "inline") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mode]);

  const expandBtn = (
    <button
      type="button"
      onClick={() => setMode("modal")}
      aria-label={label}
      className="absolute top-2.5 right-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-[0.14em] uppercase bg-background/85 backdrop-blur-sm hover:bg-background border transition-colors"
      style={{ borderColor: "hsl(var(--primary) / 0.35)", color: "hsl(var(--primary))" }}
    >
      <Maximize2 className="w-3 h-3" />
      Expand
    </button>
  );

  return (
    <div className="relative">
      {expandBtn}
      {children}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {mode !== "inline" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
                style={{ background: "hsl(var(--foreground) / 0.7)", backdropFilter: "blur(6px)" }}
                onClick={() => setMode("inline")}
              >
                {/* Toolbar */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-2 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setMode(mode === "fullscreen" ? "modal" : "fullscreen")}
                    aria-label={mode === "fullscreen" ? "Exit fullscreen" : "Fullscreen"}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-background/90 hover:bg-background border"
                    style={{ borderColor: "hsl(var(--primary) / 0.35)", color: "hsl(var(--primary))" }}
                  >
                    {mode === "fullscreen" ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("inline")}
                    aria-label="Close"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-background/90 hover:bg-background border"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={
                    mode === "fullscreen"
                      ? "w-full h-full"
                      : "w-full max-w-[1400px] max-h-[92vh] overflow-auto rounded-2xl"
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {children}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}