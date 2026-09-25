import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArchitectureNode extends Document {
  architectureId: mongoose.Types.ObjectId | string;
  name: string;
  type: string;
  description?: string;
  icon?: string;
  x: number;
  y: number;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArchitectureNodeSchema = new Schema<IArchitectureNode>(
  {
    architectureId: { type: Schema.Types.ObjectId, ref: "Architecture", required: true },
    name: { type: String, required: true },
    type: { type: String, default: "service" },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ArchitectureNodeSchema.index({ architectureId: 1, published: 1, sortOrder: 1 });

const ArchitectureNode: Model<IArchitectureNode> =
  mongoose.models.ArchitectureNode ||
  mongoose.model<IArchitectureNode>("ArchitectureNode", ArchitectureNodeSchema);

export default ArchitectureNode;
