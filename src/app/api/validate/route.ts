/**
 * GET /api/validate — public endpoint the Archon SDK calls to verify an API key.
 *
 * Proxies to the Convex HTTP action at
 * `${NEXT_PUBLIC_CONVEX_SITE_URL}/api/validate`, which does the real work
 * (SHA-256 hash lookup + expiry + status check).
 *
 * Request:
 *   Authorization: Bearer arc_...
 * Response (200):
 *   { valid: true, scopes: string[], expiresAt: number | null }
 * Response (401/403):
 *   { valid: false, error: string }
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
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!CONVEX_SITE_URL) {
    return NextResponse.json(
      { valid: false, error: "Server misconfigured: NEXT_PUBLIC_CONVEX_SITE_URL missing." },
      { status: 500, headers: corsHeaders() },
    );
  }

  const auth = req.headers.get("authorization") ?? "";

  try {
    const upstream = await fetch(`${CONVEX_SITE_URL}/api/validate`, {
      method: "GET",
      headers: { Authorization: auth },
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
      { valid: false, error: `Upstream validation failed: ${(err as Error).message}` },
      { status: 502, headers: corsHeaders() },
    );
  }
}
