"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  KeyRound,
  BarChart3,
  Route,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "API Keys", href: "/dashboard/api-keys", icon: KeyRound },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Traces", href: "/dashboard/traces", icon: Route },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen flex-shrink-0 transition-[width] duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[248px]",
      )}
    >
      <div className="h-full glass-strong border-r border-border flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-border">
          <Link href="/" className={cn("flex items-center gap-2.5 overflow-hidden")}>
            <div className="relative h-8 w-8 flex-shrink-0 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_16px_-4px_rgba(16,185,129,0.6)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-black" strokeWidth={2.5} stroke="currentColor">
                <path d="M4 20 L12 4 L20 20" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 14 L16 14" strokeLinecap="round" />
              </svg>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-sm font-semibold tracking-tight truncate">
                  archon
                </span>
                <span className="font-mono text-[10px] text-subtle truncate">
                  v1.0.0
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  active
                    ? "bg-white/[0.04] text-foreground"
                    : "text-muted hover:bg-white/[0.02] hover:text-foreground",
                  collapsed && "justify-center",
                )}
                title={collapsed ? item.label : undefined}
              >
                {active && (
                  <span className="absolute inset-y-1 left-0 w-0.5 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-colors",
                    active ? "text-emerald-400" : "text-muted group-hover:text-foreground",
                  )}
                  strokeWidth={1.8}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "w-full inline-flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-subtle hover:bg-white/[0.02] hover:text-foreground transition-colors",
              collapsed && "justify-center",
            )}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" strokeWidth={1.8} />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" strokeWidth={1.8} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* User */}
        <div className="h-16 flex items-center px-4 border-t border-border">
          <SidebarUser collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}

function SidebarUser({ collapsed }: { collapsed: boolean }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <div className={cn("flex items-center gap-3 w-full", collapsed && "justify-center")}>
      <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 ring-1 ring-white/10" } }} />
      {!collapsed && (
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-medium truncate">{user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "User"}</span>
          <button onClick={() => signOut({ redirectUrl: "/" })} className="font-mono text-[10px] text-subtle hover:text-rose-400 transition-colors text-left truncate">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
