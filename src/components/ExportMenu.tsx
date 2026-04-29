import { useState, useRef, useEffect } from "react";
import { Download, Loader2, FileText, Presentation, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { writeGoogleSlidesPopup } from "@/lib/google-slides-popup";
import { toast } from "@/hooks/use-toast";

const STATIC_EXPORT_CACHE = new Map<string, Promise<boolean>>();

type ExportFormat = "pdf" | "pptx" | "gslides";

const isSafari = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
};

interface ExportMenuProps {
  exportRef: React.RefObject<HTMLDivElement>;
  fileName: string;
  accentColor?: string;
  /** Number of slides (for PPTX generation) */
  slideCount: number;
  /** Variant: 'desktop' shows a button, 'mobile' shows a compact icon */
  variant?: "desktop" | "mobile";
  /** Style overrides for the mobile icon button */
  iconColor?: string;
}

async function captureSlides(
  exportRef: React.RefObject<HTMLDivElement>,
  onProgress?: (current: number, total: number) => void,
) {
  const html2canvas = (await import("html2canvas")).default;
  const container = exportRef.current;
  if (!container) return [];
  const slideEls = Array.from(container.children).filter(
    (child): child is HTMLDivElement => child instanceof HTMLDivElement,
  );
  const canvases: HTMLCanvasElement[] = [];

  for (let idx = 0; idx < slideEls.length; idx++) {
    const el = slideEls[idx];
    onProgress?.(idx + 1, slideEls.length);
    // Fix gradient text for capture
    const gradientEls = el.querySelectorAll<HTMLElement>("span");
    const origStyles: string[] = [];
    const affected: HTMLElement[] = [];
    gradientEls.forEach((span) => {
      const cs = span.style.cssText;
      if (cs.includes("background-clip") || cs.includes("BackgroundClip") || cs.includes("text-fill-color") || cs.includes("TextFillColor")) {
        origStyles.push(cs);
        affected.push(span);
        span.style.cssText = "color: hsl(200 90% 42%); font: inherit;";
      }
    });
    const canvas = await html2canvas(el, {
      width: 1920,
      height: 1080,
      windowWidth: 1920,
      windowHeight: 1080,
      // Safari hits memory limits at 2x for 1920x1080; 1.5x is the sweet spot
      scale: isSafari() ? 1.5 : 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    affected.forEach((span, j) => { span.style.cssText = origStyles[j]; });
    canvases.push(canvas);
  }
  return canvases;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadFileUrl(url: string, fileName: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function getStaticExportUrl(fileName: string, format: Exclude<ExportFormat, "gslides">) {
  return `/downloads/${encodeURIComponent(fileName)}.${format}`;
}

function probeStaticExport(fileName: string, format: Exclude<ExportFormat, "gslides">) {
  const url = getStaticExportUrl(fileName, format);
  const cached = STATIC_EXPORT_CACHE.get(url);
  if (cached) return cached;

  const request = fetch(url, { method: "HEAD" })
    .then((response) => response.ok)
    .catch(() => false);

  STATIC_EXPORT_CACHE.set(url, request);
  return request;
}

async function tryStaticExport(fileName: string, format: Exclude<ExportFormat, "gslides">) {
  const available = await probeStaticExport(fileName, format);
  if (!available) return false;

  downloadFileUrl(getStaticExportUrl(fileName, format), `${fileName}.${format}`);
  return true;
}

async function exportPdf(
  exportRef: React.RefObject<HTMLDivElement>,
  fileName: string,
  onProgress?: (current: number, total: number) => void,
) {
  const { jsPDF } = await import("jspdf");
  const canvases = await captureSlides(exportRef, onProgress);
  if (!canvases.length) return;

  const A4_W = 297, A4_H = 210, MARGIN = 8;
  const contentW = A4_W - MARGIN * 2, contentH = A4_H - MARGIN * 2;
  const slideAspect = 1920 / 1080;
  const fitW = contentW, fitH = fitW / slideAspect;
  const finalW = fitH > contentH ? contentH * slideAspect : fitW;
  const finalH = fitH > contentH ? contentH : fitH;
  const offsetX = MARGIN + (contentW - finalW) / 2;
  const offsetY = MARGIN + (contentH - finalH) / 2;

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  for (let i = 0; i < canvases.length; i++) {
    if (i > 0) pdf.addPage("a4", "landscape");
    pdf.addImage(canvases[i].toDataURL("image/jpeg", 0.95), "JPEG", offsetX, offsetY, finalW, finalH);
  }
  const blob = pdf.output("blob");
  downloadBlob(blob, `${fileName}.pdf`);
}

async function exportPptx(
  exportRef: React.RefObject<HTMLDivElement>,
  fileName: string,
  onProgress?: (current: number, total: number) => void,
) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const canvases = await captureSlides(exportRef, onProgress);
  if (!canvases.length) return;

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "LIZA OS";
  pptx.title = fileName;

  for (const canvas of canvases) {
    const slide = pptx.addSlide();
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    slide.addImage({ data: imgData, x: 0, y: 0, w: "100%", h: "100%" });
  }
  await pptx.writeFile({ fileName: `${fileName}.pptx` });
}

async function exportGoogleSlides(
  exportRef: React.RefObject<HTMLDivElement>,
  fileName: string,
  popupWindow?: Window | null,
  onProgress?: (current: number, total: number) => void,
) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const canvases = await captureSlides(exportRef, onProgress);
  if (!canvases.length) {
    if (popupWindow && !popupWindow.closed) popupWindow.close();
    return;
  }

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "LIZA OS";
  pptx.title = fileName;

  for (const canvas of canvases) {
    const slide = pptx.addSlide();
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    slide.addImage({ data: imgData, x: 0, y: 0, w: "100%", h: "100%" });
  }

  // Download the file locally first
  await pptx.writeFile({ fileName: `${fileName}.pptx` });

  // Then open Google Slides with instructions
  writeGoogleSlidesPopup(popupWindow ?? null, {
    title: "Almost there!",
    message: "Your .pptx file has been downloaded. Open Google Slides and use File → Import slides to upload it.",
    primaryHref: "https://slides.google.com",
    primaryLabel: "Open Google Slides",
  });

  // If popup was blocked, just let the download speak for itself
  if (!popupWindow || popupWindow.closed) {
    window.open("https://slides.google.com", "_blank", "noopener,noreferrer");
  }
}

const FORMAT_OPTIONS: { id: ExportFormat; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "pdf", label: "PDF", icon: <FileText size={16} />, desc: "Download as PDF document" },
  { id: "pptx", label: "PowerPoint", icon: <Presentation size={16} />, desc: "Download as .pptx file" },
  { id: "gslides", label: "Google Slides", icon: <ExternalLink size={16} />, desc: "Export & open in Google Slides" },
];

export function ExportMenu({ exportRef, fileName, variant = "desktop", iconColor }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeFormat, setActiveFormat] = useState<ExportFormat | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    void Promise.all([
      probeStaticExport(fileName, "pdf"),
      probeStaticExport(fileName, "pptx"),
    ]);
  }, [fileName, open]);

  const handleExport = async (format: ExportFormat) => {
    const popupWindow = format === "gslides" ? window.open("", "_blank") : null;
    if (popupWindow) {
      writeGoogleSlidesPopup(popupWindow, {
        title: "Preparing Google Slides…",
        message: "We’re exporting your deck now and will hand it off to Google Slides automatically.",
      });
    }

    setExporting(true);
    setActiveFormat(format);
    setProgress(null);
    setOpen(false);

    const onProgress = (current: number, total: number) => setProgress({ current, total });
    let usedClientRender = false;

    try {
      if (format === "pdf" || format === "pptx") {
        const servedStatically = await tryStaticExport(fileName, format);
        if (servedStatically) {
          toast({ title: "Download started", description: `${fileName}.${format}` });
          return;
        }
      }

      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(undefined))));

      usedClientRender = true;
      if (isSafari() && format !== "gslides") {
        toast({
          title: "Rendering in browser",
          description: "Safari can be slower on large decks. If it stalls, try Chrome or wait for the static download.",
        });
      }

      switch (format) {
        case "pdf": await exportPdf(exportRef, fileName, onProgress); break;
        case "pptx": await exportPptx(exportRef, fileName, onProgress); break;
        case "gslides": await exportGoogleSlides(exportRef, fileName, popupWindow, onProgress); break;
      }
      toast({ title: "Download ready", description: `${fileName}.${format === "gslides" ? "pptx" : format}` });
    } catch (error) {
      console.error(`Export failed for ${format}`, error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: usedClientRender
          ? (isSafari()
              ? "Safari ran out of memory rendering this deck. Please try Chrome or Firefox."
              : "Could not render the deck on this device. Please try again or switch browsers.")
          : "Could not download this file. Please try again in a moment.",
      });
      if (popupWindow && !popupWindow.closed) {
        writeGoogleSlidesPopup(popupWindow, {
          title: "Export failed",
          message: "The deck could not be exported on this device. Please try again, or switch to another browser/network.",
        });
      }
    } finally {
      setExporting(false);
      setActiveFormat(null);
      setProgress(null);
    }
  };

  if (variant === "mobile") {
    return (
      <div ref={menuRef} className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
          disabled={exporting}
          className="p-1.5 rounded-lg disabled:opacity-50"
          title={progress ? `Rendering ${progress.current}/${progress.total}` : undefined}
        >
          {exporting ? (
            <Loader2 size={16} className="animate-spin" style={{ color: iconColor }} />
          ) : (
            <Download size={16} style={{ color: iconColor }} />
          )}
        </button>

        {open && (
          <div
            className="absolute bottom-full mb-2 right-0 w-56 rounded-xl border shadow-xl z-[10010] overflow-hidden"
            style={{ background: "hsl(0 0% 100%)", borderColor: "hsl(220 12% 90%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold px-3 pt-3 pb-1.5" style={{ color: "hsl(215 15% 42%)" }}>
              Download as…
            </p>
            {FORMAT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleExport(opt.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent/50 transition-colors"
              >
                <span style={{ color: "hsl(215 15% 42%)" }}>{opt.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "hsl(222 20% 10%)" }}>{opt.label}</p>
                  <p className="text-[11px]" style={{ color: "hsl(215 10% 56%)" }}>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop variant
  return (
    <div ref={menuRef} className="relative">
      <Button size="sm" variant="ghost" onClick={() => setOpen(v => !v)} disabled={exporting}>
        {exporting ? (
          <Loader2 size={15} className="mr-1.5 animate-spin" />
        ) : (
          <Download size={15} className="mr-1.5" />
        )}
        {exporting
          ? (progress ? `Rendering ${progress.current}/${progress.total}` : "Exporting…")
          : "Export"}
        <ChevronDown size={12} className={cn("ml-1 transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <div
          className="absolute top-full mt-1 right-0 w-56 rounded-xl border shadow-xl z-[100] overflow-hidden"
          style={{ background: "hsl(0 0% 100%)", borderColor: "hsl(220 12% 90%)" }}
        >
          {FORMAT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleExport(opt.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent/50 transition-colors"
            >
              <span className="text-muted-foreground">{opt.icon}</span>
              <div>
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
