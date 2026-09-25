"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import DynamicListEditor from "@/components/admin/DynamicListEditor";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import EmptyState from "@/components/admin/EmptyState";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Calendar, MapPin } from "lucide-react";

interface ExperienceItem {
  _id: string;
  company: string;
  role: string;
  website?: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  responsibilities: string[];
  technologies: string[];
  location?: string;
  sortOrder: number;
  published: boolean;
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [formData, setFormData] = useState({
    company: "",
    website: "",
    employmentType: "Full-time",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    responsibilities: [] as string[],
    technologies: [] as string[],
    location: "Kochi, Kerala, India",
    sortOrder: 0,
    published: true,
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load experiences");
      setExperiences(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openCreateModal = () => {
    setEditingExp(null);
    setFormData({
      company: "",
      website: "",
      employmentType: "Full-time",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      responsibilities: [],
      technologies: [],
      location: "Kochi, Kerala, India",
      sortOrder: experiences.length + 1,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      website: exp.website || "",
      employmentType: exp.employmentType || "Full-time",
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      current: exp.current,
      description: exp.description || "",
      responsibilities: exp.responsibilities || [],
      technologies: exp.technologies || [],
      location: exp.location || "Kochi, Kerala, India",
      sortOrder: exp.sortOrder,
      published: exp.published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExp) {
        const res = await fetch("/api/admin/experience", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingExp._id, ...formData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setModalOpen(false);
      fetchExperiences();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save experience record");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/experience?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchExperiences();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete experience");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const newExps = [...experiences];
    const temp = newExps[index];
    newExps[index] = newExps[targetIndex];
    newExps[targetIndex] = temp;

    const payload = newExps.map((item, idx) => ({ id: item._id, sortOrder: idx + 1 }));
    setExperiences(newExps.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));

    try {
      await fetch("/api/admin/experience", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
    } catch {
      fetchExperiences();
    }
  };

  if (loading) return <LoadingState message="FETCHING EXPERIENCE TIMELINE..." />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="EXPERIENCE TIMELINE"
        subtitle="Manage professional roles, enterprise responsibilities, and verified tool stacks"
        badge={`${experiences.length} ROLES`}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs font-mono tracking-wider transition-colors"
          >
            <Plus size={14} /> ADD EXPERIENCE
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchExperiences} />}

      {experiences.length === 0 ? (
        <EmptyState
          title="NO EXPERIENCE RECORDS"
          description="Add your professional roles and responsibilities to populate the timeline."
          actionText="Add Experience"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div
              key={exp._id}
              className="p-5 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-base font-bold text-zinc-100">{exp.role}</span>
                    <span className="text-zinc-600 font-mono">@</span>
                    <span className="font-mono text-base text-emerald-400 font-semibold">
                      {exp.company}
                    </span>
                    {exp.current && <StatusBadge status="current" />}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-zinc-500" />
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate || "N/A"}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-zinc-500" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={exp.published ? "published" : "draft"} />
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1 hover:text-zinc-100 disabled:opacity-20 text-zinc-500"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === experiences.length - 1}
                    className="p-1 hover:text-zinc-100 disabled:opacity-20 text-zinc-500"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    title="Edit Experience"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(exp._id);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-1.5 rounded hover:bg-red-950/30 text-zinc-500 hover:text-red-400"
                    title="Delete Experience"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {exp.description && (
                <p className="text-xs font-mono text-zinc-400 leading-relaxed">{exp.description}</p>
              )}

              {/* Responsibilities list */}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                    Responsibilities ({exp.responsibilities.length})
                  </span>
                  <ul className="space-y-1 text-xs font-mono text-zinc-300">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies chips */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                    Technologies ({exp.technologies.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExp ? "EDIT EXPERIENCE RECORD" : "ADD EXPERIENCE RECORD"}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Company</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Varvy Innovations Pvt. Ltd."
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Role / Job Title</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. System Engineer / DevOps Engineer"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Company Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://varvyinnovations.com/"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Employment Type</label>
              <input
                type="text"
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                placeholder="e.g. Full-time, Contract"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Start Date (e.g. 2026-08)</label>
              <input
                type="text"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="YYYY-MM or YYYY-MM-DD"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                End Date (Leave blank if current)
              </label>
              <input
                type="text"
                disabled={formData.current}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="YYYY-MM-DD or Present"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="expCurrent"
                checked={formData.current}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : formData.endDate,
                  })
                }
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
              />
              <label htmlFor="expCurrent" className="text-xs font-mono text-zinc-300">
                Mark as Current Position
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="expPublished"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
              />
              <label htmlFor="expPublished" className="text-xs font-mono text-zinc-300">
                Published on Timeline
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Summary Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Overview of the system administrator role..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Dynamic Responsibilities */}
          <DynamicListEditor
            label="Responsibilities"
            items={formData.responsibilities}
            onChange={(items) => setFormData({ ...formData, responsibilities: items })}
            placeholder="Add specific responsibility..."
          />

          {/* Dynamic Technologies */}
          <DynamicListEditor
            label="Technologies & Tools"
            items={formData.technologies}
            onChange={(items) => setFormData({ ...formData, technologies: items })}
            placeholder="e.g. AWS, Terraform, Docker..."
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono tracking-wider transition-colors"
            >
              {editingExp ? "Update Experience" : "Save Experience"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this career experience record? This will remove it from the timeline and database."
      />
    </div>
  );
}
