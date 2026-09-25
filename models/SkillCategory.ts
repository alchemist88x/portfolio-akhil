import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkillCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillCategorySchema = new Schema<ISkillCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SkillCategorySchema.index({ published: 1, sortOrder: 1 });

const SkillCategory: Model<ISkillCategory> =
  mongoose.models.SkillCategory || mongoose.model<ISkillCategory>("SkillCategory", SkillCategorySchema);

export default SkillCategory;
