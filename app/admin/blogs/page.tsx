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
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  BookOpen,
  Search,
  Eye,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface BlogPostItem {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readTime: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Cloud Infrastructure",
    readTime: "5 min read",
    summary: "",
    content: "",
    tags: [] as string[],
    coverImage: "",
    featured: false,
    published: true,
    sortOrder: 0,
    publishedAt: new Date().toISOString().split("T")[0],
  });

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load blog posts");
      setBlogs(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setActiveTab("edit");
    setFormData({
      title: "",
      slug: "",
      category: "Cloud Infrastructure",
      readTime: "5 min read",
      summary: "",
      content: "## Overview\n\nDetailed technical analysis and production architecture walkthrough...\n\n### Architecture\n\n```yaml\n# Configuration\nversion: '1.0'\n```\n\n### Key Lessons\n\n- Zero-downtime rollback guarantee\n- Automated latency threshold monitoring\n",
      tags: ["DevOps", "AWS", "Linux"],
      coverImage: "",
      featured: false,
      published: true,
      sortOrder: blogs.length + 1,
      publishedAt: new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const openEditModal = (blog: BlogPostItem) => {
    setEditingBlog(blog);
    setActiveTab("edit");
    setFormData({
      title: blog.title,
      slug: blog.slug,
      category: blog.category || "DevOps",
      readTime: blog.readTime || "5 min read",
      summary: blog.summary,
      content: blog.content,
      tags: blog.tags || [],
      coverImage: blog.coverImage || "",
      featured: blog.featured,
      published: blog.published,
      sortOrder: blog.sortOrder ?? 0,
      publishedAt: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  // Helper to generate URL slug from title
  const generateSlug = () => {
    const slugified = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug: slugified }));
  };

  // Helper to calculate read time
  const autoCalculateReadTime = () => {
    const wordCount = formData.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    setFormData((prev) => ({ ...prev, readTime: `${minutes} min read` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = "/api/admin/blogs";
      const method = editingBlog ? "PUT" : "POST";
      const payload = editingBlog ? { id: editingBlog._id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save blog post");
      }

      setModalOpen(false);
      fetchBlogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving blog post");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/blogs?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete blog post");

      setDeleteConfirmOpen(false);
      fetchBlogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting blog post");
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  const togglePublish = async (blog: BlogPostItem) => {
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: blog._id,
          title: blog.title,
          slug: blog.slug,
          summary: blog.summary,
          content: blog.content,
          category: blog.category,
          tags: blog.tags,
          published: !blog.published,
        }),
      });
      if (res.ok) fetchBlogs();
    } catch (err) {
      console.error("Toggle publish failed", err);
    }
  };

  const categories = Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)));

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.tags && b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = categoryFilter === "all" || b.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="ENGINEERING BLOGS & DISPATCHES"
        subtitle="Write and publish technical deep dives, architectural breakdowns, and DevOps tutorials."
        actions={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/20"
          >
            <Plus size={15} />
            <span>CREATE DISPATCH</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-lg bg-zinc-950/70 border border-zinc-800 text-xs font-mono">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by title, excerpt, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded pl-9 pr-3 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500 uppercase text-[11px]">CATEGORY:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 uppercase text-xs"
          >
            <option value="all">ALL CATEGORIES ({blogs.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <LoadingState message="LOADING DISPATCH REPOSITORIES..." />}
      {error && <ErrorState message={error} onRetry={fetchBlogs} />}

      {!loading && !error && filteredBlogs.length === 0 && (
        <EmptyState
          title={searchQuery ? "No matching dispatches found" : "No blog posts published yet"}
          description={searchQuery ? "Try changing your search keywords." : "Publish your first technical article or guide."}
          actionText="CREATE FIRST DISPATCH"
          onAction={openCreateModal}
        />
      )}

      {/* Blog Posts Grid */}
      {!loading && !error && filteredBlogs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 font-mono">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="p-5 sm:p-6 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              {/* Left Details */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 font-bold border border-zinc-800 text-[10px] uppercase">
                    {blog.category || "DevOps"}
                  </span>

                  <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                    <Clock size={12} />
                    <span>{blog.readTime || "5 min read"}</span>
                  </span>

                  <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                    <Calendar size={12} />
                    <span>
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Draft"}
                    </span>
                  </span>

                  {blog.featured && (
                    <span className="text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <Star size={10} className="fill-amber-400" />
                      FEATURED
                    </span>
                  )}

                  <StatusBadge status={blog.published ? "published" : "draft"} />
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-wide">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1 line-clamp-2">
                    {blog.summary}
                  </p>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-900">
                <a
                  href={`/blog/${blog.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View Public Post"
                  className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 transition-colors"
                >
                  <ArrowUpRight size={15} />
                </a>

                <button
                  onClick={() => togglePublish(blog)}
                  title={blog.published ? "Unpublish Dispatch" : "Publish Dispatch"}
                  className={`p-2 rounded border text-xs transition-colors ${
                    blog.published
                      ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400"
                      : "bg-emerald-950/40 border-emerald-800 text-emerald-400 hover:bg-emerald-900/60"
                  }`}
                >
                  <Eye size={15} />
                </button>

                <button
                  onClick={() => openEditModal(blog)}
                  className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                  title="Edit Dispatch"
                >
                  <Edit2 size={15} />
                </button>

                <button
                  onClick={() => confirmDelete(blog._id)}
                  className="p-2 rounded bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-900 transition-colors"
                  title="Delete Dispatch"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBlog ? "EDIT ENGINEERING DISPATCH" : "NEW ENGINEERING DISPATCH"}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider block font-bold">
                ARTICLE TITLE *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={() => {
                  if (!formData.slug && formData.title) generateSlug();
                }}
                placeholder="Architecting Zero-Downtime Blue/Green Deployments"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-zinc-400 uppercase tracking-wider block font-bold">
                  SLUG (URL PATH) *
                </label>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles size={11} /> Auto-Generate
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="zero-downtime-blue-green-deployments"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category, Read Time, Published Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider block font-bold">
                CATEGORY
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Cloud Infrastructure"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-zinc-400 uppercase tracking-wider block font-bold">
                  ESTIMATED READ TIME
                </label>
                <button
                  type="button"
                  onClick={autoCalculateReadTime}
                  className="text-[10px] text-emerald-400 hover:underline"
                >
                  Calculate
                </button>
              </div>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="6 min read"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider block font-bold">
                PUBLISHED DATE
              </label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Summary / Excerpt */}
          <div className="space-y-1.5">
            <label className="text-zinc-400 uppercase tracking-wider block font-bold">
              SUMMARY / EXCERPT (CARD PREVIEW &amp; SEO) *
            </label>
            <textarea
              required
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="A field-tested production blueprint for rolling out containerized microservices with zero downtime..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Content Editor with Preview Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <label className="text-zinc-400 uppercase tracking-wider block font-bold">
                ARTICLE BODY (MARKDOWN &amp; CODE) *
              </label>
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors ${
                    activeTab === "edit"
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  EDITOR
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-colors ${
                    activeTab === "preview"
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  PREVIEW
                </button>
              </div>
            </div>

            {activeTab === "edit" ? (
              <textarea
                required
                rows={14}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write article in Markdown with headings (##, ###), code blocks (```yaml, ```bash), and bullet points..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3.5 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
              />
            ) : (
              <div className="p-4 rounded bg-zinc-900/90 border border-zinc-800 min-h-[300px] max-h-[420px] overflow-y-auto space-y-3 prose prose-invert prose-emerald text-xs">
                <div className="text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {formData.content}
                </div>
              </div>
            )}
          </div>

          {/* Tags Editor */}
          <div className="space-y-1.5">
            <DynamicListEditor
              label="TAGS & TOPICS"
              items={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
              placeholder="e.g. AWS, Kubernetes, Terraform, Docker"
            />
          </div>

          {/* Cover Image & Sort Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider block font-bold">
                COVER IMAGE URL (OPTIONAL)
              </label>
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/cover.webp or /images/..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider block font-bold">
                SORT ORDER
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Featured & Published Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded bg-zinc-900 border-zinc-800 text-emerald-500 focus:ring-0"
              />
              <span className="font-bold">FEATURE ON HOME PORTFOLIO</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded bg-zinc-900 border-zinc-800 text-emerald-500 focus:ring-0"
              />
              <span className="font-bold">PUBLISHED (PUBLIC VISIBILITY)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors uppercase font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold uppercase transition-colors disabled:opacity-50"
            >
              {saving ? "SAVING..." : editingBlog ? "UPDATE DISPATCH" : "PUBLISH DISPATCH"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="DELETE ENGINEERING DISPATCH"
        message="Are you certain you wish to purge this article from the database? This action is permanent and cannot be undone."
        isLoading={deleting}
      />
    </div>
  );
}
