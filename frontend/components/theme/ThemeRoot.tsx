"use client";

import { useThemeStore } from "@/stores/theme-store";
import { useEffect } from "react";

export function ThemeRoot({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  return children;
}
