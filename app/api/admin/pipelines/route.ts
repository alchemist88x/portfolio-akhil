import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Pipeline from "@/models/Pipeline";
import PipelineStage from "@/models/PipelineStage";
import { pipelineSchema, pipelineStageSchema } from "@/lib/validation";
import { defaultPipeline } from "@/lib/initial-data";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    let pipeline = await Pipeline.findOne();
    if (!pipeline) {
      const createdPipe = await Pipeline.create({
        name: defaultPipeline.name,
        description: defaultPipeline.description,
        published: true,
      });
      pipeline = createdPipe;

      await Promise.all(
        defaultPipeline.stages.map((stage) =>
          PipelineStage.create({
            pipelineId: createdPipe._id,
            ...stage,
          })
        )
      );
    }

    const stages = await PipelineStage.find({ pipelineId: pipeline._id }).sort({ sortOrder: 1 });

    return apiSuccess({
      pipeline,
      stages,
    });
  } catch (error) {
    console.error("[Pipeline GET Error]", error);
    return apiError("Failed to fetch pipeline data", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = pipelineStageSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
    }

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const stage = await PipelineStage.create(parseResult.data);
    return apiSuccess(stage, 201);
  } catch (error) {
    console.error("[Pipeline Stage POST Error]", error);
    return apiError("Failed to create pipeline stage", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { entityType, id, ...data } = body;

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    if (entityType === "pipeline") {
      const parseResult = pipelineSchema.safeParse(data);
      if (!parseResult.success) {
        return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
      }
      const updated = await Pipeline.findOneAndUpdate({}, { $set: parseResult.data }, { new: true });
      return apiSuccess(updated);
    } else {
      if (!id) return apiError("Stage ID required", 400);
      const parseResult = pipelineStageSchema.safeParse(data);
      if (!parseResult.success) {
        return apiError(parseResult.error.issues[0]?.message || "Validation failed", 400);
      }
      const updated = await PipelineStage.findByIdAndUpdate(id, { $set: parseResult.data }, { new: true });
      return apiSuccess(updated);
    }
  } catch (error) {
    console.error("[Pipeline PUT Error]", error);
    return apiError("Failed to update pipeline", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Stage ID is required", 400);

    const db = await connectToDatabase();
    if (!db.isConnected) return apiError("Database connection failed", 500);

    const deleted = await PipelineStage.findByIdAndDelete(id);
    if (!deleted) return apiError("Stage not found", 404);

    return apiSuccess({ message: "Stage deleted successfully" });
  } catch (error) {
    console.error("[Pipeline DELETE Error]", error);
    return apiError("Failed to delete pipeline stage", 500);
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
        PipelineStage.findByIdAndUpdate(item.id, { $set: { sortOrder: item.sortOrder } })
      )
    );

    return apiSuccess({ message: "Stages reordered successfully" });
  } catch (error) {
    console.error("[Pipeline PATCH Error]", error);
    return apiError("Failed to reorder stages", 500);
  }
}
