import type { Metadata } from "next";

export const metadata: Metadata = { title: "Changelog — Archon" };

const ENTRIES = [
  { version: "1.0.0", date: "May 2, 2026", changes: [
    "Initial public release",
    "Python SDK (archon-framework) and TypeScript SDK (@archon-ai/sdk)",
    "140+ model registry with pricing across 17 providers",
    "5-gate pipeline: Policy → Route → Execute → Validate → Trace",
    "Budget enforcement: per-run, per-day, per-month hard limits",
    "Pattern-based model router (27 lexical signals, sub-ms)",
    "Default-deny security policy with subprocess sandbox",
    "Seven-category output sanitizer",
    "Four-tier memory system with temporal decay",
    "Inline + async + regression evaluation engine",
    "Event sourcing, RBAC, GDPR compliance",
    "Web dashboard with real-time analytics (Convex + Clerk)",
    "SHA-256 hashed API key management",
    "MCP and A2A protocol support",
    "Pipeline orchestration with SQLite checkpointing",
    "CLI: archon traces list/show/stats/purge, archon dashboard",
  ]},
  { version: "0.3.0", date: "Apr 15, 2026", changes: [
    "Added shadow deployment runner for A/B testing agents",
    "Semantic cache with TF-IDF cosine similarity",
    "Added Moonshot Kimi K2 and xAI Grok 4 to model registry",
    "Pipeline crash recovery with checkpoint store",
  ]},
  { version: "0.2.0", date: "Mar 28, 2026", changes: [
    "Four-tier memory system (working, episodic, semantic, procedural)",
    "Governance module: event sourcing, RBAC, GDPR erasure",
    "Added Azure AI Foundry and AWS Bedrock model support",
    "Evaluation engine with regression detection",
  ]},
  { version: "0.1.0", date: "Mar 10, 2026", changes: [
    "Initial alpha release",
    "Core agent loop with budget enforcement",
    "Model router with 3-tier classification",
    "Basic trace store with SQLite WAL mode",
    "Security policy engine with sandbox",
  ]},
];

export default function ChangelogPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Changelog</h1>
      <p className="text-muted text-lg mb-12">Every release, every feature, every fix.</p>
      <div className="space-y-12">
        {ENTRIES.map((entry) => (
          <div key={entry.version} className="relative pl-8 border-l border-border">
            <div className="absolute left-0 top-1 -translate-x-1/2 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-lg font-semibold text-emerald-400">v{entry.version}</span>
              <span className="text-xs text-subtle">{entry.date}</span>
            </div>
            <ul className="space-y-2">
              {entry.changes.map((c) => (
                <li key={c} className="text-sm text-muted flex gap-2">
                  <span className="text-emerald-500 mt-1.5 flex-shrink-0">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
