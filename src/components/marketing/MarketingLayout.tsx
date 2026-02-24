import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const NAV_LEFT = [
  { label: "Codify Senior Knowledge", href: "/for-professional-services" },
  { label: "Scale with AI", href: "/enterprise" },
  { label: "Product", href: "/product" },
];

const NAV_RIGHT = [
  { label: "Use Cases", href: "/use-cases" },
];

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl"
        style={{
          background: scrolled
            ? "hsl(var(--background) / 0.95)"
            : "hsl(var(--background) / 0.6)",
          borderBottom: scrolled ? "1px solid hsl(var(--border))" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
            >
              L
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              LIZA <span className="text-muted-foreground font-normal">OS</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[...NAV_LEFT, ...NAV_RIGHT].map((n) => {
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

          {/* CTA + Theme toggle */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg transition-colors hover:bg-accent"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Moon className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            )}
            <a
              href="https://calendar.app.google/3v8jevUcsgRQnLyL9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 20px -4px hsl(var(--primary) / 0.4)",
              }}
            >
                Book a Protocol Assessment
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            <button
              className="p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t"
            style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {[...NAV_LEFT, ...NAV_RIGHT].map((n) => (
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
                Book a Protocol Assessment
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border mt-32">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
              >
                L
              </div>
              <span className="font-bold text-lg tracking-tight">LIZA OS</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The knowledge-activated execution engine for the knowledge economy.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-muted-foreground">Product</p>
              <div className="flex flex-col gap-2">
                {[...NAV_LEFT, ...NAV_RIGHT].map((n) => (
                  <Link key={n.href} to={n.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-muted-foreground">Start</p>
              <div className="flex flex-col gap-2">
                <a href="https://calendar.app.google/3v8jevUcsgRQnLyL9" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Book a Call</a>
                <Link to="/for-professional-services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Codify Senior Knowledge</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-muted-foreground">Company</p>
              <div className="flex flex-col gap-2">
                <Link to="/manifesto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Manifesto</Link>
                <Link to="/ai-champions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For AI Leaders</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2025 LIZA OS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:kristof.eger@lizaos.ai" className="text-xs text-muted-foreground hover:text-foreground transition-colors">kristof.eger@lizaos.ai</a>
            <p className="text-xs brand-gradient-text font-semibold">Turn judgment into infrastructure.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}