"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function CTA() {
  const rootRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".cta-head .hero-char", {
        yPercent: 110,
        stagger: 0.015,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cta-head", start: "top 80%" },
      });

      gsap.from(".cta-sub", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cta-sub", start: "top 85%" },
      });

      gsap.from(".cta-btn", {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cta-btn", start: "top 90%" },
      });

      // Magnetic
      const btn = btnRef.current;
      if (btn) {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
        const move = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        btn.addEventListener("mousemove", move);
        btn.addEventListener("mouseleave", leave);
        return () => {
          btn.removeEventListener("mousemove", move);
          btn.removeEventListener("mouseleave", leave);
        };
      }
    },
    { scope: rootRef },
  );

  const headline = "Stop rebuilding the 80%.";

  return (
    <section ref={rootRef} className="relative py-32 sm:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>
      <div className="absolute inset-0 grid-bg opacity-30 mask-fade-y pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-cyan-400">
          [ 04 ] — Start
        </div>

        <h2
          className="cta-head text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-tight"
          style={{ perspective: "600px" }}
        >
          {headline.split("").map((ch, i) => (
            <span key={i} className="char-mask">
              <span className="hero-char char">{ch === " " ? "\u00a0" : ch}</span>
            </span>
          ))}
        </h2>

        <p className="cta-sub mt-6 text-lg text-muted max-w-xl mx-auto leading-relaxed">
          Install Archon, wrap your LLM calls, ship with budgets, observability, and governance from day one.
        </p>

        <div className="cta-btn mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            ref={btnRef}
            href="/dashboard"
            className="group relative inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-medium"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 bg-[length:200%_100%] animate-[shimmer_4s_linear_infinite]" />
            <span className="absolute inset-[2px] rounded-full bg-background" />
            <span className="relative gradient-text">Open dashboard</span>
            <svg viewBox="0 0 16 16" fill="none" className="relative h-3.5 w-3.5 text-emerald-400 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} stroke="currentColor">
              <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <a
            href="https://github.com/yash1511-bogam/archon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-7 text-sm font-medium hover:border-border-strong hover:bg-white/[0.02] transition-colors"
          >
            Read the docs
          </a>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 font-mono text-xs text-subtle">
          <span>Apache-2.0</span>
          <span className="opacity-40">•</span>
          <span>Rust + Python + TypeScript</span>
          <span className="opacity-40">•</span>
          <span>128 tests</span>
        </div>
      </div>
    </section>
  );
}
