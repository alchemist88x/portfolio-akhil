"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import EmptyState from "@/components/admin/EmptyState";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface PrincipleItem {
  _id: string;
  number: string;
  title: string;
  description: string;
  sortOrder: number;
  published: boolean;
}

export default function AdminPrinciplesPage() {
  const [principles, setPrinciples] = useState<PrincipleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrinciple, setEditingPrinciple] = useState<PrincipleItem | null>(null);
  const [formData, setFormData] = useState({
    number: "",
    title: "",
    description: "",
    sortOrder: 0,
    published: true,
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchPrinciples = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/principles");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load principles");
      setPrinciples(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrinciples();
  }, []);

  const openCreateModal = () => {
    setEditingPrinciple(null);
    const nextNum = String(principles.length + 1).padStart(2, "0");
    setFormData({
      number: nextNum,
      title: "",
      description: "",
      sortOrder: principles.length + 1,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: PrincipleItem) => {
    setEditingPrinciple(p);
    setFormData({
      number: p.number,
      title: p.title,
      description: p.description,
      sortOrder: p.sortOrder,
      published: p.published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPrinciple) {
        const res = await fetch("/api/admin/principles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPrinciple._id, ...formData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/principles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setModalOpen(false);
      fetchPrinciples();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save principle");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/principles?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchPrinciples();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete principle");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= principles.length) return;

    const newPrinciples = [...principles];
    const temp = newPrinciples[index];
    newPrinciples[index] = newPrinciples[targetIndex];
    newPrinciples[targetIndex] = temp;

    const payload = newPrinciples.map((item, idx) => ({ id: item._id, sortOrder: idx + 1 }));
    setPrinciples(newPrinciples.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));

    try {
      await fetch("/api/admin/principles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
    } catch {
      fetchPrinciples();
    }
  };

  if (loading) return <LoadingState message="FETCHING ENGINEERING PRINCIPLES..." />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="ENGINEERING PRINCIPLES"
        subtitle="Core tenets governing infrastructure reliability, security, and automation"
        badge={`${principles.length} PRINCIPLES`}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs font-mono tracking-wider transition-colors"
          >
            <Plus size={14} /> ADD PRINCIPLE
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchPrinciples} />}

      {principles.length === 0 ? (
        <EmptyState
          title="NO PRINCIPLES CONFIGURED"
          description="Add foundational engineering principles (e.g., '01 Automate the repeatable')."
          actionText="Add Principle"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-3">
          {principles.map((p, index) => (
            <div
              key={p._id}
              className="p-5 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-2 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    {p.number}
                  </span>
                  <h4 className="text-sm font-mono font-bold text-zinc-100 uppercase tracking-wide">
                    {p.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={p.published ? "published" : "draft"} />
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
                    disabled={index === principles.length - 1}
                    className="p-1 hover:text-zinc-100 disabled:opacity-20 text-zinc-500"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    title="Edit Principle"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(p._id);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-1.5 rounded hover:bg-red-950/30 text-zinc-500 hover:text-red-400"
                    title="Delete Principle"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p className="text-xs font-mono text-zinc-400 leading-relaxed pt-1">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPrinciple ? "EDIT PRINCIPLE" : "ADD PRINCIPLE"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Number</label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="01"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-mono text-zinc-400 mb-1">Principle Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
                placeholder="e.g. AUTOMATE THE REPEATABLE"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Description / Core Tenet</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Why this rule is essential to maintaining production stability..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="princPublished"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
            />
            <label htmlFor="princPublished" className="text-xs font-mono text-zinc-300">
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
              {editingPrinciple ? "Update Principle" : "Save Principle"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this engineering principle?"
      />
    </div>
  );
}
