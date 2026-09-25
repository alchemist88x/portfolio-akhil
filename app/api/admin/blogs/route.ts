import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { blogPostSchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const blogs = await BlogPost.find().sort({ sortOrder: 1, publishedAt: -1, createdAt: -1 });
    return apiSuccess(blogs);
  } catch (error) {
    console.error("[Admin Blogs GET Error]", error);
    return apiError("Failed to fetch blog posts", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = blogPostSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    // Check slug uniqueness
    const existing = await BlogPost.findOne({ slug: parseResult.data.slug });
    if (existing) {
      return apiError("A blog post with this slug already exists", 400);
    }

    const newBlog = await BlogPost.create({
      ...parseResult.data,
      publishedAt: parseResult.data.publishedAt ? new Date(parseResult.data.publishedAt) : new Date(),
    });

    return apiSuccess(newBlog, 201);
  } catch (error) {
    console.error("[Admin Blogs POST Error]", error);
    return apiError("Failed to create blog post", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return apiError("Blog Post ID is required", 400);

    const parseResult = blogPostSchema.safeParse(data);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    // Check slug uniqueness excluding self
    const existing = await BlogPost.findOne({ slug: parseResult.data.slug, _id: { $ne: id } });
    if (existing) {
      return apiError("A blog post with this slug already exists", 400);
    }

    const updated = await BlogPost.findByIdAndUpdate(
      id,
      {
        $set: {
          ...parseResult.data,
          publishedAt: parseResult.data.publishedAt ? new Date(parseResult.data.publishedAt) : new Date(),
        },
      },
      { new: true }
    );

    if (!updated) return apiError("Blog post not found", 404);

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Admin Blogs PUT Error]", error);
    return apiError("Failed to update blog post", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Blog Post ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) return apiError("Blog post not found", 404);

    return apiSuccess({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("[Admin Blogs DELETE Error]", error);
    return apiError("Failed to delete blog post", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body.items)) return apiError("Invalid items payload", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    // Bulk update sort orders
    await Promise.all(
      body.items.map((item: { id: string; sortOrder: number }) =>
        BlogPost.findByIdAndUpdate(item.id, { $set: { sortOrder: item.sortOrder } })
      )
    );

    return apiSuccess({ message: "Blog posts reordered successfully" });
  } catch (error) {
    console.error("[Admin Blogs PATCH Error]", error);
    return apiError("Failed to reorder blog posts", 500);
  }
}
