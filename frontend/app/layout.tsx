import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { ThemeRoot } from "@/components/theme/ThemeRoot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CodeVerse | Practice. Learn. Grow — with AI by your side.",
  description:
    "Competitive coding practice, AI tutoring, analytics, and a multi-language sandbox — built for learners from beginner to advanced.",
  keywords: [
    "DSA",
    "LeetCode",
    "CodeVerse",
    "Algorithms",
    "Interview Prep",
    "AI Tutor",
  ],
  authors: [{ name: "CodeVerse" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <ThemeRoot>
          <AppProviders>{children}</AppProviders>
        </ThemeRoot>
      </body>
    </html>
  );
}
