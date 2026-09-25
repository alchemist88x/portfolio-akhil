"use client";

import React from "react";
import { Server, Activity, Cpu, CheckCircle } from "lucide-react";

interface SystemStatusProps {
  status?: {
    systemStatusLabel?: string;
    statusInfrastructure?: string;
    statusAutomation?: string;
    statusMonitoring?: string;
    statusDeployment?: string;
  };
}

export default function SystemStatus({ status }: SystemStatusProps) {
  const items = [
    {
      label: "Infrastructure",
      value: status?.statusInfrastructure || "Operational",
      icon: Server,
      color: "text-emerald-400",
      dot: "bg-emerald-400",
    },
    {
      label: "Automation",
      value: status?.statusAutomation || "Active",
      icon: Cpu,
      color: "text-emerald-400",
      dot: "bg-emerald-400",
    },
    {
      label: "Monitoring",
      value: status?.statusMonitoring || "Active",
      icon: Activity,
      color: "text-emerald-400",
      dot: "bg-emerald-400",
    },
    {
      label: "Deployment",
      value: status?.statusDeployment || "Ready",
      icon: CheckCircle,
      color: "text-emerald-400",
      dot: "bg-emerald-400",
    },
  ];

  return (
    <section className="border-y border-zinc-800/80 bg-zinc-950/60 py-6 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Main Status Header */}
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 status-pulse flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-zinc-200 uppercase">
                PERSONAL SYSTEM
              </span>
              <span className="text-[11px] text-emerald-400 font-bold">
                ● {status?.systemStatusLabel || "ONLINE"}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Portfolio environment status visualization
            </p>
          </div>
        </div>

        {/* 4 Status indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2.5 text-xs">
                <Icon size={14} className="text-zinc-500 flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-zinc-400 block leading-tight">{item.label}</span>
                  <span className="text-zinc-200 font-bold flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
