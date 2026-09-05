import React from "react";
import Link from "next/link";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { BreadcrumbRail } from "@/components/workspace/breadcrumb-rail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background selection:bg-nexus-cyan/30 selection:text-nexus-cyan">
      {/* Sidebar Navigation */}
      <WorkspaceSidebar />

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Rail */}
        <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 pl-10 lg:pl-0">
            <BreadcrumbRail />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="emerald" className="font-mono text-[10px] py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                V8 JIT Active
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground py-0.5">
                Latency: &lt; 0.6ms
              </Badge>
            </div>

            <Link href="/catalog">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Hardware Store</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Workspace Canvas / Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
