import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) {
      return apiError("Database connection failed", 500);
    }

    const admin = await AdminUser.findById(session.userId).select("-passwordHash");
    if (!admin) {
      return apiError("User not found", 404);
    }

    return apiSuccess({
      id: admin._id,
      email: admin.email,
      lastLoginAt: admin.lastLoginAt,
      createdAt: admin.createdAt,
    });
  } catch (error) {
    console.error("[Admin Me Error]", error);
    return apiError("Internal server error", 500);
  }
}
