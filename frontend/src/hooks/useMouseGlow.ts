"use client";

import { useEffect, useRef, useCallback } from "react";

interface MouseGlowState {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

/**
 * useMouseGlow tracks cursor position and injects CSS custom properties
 * onto the document root for cursor-reactive lighting effects.
 *
 * Sets:
 *   --glow-x, --glow-y       : pixel position
 *   --glow-nx, --glow-ny     : normalized 0-1 position
 *   --glow-radial             : ready-to-use radial-gradient centered on cursor
 */
export function useMouseGlow() {
  const state = useRef<MouseGlowState>({ x: 0, y: 0, normalizedX: 0.5, normalizedY: 0.5 });
  const rafId = useRef<number>(0);
  const dirty = useRef(false);

  const flush = useCallback(() => {
    if (!dirty.current) return;
    dirty.current = false;

    const { x, y, normalizedX, normalizedY } = state.current;
    const root = document.documentElement.style;
    root.setProperty("--glow-x", `${x}px`);
    root.setProperty("--glow-y", `${y}px`);
    root.setProperty("--glow-nx", `${normalizedX.toFixed(4)}`);
    root.setProperty("--glow-ny", `${normalizedY.toFixed(4)}`);
    root.setProperty(
      "--glow-radial",
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(0, 229, 255, 0.06), transparent 70%)`
    );

  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      state.current = {
        x: e.clientX,
        y: e.clientY,
        normalizedX: e.clientX / window.innerWidth,
        normalizedY: e.clientY / window.innerHeight,
      };
      if (!dirty.current) {
        dirty.current = true;
        rafId.current = requestAnimationFrame(flush);
      }
    };

    // Initialize to center
    state.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      normalizedX: 0.5,
      normalizedY: 0.5,
    };
    dirty.current = true;
    flush();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [flush]);

  return state;
}
