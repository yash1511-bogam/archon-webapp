import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Authorization, Content-Type", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Content-Type": "application/json" };

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(data: unknown, status: number) { return new Response(JSON.stringify(data), { status, headers: cors }); }

// CORS preflight
http.route({ path: "/api/ingest", method: "OPTIONS", handler: httpAction(async () => new Response(null, { status: 204, headers: cors })) });
http.route({ path: "/api/validate", method: "OPTIONS", handler: httpAction(async () => new Response(null, { status: 204, headers: cors })) });

// Validate API key — SDK calls this on init
http.route({
  path: "/api/validate",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer "))
      return json({ valid: false, error: "Missing API key. Set ARCHON_API_KEY environment variable.\n\n  export ARCHON_API_KEY=\"arc_your_key_here\"\n\nGenerate a key at: https://archon.dev/dashboard/api-keys" }, 401);

    const keyHash = await sha256(auth.slice(7));
    const result = await ctx.runQuery(internal.functions.validateKey, { keyHash });
    if (!result) return json({ valid: false, error: "Invalid API key. The key does not exist or was deleted.\n\nGenerate a new key at: https://archon.dev/dashboard/api-keys" }, 401);
    if (!result.valid) return json({ valid: false, error: result.error }, 403);
    return json({ valid: true, scopes: result.scopes, expiresAt: result.expiresAt ?? null }, 200);
  }),
});

// Ingest telemetry — SDK calls this after each agent.run()
http.route({
  path: "/api/ingest",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer "))
      return json({ ok: false, error: "Missing API key. Set ARCHON_API_KEY environment variable." }, 401);

    const keyHash = await sha256(auth.slice(7));
    const keyData = await ctx.runQuery(internal.functions.validateKey, { keyHash });
    if (!keyData) return json({ ok: false, error: "Invalid API key." }, 401);
    if (!keyData.valid) return json({ ok: false, error: keyData.error }, 403);
    if (!keyData.scopes.includes("runs:write"))
      return json({ ok: false, error: "API key missing 'runs:write' scope. Update key scopes at: https://archon.dev/dashboard/api-keys" }, 403);

    let body;
    try { body = await req.json(); } catch { return json({ ok: false, error: "Invalid JSON body." }, 400); }

    const { runId, agent, model, tier, steps, totalCost, totalTokens, inputTokens, outputTokens, latency, status, startedAt } = body;
    if (!runId || !agent || !model) return json({ ok: false, error: "Missing required fields: runId, agent, model." }, 400);

    await ctx.runMutation(internal.functions.touchKey, { id: keyData._id });
    await ctx.runMutation(internal.functions.ingestRun, {
      userId: keyData.userId, runId, agent, model, tier: tier ?? "standard",
      stepCount: Array.isArray(steps) ? steps.length : (typeof steps === "number" ? steps : 0),
      cost: totalCost ?? 0, tokens: totalTokens ?? 0, inputTokens: inputTokens ?? 0, outputTokens: outputTokens ?? 0,
      latency: latency ?? 0, status: status ?? "success", startedAt: startedAt ?? new Date().toISOString(),
      steps: Array.isArray(steps) ? steps.map((s: Record<string, unknown>, i: number) => ({
        step: (s.step as number) ?? i + 1, gate: (s.gate as string) ?? "execute", action: (s.action as string) ?? "",
        result: (s.result as string) ?? "", duration: (s.duration as number) ?? 0, cost: (s.cost as number) ?? 0,
        model: (s.model as string) ?? undefined, tokens: (s.tokens as number) ?? undefined,
      })) : [],
    });

    return json({ ok: true, runId }, 200);
  }),
});

export default http;
