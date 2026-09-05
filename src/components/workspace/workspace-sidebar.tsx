"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Binary,
  FileCode2,
  ScanLine,
  FileText,
  ShoppingBag,
  ExternalLink,
  Cpu,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const CORE_NAV: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Algorithm Visualizer", href: "/visualizer", icon: Binary, badge: "Interactive" },
];

const TOOLS_NAV: NavItem[] = [
  { name: "JSON Formatter", href: "/tools/json-formatter", icon: FileCode2 },
  { name: "Regex Sandbox", href: "/tools/regex-tester", icon: ScanLine },
  { name: "Markdown Studio", href: "/tools/markdown-editor", icon: FileText },
];

const ECOSYSTEM_NAV: NavItem[] = [
  { name: "Nexus Market", href: "/catalog", icon: ShoppingBag },
  { name: "Marketing Site", href: "/", icon: ExternalLink },
];

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderNavGroup = (items: NavItem[], title: string) => (
    <div className="space-y-1">
      <h3 className="px-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
        {title}
      </h3>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all",
                isActive
                  ? "bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/30 shadow-sm shadow-nexus-cyan/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-nexus-cyan" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <Badge
                  variant={isActive ? "cyan" : "secondary"}
                  className="text-[9px] py-0 px-1.5"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-nexus-surface/90 border-r border-border/80 backdrop-blur-xl">
      <div className="space-y-6">
        {/* Brand header */}
        <Link href="/" className="flex items-center gap-2.5 px-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-nexus-cyan/20 to-nexus-violet/20 border border-nexus-cyan/40 flex items-center justify-center text-nexus-cyan group-hover:border-nexus-cyan transition-all shadow-md shadow-nexus-cyan/10">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs tracking-wider uppercase text-foreground">
              Nexus Workspace
            </span>
            <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase -mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine Online
            </span>
          </div>
        </Link>

        {/* Navigation Sections */}
        <div className="space-y-5">
          {renderNavGroup(CORE_NAV, "Core Engine")}
          {renderNavGroup(TOOLS_NAV, "Developer Suite")}
          {renderNavGroup(ECOSYSTEM_NAV, "Ecosystem")}
        </div>
      </div>

      {/* User / Session Profile Footer */}
      <div className="pt-4 border-t border-border/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-nexus-dark/60 border border-border/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexus-cyan/20 to-nexus-violet/30 border border-nexus-cyan/30 flex items-center justify-center text-nexus-cyan">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground truncate">
                Architect
              </span>
              <Badge variant="cyan" className="text-[9px] py-0 px-1">
                ADMIN
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono truncate">
              masrizqi@nexus.io
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-nexus-surface/90 border border-border/80 text-foreground shadow-lg backdrop-blur-md"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 h-full bg-nexus-surface shadow-2xl animate-in slide-in-from-left"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
