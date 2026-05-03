"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageHeader, Card } from "@/components/dashboard/primitives";
import { formatCurrency, formatNumber, formatLatency } from "@/lib/utils";

const Tip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-border rounded-lg px-3 py-2 text-xs shadow-xl backdrop-blur-xl">
      <div className="font-medium text-foreground mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-muted">{p.name}:</span>
          <span className="font-mono tabular-nums text-foreground">{p.name.includes("cost") || p.name === "budget" ? formatCurrency(p.value) : formatNumber(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  
  
  const rootRef = useRef<HTMLDivElement>(null);
  const costData = useQuery(api.functions.getCostOverTime);
  const modelDist = useQuery(api.functions.getModelDistribution);
  const tierData = useQuery(api.functions.getTierBreakdown);
  const topModels = useQuery(api.functions.getTopModels);

  useGSAP(() => { gsap.from(".ac", { opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: "power3.out" }); }, { scope: rootRef });

  return (
    <div ref={rootRef} className="flex-1 px-8 py-8">
      <PageHeader eyebrow="Insights" title="Analytics" description="Cost, distribution, and performance across tiers and models.">
        <div className="glass rounded-lg px-3 py-1.5 font-mono text-xs text-muted">Last 30 days</div>
      </PageHeader>

      <div className="ac mb-6"><Card>
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-lg font-semibold">Cost over time</h2><p className="text-sm text-muted mt-0.5">Daily spend vs $250 budget</p></div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> cost</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-3 bg-rose-400" /> budget</span>
          </div>
        </div>
        <div className="h-80 -mx-2"><ResponsiveContainer width="100%" height="100%">
          <AreaChart data={costData ?? []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs><linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.4} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2a" vertical={false} />
            <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} interval={3} />
            <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<Tip />} />
            <ReferenceLine y={250} stroke="#f43f5e" strokeDasharray="4 4" strokeWidth={1.5} />
            <Area type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} fill="url(#cf)" />
          </AreaChart>
        </ResponsiveContainer></div>
      </Card></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="ac"><Card>
          <div className="mb-5"><h2 className="text-lg font-semibold">Model distribution</h2><p className="text-sm text-muted mt-0.5">% of runs by model</p></div>
          <div className="grid grid-cols-[1fr_1fr] gap-4 items-center">
            <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart>
              <Pie data={modelDist ?? []} dataKey="value" innerRadius={55} outerRadius={95} paddingAngle={2} stroke="none">
                {(modelDist ?? []).map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip content={<Tip />} />
            </PieChart></ResponsiveContainer></div>
            <div className="space-y-2">{(modelDist ?? []).map((m) => (
              <div key={m.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0"><span className="h-2 w-2 rounded-sm flex-shrink-0" style={{ background: m.color }} /><span className="font-mono text-muted truncate">{m.name}</span></div>
                <span className="font-mono tabular-nums text-foreground flex-shrink-0">{m.value}%</span>
              </div>
            ))}</div>
          </div>
        </Card></div>

        <div className="ac"><Card>
          <div className="mb-5"><h2 className="text-lg font-semibold">Tier breakdown</h2><p className="text-sm text-muted mt-0.5">Runs and cost per tier</p></div>
          <div className="h-64 -mx-2"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={tierData ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2a" vertical={false} />
              <XAxis dataKey="tier" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<Tip />} cursor={{ fill: "rgba(16,185,129,0.05)" }} />
              <Bar dataKey="runs" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="cost" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer></div>
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3">
            {(tierData ?? []).map((t) => (
              <div key={t.tier} className="text-center">
                <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">{t.tier}</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">{formatNumber(t.runs)}</div>
                <div className="text-xs text-muted tabular-nums">{formatCurrency(t.cost, 0)}</div>
              </div>
            ))}
          </div>
        </Card></div>
      </div>

      <div className="ac"><Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border"><h2 className="text-lg font-semibold">Top models</h2><p className="text-xs text-muted mt-0.5">By run volume</p></div>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-[10px] font-mono uppercase tracking-widest text-subtle">
            <th className="px-5 py-3 font-normal">Model</th><th className="px-3 py-3 font-normal text-right">Runs</th>
            <th className="px-3 py-3 font-normal text-right">Tokens</th><th className="px-3 py-3 font-normal text-right">Cost</th>
            <th className="px-5 py-3 font-normal text-right">Avg latency</th>
          </tr></thead>
          <tbody>{(topModels ?? []).map((m, i) => (
            <tr key={m.model} className="border-b border-border last:border-b-0 hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-3"><div className="flex items-center gap-3"><span className="font-mono text-xs text-subtle w-6 text-right">{String(i + 1).padStart(2, "0")}</span><span className="font-mono text-xs">{m.model}</span></div></td>
              <td className="px-3 py-3 text-right tabular-nums font-mono text-xs">{formatNumber(m.runs)}</td>
              <td className="px-3 py-3 text-right tabular-nums font-mono text-xs text-muted">{formatNumber(m.tokens)}</td>
              <td className="px-3 py-3 text-right tabular-nums font-mono text-xs">{formatCurrency(m.cost, 2)}</td>
              <td className="px-5 py-3 text-right tabular-nums font-mono text-xs text-muted">{formatLatency(m.avgLatency)}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </Card></div>
    </div>
  );
}
