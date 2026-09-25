import connectToDatabase from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import Project from "@/models/Project";
import SkillCategory from "@/models/SkillCategory";
import Skill from "@/models/Skill";
import Experience from "@/models/Experience";
import BlogPost from "@/models/BlogPost";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) {
      return apiError("Database connection failed", 500);
    }

    const [
      totalMessages,
      newMessages,
      readMessages,
      archivedMessages,
      projectsCount,
      skillCategoriesCount,
      skillsCount,
      experienceCount,
      blogsCount,
    ] = await Promise.all([
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: "new" }),
      ContactMessage.countDocuments({ status: "read" }),
      ContactMessage.countDocuments({ status: "archived" }),
      Project.countDocuments(),
      SkillCategory.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      BlogPost.countDocuments(),
    ]);

    return apiSuccess({
      totalMessages,
      newMessages,
      readMessages,
      archivedMessages,
      projectsCount,
      skillCategoriesCount,
      skillsCount,
      experienceCount,
      blogsCount,
    });
  } catch (error) {
    console.error("[Admin Stats Error]", error);
    return apiError("Failed to fetch dashboard metrics", 500);
  }
}
