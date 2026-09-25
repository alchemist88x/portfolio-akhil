"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import EmptyState from "@/components/admin/EmptyState";
import { Plus, Edit2, Trash2, Star, Layers, Code2 } from "lucide-react";

interface SkillItem {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  level?: "Expert" | "Advanced" | "Working Knowledge" | "Familiar" | "";
  featured: boolean;
  sortOrder: number;
  published: boolean;
}

interface SkillCat {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  published: boolean;
  skills: SkillItem[];
}

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category Modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<SkillCat | null>(null);
  const [catFormData, setCatFormData] = useState({
    name: "",
    slug: "",
    description: "",
    sortOrder: 0,
    published: true,
  });

  // Skill Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [skillFormData, setSkillFormData] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    level: "" as "Expert" | "Advanced" | "Working Knowledge" | "Familiar" | "",
    featured: false,
    sortOrder: 0,
    published: true,
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "category" | "skill" } | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load skills");
      setCategories(data.data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Category Actions
  const openCreateCatModal = () => {
    setEditingCat(null);
    setCatFormData({
      name: "",
      slug: "",
      description: "",
      sortOrder: categories.length + 1,
      published: true,
    });
    setCatModalOpen(true);
  };

  const openEditCatModal = (cat: SkillCat) => {
    setEditingCat(cat);
    setCatFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      sortOrder: cat.sortOrder,
      published: cat.published,
    });
    setCatModalOpen(true);
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCat) {
        const res = await fetch("/api/admin/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType: "category", id: editingCat._id, ...catFormData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType: "category", ...catFormData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setCatModalOpen(false);
      fetchSkills();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save category");
    }
  };

  // Skill Actions
  const openCreateSkillModal = (catId?: string) => {
    setEditingSkill(null);
    setSkillFormData({
      categoryId: catId || (categories[0]?._id ?? ""),
      name: "",
      slug: "",
      description: "",
      level: "",
      featured: false,
      sortOrder: 0,
      published: true,
    });
    setSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: SkillItem) => {
    setEditingSkill(skill);
    setSkillFormData({
      categoryId: skill.categoryId,
      name: skill.name,
      slug: skill.slug,
      description: skill.description || "",
      level: skill.level || "",
      featured: skill.featured,
      sortOrder: skill.sortOrder,
      published: skill.published,
    });
    setSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        const res = await fetch("/api/admin/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType: "skill", id: editingSkill._id, ...skillFormData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType: "skill", ...skillFormData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setSkillModalOpen(false);
      fetchSkills();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save skill");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${deleteTarget.id}&type=${deleteTarget.type}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      fetchSkills();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  if (loading) return <LoadingState message="FETCHING SKILLS MATRIX..." />;

  const totalSkills = categories.reduce((sum, c) => sum + (c.skills?.length || 0), 0);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="SKILLS MATRIX"
        subtitle="Manage technical categories, tool proficiencies, and featured flags"
        badge={`${categories.length} CATS · ${totalSkills} SKILLS`}
        actions={
          <div className="flex gap-2">
            <button
              onClick={openCreateCatModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono transition-colors"
            >
              <Layers size={14} /> NEW CATEGORY
            </button>
            <button
              onClick={() => openCreateSkillModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs font-mono tracking-wider transition-colors"
            >
              <Plus size={14} /> ADD SKILL
            </button>
          </div>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchSkills} />}

      {categories.length === 0 ? (
        <EmptyState
          title="NO SKILLS CONFIGURED"
          description="Create your first skill category such as 'Cloud Platforms' or 'Infrastructure as Code'."
          actionText="Create Category"
          onAction={openCreateCatModal}
        />
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="p-5 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <div>
                    <h3 className="text-sm font-mono font-bold tracking-wider text-zinc-100 uppercase">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-[11px] font-mono text-zinc-500 mt-0.5">{cat.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={cat.published ? "published" : "draft"} />
                  <button
                    onClick={() => openCreateSkillModal(cat._id)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-1 border border-zinc-800"
                    title="Add skill to this category"
                  >
                    <Plus size={12} /> Add
                  </button>
                  <button
                    onClick={() => openEditCatModal(cat)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    title="Edit Category"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteTarget({ id: cat._id, type: "category" });
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-1.5 rounded hover:bg-red-950/30 text-zinc-500 hover:text-red-400"
                    title="Delete Category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Skills Chips / Grid */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {cat.skills && cat.skills.length > 0 ? (
                  cat.skills.map((skill) => (
                    <div
                      key={skill._id}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <span className="text-xs font-mono text-zinc-200">{skill.name}</span>

                      {skill.level && (
                        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                          {skill.level}
                        </span>
                      )}

                      {skill.featured && (
                        <Star size={11} className="text-amber-400 fill-amber-400/30" />
                      )}

                      {!skill.published && (
                        <span className="text-[9px] font-mono text-zinc-500">[DRAFT]</span>
                      )}

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1 pl-1 border-l border-zinc-700">
                        <button
                          onClick={() => openEditSkillModal(skill)}
                          className="text-zinc-400 hover:text-zinc-100"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget({ id: skill._id, type: "skill" });
                            setDeleteConfirmOpen(true);
                          }}
                          className="text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-mono text-zinc-600 italic">No skills in this category yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <AdminModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title={editingCat ? "EDIT SKILL CATEGORY" : "CREATE SKILL CATEGORY"}
      >
        <form onSubmit={handleSaveCat} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Category Name</label>
            <input
              type="text"
              required
              value={catFormData.name}
              onChange={(e) => {
                const name = e.target.value;
                setCatFormData({
                  ...catFormData,
                  name,
                  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                });
              }}
              placeholder="e.g. CLOUD PLATFORMS"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 uppercase focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Slug</label>
            <input
              type="text"
              required
              value={catFormData.slug}
              onChange={(e) => setCatFormData({ ...catFormData, slug: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 lowercase focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Description (Optional)</label>
            <input
              type="text"
              value={catFormData.description}
              onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
              placeholder="Brief description of the domain..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="catPublished"
              checked={catFormData.published}
              onChange={(e) => setCatFormData({ ...catFormData, published: e.target.checked })}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
            />
            <label htmlFor="catPublished" className="text-xs font-mono text-zinc-300">
              Published on Public Matrix
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setCatModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono tracking-wider transition-colors"
            >
              {editingCat ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Skill Modal */}
      <AdminModal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        title={editingSkill ? "EDIT SKILL" : "ADD SKILL"}
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Category</label>
            <select
              value={skillFormData.categoryId}
              onChange={(e) => setSkillFormData({ ...skillFormData, categoryId: e.target.value })}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Skill Name</label>
            <input
              type="text"
              required
              value={skillFormData.name}
              onChange={(e) => {
                const name = e.target.value;
                setSkillFormData({
                  ...skillFormData,
                  name,
                  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                });
              }}
              placeholder="e.g. Terraform"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Optional Level (No progress bars)</label>
            <select
              value={skillFormData.level}
              onChange={(e) =>
                setSkillFormData({
                  ...skillFormData,
                  level: e.target.value as "Expert" | "Advanced" | "Working Knowledge" | "Familiar" | "",
                })
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="">No level (Default)</option>
              <option value="Expert">Expert</option>
              <option value="Advanced">Advanced</option>
              <option value="Working Knowledge">Working Knowledge</option>
              <option value="Familiar">Familiar</option>
            </select>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="skillFeatured"
                checked={skillFormData.featured}
                onChange={(e) => setSkillFormData({ ...skillFormData, featured: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500"
              />
              <label htmlFor="skillFeatured" className="text-xs font-mono text-zinc-300">
                Mark Featured
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="skillPublished"
                checked={skillFormData.published}
                onChange={(e) => setSkillFormData({ ...skillFormData, published: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
              />
              <label htmlFor="skillPublished" className="text-xs font-mono text-zinc-300">
                Published
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setSkillModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono tracking-wider transition-colors"
            >
              {editingSkill ? "Update Skill" : "Add Skill"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        message={
          deleteTarget?.type === "category"
            ? "Are you sure you want to delete this category? All skills inside will also be removed."
            : "Are you sure you want to delete this skill proficiency?"
        }
      />
    </div>
  );
}
