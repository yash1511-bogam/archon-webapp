/**
 * Shared mock data for the Archon dashboard demo.
 * No backend calls — everything is pre-seeded so the UI renders richly.
 */

export const STAT_CARDS = [
  { label: "Total Runs", value: 24_817, suffix: "", prefix: "", delta: "+12.4%" },
  { label: "Total Cost", value: 1_482.27, suffix: "", prefix: "$", delta: "+3.1%", decimals: 2 },
  { label: "Total Tokens", value: 42_103_892, suffix: "", prefix: "", delta: "+8.2%", compact: true },
  { label: "Avg Latency", value: 1_247, suffix: "ms", prefix: "", delta: "-4.8%", positiveDelta: "down" },
] as const;

export const USAGE_SERIES = [
  { day: "Mon", cost: 182, runs: 2410, tokens: 5.2 },
  { day: "Tue", cost: 214, runs: 2890, tokens: 6.1 },
  { day: "Wed", cost: 198, runs: 2640, tokens: 5.7 },
  { day: "Thu", cost: 241, runs: 3120, tokens: 6.8 },
  { day: "Fri", cost: 267, runs: 3510, tokens: 7.4 },
  { day: "Sat", cost: 189, runs: 2380, tokens: 4.9 },
  { day: "Sun", cost: 191, runs: 2460, tokens: 5.1 },
];

export const COST_OVER_TIME = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  cost: Math.round(140 + Math.sin(i / 3) * 30 + Math.random() * 40),
  budget: 250,
}));

export const MODEL_DISTRIBUTION = [
  { name: "Gemini 2.5 Flash", value: 34, color: "#10b981" },
  { name: "GPT-4.1 Mini", value: 22, color: "#06b6d4" },
  { name: "Claude Sonnet 4.6", value: 18, color: "#22d3ee" },
  { name: "Claude Opus 4.6", value: 11, color: "#f59e0b" },
  { name: "o4-mini", value: 9, color: "#a78bfa" },
  { name: "Other", value: 6, color: "#71717a" },
];

export const TIER_BREAKDOWN = [
  { tier: "Simple", runs: 14_890, cost: 148 },
  { tier: "Standard", runs: 6_203, cost: 620 },
  { tier: "Complex", runs: 3_724, cost: 714 },
];

export const TOP_MODELS = [
  { model: "gemini-2.5-flash", runs: 8_412, tokens: 14_200_000, cost: 142.11, avgLatency: 412 },
  { model: "gpt-4.1-mini", runs: 5_461, tokens: 9_840_000, cost: 312.45, avgLatency: 834 },
  { model: "claude-sonnet-4.6", runs: 4_498, tokens: 7_620_000, cost: 387.22, avgLatency: 1_112 },
  { model: "claude-opus-4.6", runs: 2_731, tokens: 3_210_000, cost: 428.91, avgLatency: 1_843 },
  { model: "o4-mini", runs: 2_233, tokens: 5_120_000, cost: 204.33, avgLatency: 2_104 },
];

export const RECENT_RUNS = [
  {
    run_id: "run_8f2a1c9b4e",
    agent: "researcher",
    model: "claude-sonnet-4.6",
    steps: 7,
    cost: 0.0412,
    tokens: 8_210,
    latency: 3_214,
    status: "success",
    started_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    run_id: "run_7d1b8e4a9c",
    agent: "code-reviewer",
    model: "gpt-4.1-mini",
    steps: 4,
    cost: 0.0189,
    tokens: 4_120,
    latency: 2_108,
    status: "success",
    started_at: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
  },
  {
    run_id: "run_6e3c2f7a1d",
    agent: "support-bot",
    model: "gemini-2.5-flash",
    steps: 2,
    cost: 0.0031,
    tokens: 1_820,
    latency: 641,
    status: "success",
    started_at: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
  },
  {
    run_id: "run_5a9d4b2e8f",
    agent: "analyst-swarm",
    model: "claude-opus-4.6",
    steps: 12,
    cost: 0.2847,
    tokens: 21_400,
    latency: 9_281,
    status: "budget-exceeded",
    started_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    run_id: "run_4c8e1d5b3a",
    agent: "researcher",
    model: "gemini-2.5-flash",
    steps: 3,
    cost: 0.0024,
    tokens: 1_410,
    latency: 482,
    status: "success",
    started_at: new Date(Date.now() - 1000 * 60 * 68).toISOString(),
  },
  {
    run_id: "run_3b7a2c9e4d",
    agent: "code-reviewer",
    model: "gpt-4.1-mini",
    steps: 5,
    cost: 0.0213,
    tokens: 4_812,
    latency: 2_401,
    status: "failed",
    started_at: new Date(Date.now() - 1000 * 60 * 93).toISOString(),
  },
  {
    run_id: "run_2f6b8d1c5e",
    agent: "researcher",
    model: "claude-sonnet-4.6",
    steps: 9,
    cost: 0.0564,
    tokens: 10_210,
    latency: 4_127,
    status: "success",
    started_at: new Date(Date.now() - 1000 * 60 * 124).toISOString(),
  },
];

export const API_KEYS = [
  {
    id: "key_01",
    name: "Production — us-east",
    key: "arc_prod_9f2a4b8e1c6d3a7f5b2e9d4c1a8f6b3e",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 42).toISOString(),
    last_used: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    status: "active" as const,
  },
  {
    id: "key_02",
    name: "Staging",
    key: "arc_stg_1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    last_used: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    status: "active" as const,
  },
  {
    id: "key_03",
    name: "CI/CD Pipeline",
    key: "arc_ci_2b4d6f8a0c2e4f6a8b0c2d4e6f8a0b2c",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    last_used: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "active" as const,
  },
  {
    id: "key_04",
    name: "Legacy (revoked)",
    key: "arc_leg_3c5e7a9b1d3f5a7c9e1b3d5f7a9c1e3b",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 210).toISOString(),
    last_used: new Date(Date.now() - 1000 * 60 * 60 * 24 * 64).toISOString(),
    status: "revoked" as const,
  },
];

export const RUN_STEPS = [
  {
    step: 1,
    gate: "policy",
    action: "check_allowed(tool=search_web)",
    result: "ALLOWED",
    duration: 2,
    cost: 0,
  },
  {
    step: 2,
    gate: "route",
    action: "classify(complexity=standard)",
    result: "claude-sonnet-4.6",
    duration: 1,
    cost: 0,
  },
  {
    step: 3,
    gate: "execute",
    action: "llm.chat(messages=4, tools=2)",
    result: "tool_call: search_web",
    duration: 1_412,
    cost: 0.0124,
  },
  {
    step: 4,
    gate: "execute",
    action: "tool.search_web(query='SVB collapse')",
    result: "returned 8 results",
    duration: 812,
    cost: 0,
  },
  {
    step: 5,
    gate: "execute",
    action: "llm.chat(messages=6, tools=2)",
    result: "final answer",
    duration: 923,
    cost: 0.0218,
  },
  {
    step: 6,
    gate: "validate",
    action: "schema.check + sanitize",
    result: "OK (7/7 categories pass)",
    duration: 4,
    cost: 0,
  },
  {
    step: 7,
    gate: "log",
    action: "trace.append(events=6)",
    result: "trace_id: trc_8f2a1c9b",
    duration: 6,
    cost: 0,
  },
];
