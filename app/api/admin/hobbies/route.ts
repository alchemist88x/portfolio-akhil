import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Hobby from "@/models/Hobby";
import { hobbySchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const hobbies = await Hobby.find().sort({ sortOrder: 1 });
    return apiSuccess(hobbies);
  } catch (error) {
    console.error("[Hobbies GET Error]", error);
    return apiError("Failed to fetch hobbies", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = hobbySchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const newHobby = await Hobby.create(parseResult.data);
    return apiSuccess(newHobby, 201);
  } catch (error) {
    console.error("[Hobbies POST Error]", error);
    return apiError("Failed to create hobby", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return apiError("ID is required", 400);

    const parseResult = hobbySchema.safeParse(data);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const updated = await Hobby.findByIdAndUpdate(id, { $set: parseResult.data }, { new: true });
    if (!updated) return apiError("Hobby not found", 404);

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Hobbies PUT Error]", error);
    return apiError("Failed to update hobby", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const deleted = await Hobby.findByIdAndDelete(id);
    if (!deleted) return apiError("Hobby not found", 404);

    return apiSuccess({ message: "Hobby deleted successfully" });
  } catch (error) {
    console.error("[Hobbies DELETE Error]", error);
    return apiError("Failed to delete hobby", 500);
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
        Hobby.findByIdAndUpdate(item.id, { $set: { sortOrder: item.sortOrder } })
      )
    );

    return apiSuccess({ message: "Hobbies reordered successfully" });
  } catch (error) {
    console.error("[Hobbies PATCH Error]", error);
    return apiError("Failed to reorder hobbies", 500);
  }
}
