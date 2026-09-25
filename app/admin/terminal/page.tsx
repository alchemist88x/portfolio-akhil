"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import EmptyState from "@/components/admin/EmptyState";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Terminal } from "lucide-react";

interface CommandItem {
  _id: string;
  command: string;
  description?: string;
  output: string;
  sortOrder: number;
  published: boolean;
}

export default function AdminTerminalPage() {
  const [commands, setCommands] = useState<CommandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCmd, setEditingCmd] = useState<CommandItem | null>(null);
  const [formData, setFormData] = useState({
    command: "",
    description: "",
    output: "",
    sortOrder: 0,
    published: true,
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchCommands = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/terminal");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load commands");
      setCommands(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands();
  }, []);

  const openCreateModal = () => {
    setEditingCmd(null);
    setFormData({
      command: "",
      description: "",
      output: "",
      sortOrder: commands.length + 1,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (cmd: CommandItem) => {
    setEditingCmd(cmd);
    setFormData({
      command: cmd.command,
      description: cmd.description || "",
      output: cmd.output || "",
      sortOrder: cmd.sortOrder,
      published: cmd.published,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCmd) {
        const res = await fetch("/api/admin/terminal", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCmd._id, ...formData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setModalOpen(false);
      fetchCommands();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save command");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/terminal?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchCommands();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete command");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= commands.length) return;

    const newCmds = [...commands];
    const temp = newCmds[index];
    newCmds[index] = newCmds[targetIndex];
    newCmds[targetIndex] = temp;

    const payload = newCmds.map((item, idx) => ({ id: item._id, sortOrder: idx + 1 }));
    setCommands(newCmds.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));

    try {
      await fetch("/api/admin/terminal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
    } catch {
      fetchCommands();
    }
  };

  if (loading) return <LoadingState message="FETCHING TERMINAL COMMANDS..." />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="COMMAND CENTER (CLI)"
        subtitle="Manage dynamic bash shell commands and terminal outputs"
        badge={`${commands.length} COMMANDS`}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs font-mono tracking-wider transition-colors"
          >
            <Plus size={14} /> ADD COMMAND
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchCommands} />}

      {commands.length === 0 ? (
        <EmptyState
          title="NO TERMINAL COMMANDS CONFIGURED"
          description="Create interactive shell commands (e.g. whoami, help, status, skills)."
          actionText="Create Command"
          onAction={openCreateModal}
        />
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/60 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">COMMAND</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4">OUTPUT MODE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {commands.map((cmd, index) => (
                  <tr key={cmd._id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3 px-4 text-zinc-600 font-bold">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <Terminal size={13} className="text-zinc-500" />
                        <span>$ {cmd.command}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{cmd.description || "—"}</td>
                    <td className="py-3 px-4 text-zinc-500">
                      {cmd.output ? (
                        <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-300">
                          Custom String
                        </span>
                      ) : (
                        <span className="text-[10px] bg-sky-950/40 text-sky-400 px-2 py-0.5 rounded border border-sky-800/40">
                          Dynamic From DB
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={cmd.published ? "published" : "draft"} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-zinc-400">
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
                          disabled={index === commands.length - 1}
                          className="p-1 hover:text-zinc-100 disabled:opacity-20 text-zinc-500"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => openEditModal(cmd)}
                          className="p-1 hover:text-zinc-100"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(cmd._id);
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

      {/* Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCmd ? "EDIT TERMINAL COMMAND" : "ADD TERMINAL COMMAND"}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Command String (lowercase, no spaces)
            </label>
            <input
              type="text"
              required
              value={formData.command}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  command: e.target.value.toLowerCase().trim(),
                })
              }
              placeholder="e.g. status"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 lowercase"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Manual Description (Displayed in &quot;help&quot;)
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Print engineer identity and credentials"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-mono text-zinc-400">
                Custom Output String (Optional)
              </label>
              <span className="text-[10px] font-mono text-zinc-500">
                Leave empty for dynamic DB response
              </span>
            </div>
            <textarea
              rows={5}
              value={formData.output}
              onChange={(e) => setFormData({ ...formData, output: e.target.value })}
              placeholder="If blank, commands like 'whoami', 'skills', 'projects', 'about' automatically query real DB content."
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="cmdPublished"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
            />
            <label htmlFor="cmdPublished" className="text-xs font-mono text-zinc-300">
              Published in CLI
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
              {editingCmd ? "Update Command" : "Create Command"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this shell command?"
      />
    </div>
  );
}
