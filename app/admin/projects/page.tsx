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
import { Plus, Edit2, Trash2, Star, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

interface ProjectItem {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  description: string;
  projectType?: string;
  environment?: string;
  frontend?: string;
  backend?: string;
  webServer?: string;
  architectureDiagram?: string;
  technologies: string[];
  cloudPlatforms: string[];
  awsServices: string[];
  azureServices: string[];
  databases: string[];
  cicdTools: string[];
  responsibilities: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<ProjectItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    projectType: "",
    environment: "Production",
    frontend: "",
    backend: "",
    webServer: "",
    architectureDiagram: "",
    description: "",
    technologies: [] as string[],
    cloudPlatforms: [] as string[],
    awsServices: [] as string[],
    azureServices: [] as string[],
    databases: [] as string[],
    cicdTools: [] as string[],
    responsibilities: [] as string[],
    image: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    published: true,
    sortOrder: 0,
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load projects");
      setProjects(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProj(null);
    setFormData({
      name: "",
      slug: "",
      category: "Cloud Infrastructure",
      projectType: "Web Application / Platform",
      environment: "Production",
      frontend: "",
      backend: "",
      webServer: "",
      architectureDiagram: "",
      description: "",
      technologies: [],
      cloudPlatforms: ["AWS"],
      awsServices: [],
      azureServices: [],
      databases: [],
      cicdTools: [],
      responsibilities: [],
      image: "",
      githubUrl: "",
      liveUrl: "",
      featured: false,
      published: true,
      sortOrder: projects.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProj(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      category: p.category || "",
      projectType: p.projectType || "",
      environment: p.environment || "Production",
      frontend: p.frontend || "",
      backend: p.backend || "",
      webServer: p.webServer || "",
      architectureDiagram: p.architectureDiagram || "",
      description: p.description,
      technologies: p.technologies || [],
      cloudPlatforms: p.cloudPlatforms || [],
      awsServices: p.awsServices || [],
      azureServices: p.azureServices || [],
      databases: p.databases || [],
      cicdTools: p.cicdTools || [],
      responsibilities: p.responsibilities || [],
      image: p.image || "",
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      featured: p.featured,
      published: p.published,
      sortOrder: p.sortOrder,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProj) {
        const res = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProj._id, ...formData }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save project");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    const payload = newProjects.map((item, idx) => ({ id: item._id, sortOrder: idx + 1 }));
    setProjects(newProjects.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));

    try {
      await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
    } catch {
      fetchProjects();
    }
  };

  if (loading) return <LoadingState message="FETCHING CASE STUDIES..." />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="PROJECT CASE STUDIES"
        subtitle="Manage production systems, AWS/Azure deployments, and architectures"
        badge={`${projects.length} PROJECTS`}
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs font-mono tracking-wider transition-colors"
          >
            <Plus size={14} /> NEW PROJECT
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={fetchProjects} />}

      {projects.length === 0 ? (
        <EmptyState
          title="NO PROJECTS YET"
          description="Create your first production infrastructure case study."
          actionText="Create Project"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-4">
          {projects.map((p, index) => (
            <div
              key={p._id}
              className="p-5 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-3 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-zinc-600 font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-zinc-100 uppercase">
                        {p.name}
                      </span>
                      {p.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                          <Star size={10} className="fill-amber-400" /> FEATURED
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
                      {p.category && <span>{p.category}</span>}
                      {p.projectType && <span className="text-zinc-600">•</span>}
                      {p.projectType && <span>{p.projectType}</span>}
                      {p.environment && <span className="text-zinc-600">•</span>}
                      {p.environment && (
                        <span className="text-emerald-400 font-semibold uppercase">{p.environment}</span>
                      )}
                      {p.liveUrl && <span className="text-zinc-600">•</span>}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:underline truncate max-w-[200px]"
                        >
                          {p.liveUrl}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={p.published ? "published" : "draft"} />
                  <a
                    href={`/projects/${p.slug}`}
                    target="_blank"
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    title="View public case study"
                  >
                    <ExternalLink size={14} />
                  </a>
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
                    disabled={index === projects.length - 1}
                    className="p-1 hover:text-zinc-100 disabled:opacity-20 text-zinc-500"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    title="Edit Project"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(p._id);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-1.5 rounded hover:bg-red-950/30 text-zinc-500 hover:text-red-400"
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p className="text-xs font-mono text-zinc-400 leading-relaxed line-clamp-2">
                {p.description}
              </p>

              {/* Chips row */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.cloudPlatforms?.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-sky-950/50 text-sky-400 border border-sky-800/40 text-[10px] font-mono"
                  >
                    {c}
                  </span>
                ))}
                {p.awsServices?.map((aws, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-amber-950/30 text-amber-300 border border-amber-800/40 text-[10px] font-mono"
                  >
                    {aws}
                  </span>
                ))}
                {p.databases?.map((db, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-[10px] font-mono"
                  >
                    {db}
                  </span>
                ))}
                {p.cicdTools?.map((cicd, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px] font-mono"
                  >
                    {cicd}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProj ? "EDIT PROJECT CASE STUDY" : "CREATE PROJECT CASE STUDY"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  });
                }}
                placeholder="e.g. SVADHAN"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 lowercase"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Cloud Infrastructure"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Project Type</label>
              <input
                type="text"
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                placeholder="e.g. Web Application / Platform"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Environment</label>
              <input
                type="text"
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                placeholder="e.g. Production"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Frontend</label>
              <input
                type="text"
                value={formData.frontend}
                onChange={(e) => setFormData({ ...formData, frontend: e.target.value })}
                placeholder="e.g. AWS Amplify"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Backend</label>
              <input
                type="text"
                value={formData.backend}
                onChange={(e) => setFormData({ ...formData, backend: e.target.value })}
                placeholder="e.g. Amazon EC2"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Web Server</label>
              <input
                type="text"
                value={formData.webServer}
                onChange={(e) => setFormData({ ...formData, webServer: e.target.value })}
                placeholder="e.g. Apache2"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Description / Overview</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed technical description of this infrastructure deployment..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="projFeatured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500"
              />
              <label htmlFor="projFeatured" className="text-xs font-mono text-zinc-300">
                Feature on Homepage
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="projPublished"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
              />
              <label htmlFor="projPublished" className="text-xs font-mono text-zinc-300">
                Published
              </label>
            </div>
          </div>

          {/* Dynamic Chip Editors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <DynamicListEditor
              label="Cloud Platforms"
              items={formData.cloudPlatforms}
              onChange={(items) => setFormData({ ...formData, cloudPlatforms: items })}
              placeholder="e.g. AWS, Azure, Cloudways..."
            />
            <DynamicListEditor
              label="AWS Services"
              items={formData.awsServices}
              onChange={(items) => setFormData({ ...formData, awsServices: items })}
              placeholder="e.g. ECS, EC2, WAF, S3, CloudWatch..."
            />
            <DynamicListEditor
              label="Databases"
              items={formData.databases}
              onChange={(items) => setFormData({ ...formData, databases: items })}
              placeholder="e.g. MySQL Aurora, Oracle DB, RDS..."
            />
            <DynamicListEditor
              label="CI/CD & IaC Tools"
              items={formData.cicdTools}
              onChange={(items) => setFormData({ ...formData, cicdTools: items })}
              placeholder="e.g. Terraform, GitHub Actions, GitLab CI..."
            />
          </div>

          <DynamicListEditor
            label="Additional Technologies"
            items={formData.technologies}
            onChange={(items) => setFormData({ ...formData, technologies: items })}
            placeholder="e.g. Docker, Linux, PHP, Java..."
          />

          <DynamicListEditor
            label="Engineering Responsibilities"
            items={formData.responsibilities}
            onChange={(items) => setFormData({ ...formData, responsibilities: items })}
            placeholder="e.g. Configured AWS WAF rules and edge caching..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                GitHub Repository URL (Optional)
              </label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Live URL / Production Link (Editable)
              </label>
              <input
                type="text"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://www.alphauniverse-mea.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                Target link for the &quot;VIEW LIVE PROJECT&quot; button (opens in new tab with rel=&quot;noopener noreferrer&quot;)
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono text-zinc-400">
                Production Architecture Topology (ASCII Diagram Flowchart)
              </label>
              <span className="text-[10px] font-mono text-zinc-500">Monospace ASCII flow</span>
            </div>
            <textarea
              rows={8}
              value={formData.architectureDiagram}
              onChange={(e) => setFormData({ ...formData, architectureDiagram: e.target.value })}
              placeholder={`                    INTERNET\n                       │\n                       ▼\n          www.alphauniverse-mea.com\n                       │\n                       ▼\n                 AWS AMPLIFY\n                       │\n                       │ API Requests\n                       ▼\n                 BACKEND / API\n                       │\n                       ▼\n                 AMAZON EC2\n                       │\n                       ▼\n                    APACHE2\n                       │\n                       ▼\n              BACKEND APPLICATION`}
              className="w-full bg-[#050505] border border-zinc-800 rounded px-3 py-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 leading-relaxed font-semibold whitespace-pre"
            />
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
              {editingProj ? "Update Project" : "Save Project"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this project? This will permanently remove the case study and its details."
      />
    </div>
  );
}
