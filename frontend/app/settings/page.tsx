"use client";

import { useThemeStore } from "@/stores/theme-store";
import { useEditorPrefs } from "@/stores/editor-prefs";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const theme = useThemeStore();
  const editor = useEditorPrefs();

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-[var(--cv-text-secondary)]">
        Profile persistence will use Supabase once the API routes are connected.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr]">
        <nav className="space-y-1 text-sm">
          <p className="font-semibold text-[var(--cv-text-primary)]">Profile</p>
          <p className="text-[var(--cv-text-muted)]">Preferences</p>
          <p className="text-[var(--cv-text-muted)]">Security</p>
        </nav>

        <div className="space-y-10">
          <section className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-6">
            <h2 className="text-lg font-semibold">Profile</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Username</label>
                <Input className="mt-1" placeholder="coder_handle" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea className="mt-1" placeholder="Tell the community about you" />
              </div>
            </div>
            <Button
              variant="primary"
              className="mt-6"
              onClick={() => toast.success("Saved locally (stub)")}
            >
              Save profile
            </Button>
          </section>

          <section className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-6">
            <h2 className="text-lg font-semibold">Preferences</h2>
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-[var(--cv-text-muted)]">
                    Dark / light mode (CSS tokens)
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => theme.toggle()}
                >
                  {theme.mode === "dark" ? "Dark" : "Light"}
                </Button>
              </div>

              <div>
                <p className="font-medium">Editor font size</p>
                <input
                  type="range"
                  min={12}
                  max={20}
                  value={editor.fontSize}
                  onChange={(e) => editor.setFontSize(Number(e.target.value))}
                  className="mt-2 w-full"
                />
                <p className="mt-1 text-xs text-[var(--cv-text-muted)]">
                  {editor.fontSize}px
                </p>
              </div>

              <div>
                <p className="font-medium">Editor theme</p>
                <select
                  value={editor.theme}
                  onChange={(e) =>
                    editor.setTheme(e.target.value as typeof editor.theme)
                  }
                  className="mt-2 h-10 w-full max-w-xs rounded-md border border-[var(--cv-border)] bg-[var(--cv-elevated)] px-3 text-sm"
                >
                  <option value="vs-dark">vs-dark</option>
                  <option value="light">light</option>
                  <option value="hc-black">hc-black</option>
                </select>
              </div>

              <div>
                <p className="font-medium">Tab size</p>
                <div className="mt-2 flex gap-2">
                  <Button
                    variant={editor.tabSize === 2 ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => editor.setTabSize(2)}
                  >
                    2 spaces
                  </Button>
                  <Button
                    variant={editor.tabSize === 4 ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => editor.setTabSize(4)}
                  >
                    4 spaces
                  </Button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editor.autoFormatOnSave}
                  onChange={(e) => editor.setAutoFormatOnSave(e.target.checked)}
                />
                Auto-format on save (requires backend formatter)
              </label>

              <p className="text-sm text-[var(--cv-text-muted)]">
                Daily email reminders: toggle shown — backend mailer not wired yet.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-[var(--cv-border)] bg-[var(--cv-surface)] p-6">
            <h2 className="text-lg font-semibold text-[var(--cv-error)]">Danger zone</h2>
            <p className="mt-2 text-sm text-[var(--cv-text-secondary)]">
              Account deletion will call Supabase admin APIs from the Node server.
            </p>
            <Button variant="danger" className="mt-4" disabled>
              Delete account
            </Button>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
