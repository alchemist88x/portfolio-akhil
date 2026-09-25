"use client";

import React, { useState } from "react";
import { Calendar, MapPin, Globe, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ExperienceItem {
  _id?: string;
  company: string;
  website?: string;
  employmentType?: string;
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
  visualSettings?: {
    technicalTypographyEnabled?: boolean;
    technicalDotPatternEnabled?: boolean;
    technicalMetadataEnabled?: boolean;
    technicalDecorationsEnabled?: boolean;
  };
}

export default function ExperienceSection({ experiences, visualSettings }: ExperienceSectionProps) {
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const techType = visualSettings?.technicalTypographyEnabled ?? true;
  const techDots = visualSettings?.technicalDotPatternEnabled ?? true;
  const techMeta = visualSettings?.technicalMetadataEnabled ?? true;
  const techDeco = visualSettings?.technicalDecorationsEnabled ?? true;

  const fontClass = techType ? "font-mono" : "font-sans";

  const publishedExps = experiences
    .filter((e) => e.published)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const toggleExpand = (id: string, currentExpanded: boolean) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: !currentExpanded,
    }));
  };

  return (
    <section
      id="experience"
      className={`py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/20 relative overflow-hidden ${fontClass}`}
    >
      {/* Subtle Dot Grid Background */}
      {techDots && (
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden="true"
        />
      )}

      <div className="max-w-7xl mx-auto space-y-12 relative">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-400 font-nothing">10</span>
            <span className="text-zinc-600">/</span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 uppercase">
              PROFESSIONAL EXPERIENCE
            </h2>
            {techDots && (
              <span className="hidden md:inline text-zinc-600 text-xs tracking-widest pl-2">
                · · · · · · · · · ·
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            {techMeta && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-nothing">
                ROLES: VERIFIED
              </span>
            )}
            <span className="text-zinc-400 uppercase tracking-wider text-[11px]">
              SYSTEM ADMINISTRATION &amp; CLOUD ARCHITECTURE
            </span>
          </div>
        </div>

        {/* Experience Cards */}
        <div className="space-y-6">
          {publishedExps.map((exp, index) => {
            const expId = exp._id || String(index);
            const isExpanded = expandedMap[expId] ?? (index === 0);
            const startFormatted = formatDate(exp.startDate).toUpperCase();
            const endFormatted = exp.current ? "PRESENT" : formatDate(exp.endDate).toUpperCase();
            const logIndex = String(index + 1).padStart(2, "0");

            return (
              <div
                key={expId}
                className="group relative p-6 sm:p-8 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-5"
              >
                {/* Micro corner accent */}
                {techDeco && (
                  <span
                    className="absolute top-2 right-2 text-[10px] text-zinc-700 group-hover:text-zinc-400 select-none"
                    aria-hidden="true"
                  >
                    +
                  </span>
                )}

                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-bold text-zinc-400 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800 font-nothing">
                        {logIndex}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-100 uppercase tracking-wide">
                        {exp.role}
                      </h3>
                      <span className="text-zinc-600 font-bold">@</span>
                      <span className="text-lg sm:text-xl font-bold text-emerald-400 uppercase tracking-wide">
                        {exp.company}
                      </span>
                      {exp.current && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 font-bold tracking-wider font-nothing">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          CURRENT
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                      <span className="flex items-center gap-1.5 text-zinc-300 font-semibold tracking-wider font-nothing text-[11px]">
                        <Calendar size={13} className="text-zinc-500" />
                        {startFormatted} — {endFormatted}
                      </span>
                      {exp.website && (
                        <a
                          href={exp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-400 hover:text-emerald-400 transition-colors text-[11px] underline underline-offset-4 decoration-zinc-700 hover:decoration-emerald-400"
                        >
                          <Globe size={12} />
                          <span>{exp.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                      {exp.employmentType && (
                        <span className="text-zinc-400 text-[11px] uppercase">
                          TYPE: {exp.employmentType.toUpperCase()}
                        </span>
                      )}
                      {exp.location && (
                        <span className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                          <MapPin size={12} className="text-zinc-500" />
                          {exp.location.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(expId, isExpanded)}
                    className="self-start md:self-center flex items-center gap-1.5 text-xs text-zinc-300 hover:text-zinc-100 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer select-none"
                  >
                    <span>{isExpanded ? "Collapse Details" : "View Responsibilities"}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {exp.description && (
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
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
                        <ul className="space-y-2 text-xs text-zinc-300 font-sans">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2.5 leading-relaxed">
                              <span className="text-emerald-400 font-mono mt-0.5 font-bold">▸</span>
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
