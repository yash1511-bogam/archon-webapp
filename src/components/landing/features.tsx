"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DollarSign,
  ShieldCheck,
  Activity,
  Brain,
  FlaskConical,
  Scale,
} from "lucide-react";

const FEATURES = [
  {
    icon: DollarSign,
    title: "Cost Control",
    blurb:
      "Hard per-run, per-day, per-month budgets. Auto-route to the cheapest model that can handle the task. No surprise bills.",
    meta: "60–70% savings on typical workloads",
    accent: "emerald",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    blurb:
      "Default-deny policy engine. Subprocess sandbox for tool execution. Seven-category output sanitizer blocks prompt injection.",
    meta: "Zero trust, by default",
    accent: "cyan",
  },
  {
    icon: Activity,
    title: "Observability",
    blurb:
      "Built-in trace store and dashboard. Every run returns cost, step count, and a trace URL. No 'add observability later' step.",
    meta: "SQLite, WAL mode, zero deps",
    accent: "emerald",
  },
  {
    icon: Brain,
    title: "Memory",
    blurb:
      "Four tiers — working, episodic, semantic, procedural. Temporal decay with configurable half-life. Auto-consolidation.",
    meta: "Remember what matters, forget what doesn't",
    accent: "cyan",
  },
  {
    icon: FlaskConical,
    title: "Evaluation",
    blurb:
      "Inline schema checks, async quality scoring, regression detection. Shadow deployments to validate before promoting.",
    meta: "Continuous quality signal",
    accent: "emerald",
  },
  {
    icon: Scale,
    title: "Governance",
    blurb:
      "Event sourcing for every action. RBAC for tool permissions. GDPR-compliant data export and right-to-erasure.",
    meta: "Audit trail that survives erasure",
    accent: "cyan",
  },
] as const;

export function Features() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      gsap.set(cards, { y: 60, opacity: 0, scale: 0.96 });
      gsap.set(".features-heading .hero-char", { yPercent: 110 });

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.0,
            stagger: 0.08,
            ease: "elastic.out(1, 0.8)",
          }),
      });

      gsap.to(".features-heading .hero-char", {
        yPercent: 0,
        duration: 1.0,
        stagger: 0.015,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".features-heading",
          start: "top 80%",
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="features"
      className="relative py-32 sm:py-40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mb-16">
          <div className="mb-4 font-mono text-xs uppercase tracking-widest text-emerald-400">
            [ 01 ] — Capabilities
          </div>
          <h2
            className="features-heading text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
            style={{ perspective: "600px" }}
          >
            {"The 80% nobody wants to build twice.".split("").map((ch, i) => (
              <span key={i} className="char-mask">
                <span className="hero-char char">{ch === " " ? "\u00a0" : ch}</span>
              </span>
            ))}
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Every agent framework solves the same 20% — call the LLM, run a tool, return an answer. Archon ships the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

type FeatureCardProps = (typeof FEATURES)[number];

function FeatureCard({ icon: Icon, title, blurb, meta, accent }: FeatureCardProps) {
  const accentColor =
    accent === "emerald" ? "text-emerald-400" : "text-cyan-400";
  const glowColor =
    accent === "emerald" ? "rgba(16,185,129,0.15)" : "rgba(6,182,212,0.12)";

  return (
    <div
      className="feature-card glow-border group relative rounded-2xl p-6 glass transition-all duration-500 hover:bg-white/[0.02]"
      style={{
        ["--card-glow" as string]: glowColor,
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 0%, ${glowColor}, transparent 70%)`,
        }}
      />
      <div className="relative">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 mb-5">
          <Icon className={`h-5 w-5 ${accentColor}`} strokeWidth={1.8} />
        </div>
        <h3 className="text-lg font-semibold mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-muted leading-relaxed mb-5">{blurb}</p>
        <div className="pt-4 border-t border-border">
          <span className={`font-mono text-xs ${accentColor}`}>{meta}</span>
        </div>
      </div>
    </div>
  );
}
