import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPipeline extends Document {
  name: string;
  description?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PipelineSchema = new Schema<IPipeline>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PipelineSchema.index({ published: 1 });

const Pipeline: Model<IPipeline> =
  mongoose.models.Pipeline || mongoose.model<IPipeline>("Pipeline", PipelineSchema);

export default Pipeline;
