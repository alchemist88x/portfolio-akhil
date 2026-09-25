"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Database, Cloud, Layers } from "lucide-react";
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
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featuredList = projects
    .filter((p) => p.featured && p.published)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <section id="work" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/30">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold">08</span>
            <span className="text-zinc-600 font-mono">/</span>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
              FEATURED PROJECTS
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            PRODUCTION INFRASTRUCTURE CASE STUDIES
          </span>
        </div>

        {featuredList.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-zinc-800 rounded-lg font-mono">
            <p className="text-sm font-bold tracking-widest text-zinc-400 uppercase">
              PROJECTS ARE BEING CONFIGURED
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Active infrastructure case studies will appear once published in the control plane.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredList.map((project, index) => (
              <div
                key={project._id}
                className="group p-6 sm:p-7 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all font-mono space-y-5 flex flex-col justify-between hover:bg-zinc-900/40"
              >
                <div className="space-y-4">
                  {/* Category & Index */}
                  <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-3">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {project.category || "Cloud Infrastructure"}
                    </span>
                    <span className="text-zinc-600 font-bold">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Type */}
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-zinc-100 uppercase group-hover:text-emerald-400 transition-colors">
                      {project.name}
                    </h3>
                    {project.projectType && (
                      <p className="text-xs text-zinc-400 mt-1">{project.projectType}</p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
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
                        className="hover:text-emerald-400 transition-colors"
                        title="Live System"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
