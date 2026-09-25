"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Clock, Calendar, ArrowRight, Star, BookOpen, Layers } from "lucide-react";
import { BlogPostData } from "./BlogSection";

interface BlogListClientProps {
  initialBlogs: BlogPostData[];
}

export default function BlogListClient({ initialBlogs }: BlogListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(initialBlogs.map((b) => b.category).filter(Boolean)))];

  const filteredBlogs = initialBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === "all" || blog.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 font-mono">
      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by topic, keyword, or architecture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded pl-9 pr-3 py-2 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded uppercase font-bold text-[11px] transition-colors font-nothing ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-zinc-100 text-zinc-950"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cat === "all" ? "ALL TOPICS" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-900 pb-3">
        <span className="font-nothing">
          SHOWING {filteredBlogs.length} OF {initialBlogs.length} ARTICLES
        </span>
        <span className="text-emerald-400 font-nothing">ENGINEERING STANDARDS // VERIFIED</span>
      </div>

      {/* Empty State */}
      {filteredBlogs.length === 0 && (
        <div className="p-12 text-center rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-3">
          <BookOpen size={28} className="mx-auto text-zinc-600" />
          <h3 className="text-sm font-bold text-zinc-300 uppercase">No matching articles found</h3>
          <p className="text-xs text-zinc-500">
            Try adjusting your search query or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-xs text-emerald-400 font-bold hover:underline uppercase pt-2 inline-block"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => {
          const formattedDate = blog.publishedAt
            ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent";

          return (
            <article
              key={blog._id || blog.slug}
              className="group p-6 rounded-lg bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-5 hover:bg-zinc-900/40 relative"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 font-bold border border-zinc-800 text-[10px] uppercase font-nothing">
                      {blog.category || "DevOps"}
                    </span>

                    {blog.featured && (
                      <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.2 rounded flex items-center gap-1 font-nothing">
                        <Star size={9} className="fill-amber-400" />
                        FEATURED
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-nothing">
                    <Clock size={11} />
                    {blog.readTime || "5 min read"}
                  </span>
                </div>

                {/* Title */}
                <Link href={`/blog/${blog.slug}`} className="block group-hover:text-emerald-400 transition-colors">
                  <h2 className="text-base font-bold text-zinc-100 uppercase tracking-wide leading-snug">
                    {blog.title}
                  </h2>
                </Link>

                {/* Excerpt */}
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 font-sans">
                  {blog.summary}
                </p>
              </div>

              {/* Footer */}
              <div className="space-y-3 pt-3 border-t border-zinc-900">
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-500 font-nothing"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] text-zinc-600 font-nothing flex items-center gap-1">
                    <Calendar size={11} />
                    {formattedDate}
                  </span>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 uppercase transition-transform group-hover:translate-x-1"
                  >
                    <span>READ ARTICLE</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
