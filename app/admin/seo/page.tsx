"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DynamicListEditor from "@/components/admin/DynamicListEditor";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import { Save, CheckCircle2 } from "lucide-react";

export default function AdminSEOPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: [] as string[],
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
  });

  const fetchSEO = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/seo");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load SEO settings");
      setFormData({
        ...data.data,
        keywords: data.data.keywords || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEO();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save SEO settings");

      setFormData(data.data);
      setSuccessMsg("SEO and OpenGraph configuration saved successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving SEO settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="FETCHING SEO TELEMETRY..." />;

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminHeader
        title="SEO & METADATA"
        subtitle="Manage meta tags, OpenGraph previews, crawler directives, and keywords"
        badge="SYS / 020"
      />

      {error && <ErrorState message={error} onRetry={fetchSEO} />}

      {successMsg && (
        <div className="p-3.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Search Engine Metadata */}
        <div className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4">
          <h2 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase border-b border-zinc-800 pb-2">
            01 — PRIMARY SEARCH ENGINE TAGS
          </h2>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Page Title (&lt;title&gt;)</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Meta Description (Search Snippet)
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <DynamicListEditor
            label="Target Keywords"
            items={formData.keywords}
            onChange={(items) => setFormData((prev) => ({ ...prev, keywords: items }))}
            placeholder="e.g. DevOps, Cloud Infrastructure, AWS, Kubernetes..."
          />

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Canonical URL (Optional)
            </label>
            <input
              type="text"
              name="canonicalUrl"
              value={formData.canonicalUrl || ""}
              onChange={handleChange}
              placeholder="https://akhil.dev"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Social / OpenGraph Card */}
        <div className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4">
          <h2 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase border-b border-zinc-800 pb-2">
            02 — OPENGRAPH SOCIAL PREVIEWS (LINKEDIN, TWITTER, SLACK)
          </h2>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">OG Title</label>
            <input
              type="text"
              name="ogTitle"
              value={formData.ogTitle || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">OG Description</label>
            <textarea
              name="ogDescription"
              rows={2}
              value={formData.ogDescription || ""}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              OG Image URL (Optional Preview Graphic)
            </label>
            <input
              type="text"
              name="ogImage"
              value={formData.ogImage || ""}
              onChange={handleChange}
              placeholder="https://akhil.dev/og-preview.png"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono tracking-wider transition-all disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "SAVING SEO CONFIG..." : "SAVE & SYNC SEO"}
          </button>
        </div>
      </form>
    </div>
  );
}
