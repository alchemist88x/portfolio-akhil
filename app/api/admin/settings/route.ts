import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { siteSettingsSchema } from "@/lib/validation";
import { defaultSiteSettings } from "@/lib/initial-data";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) {
      return apiError("Database connection failed", 500);
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(defaultSiteSettings);
    }

    return apiSuccess(settings);
  } catch (error) {
    console.error("[Admin Settings GET Error]", error);
    return apiError("Failed to fetch settings", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = siteSettingsSchema.safeParse(body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(issue, 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) {
      return apiError("Database connection failed", 500);
    }

    const updated = await SiteSettings.findOneAndUpdate(
      {},
      { $set: parseResult.data },
      { new: true, upsert: true }
    );

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Admin Settings PUT Error]", error);
    return apiError("Failed to update settings", 500);
  }
}
