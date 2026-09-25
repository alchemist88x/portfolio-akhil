import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import EngineeringPrinciple from "@/models/EngineeringPrinciple";
import { engineeringPrincipleSchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const principles = await EngineeringPrinciple.find().sort({ sortOrder: 1 });
    return apiSuccess(principles);
  } catch (error) {
    console.error("[Principles GET Error]", error);
    return apiError("Failed to fetch engineering principles", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = engineeringPrincipleSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const newPrinciple = await EngineeringPrinciple.create(parseResult.data);
    return apiSuccess(newPrinciple, 201);
  } catch (error) {
    console.error("[Principles POST Error]", error);
    return apiError("Failed to create principle", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return apiError("ID is required", 400);

    const parseResult = engineeringPrincipleSchema.safeParse(data);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const updated = await EngineeringPrinciple.findByIdAndUpdate(id, { $set: parseResult.data }, { new: true });
    if (!updated) return apiError("Principle not found", 404);

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Principles PUT Error]", error);
    return apiError("Failed to update principle", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const deleted = await EngineeringPrinciple.findByIdAndDelete(id);
    if (!deleted) return apiError("Principle not found", 404);

    return apiSuccess({ message: "Principle deleted successfully" });
  } catch (error) {
    console.error("[Principles DELETE Error]", error);
    return apiError("Failed to delete principle", 500);
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
        EngineeringPrinciple.findByIdAndUpdate(item.id, { $set: { sortOrder: item.sortOrder } })
      )
    );

    return apiSuccess({ message: "Principles reordered successfully" });
  } catch (error) {
    console.error("[Principles PATCH Error]", error);
    return apiError("Failed to reorder principles", 500);
  }
}
