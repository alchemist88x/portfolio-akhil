"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import { Plus, Edit2, Trash2, Network, Save, CheckCircle2 } from "lucide-react";

interface NodeItem {
  _id: string;
  name: string;
  type: string;
  description?: string;
  icon?: string;
  x: number;
  y: number;
  sortOrder: number;
  published: boolean;
}

interface ConnectionItem {
  _id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

export default function AdminArchitecturePage() {
  const [architecture, setArchitecture] = useState<{
    _id?: string;
    name: string;
    title: string;
    description?: string;
    published: boolean;
  } | null>(null);

  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingArch, setSavingArch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Node Modal
  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<NodeItem | null>(null);
  const [nodeFormData, setNodeFormData] = useState({
    name: "",
    type: "service",
    description: "",
    icon: "Server",
    x: 0,
    y: 0,
    sortOrder: 0,
    published: true,
  });

  // Connection Modal
  const [connModalOpen, setConnModalOpen] = useState(false);
  const [connFormData, setConnFormData] = useState({
    sourceNodeId: "",
    targetNodeId: "",
    label: "",
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "node" | "connection" } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/architecture");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load architecture");
      setArchitecture(data.data.architecture);
      setNodes(data.data.nodes || []);
      setConnections(data.data.connections || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveArchitectureMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!architecture) return;
    setSavingArch(true);
    try {
      const res = await fetch("/api/admin/architecture", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: "architecture",
          name: architecture.name,
          title: architecture.title,
          description: architecture.description,
          published: architecture.published,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSuccessMsg("Architecture details updated.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update architecture");
    } finally {
      setSavingArch(false);
    }
  };

  // Node Actions
  const openCreateNodeModal = () => {
    setEditingNode(null);
    setNodeFormData({
      name: "",
      type: "service",
      description: "",
      icon: "Server",
      x: (nodes.length + 1) * 100,
      y: 150,
      sortOrder: nodes.length + 1,
      published: true,
    });
    setNodeModalOpen(true);
  };

  const openEditNodeModal = (node: NodeItem) => {
    setEditingNode(node);
    setNodeFormData({
      name: node.name,
      type: node.type,
      description: node.description || "",
      icon: node.icon || "Server",
      x: node.x,
      y: node.y,
      sortOrder: node.sortOrder,
      published: node.published,
    });
    setNodeModalOpen(true);
  };

  const handleSaveNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!architecture?._id) return;
    try {
      if (editingNode) {
        const res = await fetch("/api/admin/architecture", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityType: "node", id: editingNode._id, ...nodeFormData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/architecture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entityType: "node",
            architectureId: architecture._id,
            ...nodeFormData,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setNodeModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save node");
    }
  };

  // Connection Actions
  const openCreateConnModal = () => {
    if (nodes.length < 2) {
      alert("At least 2 nodes are required to form a connection link.");
      return;
    }
    setConnFormData({
      sourceNodeId: nodes[0]._id,
      targetNodeId: nodes[1]._id,
      label: "Traffic",
    });
    setConnModalOpen(true);
  };

  const handleSaveConn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!architecture?._id) return;
    try {
      const res = await fetch("/api/admin/architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: "connection",
          architectureId: architecture._id,
          ...connFormData,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setConnModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create connection");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(
        `/api/admin/architecture?id=${deleteTarget.id}&type=${deleteTarget.type}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  if (loading) return <LoadingState message="FETCHING ARCHITECTURE NODES..." />;

  const getNodeName = (id: string) => nodes.find((n) => n._id === id)?.name || id;

  return (
    <div className="space-y-8">
      <AdminHeader
        title="INFRASTRUCTURE ARCHITECTURE"
        subtitle="Manage cloud topology diagram, service nodes, and interconnection routes"
        badge={`${nodes.length} NODES · ${connections.length} LINKS`}
        actions={
          <div className="flex gap-2">
            <button
              onClick={openCreateConnModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono transition-colors"
            >
              <Network size={14} /> CONNECT NODES
            </button>
            <button
              onClick={openCreateNodeModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs font-mono tracking-wider transition-colors"
            >
              <Plus size={14} /> ADD NODE
            </button>
          </div>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchData} />}

      {successMsg && (
        <div className="p-3.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Architecture Metadata Form */}
      {architecture && (
        <form
          onSubmit={handleSaveArchitectureMeta}
          className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-4"
        >
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-300 uppercase">
              TOPOLOGY SETTINGS
            </h3>
            <button
              type="submit"
              disabled={savingArch}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-mono font-semibold transition-colors"
            >
              <Save size={13} /> Save Details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Architecture Name</label>
              <input
                type="text"
                value={architecture.name}
                onChange={(e) => setArchitecture({ ...architecture, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Display Title</label>
              <input
                type="text"
                value={architecture.title}
                onChange={(e) => setArchitecture({ ...architecture, title: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-zinc-400 mb-1">Description</label>
              <textarea
                rows={2}
                value={architecture.description || ""}
                onChange={(e) => setArchitecture({ ...architecture, description: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </form>
      )}

      {/* Nodes Table */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-400 uppercase">
          TOPOLOGY NODES ({nodes.length})
        </h3>
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/60 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">NODE NAME</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4">COORDINATES</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {nodes.map((node, index) => (
                  <tr key={node._id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3 px-4 text-zinc-600 font-bold">{index + 1}</td>
                    <td className="py-3 px-4 font-bold text-zinc-100 uppercase">{node.name}</td>
                    <td className="py-3 px-4 text-zinc-400 capitalize">{node.type}</td>
                    <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">
                      {node.description || "—"}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 text-[11px]">
                      X: {node.x} | Y: {node.y}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={node.published ? "published" : "draft"} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-zinc-400">
                        <button
                          onClick={() => openEditNodeModal(node)}
                          className="p-1 hover:text-zinc-100"
                          title="Edit Node"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget({ id: node._id, type: "node" });
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1 hover:text-red-400 text-zinc-500"
                          title="Delete Node"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Connections Table */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-semibold tracking-wider text-zinc-400 uppercase">
          CONNECTED LINKS ({connections.length})
        </h3>
        {connections.length === 0 ? (
          <div className="p-6 border border-dashed border-zinc-800 rounded-lg text-center font-mono text-xs text-zinc-500">
            No node links established. Click &quot;CONNECT NODES&quot; to define data paths.
          </div>
        ) : (
          <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900/60 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">SOURCE NODE</th>
                    <th className="py-3 px-4">LINK DIRECTION</th>
                    <th className="py-3 px-4">TARGET NODE</th>
                    <th className="py-3 px-4">PROTOCOL / LABEL</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {connections.map((conn) => (
                    <tr key={conn._id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-zinc-200">
                        {getNodeName(conn.sourceNodeId)}
                      </td>
                      <td className="py-3 px-4 text-emerald-400">────────►</td>
                      <td className="py-3 px-4 font-bold text-zinc-200">
                        {getNodeName(conn.targetNodeId)}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">{conn.label || "Traffic"}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setDeleteTarget({ id: conn._id, type: "connection" });
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1 hover:text-red-400 text-zinc-500"
                          title="Remove Connection"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Node Modal */}
      <AdminModal
        isOpen={nodeModalOpen}
        onClose={() => setNodeModalOpen(false)}
        title={editingNode ? "EDIT TOPOLOGY NODE" : "ADD TOPOLOGY NODE"}
      >
        <form onSubmit={handleSaveNode} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Node Name</label>
            <input
              type="text"
              required
              value={nodeFormData.name}
              onChange={(e) => setNodeFormData({ ...nodeFormData, name: e.target.value.toUpperCase() })}
              placeholder="e.g. CLOUDFLARE, ALB, EC2"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 uppercase focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Node Type</label>
              <select
                value={nodeFormData.type}
                onChange={(e) => setNodeFormData({ ...nodeFormData, type: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="external">External</option>
                <option value="edge">Edge / DNS</option>
                <option value="security">Security / WAF</option>
                <option value="network">Network / ALB</option>
                <option value="compute">Compute / Containers</option>
                <option value="app">Application</option>
                <option value="database">Database</option>
                <option value="cache">Cache</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Sort Order</label>
              <input
                type="number"
                value={nodeFormData.sortOrder}
                onChange={(e) =>
                  setNodeFormData({ ...nodeFormData, sortOrder: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Description</label>
            <textarea
              rows={2}
              value={nodeFormData.description}
              onChange={(e) => setNodeFormData({ ...nodeFormData, description: e.target.value })}
              placeholder="Service purpose and role in the pipeline..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="nodePub"
              checked={nodeFormData.published}
              onChange={(e) => setNodeFormData({ ...nodeFormData, published: e.target.checked })}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
            />
            <label htmlFor="nodePub" className="text-xs font-mono text-zinc-300">
              Published in Public Visualization
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setNodeModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono tracking-wider transition-colors"
            >
              {editingNode ? "Update Node" : "Save Node"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Connection Modal */}
      <AdminModal
        isOpen={connModalOpen}
        onClose={() => setConnModalOpen(false)}
        title="CONNECT TOPOLOGY NODES"
      >
        <form onSubmit={handleSaveConn} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Source Node (From)</label>
            <select
              value={connFormData.sourceNodeId}
              onChange={(e) => setConnFormData({ ...connFormData, sourceNodeId: e.target.value })}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            >
              {nodes.map((n) => (
                <option key={n._id} value={n._id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Target Node (To)</label>
            <select
              value={connFormData.targetNodeId}
              onChange={(e) => setConnFormData({ ...connFormData, targetNodeId: e.target.value })}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            >
              {nodes.map((n) => (
                <option key={n._id} value={n._id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Protocol / Label</label>
            <input
              type="text"
              value={connFormData.label}
              onChange={(e) => setConnFormData({ ...connFormData, label: e.target.value })}
              placeholder="e.g. Filtered HTTP/S, SQL Queries"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setConnModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono tracking-wider transition-colors"
            >
              Connect Link
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to remove this architecture element?"
      />
    </div>
  );
}
