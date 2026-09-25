import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { defaultProjects } from "@/lib/initial-data";
import { apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) {
      return apiSuccess({
        projects: defaultProjects.filter((p) => p.published),
        dbConnected: false,
      });
    }

    const projects = await Project.find({ published: true }).sort({ sortOrder: 1 }).lean();

    return apiSuccess({
      projects: projects.length > 0 ? projects : defaultProjects.filter((p) => p.published),
      dbConnected: true,
    });
  } catch (error) {
    console.error("[Projects Public API Error]", error);
    return apiSuccess({
      projects: defaultProjects.filter((p) => p.published),
      dbConnected: false,
    });
  }
}
