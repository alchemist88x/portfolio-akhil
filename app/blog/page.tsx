import React from "react";
import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { defaultBlogPosts } from "@/lib/initial-data";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";
import BlogListClient from "@/components/blog/BlogListClient";
import { ArrowLeft, BookOpen } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Engineering Dispatches & Articles | Akhil — DevOps & Cloud Infrastructure",
  description:
    "Technical field notes, architectural deep dives, and production blueprints on AWS, Kubernetes, Terraform, AI serving, and cloud reliability.",
};

export default async function BlogIndexPage() {
  const db = await connectToDatabase();
  let blogs: any[] = [];

  if (db.isConnected) {
    try {
      blogs = await BlogPost.find({ published: true })
        .sort({ sortOrder: 1, publishedAt: -1, createdAt: -1 })
        .lean();
      if (blogs && blogs.length > 0) {
        blogs = JSON.parse(JSON.stringify(blogs));
      }
    } catch (e) {
      console.error("[Blog Page Server Fetch Error]", e);
    }
  }

  // Fallback to default blog posts if DB has none yet
  if (!blogs || blogs.length === 0) {
    blogs = defaultBlogPosts.map((b, idx) => ({ ...b, _id: String(idx) }));
  }

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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-emerald-400 transition-colors uppercase font-nothing"
          >
            <ArrowLeft size={14} />
            <span>BACK TO PORTFOLIO</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="p-8 sm:p-12 rounded-xl bg-gradient-to-b from-zinc-950 to-[#0A0A0A] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-400 font-bold font-nothing">
              DISPATCHES // 011
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-400 uppercase font-nothing">
              TECHNICAL PUBLICATIONS &amp; FIELD LOGS
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 uppercase">
            ENGINEERING DISPATCHES
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed font-sans">
            In-depth field logs on cloud systems architecture, zero-downtime microservice deployments, Generative AI GPU cluster orchestration, multi-region disaster recovery, and infrastructure reliability.
          </p>
        </div>

        {/* Client-Side Search, Category Filter & Blog Grid */}
        <BlogListClient initialBlogs={blogs} />
      </main>

      <Footer />
    </div>
  );
}
