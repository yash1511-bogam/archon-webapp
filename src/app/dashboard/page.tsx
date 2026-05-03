"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Circle, Zap } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PageHeader, Card, Badge } from "@/components/dashboard/primitives";
import { formatCurrency, formatNumber, formatCompact, formatRelative, cn } from "@/lib/utils";

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="font-medium text-foreground mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted">{p.name}:</span>
          <span className="font-mono tabular-nums text-foreground">{p.name === "cost" ? formatCurrency(p.value) : formatNumber(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  
  
  const rootRef = useRef<HTMLDivElement>(null);
  const stats = useQuery(api.functions.getDashboardStats);
  const usageSeries = useQuery(api.functions.getUsageSeries);
  const topModels = useQuery(api.functions.getTopModels);
  const recentRuns = useQuery(api.functions.getRecentRuns);

  const statCards = stats ? [
    { label: "Total Runs", value: stats.totalRuns, prefix: "", suffix: "", delta: "+12.4%" },
    { label: "Total Cost", value: stats.totalCost, prefix: "$", suffix: "", delta: "+3.1%", decimals: 2 },
    { label: "Total Tokens", value: stats.totalTokens, prefix: "", suffix: "", delta: "+8.2%", compact: true },
    { label: "Avg Latency", value: stats.avgLatency, prefix: "", suffix: "ms", delta: "-4.8%", positiveDelta: "down" as const },
  ] : [];

  useGSAP(() => {
    if (!stats) return;
    gsap.utils.toArray<HTMLElement>(".stat-counter").forEach((el) => {
      const target = parseFloat(el.dataset.value || "0");
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const compact = el.dataset.compact === "true";
      const obj = { v: 0 };
      gsap.to(obj, { v: target, duration: 1.6, ease: "power3.out", onUpdate: () => {
        if (compact) el.textContent = formatCompact(obj.v);
        else if (decimals > 0) el.textContent = obj.v.toFixed(decimals);
        else el.textContent = formatNumber(Math.round(obj.v));
      }});
    });
    gsap.from(".stat-card", { opacity: 0, y: 20, stagger: 0.08, duration: 0.7, ease: "power3.out" });
    gsap.from(".dash-section", { opacity: 0, y: 30, stagger: 0.12, duration: 0.8, ease: "power3.out", delay: 0.2 });
  }, { scope: rootRef, dependencies: [stats] });

  if (stats === undefined) return (
    <div className="flex-1 px-8 py-8">
      <PageHeader eyebrow="Overview" title="Dashboard" description="Loading…" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-xl glass border border-border animate-pulse" />)}
      </div>
    </div>
  );

  if (stats.totalRuns === 0) return (
    <div className="flex-1 px-8 py-8">
      <PageHeader eyebrow="Overview" title="Dashboard" description="Get started by installing the Archon SDK." />
      <Card className="text-center py-16">
        <Zap className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No runs yet</h2>
        <p className="text-muted text-sm mb-6 max-w-md mx-auto">Install the SDK, add your API key, and run your first agent. Data will appear here in real-time.</p>
        <code className="block glass rounded-lg px-4 py-3 font-mono text-sm text-emerald-400 max-w-sm mx-auto">pip install archon-framework</code>
      </Card>
    </div>
  );

  return (
    <div ref={rootRef} className="flex-1 px-8 py-8">
      <PageHeader eyebrow="Overview" title="Dashboard" description="Live metrics across every Archon-wrapped agent.">
        <div className="glass rounded-lg px-3 py-1.5 font-mono text-xs text-muted">Real-time</div>
      </PageHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="dash-section mb-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-lg font-semibold">Cost & volume</h2><p className="text-sm text-muted mt-0.5">Daily breakdown</p></div>
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> cost</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-400" /> runs</span>
            </div>
          </div>
          <div className="h-72 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageSeries ?? []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.35} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} /><stop offset="100%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2a" vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} fill="url(#cg)" />
                <Area type="monotone" dataKey="runs" stroke="#06b6d4" strokeWidth={2} fill="url(#rg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dash-section lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div><h2 className="text-lg font-semibold">Recent runs</h2><p className="text-xs text-muted mt-0.5">Live feed</p></div>
              <a href="/dashboard/traces" className="text-xs text-emerald-400 hover:text-emerald-300">View all →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left text-[10px] font-mono uppercase tracking-widest text-subtle">
                  <th className="px-5 py-3 font-normal">Agent</th><th className="px-3 py-3 font-normal">Model</th>
                  <th className="px-3 py-3 font-normal text-right">Steps</th><th className="px-3 py-3 font-normal text-right">Cost</th>
                  <th className="px-3 py-3 font-normal">Status</th><th className="px-5 py-3 font-normal text-right">When</th>
                </tr></thead>
                <tbody>
                  {(recentRuns ?? []).map((r) => (
                    <tr key={r._id} className="border-b border-border last:border-b-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3"><div className="font-medium">{r.agent}</div><div className="font-mono text-[10px] text-subtle">{r.runId}</div></td>
                      <td className="px-3 py-3 font-mono text-xs text-muted">{r.model}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{r.steps}</td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums">{formatCurrency(r.cost)}</td>
                      <td className="px-3 py-3"><Badge variant={r.status === "success" ? "success" : r.status === "failed" ? "danger" : "warning"}><Circle className="h-1.5 w-1.5 fill-current" />{r.status}</Badge></td>
                      <td className="px-5 py-3 text-right text-xs text-muted tabular-nums">{formatRelative(r.startedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <div className="dash-section">
          <Card>
            <div className="mb-5"><h2 className="text-lg font-semibold">Model usage</h2><p className="text-xs text-muted mt-0.5">By run volume</p></div>
            <div className="h-52 -mx-2 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(topModels ?? []).slice(0, 5)} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide /><YAxis type="category" dataKey="model" width={120} stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.05)" }} />
                  <Bar dataKey="runs" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-4 border-t border-border space-y-2">
              {(topModels ?? []).slice(0, 5).map((m) => (
                <div key={m.model} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted truncate">{m.model}</span>
                  <span className="font-mono tabular-nums text-foreground">{formatCurrency(m.cost, 2)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard(props: { label: string; value: number; prefix: string; suffix: string; delta: string; decimals?: number; compact?: boolean; positiveDelta?: "down" }) {
  const neg = props.delta.startsWith("-");
  const good = props.positiveDelta === "down" ? neg : !neg;
  return (
    <div className="stat-card glow-border rounded-xl glass border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted font-medium">{props.label}</span>
        <span className={cn("inline-flex items-center gap-1 font-mono text-[10px] rounded-md px-1.5 py-0.5 border", good ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20")}>
          {neg ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}{props.delta}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        {props.prefix && <span className="text-xl text-muted font-semibold">{props.prefix}</span>}
        <span className="stat-counter text-3xl font-semibold tracking-tight tabular-nums" data-value={props.value} data-decimals={props.decimals ?? 0} data-compact={String(!!props.compact)}>0</span>
        {props.suffix && <span className="text-xl text-muted font-semibold">{props.suffix}</span>}
      </div>
    </div>
  );
}
