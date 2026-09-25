import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import AboutSection from "@/models/AboutSection";
import { aboutSectionSchema } from "@/lib/validation";
import { defaultAboutSection } from "@/lib/initial-data";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) {
      return apiError("Database connection failed", 500);
    }

    let about = await AboutSection.findOne();
    if (!about) {
      about = await AboutSection.create(defaultAboutSection);
    }

    return apiSuccess(about);
  } catch (error) {
    console.error("[Admin About GET Error]", error);
    return apiError("Failed to fetch about data", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = aboutSectionSchema.safeParse(body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(issue, 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) {
      return apiError("Database connection failed", 500);
    }

    const updated = await AboutSection.findOneAndUpdate(
      {},
      { $set: parseResult.data },
      { new: true, upsert: true }
    );

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Admin About PUT Error]", error);
    return apiError("Failed to update about data", 500);
  }
}
