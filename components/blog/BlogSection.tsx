"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Clock, Calendar, ArrowRight, Star, ExternalLink, ArrowUpRight } from "lucide-react";

export interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  published: boolean;
  publishedAt: string | Date;
}

interface BlogSectionProps {
  blogs: BlogPostData[];
}

export default function BlogSection({ blogs }: BlogSectionProps) {
  const publishedBlogs = blogs.filter((b) => b.published);

  if (publishedBlogs.length === 0) return null;

  // Display featured first, then by date, up to 3 on the home page
  const displayBlogs = [...publishedBlogs]
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 3);

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-zinc-950/30">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold font-nothing">11</span>
            <span className="text-zinc-600 font-mono">/</span>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
              ENGINEERING DISPATCHES
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500 font-nothing">
            FIELD NOTES · ARCHITECTURAL DEEP DIVES · ZERO FLUFF
          </span>
        </div>

        {/* 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBlogs.map((blog, idx) => {
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
                className="group p-6 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition-all font-mono flex flex-col justify-between space-y-5 hover:bg-zinc-900/40 relative"
              >
                <div className="space-y-4">
                  {/* Metadata Chips */}
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
                    <h3 className="text-sm sm:text-base font-bold text-zinc-100 uppercase tracking-wide leading-snug">
                      {blog.title}
                    </h3>
                  </Link>

                  {/* Summary */}
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 font-sans">
                    {blog.summary}
                  </p>
                </div>

                {/* Card Footer: Date, Tags & Action Link */}
                <div className="space-y-3 pt-3 border-t border-zinc-900">
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.slice(0, 4).map((tag) => (
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
                      <span>READ</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Section Bottom Controls */}
        <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
            <span className="text-[11px] font-nothing">
              TOTAL ARTICLES IN PRODUCTION INDEX: {publishedBlogs.length}
            </span>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 transition-colors uppercase font-bold text-xs"
          >
            <span>VIEW ALL DISPATCHES</span>
            <ArrowUpRight size={13} className="text-emerald-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
