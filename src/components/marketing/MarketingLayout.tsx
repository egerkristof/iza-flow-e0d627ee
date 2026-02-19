import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Platform", href: "/platform" },
  { label: "Advisory", href: "/advisory" },
  { label: "For Professional Services", href: "/for-professional-services" },
  { label: "Manifesto", href: "/manifesto" },
];

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "hsl(222 20% 4% / 0.95)"
            : "hsl(222 20% 4% / 0.6)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled ? "1px solid hsl(222 14% 13%)" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/liza" className="flex items-center gap-3 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: "var(--gradient-brand-btn)" }}
            >
              L
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              LIZA <span className="text-muted-foreground font-normal">OS</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const isActive = location.pathname === n.href || (n.href !== "/liza" && location.pathname.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  to={n.href}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    background: isActive ? "hsl(var(--primary) / 0.08)" : "transparent",
                  }}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://calendar.app.google/3v8jevUcsgRQnLyL9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 20px -4px hsl(200 90% 52% / 0.4)",
              }}
            >
              Book a Discovery Call
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t"
            style={{ background: "hsl(222 20% 4%)", borderColor: "hsl(222 14% 13%)" }}
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  to={n.href}
                  className="px-4 py-3 rounded-lg text-sm font-medium"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {n.label}
                </Link>
              ))}
              <a
                href="https://calendar.app.google/3v8jevUcsgRQnLyL9"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-5 py-3 rounded-lg text-sm font-semibold text-center"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                Book a Discovery Call
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer
        className="border-t mt-32"
        style={{ borderColor: "hsl(222 14% 13%)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                style={{ background: "var(--gradient-brand-btn)" }}
              >
                L
              </div>
              <span className="font-bold text-lg tracking-tight">LIZA OS</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              The knowledge-activated execution engine for the knowledge economy.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>Product</p>
              <div className="flex flex-col gap-2">
                {NAV.map((n) => (
                  <Link key={n.href} to={n.href} className="text-sm hover:text-foreground transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>Start</p>
              <div className="flex flex-col gap-2">
                <a href="https://calendar.app.google/3v8jevUcsgRQnLyL9" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-foreground transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>Book a Call</a>
                <Link to="/for-professional-services" className="text-sm hover:text-foreground transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>Apply for a Sprint</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6 border-t flex items-center justify-between" style={{ borderColor: "hsl(222 14% 13%)" }}>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>© 2025 LIZA OS. All rights reserved.</p>
          <p className="text-xs brand-gradient-text font-semibold">Turn judgment into infrastructure.</p>
        </div>
      </footer>
    </div>
  );
}
