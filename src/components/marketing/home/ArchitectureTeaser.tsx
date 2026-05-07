import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LizaOSStack } from "@/components/marketing/os/LizaOSStack";
import { SectionTag, GradientText } from "./shared";

export function ArchitectureTeaser() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <SectionTag label="Where Liza fits" />
          <h2 className="text-3xl md:text-5xl font-black leading-[1.08] tracking-tight">
            Sits between your records, your work, and{" "}
            <GradientText>every AI tool you already use.</GradientText>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            One governed standard. Every surface inherits it. Nothing gets ripped out.
          </p>
        </div>
        <LizaOSStack />
        <div className="mt-10 flex justify-center">
          <Link
            to="/os"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Explore the full architecture
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}