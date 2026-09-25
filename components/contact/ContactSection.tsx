"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Loader2, ArrowRight } from "lucide-react";

interface SocialItem {
  platform: string;
  label: string;
  url: string;
  icon?: string;
  published: boolean;
}

interface ContactSectionProps {
  contactEmail: string;
  location: string;
  socialLinks?: SocialItem[];
}

export default function ContactSection({
  contactEmail,
  location,
  socialLinks = [],
}: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed. Please check inputs.");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deliver message");
    } finally {
      setLoading(false);
    }
  };

  const publishedSocials = socialLinks.filter((s) => s.published);

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold">15</span>
            <span className="text-zinc-600 font-mono">/</span>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
              CONTACT &amp; REACHABILITY
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            ENCRYPTED DISPATCH · RATE-LIMITED ENDPOINT
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Reachability Info */}
          <div className="lg:col-span-5 font-mono space-y-8">
            <div className="space-y-3">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                DIRECT CHANNELS
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Available for enterprise DevOps engineering, cloud infrastructure architecture, AWS migrations, and platform reliability consulting.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-zinc-950/70 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block flex items-center gap-1.5">
                  <Mail size={12} /> Direct Contact Email
                </span>
                <a
                  href={`mailto:${contactEmail || "akhilkanil99@gmail.com"}`}
                  className="font-bold text-zinc-100 hover:text-emerald-400 transition-colors text-sm"
                >
                  {contactEmail || "akhilkanil99@gmail.com"}
                </a>
              </div>

              <div className="p-4 rounded-lg bg-zinc-950/70 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block flex items-center gap-1.5">
                  <MapPin size={12} /> Geographic Base
                </span>
                <p className="font-bold text-zinc-200">
                  {location || "Kochi, Kerala, India"}
                </p>
              </div>
            </div>

            {/* Social Links */}
            {publishedSocials.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                  PROFILES &amp; REPOSITORIES:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {publishedSocials.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1.5"
                    >
                      <span>{link.platform}</span>
                      <ArrowRight size={11} className="text-zinc-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-lg bg-zinc-950/80 border border-zinc-800/80 font-mono space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  SEND SECURE DISPATCH
                </span>
                <span className="text-[10px] text-zinc-500">POST /api/contact</span>
              </div>

              {success && (
                <div className="p-4 rounded bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-bold uppercase tracking-wider">DISPATCH TRANSMITTED</p>
                    <p className="text-emerald-300">
                      Thank you for reaching out. Akhil will review your inquiry and respond directly.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 rounded bg-red-950/40 border border-red-800/80 text-red-400 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 uppercase">
                    Your Name / Organization
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Linus Torvalds"
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 uppercase">
                    Inquiry Message / Infrastructure Scope
                  </label>
                  <textarea
                    required
                    rows={5}
                    maxLength={5000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your architecture requirements, infrastructure bottlenecks, or timeline..."
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded p-3 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs tracking-wider transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      TRANSMITTING DISPATCH...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      TRANSMIT DISPATCH →
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
