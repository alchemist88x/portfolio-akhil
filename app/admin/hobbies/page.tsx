"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import EmptyState from "@/components/admin/EmptyState";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Heart } from "lucide-react";

interface HobbyItem {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  published: boolean;
}

export default function AdminHobbiesPage() {
  const [hobbies, setHobbies] = useState<HobbyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHobby, setEditingHobby] = useState<HobbyItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Heart",
    sortOrder: 0,
    published: true,
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchHobbies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/hobbies");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load hobbies");
      setHobbies(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHobbies();
  }, []);

  const openCreateModal = () => {
    setEditingHobby(null);
    setFormData({
      name: "",
      description: "",
      icon: "Cpu",
      sortOrder: hobbies.length + 1,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (h: HobbyItem) => {
    setEditingHobby(h);
    setFormData({
      name: h.name,
      description: h.description || "",
      icon: h.icon || "Cpu",
      sortOrder: h.sortOrder,
      published: h.published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHobby) {
        const res = await fetch("/api/admin/hobbies", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingHobby._id, ...formData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/hobbies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setModalOpen(false);
      fetchHobbies();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save hobby");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/hobbies?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchHobbies();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete hobby");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= hobbies.length) return;

    const newHobbies = [...hobbies];
    const temp = newHobbies[index];
    newHobbies[index] = newHobbies[targetIndex];
    newHobbies[targetIndex] = temp;

    const payload = newHobbies.map((item, idx) => ({ id: item._id, sortOrder: idx + 1 }));
    setHobbies(newHobbies.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));

    try {
      await fetch("/api/admin/hobbies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
    } catch {
      fetchHobbies();
    }
  };

  if (loading) return <LoadingState message="FETCHING HOBBIES..." />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="HOBBIES & INTERESTS"
        subtitle="Manage hardware, embedded systems, and maker pursuits"
        badge={`${hobbies.length} ITEMS`}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs font-mono tracking-wider transition-colors"
          >
            <Plus size={14} /> ADD HOBBY
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchHobbies} />}

      {hobbies.length === 0 ? (
        <EmptyState
          title="NO HOBBIES CONFIGURED"
          description="Add personal technical interests such as Building Hackintosh Machines or Working with Arduino."
          actionText="Add Hobby"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-3">
          {hobbies.map((h, index) => (
            <div
              key={h._id}
              className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-zinc-500 font-bold text-xs">{index + 1}</span>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  <Heart size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-zinc-100 uppercase">{h.name}</h4>
                  {h.description && (
                    <p className="text-[11px] font-mono text-zinc-400 mt-0.5 line-clamp-1">
                      {h.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={h.published ? "published" : "draft"} />
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
                  disabled={index === hobbies.length - 1}
                  className="p-1 hover:text-zinc-100 disabled:opacity-20 text-zinc-500"
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => openEditModal(h)}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  title="Edit Hobby"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(h._id);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-1.5 rounded hover:bg-red-950/30 text-zinc-500 hover:text-red-400"
                  title="Delete Hobby"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingHobby ? "EDIT HOBBY" : "ADD HOBBY"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Hobby Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Building Hackintosh Machines"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the interest or hardware project..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="hobbyPublished"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
            />
            <label htmlFor="hobbyPublished" className="text-xs font-mono text-zinc-300">
              Published on Public Site
            </label>
          </div>
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
              {editingHobby ? "Update Hobby" : "Save Hobby"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this hobby entry?"
      />
    </div>
  );
}
