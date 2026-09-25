"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";

interface ProjectItem {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  description: string;
  projectType?: string;
  technologies?: string[];
  cloudPlatforms?: string[];
  awsServices?: string[];
  azureServices?: string[];
  databases?: string[];
  cicdTools?: string[];
  responsibilities?: string[];
  environment?: string;
  frontend?: string;
  backend?: string;
  webServer?: string;
  architectureDiagram?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

interface FeaturedProjectsProps {
  projects: ProjectItem[];
  visualSettings?: {
    technicalTypographyEnabled?: boolean;
    technicalDotPatternEnabled?: boolean;
    technicalMetadataEnabled?: boolean;
    technicalDecorationsEnabled?: boolean;
  };
}

export default function FeaturedProjects({ projects, visualSettings }: FeaturedProjectsProps) {
  const techType = visualSettings?.technicalTypographyEnabled ?? true;
  const techDots = visualSettings?.technicalDotPatternEnabled ?? true;
  const techMeta = visualSettings?.technicalMetadataEnabled ?? true;
  const techDeco = visualSettings?.technicalDecorationsEnabled ?? true;

  const fontClass = techType ? "font-mono" : "font-sans";

  const featuredList = projects
    .filter((p) => p.featured && p.published)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <section
      id="work"
      className={`py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/30 relative overflow-hidden ${fontClass}`}
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
            <span className="text-xs font-bold text-emerald-400 font-nothing">08</span>
            <span className="text-zinc-600">/</span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 uppercase">
              FEATURED PROJECTS
            </h2>
            {techDots && (
              <span className="hidden md:inline text-zinc-600 text-xs tracking-widest pl-2 font-nothing">
                · · · · · · · · · ·
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            {techMeta && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-nothing">
                PROD / CASE STUDIES
              </span>
            )}
            <span className="text-zinc-400 uppercase tracking-wider text-[11px]">
              PRODUCTION INFRASTRUCTURE CASE STUDIES
            </span>
          </div>
        </div>

        {featuredList.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-zinc-800 rounded-lg">
            <p className="text-sm font-bold tracking-widest text-zinc-400 uppercase">
              PROJECTS ARE BEING CONFIGURED
            </p>
            <p className="text-xs text-zinc-600 mt-1 font-sans">
              Active infrastructure case studies will appear once published in the control plane.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredList.map((project, index) => {
              const projIndex = String(index + 1).padStart(2, "0");
              const envLabel = (project.environment || "PRODUCTION").toUpperCase();
              const categoryLabel = (project.category || "CLOUD INFRASTRUCTURE").toUpperCase();

              // Compute dynamic stack labels from project data
              const stackItems = [
                ...(project.cloudPlatforms || []),
                ...(project.awsServices || []).slice(0, 2),
                ...(project.technologies || []).slice(0, 3),
              ].filter(Boolean);

              const stackString =
                stackItems.length > 0
                  ? stackItems.slice(0, 4).join(" · ").toUpperCase()
                  : "AWS · LINUX · DEVOPS";

              return (
                <div
                  key={project._id}
                  className="group relative p-6 sm:p-7 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-5 flex flex-col justify-between hover:bg-zinc-900/40"
                >
                  {/* Micro corner accent */}
                  {techDeco && (
                    <span
                      className="absolute top-2 right-2 text-[10px] text-zinc-700 group-hover:text-zinc-400 select-none font-nothing"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  )}

                  <div className="space-y-4">
                    {/* Nothing-Inspired Technical Metadata Block */}
                    {techMeta ? (
                      <div className="grid grid-cols-2 gap-2 p-3 rounded bg-zinc-900/60 border border-zinc-800/70 text-[10px] font-nothing">
                        <div>
                          <span className="text-zinc-500 uppercase tracking-wider block text-[9px]">PROJECT</span>
                          <span className="text-zinc-200 font-bold">{projIndex}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase tracking-wider block text-[9px]">STATUS</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {envLabel}
                          </span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-zinc-800/60 flex items-center justify-between font-mono">
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[9px] block">STACK</span>
                            <span className="text-zinc-300 truncate block max-w-[200px] sm:max-w-xs">{stackString}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-zinc-500 uppercase tracking-wider text-[9px] block">ENV</span>
                            <span className="text-zinc-300 font-semibold">{project.environment ? project.environment.toUpperCase() : "CLOUD"}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Classic Category & Index fallback */
                      <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-3">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {categoryLabel}
                        </span>
                        <span className="text-zinc-600 font-bold">{projIndex}</span>
                      </div>
                    )}

                    {/* Title & Type */}
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-zinc-100 uppercase group-hover:text-emerald-400 transition-colors">
                        {project.name}
                      </h3>
                      {project.projectType && (
                        <p className="text-xs text-zinc-400 mt-1 font-sans">{project.projectType}</p>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 font-sans">
                      {project.description}
                    </p>

                    {/* Technical Matrix Specs */}
                    <div className="space-y-2 pt-2 border-t border-zinc-900/90 text-xs">
                      {/* Cloud Platforms & Services */}
                      {((project.cloudPlatforms && project.cloudPlatforms.length > 0) ||
                        (project.awsServices && project.awsServices.length > 0)) && (
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                            Cloud &amp; AWS Services:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {project.cloudPlatforms?.map((c, i) => (
                              <span
                                key={`cloud-${i}`}
                                className="px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-800/50 text-[10px]"
                              >
                                {c}
                              </span>
                            ))}
                            {project.awsServices?.map((aws, i) => (
                              <span
                                key={`aws-${i}`}
                                className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px]"
                              >
                                {aws}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Databases & CI/CD */}
                      {((project.databases && project.databases.length > 0) ||
                        (project.cicdTools && project.cicdTools.length > 0)) && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                            Storage &amp; CI/CD:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {project.databases?.map((db, i) => (
                              <span
                                key={`db-${i}`}
                                className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 text-[10px]"
                              >
                                {db}
                              </span>
                            ))}
                            {project.cicdTools?.map((cicd, i) => (
                              <span
                                key={`cicd-${i}`}
                                className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40 text-[10px]"
                              >
                                {cicd}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-emerald-400 font-bold tracking-wider transition-colors"
                    >
                      <span>VIEW CASE STUDY</span>
                      <ArrowRight size={13} />
                    </Link>

                    <div className="flex items-center gap-3 text-zinc-500">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-zinc-300 transition-colors"
                          title="GitHub Repository"
                        >
                          <GithubIcon size={14} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px] text-emerald-400 font-bold"
                          title="Live System"
                        >
                          <span>LIVE</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
