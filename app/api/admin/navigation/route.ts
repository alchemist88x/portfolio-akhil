import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import NavigationItem from "@/models/NavigationItem";
import { navigationItemSchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const items = await NavigationItem.find().sort({ sortOrder: 1 });
    return apiSuccess(items);
  } catch (error) {
    console.error("[Navigation GET Error]", error);
    return apiError("Failed to fetch navigation items", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = navigationItemSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const newItem = await NavigationItem.create(parseResult.data);
    return apiSuccess(newItem, 201);
  } catch (error) {
    console.error("[Navigation POST Error]", error);
    return apiError("Failed to create navigation item", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return apiError("Item ID is required", 400);

    const parseResult = navigationItemSchema.safeParse(data);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const updated = await NavigationItem.findByIdAndUpdate(id, { $set: parseResult.data }, { new: true });
    if (!updated) return apiError("Item not found", 404);

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Navigation PUT Error]", error);
    return apiError("Failed to update navigation item", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Item ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const deleted = await NavigationItem.findByIdAndDelete(id);
    if (!deleted) return apiError("Item not found", 404);

    return apiSuccess({ message: "Navigation item deleted successfully" });
  } catch (error) {
    console.error("[Navigation DELETE Error]", error);
    return apiError("Failed to delete navigation item", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    // Expect array of { id, sortOrder }
    if (!Array.isArray(body.items)) return apiError("Invalid items payload", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    await Promise.all(
      body.items.map((item: { id: string; sortOrder: number }) =>
        NavigationItem.findByIdAndUpdate(item.id, { $set: { sortOrder: item.sortOrder } })
      )
    );

    return apiSuccess({ message: "Order updated successfully" });
  } catch (error) {
    console.error("[Navigation PATCH Error]", error);
    return apiError("Failed to reorder navigation", 500);
  }
}
