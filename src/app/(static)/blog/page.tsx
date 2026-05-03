import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Blog — Archon" };

const POSTS = [
  { title: "Introducing Archon v1.0", date: "May 2, 2026", slug: "#", excerpt: "The production harness for AI agents is here. Cost control, security, observability, memory, eval, and governance — shipped as the framework itself.", tag: "Launch" },
  { title: "How We Route 140+ Models for 65% Cost Savings", date: "Apr 28, 2026", slug: "#", excerpt: "Our pattern-based router classifies complexity using 27 lexical signals in sub-millisecond time. No LLM call needed. Here's how it works.", tag: "Engineering" },
  { title: "Why API Keys Should Never Be Stored in Plain Text", date: "Apr 20, 2026", slug: "#", excerpt: "We use the Stripe/GitHub pattern: SHA-256 hash on write, prefix+suffix for display, full key shown once. Here's why every SaaS should do this.", tag: "Security" },
  { title: "Four-Tier Memory: How Agents Remember", date: "Apr 15, 2026", slug: "#", excerpt: "Working, episodic, semantic, procedural — inspired by cognitive science. With temporal decay and auto-consolidation to prevent context poisoning.", tag: "Research" },
  { title: "Building a Real-Time Dashboard with Convex", date: "Apr 10, 2026", slug: "#", excerpt: "How we built a dashboard that updates in under 10ms using Convex reactive subscriptions, Clerk auth, and Recharts.", tag: "Engineering" },
];

export default function BlogPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Blog</h1>
      <p className="text-muted text-lg mb-12">Engineering, security, and product updates from the Archon team.</p>
      <div className="space-y-8">
        {POSTS.map((post) => (
          <Link key={post.title} href={post.slug} className="block group rounded-xl border border-border p-6 hover:border-emerald-500/30 hover:bg-white/[0.01] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{post.tag}</span>
              <span className="text-xs text-subtle">{post.date}</span>
            </div>
            <h2 className="text-xl font-semibold group-hover:text-emerald-400 transition-colors mb-2">{post.title}</h2>
            <p className="text-sm text-muted leading-relaxed">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
