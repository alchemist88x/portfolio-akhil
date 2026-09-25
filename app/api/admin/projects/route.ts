import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { projectSchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const projects = await Project.find().sort({ sortOrder: 1, createdAt: -1 });
    return apiSuccess(projects);
  } catch (error) {
    console.error("[Admin Projects GET Error]", error);
    return apiError("Failed to fetch projects", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = projectSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    // Check slug uniqueness
    const existing = await Project.findOne({ slug: parseResult.data.slug });
    if (existing) {
      return apiError("A project with this slug already exists", 400);
    }

    const newProject = await Project.create(parseResult.data);
    return apiSuccess(newProject, 201);
  } catch (error) {
    console.error("[Admin Projects POST Error]", error);
    return apiError("Failed to create project", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return apiError("Project ID is required", 400);

    const parseResult = projectSchema.safeParse(data);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    // Check slug uniqueness excluding self
    const existing = await Project.findOne({ slug: parseResult.data.slug, _id: { $ne: id } });
    if (existing) {
      return apiError("A project with this slug already exists", 400);
    }

    const updated = await Project.findByIdAndUpdate(id, { $set: parseResult.data }, { new: true });
    if (!updated) return apiError("Project not found", 404);

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Admin Projects PUT Error]", error);
    return apiError("Failed to update project", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Project ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return apiError("Project not found", 404);

    return apiSuccess({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("[Admin Projects DELETE Error]", error);
    return apiError("Failed to delete project", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body.items)) return apiError("Invalid items payload", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    await Promise.all(
      body.items.map((item: { id: string; sortOrder: number }) =>
        Project.findByIdAndUpdate(item.id, { $set: { sortOrder: item.sortOrder } })
      )
    );

    return apiSuccess({ message: "Project order updated successfully" });
  } catch (error) {
    console.error("[Admin Projects PATCH Error]", error);
    return apiError("Failed to reorder projects", 500);
  }
}
