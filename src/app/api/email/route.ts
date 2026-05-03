import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";
import { WelcomeEmail } from "@/emails/welcome";
import { ApiKeyCreatedEmail } from "@/emails/api-key-created";
import { ApiKeyRevokedEmail } from "@/emails/api-key-revoked";
import { BudgetAlertEmail } from "@/emails/budget-alert";
import { FailureSpikeEmail } from "@/emails/failure-spike";
import { WeeklyDigestEmail } from "@/emails/weekly-digest";
import React from "react";

const TEMPLATES: Record<string, (data: Record<string, unknown>) => { subject: string; template: React.ReactElement }> = {
  welcome: (d) => ({ subject: `Welcome to Archon, ${d.name}!`, template: React.createElement(WelcomeEmail, { name: d.name as string }) }),
  "api-key-created": (d) => ({ subject: `New API key "${d.keyName}" created`, template: React.createElement(ApiKeyCreatedEmail, d as { name: string; keyName: string; prefix: string; scopes: string[] }) }),
  "api-key-revoked": (d) => ({ subject: `API key "${d.keyName}" revoked`, template: React.createElement(ApiKeyRevokedEmail, d as { name: string; keyName: string; prefix: string }) }),
  "budget-alert": (d) => ({ subject: `Budget ${d.percent}% used (${d.scope})`, template: React.createElement(BudgetAlertEmail, d as { name: string; percent: number; spent: string; limit: string; scope: string }) }),
  "failure-spike": (d) => ({ subject: `Failure spike: ${d.failureRate} on ${d.agent}`, template: React.createElement(FailureSpikeEmail, d as { name: string; failureRate: string; agent: string; window: string }) }),
  "weekly-digest": (d) => ({ subject: `Your Archon weekly digest — ${d.period}`, template: React.createElement(WeeklyDigestEmail, d as { name: string; totalRuns: number; totalCost: string; totalTokens: string; topModel: string; period: string }) }),
};

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CLERK_SECRET_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, to, data } = await req.json();
  const builder = TEMPLATES[type];
  if (!builder) return NextResponse.json({ error: `Unknown template: ${type}` }, { status: 400 });

  try {
    const { subject, template } = builder(data);
    await sendEmail({ to, subject, template });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
