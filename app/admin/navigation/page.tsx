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

interface NavItem {
  _id: string;
  label: string;
  sectionId: string;
  sortOrder: number;
  published: boolean;
}

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    sectionId: "",
    sortOrder: 0,
    published: true,
  });

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/navigation");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load navigation");
      setItems(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      label: "",
      sectionId: "",
      sortOrder: items.length + 1,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: NavItem) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      sectionId: item.sectionId,
      sortOrder: item.sortOrder,
      published: item.published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // PUT
        const res = await fetch("/api/admin/navigation", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem._id, ...formData }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error);
      } else {
        // POST
        const res = await fetch("/api/admin/navigation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error);
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save item");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/navigation?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchItems();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const payload = newItems.map((item, idx) => ({ id: item._id, sortOrder: idx + 1 }));
    setItems(newItems.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));

    try {
      await fetch("/api/admin/navigation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
    } catch {
      fetchItems();
    }
  };

  if (loading) return <LoadingState message="FETCHING NAVIGATION ROUTES..." />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="NAVIGATION"
        subtitle="Manage desktop topbar menu and mobile drawer routes"
        badge={`${items.length} ITEMS`}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs font-mono tracking-wider transition-colors"
          >
            <Plus size={14} /> ADD NAV ITEM
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchItems} />}

      {items.length === 0 ? (
        <EmptyState
          title="NO NAVIGATION ITEMS"
          description="Create your first navigation route linking to a page section."
          actionText="Create Navigation Item"
          onAction={openCreateModal}
        />
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/60 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">ORDER</th>
                  <th className="py-3 px-4">LABEL</th>
                  <th className="py-3 px-4">SECTION TARGET</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {items.map((item, index) => (
                  <tr key={item._id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3 px-4 text-zinc-500 font-bold">{index + 1}</td>
                    <td className="py-3 px-4 font-semibold text-zinc-200 uppercase">{item.label}</td>
                    <td className="py-3 px-4 text-emerald-400">#{item.sectionId}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.published ? "published" : "draft"} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-zinc-400">
                        <button
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0}
                          className="p-1 hover:text-zinc-100 disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMove(index, "down")}
                          disabled={index === items.length - 1}
                          className="p-1 hover:text-zinc-100 disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 hover:text-zinc-100"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item._id);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1 hover:text-red-400 text-zinc-500"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Item Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "EDIT NAVIGATION ITEM" : "ADD NAVIGATION ITEM"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Menu Label</label>
            <input
              type="text"
              required
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value.toUpperCase() })}
              placeholder="e.g. WORK"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Section Target ID (without hash)
            </label>
            <input
              type="text"
              required
              value={formData.sectionId}
              onChange={(e) => setFormData({ ...formData, sectionId: e.target.value.toLowerCase() })}
              placeholder="e.g. work"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 lowercase"
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0"
            />
            <label htmlFor="published" className="text-xs font-mono text-zinc-300">
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
              {editingItem ? "Update Route" : "Create Route"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this navigation route? It will be immediately removed from the topbar."
      />
    </div>
  );
}
