"use client";

import React from "react";
import { Server, Cpu, ShieldCheck, Activity, Terminal, GitBranch, RefreshCw, Eye } from "lucide-react";

interface SystemStatusProps {
  status?: {
    systemStatusLabel?: string;
    statusInfrastructure?: string;
    statusAutomation?: string;
    statusMonitoring?: string;
    statusDeployment?: string;
    technicalTypographyEnabled?: boolean;
    technicalDotPatternEnabled?: boolean;
    technicalMetadataEnabled?: boolean;
    technicalDecorationsEnabled?: boolean;
  };
}

export default function SystemStatus({ status }: SystemStatusProps) {
  // Visual flag defaults (governed by Admin SiteSettings)
  const techType = status?.technicalTypographyEnabled ?? true;
  const techDots = status?.technicalDotPatternEnabled ?? true;
  const techMeta = status?.technicalMetadataEnabled ?? true;
  const techDeco = status?.technicalDecorationsEnabled ?? true;

  const fontClass = techType ? "font-mono" : "font-sans";

  // System status domains matching the requested Nothing-inspired visual language:
  // INFRASTRUCTURE, CLOUD, AUTOMATION, CI/CD, SECURITY, OBSERVABILITY
  const subsystems = [
    {
      id: "INFRA",
      category: "INFRASTRUCTURE",
      value: status?.statusInfrastructure || "OPERATIONAL",
      metric: "HYBRID · AWS / ON-PREM",
      spec: "10+ YRS PRODUCTION",
      icon: Server,
    },
    {
      id: "CLOUD",
      category: "CLOUD",
      value: "ACTIVE",
      metric: "MULTI-REGION · VPC",
      spec: "AWS · AZURE · GCP",
      icon: RefreshCw,
    },
    {
      id: "AUTO",
      category: "AUTOMATION",
      value: status?.statusAutomation || "ACTIVE",
      metric: "IAC · TERRAFORM",
      spec: "ANSIBLE · SCRIPTS",
      icon: Cpu,
    },
    {
      id: "CICD",
      category: "CI/CD",
      value: status?.statusDeployment || "READY",
      metric: "GITOPS · PIPELINES",
      spec: "ZERO-DOWNTIME",
      icon: GitBranch,
    },
    {
      id: "SEC",
      category: "SECURITY",
      value: "ENFORCED",
      metric: "IAM · HARDENING",
      spec: "WAF · SSL/TLS 1.3",
      icon: ShieldCheck,
    },
    {
      id: "OBSV",
      category: "OBSERVABILITY",
      value: status?.statusMonitoring || "ACTIVE",
      metric: "METRICS & LOGS",
      spec: "PROMETHEUS · ELK",
      icon: Eye,
    },
  ];

  return (
    <section
      id="status"
      className={`border-y border-zinc-800/80 bg-zinc-950/70 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${fontClass}`}
    >
      {/* Subtle Dot Grid Background (Nothing-inspired) */}
      {techDots && (
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
          aria-hidden="true"
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6 relative">
        {/* Top Control Bar / Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-4">
            {/* Minimal Dot Indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="text-xs font-bold tracking-widest text-emerald-400 font-nothing">
                ● {status?.systemStatusLabel || "ONLINE"}
              </span>
            </div>

            {/* Dotted separator */}
            {techDeco && <span className="text-zinc-700 text-xs hidden sm:inline font-nothing">·····</span>}

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">
                  SYSTEM STATUS
                </h2>
                {techMeta && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-nothing">
                    DIAG / 003
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Micro system metadata & disclaimer */}
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-400">
            {techDots && (
              <span className="text-zinc-500 tracking-widest hidden lg:inline font-nothing">
                [ ● ● ● ● ● ]
              </span>
            )}
            <span className="text-zinc-400 uppercase tracking-wider font-mono">
              PORTFOLIO ENVIRONMENT VISUALIZATION
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-zinc-500 font-mono">
              NOT PRODUCTION TELEMETRY
            </span>
          </div>
        </div>

        {/* 6 Subsystem Grid: INFRASTRUCTURE, CLOUD, AUTOMATION, CI/CD, SECURITY, OBSERVABILITY */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {subsystems.map((sub, idx) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.id}
                className="group p-3.5 rounded bg-zinc-900/60 border border-zinc-800/90 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3 relative"
              >
                {/* Micro corner accent */}
                {techDeco && (
                  <span
                    className="absolute top-1.5 right-1.5 text-[9px] text-zinc-600 group-hover:text-zinc-400 select-none font-nothing"
                    aria-hidden="true"
                  >
                    +
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pb-1.5 border-b border-zinc-800/60 font-nothing">
                    <span className="tracking-widest font-semibold">{sub.id}</span>
                    <span className="text-zinc-600">0{idx + 1}</span>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-zinc-200 tracking-wider block">
                      {sub.category}
                    </span>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="text-[10px] font-bold text-emerald-400 tracking-wider font-nothing">
                        {sub.value}
                      </span>
                    </div>
                  </div>
                </div>

                {techMeta && (
                  <div className="pt-2 border-t border-zinc-800/60 space-y-0.5 text-[9px] text-zinc-400 font-mono">
                    <div className="truncate text-zinc-300">{sub.metric}</div>
                    <div className="truncate text-zinc-500">{sub.spec}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
