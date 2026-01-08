import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CodeArena | Practice DSA Like LeetCode",
  description:
    "Practice Data Structures & Algorithms with real-time compiler, analytics, and 3D visualizations.",
  keywords: [
    "DSA",
    "LeetCode Clone",
    "Coding Practice",
    "Algorithms",
    "Interview Preparation",
  ],
  authors: [{ name: "CodeArena Team" }],
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
        className={`${inter.variable} font-sans bg-neutral-950 text-white antialiased`}
      >
        {/* ================= APP ROOT ================= */}
        {children}
      </body>
    </html>
  );
}
