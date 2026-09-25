"use client";

import React from "react";
import HeroTerminal from "./HeroTerminal";
import { ArrowRight, Terminal, Layers } from "lucide-react";

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
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center tech-grid pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Top Technical Metadata Row (Requirement 9) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-zinc-950/70 border border-zinc-800/80 font-mono text-xs">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">ENGINEER</span>
            <span className="font-bold text-zinc-100 uppercase tracking-wider">
              {settings.name || "AKHIL"}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">ROLE</span>
            <span className="font-bold text-zinc-100 uppercase tracking-wider">
              {settings.title ? settings.title.split("&")[0].trim().toUpperCase() : "DEVOPS ENGINEER"}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">EXPERIENCE</span>
            <span className="font-bold text-emerald-400 uppercase tracking-wider">
              {settings.experienceYears || "10+ YEARS"}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">REGION</span>
            <span className="font-bold text-zinc-100 uppercase tracking-wider">
              {settings.location ? settings.location.toUpperCase() : "KOCHI, INDIA"}
            </span>
          </div>
        </div>

        {/* Hero Main Content & Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Editorial */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-pulse" />
              <span>{settings.heroLabel || "SYSTEM / 001"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 leading-[1.12]">
              {settings.heroHeadline || "10 years of building infrastructure that keeps applications alive."}
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-mono">
              {settings.heroDescription ||
                "DevOps and Cloud Engineer focused on cloud infrastructure, automation, Linux systems, CI/CD, security, monitoring and production environments."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
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

          {/* Right Column: Hero Interactive Terminal (Requirement 10 & 11) */}
          <div className="lg:col-span-5">
            <HeroTerminal
              commands={terminalCommands}
              metadata={{
                name: settings.fullName || settings.name,
                title: settings.title,
                experienceYears: settings.experienceYears,
                location: settings.location,
                contactEmail: settings.contactEmail,
              }}
              skills={skills}
              projects={projects}
              experience={experience}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
