import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { defaultBlogPosts } from "@/lib/initial-data";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  Share2,
  BookOpen,
  CheckCircle2,
  Terminal,
  User,
  Shield,
  ArrowUpRight,
} from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

// Dynamic Metadata
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const db = await connectToDatabase();
  let blog: any = null;

  if (db.isConnected) {
    try {
      blog = await BlogPost.findOne({ slug, published: true }).lean();
    } catch (e) {
      console.error("[generateMetadata Error]", e);
    }
  }

  if (!blog) {
    blog = defaultBlogPosts.find((b) => b.slug === slug || b.slug.toLowerCase() === slug.toLowerCase());
  }

  if (!blog) {
    return {
      title: "Dispatch Not Found | Akhil",
      description: "Engineering article not found.",
    };
  }

  return {
    title: `${blog.title} | Akhil — DevOps & Cloud Infrastructure`,
    description: blog.summary,
    keywords: blog.tags || ["DevOps", "Cloud", "AWS"],
    openGraph: {
      title: blog.title,
      description: blog.summary,
      type: "article",
      publishedTime: blog.publishedAt,
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const db = await connectToDatabase();
  let blog: any = null;

  if (db.isConnected) {
    try {
      blog = await BlogPost.findOne({ slug, published: true }).lean();
      if (blog) {
        blog = JSON.parse(JSON.stringify(blog));
      }
    } catch (e) {
      console.error("[Blog Detail Query Error]", e);
    }
  }

  if (!blog) {
    const fallback = defaultBlogPosts.find(
      (b) => b.slug === slug || b.slug.toLowerCase() === slug.toLowerCase()
    );
    if (fallback) blog = fallback;
  }

  if (!blog) {
    notFound();
  }

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Published";

  // Simple clean markdown parser for rendering formatted sections
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeBuffer: string[] = [];

    lines.forEach((line, index) => {
      // Check code block start/end
      if (line.trim().startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().replace(/^```/, "").trim();
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div
              key={`code-${index}`}
              className="my-6 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden font-mono text-xs"
            >
              {codeLanguage && (
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 text-[11px] text-zinc-400">
                  <span className="font-bold text-emerald-400 uppercase font-nothing">{codeLanguage}</span>
                  <span className="text-zinc-600 font-nothing">IMMUTABLE CONFIG</span>
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-zinc-200 leading-relaxed">
                <code>{codeBuffer.join("\n")}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Headings
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={index}
            className="text-xl sm:text-2xl font-bold text-zinc-100 uppercase tracking-tight mt-10 mb-4 pb-2 border-b border-zinc-800 font-mono"
          >
            {line.replace("## ", "")}
          </h2>
        );
        return;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={index}
            className="text-lg font-bold text-zinc-200 uppercase tracking-wide mt-8 mb-3 font-mono"
          >
            {line.replace("### ", "")}
          </h3>
        );
        return;
      }

      // Horizontal Rule
      if (line.trim() === "---") {
        elements.push(<hr key={index} className="my-8 border-zinc-800" />);
        return;
      }

      // Bullet lists
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.trim().replace(/^[-*]\s+/, "");
        elements.push(
          <li key={index} className="ml-4 list-disc text-sm text-zinc-300 leading-relaxed font-sans mb-1.5">
            {itemText}
          </li>
        );
        return;
      }

      // Numbered lists
      if (/^\d+\.\s+/.test(line.trim())) {
        const itemText = line.trim().replace(/^\d+\.\s+/, "");
        elements.push(
          <li key={index} className="ml-4 list-decimal text-sm text-zinc-300 leading-relaxed font-sans mb-1.5">
            {itemText}
          </li>
        );
        return;
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        elements.push(
          <blockquote
            key={index}
            className="my-4 pl-4 border-l-2 border-emerald-500 text-sm text-zinc-400 italic bg-zinc-950/40 py-2 rounded-r font-sans"
          >
            {line.replace("> ", "")}
          </blockquote>
        );
        return;
      }

      // Paragraphs
      if (line.trim()) {
        elements.push(
          <p key={index} className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans my-3">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-mono selection:bg-emerald-500/20 selection:text-emerald-400">
      <Navigation
        items={[
          { label: "WORK", sectionId: "work", published: true },
          { label: "STACK", sectionId: "stack", published: true },
          { label: "EXPERIENCE", sectionId: "experience", published: true },
          { label: "BLOG", sectionId: "blog", published: true },
          { label: "ABOUT", sectionId: "about", published: true },
          { label: "CONTACT", sectionId: "contact", published: true },
        ]}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-emerald-400 transition-colors uppercase font-nothing"
          >
            <ArrowLeft size={14} />
            <span>BACK TO ALL DISPATCHES</span>
          </Link>
        </div>

        {/* Article Header Card */}
        <header className="p-8 sm:p-10 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-zinc-900 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded bg-zinc-900 text-emerald-400 font-bold border border-zinc-800 text-[11px] uppercase font-nothing">
                {blog.category || "DevOps"}
              </span>

              <span className="text-zinc-500 flex items-center gap-1.5 text-xs font-nothing">
                <Clock size={12} />
                {blog.readTime || "5 min read"}
              </span>
            </div>

            <span className="text-zinc-500 flex items-center gap-1.5 text-xs font-nothing">
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-100 uppercase leading-snug">
            {blog.title}
          </h1>

          {/* Excerpt */}
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
            {blog.summary}
          </p>

          {/* Author Badge & Tags */}
          <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold text-xs">
                A
              </div>
              <div>
                <span className="font-bold text-zinc-200 block uppercase">Akhil</span>
                <span className="text-[11px] text-zinc-500 font-nothing">DevOps &amp; Cloud Infrastructure</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {blog.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-nothing"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Article Body Content */}
        <article className="p-8 sm:p-10 rounded-xl bg-zinc-950/50 border border-zinc-800/80 prose prose-invert max-w-none">
          {renderContent(blog.content)}
        </article>

        {/* Footer Author Card */}
        <div className="p-6 sm:p-8 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs text-emerald-400 font-bold uppercase font-nothing">
              ABOUT THE AUTHOR
            </span>
            <h3 className="text-base font-bold text-zinc-200 uppercase">
              Akhil — DevOps Engineer
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl font-sans leading-relaxed">
              Specializing in AWS cloud infrastructure, Kubernetes container meshes, zero-downtime CI/CD automation, and Generative AI model inference clusters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/#contact"
              className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 font-nothing"
            >
              <span>CONNECT WITH AKHIL</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
