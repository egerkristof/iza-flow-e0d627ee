import { useState, useEffect, useRef, useCallback } from "react";

/** Detect mobile via viewport width */
export function useIsMobileViewport(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

/** Detect portrait orientation */
export function useIsPortrait() {
  const [isPortrait, setIsPortrait] = useState(() => window.innerHeight > window.innerWidth);
  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);
  return isPortrait;
}

/** Swipe detection for touch navigation */
export function useSwipe(onLeft: () => void, onRight: () => void) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const multiTouch = useRef(false);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      // Multi-finger gesture (pinch-zoom, two-finger pan): never treat as swipe
      if (e.touches.length > 1) {
        multiTouch.current = true;
        touchStart.current = null;
        return;
      }
      multiTouch.current = false;
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      // A second finger landed mid-gesture — cancel swipe
      if (e.touches.length > 1) {
        multiTouch.current = true;
        touchStart.current = null;
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (multiTouch.current) { multiTouch.current = false; return; }
      if (!touchStart.current) return;
      // Other fingers still down: not a completed single-finger swipe
      if (e.touches.length > 0) { touchStart.current = null; return; }
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      // Stronger thresholds: horizontal must be dominant, > 60px, and mostly horizontal
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) {
        if (dx < 0) onLeft();   // swipe left = next
        else onRight();          // swipe right = prev
      }
      touchStart.current = null;
    };
    const onTouchCancel = () => {
      multiTouch.current = false;
      touchStart.current = null;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchCancel, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [onLeft, onRight]);
}
