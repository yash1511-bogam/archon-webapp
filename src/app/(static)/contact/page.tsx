import type { Metadata } from "next";
import { Mail, Github, MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "Contact — Archon" };

export default function ContactPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Contact</h1>
      <p className="text-muted text-lg mb-12">We'd love to hear from you. Reach out through any of these channels.</p>

      <div className="space-y-4 mb-12">
        <a href="mailto:hello@yashbogam.me" className="flex items-center gap-4 rounded-xl border border-border p-5 hover:border-emerald-500/30 hover:bg-white/[0.01] transition-all">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Mail className="h-5 w-5 text-emerald-400" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-emerald-400">hello@yashbogam.me</p>
          </div>
        </a>

        <a href="https://github.com/yash1511-bogam/archon/issues" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl border border-border p-5 hover:border-emerald-500/30 hover:bg-white/[0.01] transition-all">
          <div className="h-10 w-10 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
            <Github className="h-5 w-5 text-foreground" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="font-semibold">GitHub Issues</h3>
            <p className="text-sm text-muted">Bug reports, feature requests, and discussions</p>
          </div>
        </a>

        <a href="https://github.com/yash1511-bogam/archon/discussions" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl border border-border p-5 hover:border-emerald-500/30 hover:bg-white/[0.01] transition-all">
          <div className="h-10 w-10 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-5 w-5 text-foreground" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="font-semibold">Community</h3>
            <p className="text-sm text-muted">GitHub Discussions — ask questions, share ideas</p>
          </div>
        </a>
      </div>

      <div className="rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold mb-2">Response Times</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-subtle">General inquiries</span><p className="text-foreground font-mono">24–48 hours</p></div>
          <div><span className="text-subtle">Security reports</span><p className="text-foreground font-mono">&lt; 24 hours</p></div>
          <div><span className="text-subtle">Bug reports</span><p className="text-foreground font-mono">48–72 hours</p></div>
          <div><span className="text-subtle">Feature requests</span><p className="text-foreground font-mono">Reviewed weekly</p></div>
        </div>
      </div>
    </div>
  );
}
