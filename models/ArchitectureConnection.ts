import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArchitectureConnection extends Document {
  architectureId: mongoose.Types.ObjectId | string;
  sourceNodeId: mongoose.Types.ObjectId | string;
  targetNodeId: mongoose.Types.ObjectId | string;
  label?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArchitectureConnectionSchema = new Schema<IArchitectureConnection>(
  {
    architectureId: { type: Schema.Types.ObjectId, ref: "Architecture", required: true },
    sourceNodeId: { type: Schema.Types.ObjectId, ref: "ArchitectureNode", required: true },
    targetNodeId: { type: Schema.Types.ObjectId, ref: "ArchitectureNode", required: true },
    label: { type: String, default: "" },
  },
  { timestamps: true }
);

ArchitectureConnectionSchema.index({ architectureId: 1 });

const ArchitectureConnection: Model<IArchitectureConnection> =
  mongoose.models.ArchitectureConnection ||
  mongoose.model<IArchitectureConnection>("ArchitectureConnection", ArchitectureConnectionSchema);

export default ArchitectureConnection;
