"use client";

import React, { useState } from "react";
import { Briefcase, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ExperienceItem {
  _id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
  location?: string;
  sortOrder: number;
  published: boolean;
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const publishedExps = experiences
    .filter((e) => e.published)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold">10</span>
            <span className="text-zinc-600 font-mono">/</span>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
              PROFESSIONAL EXPERIENCE
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            SYSTEM ADMINISTRATION &amp; CLOUD ARCHITECTURE
          </span>
        </div>

        {/* Experience Cards */}
        <div className="space-y-6">
          {publishedExps.map((exp, index) => {
            const expId = exp._id || String(index);
            const isExpanded = expandedId === expId || index === 0; // Default first open
            const startFormatted = formatDate(exp.startDate);
            const endFormatted = exp.current ? "Present" : formatDate(exp.endDate);

            return (
              <div
                key={expId}
                className="p-6 sm:p-8 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all font-mono space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-100 uppercase">
                        {exp.role}
                      </h3>
                      <span className="text-zinc-600 font-bold">@</span>
                      <span className="text-lg sm:text-xl font-bold text-emerald-400 uppercase">
                        {exp.company}
                      </span>
                      {exp.current && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold">
                          CURRENT ROLE
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-zinc-400" />
                        {startFormatted} — {endFormatted}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-zinc-400" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(expId)}
                    className="self-start md:self-center flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800"
                  >
                    <span>{isExpanded ? "Collapse Details" : "View Responsibilities"}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {exp.description && (
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {exp.description}
                  </p>
                )}

                {/* Collapsible Responsibilities & Technologies */}
                {isExpanded && (
                  <div className="space-y-6 pt-2 animate-in fade-in duration-200">
                    {/* Responsibilities list */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider block font-semibold">
                          KEY RESPONSIBILITIES &amp; SCOPE:
                        </span>
                        <ul className="space-y-2 text-xs text-zinc-300">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2.5 leading-relaxed">
                              <span className="text-emerald-500 mt-0.5 font-bold">▸</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies list */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-zinc-900">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider block font-semibold">
                          VERIFIED STACK FOR THIS ROLE:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:border-zinc-700 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
