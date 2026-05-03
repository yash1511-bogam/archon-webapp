"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Route, Cpu, CheckCircle2, FileText } from "lucide-react";

const GATES = [
  {
    id: "policy",
    icon: Shield,
    title: "Policy Check",
    label: "Gate 01",
    description:
      "Is this tool allowed? Are the args within bounds? The default-deny engine evaluates every invocation before it runs.",
    detail: "< 1ms overhead",
  },
  {
    id: "route",
    icon: Route,
    title: "Model Routing",
    label: "Gate 02",
    description:
      "Classify complexity from 27 lexical signals. Pick the cheapest model for the tier. Downgrade when budget tightens.",
    detail: "Sub-ms, no LLM call",
  },
  {
    id: "execute",
    icon: Cpu,
    title: "Execute",
    label: "Gate 03",
    description:
      "Call the LLM via LiteLLM (140+ models). Tool calls run in a sandboxed subprocess with a hard timeout.",
    detail: "Isolated. Timed. Traced.",
  },
  {
    id: "validate",
    icon: CheckCircle2,
    title: "Validate Output",
    label: "Gate 04",
    description:
      "Schema check on structured output. Strip injection patterns across seven categories. Detect loops.",
    detail: "Seven injection categories",
  },
  {
    id: "log",
    icon: FileText,
    title: "Log Trace",
    label: "Gate 05",
    description:
      "Record model, tokens, cost, latency, tool calls, routing decision. Append to immutable audit log.",
    detail: "SQLite WAL, append-only",
  },
] as const;

export function Pipeline() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const gates = gsap.utils.toArray<HTMLElement>(".pipeline-gate");
      const connectors = gsap.utils.toArray<SVGPathElement>(".pipeline-connector");

      // Initial: all inactive
      gsap.set(gates, { opacity: 0.25 });
      gsap.set(".pipeline-gate-body", { opacity: 0, y: 20 });
      connectors.forEach((c) => {
        const len = c.getTotalLength();
        gsap.set(c, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=3500",
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
        },
      });

      gates.forEach((gate, i) => {
        tl.to(
          gate,
          { opacity: 1, duration: 0.3 },
          i * 0.8,
        );
        const body = gate.querySelector(".pipeline-gate-body");
        if (body) {
          tl.to(
            body,
            { opacity: 1, y: 0, duration: 0.4 },
            i * 0.8 + 0.1,
          );
        }
        if (connectors[i]) {
          tl.to(
            connectors[i],
            { strokeDashoffset: 0, duration: 0.5, ease: "none" },
            i * 0.8 + 0.3,
          );
        }
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="pipeline" className="relative">
      <div ref={pinRef} className="min-h-screen flex flex-col justify-center py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <div className="mb-4 font-mono text-xs uppercase tracking-widest text-cyan-400">
              [ 02 ] — The five-gate pipeline
            </div>
            <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight">
              Every LLM call passes{" "}
              <span className="gradient-text">five gates</span>.
            </h2>
            <p className="mt-5 text-lg text-muted leading-relaxed">
              Request comes in. It leaves with an answer, a cost, and a trace. What happens between is deterministic, observable, and safe.
            </p>
          </div>

          <div className="relative">
            {/* Decorative SVG connectors — drawn in by ScrollTrigger */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
              preserveAspectRatio="none"
              viewBox="0 0 1000 200"
            >
              <defs>
                <linearGradient id="pipeline-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              {/* Four connectors between five gates */}
              {[0, 1, 2, 3].map((i) => (
                <path
                  key={i}
                  className="pipeline-connector"
                  d={`M ${100 + i * 200} 100 L ${300 + i * 200} 100`}
                  stroke="url(#pipeline-grad)"
                  strokeWidth="1.5"
                  fill="none"
                />
              ))}
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-2">
              {GATES.map((g, idx) => (
                <GateCard key={g.id} gate={g} index={idx} />
              ))}
            </div>
          </div>

          <div className="mt-16 flex items-center justify-center gap-3 font-mono text-xs text-subtle">
            <span className="h-px w-12 bg-border" />
            <span>
              <span className="text-foreground">Request</span>
              <span className="mx-2 text-subtle">→</span>
              <span className="gradient-text">5 Gates</span>
              <span className="mx-2 text-subtle">→</span>
              <span className="text-foreground">AgentResult</span>
              <span className="ml-2 text-subtle">(output, cost, trace_url)</span>
            </span>
            <span className="h-px w-12 bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
}

type GateCardProps = {
  gate: (typeof GATES)[number];
  index: number;
};

function GateCard({ gate, index }: GateCardProps) {
  const Icon = gate.icon;
  return (
    <div className="pipeline-gate relative flex flex-col">
      <div className="glass-strong rounded-xl p-5 min-h-[240px] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">
            {gate.label}
          </span>
          <span className="font-mono text-[10px] text-emerald-400">
            {String(index + 1).padStart(2, "0")}/05
          </span>
        </div>
        <div className="pipeline-gate-body">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/5 mb-4">
            <Icon className="h-4 w-4 text-emerald-400" strokeWidth={1.8} />
          </div>
          <h3 className="text-base font-semibold mb-2 tracking-tight">
            {gate.title}
          </h3>
          <p className="text-xs text-muted leading-relaxed mb-4">
            {gate.description}
          </p>
          <div className="pt-3 border-t border-border">
            <span className="font-mono text-[10px] text-cyan-400">
              {gate.detail}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
