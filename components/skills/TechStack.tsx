"use client";

import React, { useState } from "react";
import { Cloud, Code, Layers, GitBranch, Activity, Network, Shield, Database, Server, Cpu, Star } from "lucide-react";

interface SkillItem {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  level?: "Expert" | "Advanced" | "Working Knowledge" | "Familiar" | "";
  featured: boolean;
  published: boolean;
}

interface SkillCategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  published: boolean;
  skills: SkillItem[];
}

interface TechStackProps {
  categories: SkillCategoryItem[];
}

export default function TechStack({ categories }: TechStackProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);

  const publishedCategories = categories
    .filter((c) => c.published)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const filteredCategories =
    selectedCategory === "all"
      ? publishedCategories
      : publishedCategories.filter((c) => c._id === selectedCategory || c.slug === selectedCategory);

  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("cloud")) return Cloud;
    if (lower.includes("code") || lower.includes("iac")) return Code;
    if (lower.includes("container") || lower.includes("orchestration")) return Layers;
    if (lower.includes("ci/cd") || lower.includes("git")) return GitBranch;
    if (lower.includes("monitor") || lower.includes("logging") || lower.includes("observability")) return Activity;
    if (lower.includes("network")) return Network;
    if (lower.includes("security")) return Shield;
    if (lower.includes("database")) return Database;
    if (lower.includes("aws")) return Server;
    if (lower.includes("azure")) return Cpu;
    return Layers;
  };

  return (
    <section id="stack" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold font-nothing">09</span>
            <span className="text-zinc-600 font-mono">/</span>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
              TECHNOLOGY STACK
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500 font-nothing">
            VERIFIED TOOL MATRIX · ZERO FAKE METRICS
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded transition-colors uppercase font-nothing ${
              selectedCategory === "all"
                ? "bg-zinc-100 text-zinc-950 font-bold"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            ALL DOMAINS
          </button>
          {publishedCategories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-3 py-1.5 rounded transition-colors uppercase font-nothing ${
                selectedCategory === cat._id
                  ? "bg-zinc-100 text-zinc-950 font-bold"
                  : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Categorized Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.name);
            const publishedSkills = (cat.skills || []).filter((s) => s.published);

            return (
              <div
                key={cat._id}
                className="p-6 rounded-lg bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-all font-mono space-y-4"
              >
                {/* Category Title Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                      <Icon size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-nothing">
                        {publishedSkills.length} tools verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills Chips Matrix */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {publishedSkills.map((skill) => (
                    <div
                      key={skill._id}
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="group/skill relative flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/70 transition-all hover:bg-zinc-900 cursor-default"
                    >
                      <span className="text-xs text-zinc-300 group-hover/skill:text-emerald-400 transition-colors">
                        {skill.name}
                      </span>

                      {skill.level && (
                        <span className="text-[9px] text-zinc-500 bg-zinc-950 px-1 py-0.2 rounded border border-zinc-800 font-nothing">
                          {skill.level}
                        </span>
                      )}

                      {skill.featured && (
                        <Star size={10} className="text-amber-400 fill-amber-400/30" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Hover Telemetry Note */}
        {hoveredSkill && (
          <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 font-mono text-xs flex items-center justify-between gap-4 animate-in fade-in duration-100">
            <span className="text-zinc-400">
              ACTIVE SKILL INSPECTION:{" "}
              <span className="text-emerald-400 font-bold">{hoveredSkill.name}</span>
              {hoveredSkill.level && (
                <span className="text-zinc-500"> — {hoveredSkill.level} Level</span>
              )}
            </span>
            <span className="text-[10px] text-zinc-500 tracking-wider">VERIFIED IN PRODUCTION</span>
          </div>
        )}
      </div>
    </section>
  );
}
