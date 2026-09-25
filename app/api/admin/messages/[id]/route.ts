import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid message ID", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const message = await ContactMessage.findById(id);
    if (!message) return apiError("Message not found", 404);

    return apiSuccess(message);
  } catch (error) {
    console.error("[Message Detail Error]", error);
    return apiError("Failed to fetch message details", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid message ID", 400);
    }

    const body = await req.json();
    const { status } = body;
    if (!["new", "read", "archived"].includes(status)) {
      return apiError("Invalid status value", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const updated = await ContactMessage.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    if (!updated) return apiError("Message not found", 404);

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Message Status Update Error]", error);
    return apiError("Failed to update message status", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid message ID", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) return apiError("Message not found", 404);

    return apiSuccess({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("[Message Delete Error]", error);
    return apiError("Failed to delete message", 500);
  }
}
