import type { Metadata } from "next";
import { Shield, Key, Lock, Eye, Database, FileCheck } from "lucide-react";

export const metadata: Metadata = { title: "Security — Archon" };

const PRACTICES = [
  { icon: Key, title: "API Key Hashing", desc: "Keys are SHA-256 hashed before storage. Plain-text keys are shown once at creation and never stored or retrievable. This is the same pattern used by Stripe, GitHub, and AWS." },
  { icon: Lock, title: "Default-Deny Policy", desc: "Every tool call is blocked unless explicitly allowed. The security policy engine evaluates tool name, arguments, and size limits before execution." },
  { icon: Shield, title: "Subprocess Sandbox", desc: "Tool execution runs in isolated subprocesses with configurable timeouts and output size limits. No tool code runs in the main agent process." },
  { icon: Eye, title: "Output Sanitization", desc: "Seven-category sanitizer detects and strips: instruction override, role hijack, prompt extraction, data exfiltration, delimiter injection, encoded payloads, and embedded instructions." },
  { icon: Database, title: "Per-User Data Isolation", desc: "All database queries are scoped to the authenticated user via ctx.auth.getUserIdentity(). No user can access another user's traces, keys, or settings." },
  { icon: FileCheck, title: "Immutable Audit Trail", desc: "Every action is recorded as an immutable event. Audit logs survive GDPR erasure requests. Full replay capability for incident investigation." },
];

export default function SecurityPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Security</h1>
      <p className="text-muted text-lg mb-12">How Archon protects your agents, data, and infrastructure.</p>

      <div className="space-y-6 mb-16">
        {PRACTICES.map((p) => (
          <div key={p.title} className="flex gap-4 rounded-xl border border-border p-5">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <p.icon className="h-5 w-5 text-emerald-400" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{p.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold mb-3">Report a Vulnerability</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          If you discover a security vulnerability, please report it responsibly. Do not open a public GitHub issue.
        </p>
        <p className="text-sm text-muted">
          Email: <a href="mailto:hello@yashbogam.me" className="text-emerald-400 hover:text-emerald-300">hello@yashbogam.me</a>
        </p>
        <p className="text-xs text-subtle mt-3">We aim to acknowledge reports within 24 hours and provide a fix within 7 days for critical issues.</p>
      </div>
    </div>
  );
}
