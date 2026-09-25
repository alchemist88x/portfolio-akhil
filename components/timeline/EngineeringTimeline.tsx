"use client";

import React from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ExperienceItem {
  _id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  technologies?: string[];
  location?: string;
  sortOrder: number;
  published: boolean;
}

interface TimelineProps {
  experiences: ExperienceItem[];
}

export default function EngineeringTimeline({ experiences }: TimelineProps) {
  const publishedExps = experiences
    .filter((e) => e.published)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (publishedExps.length === 0) return null;

  return (
    <section id="timeline" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold">04</span>
            <span className="text-zinc-600 font-mono">/</span>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
              ENGINEERING TIMELINE
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            CHRONOLOGICAL INFRASTRUCTURE TRAJECTORY
          </span>
        </div>

        {/* Desktop: Horizontal Timeline / Mobile: Vertical Timeline */}
        <div className="relative">
          {/* Horizontal Track for Desktop (hidden on mobile) */}
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-0.5 bg-zinc-800" />

          {/* Timeline Nodes Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            {publishedExps.map((exp, index) => {
              const startFormatted = formatDate(exp.startDate);
              const endFormatted = exp.current ? "Present" : formatDate(exp.endDate);

              return (
                <div key={exp._id || index} className="relative group">
                  {/* Node point */}
                  <div className="hidden lg:flex items-center gap-2 mb-6">
                    <span className="w-3.5 h-3.5 rounded-full bg-zinc-900 border-2 border-emerald-400 z-10 group-hover:scale-125 transition-transform" />
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider">
                      {startFormatted} — {endFormatted}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-3 font-mono">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-bold text-zinc-100 uppercase">{exp.role}</span>
                      {exp.current && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          CURRENT
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-emerald-400 font-semibold">
                      {exp.company}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500 lg:hidden">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {startFormatted} — {endFormatted}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {exp.location}
                        </span>
                      )}
                    </div>

                    {exp.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.technologies.slice(0, 8).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                        {exp.technologies.length > 8 && (
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500">
                            +{exp.technologies.length - 8} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
