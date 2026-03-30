import { useState, useRef, useEffect } from "react";
import { Download, Loader2, FileText, Presentation, ExternalLink, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ExportFormat = "pdf" | "pptx" | "gslides";

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

async function captureSlides(exportRef: React.RefObject<HTMLDivElement>) {
  const html2canvas = (await import("html2canvas")).default;
  const container = exportRef.current;
  if (!container) return [];
  const slideEls = Array.from(container.querySelectorAll<HTMLElement>(":scope > div"));
  const canvases: HTMLCanvasElement[] = [];

  for (const el of slideEls) {
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
    const canvas = await html2canvas(el, { width: 1920, height: 1080, scale: 2, useCORS: true, backgroundColor: null });
    affected.forEach((span, j) => { span.style.cssText = origStyles[j]; });
    canvases.push(canvas);
  }
  return canvases;
}

async function exportPdf(exportRef: React.RefObject<HTMLDivElement>, fileName: string) {
  const { jsPDF } = await import("jspdf");
  const canvases = await captureSlides(exportRef);
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
  pdf.save(`${fileName}.pdf`);
}

async function exportPptx(exportRef: React.RefObject<HTMLDivElement>, fileName: string) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const canvases = await captureSlides(exportRef);
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
) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const canvases = await captureSlides(exportRef);
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

  const blob = (await pptx.write({ outputType: "blob" })) as Blob;
  const pptxFile = new File([blob], `${fileName}.pptx`, {
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
  const storagePath = `exports/${fileName}-${Date.now()}.pptx`;

  const { error } = await supabase.storage
    .from("temp-exports")
    .upload(storagePath, pptxFile, {
      contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      upsert: true,
    });

  if (error) {
    console.error("Upload failed, falling back to download:", error);
    if (popupWindow && !popupWindow.closed) popupWindow.close();
    await pptx.writeFile({ fileName: `${fileName}.pptx` });
    return;
  }

  const { data: urlData } = supabase.storage.from("temp-exports").getPublicUrl(storagePath);
  const importUrl = `https://docs.google.com/presentation/u/0/?usp=import&url=${encodeURIComponent(urlData.publicUrl)}`;

  if (popupWindow && !popupWindow.closed) {
    popupWindow.location.href = importUrl;
    return;
  }

  const opened = window.open(importUrl, "_blank");
  if (!opened) {
    await pptx.writeFile({ fileName: `${fileName}.pptx` });
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

  const handleExport = async (format: ExportFormat) => {
    const popupWindow = format === "gslides" ? window.open("", "_blank") : null;
    if (popupWindow) {
      popupWindow.document.title = "Preparing Google Slides...";
      popupWindow.document.body.innerHTML = "<p style='font-family:sans-serif;padding:24px'>Preparing your Google Slides export...</p>";
    }

    setExporting(true);
    setActiveFormat(format);
    setOpen(false);
    await new Promise(r => setTimeout(r, 200));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(undefined))));
    await new Promise(r => setTimeout(r, 300));
    try {
      switch (format) {
        case "pdf": await exportPdf(exportRef, fileName); break;
        case "pptx": await exportPptx(exportRef, fileName); break;
        case "gslides": await exportGoogleSlides(exportRef, fileName, popupWindow); break;
      }
    } finally {
      setExporting(false);
      setActiveFormat(null);
    }
  };

  if (variant === "mobile") {
    return (
      <div ref={menuRef} className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
          disabled={exporting}
          className="p-1.5 rounded-lg disabled:opacity-50"
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
        {exporting ? "Exporting..." : "Export"}
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
