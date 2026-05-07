import { useEffect, useState } from "react";

export type RailItem = { id: string; label: string };

/* Sticky right-rail "where am I in the story" map.
   Highlights the section currently in view; clicking jumps. Hidden on small. */
export function SectionRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (items.length === 0) return null;
  return (
    <nav
      aria-label="Section navigation"
      className="hidden xl:flex fixed top-1/2 right-5 -translate-y-1/2 z-40 flex-col gap-3 px-3 py-4 rounded-2xl border backdrop-blur-md"
      style={{
        background: "hsl(var(--background) / 0.7)",
        borderColor: "hsl(var(--border))",
      }}
    >
      {items.map((it) => {
        const isActive = it.id === active;
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(it.id);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="group flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors"
            style={{
              color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
            }}
          >
            <span
              className="block rounded-full transition-all"
              style={{
                width: isActive ? 14 : 6,
                height: 6,
                background: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)",
                boxShadow: isActive ? "0 0 12px hsl(var(--primary) / 0.6)" : "none",
              }}
            />
            <span className={isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}>
              {it.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}