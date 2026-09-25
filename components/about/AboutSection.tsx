"use client";

import React from "react";
import { Terminal, ShieldCheck, Cpu } from "lucide-react";

interface AboutSectionProps {
  about?: {
    title: string;
    statementHeadline: string;
    statementSubheadline: string;
    paragraphs: string[];
  };
}

export default function AboutSection({ about }: AboutSectionProps) {
  const headline = about?.statementHeadline || "Infrastructure is invisible when it works.";
  const subheadline = about?.statementSubheadline || "My job is to make sure it keeps working.";
  const title = about?.title || "Behind the infrastructure";
  const paragraphs = about?.paragraphs || [
    "I'm Akhil, a DevOps and Cloud Infrastructure Engineer with 10+ years of experience working with servers, cloud platforms, automation and production systems.",
    "I enjoy turning complicated infrastructure into systems that are predictable, automated and easier to operate.",
    "My work sits between application development and infrastructure — making sure software doesn't just work during development, but continues working reliably in production.",
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/40">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold font-nothing">12</span>
            <span className="text-zinc-600 font-mono">/</span>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
              ABOUT
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500 font-nothing">
            ENGINEERING PHILOSOPHY &amp; BACKGROUND
          </span>
        </div>

        {/* Large Editorial Statement Quote (Requirement 13) */}
        <div className="p-8 sm:p-12 rounded-xl bg-gradient-to-b from-zinc-950 to-[#0A0A0A] border border-zinc-800/90 relative overflow-hidden">
          <div className="relative z-10 max-w-4xl space-y-3 font-mono">
            <span className="text-[11px] text-emerald-400 uppercase tracking-widest block font-bold font-nothing">
              // CORE OPERATIONAL THESIS
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-100 leading-snug">
              &ldquo;{headline}&rdquo;
            </h3>
            <p className="text-lg sm:text-xl text-zinc-400 font-semibold">
              {subheadline}
            </p>
          </div>
        </div>

        {/* Narrative & Paragraphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 font-mono space-y-4">
            <h3 className="text-lg font-bold text-zinc-100 uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-nothing">
              OPERATING RELIABLE, ZERO-DRIFT INFRASTRUCTURE IN PRODUCTION ENVIRONMENTS FOR OVER A DECADE.
            </p>

            <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs space-y-2 text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-200 font-bold">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="font-nothing">10+ YEARS UPTIME FOCUS</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Bridging developer velocity with high availability, zero downtime, and robust telemetry.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6 font-mono text-sm text-zinc-300 leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="p-5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
