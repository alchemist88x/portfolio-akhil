import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Architecture from "@/models/Architecture";
import ArchitectureNode from "@/models/ArchitectureNode";
import ArchitectureConnection from "@/models/ArchitectureConnection";
import {
  architectureSchema,
  architectureNodeSchema,
  architectureConnectionSchema,
} from "@/lib/validation";
import { defaultArchitecture } from "@/lib/initial-data";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    let architecture = await Architecture.findOne();
    if (!architecture) {
      const createdArch = await Architecture.create({
        name: defaultArchitecture.name,
        title: defaultArchitecture.title,
        description: defaultArchitecture.description,
        published: true,
      });
      architecture = createdArch;

      const nodeDocs = await Promise.all(
        defaultArchitecture.nodes.map((node) =>
          ArchitectureNode.create({
            architectureId: createdArch._id,
            ...node,
          })
        )
      );

      await Promise.all(
        defaultArchitecture.connections.map((conn) =>
          ArchitectureConnection.create({
            architectureId: createdArch._id,
            sourceNodeId: nodeDocs[conn.sourceIndex]._id,
            targetNodeId: nodeDocs[conn.targetIndex]._id,
            label: conn.label,
          })
        )
      );
    }

    const archId = architecture._id;
    const [nodes, connections] = await Promise.all([
      ArchitectureNode.find({ architectureId: archId }).sort({ sortOrder: 1 }),
      ArchitectureConnection.find({ architectureId: archId }),
    ]);

    return apiSuccess({
      architecture,
      nodes,
      connections,
    });
  } catch (error) {
    console.error("[Architecture GET Error]", error);
    return apiError("Failed to fetch architecture data", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { entityType, ...data } = body; // "node" | "connection"

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    if (entityType === "node") {
      const parseResult = architectureNodeSchema.safeParse(data);
      if (!parseResult.success) {
        return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
      }
      const node = await ArchitectureNode.create(parseResult.data);
      return apiSuccess(node, 201);
    } else if (entityType === "connection") {
      const parseResult = architectureConnectionSchema.safeParse(data);
      if (!parseResult.success) {
        return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
      }
      const conn = await ArchitectureConnection.create(parseResult.data);
      return apiSuccess(conn, 201);
    }

    return apiError("Invalid entityType", 400);
  } catch (error) {
    console.error("[Architecture POST Error]", error);
    return apiError("Failed to add architecture element", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { entityType, id, ...data } = body;

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    if (entityType === "architecture") {
      const parseResult = architectureSchema.safeParse(data);
      if (!parseResult.success) {
        return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
      }
      const updated = await Architecture.findOneAndUpdate({}, { $set: parseResult.data }, { new: true });
      return apiSuccess(updated);
    } else if (entityType === "node") {
      if (!id) return apiError("Node ID required", 400);
      const parseResult = architectureNodeSchema.safeParse(data);
      if (!parseResult.success) {
        return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
      }
      const updated = await ArchitectureNode.findByIdAndUpdate(id, { $set: parseResult.data }, { new: true });
      return apiSuccess(updated);
    }

    return apiError("Invalid entityType", 400);
  } catch (error) {
    console.error("[Architecture PUT Error]", error);
    return apiError("Failed to update architecture", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const entityType = searchParams.get("type"); // "node" | "connection"

    if (!id) return apiError("ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    if (entityType === "node") {
      // Also delete connections touching this node
      await ArchitectureConnection.deleteMany({
        $or: [{ sourceNodeId: id }, { targetNodeId: id }],
      });
      await ArchitectureNode.findByIdAndDelete(id);
      return apiSuccess({ message: "Node and connected links removed successfully" });
    } else if (entityType === "connection") {
      await ArchitectureConnection.findByIdAndDelete(id);
      return apiSuccess({ message: "Connection removed successfully" });
    }

    return apiError("Invalid entityType", 400);
  } catch (error) {
    console.error("[Architecture DELETE Error]", error);
    return apiError("Failed to delete element", 500);
  }
}
