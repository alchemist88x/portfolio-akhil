import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search")?.trim() || "";

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const query: Record<string, unknown> = {};

    if (status !== "all" && ["new", "read", "archived"].includes(status)) {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");
      query.$or = [{ name: regex }, { email: regex }, { message: regex }];
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ContactMessage.countDocuments(query),
    ]);

    return apiSuccess({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("[Messages GET Error]", error);
    return apiError("Failed to fetch contact messages", 500);
  }
}
