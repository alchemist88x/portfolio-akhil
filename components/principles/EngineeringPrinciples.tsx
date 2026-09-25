"use client";

import React from "react";
import { ShieldCheck, Terminal, Eye, Layers } from "lucide-react";

interface PrincipleItem {
  _id?: string;
  number: string;
  title: string;
  description: string;
  sortOrder: number;
  published: boolean;
}

interface EngineeringPrinciplesProps {
  principles: PrincipleItem[];
}

export default function EngineeringPrinciples({ principles }: EngineeringPrinciplesProps) {
  const publishedPrinciples = principles
    .filter((p) => p.published)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (publishedPrinciples.length === 0) return null;

  return (
    <section id="principles" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold">13</span>
            <span className="text-zinc-600 font-mono">/</span>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
              ENGINEERING PRINCIPLES
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            SYSTEM RELIABILITY &amp; ARCHITECTURAL LAWS
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedPrinciples.map((principle) => (
            <div
              key={principle._id || principle.number}
              className="p-6 rounded-lg bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-all font-mono space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="text-xs font-bold text-emerald-400">
                    LAW // {principle.number}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>

                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide leading-snug">
                  {principle.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                  {principle.description}
                </p>
              </div>

              <div className="text-[10px] text-zinc-600 tracking-widest uppercase pt-2 border-t border-zinc-900">
                PRODUCTION STANDARD
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
