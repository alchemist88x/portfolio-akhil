"use client";

import React from "react";
import { Cpu, Radio, Wrench, Heart } from "lucide-react";

interface HobbyItem {
  _id?: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  published: boolean;
}

interface HobbiesProps {
  hobbies: HobbyItem[];
}

export default function HobbiesSection({ hobbies }: HobbiesProps) {
  const publishedHobbies = hobbies
    .filter((h) => h.published)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (publishedHobbies.length === 0) return null;

  const getHobbyIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("hackintosh") || lower.includes("cpu") || lower.includes("pc")) return Cpu;
    if (lower.includes("arduino") || lower.includes("radio") || lower.includes("iot")) return Radio;
    return Wrench;
  };

  return (
    <section id="hobbies" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/20">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold">14</span>
            <span className="text-zinc-600 font-mono">/</span>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
              HARDWARE &amp; PURSUITS
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            EMBEDDED ELECTRONICS &amp; LOW-LEVEL PASSIONS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {publishedHobbies.map((hobby) => {
            const Icon = getHobbyIcon(hobby.name);
            return (
              <div
                key={hobby._id || hobby.name}
                className="p-6 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors font-mono space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                      {hobby.name}
                    </h3>
                    <span className="text-[10px] text-zinc-500">HARDWARE HOBBY</span>
                  </div>
                </div>

                {hobby.description && (
                  <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                    {hobby.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
