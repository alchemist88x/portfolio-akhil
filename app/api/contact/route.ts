import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { contactMessageSchema } from "@/lib/validation";
import { checkRateLimit, hashIp } from "@/lib/rate-limit";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting: 5 requests per 10 minutes per IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";
    const hashed = hashIp(clientIp);
    const rateLimit = checkRateLimit(`contact-${hashed}`, { limit: 5, windowMs: 10 * 60 * 1000 });

    if (!rateLimit.success) {
      return apiError("Too many contact submissions from your address. Please wait a few minutes.", 429);
    }

    // 2. Body parsing and Zod validation
    let body;
    try {
      body = await req.json();
    } catch {
      return apiError("Malformed request payload.", 400);
    }

    const parseResult = contactMessageSchema.safeParse(body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Validation failed";
      return apiError(issue, 400);
    }

    const { name, email, message } = parseResult.data;

    // 3. Connect to MongoDB
    const db = await connectToDatabase();
    if (!db.isConnected) {
      return apiError("Unable to save message right now. Please reach out via email directly.", 500);
    }

    // 4. Save to Database
    const userAgent = req.headers.get("user-agent") || "";
    const contactRecord = await ContactMessage.create({
      name,
      email,
      message,
      status: "new",
      ipHash: hashed,
      userAgent: userAgent.slice(0, 255),
    });

    // 5. Optional Email Notification hook (non-blocking)
    if (process.env.CONTACT_NOTIFICATION_ENABLED === "true") {
      // In production, integrate nodemailer or sendgrid here.
      console.log(`[Notification] New contact message received from ${name} (${email}): ${message.slice(0, 50)}...`);
    }

    return apiSuccess(
      {
        id: contactRecord._id,
        message: "Message received. Akhil will review and respond promptly.",
      },
      201
    );
  } catch (error) {
    console.error("[Contact API Error]", error);
    return apiError("Internal server error while processing your message.", 500);
  }
}
