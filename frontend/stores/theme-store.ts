"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Mode = "dark" | "light";

type State = {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggle: () => void;
};

export const useThemeStore = create<State>()(
  persist(
    (set, get) => ({
      mode: "dark",
      setMode: (mode) => set({ mode }),
      toggle: () => set({ mode: get().mode === "dark" ? "light" : "dark" }),
    }),
    { name: "codeverse-ui-theme" }
  )
);
