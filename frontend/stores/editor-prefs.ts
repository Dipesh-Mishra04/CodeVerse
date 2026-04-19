"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EditorTheme = "vs-dark" | "light" | "hc-black";

type State = {
  fontSize: number;
  tabSize: 2 | 4;
  theme: EditorTheme;
  autoFormatOnSave: boolean;
  setFontSize: (n: number) => void;
  setTabSize: (n: 2 | 4) => void;
  setTheme: (t: EditorTheme) => void;
  setAutoFormatOnSave: (v: boolean) => void;
};

export const useEditorPrefs = create<State>()(
  persist(
    (set) => ({
      fontSize: 14,
      tabSize: 2,
      theme: "vs-dark",
      autoFormatOnSave: false,
      setFontSize: (n) => set({ fontSize: Math.min(20, Math.max(12, n)) }),
      setTabSize: (tabSize) => set({ tabSize }),
      setTheme: (theme) => set({ theme }),
      setAutoFormatOnSave: (autoFormatOnSave) => set({ autoFormatOnSave }),
    }),
    { name: "codeverse-editor-prefs" }
  )
);
