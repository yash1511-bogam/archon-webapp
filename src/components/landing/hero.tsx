"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";

/* Headline: split into chars for stagger reveal. Using manual split to
   avoid SplitText's licensing assumptions. Each char wrapped in a mask. */

const HEADLINE_LINES = [
  "The production harness",
  "for AI agents.",
];

const CODE_SNIPPET = `from archon import Agent, tool, Budget

@tool
def search(query: str) -> str:
    """Search the web."""
    return web_search(query)

agent = Agent(
    name="researcher",
    tools=[search],
    model="auto",
    budget=Budget(max_per_run=0.50),
)

result = await agent.run("Why did SVB fail?")
print(f"\${result.cost:.4f} / {result.step_count} steps")`;

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      // Register SplitText if available at runtime; our manual split still works without it.
      try {
        gsap.registerPlugin(SplitText);
      } catch {
        /* SplitText is a premium plugin; we use our manual DOM split as primary */
      }

      const chars = gsap.utils.toArray<HTMLElement>(".hero-char");
      gsap.set(chars, { yPercent: 110, rotateX: -40 });
      gsap.set(".hero-eyebrow", { y: 20, opacity: 0 });
      gsap.set(".hero-sub", { y: 20, opacity: 0 });
      gsap.set(".hero-ctas > *", { y: 20, opacity: 0 });
      gsap.set(".hero-code", { y: 40, opacity: 0, scale: 0.97 });
      gsap.set(".hero-orb", { scale: 0.4, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(".hero-orb", {
        scale: 1,
        opacity: 1,
        duration: 2.4,
        stagger: 0.15,
        ease: "power2.out",
      })
        .to(
          ".hero-eyebrow",
          { y: 0, opacity: 1, duration: 0.8 },
          "-=2.0",
        )
        .to(
          chars,
          {
            yPercent: 0,
            rotateX: 0,
            duration: 1.1,
            stagger: 0.018,
          },
          "-=1.6",
        )
        .to(
          ".hero-sub",
          { y: 0, opacity: 1, duration: 0.9 },
          "-=0.6",
        )
        .to(
          ".hero-ctas > *",
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
          "-=0.6",
        )
        .to(
          ".hero-code",
          { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
          "-=0.9",
        );

      // Magnetic CTA — quickTo for smooth follow
      const btn = ctaRef.current;
      if (btn) {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3" });
        const handleMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * 0.3;
          const dy = (e.clientY - cy) * 0.3;
          xTo(dx);
          yTo(dy);
        };
        const handleLeave = () => {
          xTo(0);
          yTo(0);
        };
        btn.addEventListener("mousemove", handleMove);
        btn.addEventListener("mouseleave", handleLeave);
        return () => {
          btn.removeEventListener("mousemove", handleMove);
          btn.removeEventListener("mouseleave", handleLeave);
        };
      }
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      <BackgroundOrbs />
      <div className="absolute inset-0 grid-bg opacity-40 mask-fade-y pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 mb-6 glass">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              v1.0 — 140+ models, 17 providers
            </span>
          </div>

          <h1
            className="max-w-5xl text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-tight"
            style={{ perspective: "800px" }}
          >
            {HEADLINE_LINES.map((line, lineIdx) => (
              <span key={lineIdx} className="block">
                {line.split(" ").map((word, wordIdx) => (
                  <span key={wordIdx} className="inline-block mr-[0.25em]">
                    {word.split("").map((ch, charIdx) => (
                      <span
                        key={charIdx}
                        className="char-mask"
                        style={{ verticalAlign: "top" }}
                      >
                        <span
                          className={cn(
                            "hero-char char",
                            lineIdx === 1 && "gradient-text",
                          )}
                        >
                          {ch}
                        </span>
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero-sub mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted">
            Cost control, security, observability, memory, evaluation, and
            governance — Archon wraps around your LLM calls, not the other way
            around.
          </p>

          <div className="hero-ctas mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Link
              ref={ctaRef}
              href="/dashboard"
              className="group relative inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-medium text-black shadow-[0_0_40px_-8px_rgba(16,185,129,0.7)] hover:bg-emerald-400 transition-colors"
            >
              Start building
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} stroke="currentColor">
                <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href="https://github.com/yash1511-bogam/archon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-6 text-sm font-medium text-foreground hover:border-border-strong hover:bg-white/[0.02] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 007.86 10.92c.57.1.78-.25.78-.55v-2.06c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.3-.51-1.48.11-3.08 0 0 .97-.31 3.18 1.18a11 11 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.6.23 2.79.11 3.08.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.77 1.06.77 2.13v3.16c0 .3.2.66.79.55A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
              </svg>
              View on GitHub
            </a>
          </div>

          <div className="hero-ctas mt-6 flex items-center gap-6 font-mono text-xs text-subtle">
            <Signal label="pip install archon-framework" />
            <span className="hidden sm:inline opacity-50">•</span>
            <Signal label="npm install @archon-ai/sdk" />
          </div>
        </div>

        {/* Code preview */}
        <div className="hero-code mt-20 mx-auto max-w-3xl">
          <CodePreview code={CODE_SNIPPET} />
        </div>
      </div>
    </section>
  );
}

function Signal({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      {label}
    </span>
  );
}

function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="hero-orb absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[80px]" />
      <div
        className="hero-orb absolute top-40 -right-40 h-[480px] w-[480px] rounded-full bg-cyan-500/15 blur-[80px]"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="hero-orb absolute bottom-0 left-1/2 -translate-x-1/2 h-[380px] w-[780px] rounded-full bg-emerald-500/10 blur-[80px]"
      />
    </div>
  );
}

function CodePreview({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <div className="glow-border-static rounded-xl">
      <div className="glass-strong rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="ml-2 font-mono text-xs text-subtle">agent.py</span>
          <span className="ml-auto font-mono text-[10px] text-subtle uppercase tracking-widest">
            python
          </span>
        </div>
        <pre className="overflow-x-auto px-5 py-4 text-sm font-mono leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none pr-4 text-subtle/60 text-right w-8 tabular-nums">
                  {i + 1}
                </span>
                <span className="flex-1">{highlightPython(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

/** Ultra-minimal Python highlighter — keywords, strings, decorators, numbers, comments */
function highlightPython(line: string): React.ReactNode {
  const tokens: React.ReactNode[] = [];

  // Comment: early-return full line
  const commentMatch = line.match(/^(\s*)(#.*)$/);
  if (commentMatch) {
    return (
      <>
        <span>{commentMatch[1]}</span>
        <span className="text-subtle italic">{commentMatch[2]}</span>
      </>
    );
  }

  const regex =
    /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*'|@[a-zA-Z_]\w*|\b(?:from|import|def|return|await|async|class|if|else|print)\b|\b[A-Z]\w*\b|\b\d+(?:\.\d+)?\b)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) tokens.push(<span key={i++}>{line.slice(last, m.index)}</span>);
    const t = m[0];
    let cls = "";
    if (t.startsWith('"""') || t.startsWith("'''") || (t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) cls = "text-emerald-300";
    else if (t.startsWith("@")) cls = "text-cyan-400";
    else if (/^(from|import|def|return|await|async|class|if|else)$/.test(t)) cls = "text-cyan-400";
    else if (/^print$/.test(t)) cls = "text-emerald-400";
    else if (/^[A-Z]/.test(t)) cls = "text-emerald-400";
    else if (/^\d/.test(t)) cls = "text-orange-300";
    tokens.push(<span key={i++} className={cls}>{t}</span>);
    last = regex.lastIndex;
  }
  if (last < line.length) tokens.push(<span key={i++}>{line.slice(last)}</span>);
  return <>{tokens}</>;
}
