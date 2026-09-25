import { NextRequest } from "next/server";
import { getAdminSession, verifyPassword, hashPassword } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import { adminAccountSchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const parseResult = adminAccountSchema.safeParse(body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Invalid input";
      return apiError(issue, 400);
    }

    const { email, currentPassword, newPassword } = parseResult.data;

    const db = await connectToDatabase();
    if (!db.isConnected) {
      return apiError("Database connection failed", 500);
    }

    const admin = await AdminUser.findById(session.userId);
    if (!admin) {
      return apiError("Admin user not found", 404);
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return apiError("Current password is required to set a new password", 400);
      }
      const isMatch = await verifyPassword(currentPassword, admin.passwordHash);
      if (!isMatch) {
        return apiError("Current password verification failed", 400);
      }
      admin.passwordHash = await hashPassword(newPassword);
    }

    // If changing email, verify uniqueness
    if (email && email.toLowerCase() !== admin.email.toLowerCase()) {
      const existing = await AdminUser.findOne({
        email: email.toLowerCase(),
        _id: { $ne: admin._id },
      });
      if (existing) {
        return apiError("Email address is already in use", 400);
      }
      admin.email = email.toLowerCase();
    }

    await admin.save();

    return apiSuccess({
      message: "Admin account updated successfully",
      email: admin.email,
    });
  } catch (error) {
    console.error("[Account Update Error]", error);
    return apiError("Internal server error", 500);
  }
}
