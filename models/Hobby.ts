import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHobby extends Document {
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HobbySchema = new Schema<IHobby>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

HobbySchema.index({ published: 1, sortOrder: 1 });

const Hobby: Model<IHobby> =
  mongoose.models.Hobby || mongoose.model<IHobby>("Hobby", HobbySchema);

export default Hobby;
