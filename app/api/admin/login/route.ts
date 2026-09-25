import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import { verifyPassword, createAuthToken, getAuthCookieOptions } from "@/lib/auth";
import { checkRateLimit, hashIp } from "@/lib/rate-limit";
import { adminLoginSchema } from "@/lib/validation";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting by IP
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown-ip";
    const ipIdentifier = `login-${hashIp(clientIp)}`;
    const rateLimit = checkRateLimit(ipIdentifier, { limit: 10, windowMs: 15 * 60 * 1000 });

    if (!rateLimit.success) {
      return apiError("Too many login attempts. Please try again later.", 429);
    }

    // 2. Validate input
    const body = await req.json();
    const parseResult = adminLoginSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid credentials provided.", 400);
    }

    const { email, password } = parseResult.data;

    // 3. Connect to Database
    const db = await connectToDatabase();
    if (!db.isConnected) {
      return apiError("Database connection failed. Please check server logs.", 500);
    }

    // 4. Find Admin User (constant-time verification to prevent timing attacks)
    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      // Still run hash compare dummy to mitigate timing attacks
      await verifyPassword(password, "$2a$12$e80yq9g6G5pQ6F8d8e57Uug0yYxZ.pB9QcR0VjN5aZ1sWkY/00000");
      return apiError("AUTHENTICATION FAILED", 401);
    }

    const isMatch = await verifyPassword(password, admin.passwordHash);
    if (!isMatch) {
      return apiError("AUTHENTICATION FAILED", 401);
    }

    // 5. Update last login
    admin.lastLoginAt = new Date();
    await admin.save();

    // 6. Generate JWT
    const token = await createAuthToken({
      userId: admin._id.toString(),
      email: admin.email,
    });

    const response = apiSuccess({
      email: admin.email,
      message: "Authentication successful",
    });

    // 7. Set secure HttpOnly cookie
    const cookieOpts = getAuthCookieOptions();
    response.cookies.set(cookieOpts.name, token, cookieOpts);

    return response;
  } catch (error) {
    console.error("[Login Error]", error);
    return apiError("Internal server error", 500);
  }
}
