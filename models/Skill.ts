import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkill extends Document {
  categoryId: mongoose.Types.ObjectId | string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  level?: "Expert" | "Advanced" | "Working Knowledge" | "Familiar" | "";
  featured: boolean;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "SkillCategory", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    level: {
      type: String,
      enum: ["Expert", "Advanced", "Working Knowledge", "Familiar", ""],
      default: "",
    },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SkillSchema.index({ categoryId: 1, published: 1, sortOrder: 1 });

const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);

export default Skill;
