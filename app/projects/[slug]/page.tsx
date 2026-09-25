import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { defaultProjects } from "@/lib/initial-data";
import { ArrowLeft, ExternalLink, Cloud, Database, Layers, CheckCircle2, Shield, Server, Globe } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const db = await connectToDatabase();

  let project: any = null;

  if (db.isConnected) {
    try {
      project = await Project.findOne({ slug, published: true }).lean();
      if (project) {
        project = JSON.parse(JSON.stringify(project));
      }
    } catch (e) {
      console.error("[Project Detail Query Error]", e);
    }
  }

  // Resilient fallback to initial projects if DB is connecting
  if (!project) {
    const fallback = defaultProjects.find(
      (p: any) => (p.slug === slug || p.slug === slug.toLowerCase()) && p.published
    );
    if (fallback) project = fallback;
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-mono selection:bg-emerald-500/20 selection:text-emerald-400">
      <Navigation
        items={[
          { label: "WORK", sectionId: "work", published: true },
          { label: "STACK", sectionId: "stack", published: true },
          { label: "EXPERIENCE", sectionId: "experience", published: true },
          { label: "BLOG", sectionId: "blog", published: true },
          { label: "ABOUT", sectionId: "about", published: true },
          { label: "CONTACT", sectionId: "contact", published: true },
        ]}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-emerald-400 transition-colors uppercase"
          >
            <ArrowLeft size={14} />
            <span>BACK TO PRODUCTION CASE STUDIES</span>
          </Link>
        </div>

        {/* Case Study Header Banner */}
        <div className="p-8 sm:p-10 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-zinc-900 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
                {project.category || "Cloud Infrastructure"}
              </span>

              {project.environment && (
                <span className="text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-800/50 flex items-center gap-1.5 font-bold uppercase text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {project.environment}
                </span>
              )}
            </div>

            {project.projectType && (
              <span className="text-zinc-400 bg-zinc-900 px-3 py-1 rounded border border-zinc-800">
                {project.projectType}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 uppercase">
              {project.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mt-4">
              {project.description}
            </p>
          </div>

          {/* Links Row */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold tracking-wider transition-all duration-200 shadow-lg shadow-emerald-950/50 uppercase"
                >
                  <ExternalLink size={14} className="stroke-[2.5]" />
                  <span>VIEW LIVE PROJECT</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 tracking-wider transition-colors"
                >
                  <GithubIcon size={14} />
                  <span>REPOSITORY / GITOPS</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Infrastructure Architecture Stack (Frontend, Backend, Web Server) */}
        {(project.frontend || project.backend || project.webServer) && (
          <div className="p-6 sm:p-7 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase border-b border-zinc-900 pb-2">
              <Server size={15} className="text-emerald-400" />
              <span>INFRASTRUCTURE ARCHITECTURE STACK</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.frontend && (
                <div className="p-4 rounded bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">FRONTEND HOSTING</span>
                  <span className="text-sm font-bold text-sky-400 block">{project.frontend}</span>
                </div>
              )}
              {project.backend && (
                <div className="p-4 rounded bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">BACKEND COMPUTE</span>
                  <span className="text-sm font-bold text-amber-400 block">{project.backend}</span>
                </div>
              )}
              {project.webServer && (
                <div className="p-4 rounded bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">WEB SERVER / PROXY</span>
                  <span className="text-sm font-bold text-emerald-400 block">{project.webServer}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Production Architecture Diagram */}
        {project.architectureDiagram && (
          <div className="p-6 sm:p-8 rounded-lg bg-zinc-950/90 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase">
                <Layers size={15} className="text-sky-400" />
                <span>PRODUCTION ARCHITECTURE TOPOLOGY</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                LIVE PRODUCTION FLOW
              </span>
            </div>
            <div className="p-5 sm:p-7 bg-[#050505] rounded-lg border border-zinc-900 overflow-x-auto shadow-inner">
              <pre className="text-xs sm:text-sm text-emerald-400 font-mono leading-relaxed select-all whitespace-pre">
                {project.architectureDiagram}
              </pre>
            </div>
          </div>
        )}

        {/* Technical Architecture Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cloud & AWS Services */}
          {((project.cloudPlatforms && project.cloudPlatforms.length > 0) ||
            (project.awsServices && project.awsServices.length > 0)) && (
            <div className="p-6 rounded-lg bg-zinc-950/70 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase border-b border-zinc-900 pb-2">
                <Cloud size={15} className="text-sky-400" />
                <span>CLOUD INFRASTRUCTURE &amp; AWS SERVICES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.cloudPlatforms?.map((c: string, idx: number) => (
                  <span
                    key={`c-${idx}`}
                    className="px-3 py-1 rounded bg-sky-950/60 text-sky-400 border border-sky-800/50 text-xs font-semibold"
                  >
                    {c}
                  </span>
                ))}
                {project.awsServices?.map((aws: string, idx: number) => (
                  <span
                    key={`aws-${idx}`}
                    className="px-3 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs"
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
            <div className="p-6 rounded-lg bg-zinc-950/70 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase border-b border-zinc-900 pb-2">
                <Database size={15} className="text-emerald-400" />
                <span>DATA STORAGE &amp; AUTOMATED CI/CD</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.databases?.map((db: string, idx: number) => (
                  <span
                    key={`db-${idx}`}
                    className="px-3 py-1 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 text-xs"
                  >
                    {db}
                  </span>
                ))}
                {project.cicdTools?.map((tool: string, idx: number) => (
                  <span
                    key={`tool-${idx}`}
                    className="px-3 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40 text-xs"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="p-6 rounded-lg bg-zinc-950/70 border border-zinc-800 space-y-3">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
              STACK COMPONENTS &amp; RUNTIMES:
            </span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Responsibilities & Achievements */}
        {project.responsibilities && project.responsibilities.length > 0 && (
          <div className="p-6 sm:p-8 rounded-lg bg-zinc-950/70 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase border-b border-zinc-900 pb-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>ENGINEERING SCOPE &amp; IMPLEMENTATION</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {project.responsibilities.map((resp: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold mt-0.5">▸</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
