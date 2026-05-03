import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Helper: get authenticated userId or throw
async function requireUser(ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity.subject; // Clerk user ID
}

// ── API Keys ──
export const listApiKeys = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    return await ctx.db.query("apiKeys").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
  },
});

export const createApiKey = mutation({
  args: { name: v.string(), scopes: v.array(v.string()), expiresAt: v.optional(v.number()) },
  handler: async (ctx, { name, scopes, expiresAt }) => {
    const userId = await requireUser(ctx);
    const hex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const plainKey = `arc_${hex(40)}`;
    const keyHash = await sha256(plainKey);
    const id = await ctx.db.insert("apiKeys", {
      name, keyHash, prefix: plainKey.slice(0, 12), suffix: plainKey.slice(-4),
      status: "active", scopes, expiresAt, userId, lastUsed: Date.now(),
    });
    return { id, plainKey };
  },
});

export const revokeApiKey = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, { id }) => {
    const userId = await requireUser(ctx);
    const key = await ctx.db.get(id);
    if (!key || key.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(id, { status: "revoked" });
  },
});

// ── Dashboard ──
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const runs = await ctx.db.query("runs").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    if (!runs.length) return { totalRuns: 0, totalCost: 0, totalTokens: 0, avgLatency: 0 };
    return {
      totalRuns: runs.length,
      totalCost: Math.round(runs.reduce((s, r) => s + r.cost, 0) * 100) / 100,
      totalTokens: runs.reduce((s, r) => s + r.tokens, 0),
      avgLatency: Math.round(runs.reduce((s, r) => s + r.latency, 0) / runs.length),
    };
  },
});

export const getUsageSeries = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const runs = await ctx.db.query("runs").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const ordered = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const map = new Map(ordered.map((d) => [d, { cost: 0, runs: 0, tokens: 0 }]));
    for (const r of runs) { const e = map.get(days[new Date(r.startedAt).getDay()])!; if (e) { e.cost += r.cost; e.runs++; e.tokens += r.tokens; } }
    return ordered.map((d) => ({ day: d, cost: Math.round((map.get(d)?.cost ?? 0) * 100) / 100, runs: map.get(d)?.runs ?? 0, tokens: map.get(d)?.tokens ?? 0 }));
  },
});

export const getRecentRuns = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    return await ctx.db.query("runs").withIndex("by_user", (q) => q.eq("userId", userId)).order("desc").take(20);
  },
});

export const getTopModels = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const runs = await ctx.db.query("runs").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    const map = new Map<string, { model: string; runs: number; tokens: number; cost: number; latency: number }>();
    for (const r of runs) { const e = map.get(r.model) ?? { model: r.model, runs: 0, tokens: 0, cost: 0, latency: 0 }; e.runs++; e.tokens += r.tokens; e.cost += r.cost; e.latency += r.latency; map.set(r.model, e); }
    return [...map.values()].map((m) => ({ ...m, cost: Math.round(m.cost * 100) / 100, avgLatency: m.runs > 0 ? Math.round(m.latency / m.runs) : 0 })).sort((a, b) => b.runs - a.runs).slice(0, 10);
  },
});

// ── Analytics ──
export const getCostOverTime = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const runs = await ctx.db.query("runs").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    const map = new Map<string, number>();
    for (let i = 29; i >= 0; i--) map.set(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10), 0);
    for (const r of runs) { const d = r.startedAt.slice(0, 10); if (map.has(d)) map.set(d, (map.get(d) ?? 0) + r.cost); }
    return [...map.entries()].map(([day, cost]) => ({ day: day.slice(5), cost: Math.round(cost * 100) / 100, budget: 250 }));
  },
});

export const getModelDistribution = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const runs = await ctx.db.query("runs").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    if (!runs.length) return [];
    const map = new Map<string, number>();
    for (const r of runs) map.set(r.model, (map.get(r.model) ?? 0) + 1);
    const colors = ["#10b981", "#06b6d4", "#22d3ee", "#f59e0b", "#a78bfa", "#71717a"];
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count], i) => ({ name, value: Math.round((count / runs.length) * 100), color: colors[i % colors.length] }));
  },
});

export const getTierBreakdown = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    const runs = await ctx.db.query("runs").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    const map = new Map([["simple", { runs: 0, cost: 0 }], ["standard", { runs: 0, cost: 0 }], ["complex", { runs: 0, cost: 0 }]]);
    for (const r of runs) { const e = map.get(r.tier) ?? { runs: 0, cost: 0 }; e.runs++; e.cost += r.cost; map.set(r.tier, e); }
    return [...map.entries()].map(([tier, val]) => ({ tier: tier.charAt(0).toUpperCase() + tier.slice(1), runs: val.runs, cost: Math.round(val.cost * 100) / 100 }));
  },
});

// ── Traces ──
export const getAllRuns = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    return await ctx.db.query("runs").withIndex("by_user", (q) => q.eq("userId", userId)).order("desc").collect();
  },
});

export const getRunSteps = query({
  args: { runId: v.string() },
  handler: async (ctx, { runId }) => {
    await requireUser(ctx);
    return await ctx.db.query("runSteps").withIndex("by_run", (q) => q.eq("runId", runId)).collect();
  },
});

// ── Settings ──
export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUser(ctx);
    return await ctx.db.query("settings").withIndex("by_user", (q) => q.eq("userId", userId)).first();
  },
});

export const initSettings = mutation({
  args: { name: v.string(), email: v.string() },
  handler: async (ctx, { name, email }) => {
    const userId = await requireUser(ctx);
    const existing = await ctx.db.query("settings").withIndex("by_user", (q) => q.eq("userId", userId)).first();
    if (existing) return existing._id;
    return await ctx.db.insert("settings", { userId, name, email, company: "", role: "admin", budgetAlerts: true, weeklyReports: true, failureSpikes: true, productUpdates: false, marketing: false });
  },
});

export const updateSettings = mutation({
  args: { id: v.id("settings"), name: v.optional(v.string()), email: v.optional(v.string()), company: v.optional(v.string()), budgetAlerts: v.optional(v.boolean()), weeklyReports: v.optional(v.boolean()), failureSpikes: v.optional(v.boolean()), productUpdates: v.optional(v.boolean()), marketing: v.optional(v.boolean()) },
  handler: async (ctx, { id, ...fields }) => {
    const userId = await requireUser(ctx);
    const doc = await ctx.db.get(id);
    if (!doc || doc.userId !== userId) throw new Error("Not found");
    const updates: Record<string, string | boolean> = {};
    for (const [k, val] of Object.entries(fields)) { if (val !== undefined) updates[k] = val; }
    await ctx.db.patch(id, updates);
  },
});

// ── Internal (called by HTTP actions — no auth, uses API key userId) ──
export const validateKey = internalQuery({
  args: { keyHash: v.string() },
  handler: async (ctx, { keyHash }) => {
    const k = await ctx.db.query("apiKeys").withIndex("by_hash", (q) => q.eq("keyHash", keyHash)).first();
    if (!k) return null;
    if (k.status !== "active") return { ...k, valid: false as const, error: `Key is ${k.status}` };
    if (k.expiresAt && k.expiresAt < Date.now()) return { ...k, valid: false as const, error: "Key expired" };
    return { ...k, valid: true as const };
  },
});

export const touchKey = internalMutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, { id }) => { await ctx.db.patch(id, { lastUsed: Date.now() }); },
});

export const ingestRun = internalMutation({
  args: {
    userId: v.string(), runId: v.string(), agent: v.string(), model: v.string(), tier: v.string(),
    stepCount: v.number(), cost: v.number(), tokens: v.number(), inputTokens: v.number(), outputTokens: v.number(),
    latency: v.number(), status: v.string(), startedAt: v.string(),
    steps: v.array(v.object({ step: v.number(), gate: v.string(), action: v.string(), result: v.string(), duration: v.number(), cost: v.number(), model: v.optional(v.string()), tokens: v.optional(v.number()) })),
  },
  handler: async (ctx, { userId, steps, stepCount, ...run }) => {
    await ctx.db.insert("runs", { ...run, steps: stepCount, userId });
    for (const s of steps) await ctx.db.insert("runSteps", { ...s, runId: run.runId, userId });
  },
});
