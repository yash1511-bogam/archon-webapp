import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // API keys: only hash + prefix stored. Full key shown once at creation.
  apiKeys: defineTable({
    name: v.string(),
    keyHash: v.string(),       // SHA-256 hex of the full key — irreversible
    prefix: v.string(),        // first 12 chars for display (e.g. "arc_a1b2c3d4")
    suffix: v.string(),        // last 4 chars for identification
    status: v.union(v.literal("active"), v.literal("revoked"), v.literal("expired")),
    scopes: v.array(v.string()),
    expiresAt: v.optional(v.number()),
    userId: v.string(),
    lastUsed: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_hash", ["keyHash"]),

  runs: defineTable({
    runId: v.string(),
    agent: v.string(),
    model: v.string(),
    tier: v.string(),
    steps: v.number(),
    cost: v.number(),
    tokens: v.number(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    latency: v.number(),
    status: v.string(),
    startedAt: v.string(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_time", ["userId", "startedAt"]),

  runSteps: defineTable({
    runId: v.string(),
    step: v.number(),
    gate: v.string(),
    action: v.string(),
    result: v.string(),
    duration: v.number(),
    cost: v.number(),
    model: v.optional(v.string()),
    tokens: v.optional(v.number()),
    userId: v.string(),
  }).index("by_run", ["runId"]),

  settings: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    company: v.string(),
    role: v.string(),
    budgetAlerts: v.boolean(),
    weeklyReports: v.boolean(),
    failureSpikes: v.boolean(),
    productUpdates: v.boolean(),
    marketing: v.boolean(),
  }).index("by_user", ["userId"]),
});
