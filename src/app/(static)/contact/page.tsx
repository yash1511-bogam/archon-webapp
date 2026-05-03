import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "Contact — Archon" };

export default function ContactPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Contact</h1>
      <p className="text-muted text-lg mb-12">We&apos;d love to hear from you. Reach out through any of these channels.</p>

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
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 007.86 10.92c.57.1.78-.25.78-.55v-2.06c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.3-.51-1.48.11-3.08 0 0 .97-.31 3.18 1.18a11 11 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.6.23 2.79.11 3.08.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.77 1.06.77 2.13v3.16c0 .3.2.66.79.55A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
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
