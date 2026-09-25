import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SEOSettings from "@/models/SEOSettings";
import { seoSettingsSchema } from "@/lib/validation";
import { defaultSEOSettings } from "@/lib/initial-data";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    let seo = await SEOSettings.findOne();
    if (!seo) {
      seo = await SEOSettings.create(defaultSEOSettings);
    }

    return apiSuccess(seo);
  } catch (error) {
    console.error("[SEO GET Error]", error);
    return apiError("Failed to fetch SEO settings", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = seoSettingsSchema.safeParse(body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(issue, 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const updated = await SEOSettings.findOneAndUpdate(
      {},
      { $set: parseResult.data },
      { new: true, upsert: true }
    );

    return apiSuccess(updated);
  } catch (error) {
    console.error("[SEO PUT Error]", error);
    return apiError("Failed to update SEO settings", 500);
  }
}
