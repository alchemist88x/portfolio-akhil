import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArchitecture extends Document {
  name: string;
  title: string;
  description?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArchitectureSchema = new Schema<IArchitecture>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ArchitectureSchema.index({ published: 1 });

const Architecture: Model<IArchitecture> =
  mongoose.models.Architecture || mongoose.model<IArchitecture>("Architecture", ArchitectureSchema);

export default Architecture;
