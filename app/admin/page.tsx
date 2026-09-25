"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import {
  MessageSquare,
  MailCheck,
  Archive,
  FolderGit2,
  Code2,
  Briefcase,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Activity,
} from "lucide-react";

interface DashboardStats {
  totalMessages: number;
  newMessages: number;
  readMessages: number;
  archivedMessages: number;
  projectsCount: number;
  skillCategoriesCount: number;
  skillsCount: number;
  experienceCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load dashboard metrics");
      }
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingState message="FETCHING CLUSTER TELEMETRY..." />;
  if (error) return <ErrorState message={error} onRetry={fetchStats} />;

  const metricCards = [
    {
      label: "TOTAL MESSAGES",
      value: stats?.totalMessages ?? 0,
      icon: MessageSquare,
      color: "text-zinc-100",
      href: "/admin/messages",
      subtext: "Inquiries submitted",
    },
    {
      label: "NEW MESSAGES",
      value: stats?.newMessages ?? 0,
      icon: Activity,
      color: "text-sky-400",
      href: "/admin/messages?status=new",
      subtext: "Awaiting review",
    },
    {
      label: "READ MESSAGES",
      value: stats?.readMessages ?? 0,
      icon: MailCheck,
      color: "text-emerald-400",
      href: "/admin/messages?status=read",
      subtext: "Reviewed inquiries",
    },
    {
      label: "ARCHIVED MESSAGES",
      value: stats?.archivedMessages ?? 0,
      icon: Archive,
      color: "text-amber-400",
      href: "/admin/messages?status=archived",
      subtext: "Historical records",
    },
    {
      label: "PROJECTS",
      value: stats?.projectsCount ?? 0,
      icon: FolderGit2,
      color: "text-emerald-400",
      href: "/admin/projects",
      subtext: "Architecture case studies",
    },
    {
      label: "SKILL CATEGORIES",
      value: stats?.skillCategoriesCount ?? 0,
      icon: Layers,
      color: "text-sky-400",
      href: "/admin/skills",
      subtext: "Domain taxonomy",
    },
    {
      label: "SKILLS",
      value: stats?.skillsCount ?? 0,
      icon: Code2,
      color: "text-zinc-100",
      href: "/admin/skills",
      subtext: "Verified proficiencies",
    },
    {
      label: "EXPERIENCE",
      value: stats?.experienceCount ?? 0,
      icon: Briefcase,
      color: "text-amber-400",
      href: "/admin/experience",
      subtext: "Career trajectory roles",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminHeader
        title="CONTROL PLANE OVERVIEW"
        subtitle="Live telemetry and system state from MongoDB cluster"
        badge="SYS: READY"
        actions={
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
            <span className="text-xs font-mono text-emerald-400">CLUSTER ONLINE</span>
          </div>
        }
      />

      {/* Grid of 8 Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group p-5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg hover:border-zinc-700 transition-all hover:bg-zinc-900/40 relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-zinc-500 mb-3">
                <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">
                  {card.label}
                </span>
                <Icon size={16} className="group-hover:text-zinc-300 transition-colors" />
              </div>
              <div className="flex items-baseline justify-between">
                <div className={`text-3xl font-mono font-bold tracking-tight ${card.color}`}>
                  {card.value}
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-zinc-600 group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
              <p className="text-[11px] font-mono text-zinc-500 mt-2">{card.subtext}</p>
            </Link>
          );
        })}
      </div>

      {/* Control Plane Quick Links & Architecture Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* System Diagnostics */}
        <div className="p-6 bg-zinc-950/60 border border-zinc-800/80 rounded-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-emerald-400" />
              <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-200 uppercase">
                SYSTEM DIAGNOSTICS
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
              OPERATIONAL
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-zinc-900">
              <span className="text-zinc-500">Database Engine</span>
              <span className="text-zinc-300">MongoDB / Mongoose ODM</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-900">
              <span className="text-zinc-500">Runtime Framework</span>
              <span className="text-zinc-300">Next.js App Router (v16.3)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-900">
              <span className="text-zinc-500">Authentication Protocol</span>
              <span className="text-zinc-300">Stateless JWT / HttpOnly Cookie</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-zinc-500">Security Layer</span>
              <span className="text-zinc-300">Zod Validation & Token Bucket Rate Limiting</span>
            </div>
          </div>
        </div>

        {/* Quick Operations */}
        <div className="p-6 bg-zinc-950/60 border border-zinc-800/80 rounded-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-sky-400" />
              <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-200 uppercase">
                QUICK ACCESS
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">SHORTCUTS</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <Link
              href="/admin/projects"
              className="p-3 rounded bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors flex flex-col justify-between"
            >
              <span className="text-zinc-400">Manage</span>
              <span className="font-semibold mt-1">Featured Projects →</span>
            </Link>
            <Link
              href="/admin/skills"
              className="p-3 rounded bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors flex flex-col justify-between"
            >
              <span className="text-zinc-400">Update</span>
              <span className="font-semibold mt-1">Skills Matrix →</span>
            </Link>
            <Link
              href="/admin/messages"
              className="p-3 rounded bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors flex flex-col justify-between"
            >
              <span className="text-zinc-400">Inspect</span>
              <span className="font-semibold mt-1">Client Inquiries →</span>
            </Link>
            <Link
              href="/admin/settings"
              className="p-3 rounded bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors flex flex-col justify-between"
            >
              <span className="text-zinc-400">Configure</span>
              <span className="font-semibold mt-1">Hero & Status →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
