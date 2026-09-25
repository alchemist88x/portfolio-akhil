"use client";

import React from "react";
import { Calendar, MapPin, Globe, ExternalLink } from "lucide-react";
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

interface TimelineProps {
  experiences: ExperienceItem[];
  visualSettings?: {
    technicalTypographyEnabled?: boolean;
    technicalDotPatternEnabled?: boolean;
    technicalMetadataEnabled?: boolean;
    technicalDecorationsEnabled?: boolean;
  };
}

export default function EngineeringTimeline({ experiences, visualSettings }: TimelineProps) {
  const techType = visualSettings?.technicalTypographyEnabled ?? true;
  const techDots = visualSettings?.technicalDotPatternEnabled ?? true;
  const techMeta = visualSettings?.technicalMetadataEnabled ?? true;
  const techDeco = visualSettings?.technicalDecorationsEnabled ?? true;

  const fontClass = techType ? "font-mono" : "font-sans";

  const publishedExps = experiences
    .filter((e) => e.published)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (publishedExps.length === 0) return null;

  return (
    <section
      id="timeline"
      className={`py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/40 relative overflow-hidden ${fontClass}`}
    >
      {/* Subtle Dot Grid Background (Nothing-inspired) */}
      {techDots && (
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
          aria-hidden="true"
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6 relative">
        {/* Section Header - Compact */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-400 font-nothing">04</span>
            <span className="text-zinc-600">/</span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-100 uppercase">
              ENGINEERING TIMELINE
            </h2>
            {techDots && (
              <span className="hidden md:inline text-zinc-600 text-xs tracking-widest pl-2 font-nothing">
                · · · · · · · ·
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            {techMeta && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-nothing">
                LOG: TRAJECTORY
              </span>
            )}
            <span className="text-zinc-400 uppercase tracking-wider text-[10px]">
              CHRONOLOGICAL INFRASTRUCTURE TRAJECTORY
            </span>
          </div>
        </div>

        {/* Technical System-Log Timeline Grid - Streamlined & Compact */}
        <div className="space-y-4">
          {publishedExps.map((exp, index) => {
            const startFormatted = formatDate(exp.startDate).toUpperCase();
            const endFormatted = exp.current ? "PRESENT" : formatDate(exp.endDate).toUpperCase();
            const logIndex = String(index + 1).padStart(2, "0");

            return (
              <div
                key={exp._id || index}
                className="group relative p-4 sm:p-5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3"
              >
                {/* Micro corner accent */}
                {techDeco && (
                  <span
                    className="absolute top-1.5 right-2 text-[9px] text-zinc-700 group-hover:text-zinc-400 select-none font-nothing"
                    aria-hidden="true"
                  >
                    +
                  </span>
                )}

                {/* System Log Header Strip - Compact */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2.5 border-b border-zinc-800/80">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* 01 / 02 / 03 System Log ID in Nothing font */}
                    <span className="text-xs font-bold text-zinc-400 bg-zinc-900/90 px-1.5 py-0.5 rounded border border-zinc-800 font-nothing">
                      {logIndex}
                    </span>

                    {/* Role Title */}
                    <h3 className="text-sm sm:text-base font-bold text-zinc-100 uppercase tracking-wide">
                      {exp.role}
                    </h3>
                  </div>

                  {/* Status & Date Micro-Label in Nothing font */}
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="text-zinc-300 font-semibold tracking-wider flex items-center gap-1.5 font-nothing text-[10px]">
                      <Calendar size={12} className="text-zinc-500" />
                      {startFormatted} — {endFormatted}
                    </span>

                    {/* Subtle CURRENT Indicator */}
                    {exp.current && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 text-[9px] font-bold tracking-wider font-nothing">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        CURRENT
                      </span>
                    )}
                  </div>
                </div>

                {/* Company Name & Metadata Block - Compact Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">
                      {exp.company}
                    </span>
                    {exp.website && (
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-[10px] underline underline-offset-4 decoration-zinc-700 hover:decoration-emerald-400"
                        title={exp.website}
                      >
                        <Globe size={10} />
                        <span>WEBSITE</span>
                        <ExternalLink size={9} />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-zinc-400">
                    {exp.employmentType && (
                      <span className="text-zinc-400 uppercase font-nothing">
                        {exp.employmentType.toUpperCase()}
                      </span>
                    )}
                    {exp.location && (
                      <>
                        <span className="text-zinc-700 hidden sm:inline">·</span>
                        <span className="flex items-center gap-1 text-zinc-400">
                          <MapPin size={10} className="text-zinc-500" />
                          {exp.location.toUpperCase()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Role Description - High readability font-sans */}
                {exp.description && (
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans pt-0.5">
                    {exp.description}
                  </p>
                )}

                {/* Key Responsibilities - Compact */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-zinc-400 font-sans">
                      {exp.responsibilities.slice(0, 4).map((resp, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-nothing mt-0.5 text-[9px]">▸</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Verified Stack / Technologies - Compact pills */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-zinc-900/80">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider mr-1 font-semibold font-nothing">
                      STACK:
                    </span>
                    {exp.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-1.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-[9px] text-zinc-300 hover:border-zinc-700 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
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
