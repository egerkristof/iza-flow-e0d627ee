import { motion } from "framer-motion";
import { MessageSquare, Factory } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

/**
 * One chat is artisanal. A company is not an artisanal shop.
 * Show the contrast visually: one bubble (easy, anyone can do it) vs
 * a grid of bubbles flowing through a standards layer (the factory).
 */
export function FactoryStrip() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="One chat vs one thousand" />
          <h2 className="text-3xl md:text-5xl font-black leading-[1.05] tracking-tight">
            One chat is artisanal.{" "}
            <GradientText>Your company is not an artisanal shop.</GradientText>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Anyone can get one chat right. At a thousand chats a day, context engineering and fine-tuning hit a ceiling. What scales is a factory: every prompt flowing through the same standard, every output teaching the standard back.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1.4fr] gap-8 md:gap-10 items-stretch">
          {/* LEFT: Artisanal — one chat */}
          <Panel
            tag="Artisanal"
            title="One chat. One person. One outcome."
            body="Easy. Repeatable by nobody but the person who wrote it."
            tone="muted"
          >
            <div className="flex items-center justify-center h-full py-6">
              <SingleBubble />
            </div>
          </Panel>

          {/* DIVIDER arrow on desktop */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
                Scale it
              </span>
              <div className="w-px h-24" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary) / 0.4), transparent)" }} />
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "hsl(var(--primary))" }}>
                ×1,000
              </span>
            </div>
          </div>

          {/* RIGHT: Factory — thousand chats through the standard */}
          <Panel
            tag="The factory"
            title="A thousand chats. One standard. Every output accountable."
            body="Every prompt inherits the standard. Every output strengthens it."
            tone="liza"
          >
            <FactoryVisual />
          </Panel>
        </div>

        <p className="mt-12 text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          That is what Liza is. Not a better chat. The factory underneath every chat.
        </p>
      </div>
    </section>
  );
}

/* ---------- Panels ---------- */
function Panel({
  tag, title, body, tone, children,
}: {
  tag: string;
  title: string;
  body: string;
  tone: "muted" | "liza";
  children: React.ReactNode;
}) {
  const isLiza = tone === "liza";
  const accent = isLiza ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))";
  return (
    <div
      className="relative rounded-2xl border overflow-hidden flex flex-col"
      style={{
        background: isLiza ? "hsl(var(--primary) / 0.04)" : "hsl(var(--card))",
        borderColor: isLiza ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))",
        boxShadow: isLiza
          ? "0 24px 60px -32px hsl(var(--primary) / 0.5)"
          : "0 12px 30px -24px hsl(var(--foreground) / 0.2)",
      }}
    >
      <div className="px-5 pt-5">
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
          style={{
            color: accent,
            background: isLiza ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted-foreground) / 0.08)",
            border: `1px solid ${accent}33`,
          }}
        >
          {isLiza ? <Factory className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
          {tag}
        </span>
        <h3 className="mt-3 text-lg md:text-xl font-black leading-snug text-foreground">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>
      <div className="flex-1 px-5 pb-5 pt-3">{children}</div>
    </div>
  );
}

/* ---------- Visuals ---------- */
function SingleBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div
        className="px-5 py-4 rounded-2xl rounded-bl-sm border text-sm font-medium"
        style={{
          background: "hsl(var(--background))",
          borderColor: "hsl(var(--border))",
          color: "hsl(var(--foreground))",
          boxShadow: "0 8px 24px -16px hsl(var(--foreground) / 0.25)",
        }}
      >
        "Draft the response."
      </div>
      <p className="mt-3 text-center text-[11px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
        Works. Once.
      </p>
    </motion.div>
  );
}

function FactoryVisual() {
  // 12 chat bubbles flowing through the standards bar.
  const bubbles = Array.from({ length: 12 });
  return (
    <div className="relative h-full min-h-[220px] flex flex-col justify-between gap-4 pt-2">
      {/* INPUT row: many chats */}
      <div className="grid grid-cols-6 gap-2">
        {bubbles.map((_, i) => (
          <motion.div
            key={`in-${i}`}
            initial={{ opacity: 0, y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="h-6 rounded-md border"
            style={{
              background: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
            }}
          />
        ))}
      </div>

      {/* The standards bar (the factory floor) */}
      <div className="relative">
        <div
          className="relative rounded-lg px-3 py-2.5 border flex items-center justify-between gap-3 overflow-hidden"
          style={{
            background: "hsl(var(--primary) / 0.08)",
            borderColor: "hsl(var(--primary) / 0.4)",
          }}
        >
          {/* pulsing flow line */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1/3"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.18), transparent)",
            }}
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
          <span className="relative text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: "hsl(var(--primary))" }}>
            The standard
          </span>
          <span className="relative text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground hidden sm:inline">
            policy · tokens · data · KPIs
          </span>
        </div>
      </div>

      {/* OUTPUT row: same shape, now accountable (primary tint) */}
      <div className="grid grid-cols-6 gap-2">
        {bubbles.map((_, i) => (
          <motion.div
            key={`out-${i}`}
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.04 }}
            className="h-6 rounded-md border"
            style={{
              background: "hsl(var(--primary) / 0.12)",
              borderColor: "hsl(var(--primary) / 0.4)",
              boxShadow: "0 0 12px -4px hsl(var(--primary) / 0.4)",
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.14em] uppercase pt-1">
        <span className="text-muted-foreground">1,000 prompts in</span>
        <span style={{ color: "hsl(var(--primary))" }}>1,000 accountable outputs</span>
      </div>
    </div>
  );
}