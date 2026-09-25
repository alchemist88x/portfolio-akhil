"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import { Save, Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2 } from "lucide-react";

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    statementHeadline: "",
    statementSubheadline: "",
    paragraphs: [] as string[],
  });

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/about");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load about data");
      setFormData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...formData.paragraphs];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, paragraphs: updated }));
  };

  const addParagraph = () => {
    setFormData((prev) => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }));
  };

  const removeParagraph = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, idx) => idx !== index),
    }));
  };

  const moveParagraph = (index: number, direction: "up" | "down") => {
    const updated = [...formData.paragraphs];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFormData((prev) => ({ ...prev, paragraphs: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save about content");

      setFormData(data.data);
      setSuccessMsg("About editorial content saved successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="FETCHING ABOUT DATA..." />;

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminHeader
        title="ABOUT & EDITORIAL"
        subtitle="Manage the philosophy statement quote and technical background narrative"
        badge="SYS / 012"
      />

      {error && <ErrorState message={error} onRetry={fetchAbout} />}

      {successMsg && (
        <div className="p-3.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Editorial Introduction Statement */}
        <div className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4">
          <h2 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase border-b border-zinc-800 pb-2">
            01 — INTRODUCTION STATEMENT QUOTE
          </h2>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Statement Lead</label>
            <input
              type="text"
              value={formData.statementHeadline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, statementHeadline: e.target.value }))
              }
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Statement Punchline (Secondary Line)
            </label>
            <input
              type="text"
              value={formData.statementSubheadline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, statementSubheadline: e.target.value }))
              }
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Narrative & Paragraphs */}
        <div className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase">
              02 — BEHIND THE INFRASTRUCTURE PARAGRAPHS
            </h2>
            <button
              type="button"
              onClick={addParagraph}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200"
            >
              <Plus size={13} /> Add Paragraph
            </button>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Section Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-4 pt-2">
            {formData.paragraphs.map((pText, index) => (
              <div
                key={index}
                className="p-4 bg-zinc-900/50 border border-zinc-800/80 rounded space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>Paragraph #{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveParagraph(index, "up")}
                      disabled={index === 0}
                      className="p-1 hover:text-zinc-100 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveParagraph(index, "down")}
                      disabled={index === formData.paragraphs.length - 1}
                      className="p-1 hover:text-zinc-100 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="p-1 hover:text-red-400 text-zinc-500"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <textarea
                  value={pText}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  rows={3}
                  required
                  placeholder="Enter paragraph narrative..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono tracking-wider transition-all disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "SAVING ABOUT DATA..." : "SAVE & SYNC ABOUT"}
          </button>
        </div>
      </form>
    </div>
  );
}
