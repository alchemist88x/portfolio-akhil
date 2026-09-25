"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "AUTHENTICATION FAILED");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("AUTHENTICATION FAILED");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0A] tech-grid text-zinc-100">
      <div className="w-full max-w-md border border-zinc-800 bg-[#0A0A0A]/95 p-8 rounded-lg shadow-2xl backdrop-blur-md">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 status-pulse" />
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-300 uppercase">
              AKHIL / ADMIN
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500 tracking-wider">
            SECURE TERMINAL
          </span>
        </div>

        {/* Section title */}
        <div className="mb-6">
          <h2 className="text-sm font-mono tracking-wider font-semibold text-zinc-200 uppercase flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            AUTHENTICATION REQUIRED
          </h2>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Access to infrastructure control plane requires verified administrative credentials.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-3 rounded bg-red-950/40 border border-red-900/60 text-red-400 text-xs font-mono flex items-center gap-2.5 animate-in fade-in duration-150">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="akhilkanil99@gmail.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-zinc-100 text-zinc-950 hover:bg-white text-xs font-mono font-semibold tracking-wider transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  AUTHENTICATE <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
          <p className="text-[10px] font-mono text-zinc-600">
            SYSTEM NODE: ONLINE · KOCHI / IN
          </p>
        </div>
      </div>
    </div>
  );
}
