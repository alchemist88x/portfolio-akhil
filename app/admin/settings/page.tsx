"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import { Save, CheckCircle2, Sliders, Cpu } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    title: "",
    altTitle: "",
    experienceYears: "",
    location: "",
    contactEmail: "",
    heroLabel: "",
    heroHeadline: "",
    heroDescription: "",
    primaryCtaText: "",
    primaryCtaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    systemStatusLabel: "ONLINE",
    statusInfrastructure: "Operational",
    statusAutomation: "Active",
    statusMonitoring: "Active",
    statusDeployment: "Ready",
    technicalTypographyEnabled: true,
    technicalDotPatternEnabled: true,
    technicalMetadataEnabled: true,
    technicalDecorationsEnabled: true,
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load settings");
      setFormData({
        ...data.data,
        technicalTypographyEnabled: data.data.technicalTypographyEnabled ?? true,
        technicalDotPatternEnabled: data.data.technicalDotPatternEnabled ?? true,
        technicalMetadataEnabled: data.data.technicalMetadataEnabled ?? true,
        technicalDecorationsEnabled: data.data.technicalDecorationsEnabled ?? true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save settings");

      setFormData({
        ...data.data,
        technicalTypographyEnabled: data.data.technicalTypographyEnabled ?? true,
        technicalDotPatternEnabled: data.data.technicalDotPatternEnabled ?? true,
        technicalMetadataEnabled: data.data.technicalMetadataEnabled ?? true,
        technicalDecorationsEnabled: data.data.technicalDecorationsEnabled ?? true,
      });
      setSuccessMsg("Settings updated and synchronized across all portfolio components.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="FETCHING SITE CONFIGURATION..." />;

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminHeader
        title="SITE SETTINGS"
        subtitle="Manage hero content, technical metadata, email destination, status displays, and Nothing-inspired visual language"
        badge="SYS / 001"
      />

      {error && <ErrorState message={error} onRetry={fetchSettings} />}

      {successMsg && (
        <div className="p-3.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Engineer Identity */}
        <div className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4">
          <h2 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase border-b border-zinc-800 pb-2">
            01 — TECHNICAL PROFILE IDENTITY
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Display Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Full Legal / Professional Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Primary Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Alternative Title</label>
              <input
                type="text"
                name="altTitle"
                value={formData.altTitle}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Experience Years</label>
              <input
                type="text"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Contact Email (Updates mailto, footer, contact section, terminal contact)
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Configuration */}
        <div className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4">
          <h2 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase border-b border-zinc-800 pb-2">
            02 — HERO SECTION CONTENT & CTAS
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Hero Small Label</label>
              <input
                type="text"
                name="heroLabel"
                value={formData.heroLabel}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Hero Main Headline</label>
              <textarea
                name="heroHeadline"
                value={formData.heroHeadline}
                onChange={handleChange}
                rows={2}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Hero Supporting Text</label>
              <textarea
                name="heroDescription"
                value={formData.heroDescription}
                onChange={handleChange}
                rows={3}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Primary CTA Text</label>
                <input
                  type="text"
                  name="primaryCtaText"
                  value={formData.primaryCtaText}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Primary CTA Destination</label>
                <input
                  type="text"
                  name="primaryCtaLink"
                  value={formData.primaryCtaLink}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Secondary CTA Text</label>
                <input
                  type="text"
                  name="secondaryCtaText"
                  value={formData.secondaryCtaText}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Secondary CTA Destination</label>
                <input
                  type="text"
                  name="secondaryCtaLink"
                  value={formData.secondaryCtaLink}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Status Configuration */}
        <div className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4">
          <h2 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase border-b border-zinc-800 pb-2">
            03 — SYSTEM STATUS VISUALIZATION
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Overall Status Label</label>
              <input
                type="text"
                name="systemStatusLabel"
                value={formData.systemStatusLabel}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Infrastructure Status</label>
              <input
                type="text"
                name="statusInfrastructure"
                value={formData.statusInfrastructure}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Automation Status</label>
              <input
                type="text"
                name="statusAutomation"
                value={formData.statusAutomation}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Monitoring Status</label>
              <input
                type="text"
                name="statusMonitoring"
                value={formData.statusMonitoring}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Deployment Status</label>
              <input
                type="text"
                name="statusDeployment"
                value={formData.statusDeployment}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 04 — Nothing-Inspired Visual Language Controls */}
        <div className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase">
              04 — NOTHING-INSPIRED VISUAL LANGUAGE CONTROLS
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              SYS-AESTHETICS
            </span>
          </div>

          <p className="text-xs text-zinc-400 font-mono">
            Enable or disable selective Nothing-inspired industrial/system visual treatments across terminal, system status, project cards, and engineering timeline.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* 1. technicalTypographyEnabled */}
            <div
              onClick={() => handleToggle("technicalTypographyEnabled")}
              className={`p-4 rounded border transition-all cursor-pointer select-none space-y-2 ${
                formData.technicalTypographyEnabled
                  ? "bg-zinc-900/80 border-emerald-500/70"
                  : "bg-zinc-950/50 border-zinc-800 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-200 uppercase">
                  Technical Typography
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    formData.technicalTypographyEnabled
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                  }`}
                >
                  {formData.technicalTypographyEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                Applies monospaced/technical typography to status labels, terminal, project metadata, timeline dates, and small identifiers.
              </p>
              <span className="text-[10px] text-zinc-500 font-mono block">
                Field: technicalTypographyEnabled
              </span>
            </div>

            {/* 2. technicalDotPatternEnabled */}
            <div
              onClick={() => handleToggle("technicalDotPatternEnabled")}
              className={`p-4 rounded border transition-all cursor-pointer select-none space-y-2 ${
                formData.technicalDotPatternEnabled
                  ? "bg-zinc-900/80 border-emerald-500/70"
                  : "bg-zinc-950/50 border-zinc-800 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-200 uppercase">
                  Dot Matrix &amp; Grid
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    formData.technicalDotPatternEnabled
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                  }`}
                >
                  {formData.technicalDotPatternEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                Renders subtle dot matrix grid backgrounds, status dot groupings [ ● ● ● ● ● ], and circular pulse indicators.
              </p>
              <span className="text-[10px] text-zinc-500 font-mono block">
                Field: technicalDotPatternEnabled
              </span>
            </div>

            {/* 3. technicalMetadataEnabled */}
            <div
              onClick={() => handleToggle("technicalMetadataEnabled")}
              className={`p-4 rounded border transition-all cursor-pointer select-none space-y-2 ${
                formData.technicalMetadataEnabled
                  ? "bg-zinc-900/80 border-emerald-500/70"
                  : "bg-zinc-950/50 border-zinc-800 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-200 uppercase">
                  Technical Metadata Blocks
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    formData.technicalMetadataEnabled
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                  }`}
                >
                  {formData.technicalMetadataEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                Displays structured industrial metadata chips (PROJECT / 01, STATUS / PRODUCTION, STACK / AWS · LINUX, ENV / CLOUD).
              </p>
              <span className="text-[10px] text-zinc-500 font-mono block">
                Field: technicalMetadataEnabled
              </span>
            </div>

            {/* 4. technicalDecorationsEnabled */}
            <div
              onClick={() => handleToggle("technicalDecorationsEnabled")}
              className={`p-4 rounded border transition-all cursor-pointer select-none space-y-2 ${
                formData.technicalDecorationsEnabled
                  ? "bg-zinc-900/80 border-emerald-500/70"
                  : "bg-zinc-950/50 border-zinc-800 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-200 uppercase">
                  Industrial Decorations
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    formData.technicalDecorationsEnabled
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                  }`}
                >
                  {formData.technicalDecorationsEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                Renders subtle dotted separators (· · · · · ·) and minimal corner geometric accents (+) without cyberpunk clutter.
              </p>
              <span className="text-[10px] text-zinc-500 font-mono block">
                Field: technicalDecorationsEnabled
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono tracking-wider transition-all disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "SAVING CONFIGURATION..." : "SAVE & SYNC SETTINGS"}
          </button>
        </div>
      </form>
    </div>
  );
}
