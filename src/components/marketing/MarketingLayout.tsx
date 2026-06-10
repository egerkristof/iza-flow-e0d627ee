import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { ReadingProgress } from "@/components/marketing/ReadingProgress";

const NAV_ITEMS = [
  { label: "LIZA OS", href: "/" },
  { label: "Platform", href: "/os" },
  { label: "By Industry", href: "/industries" },
  { label: "By Function", href: "/by-function" },
  { label: "Find the cause", href: "/diagnostic" },
];


export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isDiagnostic = location.pathname === "/diagnostic";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24;
      if (next === scrolledRef.current) return;
      scrolledRef.current = next;
      setScrolled(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />
      {/* Nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "hsl(var(--background) / 0.98)"
            : "hsl(var(--background) / 0.9)",
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
            {NAV_ITEMS.map((n) => {
              const isActive = location.pathname === n.href;
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
            <Link
              to={isDiagnostic ? "/" : "/diagnostic"}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 20px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              {isDiagnostic ? "Explore LIZA OS" : "Take the Diagnostic"}
            </Link>
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
              {NAV_ITEMS.map((n) => (
                <Link
                  key={n.href}
                  to={n.href}
                  className="px-4 py-3 rounded-lg text-sm font-medium"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to={isDiagnostic ? "/" : "/diagnostic"}
                className="mt-2 px-5 py-3 rounded-lg text-sm font-semibold text-center"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                {isDiagnostic ? "Explore LIZA OS" : "Take the Diagnostic"}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border">
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
              The system of intelligence for how your company decides and delivers work.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-muted-foreground">Product</p>
              <div className="flex flex-col gap-2">
                <Link to="/os" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Platform</Link>
                <Link to="/industries" className="text-sm text-muted-foreground hover:text-foreground transition-colors">By Industry</Link>
                <Link to="/by-function" className="text-sm text-muted-foreground hover:text-foreground transition-colors">By Function</Link>
                <Link to="/manifesto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Manifesto</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-muted-foreground">Get Started</p>
              <div className="flex flex-col gap-2">
                <Link to="/diagnostic" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Take the Diagnostic</Link>
                <Link to="/calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">See the cost</Link>
                <a href="https://calendar.app.google/3v8jevUcsgRQnLyL9" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discovery Call</a>
                <a href="mailto:kristof.eger@lizaos.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 LIZA OS. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Use</Link>
            <a href="mailto:kristof.eger@lizaos.ai" className="text-xs text-muted-foreground hover:text-foreground transition-colors">kristof.eger@lizaos.ai</a>
            <Link to="/auth" className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">Team Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
