import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TerminalCommand from "@/models/TerminalCommand";
import { terminalCommandSchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const commands = await TerminalCommand.find().sort({ sortOrder: 1 });
    return apiSuccess(commands);
  } catch (error) {
    console.error("[Terminal GET Error]", error);
    return apiError("Failed to fetch terminal commands", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = terminalCommandSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const existing = await TerminalCommand.findOne({ command: parseResult.data.command.toLowerCase().trim() });
    if (existing) {
      return apiError("Command already exists", 400);
    }

    const newCmd = await TerminalCommand.create({
      ...parseResult.data,
      command: parseResult.data.command.toLowerCase().trim(),
    });
    return apiSuccess(newCmd, 201);
  } catch (error) {
    console.error("[Terminal POST Error]", error);
    return apiError("Failed to create terminal command", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return apiError("ID is required", 400);

    const parseResult = terminalCommandSchema.safeParse(data);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const cmdLower = parseResult.data.command.toLowerCase().trim();
    const existing = await TerminalCommand.findOne({ command: cmdLower, _id: { $ne: id } });
    if (existing) {
      return apiError("Command name is already in use", 400);
    }

    const updated = await TerminalCommand.findByIdAndUpdate(
      id,
      { $set: { ...parseResult.data, command: cmdLower } },
      { new: true }
    );
    if (!updated) return apiError("Command not found", 404);

    return apiSuccess(updated);
  } catch (error) {
    console.error("[Terminal PUT Error]", error);
    return apiError("Failed to update terminal command", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const deleted = await TerminalCommand.findByIdAndDelete(id);
    if (!deleted) return apiError("Command not found", 404);

    return apiSuccess({ message: "Command deleted successfully" });
  } catch (error) {
    console.error("[Terminal DELETE Error]", error);
    return apiError("Failed to delete command", 500);
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
        TerminalCommand.findByIdAndUpdate(item.id, { $set: { sortOrder: item.sortOrder } })
      )
    );

    return apiSuccess({ message: "Commands reordered successfully" });
  } catch (error) {
    console.error("[Terminal PATCH Error]", error);
    return apiError("Failed to reorder commands", 500);
  }
}
