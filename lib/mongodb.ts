import mongoose from "mongoose";
import dns from "dns";

if (typeof dns.setServers === "function") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
    // Ignore if not supported
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; error?: string }> {
  if (!MONGODB_URI) {
    return {
      isConnected: false,
      error: "MONGODB_URI is not defined in environment variables.",
    };
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return { isConnected: true };
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: true };
  } catch (error: unknown) {
    cached.promise = null;
    const msg = error instanceof Error ? error.message : "Database connection failed";
    console.error("[MongoDB] Connection error:", msg);
    return {
      isConnected: false,
      error: msg,
    };
  }
}

export default connectToDatabase;
