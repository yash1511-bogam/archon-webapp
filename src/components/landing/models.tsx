"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const COUNTERS = [
  { label: "Models in registry", value: 140, suffix: "+", prefix: "" },
  { label: "Providers", value: 17, suffix: "", prefix: "" },
  { label: "Avg cost reduction", value: 65, suffix: "%", prefix: "" },
  { label: "Trace overhead", value: 1, suffix: "ms", prefix: "<" },
] as const;

const PROVIDERS = [
  "OpenAI",
  "Anthropic",
  "Google",
  "xAI",
  "DeepSeek",
  "Meta",
  "Mistral",
  "Alibaba",
  "Cohere",
  "AI21",
  "Microsoft",
  "Moonshot",
  "Amazon",
  "Perplexity",
  "Zhipu",
  "Groq",
  "Together AI",
  "Fireworks",
  "Cerebras",
  "OpenRouter",
];

const TIERS = [
  {
    tier: "Simple",
    use: "Short queries, formatting, yes/no",
    models: "Gemini 2.5 Flash · GPT-4.1 Nano",
    price: "$0.10 – $0.50",
    share: "60%",
    color: "emerald",
  },
  {
    tier: "Standard",
    use: "Reasoning, code gen, analysis",
    models: "Claude Sonnet 4.6 · GPT-4.1 Mini",
    price: "$1 – $3",
    share: "25%",
    color: "cyan",
  },
  {
    tier: "Complex",
    use: "Multi-step reasoning, architecture",
    models: "Claude Opus 4.6 · o4-mini",
    price: "$5 – $25",
    share: "15%",
    color: "amber",
  },
] as const;

export function Models() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const counters = gsap.utils.toArray<HTMLElement>(".counter");
      counters.forEach((el) => {
        const target = parseFloat(el.dataset.value || "0");
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 2.2,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent = Math.round(obj.val).toString();
              },
            });
          },
        });
      });

      gsap.from(".tier-row", {
        opacity: 0,
        x: -40,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tier-table", start: "top 80%" },
      });

      gsap.from(".tier-bar", {
        scaleX: 0,
        transformOrigin: "left",
        stagger: 0.12,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".tier-table", start: "top 75%" },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="models" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mb-16">
          <div className="mb-4 font-mono text-xs uppercase tracking-widest text-emerald-400">
            [ 03 ] — Model registry
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight">
            One registry.{" "}
            <span className="gradient-text">Every model.</span>
          </h2>
          <p className="mt-5 text-lg text-muted leading-relaxed">
            Pricing for every major model, used live by the router for cost-aware selection. Pin one, filter by budget, or let it pick.
          </p>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {COUNTERS.map((c) => (
            <div key={c.label} className="glass rounded-xl p-6 border border-border">
              <div className="flex items-baseline gap-1 text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-tight">
                {c.prefix && <span className="text-muted text-2xl">{c.prefix}</span>}
                <span className="counter gradient-text tabular-nums" data-value={c.value}>
                  0
                </span>
                <span className="text-muted text-2xl">{c.suffix}</span>
              </div>
              <div className="mt-2 text-sm text-muted">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Providers ticker */}
        <div className="mb-20 mask-fade-x">
          <div className="flex w-max" style={{ animation: "ticker 40s linear infinite" }}>
            {[...PROVIDERS, ...PROVIDERS].map((p, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center gap-3 px-8 py-4 font-mono text-sm text-muted"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Tier table */}
        <div className="tier-table glass-strong rounded-2xl overflow-hidden border border-border">
          <div className="hidden md:grid grid-cols-[1fr_1.2fr_1.5fr_0.8fr_1fr] gap-4 px-6 py-4 border-b border-border font-mono text-xs uppercase tracking-widest text-subtle">
            <div>Tier</div>
            <div>Use case</div>
            <div>Default models</div>
            <div>Price $/MTok</div>
            <div>Traffic</div>
          </div>
          {TIERS.map((t) => {
            const dot =
              t.color === "emerald"
                ? "bg-emerald-500"
                : t.color === "cyan"
                  ? "bg-cyan-500"
                  : "bg-amber-500";
            const bar =
              t.color === "emerald"
                ? "from-emerald-500/70 to-emerald-500/10"
                : t.color === "cyan"
                  ? "from-cyan-500/70 to-cyan-500/10"
                  : "from-amber-500/70 to-amber-500/10";
            return (
              <div
                key={t.tier}
                className="tier-row grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1.5fr_0.8fr_1fr] gap-4 px-6 py-5 border-b border-border last:border-b-0 items-center hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dot} shadow-[0_0_8px_currentColor]`} />
                  <span className="font-semibold">{t.tier}</span>
                </div>
                <div className="text-sm text-muted">{t.use}</div>
                <div className="font-mono text-xs text-muted">{t.models}</div>
                <div className="font-mono text-xs text-foreground">{t.price}</div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`tier-bar absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${bar}`}
                      style={{ width: t.share }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted tabular-nums w-10 text-right">
                    {t.share}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-subtle text-center font-mono">
          Typical 60/25/15 split saves 60–70% vs sending everything to a frontier model.
        </p>
      </div>
    </section>
  );
}
