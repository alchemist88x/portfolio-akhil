import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { defaultBlogPosts } from "@/lib/initial-data";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    const db = await connectToDatabase();
    if (!db.isConnected) {
      // Fallback to default blogs
      let filtered = defaultBlogPosts.filter((b) => b.published);
      if (category) {
        filtered = filtered.filter((b) => b.category.toLowerCase() === category.toLowerCase());
      }
      if (tag) {
        filtered = filtered.filter((b) => b.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
      }
      return apiSuccess(filtered);
    }

    const query: any = { published: true };
    if (category) query.category = new RegExp(`^${category}$`, "i");
    if (tag) query.tags = { $in: [new RegExp(`^${tag}$`, "i")] };

    let blogs = await BlogPost.find(query).sort({ sortOrder: 1, publishedAt: -1, createdAt: -1 });

    if (!blogs || blogs.length === 0) {
      blogs = defaultBlogPosts as any;
    }

    return apiSuccess(blogs);
  } catch (error) {
    console.error("[Public Blogs GET Error]", error);
    return apiError("Failed to fetch blog posts", 500);
  }
}
