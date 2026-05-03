"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Models", href: "#models" },
  { label: "Docs", href: "https://github.com/yash1511-bogam/archon" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500",
            scrolled
              ? "glass-strong border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              : "border border-transparent",
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <LogoMark />
            <span className="font-mono text-sm font-semibold tracking-tight">
              archon
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-muted px-1.5 py-0.5 rounded border border-border">
              v1
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors rounded-md"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="hidden sm:inline-flex h-9 items-center px-3.5 text-sm text-muted hover:text-foreground transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 text-sm font-medium text-black shadow-[0_0_24px_-8px_rgba(16,185,129,0.6)] hover:bg-emerald-400 transition-all hover:shadow-[0_0_32px_-4px_rgba(16,185,129,0.8)]">
                  Get started
                  <ArrowRight />
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex h-9 items-center px-3.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 ring-1 ring-white/10",
                  },
                }}
              />
            </Show>
          </div>
        </nav>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="relative h-7 w-7 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_16px_-4px_rgba(16,185,129,0.6)]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4 text-black"
        strokeWidth={2.5}
        stroke="currentColor"
      >
        <path d="M4 20 L12 4 L20 20" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 14 L16 14" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" strokeWidth={2.2} stroke="currentColor">
      <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
