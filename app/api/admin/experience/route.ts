import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { experienceSchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const experiences = await Experience.find().sort({ sortOrder: 1, startDate: -1 });
    return apiSuccess(experiences);
  } catch (error) {
    console.error("[Experience GET Error]", error);
    return apiError("Failed to fetch experiences", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = experienceSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const newExp = await Experience.create(parseResult.data);
    return apiSuccess(newExp, 201);
  } catch (error) {
    console.error("[Experience POST Error]", error);
    return apiError("Failed to create experience", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return apiError("Experience ID is required", 400);

    const parseResult = experienceSchema.safeParse(data);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const updated = await Experience.findByIdAndUpdate(id, { $set: parseResult.data }, { new: true });
    if (!updated) return apiError("Experience not found", 404);

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Experience PUT Error]", error);
    return apiError("Failed to update experience", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Experience ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const deleted = await Experience.findByIdAndDelete(id);
    if (!deleted) return apiError("Experience not found", 404);

    return apiSuccess({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("[Experience DELETE Error]", error);
    return apiError("Failed to delete experience", 500);
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
        Experience.findByIdAndUpdate(item.id, { $set: { sortOrder: item.sortOrder } })
      )
    );

    return apiSuccess({ message: "Experience order updated successfully" });
  } catch (error) {
    console.error("[Experience PATCH Error]", error);
    return apiError("Failed to reorder experiences", 500);
  }
}
