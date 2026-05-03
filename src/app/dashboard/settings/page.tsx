"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Save } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageHeader, Card } from "@/components/dashboard/primitives";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user } = useUser();
  
  const settings = useQuery(api.functions.getSettings);
  const initSettings = useMutation(api.functions.initSettings);

  useEffect(() => {
    if (settings === null && user) {
      initSettings({ name: user.fullName ?? "", email: user.primaryEmailAddress?.emailAddress ?? "" });
    }
  }, [settings, user, initSettings]);

  if (settings === undefined) return <div className="flex-1 px-8 py-8"><PageHeader eyebrow="Account" title="Settings" description="Loading…" /></div>;

  return (
    <div className="flex-1 px-8 py-8 max-w-4xl">
      <PageHeader eyebrow="Account" title="Settings" description="Profile, notifications, and account-level controls." />
      {settings && <><ProfileSection settings={settings} /><NotificationsSection settings={settings} /></>}
      <DangerZone />
    </div>
  );
}

function ProfileSection({ settings }: { settings: { _id: unknown; name: string; email: string; company: string; role: string } }) {
  const update = useMutation(api.functions.updateSettings);
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [company, setCompany] = useState(settings.company);
  const [saved, setSaved] = useState(false);
  const save = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update({ id: settings._id as any, name, email, company });
    setSaved(true); setTimeout(() => setSaved(false), 1800);
  };
  return (
    <Card className="mb-6">
      <div className="mb-5"><h2 className="text-lg font-semibold">Profile</h2><p className="text-xs text-muted mt-0.5">Visible on traces and audit logs.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name" value={name} onChange={setName} />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Organization" value={company} onChange={setCompany} />
        <Field label="Role" value={settings.role} readOnly mono />
      </div>
      <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
        <span className="text-xs text-subtle">Changes tracked in audit log.</span>
        <button onClick={save} className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-medium text-black hover:bg-emerald-400 transition-colors">
          {saved ? "Saved ✓" : <><Save className="h-3.5 w-3.5" strokeWidth={2.2} /> Save</>}
        </button>
      </div>
    </Card>
  );
}

function Field({ label, value, onChange, type = "text", readOnly = false, mono = false }: { label: string; value: string; onChange?: (v: string) => void; type?: string; readOnly?: boolean; mono?: boolean }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-subtle mb-1.5 block">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} readOnly={readOnly}
        className={cn("w-full bg-white/[0.02] border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors", readOnly && "opacity-60 cursor-not-allowed", mono && "font-mono")} />
    </label>
  );
}

function NotificationsSection({ settings }: { settings: { _id: unknown; budgetAlerts: boolean; weeklyReports: boolean; failureSpikes: boolean; productUpdates: boolean; marketing: boolean } }) {
  const update = useMutation(api.functions.updateSettings);
  const toggle = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update({ id: settings._id as any, [key]: !(settings as any)[key] });
  };
  const items = [
    { key: "budgetAlerts", title: "Budget alerts", desc: "Email when budget hits 80%, 90%, or 100%." },
    { key: "failureSpikes", title: "Failure rate spikes", desc: "Notify on score drops or cost anomalies." },
    { key: "weeklyReports", title: "Weekly digest", desc: "Summary of runs, cost trends every Monday." },
    { key: "productUpdates", title: "Product updates", desc: "New features, model registry additions." },
    { key: "marketing", title: "Marketing", desc: "Tips, case studies, announcements." },
  ];
  return (
    <Card className="mb-6">
      <div className="mb-5"><h2 className="text-lg font-semibold">Notifications</h2><p className="text-xs text-muted mt-0.5">Control what lands in your inbox.</p></div>
      <div className="space-y-1">{items.map((item, i) => (
        <div key={item.key} className={cn("flex items-start justify-between gap-4 py-3", i !== items.length - 1 && "border-b border-border")}>
          <div className="flex-1"><div className="text-sm font-medium">{item.title}</div><div className="text-xs text-muted mt-0.5">{item.desc}</div></div>
          <button role="switch" aria-checked={(settings as Record<string, boolean>)[item.key]} onClick={() => toggle(item.key)}
            className={cn("relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors", (settings as Record<string, boolean>)[item.key] ? "bg-emerald-500" : "bg-white/10")}>
            <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform", (settings as Record<string, boolean>)[item.key] ? "translate-x-[18px]" : "translate-x-[3px]")} />
          </button>
        </div>
      ))}</div>
    </Card>
  );
}

function DangerZone() {
  const [confirm, setConfirm] = useState(false);
  const [typed, setTyped] = useState("");
  return (
    <Card className="border-rose-500/20 bg-rose-500/[0.02]">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-8 w-8 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0"><AlertTriangle className="h-4 w-4 text-rose-400" /></div>
        <div><h2 className="text-lg font-semibold text-rose-400">Danger zone</h2><p className="text-xs text-muted mt-0.5">Irreversible actions.</p></div>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div><div className="text-sm font-medium">Export all data</div><div className="text-xs text-muted mt-0.5">Download traces, events, configs. GDPR-compliant.</div></div>
          <button className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm text-muted hover:text-foreground transition-colors flex-shrink-0">Export</button>
        </div>
        <div className="rounded-lg border border-rose-500/20 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><div className="text-sm font-medium">Delete account</div><div className="text-xs text-muted mt-0.5">Erases personal data. Audit logs retained.</div></div>
            {!confirm ? <button onClick={() => setConfirm(true)} className="inline-flex h-9 items-center rounded-lg border border-rose-500/30 px-4 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0">Delete account</button>
            : <div className="flex gap-2 items-center">
                <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type DELETE" className="bg-white/[0.02] border border-rose-500/20 rounded-lg px-3 py-2 text-sm placeholder:text-subtle focus:outline-none w-40" />
                <button disabled={typed !== "DELETE"} className="h-9 px-4 rounded-lg bg-rose-500 text-white text-sm font-medium disabled:opacity-40 transition-colors">Confirm</button>
                <button onClick={() => { setConfirm(false); setTyped(""); }} className="text-xs text-subtle hover:text-foreground px-2">Cancel</button>
              </div>}
          </div>
        </div>
      </div>
    </Card>
  );
}
