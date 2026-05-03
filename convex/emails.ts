import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const send = internalAction({
  args: { type: v.string(), to: v.string(), data: v.any() },
  handler: async (_ctx, { type, to, data }) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${appUrl}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
      body: JSON.stringify({ type, to, data }),
    });
    if (!res.ok) throw new Error(`Email send failed: ${res.status} ${await res.text()}`);
    return { ok: true };
  },
});
