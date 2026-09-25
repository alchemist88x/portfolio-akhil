import React from "react";
import Link from "next/link";
import { Terminal, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-mono flex items-center justify-center p-6 selection:bg-emerald-500/20 selection:text-emerald-400">
      <div className="w-full max-w-lg border border-zinc-800 bg-zinc-950/90 rounded-lg shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] text-zinc-500">HTTP_STATUS // 404</span>
        </div>

        {/* Terminal Body */}
        <div className="p-8 sm:p-10 space-y-6">
          <div className="space-y-1">
            <span className="text-4xl font-extrabold text-red-400 tracking-tight block">
              404
            </span>
            <h1 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">
              ROUTE NOT FOUND
            </h1>
          </div>

          <div className="p-4 rounded bg-zinc-900/60 border border-zinc-800/80 space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p className="text-zinc-300">
              The requested resource or endpoint does not exist on this cluster.
            </p>
            <p className="text-zinc-500">
              Error code: ENOENT (No such file or directory)
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span>akhil@portfolio:~$</span>
              <span className="text-zinc-200">cd /home</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs tracking-wider transition-colors"
            >
              <span>RETURN HOME →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
