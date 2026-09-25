"use client";

import React from "react";
import HeroTerminal from "./HeroTerminal";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  settings: {
    name: string;
    fullName: string;
    title: string;
    altTitle?: string;
    experienceYears: string;
    location: string;
    contactEmail: string;
    heroLabel: string;
    heroHeadline: string;
    heroDescription: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    technicalTypographyEnabled?: boolean;
    technicalDotPatternEnabled?: boolean;
    technicalMetadataEnabled?: boolean;
    technicalDecorationsEnabled?: boolean;
  };
  terminalCommands?: { command: string; description?: string; output?: string }[];
  skills?: string[];
  projects?: { name: string; category?: string }[];
  experience?: { company: string; role: string; dates: string }[];
}

export default function Hero({
  settings,
  terminalCommands = [],
  skills = [],
  projects = [],
  experience = [],
}: HeroProps) {
  const techType = settings.technicalTypographyEnabled ?? true;
  const techDots = settings.technicalDotPatternEnabled ?? true;
  const techMeta = settings.technicalMetadataEnabled ?? true;
  const techDeco = settings.technicalDecorationsEnabled ?? true;

  const fontClass = techType ? "font-mono" : "font-sans";

  return (
    <section className={`relative min-h-[92vh] flex flex-col justify-center tech-grid pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden ${fontClass}`}>
      {/* Subtle Dot Grid Background */}
      {techDots && (
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />
      )}

      <div className="max-w-7xl mx-auto w-full space-y-12 relative z-10">
        {/* Top Technical Metadata Row (Nothing-inspired) */}
        {techMeta && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs relative">
            {techDeco && (
              <span
                className="absolute top-1.5 right-2 text-[9px] text-zinc-600 select-none"
                aria-hidden="true"
              >
                +
              </span>
            )}
            <div>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-nothing">ENGINEER</span>
              <span className="font-bold text-zinc-100 uppercase tracking-wider">
                {settings.name || "AKHIL"}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-nothing">ROLE</span>
              <span className="font-bold text-zinc-100 uppercase tracking-wider truncate block">
                {settings.title ? settings.title.split("&")[0].trim().toUpperCase() : "DEVOPS ENGINEER"}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-nothing">EXPERIENCE</span>
              <span className="font-bold text-emerald-400 uppercase tracking-wider font-nothing">
                {settings.experienceYears || "10+ YEARS"}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-nothing">REGION</span>
              <span className="font-bold text-zinc-100 uppercase tracking-wider">
                {settings.location ? settings.location.toUpperCase() : "KOCHI, INDIA"}
              </span>
            </div>
          </div>
        )}

        {/* Hero Main Content & Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Editorial */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-nothing text-[10px] tracking-wider">{settings.heroLabel || "SYSTEM // 001"}</span>
              {techDots && <span className="text-zinc-600 text-[10px] font-nothing">· · · ·</span>}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 leading-[1.12]">
              {settings.heroHeadline || "10 years of building infrastructure that keeps applications alive."}
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-sans">
              {settings.heroDescription ||
                "DevOps and Cloud Engineer focused on cloud infrastructure, automation, Linux systems, CI/CD, security, monitoring and production environments."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <a
                href={settings.primaryCtaLink || "#work"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-bold tracking-wider transition-all hover:gap-3"
              >
                <span>{settings.primaryCtaText || "VIEW WORK →"}</span>
                <ArrowRight size={14} />
              </a>

              <a
                href={settings.secondaryCtaLink || "#contact"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 tracking-wider transition-colors"
              >
                <span>{settings.secondaryCtaText || "CONTACT →"}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Interactive Terminal */}
          <div className="lg:col-span-5">
            <HeroTerminal
              commands={terminalCommands}
              metadata={{
                name: settings.name,
                fullName: settings.fullName,
                title: settings.title,
                experienceYears: settings.experienceYears,
                location: settings.location,
                contactEmail: settings.contactEmail,
              }}
              skills={skills}
              projects={projects}
              experience={experience}
              visualSettings={{
                technicalTypographyEnabled: techType,
                technicalDotPatternEnabled: techDots,
                technicalMetadataEnabled: techMeta,
                technicalDecorationsEnabled: techDeco,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
