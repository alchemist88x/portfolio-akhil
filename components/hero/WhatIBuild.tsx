"use client";

import React from "react";
import { Cloud, Cpu, ShieldCheck, Activity, Terminal, GitBranch } from "lucide-react";

export default function WhatIBuild() {
  const pillars = [
    {
      number: "01",
      title: "CLOUD ARCHITECTURE",
      description:
        "Multi-cloud virtual infrastructure across AWS and Azure. Designing resilient VPC topologies, multi-AZ subnets, transit gateways, and edge distributions.",
      icon: Cloud,
      tags: ["AWS", "Azure", "GCP", "VPC", "ALB", "S3"],
    },
    {
      number: "02",
      title: "INFRASTRUCTURE AS CODE",
      description:
        "Declarative, reproducible cloud provisioning using Terraform, CloudFormation, and Ansible. Immutable environments with zero manual drift.",
      icon: Cpu,
      tags: ["Terraform", "CloudFormation", "Ansible", "GitOps"],
    },
    {
      number: "03",
      title: "CONTAINERS & CLUSTERS",
      description:
        "Packaging microservices with Docker and orchestrating reliable container workloads using Amazon ECS and Kubernetes clusters.",
      icon: Terminal,
      tags: ["Docker", "Kubernetes", "ECS", "Microservices"],
    },
    {
      number: "04",
      title: "CI/CD & AUTOMATION",
      description:
        "Continuous integration and continuous delivery pipelines via Jenkins, GitLab CI, and GitHub Actions with automated linting, test suites, and zero-downtime rollouts.",
      icon: GitBranch,
      tags: ["GitHub Actions", "GitLab CI", "Jenkins", "Travis CI"],
    },
    {
      number: "05",
      title: "SECURITY & COMPLIANCE",
      description:
        "Layer 7 Web Application Firewalls (AWS WAF), edge DDoS mitigation via Cloudflare, secret lifecycle rotation, and enterprise firewall defense (SonicWall, Cisco, Sophos).",
      icon: ShieldCheck,
      tags: ["AWS WAF", "Secret Manager", "SonicWall", "Sophos", "Cisco"],
    },
    {
      number: "06",
      title: "OBSERVABILITY & TELEMETRY",
      description:
        "Centralized metric collection, distributed logging, and real-time threshold alarms using Prometheus, ELK Stack, and CloudWatch.",
      icon: Activity,
      tags: ["Prometheus", "ELK Stack", "Grafana", "CloudWatch"],
    },
  ];

  return (
    <section id="what-i-build" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold">05</span>
            <span className="text-zinc-600 font-mono">/</span>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
              WHAT I BUILD
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            CORE INFRASTRUCTURE DISCIPLINES
          </span>
        </div>

        {/* Grid of 6 Engineering Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group p-6 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition-all font-mono space-y-4 hover:bg-zinc-900/40 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600 font-bold tracking-wider">
                    {pillar.number}
                  </span>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                    <Icon size={18} />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-100 tracking-wider uppercase">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                    {pillar.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-900">
                  {pillar.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
