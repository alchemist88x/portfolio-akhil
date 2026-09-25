import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SocialLink from "@/models/SocialLink";
import { socialLinkSchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const links = await SocialLink.find().sort({ sortOrder: 1 });
    return apiSuccess(links);
  } catch (error) {
    console.error("[Social GET Error]", error);
    return apiError("Failed to fetch social links", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = socialLinkSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const newLink = await SocialLink.create(parseResult.data);
    return apiSuccess(newLink, 201);
  } catch (error) {
    console.error("[Social POST Error]", error);
    return apiError("Failed to create social link", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return apiError("ID is required", 400);

    const parseResult = socialLinkSchema.safeParse(data);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const updated = await SocialLink.findByIdAndUpdate(id, { $set: parseResult.data }, { new: true });
    if (!updated) return apiError("Link not found", 404);

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Social PUT Error]", error);
    return apiError("Failed to update social link", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const deleted = await SocialLink.findByIdAndDelete(id);
    if (!deleted) return apiError("Link not found", 404);

    return apiSuccess({ message: "Social link deleted successfully" });
  } catch (error) {
    console.error("[Social DELETE Error]", error);
    return apiError("Failed to delete social link", 500);
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
        SocialLink.findByIdAndUpdate(item.id, { $set: { sortOrder: item.sortOrder } })
      )
    );

    return apiSuccess({ message: "Social links reordered successfully" });
  } catch (error) {
    console.error("[Social PATCH Error]", error);
    return apiError("Failed to reorder social links", 500);
  }
}
