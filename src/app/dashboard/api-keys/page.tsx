"use client";

import { useState } from "react";
import { Copy, Check, KeyRound, Trash2, Plus } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageHeader, Card, Badge } from "@/components/dashboard/primitives";
import { cn, formatRelative } from "@/lib/utils";

const ALL_SCOPES = ["runs:write", "runs:read", "traces:read"];

export default function ApiKeysPage() {
  
  
  const keys = useQuery(api.functions.listApiKeys);
  const createKeyMut = useMutation(api.functions.createApiKey);
  const revokeKeyMut = useMutation(api.functions.revokeApiKey);
  const [copied, setCopied] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newScopes, setNewScopes] = useState<string[]>(["runs:write", "runs:read"]);
  const [newExpiry, setNewExpiry] = useState("");
  const [justCreated, setJustCreated] = useState<{ id: string; key: string } | null>(null);

  const toggleScope = (s: string) => setNewScopes((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const copy = async (id: string, key: string) => { try { await navigator.clipboard.writeText(key); setCopied(id); setTimeout(() => setCopied(null), 1600); } catch {} };

  const createKey = async () => {
    if (!newName.trim() || !newScopes.length) return;
    const exp = newExpiry ? new Date(newExpiry).getTime() : undefined;
    const result = await createKeyMut({ name: newName.trim(), scopes: newScopes, expiresAt: exp });
    setJustCreated({ id: result.id as string, key: result.plainKey });
    setNewName(""); setNewScopes(["runs:write", "runs:read"]); setNewExpiry(""); setCreating(false);
  };

  return (
    <div className="flex-1 px-8 py-8">
      <PageHeader eyebrow="Credentials" title="API Keys" description="Create and manage credentials for the Archon SDK.">
        <button onClick={() => setCreating((c) => !c)} className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-500 px-3.5 text-sm font-medium text-black hover:bg-emerald-400 shadow-[0_0_24px_-8px_rgba(16,185,129,0.6)] transition-all">
          <Plus className="h-4 w-4" strokeWidth={2.4} />New key
        </button>
      </PageHeader>

      {justCreated && (
        <Card className="mb-6 border-emerald-500/30">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-emerald-400 mb-1">Key created — copy it now!</div>
              <p className="text-xs text-muted mb-3">This is the only time the full key will be shown.</p>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm text-foreground bg-white/[0.03] rounded px-3 py-2 border border-border flex-1 truncate">{justCreated.key}</code>
                <button onClick={() => copy("new", justCreated.key)} className="h-9 px-3 rounded-lg border border-border text-sm hover:bg-white/[0.04] transition-colors">
                  {copied === "new" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button onClick={() => setJustCreated(null)} className="text-subtle hover:text-foreground text-xs">Dismiss</button>
          </div>
        </Card>
      )}

      {creating && (
        <Card className="mb-6 border-emerald-500/30">
          <div className="space-y-4">
            <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") createKey(); if (e.key === "Escape") setCreating(false); }}
              placeholder="Key name (e.g., Production — us-west)" className="w-full bg-white/[0.02] border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-subtle focus:outline-none focus:border-emerald-500/50 transition-colors" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-subtle mb-2">Scopes</div>
              <div className="flex flex-wrap gap-2">
                {ALL_SCOPES.map((s) => (
                  <button key={s} onClick={() => toggleScope(s)} className={cn("px-3 py-1.5 rounded-md border text-xs font-mono transition-colors", newScopes.includes(s) ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-border text-muted hover:text-foreground")}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-subtle mb-2">Expires (optional)</div>
              <input type="date" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)} className="bg-white/[0.02] border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCreating(false)} className="h-10 px-4 rounded-lg border border-border text-sm text-muted hover:text-foreground transition-colors">Cancel</button>
              <button onClick={createKey} disabled={!newName.trim() || !newScopes.length} className="h-10 px-4 rounded-lg bg-emerald-500 text-black text-sm font-medium hover:bg-emerald-400 disabled:opacity-50 transition-colors">Generate</button>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-[10px] font-mono uppercase tracking-widest text-subtle">
              <th className="px-5 py-3 font-normal">Name</th><th className="px-3 py-3 font-normal">Key</th>
              <th className="px-3 py-3 font-normal">Scopes</th><th className="px-3 py-3 font-normal">Expires</th>
              <th className="px-3 py-3 font-normal">Last used</th><th className="px-3 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal text-right">Actions</th>
            </tr></thead>
            <tbody>
              {(keys ?? []).map((k) => {
                const show = `${k.prefix}${"•".repeat(24)}${k.suffix}`;
                const dead = k.status !== "active";
                return (
                  <tr key={k._id} className={cn("border-b border-border last:border-b-0 hover:bg-white/[0.02] transition-colors", dead && "opacity-50")}>
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-md bg-white/[0.03] border border-white/5 flex items-center justify-center"><KeyRound className="h-4 w-4 text-emerald-400" strokeWidth={1.8} /></div><div className="font-medium">{k.name}</div></div></td>
                    <td className="px-3 py-4"><code className="font-mono text-xs text-muted bg-white/[0.02] rounded px-2 py-1 border border-border">{show}</code></td>
                    <td className="px-3 py-4"><div className="flex flex-wrap gap-1">{k.scopes.map((s) => <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] border border-border text-muted">{s}</span>)}</div></td>
                    <td className="px-3 py-4 text-xs text-muted tabular-nums">{k.expiresAt ? new Date(k.expiresAt).toLocaleDateString() : "Never"}</td>
                    <td className="px-3 py-4 text-xs text-muted tabular-nums">{formatRelative(new Date(k.lastUsed).toISOString())}</td>
                    <td className="px-3 py-4"><Badge variant={dead ? "danger" : "success"}>{k.status}</Badge></td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => revokeKeyMut({ id: k._id })} disabled={dead} className="h-8 w-8 inline-flex items-center justify-center rounded-md text-subtle hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 glass rounded-xl p-5 border border-border">
        <div className="text-sm"><div className="font-medium mb-2">SDK Usage</div>
          <code className="block font-mono text-xs text-emerald-400 bg-white/[0.02] rounded-lg px-4 py-3 border border-border whitespace-pre">{`# Set your API key\nexport ARCHON_API_KEY="arc_your_key_here"\n\n# Python\nfrom archon import Agent\nagent = Agent(name="my-agent", instructions="...", model="auto")\nresult = await agent.run("Hello")\n\n# TypeScript\nimport { Agent } from "@archon-ai/sdk"\nconst agent = new Agent({ name: "my-agent" })\nconst result = await agent.run("Hello")`}</code>
        </div>
      </div>
    </div>
  );
}
