"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import EmptyState from "@/components/admin/EmptyState";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, ExternalLink, Share2 } from "lucide-react";

interface SocialItem {
  _id: string;
  platform: string;
  label: string;
  url: string;
  icon?: string;
  sortOrder: number;
  published: boolean;
}

export default function AdminSocialPage() {
  const [links, setLinks] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialItem | null>(null);
  const [formData, setFormData] = useState({
    platform: "",
    label: "",
    url: "",
    icon: "Share2",
    sortOrder: 0,
    published: true,
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/social");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load social links");
      setLinks(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const openCreateModal = () => {
    setEditingLink(null);
    setFormData({
      platform: "",
      label: "",
      url: "",
      icon: "Share2",
      sortOrder: links.length + 1,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (link: SocialItem) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      label: link.label,
      url: link.url,
      icon: link.icon || "Share2",
      sortOrder: link.sortOrder,
      published: link.published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLink) {
        const res = await fetch("/api/admin/social", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingLink._id, ...formData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setModalOpen(false);
      fetchLinks();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save link");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/social?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchLinks();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete link");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    const payload = newLinks.map((item, idx) => ({ id: item._id, sortOrder: idx + 1 }));
    setLinks(newLinks.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));

    try {
      await fetch("/api/admin/social", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
    } catch {
      fetchLinks();
    }
  };

  if (loading) return <LoadingState message="FETCHING SOCIAL LINKS..." />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="SOCIAL LINKS & PROFILES"
        subtitle="Manage GitHub, LinkedIn, email reachability, and footer profiles"
        badge={`${links.length} LINKS`}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs font-mono tracking-wider transition-colors"
          >
            <Plus size={14} /> ADD LINK
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchLinks} />}

      {links.length === 0 ? (
        <EmptyState
          title="NO SOCIAL LINKS CONFIGURED"
          description="Add your professional profiles (GitHub, LinkedIn, Email)."
          actionText="Add Social Link"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-3">
          {links.map((link, index) => (
            <div
              key={link._id}
              className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-zinc-500 font-bold text-xs">{index + 1}</span>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  <Share2 size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-mono font-bold text-zinc-100 uppercase">
                      {link.platform}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-500">• {link.label}</span>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{link.url}</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={link.published ? "published" : "draft"} />
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
                  disabled={index === links.length - 1}
                  className="p-1 hover:text-zinc-100 disabled:opacity-20 text-zinc-500"
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => openEditModal(link)}
                  className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  title="Edit Link"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(link._id);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-1.5 rounded hover:bg-red-950/30 text-zinc-500 hover:text-red-400"
                  title="Delete Link"
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
        title={editingLink ? "EDIT SOCIAL LINK" : "ADD SOCIAL LINK"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Platform Name</label>
            <input
              type="text"
              required
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              placeholder="e.g. GitHub, LinkedIn, Email"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Display Label</label>
            <input
              type="text"
              required
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g. github.com/akhil"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Destination URL (Only HTTPS, HTTP, or Mailto)
            </label>
            <input
              type="text"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://github.com/... or mailto:..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="linkPublished"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
            />
            <label htmlFor="linkPublished" className="text-xs font-mono text-zinc-300">
              Published on Public Site &amp; Footer
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
              {editingLink ? "Update Link" : "Save Link"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this social profile link?"
      />
    </div>
  );
}
