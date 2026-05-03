/**
 * POST /api/ingest — public endpoint the Archon SDK calls to upload telemetry.
 *
 * This route is a thin proxy in front of the Convex HTTP action at
 * `${NEXT_PUBLIC_CONVEX_SITE_URL}/api/ingest`, which handles the real
 * work (key validation + persistence). Hosting the proxy on the Next.js
 * domain lets users see a branded URL (archon.yashbogam.me/api/ingest)
 * and lets us swap the backend without forcing SDK upgrades.
 *
 * Wire protocol (see ../../../../convex/http.ts for the receiver):
 *   Authorization: Bearer arc_...
 *   Content-Type:  application/json
 *
 *   {
 *     runId, agent, model, tier,
 *     steps: [ { step, gate, action, result, duration, cost, model?, tokens? } ],
 *     totalCost, totalTokens, inputTokens, outputTokens,
 *     latency, status, startedAt
 *   }
 */

import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONVEX_SITE_URL =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ??
  process.env.CONVEX_SITE_URL ??
  "";

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!CONVEX_SITE_URL) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured: NEXT_PUBLIC_CONVEX_SITE_URL missing." },
      { status: 500, headers: corsHeaders() },
    );
  }

  const auth = req.headers.get("authorization") ?? "";
  const body = await req.text();

  try {
    const upstream = await fetch(`${CONVEX_SITE_URL}/api/ingest`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body,
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        ...corsHeaders(),
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `Upstream ingest failed: ${(err as Error).message}` },
      { status: 502, headers: corsHeaders() },
    );
  }
}
