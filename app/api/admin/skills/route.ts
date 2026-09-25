import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SkillCategory from "@/models/SkillCategory";
import Skill from "@/models/Skill";
import { skillCategorySchema, skillSchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const categories = await SkillCategory.find().sort({ sortOrder: 1 }).lean();
    const skills = await Skill.find().sort({ sortOrder: 1 }).lean();

    const categorizedData = categories.map((cat) => ({
      ...cat,
      skills: skills.filter((s) => s.categoryId.toString() === cat._id.toString()),
    }));

    return apiSuccess({
      categories: categorizedData,
      allSkills: skills,
    });
  } catch (error) {
    console.error("[Skills GET Error]", error);
    return apiError("Failed to fetch skills", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { entityType, ...data } = body; // entityType: "category" | "skill"

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    if (entityType === "category") {
      const parseResult = skillCategorySchema.safeParse(data);
      if (!parseResult.success) {
        return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
      }
      const newCat = await SkillCategory.create(parseResult.data);
      return apiSuccess(newCat, 201);
    } else if (entityType === "skill") {
      const parseResult = skillSchema.safeParse(data);
      if (!parseResult.success) {
        return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
      }
      const newSkill = await Skill.create(parseResult.data);
      return apiSuccess(newSkill, 201);
    }

    return apiError("Invalid entityType. Must be 'category' or 'skill'.", 400);
  } catch (error) {
    console.error("[Skills POST Error]", error);
    return apiError("Failed to create skill or category", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { entityType, id, ...data } = body;
    if (!id) return apiError("ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    if (entityType === "category") {
      const parseResult = skillCategorySchema.safeParse(data);
      if (!parseResult.success) {
        return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
      }
      const updated = await SkillCategory.findByIdAndUpdate(id, { $set: parseResult.data }, { new: true });
      if (!updated) return apiError("Category not found", 404);
      return apiSuccess(updated);
    } else if (entityType === "skill") {
      const parseResult = skillSchema.safeParse(data);
      if (!parseResult.success) {
        return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
      }
      const updated = await Skill.findByIdAndUpdate(id, { $set: parseResult.data }, { new: true });
      if (!updated) return apiError("Skill not found", 404);
      return apiSuccess(updated);
    }

    return apiError("Invalid entityType", 400);
  } catch (error) {
    console.error("[Skills PUT Error]", error);
    return apiError("Failed to update skill or category", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const entityType = searchParams.get("type"); // "category" | "skill"

    if (!id) return apiError("ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    if (entityType === "category") {
      await Skill.deleteMany({ categoryId: id });
      await SkillCategory.findByIdAndDelete(id);
      return apiSuccess({ message: "Category and associated skills deleted successfully" });
    } else if (entityType === "skill") {
      await Skill.findByIdAndDelete(id);
      return apiSuccess({ message: "Skill deleted successfully" });
    }

    return apiError("Invalid entityType", 400);
  } catch (error) {
    console.error("[Skills DELETE Error]", error);
    return apiError("Failed to delete", 500);
  }
}
