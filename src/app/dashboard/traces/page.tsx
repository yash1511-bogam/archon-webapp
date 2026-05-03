"use client";

import { Fragment, useState } from "react";
import { ChevronRight, Search, Shield, Route, Cpu, CheckCircle2, FileText, Circle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageHeader, Card, Badge } from "@/components/dashboard/primitives";
import { cn, formatCurrency, formatNumber, formatLatency, formatRelative } from "@/lib/utils";

const GATE_ICONS: Record<string, typeof Shield> = { policy: Shield, route: Route, execute: Cpu, validate: CheckCircle2, log: FileText };

export default function TracesPage() {
  
  
  const allRuns = useQuery(api.functions.getAllRuns) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = allRuns.filter((r) => !query || r.runId.includes(query) || r.agent.includes(query) || r.model.includes(query));

  return (
    <div className="flex-1 px-8 py-8">
      <PageHeader eyebrow="Observability" title="Traces" description="Every agent run recorded immutably. Click to inspect the five-gate pipeline." />
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" strokeWidth={1.8} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by run_id, agent, or model…"
          className="w-full bg-white/[0.02] border border-border rounded-lg pl-10 pr-3 py-2 text-sm placeholder:text-subtle focus:outline-none focus:border-emerald-500/50 transition-colors" />
      </div>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-[10px] font-mono uppercase tracking-widest text-subtle">
            <th className="px-5 py-3 font-normal w-8" /><th className="px-3 py-3 font-normal">Run ID</th><th className="px-3 py-3 font-normal">Agent</th>
            <th className="px-3 py-3 font-normal">Model</th><th className="px-3 py-3 font-normal text-right">Steps</th>
            <th className="px-3 py-3 font-normal text-right">Cost</th><th className="px-3 py-3 font-normal text-right">Latency</th>
            <th className="px-3 py-3 font-normal">Status</th><th className="px-5 py-3 font-normal text-right">Started</th>
          </tr></thead>
          <tbody>
            {filtered.map((r) => {
              const isExp = expanded === r.runId;
              return (
                <Fragment key={r._id}>
                  <tr onClick={() => setExpanded(isExp ? null : r.runId)} className={cn("border-b border-border cursor-pointer transition-colors", isExp ? "bg-white/[0.02]" : "hover:bg-white/[0.02]")}>
                    <td className="px-5 py-3"><ChevronRight className={cn("h-4 w-4 text-subtle transition-transform", isExp && "rotate-90 text-emerald-400")} /></td>
                    <td className="px-3 py-3 font-mono text-xs">{r.runId}</td>
                    <td className="px-3 py-3">{r.agent}</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted">{r.model}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{r.steps}</td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums">{formatCurrency(r.cost)}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-muted">{formatLatency(r.latency)}</td>
                    <td className="px-3 py-3"><Badge variant={r.status === "success" ? "success" : r.status === "failed" ? "danger" : "warning"}><Circle className="h-1.5 w-1.5 fill-current" />{r.status}</Badge></td>
                    <td className="px-5 py-3 text-right text-xs text-muted tabular-nums">{formatRelative(r.startedAt)}</td>
                  </tr>
                  {isExp && <tr><td colSpan={9} className="p-0"><RunDetail runId={r.runId} cost={r.cost} tokens={r.tokens} latency={r.latency} /></td></tr>}
                </Fragment>
              );
            })}
            {!filtered.length && <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-subtle">{query ? `No runs matched "${query}"` : "No runs yet. Install the SDK to get started."}</td></tr>}
          </tbody>
        </table></div>
      </Card>
    </div>
  );
}

function RunDetail({ runId, cost, tokens, latency }: { runId: string; cost: number; tokens: number; latency: number }) {
  const steps = useQuery(api.functions.getRunSteps, { runId }) ?? [];
  return (
    <div className="bg-surface/60 border-t border-border px-8 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div><div className="font-mono text-[10px] uppercase tracking-widest text-subtle mb-1">Trace ID</div><div className="text-sm font-mono">{runId.replace("run_", "trc_")}</div></div>
        <div><div className="font-mono text-[10px] uppercase tracking-widest text-subtle mb-1">Cost</div><div className="text-sm font-mono">{formatCurrency(cost)}</div></div>
        <div><div className="font-mono text-[10px] uppercase tracking-widest text-subtle mb-1">Tokens</div><div className="text-sm font-mono">{formatNumber(tokens)}</div></div>
        <div><div className="font-mono text-[10px] uppercase tracking-widest text-subtle mb-1">Latency</div><div className="text-sm font-mono">{formatLatency(latency)}</div></div>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">Step-by-step execution</div>
        <div className="font-mono text-[10px] text-subtle">{steps.length} steps</div>
      </div>
      <div className="space-y-1.5">
        {steps.map((s) => {
          const Icon = GATE_ICONS[s.gate] ?? Cpu;
          return (
            <div key={s.step} className="grid grid-cols-[40px_32px_80px_1fr_auto_auto] gap-3 items-center rounded-md border border-border bg-white/[0.015] px-3 py-2.5 hover:bg-white/[0.03] transition-colors">
              <span className="font-mono text-[10px] text-subtle tabular-nums">{String(s.step).padStart(2, "0")}</span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.03] border border-white/5"><Icon className="h-3.5 w-3.5 text-emerald-400" strokeWidth={1.8} /></span>
              <Badge variant="info" className="w-fit">{s.gate}</Badge>
              <code className="font-mono text-xs truncate">{s.action}</code>
              <span className="font-mono text-xs text-muted text-right min-w-[100px]">{s.result}</span>
              <span className="font-mono text-xs text-subtle text-right tabular-nums min-w-[60px]">
                {formatLatency(s.duration)}{s.cost > 0 && <span className="ml-2 text-emerald-400">{formatCurrency(s.cost)}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
