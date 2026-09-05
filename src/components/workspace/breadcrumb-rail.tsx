"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  visualizer: "Algorithm Visualizer",
  tools: "Developer Tools",
  "json-formatter": "JSON Formatter & Linter",
  "regex-tester": "Regex Pattern Tester",
  "markdown-editor": "Markdown Live Editor",
};

export function BreadcrumbRail() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumbs"
      className="flex items-center gap-1.5 text-xs text-muted-foreground"
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-nexus-cyan transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Workspace</span>
      </Link>

      {segments.map((seg, idx) => {
        const href = `/${segments.slice(0, idx + 1).join("/")}`;
        const isLast = idx === segments.length - 1;
        const label = ROUTE_LABELS[seg] || seg;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3 h-3 text-border shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground tracking-tight">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-nexus-cyan transition-colors"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
