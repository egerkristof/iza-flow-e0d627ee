import istvanPhoto from "@/assets/istvan-boscha.png";
import kristofPhoto from "@/assets/kristof-eger.png";

const TEAM = [
  {
    name: "István Boscha",
    role: "Data & AI Implementation",
    bio: "Founder of a Google Cloud Service partner firm. 15 years implementing data and AI solutions for digital transformation.\n\nThe core of differentiation: what no one else has vs. what digital technologies can automate.",
    linkedin: "https://www.linkedin.com/in/istv%C3%A1n-boscha-3a436328/",
    initials: "IB",
    photo: istvanPhoto,
  },
  {
    name: "Kristóf Éger",
    role: "Business Model Innovation",
    bio: "Business model innovation advisor and executive coach with years of experience defining and scaling business value.\n\nConnecting unique expertise to business outcomes—scaling what makes organizations irreplaceable: their best people.",
    linkedin: "https://www.linkedin.com/in/kristofeger/",
    initials: "KÉ",
    photo: kristofPhoto,
  },
];

interface TeamSectionProps {
  /** Dark background variant for Enterprise page */
  dark?: boolean;
}

export function TeamSection({ dark = false }: TeamSectionProps) {
  const BG  = dark ? "hsl(222 18% 8%)"  : "hsl(var(--card))";
  const C   = dark ? "210 18% 92%"       : "var(--foreground)";
  const MUT = dark ? "215 10% 50%"       : "var(--muted-foreground)";
  const PRI = "200 90% 52%";
  const GRN = "155 72% 46%";

  return (
    <section className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-6"
            style={{
              color: `hsl(${PRI})`,
              borderColor: `hsl(${PRI} / 0.25)`,
              background: `hsl(${PRI} / 0.06)`,
            }}
          >
            From the creators of LizaOS
          </p>
          <h2
            className="font-black mb-4 leading-tight"
            style={{
              fontSize: "clamp(1.85rem, 4vw, 3rem)",
              color: dark ? `hsl(${C})` : "hsl(var(--foreground))",
            }}
          >
            Who's behind this
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: dark ? `hsl(${MUT})` : "hsl(var(--muted-foreground))", lineHeight: 1.7 }}
          >
            4 years building infrastructure for complex human work.
          </p>
        </div>

        {/* Individual cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border p-8 flex flex-col gap-5 relative overflow-hidden"
              style={{
                background: dark ? `hsl(${PRI} / 0.04)` : "hsl(var(--background))",
                borderColor: `hsl(${PRI} / 0.18)`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, hsl(${PRI}), hsl(${GRN}))` }}
              />
              <div className="flex items-center gap-4">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                    style={{ border: `2px solid hsl(${PRI} / 0.3)` }}
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shrink-0"
                    style={{
                      background: `linear-gradient(135deg, hsl(${PRI} / 0.25), hsl(${GRN} / 0.2))`,
                      color: `hsl(${PRI})`,
                      border: `2px solid hsl(${PRI} / 0.3)`,
                    }}
                  >
                    {member.initials}
                  </div>
                )}
                <div>
                  <p
                    className="font-black text-lg leading-tight"
                    style={{ color: dark ? `hsl(${C})` : "hsl(var(--foreground))" }}
                  >
                    {member.name}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: `hsl(${PRI})` }}>
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {member.bio.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed"
                    style={{ color: dark ? `hsl(${MUT})` : "hsl(var(--muted-foreground))" }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
                style={{ color: `hsl(${PRI})` }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn Profile
              </a>
            </div>
          ))}
        </div>

        {/* Bottom trust nudge */}
        <div className="mt-12 text-center">
          <p
            className="text-sm"
            style={{ color: dark ? `hsl(${MUT})` : "hsl(var(--muted-foreground))" }}
          >
            Questions? Reach us directly at{" "}
            <a
              href="mailto:kristof.eger@lizaos.ai"
              className="font-semibold transition-opacity hover:opacity-80"
              style={{ color: `hsl(${PRI})` }}
            >
              kristof.eger@lizaos.ai
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
