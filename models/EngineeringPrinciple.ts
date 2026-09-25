import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEngineeringPrinciple extends Document {
  number: string;
  title: string;
  description: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EngineeringPrincipleSchema = new Schema<IEngineeringPrinciple>(
  {
    number: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

EngineeringPrincipleSchema.index({ published: 1, sortOrder: 1 });

const EngineeringPrinciple: Model<IEngineeringPrinciple> =
  mongoose.models.EngineeringPrinciple ||
  mongoose.model<IEngineeringPrinciple>("EngineeringPrinciple", EngineeringPrincipleSchema);

export default EngineeringPrinciple;
