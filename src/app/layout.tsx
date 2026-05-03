import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/convex-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Archon — The production harness for AI agents",
  description:
    "Cost control, security, observability, memory, evaluation, and governance for AI agents. Archon wraps around your LLM calls — not the other way around.",
  keywords: [
    "AI agents",
    "LLM",
    "agent framework",
    "observability",
    "cost control",
    "Archon",
  ],
  authors: [{ name: "Archon" }],
  openGraph: {
    title: "Archon — The production harness for AI agents",
    description:
      "Budgets, sandboxing, tracing, memory, eval, governance — the 80% every agent team rebuilds. Archon ships that as the framework.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Archon",
    description: "The production harness for AI agents.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
      appearance={{
        variables: {
          colorPrimary: "#10b981",
          colorBackground: "#ffffff",
          colorInputBackground: "#f4f4f5",
          colorInputText: "#09090b",
          colorText: "#09090b",
          colorTextSecondary: "#71717a",
          borderRadius: "10px",
        },
        elements: { card: "shadow-2xl" },
      }}
    >
      <html
        lang="en"
        className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full bg-background text-foreground noise">
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
