import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nexus Ecosystem — Unified High-Velocity Web Platform",
    template: "%s | Nexus Ecosystem",
  },
  description:
    "Production-grade platform converging high-performance marketing, interactive algorithm visualization, developer productivity tools, and micro e-commerce.",
  keywords: [
    "Nexus",
    "Algorithm Visualizer",
    "Developer Tools",
    "Next.js 15",
    "React 19",
    "Tailwind CSS",
    "Drizzle ORM",
    "TypeScript",
  ],
  authors: [{ name: "Nexus Architecture Team" }],
  openGraph: {
    title: "Nexus Ecosystem — Unified High-Velocity Web Platform",
    description:
      "Modern full-stack platform uniting algorithm visualization, dev utilities, and high-performance commerce.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-nexus-cyan/20 selection:text-nexus-cyan">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
