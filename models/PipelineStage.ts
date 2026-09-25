import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPipelineStage extends Document {
  pipelineId: mongoose.Types.ObjectId | string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PipelineStageSchema = new Schema<IPipelineStage>(
  {
    pipelineId: { type: Schema.Types.ObjectId, ref: "Pipeline", required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PipelineStageSchema.index({ pipelineId: 1, published: 1, sortOrder: 1 });

const PipelineStage: Model<IPipelineStage> =
  mongoose.models.PipelineStage || mongoose.model<IPipelineStage>("PipelineStage", PipelineStageSchema);

export default PipelineStage;
