import Link from "next/link";

const GROUPS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pipeline", href: "#pipeline" },
      { label: "Models", href: "#models" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "https://github.com/yash1511-bogam/archon" },
      { label: "GitHub", href: "https://github.com/yash1511-bogam/archon" },
      { label: "PyPI", href: "https://pypi.org/project/archon-framework/" },
      { label: "npm", href: "https://www.npmjs.com/package/@archon-ai/sdk" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Blog", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Security", href: "#" },
      { label: "Contact", href: "mailto:hello@yashbogam.me" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-7 w-7 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_16px_-4px_rgba(16,185,129,0.6)]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-black" strokeWidth={2.5} stroke="currentColor">
                  <path d="M4 20 L12 4 L20 20" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 14 L16 14" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-mono text-sm font-semibold">archon</span>
            </Link>
            <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
              The production harness for AI agents. Cost, security, observability, memory, eval, governance — shipped as the framework.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-subtle">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>

          {GROUPS.map((group) => (
            <div key={group.heading}>
              <div className="mb-4 font-mono text-xs uppercase tracking-widest text-subtle">
                {group.heading}
              </div>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-subtle">
            © {new Date().getFullYear()} Archon. Apache-2.0 License.
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-subtle">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="mailto:hello@yashbogam.me" className="hover:text-foreground transition-colors">Support</a>
            <span className="opacity-40">•</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
