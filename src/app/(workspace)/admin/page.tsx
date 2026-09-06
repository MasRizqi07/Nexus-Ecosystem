"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, Users, Package, Activity, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminMetrics {
  metrics: {
    totalUsers: number;
    totalProducts: number;
    systemStatus: string;
    telemetryUptime: string;
  };
  users: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/admin/metrics");
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.message || "Failed to fetch admin metrics");
        }

        setData(json.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground font-mono">
          Authenticating administrator access...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 mx-auto flex items-center justify-center text-rose-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 max-w-md mx-auto">
          <p className="text-sm">{error}</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="md" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workspace</span>
          </Button>
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-rose-500" />
            Administrator Console
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            System metrics, user management, and telemetry overview.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-rose-500 border-rose-500/30 bg-rose-500/10 py-1.5 px-3">
          Clearance Level: OMEGA
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-border/60 bg-nexus-surface/40">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-nexus-cyan/10 border border-nexus-cyan/30 flex items-center justify-center text-nexus-cyan">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Total Users
              </p>
              <p className="text-2xl font-bold font-mono text-foreground">
                {data.metrics.totalUsers}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-nexus-surface/40">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Catalog Items
              </p>
              <p className="text-2xl font-bold font-mono text-foreground">
                {data.metrics.totalProducts}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-nexus-surface/40">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                System Status
              </p>
              <p className="text-lg font-bold font-mono text-foreground mt-1">
                {data.metrics.systemStatus}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-nexus-surface/40">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-nexus-violet/10 border border-nexus-violet/30 flex items-center justify-center text-nexus-violet">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Telemetry
              </p>
              <p className="text-lg font-bold font-mono text-foreground mt-1">
                {data.metrics.telemetryUptime}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Registered Personnel</span>
            <Badge variant="outline" className="font-mono text-[10px]">
              {data.users.length} Records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-nexus-surface/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg font-semibold tracking-wider">Name</th>
                  <th className="px-4 py-3 font-semibold tracking-wider">Email</th>
                  <th className="px-4 py-3 font-semibold tracking-wider">Role</th>
                  <th className="px-4 py-3 rounded-tr-lg font-semibold tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {data.users.map((user) => (
                  <tr key={user.id} className="hover:bg-nexus-surface/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground text-xs">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={user.role === "ADMIN" ? "emerald" : "outline"}
                        className="text-[10px]"
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
