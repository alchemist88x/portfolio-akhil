import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { defaultProjects } from "@/lib/initial-data";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await connectToDatabase();

    if (!db.isConnected) {
      // Find in fallback data
      const fallback = defaultProjects.find((p) => p.slug === id || p.slug === id.toLowerCase());
      if (fallback && fallback.published) {
        return apiSuccess(fallback);
      }
      return apiError("Project not found", 404);
    }

    const query: { published: boolean; [key: string]: unknown } = { published: true };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query.$or = [{ slug: id }, { _id: id }];
    } else {
      query.slug = id;
    }

    const project = await Project.findOne(query).lean();
    if (!project) {
      return apiError("Project not found", 404);
    }

    return apiSuccess(project);
  } catch (error) {
    console.error("[Project Detail API Error]", error);
    return apiError("Failed to fetch project details", 500);
  }
}
