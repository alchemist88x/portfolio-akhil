"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, GitBranch, Save, CheckCircle2 } from "lucide-react";

interface StageItem {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  published: boolean;
}

export default function AdminPipelinesPage() {
  const [pipeline, setPipeline] = useState<{
    _id?: string;
    name: string;
    description?: string;
    published: boolean;
  } | null>(null);

  const [stages, setStages] = useState<StageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPipe, setSavingPipe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<StageItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Rocket",
    sortOrder: 0,
    published: true,
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/pipelines");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load pipeline");
      setPipeline(data.data.pipeline);
      setStages(data.data.stages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePipelineMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pipeline) return;
    setSavingPipe(true);
    try {
      const res = await fetch("/api/admin/pipelines", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: "pipeline",
          name: pipeline.name,
          description: pipeline.description,
          published: pipeline.published,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSuccessMsg("Pipeline details updated.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update pipeline details");
    } finally {
      setSavingPipe(false);
    }
  };

  const openCreateModal = () => {
    setEditingStage(null);
    setFormData({
      name: "",
      description: "",
      icon: "Rocket",
      sortOrder: stages.length + 1,
      published: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (stage: StageItem) => {
    setEditingStage(stage);
    setFormData({
      name: stage.name,
      description: stage.description || "",
      icon: stage.icon || "Rocket",
      sortOrder: stage.sortOrder,
      published: stage.published,
    });
    setModalOpen(true);
  };

  const handleSaveStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pipeline?._id) return;
    try {
      if (editingStage) {
        const res = await fetch("/api/admin/pipelines", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType: "stage", id: editingStage._id, ...formData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/pipelines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pipelineId: pipeline._id, ...formData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save stage");
    }
  };

  const handleDeleteStage = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/pipelines?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete stage");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stages.length) return;

    const newStages = [...stages];
    const temp = newStages[index];
    newStages[index] = newStages[targetIndex];
    newStages[targetIndex] = temp;

    const payload = newStages.map((item, idx) => ({ id: item._id, sortOrder: idx + 1 }));
    setStages(newStages.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));

    try {
      await fetch("/api/admin/pipelines", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
    } catch {
      fetchData();
    }
  };

  if (loading) return <LoadingState message="FETCHING CI/CD PIPELINE STAGES..." />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="CI/CD PIPELINE STAGES"
        subtitle="Manage continuous integration, delivery workflows, and automated gates"
        badge={`${stages.length} STAGES`}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs font-mono tracking-wider transition-colors"
          >
            <Plus size={14} /> ADD STAGE
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchData} />}

      {successMsg && (
        <div className="p-3.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pipeline Meta Form */}
      {pipeline && (
        <form
          onSubmit={handleSavePipelineMeta}
          className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4"
        >
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase">
              PIPELINE CONFIGURATION
            </h3>
            <button
              type="submit"
              disabled={savingPipe}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-mono font-semibold transition-colors"
            >
              <Save size={13} /> Save Pipeline Meta
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Pipeline Name</label>
              <input
                type="text"
                value={pipeline.name}
                onChange={(e) => setPipeline({ ...pipeline, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Description</label>
              <input
                type="text"
                value={pipeline.description || ""}
                onChange={(e) => setPipeline({ ...pipeline, description: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </form>
      )}

      {/* Stages List */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-400 uppercase">
          STAGES FLOW SEQUENCE
        </h3>

        {stages.map((stage, index) => (
          <div
            key={stage._id}
            className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-zinc-500 font-bold text-xs">{index + 1}</span>
              <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                <GitBranch size={16} />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wide">
                  {stage.name}
                </h4>
                {stage.description && (
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5 line-clamp-1">
                    {stage.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={stage.published ? "published" : "draft"} />
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
                disabled={index === stages.length - 1}
                className="p-1 hover:text-zinc-100 disabled:opacity-20 text-zinc-500"
                title="Move Down"
              >
                <ArrowDown size={14} />
              </button>
              <button
                onClick={() => openEditModal(stage)}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                title="Edit Stage"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => {
                  setItemToDelete(stage._id);
                  setDeleteConfirmOpen(true);
                }}
                className="p-1.5 rounded hover:bg-red-950/30 text-zinc-500 hover:text-red-400"
                title="Delete Stage"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stage Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStage ? "EDIT PIPELINE STAGE" : "ADD PIPELINE STAGE"}
      >
        <form onSubmit={handleSaveStage} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Stage Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              placeholder="e.g. CODE, TEST, DEPLOY"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 uppercase focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What happens in this CI/CD phase..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="stagePublished"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
            />
            <label htmlFor="stagePublished" className="text-xs font-mono text-zinc-300">
              Published in Public Visualization
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
              {editingStage ? "Update Stage" : "Save Stage"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteStage}
        message="Are you sure you want to delete this pipeline stage?"
      />
    </div>
  );
}
