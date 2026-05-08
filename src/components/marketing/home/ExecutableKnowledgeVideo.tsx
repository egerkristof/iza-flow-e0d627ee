import { motion } from "framer-motion";

export function ExecutableKnowledgeVideo() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-3">
            What executable knowledge looks like in practice
          </p>
          <h2 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight max-w-3xl mx-auto">
            One policy. <span className="text-primary">Every AI tool, every team, in lockstep by Friday.</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden border"
          style={{
            borderColor: "hsl(var(--border))",
            boxShadow: "0 30px 80px -30px hsl(var(--primary) / 0.35), 0 12px 30px -16px hsl(var(--foreground) / 0.15)",
          }}
        >
          <video
            src="/videos/executable-knowledge.mp4"
            poster="/videos/executable-knowledge-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-auto block"
            aria-label="Three business moments showing how a published policy becomes an executable standard across every AI tool"
          />
        </motion.div>
      </div>
    </section>
  );
}